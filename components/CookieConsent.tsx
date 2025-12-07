'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type CookiePreferences = {
  essential: boolean; // Siempre true, no se puede desactivar
  analytics: boolean;
  marketing: boolean;
};

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Verificar si el usuario ya dio consentimiento
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // ⚡ MOBILE PERFORMANCE: Delay banner until user has had time to see content
      // Desktop: 2s is negligible, Mobile: prevents banner from blocking LCP/FCP
      setTimeout(() => setShowBanner(true), 2000);
    } else {
      // Cargar preferencias guardadas
      try {
        const savedPreferences = JSON.parse(consent);
        setPreferences(savedPreferences);
        applyPreferences(savedPreferences);
      } catch (e) {
        console.error('Error parsing cookie preferences:', e);
      }
    }
  }, []);

  const applyPreferences = (prefs: CookiePreferences) => {
    // Aquí aplicarías las preferencias reales
    // Por ejemplo, habilitar/deshabilitar Google Analytics

    if (typeof window !== 'undefined') {
      // Google Analytics
      if (prefs.analytics && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'granted',
        });
      } else if ((window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'denied',
        });
      }

      // Marketing/Advertising
      if (prefs.marketing && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          ad_storage: 'granted',
          ad_user_data: 'granted',
          ad_personalization: 'granted',
        });
      } else if ((window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
        });
      }
    }
  };

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      essential: true,
      analytics: true,
      marketing: true,
    };
    savePreferences(allAccepted);
  };

  const handleRejectAll = () => {
    const onlyEssential: CookiePreferences = {
      essential: true,
      analytics: false,
      marketing: false,
    };
    savePreferences(onlyEssential);
  };

  const handleSaveCustom = () => {
    savePreferences(preferences);
  };

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookieConsent', JSON.stringify(prefs));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    applyPreferences(prefs);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleTogglePreference = (key: keyof CookiePreferences) => {
    if (key === 'essential') return; // No se puede desactivar
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Overlay oscuro cuando están abiertas las configuraciones */}
      {showSettings && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowSettings(false)}
        />
      )}

      {/* Banner principal */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-gray-200 shadow-2xl">
        {!showSettings ? (
          // Vista simple del banner
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🍪</span>
                  <h3 className="text-lg font-bold text-gray-900">
                    Utilizamos cookies
                  </h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Utilizamos cookies esenciales para el funcionamiento del sitio
                  y cookies opcionales para analytics y marketing. Puedes
                  personalizar tus preferencias o aceptar todas.{' '}
                  <Link
                    href="/legal/cookies"
                    className="text-teal-600 hover:text-teal-700 underline font-medium"
                  >
                    Más información
                  </Link>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  ⚙️ Personalizar
                </button>
                <button
                  onClick={handleRejectAll}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Rechazar opcionales
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-teal-600 to-cyan-600 rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all shadow-md hover:shadow-lg"
                >
                  ✓ Aceptar todas
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Vista de configuración detallada
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span>⚙️</span> Configuración de Cookies
              </h3>
              <p className="text-sm text-gray-600">
                Selecciona qué tipos de cookies deseas permitir. Las cookies
                esenciales son necesarias para el funcionamiento del sitio.
              </p>
            </div>

            <div className="space-y-4 mb-6">
              {/* Cookies Esenciales */}
              <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">🔐</span>
                      <h4 className="font-semibold text-gray-900">
                        Cookies Esenciales
                      </h4>
                      <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded">
                        Siempre activas
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Necesarias para autenticación, seguridad y funcionamiento
                      básico del sitio. No se pueden desactivar.
                    </p>
                  </div>
                  <div className="ml-4">
                    <div className="w-12 h-6 bg-green-500 rounded-full flex items-center justify-end px-1">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cookies de Analytics */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-teal-300 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">📊</span>
                      <h4 className="font-semibold text-gray-900">
                        Cookies de Analytics
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      Nos ayudan a entender cómo los usuarios interactúan con el
                      sitio para mejorar la experiencia. Datos anónimos y
                      agregados.
                    </p>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => handleTogglePreference('analytics')}
                      className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                        preferences.analytics
                          ? 'bg-teal-500 justify-end'
                          : 'bg-gray-300 justify-start'
                      } px-1`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Cookies de Marketing */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-teal-300 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">🎯</span>
                      <h4 className="font-semibold text-gray-900">
                        Cookies de Marketing
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      Permiten mostrar anuncios relevantes en otros sitios web y
                      medir la efectividad de nuestras campañas publicitarias.
                    </p>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => handleTogglePreference('marketing')}
                      className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                        preferences.marketing
                          ? 'bg-teal-500 justify-end'
                          : 'bg-gray-300 justify-start'
                      } px-1`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <Link
                href="/legal/cookies"
                className="text-sm text-teal-600 hover:text-teal-700 underline font-medium"
              >
                Ver Política de Cookies completa →
              </Link>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveCustom}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-teal-600 to-cyan-600 rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all shadow-md hover:shadow-lg"
                >
                  ✓ Guardar preferencias
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
