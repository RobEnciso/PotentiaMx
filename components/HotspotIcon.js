'use client';

/**
 * Componente de iconos para hotspots
 * Renderiza iconos SVG según el tipo de hotspot
 * Diseñados para ser minimalistas y no saturar visualmente el visor
 */

export default function HotspotIcon({ type = 'navigation', size = 24, color = 'white' }) {
  const icons = {
    // 📍 Navegación - Flecha direccional
    navigation: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill={color} opacity="0.9" />
        <path
          d="M12 6L12 18M12 18L16 14M12 18L8 14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),

    // ℹ️ Información - Círculo con "i"
    info: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill={color} opacity="0.9" />
        <path
          d="M12 16V12M12 8H12.01"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    ),

    // 📸 Imagen - Cámara
    image: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill={color} opacity="0.9" />
        <rect
          x="6"
          y="9"
          width="12"
          height="9"
          rx="1"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle cx="12" cy="13" r="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 9L10 7H14L15 9" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),

    // 🎥 Video - Play button
    video: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill={color} opacity="0.9" />
        <path
          d="M10 8.5L16 12L10 15.5V8.5Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>
    ),

    // 🔊 Audio Ambiente - Ondas de sonido
    audio: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill={color} opacity="0.9" />
        <path
          d="M8 10V14M12 8V16M16 10V14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),

    // 🎙️ Narración - Micrófono
    narration: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill={color} opacity="0.9" />
        <path
          d="M12 6C10.8954 6 10 6.89543 10 8V12C10 13.1046 10.8954 14 12 14C13.1046 14 14 13.1046 14 12V8C14 6.89543 13.1046 6 12 6Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M8 11C8 13.2091 9.79086 15 12 15C14.2091 15 16 13.2091 16 11"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path d="M12 15V18M10 18H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  };

  return (
    <div className="hotspot-icon" style={{ color: 'white' }}>
      {icons[type] || icons.navigation}
    </div>
  );
}

/**
 * Función helper para obtener el HTML del icono como string
 * Útil para insertarlo directamente en Photo Sphere Viewer
 */
export function getHotspotIconHTML(type = 'navigation', size = 32) {
  const baseStyle = `width: ${size}px; height: ${size}px; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));`;

  const icons = {
    navigation: `<svg style="${baseStyle}" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="white" opacity="0.95"/><path d="M12 6L12 18M12 18L16 14M12 18L8 14" stroke="#1d1d1f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,

    info: `<svg style="${baseStyle}" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#3b82f6" opacity="0.95"/><path d="M12 16V12M12 8H12.01" stroke="white" stroke-width="2.5" stroke-linecap="round"/></svg>`,

    image: `<svg style="${baseStyle}" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#8b5cf6" opacity="0.95"/><rect x="6" y="9" width="12" height="9" rx="1" stroke="white" stroke-width="1.5"/><circle cx="12" cy="13" r="2" stroke="white" stroke-width="1.5"/><path d="M9 9L10 7H14L15 9" stroke="white" stroke-width="1.5"/></svg>`,

    video: `<svg style="${baseStyle}" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#ef4444" opacity="0.95"/><path d="M10 8.5L16 12L10 15.5V8.5Z" fill="white" stroke="white" stroke-width="1"/></svg>`,

    audio: `<svg style="${baseStyle}" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#10b981" opacity="0.95"/><path d="M8 10V14M12 8V16M16 10V14" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>`,

    narration: `<svg style="${baseStyle}" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#f59e0b" opacity="0.95"/><path d="M12 6C10.8954 6 10 6.89543 10 8V12C10 13.1046 10.8954 14 12 14C13.1046 14 14 13.1046 14 12V8C14 6.89543 13.1046 6 12 6Z" stroke="white" stroke-width="1.5"/><path d="M8 11C8 13.2091 9.79086 15 12 15C14.2091 15 16 13.2091 16 11" stroke="white" stroke-width="1.5" stroke-linecap="round"/><path d="M12 15V18M10 18H14" stroke="white" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  };

  return icons[type] || icons.navigation;
}

/**
 * Colores por tipo de hotspot
 */
export const HOTSPOT_COLORS = {
  navigation: '#ffffff', // Blanco
  info: '#3b82f6',       // Azul
  image: '#8b5cf6',      // Morado
  video: '#ef4444',      // Rojo
  audio: '#10b981',      // Verde
  narration: '#f59e0b',  // Naranja/Ámbar
};
