'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '../app/lib/cartStore';

interface Order {
  id: number;
  customerName: string;
  totalAmount: number;
  status: string;
  orderDate: string;
  items: Array<{
    productName: string;
    presentation: string;
    price: number;
    quantity: number;
  }>;
}

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCartStore();
  const orderId = searchParams.get('id');

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      router.push('/cart');
      return;
    }

    // 🔥 LIMPIAR EL CARRITO COMO MEDIDA ADICIONAL DE SEGURIDAD
    clearCart();

    // Por ahora mostramos datos simulados (más adelante podemos traerlos del backend)
    setOrder({
      id: parseInt(orderId),
      customerName: "Cliente FishWish",
      totalAmount: 0, // se actualizará con datos reales después
      status: "CONFIRMADO",
      orderDate: new Date().toLocaleDateString('es-MX'),
      items: [] // se llenará desde el carrito si queremos
    });
    setLoading(false);
  }, [orderId, router, clearCart]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando confirmación...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-6 text-center">
        {/* Icono de éxito */}
        <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-6xl mb-8">
          ✅
        </div>

        <h1 className="text-5xl font-bold text-gray-900 mb-2">¡Pedido confirmado!</h1>
        <p className="text-xl text-green-600 mb-8">Gracias por comprar en FishWish 🐟</p>

        <div className="bg-white rounded-3xl p-8 shadow-sm text-left">
          <div className="flex justify-between items-center border-b pb-6 mb-6">
            <div>
              <p className="text-sm text-gray-500">Número de pedido</p>
              <p className="text-3xl font-bold text-[#003087]">#{order?.id}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Estado</p>
              <span className="inline-block bg-green-100 text-green-700 px-5 py-1 rounded-2xl text-sm font-medium">
                {order?.status}
              </span>
            </div>
          </div>

          <div className="text-center mb-8">
            <p className="text-sm text-gray-500">Total pagado</p>
            <p className="text-5xl font-bold text-[#00A3E0]">
              ${order?.totalAmount || '---'} MXN
            </p>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500">Fecha del pedido</p>
            <p className="font-medium">{order?.orderDate}</p>
          </div>
        </div>

        <div className="mt-12 space-y-4">
          <Link
            href="/"
            className="block w-full bg-[#003087] text-white py-5 rounded-2xl font-semibold text-lg hover:bg-[#002266] transition"
          >
            Volver a la tienda
          </Link>

          <button
            onClick={() => router.push('/cart')}
            className="block w-full border border-gray-300 py-5 rounded-2xl font-semibold text-lg hover:bg-gray-50 transition"
          >
            Ver mis pedidos
          </button>
        </div>

        <p className="mt-10 text-xs text-gray-400">
          Recibirás un correo de confirmación en breve
        </p>
      </div>
    </div>
  );
}