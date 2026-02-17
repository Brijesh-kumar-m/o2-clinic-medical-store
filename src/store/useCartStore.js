import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addToCart: (product, quantity = 1, packSize) => {
        const items = get().items;
        const existingItemIndex = items.findIndex(
          (item) => item.id === product.id && item.selectedPackSize === packSize
        );

        if (existingItemIndex > -1) {
          const newItems = [...items];
          newItems[existingItemIndex].quantity += quantity;
          set({ items: newItems });
        } else {
          set({ items: [...items, { ...product, quantity, selectedPackSize: packSize }] });
        }
      },
      removeFromCart: (productId, packSize) => {
        set({
          items: get().items.filter(
            (item) => !(item.id === productId && item.selectedPackSize === packSize)
          ),
        });
      },
      updateQuantity: (productId, packSize, quantity) => {
        const newItems = get().items.map((item) =>
          item.id === productId && item.selectedPackSize === packSize
            ? { ...item, quantity: Math.max(1, quantity) }
            : item
        );
        set({ items: newItems });
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
      getSubtotal: () => get().items.reduce((acc, item) => {
        const pack = item.packSizes.find(p => p.size === item.selectedPackSize);
        return acc + (pack ? pack.price * item.quantity : 0);
      }, 0),
    }),
    {
      name: 'cart-storage',
    }
  )
);
