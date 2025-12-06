'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, LayoutDashboard, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // Scroll handler - INMEDIATO, no depende de auth
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ⚡ CRITICAL PERFORMANCE: Auth check completamente desacoplado del render
  // setTimeout(0) permite que el HTML se pinte ANTES de crear el Supabase client
  useEffect(() => {
    const timer = setTimeout(() => {
      // Lazy load Supabase SOLO después del primer paint
      import('@/lib/supabaseClient')
        .then(({ createClient }) => {
          const supabase = createClient();

          // Check inicial de sesión
          supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
              setIsAuthenticated(true);
              setUserEmail(session.user.email || '');
            }
          });

          // Suscripción a cambios de auth
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
        })
        .catch((error) => {
          console.error('Auth check failed:', error);
        });
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = async () => {
    // Lazy load para logout también
    const { createClient } = await import('@/lib/supabaseClient');
    const supabase = createClient();
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
      style={
        isScrolled
          ? { backdropFilter: 'var(--blur-lg)', WebkitBackdropFilter: 'var(--blur-lg)' }
          : { backdropFilter: 'var(--blur-lg)', WebkitBackdropFilter: 'var(--blur-lg)' }
      }
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Logo - CRÍTICO PARA LCP - Sin dependencias */}
          <Link href="/" className="flex items-center gap-2">
            {/* Logo blanco (visible cuando navbar es oscuro) */}
            <Image
              src="/logo-navbar-white.png"
              alt="PotentiaMX"
              width={200}
              height={50}
              priority
              fetchPriority="high"
              className={`h-10 sm:h-12 w-auto object-contain transition-opacity duration-300 ${
                isScrolled ? 'opacity-0 absolute' : 'opacity-100'
              }`}
            />
            {/* Logo negro (visible cuando navbar es claro) */}
            <Image
              src="/logo-navbar-black.png"
              alt="PotentiaMX"
              width={200}
              height={65}
              priority
              fetchPriority="high"
              className={`h-10 sm:h-12 w-auto object-contain transition-opacity duration-300 ${
                isScrolled ? 'opacity-100' : 'opacity-0 absolute'
              }`}
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
      </div>

      {/* MENÚ MÓVIL FULL-SCREEN OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-slate-900 h-screen w-screen flex flex-col">
          {/* Header del menú */}
          <div className="flex items-center justify-between h-18 sm:h-20 px-6 sm:px-8 border-b border-white/10 flex-shrink-0">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
              <Image
                src="/logo-navbar-white.png"
                alt="PotentiaMX"
                width={200}
                height={50}
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
              aria-label="Cerrar menú"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Contenido centrado del menú */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 bg-slate-900">
            {/* Usuario autenticado - Mostrar arriba */}
            {isAuthenticated && userEmail && (
              <div className="mb-8 px-6 py-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-xs text-white/60 mb-1 text-center">
                  Sesión iniciada como:
                </p>
                <p className="text-sm font-semibold text-white truncate max-w-[280px] text-center">
                  {userEmail}
                </p>
              </div>
            )}

            {/* Enlaces de navegación principales */}
            <nav className="flex flex-col items-center space-y-8 mb-12">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-3xl font-bold text-white hover:text-teal-400 transition-colors duration-200"
                  onClick={(e) => {
                    handleNavClick(e, item.href);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Acciones según autenticación */}
            <div className="flex flex-col items-center gap-4 w-full max-w-xs">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="w-full px-6 py-4 text-white font-semibold text-center rounded-xl transition-all duration-200 flex items-center justify-center gap-3 hover:scale-105"
                    style={{ background: 'var(--gradient-ocean)' }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-3 border border-white/20"
                  >
                    <LogOut className="w-5 h-5" />
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="w-full px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold text-center rounded-xl transition-all duration-200 border border-white/20"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
