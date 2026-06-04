package com.fishwish.order.payment.stripe;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import com.stripe.Stripe;

import jakarta.annotation.PostConstruct;

/**
 * 🔐 Configuración de Stripe API
 * Inicializa la clave secreta de Stripe desde variables de entorno
 */
@Configuration
public class StripeConfig {

    // Lee la clave secreta de application.yml (que lee de ${STRIPE_SECRET_KEY})
    // Usa valor por defecto vacío si no existe para evitar crashes en inicialización
    @Value("${payment.stripe.secret-key:}")
    private String secretKey;

    // Lee la clave pública para información (opcional)
    @Value("${payment.stripe.public-key:}")
    private String publicKey;

    @PostConstruct
    public void init() {
        // ✅ Si la clave está vacía, solo logear warning (no crashear la app)
        if (secretKey == null || secretKey.trim().isEmpty()) {
            System.out.println("⚠️  WARNING: STRIPE_SECRET_KEY no configurada.");
            System.out.println("   Los pagos con Stripe no funcionarán hasta que se configure.");
            System.out.println("   En Railway: Agrega la variable de entorno STRIPE_SECRET_KEY");
            System.out.println("   En local: Agrega payment.stripe.secret-key en application.yml");
            return;  // No crashear, solo retornar
        }

        // ✅ Validar formato de clave secreta (debe empezar con sk_)
        if (!secretKey.startsWith("sk_")) {
            System.out.println("⚠️  WARNING: STRIPE_SECRET_KEY no tiene el formato correcto.");
            System.out.println("   Debe empezar con 'sk_' (clave secreta)");
            System.out.println("   Clave detectada: " + secretKey.substring(0, Math.min(10, secretKey.length())) + "...");
            return;  // No crashear, solo retornar
        }

        // ✅ Configurar Stripe con la clave secreta
        Stripe.apiKey = secretKey;

        System.out.println("✅ Stripe configurado correctamente");
        System.out.println("   Clave secreta: " + secretKey.substring(0, 10) + "...");
        if (publicKey != null && !publicKey.isEmpty()) {
            System.out.println("   Clave pública: " + publicKey.substring(0, 10) + "...");
        }
    }
}