'use client';

import { useCartStore } from '../lib/cartStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const router = useRouter();
  const { items, removeFromCart, increaseQuantity, decreaseQuantity, totalPrice, isEmpty } = useCartStore();

  // Si el carrito está vacío
  if (isEmpty()) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
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

        {/* Carrito Vacío */}
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <div className="bg-white rounded-3xl p-12 shadow-lg">
            <div className="text-7xl mb-6">🛒</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h1>
            <p className="text-lg text-gray-600 mb-8">No has añadido ningún producto aún. ¡Explora nuestro catálogo!</p>
            
            <Link
              href="/productos"
              className="inline-block bg-[#003087] text-white px-8 py-4 rounded-2xl font-semibold hover:bg-[#002266] transition"
            >
              Explorar Productos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Carrito con productos
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
            <Link href="/productos" className="text-[#00A3E0] transition-colors">Productos</Link>
            <Link href="/about" className="hover:text-[#00A3E0] transition-colors">Nosotros</Link>
            <Link href="/contacto" className="hover:text-[#00A3E0] transition-colors">Contacto</Link>
          </nav>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-[#003087]">Inicio</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Mi Carrito</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-12">Mi Carrito</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lado izquierdo: Productos */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition"
                >
                  <div className="flex gap-6">
                    {/* Icono del producto */}
                    <div className="w-24 h-24 bg-gradient-to-br from-[#003087] to-[#00A3E0] rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-5xl">🐟</span>
                    </div>

                    {/* Información del producto */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-500">{item.presentation}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-700 font-medium text-sm"
                        >
                          ✕ Eliminar
                        </button>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <p className="text-2xl font-bold text-[#003087]">
                          ${(item.price * item.quantity).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </p>

                        {/* Controles de cantidad */}
                        <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                          <button
                            onClick={() => decreaseQuantity(item.id)}
                            className="w-10 h-10 flex items-center justify-center hover:bg-gray-200 rounded transition"
                          >
                            −
                          </button>
                          <span className="w-8 text-center font-bold text-gray-900">{item.quantity}</span>
                          <button
                            onClick={() => increaseQuantity(item.id)}
                            className="w-10 h-10 flex items-center justify-center hover:bg-gray-200 rounded transition"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link
                href="/productos"
                className="inline-flex items-center gap-2 text-[#003087] hover:text-[#002266] font-semibold transition"
              >
                ← Seguir comprando
              </Link>
            </div>
          </div>

          {/* Lado derecho: Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-8 shadow-lg sticky top-32 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Resumen del Pedido</h2>

              {/* Items list summary */}
              <div className="space-y-3 mb-6 pb-6 border-b">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.name} x{item.quantity}</span>
                    <span className="font-medium text-gray-900">
                      ${(item.price * item.quantity).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>

              {/* Costos */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${totalPrice().toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Envío</span>
                  <span className="text-green-600 font-medium">Gratis</span>
                </div>
                <div className="flex justify-between text-lg font-bold bg-blue-50 p-4 rounded-lg">
                  <span>Total</span>
                  <span className="text-[#00A3E0]">
                    ${totalPrice().toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                  </span>
                </div>
              </div>

              {/* Botones */}
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full bg-[#003087] text-white py-4 rounded-xl font-semibold hover:bg-[#002266] transition active:scale-95"
                >
                  Finalizar Compra
                </button>
                <button
                  onClick={() => router.push('/productos')}
                  className="w-full bg-gray-100 text-gray-900 py-4 rounded-xl font-semibold hover:bg-gray-200 transition"
                >
                  Seguir Comprando
                </button>
              </div>

              {/* Información de seguridad */}
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-xs text-green-700 text-center">
                ✅ Pago seguro con Stripe
                <br />
                🔒 Tu información está protegida
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}