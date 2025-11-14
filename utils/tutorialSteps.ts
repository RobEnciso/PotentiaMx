/**
 * Pasos del tutorial para el Dashboard - Diseño Minimalista Coach Marks
 * Textos concisos optimizados para burbujas compactas
 */
export const dashboardTutorialSteps = [
  {
    target: '[data-tutorial="add-terrain-button"]',
    title: '1. Crear Tour 360°',
    description:
      'Sube tus fotos panorámicas y crea tours virtuales inmersivos.',
    position: 'bottom' as const,
  },
  {
    target: '[data-tutorial="view-button"]',
    title: '2. Vista Pública',
    description:
      'Así verán el tour tus clientes. Prueba la experiencia completa.',
    position: 'left' as const,
  },
  {
    target: '[data-tutorial="edit-button"]',
    title: '3. Editar Propiedad',
    description: 'Actualiza título, precio, ubicación y descripción del tour.',
    position: 'left' as const,
  },
  {
    target: '[data-tutorial="hotspots-button"]',
    title: '4. Puntos de Navegación',
    description:
      'Conecta vistas con hotspots para crear recorridos interactivos.',
    position: 'left' as const,
  },
  {
    target: '[data-tutorial="embed-button"]',
    title: '5. Insertar en Web',
    description: 'Copia el código para embeber el tour en tu sitio web.',
    position: 'left' as const,
  },
  {
    target: '[data-tutorial="marketplace-toggle"]',
    title: '6. Publicar Online',
    description: 'Activa para mostrar en el catálogo público de propiedades.',
    position: 'top' as const,
  },
];

/**
 * Pasos del tutorial para el Editor de Hotspots
 */
export const editorTutorialSteps = [
  {
    target: '[data-tutorial="panorama-viewer"]',
    title: '1. Visor 360°',
    description:
      'Arrastra para girar y usa scroll para zoom. Vista previa de tu tour.',
    position: 'bottom' as const,
  },
  {
    target: '[data-tutorial="add-hotspot-mode"]',
    title: '2. Agregar Puntos',
    description:
      'Activa y haz clic en la imagen para crear puntos de navegación.',
    position: 'bottom' as const,
  },
  {
    target: '[data-tutorial="hotspots-list"]',
    title: '3. Gestionar Hotspots',
    description:
      'Edita, elimina o prueba la navegación entre vistas desde aquí.',
    position: 'left' as const,
  },
  {
    target: '[data-tutorial="view-selector"]',
    title: '4. Cambiar Vista',
    description: 'Alterna entre las imágenes 360° de tu tour virtual.',
    position: 'top' as const,
  },
  {
    target: '[data-tutorial="save-button"]',
    title: '5. Guardar Todo',
    description:
      'Guarda los cambios para que estén disponibles en el tour público.',
    position: 'bottom' as const,
  },
];

/**
 * Pasos del tutorial para Agregar Terreno
 */
export const addTerrainTutorialSteps = [
  {
    target: '[data-tutorial="terrain-title"]',
    title: '1. Nombre del Tour',
    description:
      'Dale un título descriptivo que aparecerá en tu dashboard y marketplace.',
    position: 'bottom' as const,
  },
  {
    target: '[data-tutorial="image-uploader"]',
    title: '2. Fotos 360°',
    description:
      'Arrastra tus panorámicas. Se optimizan automáticamente (WebP, 92% calidad).',
    position: 'bottom' as const,
  },
  {
    target: '[data-tutorial="property-details"]',
    title: '3. Datos del Inmueble',
    description:
      'Agrega superficie, ubicación, precio y descripción de la propiedad.',
    position: 'left' as const,
  },
  {
    target: '[data-tutorial="cover-image"]',
    title: '4. Imagen Principal',
    description: 'Sube la foto de portada que verán en el catálogo.',
    position: 'top' as const,
  },
  {
    target: '[data-tutorial="submit-button"]',
    title: '5. Crear Tour',
    description:
      'Finaliza para crear el tour. Luego podrás agregar hotspots interactivos.',
    position: 'top' as const,
  },
];
