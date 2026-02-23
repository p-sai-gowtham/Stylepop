'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FloatingBag from '@/components/3d/FloatingBag';
import ProductCard from '@/components/product/ProductCard';
import AnimatedSection, { AnimatedText, StaggerContainer, StaggerItem } from '@/components/animations/AnimatedSection';
import { useProducts } from '@/hooks/useProducts';

const categories = [
  { name: 'Men', image: '/images/category-men.jpg', href: '/products?category=men' },
  { name: 'Women', image: '/images/category-women.jpg', href: '/products?category=women' },
  { name: 'Children', image: '/images/category-children.jpg', href: '/products?category=children' },
];

const features = [
  { title: 'Sustainable Materials', description: 'Eco-friendly fabrics that care for the planet' },
  { title: 'Timeless Design', description: 'Classic styles that never go out of fashion' },
  { title: 'Premium Quality', description: 'Crafted with attention to every detail' },
  { title: 'Free Shipping', description: 'On all orders over $100' },
];

export default function HomePage() {
  const { products: featuredProducts, loading } = useProducts({ sortBy: 'featured' });

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-sand-50 via-white to-sand-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-0">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-sand-100 rounded-full text-sm font-medium text-charcoal-700 mb-6"
              >
                <Sparkles className="w-4 h-4" />
                New Collection 2024
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold text-charcoal-900 leading-tight mb-6"
              >
                Scandinavian
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sand-600 to-charcoal-700">
                  Minimalism
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-lg text-charcoal-600 mb-8 max-w-lg"
              >
                Discover timeless fashion for the modern individual. Quality, sustainability, and effortless style combined.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap gap-4"
              >
                <Button size="lg" className="group" asChild>
                  <Link href="/products">
                    Shop Now
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/products?category=women">Women</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/products?category=men">Men</Link>
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="flex gap-8 mt-12 pt-8 border-t border-sand-200"
              >
                <div>
                  <p className="text-3xl font-bold text-charcoal-900">50K+</p>
                  <p className="text-sm text-charcoal-500">Happy Customers</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-charcoal-900">200+</p>
                  <p className="text-sm text-charcoal-500">Products</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-charcoal-900">4.9</p>
                  <p className="text-sm text-charcoal-500">Rating</p>
                </div>
              </motion.div>
            </motion.div>

            {/* 3D Model */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="relative h-[500px] lg:h-[600px]"
            >
              <FloatingBag />
            </motion.div>
          </div>
        </div>

        {/* Background Decorations */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-sand-200/50 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-charcoal-100/50 rounded-full blur-3xl" />
      </section>

      {/* Categories Section */}
      <AnimatedSection className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedText className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal-900 mb-4">Shop by Category</h2>
            <p className="text-charcoal-500 max-w-2xl mx-auto">Explore our curated collections for every style and occasion</p>
          </AnimatedText>

          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <StaggerItem key={category.name}>
                <Link href={category.href}>
                  <motion.div
                    whileHover={{ y: -10 }}
                    className="relative aspect-[4/5] rounded-2xl overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
                    <div className="absolute inset-0 bg-sand-300" />
                    <div className="absolute inset-0 flex items-end p-8 z-20">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                        <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          Shop Collection →
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </AnimatedSection>

      {/* Featured Products */}
      <AnimatedSection className="py-24 bg-sand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <AnimatedText>
              <h2 className="text-3xl md:text-4xl font-bold text-charcoal-900 mb-4">Featured Products</h2>
              <p className="text-charcoal-500">Handpicked favorites from our collection</p>
            </AnimatedText>
            <Button variant="outline" className="hidden sm:flex" asChild>
              <Link href="/products">View All</Link>
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-sand-200 rounded-xl animate-pulse" />
                ))
              : featuredProducts.slice(0, 4).map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Features Section */}
      <AnimatedSection className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <StaggerItem key={feature.title}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="text-center p-6 rounded-2xl bg-sand-50 hover:bg-sand-100 transition-colors"
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-charcoal-900 text-white flex items-center justify-center">
                    <span className="text-lg font-bold">{index + 1}</span>
                  </div>
                  <h3 className="font-semibold text-charcoal-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-charcoal-500">{feature.description}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection className="py-24 bg-charcoal-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedText>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Join the Stylepop Community</h2>
            <p className="text-lg text-charcoal-300 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter for exclusive offers, styling tips, and early access to new collections.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-sand-500"
              />
              <Button size="lg" className="bg-sand-600 hover:bg-sand-700 text-white px-8">
                Subscribe
              </Button>
            </div>
          </AnimatedText>
        </div>
      </AnimatedSection>
    </div>
  );
}