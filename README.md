# Eternizale - SaaS Platform for Digital Memory Pages

A modern SaaS platform for creating emotional digital memory pages (gifts) built with Next.js 14, Supabase, and Cloudflare R2.

## 🚀 Tech Stack

- **Framework:** Next.js 14+ (App Router, TypeScript)
- **Styling:** Tailwind CSS + Shadcn/ui (Radix UI)
- **State Management:** Zustand (Editor state)
- **Auth & Database:** Supabase Auth + PostgreSQL
- **Storage:** Cloudflare R2 (S3 Compatible) with Presigned URLs
- **Image Processing:** Client-side compression (browser-image-compression)
- **Validation:** Zod + React Hook Form

## 📁 Project Structure

```
eternizale/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   └── upload/              # Upload endpoints
│   ├── dashboard/               # User dashboard
│   ├── editor/                  # Memory editor
│   ├── layout.tsx               # Root layout with AuthProvider
│   ├── page.tsx                 # Homepage
│   └── globals.css              # Global styles
├── components/                   # React components
│   └── ui/                      # Shadcn/ui components
├── hooks/                       # Custom React hooks
│   ├── use-media-upload.ts     # Media upload hook
│   ├── use-debounce.ts         # Debounce hook
│   └── use-is-mounted.ts       # Client-side check
├── lib/                         # Core utilities
│   ├── supabase/               # Supabase configuration
│   │   ├── client.ts           # Browser client
│   │   ├── server.ts           # Server client
│   │   ├── middleware.ts       # Session refresh
│   │   ├── database.ts         # PostgreSQL operations
│   │   └── auth-context.tsx    # Auth provider
│   │   ├── firestore.ts        # Firestore operations
│   │   └── auth-context.tsx    # Auth context & hooks
│   ├── r2/                     # Cloudflare R2 utilities
│   │   ├── config.ts           # R2 client setup
│   │   └── upload.ts           # Presigned URL & upload
│   ├── media/                  # Media processing
│   │   └── compression.ts      # Image compression
│   └── utils.ts                # General utilities
├── store/                       # Zustand stores
│   └── editor-store.ts         # Editor state management
├── types/                       # TypeScript types
│   └── index.ts                # Core types & Zod schemas
└── public/                      # Static assets
```

## 🏗️ Architecture Principles

### 1. Performance First
- Use Next.js Image component for optimized images
- Implement ISR (Incremental Static Regeneration) for memory view pages with `revalidate: 86400`
- Client-side image compression before upload

### 2. Server vs Client Components
- **Server Components:** Default for all pages (data fetching, static content)
- **Client Components:** Only for interactivity (forms, editor, buttons)
- Pattern: Fetch data in Server Components → Pass to Client Components as props

### 3. Data Flow
- **Editor:** Zustand store manages draft state locally before saving to Firestore
- **Memory View:** Server-side data fetching with ISR
- **Authentication:** Supabase Auth with Context API + Server Actions

### 4. Cost Optimization
- ✅ NEVER upload raw images to R2
- ✅ Always compress images on client-side first
- ✅ Store only PUBLIC URLs in Firestore
- ✅ Use presigned URLs for secure uploads

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Cloudflare R2 Configuration
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=your_bucket_name
NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
```

### 3. Supabase Setup

1. Create a new Supabase project at [Supabase Dashboard](https://supabase.com/dashboard)
2. Copy your project URL and anon key from Settings → API
3. Run the database schema from MIGRATION.md in SQL Editor
4. Enable Authentication → Providers → Google (optional)

### 4. Cloudflare R2 Setup

1. Create an R2 bucket at [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Generate API tokens with read/write permissions
3. Enable public access for the bucket (or use custom domain)
4. Copy the configuration values to `.env.local`

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Data Schema

### Memory (PostgreSQL Table)

```typescript
interface Memory {
  id: string;
  ownerId: string;              // Supabase Auth UID
  slug: string;                 // Unique URL identifier
  status: 'DRAFT' | 'PAID' | 'ARCHIVED';
  createdAt: number;            // Timestamp
  content: {
    title: string;
    description: string;
    primaryColor: string;       // Hex color
    musicUrl?: string;          // Background music
    voiceNoteUrl?: string;      // Voice message
    media: MediaItem[];
  };
  metrics?: {
    views: number;
  };
}

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;                  // Cloudflare R2 Public URL
  caption?: string;
  order: number;
}
```

## 🎨 Key Features

- ✅ Type-safe TypeScript throughout
- ✅ Zod validation schemas for all forms
- ✅ Supabase Authentication with Google Sign-In
- ✅ PostgreSQL with Row Level Security (RLS)
- ✅ Cloudflare R2 presigned URL uploads
- ✅ **WebP image optimization** - Automatic conversion for cost savings & performance
- ✅ Client-side image compression (max 1MB per image)
- ✅ Zustand state management for editor
- ✅ Shadcn/ui component library
- ✅ Tailwind CSS styling
- ✅ Custom React hooks
- ✅ API routes for server-side operations

## ⚡ Performance Optimizations

### WebP Image Conversion
All uploaded images (JPG, PNG, etc.) are automatically:
- **Converted to WebP format** - Up to 30% smaller file size
- **Compressed to max 1MB** - Faster loading times
- **Resized to Full HD (1920px)** - Optimal for web display
- **Processed client-side** - No server overhead

### SEO & Conversion Optimizations
- **Structured Data (Schema.org)** - Better search engine visibility
- **Open Graph & Twitter Cards** - Beautiful social media previews
- **Semantic HTML5** - Accessible and SEO-friendly markup
- **Mobile-first responsive design** - Perfect on all devices
- **Optimized metadata** - Rich snippets in search results
- **PWA support** - Installable as mobile app (manifest.json)
- **Conversion-focused CTAs** - Clear user journey
- **Social proof elements** - Trust signals for visitors

This reduces storage costs on R2 and improves page load performance significantly.

## 🚦 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🔒 Security

- ✅ All uploads use presigned URLs (no direct S3 access)
- ✅ Supabase RLS Policies for PostgreSQL
- ✅ Authentication required for creating memories
- ✅ Server-side validation with Zod
- ✅ SSR-safe Supabase initialization

## 📚 Documentation

## 📚 Documentation

- **MIGRATION.md** - Complete Firebase → Supabase migration guide with SQL schema
- **README.md** - This file, project overview and setup

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [Shadcn/ui Documentation](https://ui.shadcn.com/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📄 License

MIT License - feel free to use this project for your own purposes.

---

**Built with ❤️ using Next.js 14, Supabase, and Cloudflare R2**
#   E t e r n a l i z e  
 