'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useCartStore } from '../lib/cartStore';
import CartModal from '../../components/ui/CartModal';

interface Product {
  id: number;
  name: string;
  presentation: string;
  price: number;
  stock: number;
  description: string;
}

export default function ProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { totalItems, totalPrice, addToCart } = useCartStore();

  useEffect(() => {
    // Usamos variable de entorno si existe, de lo contrario usamos localhost para desarrollo local
    const productUrl = process.env.NEXT_PUBLIC_PRODUCT_API_URL || 'http://localhost:8081';

    fetch(`${productUrl}/api/products`)
      .then(res => {
        if (!res.ok) throw new Error('Error al conectar con el servidor');
        return res.json();
      })
      .then(data => {
        setProducts(data);
        setError(null);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('No pudimos cargar el catálogo. Intenta de nuevo más tarde.');
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.success(`¡${product.name} añadido al carrito!`);
  };

  const filteredProducts = products.filter(p => {
    if (filter === 'all') return true;
    return p.presentation === filter;
  });

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
            <Link href="/productos" className="text-[#00A3E0] transition-colors">Productos</Link>
            <Link href="/about" className="hover:text-[#00A3E0] transition-colors">Nosotros</Link>
            <Link href="/impacto" className="hover:text-[#00A3E0] transition-colors">Impacto</Link>
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

      {/* HERO */}
      <section className="bg-gray-900 text-white py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#00A3E0] to-transparent"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h1 className="text-5xl font-bold mb-4">Catálogo de Productos</h1>
          <p className="text-xl font-light opacity-90">100% Pescado Natural. Sin conservadores.</p>
        </div>
      </section>

      {/* CATALOG SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-12 flex-grow">
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 md:mb-0 ml-2">Filtrar por tamaño:</h2>
          <div className="flex gap-2">
            <button 
              onClick={() => setFilter('all')} 
              className={`px-6 py-2 rounded-xl font-semibold transition-colors ${filter === 'all' ? 'bg-[#003087] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Todos
            </button>
            <button 
              onClick={() => setFilter('100g')} 
              className={`px-6 py-2 rounded-xl font-semibold transition-colors ${filter === '100g' ? 'bg-[#003087] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              100g
            </button>
            <button 
              onClick={() => setFilter('250g')} 
              className={`px-6 py-2 rounded-xl font-semibold transition-colors ${filter === '250g' ? 'bg-[#003087] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              250g
            </button>
            <button 
              onClick={() => setFilter('500g')} 
              className={`px-6 py-2 rounded-xl font-semibold transition-colors ${filter === '500g' ? 'bg-[#003087] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              500g
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-6">
            <svg className="animate-spin h-12 w-12 text-[#00A3E0]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-500 font-medium text-xl">Cargando el catálogo...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-8 rounded-3xl text-center max-w-2xl mx-auto shadow-sm border border-red-100">
            <span className="text-4xl block mb-4">🔌</span>
            <h3 className="text-2xl font-bold mb-2">Fallo de conexión</h3>
            <p>{error}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-5xl block mb-4">🔍</span>
            <h3 className="text-2xl font-bold text-gray-800">No se encontraron productos</h3>
            <p className="text-gray-500">Intenta cambiar el filtro de búsqueda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {filteredProducts.map((product) => (
              <div 
                key={product.id}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col"
              >
                <div className="h-64 bg-gradient-to-br from-[#003087] to-[#00A3E0] flex items-center justify-center relative">
                  <span className="text-8xl">🐟</span>
                  <div className="absolute top-4 right-4 bg-white text-[#003087] px-4 py-1.5 rounded-xl font-bold shadow-sm">
                    {product.presentation}
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-bold text-gray-900">{product.name}</h3>
                  </div>
                  <p className="text-gray-600 mb-6 flex-grow">{product.description}</p>

                  <div className="bg-gray-50 p-4 rounded-2xl mb-6">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Disponibilidad:</span>
                      <span className="font-bold text-green-600">{product.stock} unidades</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Ingredientes:</span>
                      <span className="font-medium">100% Pescado</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-auto">
                    <div>
                      <span className="text-3xl font-black text-[#003087]">${product.price}</span>
                      <span className="text-gray-500 font-medium"> MXN</span>
                    </div>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className="bg-[#00A3E0] hover:bg-[#0088c2] disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-95 shadow-md"
                    >
                      {product.stock === 0 ? 'Agotado' : 'Añadir'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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