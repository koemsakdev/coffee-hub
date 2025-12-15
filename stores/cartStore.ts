import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface ProductCardGridProps {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
}

export interface CartItem extends ProductCardGridProps {
  quantity: number;
}

interface CartState {
  cartItems: CartItem[];
  addToCart: (product: ProductCardGridProps) => void;
  getQuantityById: (id: number) => number;
  getCartCount: () => number;
  getTotalAmount: () => number;
  getCartItems: () => CartItem[];
  updateCartItem: (id: number, newQty: number) => void;
  clearCart: () => void;
}

let hasHydrated = false;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      addToCart: (product) =>
        set((state) => {
          const existing = state.cartItems.find(
            (item) => item.id === product.id
          );
          if (existing) {
            return {
              cartItems: state.cartItems.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return {
            cartItems: [...state.cartItems, { ...product, quantity: 1 }],
          };
        }),
      getQuantityById: (id) => {
        const item = get().cartItems.find((item) => item.id === id);
        return item?.quantity ?? 0;
      },
      getCartCount: () => get().cartItems.length,
      getTotalAmount: () =>
        get().cartItems.reduce(
          (total, item) => total + parseFloat(item.price) * item.quantity,
          0
        ),
      getCartItems: () => get().cartItems,
      updateCartItem: (id: number, newQty: number) =>
        set((state) => {
          if (newQty <= 0) {
            return {
              cartItems: state.cartItems.filter((item) => item.id !== id),
            };
          }
          return {
            cartItems: state.cartItems.map((item) =>
              item.id === id ? { ...item, quantity: newQty } : item
            ),
          };
        }),
      clearCart: () => set({ cartItems: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => () => {
        hasHydrated = true;
      },
    }
  )
);
