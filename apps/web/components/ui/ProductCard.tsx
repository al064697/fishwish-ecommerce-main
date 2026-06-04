'use client';

interface Product {
  id: number;
  name: string;
  presentation: string;
  price: number;
  stock: number;
  description: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all">
      <div className="h-64 bg-gradient-to-br from-[#003087] to-[#00A3E0] flex items-center justify-center">
        <span className="text-8xl">🐟</span>
      </div>

      <div className="p-8">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-semibold">{product.name}</h3>
          <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-medium">
            {product.presentation}
          </span>
        </div>

        <p className="text-gray-600 mb-8">{product.description}</p>

        <div className="flex items-end justify-between">
          <div>
            <span className="text-4xl font-bold text-[#003087]">${product.price}</span>
            <span className="text-gray-500"> MXN</span>
          </div>
          <button
            onClick={() => onAddToCart(product)}
            className="bg-[#00A3E0] hover:bg-[#0088c2] text-white px-8 py-4 rounded-2xl font-medium transition-colors"
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}