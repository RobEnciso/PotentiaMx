/**
 * Device Detection and Capability Utilities
 * Detecta si el usuario está en móvil/tablet y qué capacidades tiene
 */

/**
 * Detectar si es un dispositivo móvil o tablet
 * @returns {boolean}
 */
export function isMobileDevice() {
  if (typeof window === 'undefined') return false;

  // Método 1: User Agent (menos confiable pero amplio)
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
  const isMobileUA = mobileRegex.test(userAgent.toLowerCase());

  // Método 2: Touch capability
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Método 3: Screen size (tablet/móvil típico)
  const isSmallScreen = window.innerWidth <= 1024;

  // Es móvil si cumple UA O (tiene touch Y pantalla pequeña)
  return isMobileUA || (hasTouch && isSmallScreen);
}

/**
 * Detectar si es específicamente un tablet (no smartphone)
 * @returns {boolean}
 */
export function isTablet() {
  if (typeof window === 'undefined') return false;

  const userAgent = navigator.userAgent.toLowerCase();
  const isIPad = /ipad/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroidTablet = /android/.test(userAgent) && !/mobile/.test(userAgent);

  return isIPad || isAndroidTablet;
}

/**
 * Detectar si tiene capacidad táctil
 * @returns {boolean}
 */
export function hasTouchSupport() {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}

/**
 * Obtener el tamaño de pantalla
 * @returns {{width: number, height: number, orientation: 'portrait'|'landscape'}}
 */
export function getScreenSize() {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0, orientation: 'portrait' };
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  const orientation = width > height ? 'landscape' : 'portrait';

  return { width, height, orientation };
}

/**
 * Detectar el sistema operativo
 * @returns {'ios'|'android'|'windows'|'macos'|'linux'|'unknown'}
 */
export function getOperatingSystem() {
  if (typeof window === 'undefined') return 'unknown';

  const userAgent = navigator.userAgent.toLowerCase();

  if (/iphone|ipad|ipod/.test(userAgent)) return 'ios';
  if (/android/.test(userAgent)) return 'android';
  if (/win/.test(userAgent)) return 'windows';
  if (/mac/.test(userAgent)) return 'macos';
  if (/linux/.test(userAgent)) return 'linux';

  return 'unknown';
}

/**
 * Hook para React que devuelve información del dispositivo
 * Se puede usar en componentes para adaptar la UI
 */
export function useDeviceDetection() {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isTablet: false,
      hasTouch: false,
      screenSize: { width: 0, height: 0, orientation: 'portrait' },
      os: 'unknown',
    };
  }

  return {
    isMobile: isMobileDevice(),
    isTablet: isTablet(),
    hasTouch: hasTouchSupport(),
    screenSize: getScreenSize(),
    os: getOperatingSystem(),
  };
}

/**
 * Constantes de breakpoints (mismo que Tailwind por defecto)
 */
export const BREAKPOINTS = {
  sm: 640,   // móvil grande / phablet
  md: 768,   // tablet
  lg: 1024,  // laptop
  xl: 1280,  // desktop
  '2xl': 1536, // desktop grande
};

/**
 * Verificar si la pantalla es menor que un breakpoint
 * @param {'sm'|'md'|'lg'|'xl'|'2xl'} breakpoint
 * @returns {boolean}
 */
export function isScreenSmallerThan(breakpoint) {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < BREAKPOINTS[breakpoint];
}

/**
 * Obtener el tamaño ideal de target touch según plataforma
 * iOS HIG: 44x44pt mínimo
 * Material Design: 48x48dp mínimo
 * @returns {number} - Tamaño en píxeles
 */
export function getRecommendedTouchTargetSize() {
  const os = getOperatingSystem();

  // iOS recomienda 44pt, Android recomienda 48dp
  // En web usamos píxeles directamente
  if (os === 'ios') return 44;
  if (os === 'android') return 48;

  // Fallback genérico
  return 48;
}
