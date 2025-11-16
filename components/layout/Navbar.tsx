'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, LayoutDashboard, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Detectar si el usuario está autenticado
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setIsAuthenticated(true);
        setUserEmail(session.user.email || '');
      } else {
        setIsAuthenticated(false);
        setUserEmail('');
      }
    };

    checkAuth();

    // Suscribirse a cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsAuthenticated(true);
        setUserEmail(session.user.email || '');
      } else {
        setIsAuthenticated(false);
        setUserEmail('');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsMobileMenuOpen(false);
    router.push('/');
  };

  // Manejar click en enlaces internos con scroll suave
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    // Solo manejar enlaces con # (scroll interno)
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        // Cerrar menú móvil si está abierto
        setIsMobileMenuOpen(false);

        // Scroll suave al elemento
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });

        // Actualizar URL sin recargar la página
        window.history.pushState(null, '', href);
      }
    }
    // Si es un enlace normal (/propiedades), dejarlo navegar normalmente
  };

  const navigation = [
    { name: 'Propiedades', href: '/propiedades' },
    { name: 'Características', href: '#caracteristicas' },
    { name: 'Precios', href: '#precios' },
    { name: 'Contacto', href: '#contacto' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo-full.png"
              alt="PotentiaMX"
              width={150}
              height={40}
              priority
              className="h-8 sm:h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`text-sm font-medium transition-colors ${
                  isScrolled
                    ? 'text-slate-700 hover:text-teal-500'
                    : 'text-white hover:text-teal-300'
                }`}
              >
                {item.name}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className={`inline-flex items-center gap-2 text-sm font-medium transition-colors ${
                    isScrolled
                      ? 'text-slate-700 hover:text-teal-500'
                      : 'text-white hover:text-teal-300'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className={`inline-flex items-center gap-2 text-sm font-medium transition-colors ${
                    isScrolled
                      ? 'text-slate-700 hover:text-red-500'
                      : 'text-white hover:text-red-300'
                  }`}
                >
                  <LogOut className="w-4 h-4" />
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`text-sm font-medium transition-colors ${
                    isScrolled
                      ? 'text-slate-700 hover:text-teal-500'
                      : 'text-white hover:text-teal-300'
                  }`}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/signup"
                  className="px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                  Comenzar Gratis
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isScrolled
                ? 'text-slate-900 hover:bg-slate-100'
                : 'text-white hover:bg-white/10'
            }`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 bg-white rounded-b-2xl shadow-xl">
            <div className="flex flex-col gap-2">
              {/* Usuario autenticado */}
              {isAuthenticated && userEmail && (
                <div className="px-4 py-3 bg-teal-50 rounded-lg mb-2 mx-2">
                  <p className="text-xs text-slate-600 mb-1">
                    Sesión iniciada como:
                  </p>
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {userEmail}
                  </p>
                </div>
              )}

              {/* Enlaces de navegación */}
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-4 py-3 text-slate-700 hover:bg-slate-50 hover:text-teal-500 rounded-lg transition-colors"
                  onClick={(e) => handleNavClick(e, item.href)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Opciones según autenticación */}
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="mx-2 mt-2 px-4 py-3 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Ir al Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="mx-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-3 text-slate-700 hover:bg-slate-50 hover:text-teal-500 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    href="/signup"
                    className="mx-2 mt-2 px-4 py-3 bg-teal-500 hover:bg-teal-600 text-white font-medium text-center rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Comenzar Gratis
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
