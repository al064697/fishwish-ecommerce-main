package com.fishwish.order.payment.stripe;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.net.Webhook;
import com.stripe.exception.SignatureVerificationException;
import com.fishwish.order.service.OrderService;

@RestController
@RequestMapping("/api/payments/webhooks")
public class StripeWebhookController {

    @Value("${payment.stripe.webhook-secret}")
    private String endpointSecret;
    
    @Autowired
    private OrderService orderService;

    @PostMapping("/stripe")
    public ResponseEntity<String> handleStripeEvent(
        @RequestBody String payload,
        @RequestHeader("Stripe-Signature") String sigHeader
    ) {
        try {
            // 1. ✅ Validar firma del webhook
            Event event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
            
            System.out.println("🔔 Webhook recibido: " + event.getType());

            // 2. Procesar eventos
            if ("payment_intent.succeeded".equals(event.getType())) {
                handlePaymentSucceeded(event);
            } 
            else if ("payment_intent.payment_failed".equals(event.getType())) {
                handlePaymentFailed(event);
            }
            else if ("payment_intent.canceled".equals(event.getType())) {
                handlePaymentCanceled(event);
            }

            // 3. Retornar 200 OK para Stripe
            return ResponseEntity.ok("Webhook procesado");
            
        } catch (SignatureVerificationException e) {
            System.err.println("⚠️ Firma webhook inválida: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Signature verification failed");
        } 
        catch (Exception e) {
            System.err.println("❌ Error procesando webhook: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.OK).body("Webhook procesado con error (reintentará)");
        }
    }

    private void handlePaymentSucceeded(Event event) throws Exception {
        PaymentIntent intent = (PaymentIntent) event.getDataObjectDeserializer().getObject().orElseThrow();
        String paymentIntentId = intent.getId();
        orderService.confirmPaidOrder(paymentIntentId);

        System.out.println("✅ Orden confirmada por pago: " + paymentIntentId);
        
        // TODO: Aquí podrías:
        // - Enviar email confirmación
        // - Decrementar stock
        // - Generar factura
        // - Notificar almacén
    }

    private void handlePaymentFailed(Event event) throws Exception {
        PaymentIntent intent = (PaymentIntent) event.getDataObjectDeserializer().getObject().orElseThrow();
        String errorMsg = intent.getLastPaymentError() != null ? 
            intent.getLastPaymentError().getMessage() : "Pago rechazado";

        orderService.markPaymentFailed(intent.getId(), errorMsg);

        System.out.println("❌ Pago fallido para PaymentIntent " + intent.getId() + ": " + errorMsg);
    }

    private void handlePaymentCanceled(Event event) throws Exception {
        PaymentIntent intent = (PaymentIntent) event.getDataObjectDeserializer().getObject().orElseThrow();
        orderService.markPaymentCanceled(intent.getId());

        System.out.println("⏹️ Pago cancelado para PaymentIntent " + intent.getId());
    }
}