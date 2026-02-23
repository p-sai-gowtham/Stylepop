'use client';

import { useState, useEffect, useCallback } from 'react';
import { WishlistItem, Product } from '@/types';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

export function useWishlist() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setWishlist([]);
      setLoading(false);
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from('wishlist_items')
        .select('*, product:products(*)')
        .eq('user_id', user!.id);

      if (supabaseError) throw supabaseError;
      setWishlist(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = useCallback(async (productId: string) => {
    if (!user) throw new Error('Please sign in to add items to wishlist');

    try {
      setLoading(true);
      const { error } = await supabase
        .from('wishlist_items')
        .insert({ user_id: user.id, product_id: productId });

      if (error) throw error;
      await fetchWishlist();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const removeFromWishlist = useCallback(async (productId: string) => {
    if (!user) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;
      await fetchWishlist();
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const isInWishlist = useCallback((productId: string) => {
    return wishlist.some((item) => item.product_id === productId);
  }, [wishlist]);

  const toggleWishlist = useCallback(async (productId: string) => {
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  }, [isInWishlist, addToWishlist, removeFromWishlist]);

  return {
    wishlist,
    loading,
    error,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    wishlistCount: wishlist.length,
  };
}