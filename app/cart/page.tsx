'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck, Shield, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimatedSection from '@/components/animations/AnimatedSection';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, total, itemCount } = useCart();

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-sand-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center py-16">
              <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-sand-300" />
              <h1 className="text-3xl font-bold text-charcoal-900 mb-4">Your cart is empty</h1>
              <p className="text-charcoal-500 mb-8 max-w-md mx-auto">
                Looks like you haven&apos;t added anything to your cart yet.
              </p>
              <Button size="lg" asChild>
                <Link href="/products">Start Shopping</Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <h1 className="text-3xl font-bold text-charcoal-900 mb-8">Shopping Cart ({itemCount})</h1>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <div className="flex gap-6">
                    <Link href={`/products/${item.product.slug}`}>
                      <div className="relative w-32 h-40 rounded-lg overflow-hidden bg-sand-100 flex-shrink-0">
                        <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" sizes="128px" />
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <Link href={`/products/${item.product.slug}`}>
                            <h3 className="font-semibold text-charcoal-900">{item.product.name}</h3>
                          </Link>
                          <p className="text-sm text-charcoal-500 mt-1">{item.color} / {item.size}</p>
                        </div>
                        <p className="font-semibold text-lg">{formatPrice(item.product.price * item.quantity)}</p>
                      </div>
                      <div className="flex items-center justify-between mt-6">
                        <div className="flex items-center border border-sand-200 rounded-lg">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-sand-50" disabled={item.quantity <= 1}><Minus className="w-4 h-4" /></button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-sand-50"><Plus className="w-4 h-4" /></button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="flex items-center gap-2 text-red-500 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                          <span className="text-sm">Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                <h2 className="text-xl font-semibold text-charcoal-900 mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-charcoal-600"><span>Subtotal</span><span>{formatPrice(total)}</span></div>
                  <div className="flex justify-between text-charcoal-600"><span>Shipping</span><span className="text-green-600">Free</span></div>
                </div>
                <div className="border-t border-sand-200 pt-4 mb-6">
                  <div className="flex justify-between text-lg font-semibold"><span>Total</span><span>{formatPrice(total)}</span></div>
                </div>
                <Button className="w-full h-12 text-lg mb-4" asChild>
                  <Link href="/checkout">Proceed to Checkout<ArrowRight className="w-5 h-5 ml-2" /></Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/products">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}