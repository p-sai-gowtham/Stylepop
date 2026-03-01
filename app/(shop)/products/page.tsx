'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Grid3X3, List, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProductCard from '@/components/product/ProductCard';
import AnimatedSection from '@/components/animations/AnimatedSection';
import { useProducts } from '@/hooks/useProducts';
import { FilterOptions } from '@/types';

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

const categories = [
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' },
  { value: 'children', label: 'Children' },
];

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-sand-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-10 bg-sand-200 rounded w-1/3" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-sand-200 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { products, loading, filters, updateFilters } = useProducts({
    categories: searchParams.get('category') ? [searchParams.get('category')!] : [],
    sortBy: (searchParams.get('sort') as FilterOptions['sortBy']) || 'featured',
  });

  const activeFiltersCount = filters.categories.length + filters.sizes.length;

  return (
    <div className="min-h-screen bg-sand-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimatedSection>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-charcoal-900">All Products</h1>
              <p className="text-charcoal-500 mt-1">
                {loading ? 'Loading...' : `${products.length} products found`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="hidden sm:flex items-center bg-white rounded-lg border border-sand-200 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-sand-100 text-charcoal-900' : 'text-charcoal-500'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-sand-100 text-charcoal-900' : 'text-charcoal-500'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Filter Button (Mobile) */}
              <Button
                variant="outline"
                className="lg:hidden"
                onClick={() => setIsFilterOpen(true)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2">{activeFiltersCount}</Badge>
                )}
              </Button>

              {/* Sort Dropdown */}
              <select
                value={filters.sortBy}
                onChange={(e) => updateFilters({ sortBy: e.target.value as FilterOptions['sortBy'] })}
                className="px-4 py-2 bg-white border border-sand-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-charcoal-900/20"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </AnimatedSection>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-8">
              {/* Categories */}
              <div>
                <h3 className="font-semibold text-charcoal-900 mb-4 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category.value} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(category.value)}
                        onChange={(e) => {
                          const newCategories = e.target.checked
                            ? [...filters.categories, category.value]
                            : filters.categories.filter((c) => c !== category.value);
                          updateFilters({ categories: newCategories });
                        }}
                        className="w-4 h-4 rounded border-sand-300 text-charcoal-900 focus:ring-charcoal-900"
                      />
                      <span className="text-charcoal-600 group-hover:text-charcoal-900 transition-colors">
                        {category.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h3 className="font-semibold text-charcoal-900 mb-4">Sizes</h3>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        const newSizes = filters.sizes.includes(size)
                          ? filters.sizes.filter((s) => s !== size)
                          : [...filters.sizes, size];
                        updateFilters({ sizes: newSizes });
                      }}
                      className={`w-10 h-10 rounded-lg border text-sm font-medium transition-colors ${
                        filters.sizes.includes(size)
                          ? 'bg-charcoal-900 text-white border-charcoal-900'
                          : 'bg-white text-charcoal-700 border-sand-200 hover:border-charcoal-900'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold text-charcoal-900 mb-4">Price Range</h3>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={filters.priceRange[1]}
                  onChange={(e) => updateFilters({ priceRange: [0, parseInt(e.target.value)] })}
                  className="w-full accent-charcoal-900"
                />
                <div className="flex justify-between text-sm text-charcoal-500 mt-2">
                  <span>$0</span>
                  <span>${filters.priceRange[1]}</span>
                </div>
              </div>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => updateFilters({ categories: [], sizes: [], priceRange: [0, 1000] })}
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-sand-200 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-charcoal-500 text-lg">No products found</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => updateFilters({ categories: [], sizes: [], priceRange: [0, 1000] })}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <motion.div
                layout
                className={`grid gap-6 ${
                  viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
                }`}
              >
                <AnimatePresence mode="popLayout">
                  {products.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-80 bg-white z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button onClick={() => setIsFilterOpen(false)}>
                    <X className="w-6 h-6" />
                  </button>
                </div>
                {/* Mobile filter content same as sidebar */}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}