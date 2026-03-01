'use client';

import { useState, useEffect, useCallback } from 'react';
import { Cart, CartItem, Product } from '@/types';
import { supabase } from '@/lib/supabase';

const CART_STORAGE_KEY = 'stylepop-cart';

export function useCart() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initCart = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          const { data: cartData, error: cartError } = await supabase
            .from('carts')
            .select('*, items:cart_items(*, product:products(*))')
            .eq('user_id', session.user.id)
            .single();

          if (cartError && cartError.code !== 'PGRST116') {
            throw cartError;
          }

          if (cartData) {
            setCart(cartData as unknown as Cart);
          } else {
            const { data: newCart, error: createError } = await supabase
              .from('carts')
              .insert({ user_id: session.user.id })
              .select('*, items:cart_items(*)')
              .single();

            if (createError) throw createError;
            setCart(newCart as unknown as Cart);
          }
        } else {
          const localCart = localStorage.getItem(CART_STORAGE_KEY);
          if (localCart) {
            setCart(JSON.parse(localCart));
          } else {
            const newCart: Cart = {
              id: Math.random().toString(36).substr(2, 9),
              user_id: null,
              items: [],
              total: 0,
              item_count: 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
            setCart(newCart);
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
          }
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    initCart();
  }, []);

  useEffect(() => {
    if (cart && !cart.user_id) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = useCallback(async (product: Product, quantity: number, size: string, color: string) => {
    try {
      setLoading(true);

      if (cart?.user_id) {
        const { error } = await supabase
          .from('cart_items')
          .upsert({
            cart_id: cart.id,
            product_id: product.id,
            quantity,
            size,
            color,
          });

        if (error) throw error;

        const { data: updatedCart } = await supabase
          .from('carts')
          .select('*, items:cart_items(*, product:products(*))')
          .eq('id', cart.id)
          .single();

        setCart(updatedCart as unknown as Cart);
      } else {
        setCart((prev) => {
          if (!prev) return null;

          const existingItem = prev.items.find(
            (item) => item.product_id === product.id && item.size === size && item.color === color
          );

          let newItems;
          if (existingItem) {
            newItems = prev.items.map((item) =>
              item.id === existingItem.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            const newItem: CartItem = {
              id: Math.random().toString(36).substr(2, 9),
              product_id: product.id,
              product,
              quantity,
              size,
              color,
              created_at: new Date().toISOString(),
            };
            newItems = [...prev.items, newItem];
          }

          const total = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
          const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

          return {
            ...prev,
            items: newItems,
            total,
            item_count: itemCount,
            updated_at: new Date().toISOString(),
          };
        });
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [cart]);

  const removeFromCart = useCallback(async (itemId: string) => {
    try {
      setLoading(true);

      if (cart?.user_id) {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('id', itemId);

        if (error) throw error;

        const { data: updatedCart } = await supabase
          .from('carts')
          .select('*, items:cart_items(*, product:products(*))')
          .eq('id', cart.id)
          .single();

        setCart(updatedCart as unknown as Cart);
      } else {
        setCart((prev) => {
          if (!prev) return null;

          const newItems = prev.items.filter((item) => item.id !== itemId);
          const total = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
          const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

          return {
            ...prev,
            items: newItems,
            total,
            item_count: itemCount,
            updated_at: new Date().toISOString(),
          };
        });
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [cart]);

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (quantity < 1) return;

    try {
      setLoading(true);

      if (cart?.user_id) {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('id', itemId);

        if (error) throw error;

        const { data: updatedCart } = await supabase
          .from('carts')
          .select('*, items:cart_items(*, product:products(*))')
          .eq('id', cart.id)
          .single();

        setCart(updatedCart as unknown as Cart);
      } else {
        setCart((prev) => {
          if (!prev) return null;

          const newItems = prev.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          );

          const total = newItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
          const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

          return {
            ...prev,
            items: newItems,
            total,
            item_count: itemCount,
            updated_at: new Date().toISOString(),
          };
        });
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [cart]);

  return {
    cart,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    itemCount: cart?.item_count || 0,
    total: cart?.total || 0,
  };
}