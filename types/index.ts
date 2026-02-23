export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  category: 'men' | 'women' | 'children';
  subcategory: string;
  images: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  inventory: number;
  sku: string;
  material: string;
  care_instructions: string;
  is_featured: boolean;
  is_new: boolean;
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  product: Product;
  quantity: number;
  size: string;
  color: string;
  created_at: string;
}

export interface Cart {
  id: string;
  user_id: string | null;
  items: CartItem[];
  total: number;
  item_count: number;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  total: number;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  items: OrderItem[];
  shipping_address: Address;
  tracking_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string;
  user_avatar: string | null;
  rating: number;
  title: string;
  content: string;
  images: string[];
  helpful_count: number;
  verified_purchase: boolean;
  created_at: string;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  product: Product;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parent_id: string | null;
  sort_order: number;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface FilterOptions {
  categories: string[];
  sizes: string[];
  colors: string[];
  priceRange: [number, number];
  sortBy: 'featured' | 'newest' | 'price-low' | 'price-high' | 'rating';
}

export type ViewMode = 'grid' | 'list';