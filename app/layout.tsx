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
