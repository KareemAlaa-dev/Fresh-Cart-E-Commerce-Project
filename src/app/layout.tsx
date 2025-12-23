import type { Metadata, Viewport } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Layout/navbar";
import Footer from "@/components/Layout/footer";
import { Toaster } from "react-hot-toast";
import ProvidersContainer from "@/components/StoreProvider/ProvidersContainer";
import Warmup from "@/components/Warmup/Warmup";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

// Optimized font loading with subset and display swap
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
  adjustFontFallback: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["Courier New", "monospace"],
  adjustFontFallback: true,
});

// Viewport configuration for mobile performance
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#003c1b",
  colorScheme: "light",
};

// Enhanced metadata for SEO and performance
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: {
    template: '%s | Fresh Cart',
    default: 'Fresh Cart - Your One-Stop Shop for Fresh Groceries',
  },
  description: 'Fresh Cart offers the freshest groceries delivered to your doorstep. Shop organic produce, pantry staples, and more.',
  keywords: ['grocery', 'organic', 'fresh produce', 'online shopping', 'delivery'],
  authors: [{ name: 'Fresh Cart' }],
  creator: 'Fresh Cart',
  publisher: 'Fresh Cart',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://fresh-cart.com',
    siteName: 'Fresh Cart',
    title: 'Fresh Cart - Your One-Stop Shop for Fresh Groceries',
    description: 'Fresh Cart offers the freshest groceries delivered to your doorstep.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Fresh Cart',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fresh Cart - Your One-Stop Shop for Fresh Groceries',
    description: 'Fresh Cart offers the freshest groceries delivered to your doorstep.',
    images: ['/og-image.jpg'],
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
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains for faster resource loading */}
        <link rel="preconnect" href="https://ecommerce.routemisr.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://ecommerce.routemisr.com" />
        
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="/_next/static/media/geist-sans.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ProvidersContainer session={session}>
          <Warmup />
          <Navbar />
          {children}
          <Footer />
          <Toaster 
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </ProvidersContainer>
        <SpeedInsights />
      </body>
    </html>
  );
}
