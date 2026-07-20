import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/types';

/** Two lines are "the same" cart entry when the product AND the selected
 * color/size variant match. Different variants of the same product are kept
 * as separate lines so quantity/removal don't mix them up. */
function sameLine(item: CartItem, productId: string, color?: string, size?: string): boolean {
  return (
    item.productId === productId &&
    (item.color || undefined) === (color || undefined) &&
    (item.size || undefined) === (size || undefined)
  );
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateQuantity: (productId: string, color: string | undefined, size: string | undefined, quantity: number) => void;
  removeItem: (productId: string, color?: string, size?: string) => void;
  clearCart: () => void;
  total: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => sameLine(i, item.productId, item.color, item.size));
          if (existing) {
            return {
              items: state.items.map((i) =>
                sameLine(i, item.productId, item.color, item.size)
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i,
              ),
            };
          }
          return { items: [...state.items, item] };
        }),

      updateQuantity: (productId, color, size, quantity) =>
        set((state) => ({
          items:
            quantity === 0
              ? state.items.filter((i) => !sameLine(i, productId, color, size))
              : state.items.map((i) =>
                  sameLine(i, productId, color, size) ? { ...i, quantity } : i,
                ),
        })),

      removeItem: (productId, color, size) =>
        set((state) => ({ items: state.items.filter((i) => !sameLine(i, productId, color, size)) })),

      clearCart: () => set({ items: [] }),

      total: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

      itemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    { name: 'cart-store' },
  ),
);
