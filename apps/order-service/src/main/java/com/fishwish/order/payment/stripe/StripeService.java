package com.fishwish.order.payment.stripe;

import org.springframework.stereotype.Service;

import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;

@Service
public class StripeService {

    /**
     * Crear un PaymentIntent en Stripe
     * @param amountInCents Monto en centavos (ej: 5000 = $50.00 MXN)
     * @param orderId ID de la orden para tracking
     * @return PaymentIntent creado en Stripe
     */
    public PaymentIntent createPaymentIntent(Long amountInCents, String orderId) throws Exception {
        if (Stripe.apiKey == null || Stripe.apiKey.trim().isEmpty()) {
            throw new IllegalStateException("STRIPE_SECRET_KEY no está configurada.");
        }

        // ✅ Validar montos
        if (amountInCents == null || amountInCents < 100) {
            throw new IllegalArgumentException("Monto mínimo: 100 centavos ($1.00 MXN)");
        }
        if (amountInCents > 999999999) {  // 9,999,999.99 MXN
            throw new IllegalArgumentException("Monto máximo excedido");
        }

        // Configurar parámetros del PaymentIntent
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
            .setAmount(amountInCents)  // ✅ Centavos (Stripe native)
            .setCurrency("mxn")
            .setAutomaticPaymentMethods(
                PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                    .setEnabled(true)
                    .build()
            )
            // ✅ METADATA: Guardar orderId para webhook
            .putMetadata("order_id", orderId)
            .build();

        // Crear en Stripe
        PaymentIntent intent = PaymentIntent.create(params);
        
        System.out.println("✅ PaymentIntent creado: " + intent.getId() + 
                          " para Orden: " + orderId);
        
        return intent;
    }
}