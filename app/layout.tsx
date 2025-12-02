import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/supabase/auth-context";
import { Toaster } from "sonner";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: "Eternizale - Create Beautiful Digital Memory Pages Forever",
    template: "%s | Eternizale"
  },
  description: "Transform your precious moments into stunning digital memory pages. Add photos, videos, music, and voice messages. Perfect for gifts, celebrations, and preserving memories forever. Start free today!",
  keywords: [
    "digital memories",
    "memory pages",
    "photo album",
    "digital gift",
    "memory preservation",
    "photo collage",
    "digital scrapbook",
    "celebration gift",
    "memory book",
    "eternal memories"
  ],
  authors: [{ name: "Eternizale" }],
  creator: "Eternizale",
  publisher: "Eternizale",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
    ],
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://eternizale.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Eternizale - Create Beautiful Digital Memory Pages Forever",
    description: "Transform your precious moments into stunning digital memory pages. Perfect for gifts and celebrations. Start free!",
    url: '/',
    siteName: 'Eternizale',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Eternizale - Digital Memory Pages',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Eternizale - Create Beautiful Digital Memory Pages",
    description: "Transform precious moments into stunning digital memories. Free to start!",
    images: ['/og-image.png'],
    creator: '@eternizale',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster 
            position="top-right" 
            richColors 
            closeButton
            toastOptions={{
              duration: 4000,
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
