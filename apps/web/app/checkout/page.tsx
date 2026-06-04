'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { useCartStore } from '../lib/cartStore';

type CheckoutForm = {
  customerName: string;
  address: string;
  city: string;
  phone: string;
};

const validateCheckoutForm = (form: CheckoutForm) => {
  const customerName = form.customerName.trim();
  const address = form.address.trim();
  const city = form.city.trim();
  const phone = form.phone.trim();
  const phoneDigits = phone.replace(/\D/g, '');

  if (customerName.length < 3) return 'Escribe el nombre completo del cliente.';
  if (address.length < 5) return 'Escribe una direccion de entrega mas completa.';
  if (city.length < 3) return 'Escribe la ciudad de entrega.';
  if (phoneDigits.length < 10) return 'Escribe un telefono valido de al menos 10 digitos.';

  return null;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const [form, setForm] = useState<CheckoutForm>({
    customerName: '',
    address: '',
    city: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = (field: keyof CheckoutForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submitOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    if (items.length === 0) {
      router.push('/cart');
      return;
    }

    const validationError = validateCheckoutForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_ORDER_URL || 'http://localhost:8082';
      const orderTotal = totalPrice();
      const orderPayload = {
        customerName: form.customerName.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        phone: form.phone.trim(),
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      };

      const response = await fetch(`${backendUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'No se pudo crear el pedido. Revisa el stock o intenta de nuevo.');
      }

      const savedOrder = await response.json();
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(
          'fishwish-last-order',
          JSON.stringify({
            id: savedOrder.id,
            customerName: orderPayload.customerName,
            total: orderTotal,
            items: items.map((item) => ({
              id: item.id,
              name: item.name,
              presentation: item.presentation,
              price: item.price,
              quantity: item.quantity,
            })),
          })
        );
      }
      clearCart();
      router.push(`/order-confirmation?id=${savedOrder.id}&total=${orderTotal}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo crear el pedido. Verifica que el servidor de ordenes este encendido.'
      );
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Tu carrito está vacío</h1>
          <p className="text-gray-600 mb-6">Agrega productos antes de finalizar tu compra.</p>
          <Link
            href="/productos"
            className="inline-block bg-[#003087] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#002266] transition"
          >
            Ver productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#003087] text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-inner">
              🐟
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tighter">FishWish</h1>
              <p className="text-xs opacity-90">Snacks naturales • Campeche</p>
            </div>
          </Link>
          <nav className="hidden md:flex gap-8 text-sm font-medium">
            <Link href="/" className="hover:text-[#00A3E0] transition-colors">Inicio</Link>
            <Link href="/productos" className="hover:text-[#00A3E0] transition-colors">Productos</Link>
            <Link href="/about" className="hover:text-[#00A3E0] transition-colors">Nosotros</Link>
            <Link href="/contacto" className="hover:text-[#00A3E0] transition-colors">Contacto</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link href="/cart" className="text-[#003087] hover:text-[#002266] font-semibold">
            ← Volver al carrito
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Finalizar compra</h1>
            <p className="text-gray-600 mb-8">Ingresa tus datos de entrega para registrar el pedido.</p>

            {error && (
              <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={submitOrder} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="customerName">
                  Nombre completo
                </label>
                <input
                  id="customerName"
                  required
                  minLength={3}
                  autoComplete="name"
                  value={form.customerName}
                  onChange={(event) => updateField('customerName', event.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#00A3E0] focus:ring-2 focus:ring-[#00A3E0]/20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="address">
                  Dirección
                </label>
                <input
                  id="address"
                  required
                  minLength={5}
                  autoComplete="street-address"
                  value={form.address}
                  onChange={(event) => updateField('address', event.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#00A3E0] focus:ring-2 focus:ring-[#00A3E0]/20"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="city">
                    Ciudad
                  </label>
                  <input
                    id="city"
                    required
                    minLength={3}
                    autoComplete="address-level2"
                    value={form.city}
                    onChange={(event) => updateField('city', event.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#00A3E0] focus:ring-2 focus:ring-[#00A3E0]/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="phone">
                    Teléfono
                  </label>
                  <input
                    id="phone"
                    required
                    minLength={10}
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="10 digitos"
                    value={form.phone}
                    onChange={(event) => updateField('phone', event.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#00A3E0] focus:ring-2 focus:ring-[#00A3E0]/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#003087] text-white py-4 rounded-xl font-semibold hover:bg-[#002266] disabled:bg-gray-400 disabled:cursor-not-allowed transition"
              >
                {isSubmitting ? 'Procesando pedido...' : 'Registrar pedido'}
              </button>
              <p className="text-center text-xs text-gray-500">
                Al registrar el pedido, apartamos el stock y nos pondremos en contacto para confirmar la entrega.
              </p>
            </form>
          </section>

          <aside className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-fit lg:sticky lg:top-32">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Resumen</h2>
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between gap-4 border-b border-gray-100 pb-4">
                  <div>
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.presentation}</p>
                    <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-900 whitespace-nowrap">
                    ${(item.price * item.quantity).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-lg font-bold bg-blue-50 p-4 rounded-xl">
              <span>Total</span>
              <span className="text-[#00A3E0]">
                ${totalPrice().toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
              </span>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
