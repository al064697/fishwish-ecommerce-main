import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: number;
  name: string;
  presentation: string;
  price: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: number) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  clearCart: () => void;
  getItems: () => CartItem[];
  totalItems: () => number;
  totalPrice: () => number;
  isEmpty: () => boolean;
  updateCart: (items: CartItem[]) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product) => {
        set((state) => {
          const existingItem = state.items.find(item => item.id === product.id);
          
          if (existingItem) {
            return {
              items: state.items.map(item =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            };
          } else {
            return {
              items: [...state.items, { ...product, quantity: 1 }]
            };
          }
        });
      },

      removeFromCart: (id) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== id)
        }));
      },

      increaseQuantity: (id) => {
        set((state) => ({
          items: state.items.map(item =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
          )
        }));
      },

      decreaseQuantity: (id) => {
        set((state) => ({
          items: state.items.map(item =>
            item.id === id && item.quantity > 1
              ? { ...item, quantity: item.quantity - 1 }
              : item
          ).filter(item => item.quantity > 0)
        }));
      },

      // ✅ Limpiar carrito de forma segura
      clearCart: () => {
        set({ items: [] });
        // Forzar revalidación de localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('fishwish-cart-storage');
        }
      },

      // ✅ Obtener items de forma segura
      getItems: () => {
        return [...get().items];
      },

      totalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      totalPrice: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      // ✅ Verificar si el carrito está vacío
      isEmpty: () => {
        return get().items.length === 0;
      },

      // ✅ Actualizar carrito completo (útil para sincronización)
      updateCart: (items) => {
        set({ items: items.filter(item => item.quantity > 0) });
      },
    }),
    {
      name: 'fishwish-cart-storage', // clave para localStorage
    }
  )
);