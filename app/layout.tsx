import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import 'leaflet/dist/leaflet.css';
import CookieConsent from '@/components/CookieConsent';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PotentiaMX - Tours Virtuales 360° | México',
  description:
    'Potencia tu propiedad con tours virtuales 360° inmersivos. La plataforma mexicana para agentes inmobiliarios que vende más rápido.',
  keywords:
    'tours virtuales, 360, bienes raíces, inmobiliaria, México, tours inmersivos, propiedades',
  authors: [{ name: 'PotentiaMX' }],
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%2314b8a6;stop-opacity:1" /><stop offset="100%" style="stop-color:%23f97316;stop-opacity:1" /></linearGradient></defs><rect width="100" height="100" rx="20" fill="url(%23grad)"/><text x="50" y="50" font-family="Arial,sans-serif" font-size="48" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central">P</text></svg>',
        type: 'image/svg+xml',
      },
    ],
  },
  openGraph: {
    title: 'PotentiaMX - Tours Virtuales 360°',
    description: 'Potencia tu propiedad con tours virtuales inmersivos',
    siteName: 'PotentiaMX',
    locale: 'es_MX',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${montserrat.variable} font-sans antialiased`}>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
