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
          ? 'bg-white/80 backdrop-blur-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.06)] border-b border-black/[0.06]'
          : 'bg-slate-900/95 backdrop-blur-[24px] border-b border-white/10'
      }`}
      style={isScrolled ? { backdropFilter: 'var(--blur-lg)', WebkitBackdropFilter: 'var(--blur-lg)' } : { backdropFilter: 'var(--blur-lg)', WebkitBackdropFilter: 'var(--blur-lg)' }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={isScrolled ? "/logo-navbar-black.png" : "/logo-navbar-white.png"}
              alt="PotentiaMX"
              width={800}
              height={200}
              priority
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`text-sm font-medium transition-all duration-[var(--transition-fast)] ${
                  isScrolled
                    ? 'text-[var(--gray-600)] hover:text-[var(--gray-900)]'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className={`inline-flex items-center gap-2 text-sm font-medium transition-all duration-[var(--transition-fast)] ${
                    isScrolled
                      ? 'text-[var(--gray-600)] hover:text-[var(--gray-900)]'
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className={`inline-flex items-center gap-2 text-sm font-medium transition-all duration-[var(--transition-fast)] ${
                    isScrolled
                      ? 'text-[var(--gray-600)] hover:text-[var(--coral)]'
                      : 'text-white/90 hover:text-white/70'
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
                  className={`text-sm font-medium transition-all duration-[var(--transition-fast)] ${
                    isScrolled
                      ? 'text-[var(--gray-600)] hover:text-[var(--gray-900)]'
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/signup"
                  className={`px-7 py-3.5 text-white font-semibold text-sm rounded-[var(--radius-xl)] transition-all duration-[var(--transition-base)] hover:-translate-y-0.5 shadow-[var(--shadow-ocean)] hover:shadow-[0_12px_32px_rgba(20,184,166,0.35)]`}
                  style={{ background: 'var(--gradient-ocean)' }}
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
                ? 'text-[var(--gray-900)] hover:bg-[var(--gray-100)]'
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
                <div className="px-4 py-3 bg-[var(--ocean)]/10 rounded-lg mb-2 mx-2">
                  <p className="text-xs text-[var(--gray-600)] mb-1">
                    Sesión iniciada como:
                  </p>
                  <p className="text-sm font-semibold text-[var(--gray-900)] truncate">
                    {userEmail}
                  </p>
                </div>
              )}

              {/* Enlaces de navegación */}
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-4 py-3 text-[var(--gray-700)] hover:bg-[var(--gray-50)] hover:text-[var(--ocean)] rounded-lg transition-colors"
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
                    className="mx-2 mt-2 px-4 py-3 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    style={{ background: 'var(--gradient-ocean)' }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Ir al Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="mx-2 px-4 py-3 bg-[var(--coral)]/10 hover:bg-[var(--coral)]/20 text-[var(--coral-dark)] font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-3 text-[var(--gray-700)] hover:bg-[var(--gray-50)] hover:text-[var(--ocean)] rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    href="/signup"
                    className="mx-2 mt-2 px-4 py-3 text-white font-medium text-center rounded-lg transition-colors"
                    style={{ background: 'var(--gradient-ocean)' }}
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
