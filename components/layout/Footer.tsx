'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Mail,
  MapPin,
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleCookieSettings = () => {
    // Limpiar el consentimiento para que vuelva a aparecer el banner
    localStorage.removeItem('cookieConsent');
    localStorage.removeItem('cookieConsentDate');
    // Recargar la página para mostrar el banner
    window.location.reload();
  };

  const navigation = {
    producto: [
      { name: 'Características', href: '#caracteristicas' },
      { name: 'Precios', href: '#precios' },
      { name: 'Tours de Ejemplo', href: '#tours' },
      { name: 'Dashboard', href: '/dashboard' },
    ],
    empresa: [
      { name: 'Sobre Nosotros', href: '#nosotros' },
      { name: 'Blog', href: '#blog' },
      { name: 'Contacto', href: '#contacto' },
      { name: 'Ayuda', href: '#ayuda' },
    ],
    legal: [
      { name: 'Aviso de Privacidad', href: '/legal/privacidad' },
      { name: 'Términos y Condiciones', href: '/legal/terminos' },
      { name: 'Política de Cookies', href: '/legal/cookies' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 sm:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-2">
              <Image
                src="/logo-page-white.png"
                alt="PotentiaMX"
                width={600}
                height={150}
                className="h-8 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-teal-400 font-semibold mb-4">
              Potencia tu propiedad
            </p>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              La plataforma mexicana de tours virtuales 360° inmersivos que
              potencia tus ventas inmobiliarias.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-teal-400 flex-shrink-0 mt-1" />
                <span className="text-slate-400">
                  Puerto Vallarta, Jalisco, México
                </span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Mail className="w-4 h-4 text-teal-400 flex-shrink-0 mt-1" />
                <a
                  href="mailto:hola@potentiamx.com"
                  className="text-slate-400 hover:text-teal-400 transition-colors"
                >
                  hola@potentiamx.com
                </a>
              </div>
            </div>
          </div>

          {/* Producto Column */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Producto
            </h4>
            <ul className="space-y-3">
              {navigation.producto.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-400 hover:text-teal-400 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa Column */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Empresa
            </h4>
            <ul className="space-y-3">
              {navigation.empresa.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-400 hover:text-teal-400 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-3">
              {navigation.legal.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-400 hover:text-teal-400 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <p className="text-sm text-slate-500 text-center sm:text-left">
                © {currentYear} PotentiaMX. Todos los derechos reservados.
              </p>
              <button
                onClick={handleCookieSettings}
                className="text-xs text-slate-400 hover:text-teal-400 transition-colors underline"
              >
                ⚙️ Configuración de Cookies
              </button>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-slate-400 hover:text-teal-400 transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Legal & Security Badges */}
          <div className="mt-6 flex flex-wrap justify-center items-center gap-4 text-xs text-slate-600">
            <span className="flex items-center gap-1">
              <span className="text-green-400">✓</span> Seguro SSL
            </span>
            <span className="flex items-center gap-1">
              <span className="text-green-400">✓</span> LFPDPPP
            </span>
            <span className="flex items-center gap-1">
              <span className="text-green-400">✓</span> Datos Protegidos
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
