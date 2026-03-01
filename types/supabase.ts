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
        Insert: {
          id?: string
          name: string
          slug: string
          description: string
          price: number
          compare_at_price?: number | null
          category: string
          subcategory: string
          images: string[]
          sizes: string[]
          colors: Json
          inventory: number
          sku: string
          material: string
          care_instructions: string
          is_featured?: boolean
          is_new?: boolean
          rating?: number
          review_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string
          price?: number
          compare_at_price?: number | null
          category?: string
          subcategory?: string
          images?: string[]
          sizes?: string[]
          colors?: Json
          inventory?: number
          sku?: string
          material?: string
          care_instructions?: string
          is_featured?: boolean
          is_new?: boolean
          rating?: number
          review_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
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
        Insert: {
          id?: string
          user_id?: string | null
          total?: number
          item_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          total?: number
          item_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
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
        Insert: {
          id?: string
          cart_id: string
          product_id: string
          quantity: number
          size: string
          color: string
          created_at?: string
        }
        Update: {
          id?: string
          cart_id?: string
          product_id?: string
          quantity?: number
          size?: string
          color?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      wishlist_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
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
        Insert: {
          id?: string
          user_id: string
          order_number: string
          status?: string
          payment_status?: string
          total: number
          subtotal: number
          shipping_cost?: number
          tax?: number
          shipping_address: Json
          tracking_number?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          order_number?: string
          status?: string
          payment_status?: string
          total?: number
          subtotal?: number
          shipping_cost?: number
          tax?: number
          shipping_address?: Json
          tracking_number?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
