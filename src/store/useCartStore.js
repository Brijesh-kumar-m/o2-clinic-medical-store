import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      fetchCart: async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data, error } = await supabase
            .from('cart_items')
            .select(`
              *,
              product:products (*)
            `)
            .eq('user_id', user.id);

          if (error) {
            console.error('Error fetching cart:', error);
            return;
          }

          const mappedItems = data.map(item => {
            const product = item.product;
            // Ensure we handle cases where product might be deleted
            if (!product) return null;

            return {
              id: product.id,
              name: product.name,
              genericName: product.generic_name,
              brand: product.brand,
              manufacturer: product.manufacturer,
              category: product.category,
              packSizes: product.pack_sizes || [],
              images: product.images,
              // Cart specific
              quantity: item.quantity,
              selectedPackSize: item.pack_size,
            };
          }).filter(Boolean);
          
          set({ items: mappedItems });
        } catch (error) {
          console.error('Error in fetchCart:', error);
        }
      },

      addToCart: async (product, quantity = 1, packSize) => {
        const items = get().items;
        const existingItemIndex = items.findIndex(
          (item) => item.id === product.id && item.selectedPackSize === packSize
        );

        // Optimistic update
        let newItems;
        if (existingItemIndex > -1) {
          newItems = [...items];
          newItems[existingItemIndex].quantity += quantity;
          set({ items: newItems });
        } else {
          newItems = [...items, { ...product, quantity, selectedPackSize: packSize }];
          set({ items: newItems });
        }

        // Supabase Sync
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            if (existingItemIndex > -1) {
               const item = newItems[existingItemIndex];
               await supabase
                 .from('cart_items')
                 .update({ quantity: item.quantity })
                 .eq('user_id', user.id)
                 .eq('product_id', product.id)
                 .eq('pack_size', packSize);
            } else {
               // Check if item exists in DB (in case local state was out of sync)
               const { data: existingDbItem } = await supabase
                 .from('cart_items')
                 .select('id, quantity')
                 .eq('user_id', user.id)
                 .eq('product_id', product.id)
                 .eq('pack_size', packSize)
                 .single();

               if (existingDbItem) {
                 await supabase
                   .from('cart_items')
                   .update({ quantity: existingDbItem.quantity + quantity })
                   .eq('id', existingDbItem.id);
               } else {
                 await supabase
                   .from('cart_items')
                   .insert({
                     user_id: user.id,
                     product_id: product.id,
                     quantity: quantity,
                     pack_size: packSize
                   });
               }
            }
          }
        } catch (err) {
          console.error("Failed to sync cart to Supabase", err);
        }
      },

      removeFromCart: async (productId, packSize) => {
        // Optimistic
        set({
          items: get().items.filter(
            (item) => !(item.id === productId && item.selectedPackSize === packSize)
          ),
        });

        // Supabase Sync
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase
              .from('cart_items')
              .delete()
              .eq('user_id', user.id)
              .eq('product_id', productId)
              .eq('pack_size', packSize);
          }
        } catch (err) {
           console.error("Failed to remove cart item from Supabase", err);
        }
      },

      updateQuantity: async (productId, packSize, quantity) => {
        const safeQuantity = Math.max(1, quantity);
        
        // Optimistic
        const newItems = get().items.map((item) =>
          item.id === productId && item.selectedPackSize === packSize
            ? { ...item, quantity: safeQuantity }
            : item
        );
        set({ items: newItems });

        // Supabase Sync
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase
              .from('cart_items')
              .update({ quantity: safeQuantity })
              .eq('user_id', user.id)
              .eq('product_id', productId)
              .eq('pack_size', packSize);
          }
        } catch (err) {
          console.error("Failed to update cart quantity in Supabase", err);
        }
      },

      clearCart: async () => {
        set({ items: [] });
        
        if (isMockMode) return;

        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
             await supabase.from('cart_items').delete().eq('user_id', user.id);
          }
        } catch (err) {
           console.error("Failed to clear cart in Supabase", err);
        }
      },

      resetCart: () => set({ items: [] }),

      getTotalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
      
      getSubtotal: () => get().items.reduce((acc, item) => {
        const pack = item.packSizes?.find(p => p.size === item.selectedPackSize);
        return acc + (pack ? pack.price * item.quantity : 0);
      }, 0),
    }),
    {
      name: 'cart-storage',
    }
  )
);
