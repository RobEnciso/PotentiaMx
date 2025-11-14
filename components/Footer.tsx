'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Footer() {
  const [showCookieSettings, setShowCookieSettings] = useState(false);

  const handleCookieSettings = () => {
    // Limpiar el consentimiento para que vuelva a aparecer el banner
    localStorage.removeItem('cookieConsent');
    localStorage.removeItem('cookieConsentDate');
    // Recargar la página para mostrar el banner
    window.location.reload();
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo y descripción */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl font-bold text-teal-400">Potentia</span>
              <span className="text-2xl font-bold text-cyan-400">MX</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Plataforma de tours virtuales 360° para propiedades inmobiliarias.
              Crea experiencias inmersivas profesionales en minutos.
            </p>
            <div className="flex space-x-4">
              <a
                href="mailto:hola@potentiamx.com"
                className="text-gray-400 hover:text-teal-400 transition-colors"
                title="Email"
              >
                📧
              </a>
              <a
                href="tel:+523223550795"
                className="text-gray-400 hover:text-teal-400 transition-colors"
                title="Teléfono"
              >
                📱
              </a>
              <a
                href="https://potentiamx.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-teal-400 transition-colors"
                title="Sitio web"
              >
                🌐
              </a>
            </div>
          </div>

          {/* Producto */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Producto
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-400 hover:text-teal-400 transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-gray-400 hover:text-teal-400 transition-colors"
                >
                  Planes y Precios
                </Link>
              </li>
              <li>
                <Link
                  href="/demo"
                  className="text-gray-400 hover:text-teal-400 transition-colors"
                >
                  Ver Demo
                </Link>
              </li>
              <li>
                <Link
                  href="/features"
                  className="text-gray-400 hover:text-teal-400 transition-colors"
                >
                  Características
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Legal
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/legal/privacidad"
                  className="text-gray-400 hover:text-teal-400 transition-colors"
                >
                  Aviso de Privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/terminos"
                  className="text-gray-400 hover:text-teal-400 transition-colors"
                >
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/cookies"
                  className="text-gray-400 hover:text-teal-400 transition-colors"
                >
                  Política de Cookies
                </Link>
              </li>
              <li>
                <button
                  onClick={handleCookieSettings}
                  className="text-gray-400 hover:text-teal-400 transition-colors text-left"
                >
                  ⚙️ Configuración de Cookies
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Información de contacto */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="text-white font-semibold mb-2">
                Datos de Contacto
              </h4>
              <p className="text-gray-400">
                <strong>Email:</strong>{' '}
                <a
                  href="mailto:hola@potentiamx.com"
                  className="hover:text-teal-400 transition-colors"
                >
                  hola@potentiamx.com
                </a>
              </p>
              <p className="text-gray-400">
                <strong>Email legal:</strong>{' '}
                <a
                  href="mailto:legal@potentiamx.com"
                  className="hover:text-teal-400 transition-colors"
                >
                  legal@potentiamx.com
                </a>
              </p>
              <p className="text-gray-400">
                <strong>Teléfono:</strong>{' '}
                <a
                  href="tel:+523223550795"
                  className="hover:text-teal-400 transition-colors"
                >
                  +52 322 355 0795
                </a>
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-2">Datos Fiscales</h4>
              <p className="text-gray-400">
                <strong>Responsable:</strong> José Roberto Enciso Sánchez
              </p>
              <p className="text-gray-400">
                <strong>RFC:</strong> EISR870806JHA
              </p>
              <p className="text-gray-400">
                <strong>Domicilio:</strong> Pimpinela 521, Col. Palmar del
                Progreso, Puerto Vallarta, Jalisco, México
              </p>
            </div>
          </div>
        </div>

        {/* Copyright y badges */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500 text-center md:text-left">
              © {currentYear} <span className="text-teal-400">PotentiaMX</span>{' '}
              - Todos los derechos reservados
            </p>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="text-green-400">✓</span> Seguro SSL
              </span>
              <span className="flex items-center gap-1">
                <span className="text-green-400">✓</span> LFPDPPP
              </span>
              <span className="flex items-center gap-1">
                <span className="text-green-400">✓</span> Pagos seguros
              </span>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-600">
              Hecho en México 🇲🇽 con ❤️ para el mercado inmobiliario
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
