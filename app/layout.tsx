import type { Metadata } from 'next';
import { Montserrat, Inter } from 'next/font/google';
import './globals.css';
import 'leaflet/dist/leaflet.css';
import { PostHogProvider } from './providers/PostHogProvider';
import CookieConsentWrapper from '@/components/CookieConsentWrapper';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PotentiaMX - Tours Virtuales 360° | México',
  description:
    'Potencia tu propiedad con tours virtuales 360° inmersivos. La plataforma mexicana para agentes inmobiliarios que vende más rápido.',
  keywords:
    'tours virtuales, 360, bienes raíces, inmobiliaria, México, tours inmersivos, propiedades, puerto vallarta, terrenos, casas, departamentos',
  authors: [{ name: 'PotentiaMX' }],
  metadataBase: new URL('https://potentiamx.com'),
  openGraph: {
    title: 'PotentiaMX - Tours Virtuales 360°',
    description:
      'Potencia tu propiedad con tours virtuales 360° inmersivos. La plataforma mexicana para agentes inmobiliarios que vende más rápido.',
    url: 'https://potentiamx.com',
    siteName: 'PotentiaMX',
    locale: 'es_MX',
    type: 'website',
    images: [
      {
        url: '/logo-full.png',
        width: 1200,
        height: 630,
        alt: 'PotentiaMX - Tours Virtuales 360°',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PotentiaMX - Tours Virtuales 360°',
    description:
      'Potencia tu propiedad con tours virtuales 360° inmersivos',
    images: ['/logo-full.png'],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* ⚡ MOBILE PERFORMANCE: DNS prefetch for Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Preload critical LCP images to prevent Brave/mobile blocking */}
        <link
          rel="preload"
          href="/logo-navbar-white.png"
          as="image"
          fetchPriority="high"
        />
        <link
          rel="preload"
          href="/logo-navbar-black.png"
          as="image"
          fetchPriority="high"
        />

        {/* ⚡ MOBILE: Viewport optimization for better mobile rendering */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
      </head>
      <body
        className={`${montserrat.variable} ${inter.variable} font-sans antialiased`}
      >
        <PostHogProvider>
          {children}
          <CookieConsentWrapper />
        </PostHogProvider>
      </body>
    </html>
  );
}
