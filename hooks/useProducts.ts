'use client';

import { useState, useEffect, useCallback } from 'react';
import { Product, FilterOptions } from '@/types';
import { supabase } from '@/lib/supabase';

export function useProducts(initialFilters?: Partial<FilterOptions>) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    sizes: [],
    colors: [],
    priceRange: [0, 1000],
    sortBy: 'featured',
    ...initialFilters,
  });

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from('products').select('*');

      // Apply category filter
      if (filters.categories.length > 0) {
        query = query.in('category', filters.categories);
      }

      // Apply price range filter
      query = query.gte('price', filters.priceRange[0]).lte('price', filters.priceRange[1]);

      // Apply sorting
      switch (filters.sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'price-low':
          query = query.order('price', { ascending: true });
          break;
        case 'price-high':
          query = query.order('price', { ascending: false });
          break;
        case 'rating':
          query = query.order('rating', { ascending: false });
          break;
        default:
          query = query.order('is_featured', { ascending: false });
      }

      const { data, error: supabaseError } = await query;

      if (supabaseError) throw supabaseError;

      setProducts(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateFilters = useCallback((newFilters: Partial<FilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const getProductBySlug = useCallback(async (slug: string): Promise<Product | null> => {
    try {
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();

      if (supabaseError) throw supabaseError;
      return data as Product;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getFeaturedProducts = useCallback(async (limit = 8): Promise<Product[]> => {
    try {
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .limit(limit);

      if (supabaseError) throw supabaseError;
      return (data as Product[]) || [];
    } catch (err) {
      setError(err as Error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getNewArrivals = useCallback(async (limit = 8): Promise<Product[]> => {
    try {
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from('products')
        .select('*')
        .eq('is_new', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (supabaseError) throw supabaseError;
      return (data as Product[]) || [];
    } catch (err) {
      setError(err as Error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const searchProducts = useCallback(async (searchTerm: string): Promise<Product[]> => {
    try {
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from('products')
        .select('*')
        .ilike('name', `%${searchTerm}%`)
        .or(`description.ilike.%${searchTerm}%`);

      if (supabaseError) throw supabaseError;
      return (data as Product[]) || [];
    } catch (err) {
      setError(err as Error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    products,
    loading,
    error,
    filters,
    updateFilters,
    getProductBySlug,
    getFeaturedProducts,
    getNewArrivals,
    searchProducts,
    refetch: fetchProducts,
  };
}