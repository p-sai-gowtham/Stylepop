'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package, MapPin, Heart, User, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimatedSection from '@/components/animations/AnimatedSection';
import { useAuth } from '@/hooks/useAuth';
import { useWishlist } from '@/hooks/useWishlist';

export default function ProfilePage() {
  const { user, signOut, isAuthenticated } = useAuth();
  const { wishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState('orders');

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-sand-50 pt-24 pb-16">
        <div className="max-w-md mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-charcoal-900 mb-4">Please Sign In</h1>
          <p className="text-charcoal-500 mb-6">Sign in to view your profile, orders, and wishlist.</p>
          <Button asChild className="w-full">
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                <div className="text-center mb-6 pb-6 border-b border-sand-200">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-sand-200 flex items-center justify-center">
                    <User className="w-12 h-12 text-charcoal-400" />
                  </div>
                  <h2 className="font-bold text-charcoal-900">{user?.user_metadata?.full_name || 'User'}</h2>
                  <p className="text-sm text-charcoal-500">{user?.email}</p>
                </div>

                <nav className="space-y-2">
                  {[
                    { id: 'orders', label: 'My Orders', icon: Package },
                    { id: 'addresses', label: 'Addresses', icon: MapPin },
                    { id: 'wishlist', label: 'Wishlist', icon: Heart, count: wishlist.length },
                    { id: 'settings', label: 'Settings', icon: Settings },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === item.id ? 'bg-sand-100 text-charcoal-900' : 'text-charcoal-600 hover:bg-sand-50'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                      {item.count !== undefined && item.count > 0 && (
                        <span className="ml-auto bg-charcoal-900 text-white text-xs px-2 py-1 rounded-full">{item.count}</span>
                      )}
                    </button>
                  ))}
                </nav>

                <Button variant="outline" className="w-full mt-6" onClick={signOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>

            <div className="lg:col-span-3">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="text-2xl font-bold text-charcoal-900 mb-6 capitalize">{activeTab}</h2>
                <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                  <p className="text-charcoal-500">This section is under development.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}