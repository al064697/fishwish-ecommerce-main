'use client';

import { useState, useEffect, Suspense } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useSearchParams } from 'next/navigation';
import CheckoutForm from '../payment/CheckoutForm';
import { useCartStore } from '../lib/cartStore';
import Link from 'next/link';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// 1. Componente interno con lógica de checkout
function CheckoutContent() {
  const [clientSecret, setClientSecret] = useState("");
  const { items, totalPrice } = useCartStore();
  
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || "ORD-GENERICA"; 

  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_ORDER_URL || 'http://localhost:8084';

    fetch(`${backendUrl}/api/payments/create-intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        amount: Math.round(totalPrice() * 100), // Convertir a centavos
        orderId: orderId 
      }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
      .catch((err) => console.error("Error al obtener el intent:", err));
  }, [orderId, totalPrice]);

  const appearance = { theme: 'flat' as const };
  const options = { clientSecret, appearance };

  // Si el carrito está vacío
  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold mb-4">Carrito vacío</h2>
        <p className="text-gray-600 mb-6">No hay productos para procesar el pago.</p>
        <Link 
          href="/productos" 
          className="inline-block bg-[#003087] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#002266]"
        >
          Volver a productos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Lado izquierdo: Formulario de pago */}
        <div className="md:col-span-2">
          <div className="p-6 shadow-xl rounded-xl bg-white">
            <h1 className="text-2xl font-bold mb-6">Finalizar Compra</h1>
            
            {clientSecret ? (
              <Elements options={options} stripe={stripePromise}>
                <CheckoutForm orderId={orderId} />
              </Elements>
            ) : (
              <div className="flex justify-center py-8">
                <div className="animate-spin">
                  <svg className="h-8 w-8 text-[#00A3E0]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <p className="ml-3">Cargando pasarela segura...</p>
              </div>
            )}
          </div>
        </div>

        {/* Lado derecho: Resumen del pedido */}
        <div className="md:col-span-1">
          <div className="p-6 shadow-xl rounded-xl bg-white sticky top-24">
            <h2 className="text-xl font-bold mb-6">Resumen del Pedido</h2>
            
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between border-b pb-3">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.presentation}</p>
                    <p className="text-sm text-gray-600">x{item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">
                      ${(item.price * item.quantity).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t-2 pt-4">
              <div className="flex justify-between mb-4">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${totalPrice().toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
              </div>
              
              <div className="flex justify-between mb-4">
                <span className="text-gray-600">Envío</span>
                <span className="text-green-600 font-medium">Gratis</span>
              </div>

              <div className="flex justify-between text-lg font-bold bg-blue-50 p-4 rounded-lg">
                <span>Total</span>
                <span className="text-[#00A3E0]">${totalPrice().toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-xs text-green-700">
              ✅ Pago seguro con Stripe
              <br />
              🔒 Tu información está protegida
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. El export principal solo envuelve al contenido en el "límite" de Suspense
export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="max-w-md mx-auto mt-10 p-6 text-center">
        <p>Cargando información de pago...</p>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}