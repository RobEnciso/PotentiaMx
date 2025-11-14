/**
 * ADMIN DOCUMENTATION UTILITIES
 *
 * Gestión de documentación y enlaces a Google Drive
 *
 * @created 2025-01-18
 */

// =============================================
// CONFIGURACIÓN DE GOOGLE DRIVE
// =============================================

// ⚠️ IMPORTANTE: Reemplaza estos IDs con tus propias carpetas de Google Drive
export const GOOGLE_DRIVE_CONFIG = {
  // Carpeta principal de Potentia MX
  mainFolder: 'https://drive.google.com/drive/folders/TU_ID_CARPETA_PRINCIPAL',

  // Subcarpetas organizadas
  folders: {
    documentation: 'https://drive.google.com/drive/folders/TU_ID_DOCS',
    sqlScripts: 'https://drive.google.com/drive/folders/TU_ID_SQL',
    branding: 'https://drive.google.com/drive/folders/TU_ID_BRANDING',
    marketing: 'https://drive.google.com/drive/folders/TU_ID_MARKETING',
  },
};

// =============================================
// LISTA DE DOCUMENTOS TÉCNICOS
// =============================================

export const TECHNICAL_DOCS = [
  {
    name: 'ROADMAP_PRIORIZADO.md',
    description: 'Roadmap priorizado del proyecto con sprints',
    category: 'Planificación',
    icon: '🗺️',
    localPath: '/ROADMAP_PRIORIZADO.md',
  },
  {
    name: 'MODELO_NEGOCIO_TRIPLE.md',
    description: 'Modelo de negocio de tres vías',
    category: 'Negocio',
    icon: '💼',
    localPath: '/MODELO_NEGOCIO_TRIPLE.md',
  },
  {
    name: 'IDENTIDAD_VISUAL_POTENTIA.md',
    description: 'Guía de identidad visual y branding',
    category: 'Diseño',
    icon: '🎨',
    localPath: '/IDENTIDAD_VISUAL_POTENTIA.md',
  },
  {
    name: 'ADMIN_PANEL_SECURITY_AUDIT.md',
    description: 'Auditoría de seguridad del panel admin',
    category: 'Seguridad',
    icon: '🛡️',
    localPath: '/ADMIN_PANEL_SECURITY_AUDIT.md',
  },
  {
    name: 'ADMIN_DASHBOARD_REDESIGN.md',
    description: 'Propuesta de rediseño del dashboard admin',
    category: 'Diseño',
    icon: '🎨',
    localPath: '/ADMIN_DASHBOARD_REDESIGN.md',
  },
  {
    name: 'SPRINT_0_COMPLETADO.md',
    description: 'Documentación del Sprint 0 completado',
    category: 'Desarrollo',
    icon: '✅',
    localPath: '/SPRINT_0_COMPLETADO.md',
  },
  {
    name: 'PASSWORD_RESET_COMPLETE.md',
    description: 'Implementación de recuperación de contraseña',
    category: 'Desarrollo',
    icon: '🔐',
    localPath: '/PASSWORD_RESET_COMPLETE.md',
  },
  {
    name: 'GUIA_CONFIGURACION_RESEND.md',
    description: 'Configuración de emails con Resend',
    category: 'Configuración',
    icon: '📧',
    localPath: '/GUIA_CONFIGURACION_RESEND.md',
  },
  {
    name: 'MULTI_TENANCY_SETUP.md',
    description: 'Configuración de multi-tenancy',
    category: 'Arquitectura',
    icon: '🏗️',
    localPath: '/MULTI_TENANCY_SETUP.md',
  },
  {
    name: 'CONTACT_SYSTEM_GUIDE.md',
    description: 'Sistema de contacto y lead generation',
    category: 'Desarrollo',
    icon: '💬',
    localPath: '/CONTACT_SYSTEM_GUIDE.md',
  },
];

// =============================================
// SCRIPTS SQL
// =============================================

export const SQL_SCRIPTS = [
  {
    name: 'create_admin_security_system.sql',
    description: 'Sistema de seguridad y logs de admin',
    category: 'Seguridad',
    icon: '🔒',
    localPath: '/sql_migrations/create_admin_security_system.sql',
  },
  {
    name: 'add_property_types.sql',
    description: 'Tipos de propiedad (casa, departamento, terreno)',
    category: 'Schema',
    icon: '🏠',
    localPath: '/sql_migrations/add_property_types.sql',
  },
  {
    name: 'fix_plan_free_limit_to_2_tours.sql',
    description: 'Corrección límite plan FREE a 2 tours',
    category: 'Data',
    icon: '🔧',
    localPath: '/sql_migrations/fix_plan_free_limit_to_2_tours.sql',
  },
  {
    name: 'add_view_names.sql',
    description: 'Nombres personalizados para vistas',
    category: 'Schema',
    icon: '🏷️',
    localPath: '/sql_migrations/add_view_names.sql',
  },
  {
    name: 'SUPABASE_RLS_SETUP.sql',
    description: 'Configuración de Row Level Security',
    category: 'Seguridad',
    icon: '🛡️',
    localPath: '/SUPABASE_RLS_SETUP.sql',
  },
];

// =============================================
// ENLACES EXTERNOS
// =============================================

export const EXTERNAL_LINKS = [
  {
    name: 'Supabase Dashboard',
    url: 'https://supabase.com/dashboard/projects',
    description: 'Panel de administración de Supabase',
    icon: '🗄️',
    category: 'Infraestructura',
  },
  {
    name: 'Resend Dashboard',
    url: 'https://resend.com/overview',
    description: 'Panel de emails transaccionales',
    icon: '📧',
    category: 'Servicios',
  },
  {
    name: 'Google Analytics',
    url: 'https://analytics.google.com',
    description: 'Métricas y analytics del sitio',
    icon: '📊',
    category: 'Analytics',
  },
  {
    name: 'Google Drive - Potentia MX',
    url: GOOGLE_DRIVE_CONFIG.mainFolder,
    description: 'Carpeta principal del proyecto',
    icon: '📁',
    category: 'Documentación',
  },
  {
    name: 'Google Workspace Admin',
    url: 'https://admin.google.com',
    description: 'Administración de Google Workspace',
    icon: '⚙️',
    category: 'Workspace',
  },
  {
    name: 'Namecheap DNS',
    url: 'https://ap.www.namecheap.com',
    description: 'Gestión de dominios y DNS',
    icon: '🌐',
    category: 'Infraestructura',
  },
  {
    name: 'Vercel Dashboard',
    url: 'https://vercel.com/dashboard',
    description: 'Hosting y despliegues',
    icon: '▲',
    category: 'Infraestructura',
  },
];

// =============================================
// FUNCIONES AUXILIARES
// =============================================

/**
 * Obtiene documentos filtrados por categoría
 */
export function getDocsByCategory(category) {
  return TECHNICAL_DOCS.filter((doc) => doc.category === category);
}

/**
 * Obtiene todas las categorías únicas
 */
export function getCategories() {
  const categories = new Set();
  TECHNICAL_DOCS.forEach((doc) => categories.add(doc.category));
  SQL_SCRIPTS.forEach((script) => categories.add(script.category));
  return Array.from(categories);
}

/**
 * Busca documentos por nombre o descripción
 */
export function searchDocs(query) {
  const lowerQuery = query.toLowerCase();

  const matchingDocs = TECHNICAL_DOCS.filter(
    (doc) =>
      doc.name.toLowerCase().includes(lowerQuery) ||
      doc.description.toLowerCase().includes(lowerQuery),
  );

  const matchingScripts = SQL_SCRIPTS.filter(
    (script) =>
      script.name.toLowerCase().includes(lowerQuery) ||
      script.description.toLowerCase().includes(lowerQuery),
  );

  return {
    docs: matchingDocs,
    scripts: matchingScripts,
  };
}

/**
 * Abre un documento en el navegador
 */
export function openDoc(localPath) {
  window.open(localPath, '_blank');
}

/**
 * Abre un enlace externo
 */
export function openExternalLink(url) {
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Genera URL de Google Drive para un documento específico
 * Nota: Requiere que subas los archivos a Drive y obtengas sus IDs
 */
export function getGoogleDriveUrl(filename) {
  // Este es un placeholder - deberás configurar los IDs reales
  // cuando subas los archivos a Google Drive

  const FILE_IDS = {
    'ROADMAP_PRIORIZADO.md': 'ID_DEL_ARCHIVO_EN_DRIVE',
    'MODELO_NEGOCIO_TRIPLE.md': 'ID_DEL_ARCHIVO_EN_DRIVE',
    // ... agregar más según necesites
  };

  const fileId = FILE_IDS[filename];

  if (fileId) {
    return `https://docs.google.com/document/d/${fileId}/edit`;
  }

  // Si no tiene ID específico, abrir la carpeta principal
  return GOOGLE_DRIVE_CONFIG.folders.documentation;
}
