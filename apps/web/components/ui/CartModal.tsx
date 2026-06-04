'use client';

import { useCartStore } from '../../app/lib/cartStore';
import Link from 'next/link';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const { items, removeFromCart, increaseQuantity, decreaseQuantity, totalPrice } = useCartStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-[#003087] text-white">
          <h2 className="text-2xl font-semibold">Tu Carrito</h2>
          <button 
            onClick={onClose} 
            className="text-4xl leading-none hover:text-gray-300 transition"
          >
            ×
          </button>
        </div>

        {/* Lista de productos */}
        <div className="flex-1 p-6 overflow-y-auto">
          {items.length === 0 ? (
            <p className="text-center py-12 text-gray-500">Tu carrito está vacío</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 py-5 border-b last:border-0">
                <div className="w-20 h-20 bg-gradient-to-br from-[#003087] to-[#00A3E0] rounded-2xl flex items-center justify-center flex-shrink-0">
                  🐟
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg">{item.name}</h4>
                  <p className="text-sm text-gray-500">{item.presentation}</p>
                  <p className="font-medium mt-1">${item.price} MXN</p>

                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex border rounded-xl">
                      <button 
                        onClick={() => decreaseQuantity(item.id)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-gray-100"
                      >
                        −
                      </button>
                      <span className="px-6 font-medium flex items-center">{item.quantity}</span>
                      <button 
                        onClick={() => increaseQuantity(item.id)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 text-sm hover:underline"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer con botones */}
        {items.length > 0 && (
          <div className="p-6 border-t bg-gray-50">
            <div className="flex justify-between text-xl font-semibold mb-6">
              <span>Total</span>
              <span>${totalPrice()} MXN</span>
            </div>

            <div className="flex flex-col gap-3">
              <Link 
                href="/cart"
                className="bg-gray-800 hover:bg-gray-900 text-white py-4 rounded-2xl text-center font-semibold transition"
                onClick={onClose}
              >
                Ver Carrito Completo
              </Link>

              <Link 
                href="/checkout"
                className="bg-[#00A3E0] hover:bg-[#0088c2] text-white py-4 rounded-2xl text-center font-semibold transition"
                onClick={onClose}
              >
                Finalizar Compra
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}