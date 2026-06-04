'use client';

import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../lib/cartStore';


export default function CheckoutForm({ orderId }: { orderId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { clearCart } = useCartStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const submitPayment = async () => {
    if (!stripe || !elements) {
      setError("Pasarela de pago no está lista. Recarga la página.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setMessage(null);

    try {
      // ✅ Confirmar pago con Stripe
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // ✅ No intentes poner el pi=${paymentIntent.id} aquí. 
          // Stripe lo agregará automáticamente a la URL de redirección.
          return_url: `${window.location.origin}/order-confirmation?id=${orderId}`,
        },
        redirect: "if_required",
      });

      // Desestructuramos del resultado
      const { error: confirmError, paymentIntent } = result;

      // ✅ Manejar errores específicos
      if (confirmError) {
        if (confirmError.message?.includes("authentication_required")) {
          setMessage("Se requiere verificación adicional (3D Secure). Por favor, completa el desafío.");
          setIsProcessing(false);
          return;
        }

        setError(
          confirmError.message ||
          "Fallo al procesar el pago. Verifica tu tarjeta e intenta de nuevo."
        );
        setIsProcessing(false);
        return;
      }

      // ✅ Pago exitoso
      if (paymentIntent?.status === "succeeded") {
        setMessage("✅ Pago exitoso. Limpiando carrito y redirigiendo...");
        
        // 🔥 LIMPIAR EL CARRITO AQUÍ
        clearCart();
        
        setTimeout(() => {
          router.push(
            `/order-confirmation?id=${orderId}&payment_intent=${paymentIntent.id}&status=success`
          );
        }, 1500);
        return;
      }

      if (paymentIntent?.status === "processing") {
        setMessage("Pago en proceso. Espera o redirigiremos cuando se complete.");

        // ✅ Polling cada 2 segundos
        let attempts = 0;
        const pollInterval = setInterval(async () => {
          attempts++;
          try {
            const res = await fetch(`/api/orders/${orderId}/status`);
            const data = await res.json();

            if (data.paymentStatus === "SUCCEEDED") {
              clearInterval(pollInterval);
              router.push(`/order-confirmation?id=${orderId}&status=success`);
            }

            if (attempts >= 10) {
              clearInterval(pollInterval);
              setMessage("Pago en proceso. Revisa tu email para confirmar.");
            }
          } catch (err) {
            console.error("Error polling:", err);
          }
        }, 2000);
        return;
      }

      setError("Estado de pago desconocido. Contacta a soporte.");
      setIsProcessing(false);

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error desconocido. Intenta de nuevo.");
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitPayment();
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg space-y-4">
      {/* ✅ Mostrar errores */}
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          ❌ {error}
        </div>
      )}

      {/* ✅ Mostrar mensajes */}
      {message && (
        <div className="p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
          {message}
        </div>
      )}

      <PaymentElement />

      <button
        type="submit"
        disabled={isProcessing || !stripe || !elements}
        className={`w-full p-2 rounded text-white font-semibold ${isProcessing || !stripe
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
          }`}
      >
        {isProcessing ? "Procesando..." : "Pagar ahora"}
      </button>

      {/* ✅ Botón de reintentar si falló */}
      {error && !isProcessing && (
        <button
          type="button"
          onClick={() => {
            setError(null);
            void submitPayment();
          }}
          className="w-full p-2 rounded text-blue-600 border border-blue-600 hover:bg-blue-50"
        >
          Reintentar
        </button>
      )}
    </form>
  );
}