'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface LegalLayoutProps {
  children: React.ReactNode;
  title: string;
  lastUpdated: string;
}

export default function LegalLayout({
  children,
  title,
  lastUpdated,
}: LegalLayoutProps) {
  const pathname = usePathname();

  const legalPages = [
    { name: 'Aviso de Privacidad', path: '/legal/privacidad' },
    { name: 'Términos y Condiciones', path: '/legal/terminos' },
    { name: 'Política de Cookies', path: '/legal/cookies' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link
              href="/"
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <span className="text-2xl font-bold text-teal-600">Potentia</span>
              <span className="text-2xl font-bold text-cyan-600">MX</span>
            </Link>
            <nav className="flex space-x-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-teal-600 transition-colors text-sm font-medium"
              >
                Inicio
              </Link>
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-teal-600 transition-colors text-sm font-medium"
              >
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-24">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Información Legal
              </h3>
              <nav className="space-y-2">
                {legalPages.map((page) => {
                  const isActive = pathname === page.path;
                  return (
                    <Link
                      key={page.path}
                      href={page.path}
                      className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-teal-50 text-teal-700 border-l-4 border-teal-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {page.name}
                    </Link>
                  );
                })}
              </nav>

              {/* Contact Card */}
              <div className="mt-8 p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg border border-teal-100">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">
                  ¿Tienes dudas?
                </h4>
                <p className="text-xs text-gray-600 mb-3">
                  Contáctanos para resolver tus preguntas legales
                </p>
                <a
                  href="mailto:legal@potentiamx.com"
                  className="text-xs font-medium text-teal-600 hover:text-teal-700 break-all"
                >
                  legal@potentiamx.com
                </a>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Document Header */}
              <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-8 py-12">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {title}
                </h1>
                <p className="text-teal-100 text-sm">
                  Última actualización: {lastUpdated}
                </p>
              </div>

              {/* Document Content */}
              <div className="px-8 py-12 prose prose-slate max-w-none">
                {children}
              </div>

              {/* Footer Contact */}
              <div className="bg-gray-50 px-8 py-8 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      Datos de Contacto
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>
                        <span className="font-medium">Email:</span>{' '}
                        legal@potentiamx.com
                      </p>
                      <p>
                        <span className="font-medium">Teléfono:</span> +52 322
                        355 0795
                      </p>
                      <p>
                        <span className="font-medium">Web:</span>{' '}
                        <a
                          href="https://potentiamx.com"
                          className="text-teal-600 hover:underline"
                        >
                          potentiamx.com
                        </a>
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      Domicilio Legal
                    </h3>
                    <p className="text-sm text-gray-600">
                      Pimpinela 521, Col. Palmar del Progreso
                      <br />
                      Puerto Vallarta, Jalisco, México
                      <br />
                      RFC: EISR870806JHA
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links to Other Legal Pages */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              {legalPages
                .filter((page) => page.path !== pathname)
                .map((page) => (
                  <Link
                    key={page.path}
                    href={page.path}
                    className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 hover:border-teal-300"
                  >
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                      {page.name}
                    </h4>
                    <p className="text-xs text-gray-500">Ver documento →</p>
                  </Link>
                ))}
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm">
            <p>© 2025 PotentiaMX - Todos los derechos reservados</p>
            <p className="mt-2 text-gray-500">
              José Roberto Enciso Sánchez | RFC: EISR870806JHA
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
