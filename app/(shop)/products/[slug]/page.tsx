'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Share2, Truck, Shield, RefreshCw, Star, ChevronLeft, ChevronRight, Minus, Plus, ShoppingBag, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductCard from '@/components/product/ProductCard';
import AnimatedSection from '@/components/animations/AnimatedSection';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { Product } from '@/types';
import { formatPrice, calculateDiscount } from '@/lib/utils';

const reviews = [
  { id: '1', user: 'Sarah M.', rating: 5, date: '2024-01-15', content: 'Absolutely love this! The quality is amazing and fits perfectly.', verified: true },
  { id: '2', user: 'James K.', rating: 4, date: '2024-01-10', content: 'Great product, shipping was fast. Would recommend.', verified: true },
  { id: '3', user: 'Emma L.', rating: 5, date: '2024-01-05', content: 'Beautiful design and comfortable to wear. Will buy again!', verified: false },
];

export default function ProductDetailPage() {
  const params = useParams();
  const { getProductBySlug, getFeaturedProducts } = useProducts();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      const data = await getProductBySlug(params.slug as string);
      if (data) {
        setProduct(data);
        setSelectedSize(data.sizes[0]);
        setSelectedColor(data.colors[0].name);
        const related = await getFeaturedProducts(4);
        setRelatedProducts(related.filter((p) => p.id !== data.id));
      }
      setLoading(false);
    };
    loadProduct();
  }, [params.slug]);

  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart(product, quantity, selectedSize, selectedColor);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const nextImage = () => {
    if (product) {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product) {
      setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sand-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse grid lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-sand-200 rounded-2xl" />
            <div className="space-y-4">
              <div className="h-8 bg-sand-200 rounded w-3/4" />
              <div className="h-6 bg-sand-200 rounded w-1/4" />
              <div className="h-4 bg-sand-200 rounded w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-sand-50 pt-24 pb-16 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-charcoal-900">Product not found</h1>
          <Link href="/products" className="text-sand-600 hover:underline mt-4 inline-block">
            Browse all products
          </Link>
        </div>
      </div>
    );
  }

  const discount = product.compare_at_price
    ? calculateDiscount(product.price, product.compare_at_price)
    : null;

  return (
    <div className="min-h-screen bg-sand-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-sm text-charcoal-500 mb-8">
          <Link href="/" className="hover:text-charcoal-900">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-charcoal-900">Products</Link>
          <span>/</span>
          <span className="text-charcoal-900">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          <AnimatedSection>
            <div className="space-y-4">
              <div className="relative aspect-square bg-white rounded-2xl overflow-hidden group">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={product.images[selectedImage]}
                      alt={product.name}
                      fill
                      className={`object-cover transition-transform duration-500 ${isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'}`}
                      onClick={() => setIsZoomed(!isZoomed)}
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>

                {product.images.length > 1 && (
                  <>
                    <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.is_new && <Badge className="bg-charcoal-900">New</Badge>}
                  {discount && <Badge variant="destructive">-{discount}%</Badge>}
                </div>
              </div>

              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index ? 'border-charcoal-900' : 'border-transparent'
                      }`}
                    >
                      <Image src={image} alt={`${product.name} - ${index + 1}`} fill className="object-cover" sizes="150px" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-charcoal-900 mb-2">{product.name}</h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-sand-300'}`} />
                    ))}
                    <span className="ml-2 text-sm text-charcoal-600">({product.review_count} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-charcoal-900">{formatPrice(product.price)}</span>
                {product.compare_at_price && (
                  <span className="text-xl text-charcoal-400 line-through">{formatPrice(product.compare_at_price)}</span>
                )}
              </div>

              <p className="text-charcoal-600 leading-relaxed">{product.description}</p>

              <div>
                <h3 className="font-semibold text-charcoal-900 mb-3">Color: {selectedColor}</h3>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor === color.name ? 'border-charcoal-900 scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-charcoal-900">Size: {selectedSize}</h3>
                  <button className="text-sm text-sand-600 hover:underline">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-lg border-2 font-medium transition-colors ${
                        selectedSize === size ? 'border-charcoal-900 bg-charcoal-900 text-white' : 'border-sand-200 hover:border-charcoal-900'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-charcoal-900 mb-3">Quantity</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-sand-200 rounded-lg">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-sand-50"><Minus className="w-4 h-4" /></button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-sand-50"><Plus className="w-4 h-4" /></button>
                  </div>
                  <span className="text-sm text-charcoal-500">{product.inventory} available</span>
                </div>
              </div>

              <div className="flex gap-4">
                <Button size="lg" className="flex-1 h-14 text-lg" onClick={handleAddToCart} disabled={addedToCart}>
                  {addedToCart ? <><Check className="w-5 h-5 mr-2" />Added to Cart</> : <><ShoppingBag className="w-5 h-5 mr-2" />Add to Cart</>}
                </Button>
                <Button size="lg" variant="outline" className="h-14 w-14 p-0" onClick={() => toggleWishlist(product.id)}>
                  <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                <Button size="lg" variant="outline" className="h-14 w-14 p-0"><Share2 className="w-5 h-5" /></Button>
              </div>

              <div className="grid grid-cols-3 gap-4 py-6 border-t border-sand-200">
                <div className="text-center"><Truck className="w-6 h-6 mx-auto mb-2 text-sand-600" /><p className="text-sm text-charcoal-600">Free Shipping</p></div>
                <div className="text-center"><Shield className="w-6 h-6 mx-auto mb-2 text-sand-600" /><p className="text-sm text-charcoal-600">Secure Payment</p></div>
                <div className="text-center"><RefreshCw className="w-6 h-6 mx-auto mb-2 text-sand-600" /><p className="text-sm text-charcoal-600">Easy Returns</p></div>
              </div>
            </div>
          </AnimatedSection>
        </div>

        <AnimatedSection className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start border-b border-sand-200 rounded-none bg-transparent h-auto p-0">
              <TabsTrigger value="description" className="rounded-none border-b-2 border-transparent data-[state=active]:border-charcoal-900 data-[state=active]:bg-transparent py-4">Description</TabsTrigger>
              <TabsTrigger value="details" className="rounded-none border-b-2 border-transparent data-[state=active]:border-charcoal-900 data-[state=active]:bg-transparent py-4">Details & Care</TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-charcoal-900 data-[state=active]:bg-transparent py-4">Reviews ({reviews.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="pt-6">
              <div className="max-w-3xl"><p className="text-charcoal-600 leading-relaxed">{product.description}</p></div>
            </TabsContent>

            <TabsContent value="details" className="pt-6">
              <div className="max-w-3xl space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><h4 className="font-semibold text-charcoal-900 mb-2">Material</h4><p className="text-charcoal-600">{product.material}</p></div>
                  <div><h4 className="font-semibold text-charcoal-900 mb-2">SKU</h4><p className="text-charcoal-600">{product.sku}</p></div>
                </div>
                <div><h4 className="font-semibold text-charcoal-900 mb-2">Care Instructions</h4><p className="text-charcoal-600">{product.care_instructions}</p></div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="pt-6">
              <div className="max-w-3xl space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-sand-200 pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-charcoal-900">{review.user}</span>
                        {review.verified && <Badge variant="secondary" className="text-xs">Verified Purchase</Badge>}
                      </div>
                      <span className="text-sm text-charcoal-400">{review.date}</span>
                    </div>
                    <div className="flex gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-sand-300'}`} />
                      ))}
                    </div>
                    <p className="text-charcoal-600">{review.content}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </AnimatedSection>

        {relatedProducts.length > 0 && (
          <AnimatedSection className="mt-16">
            <h2 className="text-2xl font-bold text-charcoal-900 mb-8">You May Also Like</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}