# Stylepop - Scandinavian Minimalist E-Commerce

A modern e-commerce platform built with Next.js 14, Supabase, and Three.js.

## Features

- **Interactive 3D Shopping Bag** with mouse tracking and particle effects
- **Product Detail Pages** with image gallery, zoom, reviews
- **User Profile** with orders, addresses, wishlist tabs
- **Full Animations** throughout all pages using Framer Motion
- **Shopping Cart** with persistent storage
- **Authentication** with Supabase Auth
- **Responsive Design** for all devices
- **Scandinavian Minimalist** design aesthetic

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Supabase (Auth, Database, Storage)
- Three.js / React Three Fiber
- Framer Motion
- Zustand (State Management)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Database Setup

Run the migrations in `supabase/migrations/` to set up your database schema.

## License

MIT
