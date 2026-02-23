'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const discount = product.compare_at_price
    ? calculateDiscount(product.price, product.compare_at_price)
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, product.sizes[0], product.colors[0].name);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.slug}`}>
        <div className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
          {/* Image Container */}
          <div className="relative aspect-[3/4] overflow-hidden bg-sand-100">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-sand-200 animate-pulse" />
            )}
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              onLoad={() => setImageLoaded(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />

            {/* Hover Image */}
            {product.images[1] && (
              <Image
                src={product.images[1]}
                alt={product.name}
                fill
                className={`object-cover transition-opacity duration-500 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.is_new && (
                <Badge className="bg-charcoal-900 text-white">New</Badge>
              )}
              {discount && (
                <Badge variant="destructive">-{discount}%</Badge>
              )}
            </div>

            {/* Wishlist Button */}
            <motion.button
              onClick={handleWishlist}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  isInWishlist(product.id)
                    ? 'fill-red-500 text-red-500'
                    : 'text-charcoal-700'
                }`}
              />
            </motion.button>

            {/* Quick Add Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-4 left-4 right-4"
            >
              <Button
                onClick={handleAddToCart}
                className="w-full bg-white/95 backdrop-blur-sm text-charcoal-900 hover:bg-charcoal-900 hover:text-white shadow-lg"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Quick Add
              </Button>
            </motion.div>
          </div>

          {/* Product Info */}
          <div className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-medium text-charcoal-900 line-clamp-1 group-hover:text-charcoal-700 transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-charcoal-500 capitalize">{product.category}</p>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{product.rating}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <span className="font-semibold text-lg">{formatPrice(product.price)}</span>
              {product.compare_at_price && (
                <span className="text-sm text-charcoal-400 line-through">
                  {formatPrice(product.compare_at_price)}
                </span>
              )}
            </div>

            {/* Color Options */}
            <div className="flex gap-1.5 mt-3">
              {product.colors.slice(0, 4).map((color) => (
                <div
                  key={color.name}
                  className="w-5 h-5 rounded-full border border-charcoal-200 shadow-sm"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-xs text-charcoal-500 flex items-center">
                  +{product.colors.length - 4}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}