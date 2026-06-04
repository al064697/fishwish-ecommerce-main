'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useCartStore } from '../lib/cartStore';
import CartModal from '../../components/ui/CartModal';

export default function ContactoPage() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { totalItems, totalPrice } = useCartStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular envío
    toast.success('¡Mensaje enviado correctamente! Nos pondremos en contacto pronto.');
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      {/* HEADER */}
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
            <Link href="/impacto" className="hover:text-[#00A3E0] transition-colors">Impacto</Link>
            <Link href="/contacto" className="text-[#00A3E0] transition-colors">Contacto</Link>
          </nav>

          <button 
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-3 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-2xl transition-all"
          >
            <span className="text-2xl">🛒</span>
            <div className="text-left">
              <div className="text-sm font-medium">Carrito</div>
              <div className="text-xs opacity-75">
                {totalItems()} productos • ${totalPrice()}
              </div>
            </div>
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="bg-gray-100 py-16 text-center border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-5xl font-bold mb-4 text-[#003087]">Contáctanos</h1>
          <p className="text-xl text-gray-600">
            ¿Tienes dudas, sugerencias o quieres distribuir FishWish? Escríbenos.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-6xl mx-auto px-6 py-20 flex-grow">
        <div className="grid md:grid-cols-2 gap-16">
          
          {/* Info Cards */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Información de la empresa</h2>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-start gap-6">
              <div className="text-4xl">📍</div>
              <div>
                <h3 className="font-bold text-xl text-[#003087] mb-2">Ubicación</h3>
                <p className="text-gray-600">Puerto de Lerma<br/>San Francisco de Campeche, Campeche, México</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-start gap-6">
              <div className="text-4xl">✉️</div>
              <div>
                <h3 className="font-bold text-xl text-[#003087] mb-2">Correo Electrónico</h3>
                <p className="text-gray-600">hola@fishwish.com.mx</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-start gap-6">
              <div className="text-4xl">📱</div>
              <div>
                <h3 className="font-bold text-xl text-[#003087] mb-2">Teléfono</h3>
                <p className="text-gray-600">+52 (981) 123 4567</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-10 rounded-3xl shadow-lg border-t-8 border-[#00A3E0]">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Envíanos un mensaje</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre completo</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#003087] focus:ring-2 focus:ring-[#003087]/20 transition-all"
                  placeholder="Ej. Juan Pérez"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Correo electrónico</label>
                <input 
                  type="email" 
                  required
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#003087] focus:ring-2 focus:ring-[#003087]/20 transition-all"
                  placeholder="tu@correo.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mensaje</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#003087] focus:ring-2 focus:ring-[#003087]/20 transition-all resize-none"
                  placeholder="¿En qué te podemos ayudar?"
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full bg-[#003087] hover:bg-[#002266] text-white font-bold py-4 rounded-2xl transition-all shadow-md"
              >
                Enviar Mensaje
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#003087] text-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center justify-center md:justify-start gap-2">
              <span>🐟</span> FishWish
            </h3>
            <p className="opacity-80">Salud en cada mordida. <br/>Snacks naturales de Campeche.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-[#00A3E0]">Enlaces Rápidos</h4>
            <ul className="space-y-2 opacity-80">
              <li><Link href="/productos" className="hover:text-white transition">Productos</Link></li>
              <li><Link href="/impacto" className="hover:text-white transition">Impacto</Link></li>
              <li><Link href="/contacto" className="hover:text-white transition">Contacto</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-[#00A3E0]">Contacto</h4>
            <p className="opacity-80">Lerma, Campeche, México</p>
            <p className="opacity-80 mt-2">hola@fishwish.com.mx</p>
          </div>
        </div>
        <div className="border-t border-white/20 mt-8 pt-8 text-center opacity-60 text-sm">
          © {new Date().getFullYear()} FishWish. Todos los derechos reservados.
        </div>
      </footer>

      {/* Cart Modal */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}