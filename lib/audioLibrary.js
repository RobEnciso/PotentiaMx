/**
 * Librería de Audios Pre-cargados
 * Audios libres de derechos para usar en tours virtuales
 */

export const AUDIO_LIBRARY = {
  ambient: [
    // ⚠️ IMPORTANTE: Los archivos de audio deben subirse a Supabase Storage
    // Bucket: hotspot-audio
    // Carpeta: libreria-sonidos/
    //
    // TODO: Subir estos 4 archivos WAV a Supabase Storage y actualizar las URLs

    {
      id: 'forest-morning',
      name: 'Bosque - Mañana con Pájaros',
      description: 'Ambiente de bosque matutino con canto de pájaros',
      file: 'https://tuhojmupstisctgaepsc.supabase.co/storage/v1/object/public/hotspot-audio/libreria-sonidos/forest-morning.wav',
      duration: '3:45',
      type: 'ambient',
      tags: ['naturaleza', 'pájaros', 'bosque', 'mañana'],
      recommendedVolume: 0.3,
      loop: true,
    },
    {
      id: 'jungle-birds',
      name: 'Selva - Especies de Pájaros',
      description: 'Ambiente de selva con diversas especies de aves',
      file: 'https://tuhojmupstisctgaepsc.supabase.co/storage/v1/object/public/hotspot-audio/libreria-sonidos/jungle-birds.wav',
      duration: '4:12',
      type: 'ambient',
      tags: ['selva', 'tropical', 'pájaros', 'exótico'],
      recommendedVolume: 0.3,
      loop: true,
    },
    {
      id: 'jungle-riverside',
      name: 'Selva - Río con Gibones',
      description: 'Río en la selva con pájaros cantando y gibón',
      file: 'https://tuhojmupstisctgaepsc.supabase.co/storage/v1/object/public/hotspot-audio/libreria-sonidos/jungle-riverside.wav',
      duration: '5:20',
      type: 'ambient',
      tags: ['río', 'selva', 'agua', 'gibón', 'tropical'],
      recommendedVolume: 0.35,
      loop: true,
    },
    {
      id: 'nightingale-forest',
      name: 'Bosque - Ruiseñor al Amanecer',
      description: 'Ruiseñor cantando en el bosque al amanecer',
      file: 'https://tuhojmupstisctgaepsc.supabase.co/storage/v1/object/public/hotspot-audio/libreria-sonidos/nightingale-forest.wav',
      duration: '4:30',
      type: 'ambient',
      tags: ['ruiseñor', 'amanecer', 'bosque', 'relajante'],
      recommendedVolume: 0.3,
      loop: true,
    },
  ],

  narration: [
    // Aquí se agregarán las narraciones subidas por el usuario
    // Por ahora vacío, se llenará dinámicamente
  ],
};

/**
 * Obtener audio por ID
 */
export function getAudioById(id) {
  const allAudios = [...AUDIO_LIBRARY.ambient, ...AUDIO_LIBRARY.narration];
  return allAudios.find((audio) => audio.id === id);
}

/**
 * Obtener audios por tipo
 */
export function getAudiosByType(type) {
  return AUDIO_LIBRARY[type] || [];
}

/**
 * Buscar audios por tags
 */
export function searchAudiosByTags(tags) {
  const allAudios = [...AUDIO_LIBRARY.ambient, ...AUDIO_LIBRARY.narration];
  return allAudios.filter((audio) =>
    audio.tags.some((tag) => tags.includes(tag)),
  );
}

/**
 * Formatear nombre de archivo para mostrar
 */
export function formatAudioName(filename) {
  return filename
    .replace(/^.*[\\/]/, '') // Eliminar path
    .replace(/\.[^/.]+$/, '') // Eliminar extensión
    .replace(/[-_]/g, ' ') // Reemplazar - y _ con espacio
    .replace(/\s+/g, ' ') // Normalizar espacios
    .trim();
}

/**
 * Validar archivo de audio
 */
export function validateAudioFile(file) {
  const validTypes = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/ogg'];
  const maxSize = 50 * 1024 * 1024; // 50MB

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Formato no válido. Usa WAV, MP3 o OGG.',
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Archivo muy grande. Máximo 50MB.',
    };
  }

  return { valid: true };
}

/**
 * Convertir WAV a MP3 (client-side)
 * Nota: Requiere librería adicional como lamejs
 * Por ahora, solo retorna recomendación
 */
export function getAudioOptimizationTip(file) {
  if (file.type === 'audio/wav') {
    const estimatedMP3Size = Math.round(file.size / 10); // WAV a MP3 reduce ~90%
    return {
      shouldOptimize: true,
      message: `Este archivo WAV (${(file.size / 1024 / 1024).toFixed(1)}MB) se puede optimizar a MP3 (~${(estimatedMP3Size / 1024 / 1024).toFixed(1)}MB) para carga más rápida.`,
      recommendedFormat: 'MP3',
      estimatedSize: estimatedMP3Size,
    };
  }

  return { shouldOptimize: false };
}

/**
 * Configuraciones recomendadas por tipo de propiedad
 */
export const AUDIO_PRESETS = {
  casa_jardin: {
    ambient: 'forest-morning',
    volume: 0.3,
    description: 'Ideal para casas con jardín o cerca de naturaleza',
  },
  casa_playa: {
    ambient: null, // Agregar cuando tengamos audio de olas
    volume: 0.35,
    description: 'Para propiedades cerca del mar',
  },
  departamento_ciudad: {
    ambient: null, // Sin audio ambiente (ciudad es ruidosa)
    volume: 0,
    description: 'Departamentos urbanos - solo narración',
  },
  terreno_rustico: {
    ambient: 'jungle-birds',
    volume: 0.3,
    description: 'Terrenos en zonas rurales o selváticas',
  },
};
