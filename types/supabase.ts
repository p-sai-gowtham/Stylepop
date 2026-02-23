export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string
          price: number
          compare_at_price: number | null
          category: string
          subcategory: string
          images: string[]
          sizes: string[]
          colors: Json
          inventory: number
          sku: string
          material: string
          care_instructions: string
          is_featured: boolean
          is_new: boolean
          rating: number
          review_count: number
          created_at: string
          updated_at: string
        }
      }
      carts: {
        Row: {
          id: string
          user_id: string | null
          total: number
          item_count: number
          created_at: string
          updated_at: string
        }
      }
      cart_items: {
        Row: {
          id: string
          cart_id: string
          product_id: string
          quantity: number
          size: string
          color: string
          created_at: string
        }
      }
      wishlist_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          created_at: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          order_number: string
          status: string
          payment_status: string
          total: number
          subtotal: number
          shipping_cost: number
          tax: number
          shipping_address: Json
          tracking_number: string | null
          created_at: string
          updated_at: string
        }
      }
    }
  }
}