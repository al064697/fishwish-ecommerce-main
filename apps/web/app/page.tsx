'use client';                    // ← INDICA QUE ESTE COMPONENTE ES "CLIENT-SIDE"
// Esto es obligatorio cuando usamos hooks (useState, useEffect) o eventos (onClick)

import { useEffect, useState } from 'react';
import Link from 'next/link';
// useState → Permite crear variables que cambian y React las "escucha" para volver a renderizar
// useEffect → Permite ejecutar código cuando el componente se monta o cuando cambian ciertas variables

import { toast } from 'sonner';
import { useCartStore } from '../app/lib/cartStore';
// Importamos el store de Zustand que maneja el carrito (estado global)

import CartModal from '../components/ui/CartModal';
// Importamos el componente modal del carrito que creamos antes

// Definimos la forma (estructura) que tienen los productos que vienen del backend
interface Product {
  id: number;
  name: string;
  presentation: string;
  price: number;
  stock: number;
  description: string;
}

// Este es el componente principal de la página de inicio (equivalente a index.html)
export default function Home() {

  // Estados locales (solo viven en esta página)
  const [products, setProducts] = useState<Product[]>([]);     // Guardamos la lista de productos
  const [loading, setLoading] = useState(true);                // Para mostrar "Cargando..." mientras esperamos datos
  const [error, setError] = useState<string | null>(null);     // Para manejar errores de conexión
    const [isCartOpen, setIsCartOpen] = useState(false);         // Controla si el modal del carrito está abierto o cerrado

  // Extraemos funciones y datos del carrito global (Zustand)
  const { addToCart, totalItems, totalPrice } = useCartStore();

  // useEffect se ejecuta UNA vez cuando la página se carga
  useEffect(() => {
    // Usamos variable de entorno si existe, de lo contrario usamos localhost para desarrollo local
    const productUrl = process.env.NEXT_PUBLIC_PRODUCT_API_URL || 'http://localhost:8081';
    
    fetch(`${productUrl}/api/products`)   // Hacemos petición al backend
      .then(res => {
        if (!res.ok) throw new Error('Error al conectar con el servidor de productos');
        return res.json();
      })
      .then(data => {
        setProducts(data);                        // Guardamos los productos en el estado
        setError(null);
        setLoading(false);                        // Ya terminamos de cargar
      })
      .catch(err => {
        console.error(err);
        setError('No se pudo conectar con el servidor. Verifica tu conexión a internet o intenta de nuevo más tarde.');
        toast.error('No se pudo conectar con el servidor');
        setLoading(false);                        // Aunque haya error, dejamos de mostrar "cargando"
      });
  }, []);   // El array vacío [] significa "ejecutar solo una vez al montar el componente"

  // Función que se llama cuando el usuario hace clic en "Agregar al carrito"
  const handleAddToCart = (product: Product) => {
    addToCart(product);      // Llamamos a la función del store de Zustand
    toast.success(`¡${product.name} añadido al carrito!`, {
      description: 'Ve al carrito para finalizar tu compra.',
    });
  };

  // Mientras estamos cargando los productos, mostramos este mensaje
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-2xl gap-6">
        <svg className="animate-spin h-14 w-14 text-[#00A3E0]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-[#003087] font-semibold text-lg">Cargando el catálogo de FishWish...</p>
      </div>
    );
  }

  // Aquí empieza el HTML/JSX que se renderiza en pantalla
  return (
    <div className="min-h-screen bg-gray-50">   {/* Contenedor principal de toda la página */}

      {/* ==================== HEADER ==================== */}
      <header className="bg-[#003087] text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          {/* Logo y nombre */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-inner">
              🐟
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tighter">FishWish</h1>
              <p className="text-xs opacity-90">Snacks naturales • Campeche</p>
            </div>
          </div>

          {/* Navegación */}
          <nav className="hidden md:flex gap-8 text-sm font-medium">
            <Link href="/" className="text-[#00A3E0] transition-colors">Inicio</Link>
            <Link href="/productos" className="hover:text-[#00A3E0] transition-colors">Productos</Link>
            <Link href="/about" className="hover:text-[#00A3E0] transition-colors">Nosotros</Link>
            <Link href="/impacto" className="hover:text-[#00A3E0] transition-colors">Impacto</Link>
            <Link href="/contacto" className="hover:text-[#00A3E0] transition-colors">Contacto</Link>
          </nav>

          {/* Botón del carrito */}
          <button 
            onClick={() => setIsCartOpen(true)}           // Al hacer clic abre el modal
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

      {/* ==================== HERO SECTION ==================== */}
      <section className="bg-gradient-to-br from-[#003087] to-[#0055aa] text-white py-28 text-center">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-6xl md:text-7xl font-bold leading-tight mb-6">
            Snacks naturales<br />para tu mejor amigo
          </h1>
          <p className="text-2xl opacity-90 max-w-2xl mx-auto">
            Elaborados con pescado fresco de Campeche • Ricos en Omega 3 y proteínas
          </p>
        </div>
      </section>

      {/* ==================== LISTA DE PRODUCTOS ==================== */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        {error ? (
          <div className="bg-red-50 text-red-600 p-8 rounded-3xl text-center max-w-2xl mx-auto shadow-sm border border-red-100">
            <span className="text-4xl block mb-4">🔌</span>
            <h3 className="text-2xl font-bold mb-2">¡Ups! Tuvimos un problema</h3>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 bg-white text-red-600 px-6 py-2 rounded-xl font-semibold hover:bg-red-50 border border-red-200 transition-colors"
            >
              Reintentar
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl text-center max-w-2xl mx-auto shadow-sm border border-gray-100">
            <span className="text-4xl block mb-4">😔</span>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Sin inventario</h3>
            <p className="text-gray-500">Por el momento no tenemos productos disponibles.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {products.map((product) => (          // Recorremos el array de productos
              <div 
                key={product.id}                   // key es obligatorio cuando usamos .map en React
                className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group"
              >
                {/* Imagen del producto */}
                <div className="h-80 bg-gradient-to-br from-[#003087] to-[#00A3E0] flex items-center justify-center relative">
                  <span className="text-9xl transition-transform group-hover:scale-110 duration-500">🐟</span>
                  <div className="absolute top-6 right-6 bg-white text-[#003087] px-5 py-2 rounded-2xl font-bold shadow">
                    {product.presentation}
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-3">{product.name}</h3>
                  <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>

                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-4xl font-bold text-[#003087]"> ${product.price}</span>
                    <span className="text-gray-500"> MXN</span>
                  </div>
                  <button 
                    onClick={() => handleAddToCart(product)}   // Llamamos a la función al hacer clic
                    className="bg-[#00A3E0] hover:bg-[#0088c2] text-white px-8 py-4 rounded-2xl font-semibold transition-all active:scale-95"
                  >
                    Agregar al carrito
                  </button>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}
      </section>

      {/* Modal del carrito */}
      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </div>
  );
}
