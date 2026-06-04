package com.fishwish.order.payment.stripe;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fishwish.order.model.Order;
import com.fishwish.order.repository.OrderRepository;
import com.fishwish.order.service.OrderService;
import com.stripe.model.PaymentIntent;

/**
 * 💳 PaymentController - Maneja créación de PaymentIntents para Stripe
 * 
 * Endpoint: POST /api/payments/create-intent
 * Body: { "orderId": 123, "amount": 50 }
 * Response: { "clientSecret": "pi_xxx_secret", "paymentIntentId": "pi_xxx" }
 */
@RestController
@RequestMapping("/api/payments")
@CrossOrigin(
    origins = {"http://localhost:3000", "https://fishwish-ecommerce-web-five.vercel.app"},
    methods = {org.springframework.web.bind.annotation.RequestMethod.GET, 
               org.springframework.web.bind.annotation.RequestMethod.POST, 
               org.springframework.web.bind.annotation.RequestMethod.OPTIONS},
    allowedHeaders = {"*"},
    allowCredentials = "true",
    maxAge = 3600
)
public class PaymentController {

    @Autowired
    private StripeService stripeService;
    
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderService orderService;

    @Value("${payment.stripe.secret-key:}")
    private String stripeSecretKey;

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(
        @RequestBody Order orderDraft,
        @RequestHeader(value = "Origin", required = false) String origin
    ) {
        System.out.println("\n📍 ===== POST /api/payments/checkout =====");
        System.out.println("🌐 Origin: " + origin);
        System.out.println("📦 Orden recibida: " + orderDraft);

        try {
            ensureStripeConfigured();

            Order order = orderService.createPendingOrder(orderDraft);
            Long amountInCents = Math.round(order.getTotalAmount() * 100);

            System.out.println("✅ Orden pendiente creada: ID=" + order.getId() + ", total=$" + order.getTotalAmount());
            System.out.println("🔄 Creando PaymentIntent en Stripe con " + amountInCents + " centavos...");

            PaymentIntent intent = stripeService.createPaymentIntent(amountInCents, order.getId().toString());

            order.setStripePaymentIntentId(intent.getId());
            order.setPaymentStatus("PENDING");
            orderRepository.save(order);

            Map<String, Object> response = new HashMap<>();
            response.put("orderId", order.getId());
            response.put("clientSecret", intent.getClientSecret());
            response.put("paymentIntentId", intent.getId());
            response.put("amount", amountInCents);
            response.put("currency", "mxn");
            response.put("status", intent.getStatus());

            System.out.println("✅ Checkout listo para confirmar pago");
            System.out.println("===== FIN /api/payments/checkout ===== \n");

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (IllegalStateException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(503).body(errorResponse);
        } catch (Exception e) {
            String error = "Error procesando checkout: " + e.getMessage();
            System.out.println("❌ ERROR CRÍTICO: " + error);
            e.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", error);
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    @PostMapping("/create-intent")
    public ResponseEntity<?> createIntent(
        @RequestBody Map<String, Object> data,
        @RequestHeader(value = "Origin", required = false) String origin
    ) {
        System.out.println("\n📍 ===== POST /api/payments/create-intent =====");
        System.out.println("🌐 Origin: " + origin);
        System.out.println("📦 Data recibido: " + data);

        try {
            ensureStripeConfigured();

            // 1. Extraer datos del frontend
            String orderIdStr = data.get("orderId").toString();
            Long orderId = Long.parseLong(orderIdStr);

            Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("La orden " + orderId + " no existe."));

            System.out.println("✅ Orden encontrada en BD: " + order.getId() + " - Total: $" + order.getTotalAmount());

            Long amountInCents = Math.round(order.getTotalAmount() * 100);

            // 2. Crear PaymentIntent en Stripe usando el monto calculado por el servidor
            System.out.println("🔄 Creando PaymentIntent en Stripe...");
            PaymentIntent intent = stripeService.createPaymentIntent(amountInCents, order.getId().toString());
            
            System.out.println("✅ PaymentIntent creado: " + intent.getId());
            
            // 5. ✅ GUARDAR en BD (CRÍTICO)
            order.setStripePaymentIntentId(intent.getId());
            order.setPaymentStatus("PENDING");
            orderRepository.save(order);
            
            System.out.println("💾 PaymentIntent guardado en BD para Orden " + order.getId());
            
            // 6. Retornar al frontend
            Map<String, Object> response = new HashMap<>();
            response.put("orderId", order.getId());
            response.put("clientSecret", intent.getClientSecret());
            response.put("paymentIntentId", intent.getId());
            response.put("amount", amountInCents);
            response.put("currency", "mxn");
            response.put("status", intent.getStatus());
            
            System.out.println("✅ Respuesta enviada al frontend");
            System.out.println("===== FIN /api/payments/create-intent ===== \n");
            
            return ResponseEntity.ok(response);
            
        } catch (NumberFormatException e) {
            String error = "Formato de datos inválido: " + e.getMessage();
            System.out.println("❌ ERROR: " + error);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", error);
            return ResponseEntity.badRequest().body(errorResponse);
            
        } catch (IllegalArgumentException e) {
            String error = e.getMessage();
            System.out.println("❌ ERROR: " + error);
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", error);
            return ResponseEntity.badRequest().body(errorResponse);
            
        } catch (Exception e) {
            String error = "Error procesando pago: " + e.getMessage();
            System.out.println("❌ ERROR CRÍTICO: " + error);
            e.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", error);
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    private void ensureStripeConfigured() {
        if (stripeSecretKey == null || stripeSecretKey.trim().isEmpty()) {
            throw new IllegalStateException("STRIPE_SECRET_KEY no está configurada. Agrega la clave secreta para habilitar cobros reales.");
        }
    }
}