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
    default: "Eternizale - Crie Belas Páginas de Memória Digital Para Sempre",
    template: "%s | Eternizale"
  },
  description: "Transforme seus momentos preciosos em lindas páginas de memória digital. Adicione fotos, vídeos, música e mensagens de voz. Perfeito para presentes, celebrações e preservar memórias para sempre. Comece grátis hoje!",
  keywords: [
    "memórias digitais",
    "páginas de memória",
    "álbum de fotos",
    "presente digital",
    "preservação de memórias",
    "colagem de fotos",
    "scrapbook digital",
    "presente de celebração",
    "livro de memórias",
    "memórias eternas"
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
    title: "Eternizale - Crie Belas Páginas de Memória Digital Para Sempre",
    description: "Transforme seus momentos preciosos em lindas páginas de memória digital. Perfeito para presentes e celebrações. Comece grátis!",
    url: '/',
    siteName: 'Eternizale',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Eternizale - Páginas de Memória Digital',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Eternizale - Crie Belas Páginas de Memória Digital",
    description: "Transforme momentos preciosos em lindas memórias digitais. Grátis para começar!",
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
