'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '../lib/cartStore';
import CartModal from '../../components/ui/CartModal';

export default function ImpactoPage() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { totalItems, totalPrice } = useCartStore();

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
            <Link href="/impacto" className="text-[#00A3E0] transition-colors">Impacto</Link>
            <Link href="/contacto" className="hover:text-[#00A3E0] transition-colors">Contacto</Link>
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
      <section className="bg-[#00A3E0] text-white py-24 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Impacto Ambiental y Social</h1>
          <p className="text-2xl font-light opacity-90">
            Cuidamos a tu mascota mientras cuidamos nuestro planeta.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-6xl mx-auto px-6 py-20 flex-grow">
        
        <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
          <div>
            <div className="text-6xl mb-6">♻️</div>
            <h2 className="text-4xl font-bold text-[#003087] mb-6">Economía Circular en Acción</h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-6">
              Diariamente, cientos de kilos de subproductos pesqueros son desechados en las costas de Campeche. En FishWish, rescatamos estos recortes de pescado fresco —ricos en nutrientes— que no se destinan al consumo humano.
            </p>
            <p className="text-xl text-gray-600 leading-relaxed">
              A través de un proceso de deshidratación seguro, transformamos lo que antes era un residuo contaminante en un producto de alto valor nutricional.
            </p>
          </div>
          <div className="bg-white rounded-3xl shadow-xl p-10 border-t-8 border-[#00A3E0]">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Nuestros Logros Proyectados</h3>
            <ul className="space-y-6">
              <li className="flex items-center gap-4">
                <span className="flex-shrink-0 w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xl font-bold">1</span>
                <span className="text-gray-700 text-lg">Reducción del 30% de residuos orgánicos en el muelle de Lerma.</span>
              </li>
              <li className="flex items-center gap-4">
                <span className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold">2</span>
                <span className="text-gray-700 text-lg">Cero uso de conservadores químicos en el ecosistema.</span>
              </li>
              <li className="flex items-center gap-4">
                <span className="flex-shrink-0 w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xl font-bold">3</span>
                <span className="text-gray-700 text-lg">Empaques ecológicos degradables a mediano plazo.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Impact */}
        <div className="bg-[#003087] text-white rounded-3xl p-12 text-center md:text-left">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Apoyo a Pescadores de Campeche</h2>
              <p className="text-xl opacity-90 leading-relaxed mb-6">
                No solo limpiamos las costas; también generamos valor social. Compramos los subproductos directamente a las cooperativas pesqueras de la comunidad de Lerma a un precio justo.
              </p>
              <p className="text-xl opacity-90 leading-relaxed">
                Esto representa un ingreso extra para familias locales que dependen de la pesca, mejorando su calidad de vida y fomentando prácticas responsables de limpieza y fileteo.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 p-6 rounded-2xl text-center backdrop-blur-sm">
                  <div className="text-4xl mb-2">🤝</div>
                  <div className="font-bold text-xl">Comercio Justo</div>
                </div>
                <div className="bg-white/10 p-6 rounded-2xl text-center backdrop-blur-sm">
                  <div className="text-4xl mb-2">🌊</div>
                  <div className="font-bold text-xl">Costas Limpias</div>
                </div>
                <div className="bg-white/10 p-6 rounded-2xl text-center backdrop-blur-sm">
                  <div className="text-4xl mb-2">🐶</div>
                  <div className="font-bold text-xl">Mascotas Sanas</div>
                </div>
                <div className="bg-white/10 p-6 rounded-2xl text-center backdrop-blur-sm">
                  <div className="text-4xl mb-2">📈</div>
                  <div className="font-bold text-xl">Economía Local</div>
                </div>
              </div>
            </div>
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