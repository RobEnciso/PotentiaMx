/**
 * ADMIN SECURITY & MONITORING UTILITIES
 *
 * Funciones para logging, health checks y seguridad del panel de administrador
 *
 * @created 2025-01-18
 */

import { createClient } from './supabaseClient';

// =============================================
// 1. LOGGING DE ACCIONES DE ADMIN
// =============================================

/**
 * Registra una acción de administrador en el log de auditoría
 *
 * @param {string} action - Tipo de acción ('approve_tour', 'reject_tour', 'clean_storage', etc.)
 * @param {string|null} targetId - UUID del recurso afectado (opcional)
 * @param {object} details - Detalles adicionales de la acción (opcional)
 * @returns {Promise<boolean>} - true si se registró correctamente
 */
export async function logAdminAction(action, targetId = null, details = {}) {
  try {
    const supabase = createClient();

    // Obtener usuario actual
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error('No hay usuario autenticado');
      return false;
    }

    // Obtener IP del usuario (opcional, requiere servicio externo)
    let ipAddress = null;
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      ipAddress = ipData.ip;
    } catch (error) {
      // Ignorar error de IP, no es crítico
      console.warn('No se pudo obtener IP:', error);
    }

    // Insertar log
    const { error } = await supabase.from('admin_logs').insert({
      admin_user_id: user.id,
      admin_email: user.email,
      action,
      target_id: targetId,
      details,
      ip_address: ipAddress,
      user_agent: navigator.userAgent,
    });

    if (error) {
      console.error('Error al registrar log de admin:', error);
      return false;
    }

    console.log(`✅ Log registrado: ${action}`, details);
    return true;
  } catch (error) {
    console.error('Error en logAdminAction:', error);
    return false;
  }
}

// =============================================
// 2. HEALTH CHECK DEL SISTEMA
// =============================================

/**
 * Ejecuta un chequeo completo de salud del sistema
 *
 * @returns {Promise<Object>} - Objeto con issues encontrados y severity general
 */
export async function runSystemHealthCheck() {
  const startTime = Date.now();
  const supabase = createClient();
  const issues = [];

  try {
    console.log('🏥 Iniciando health check del sistema...');

    // ========================================
    // 1. VERIFICAR TERRENOS SIN IMÁGENES
    // ========================================
    console.log('📸 Verificando terrenos sin imágenes...');
    const { data: terrenosVacios, error: terrenosError } = await supabase
      .from('terrenos')
      .select('id, title, user_id')
      .or('image_urls.is.null,image_urls.eq.{}');

    if (!terrenosError && terrenosVacios && terrenosVacios.length > 0) {
      issues.push({
        severity: 'warning',
        type: 'terrenos_sin_imagenes',
        count: terrenosVacios.length,
        message: `${terrenosVacios.length} tour(s) sin imágenes`,
        items: terrenosVacios.map((t) => ({
          id: t.id,
          title: t.title,
          action: 'delete_or_upload_images',
        })),
      });
    }

    // ========================================
    // 2. VERIFICAR HOTSPOTS ROTOS
    // ========================================
    console.log('🎯 Verificando hotspots rotos...');
    const { data: allHotspots, error: hotspotsError } = await supabase
      .from('hotspots')
      .select('*');

    const { data: allTerrenos, error: allTerrenosError } = await supabase
      .from('terrenos')
      .select('id, title, image_urls');

    if (!hotspotsError && !allTerrenosError && allHotspots && allTerrenos) {
      const brokenHotspots = allHotspots.filter((h) => {
        const terreno = allTerrenos.find((t) => t.id === h.terreno_id);
        if (!terreno) return true; // Terreno no existe
        if (!terreno.image_urls || !Array.isArray(terreno.image_urls))
          return true;

        // Verificar que target_panorama_index esté dentro del rango
        return (
          h.target_panorama_index >= terreno.image_urls.length ||
          h.panorama_index >= terreno.image_urls.length
        );
      });

      if (brokenHotspots.length > 0) {
        issues.push({
          severity: 'error',
          type: 'hotspots_rotos',
          count: brokenHotspots.length,
          message: `${brokenHotspots.length} hotspot(s) apuntan a vistas inexistentes`,
          items: brokenHotspots.map((h) => ({
            id: h.id,
            terreno_id: h.terreno_id,
            issue: `Hotspot apunta a vista ${h.target_panorama_index} que no existe`,
          })),
        });
      }
    }

    // ========================================
    // 3. VERIFICAR USUARIOS SIN PERFIL
    // ========================================
    console.log('👥 Verificando usuarios sin perfil...');
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('id');

    // Contar usuarios en auth (esto requiere permisos de admin)
    // Por ahora solo comparamos con los perfiles que tenemos
    if (!profilesError && profiles) {
      const { data: allTerrenosUsers } = await supabase
        .from('terrenos')
        .select('user_id');

      if (allTerrenosUsers) {
        const uniqueUserIds = [
          ...new Set(allTerrenosUsers.map((t) => t.user_id)),
        ];
        const usersWithoutProfile = uniqueUserIds.filter(
          (userId) => !profiles.find((p) => p.id === userId),
        );

        if (usersWithoutProfile.length > 0) {
          issues.push({
            severity: 'error',
            type: 'usuarios_sin_perfil',
            count: usersWithoutProfile.length,
            message: `${usersWithoutProfile.length} usuario(s) con terrenos pero sin perfil`,
            items: usersWithoutProfile.map((uid) => ({ user_id: uid })),
          });
        }
      }
    }

    // ========================================
    // 4. VERIFICAR VIEW_NAMES FALTANTES
    // ========================================
    console.log('🏷️ Verificando nombres de vistas faltantes...');
    const { data: terrenosSinViewNames } = await supabase
      .from('terrenos')
      .select('id, title, image_urls, view_names')
      .or('view_names.is.null');

    if (terrenosSinViewNames && terrenosSinViewNames.length > 0) {
      const terrenosNeedingFix = terrenosSinViewNames.filter(
        (t) => t.image_urls && t.image_urls.length > 0,
      );

      if (terrenosNeedingFix.length > 0) {
        issues.push({
          severity: 'warning',
          type: 'view_names_faltantes',
          count: terrenosNeedingFix.length,
          message: `${terrenosNeedingFix.length} tour(s) sin nombres de vistas configurados`,
          items: terrenosNeedingFix.map((t) => ({
            id: t.id,
            title: t.title,
            views_count: t.image_urls.length,
          })),
        });
      }
    }

    // ========================================
    // 5. VERIFICAR TOURS PENDIENTES DE APROBACIÓN
    // ========================================
    console.log('⏳ Verificando tours pendientes de aprobación...');
    const { data: pendingTours } = await supabase
      .from('terrenos')
      .select('id, title, created_at')
      .eq('is_marketplace_listing', true)
      .eq('status', 'pending_approval');

    if (pendingTours && pendingTours.length > 0) {
      // Verificar si hay tours pendientes por más de 48 horas
      const oldPendingTours = pendingTours.filter((t) => {
        const hoursSinceCreated =
          (Date.now() - new Date(t.created_at).getTime()) / (1000 * 60 * 60);
        return hoursSinceCreated > 48;
      });

      if (oldPendingTours.length > 0) {
        issues.push({
          severity: 'warning',
          type: 'tours_pendientes_antiguos',
          count: oldPendingTours.length,
          message: `${oldPendingTours.length} tour(s) esperando aprobación por más de 48 horas`,
          items: oldPendingTours.map((t) => ({
            id: t.id,
            title: t.title,
            pending_since: t.created_at,
          })),
        });
      }
    }

    // ========================================
    // DETERMINAR SEVERITY GENERAL
    // ========================================
    let overallSeverity = 'ok';
    if (issues.some((i) => i.severity === 'critical')) {
      overallSeverity = 'critical';
    } else if (issues.some((i) => i.severity === 'error')) {
      overallSeverity = 'error';
    } else if (issues.some((i) => i.severity === 'warning')) {
      overallSeverity = 'warning';
    }

    const executionTime = Date.now() - startTime;

    // ========================================
    // GUARDAR LOG DE HEALTH CHECK
    // ========================================
    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase.from('system_health_logs').insert({
      checked_by: user?.id || null,
      issues_found: issues.length,
      details: issues,
      severity: overallSeverity,
      execution_time_ms: executionTime,
    });

    console.log(`✅ Health check completado en ${executionTime}ms`);
    console.log(`📊 Issues encontrados: ${issues.length}`);
    console.log(`⚠️ Severity: ${overallSeverity}`);

    return {
      success: true,
      issues,
      overallSeverity,
      executionTime,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('❌ Error en health check:', error);
    return {
      success: false,
      error: error.message,
      issues: [],
      overallSeverity: 'error',
    };
  }
}

// =============================================
// 3. SISTEMA DE REPARACIÓN AUTOMÁTICA
// =============================================

/**
 * Repara automáticamente problemas comunes del sistema
 *
 * @returns {Promise<Array>} - Array de reparaciones realizadas
 */
export async function repairSystem() {
  const supabase = createClient();
  const fixes = [];

  try {
    console.log('🔧 Iniciando reparación automática del sistema...');

    // ========================================
    // 1. GENERAR VIEW_NAMES FALTANTES
    // ========================================
    const { data: terrenosSinViewNames } = await supabase
      .from('terrenos')
      .select('id, title, image_urls, view_names')
      .or('view_names.is.null');

    if (terrenosSinViewNames && terrenosSinViewNames.length > 0) {
      for (const terreno of terrenosSinViewNames) {
        if (terreno.image_urls && terreno.image_urls.length > 0) {
          const defaultNames = terreno.image_urls.map(
            (_, i) => `Vista ${i + 1}`,
          );

          const { error } = await supabase
            .from('terrenos')
            .update({ view_names: defaultNames })
            .eq('id', terreno.id);

          if (!error) {
            fixes.push({
              type: 'view_names_generated',
              message: `Generados ${defaultNames.length} nombres de vista para "${terreno.title}"`,
              terreno_id: terreno.id,
            });
          }
        }
      }
    }

    // ========================================
    // 2. ELIMINAR HOTSPOTS ROTOS
    // ========================================
    const { data: allHotspots } = await supabase.from('hotspots').select('*');
    const { data: allTerrenos } = await supabase
      .from('terrenos')
      .select('id, image_urls');

    if (allHotspots && allTerrenos) {
      const brokenHotspots = allHotspots.filter((h) => {
        const terreno = allTerrenos.find((t) => t.id === h.terreno_id);
        if (!terreno) return true;
        if (!terreno.image_urls || !Array.isArray(terreno.image_urls))
          return true;
        return (
          h.target_panorama_index >= terreno.image_urls.length ||
          h.panorama_index >= terreno.image_urls.length
        );
      });

      for (const hotspot of brokenHotspots) {
        const { error } = await supabase
          .from('hotspots')
          .delete()
          .eq('id', hotspot.id);

        if (!error) {
          fixes.push({
            type: 'broken_hotspot_deleted',
            message: `Eliminado hotspot roto #${hotspot.id}`,
            hotspot_id: hotspot.id,
            terreno_id: hotspot.terreno_id,
          });
        }
      }
    }

    // ========================================
    // REGISTRAR ACCIÓN DE REPARACIÓN
    // ========================================
    await logAdminAction('repair_system', null, {
      fixes_applied: fixes.length,
      details: fixes,
    });

    console.log(`✅ Reparación completada: ${fixes.length} fixes aplicados`);
    return fixes;
  } catch (error) {
    console.error('❌ Error en reparación del sistema:', error);
    throw error;
  }
}

// =============================================
// 4. CARGAR LOGS DE ADMIN
// =============================================

/**
 * Obtiene los logs de acciones de admin más recientes
 *
 * @param {number} limit - Número de logs a obtener (default: 50)
 * @param {string|null} action - Filtrar por tipo de acción (opcional)
 * @returns {Promise<Array>} - Array de logs
 */
export async function getAdminLogs(limit = 50, action = null) {
  try {
    const supabase = createClient();

    let query = supabase
      .from('admin_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (action) {
      query = query.eq('action', action);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error al cargar logs de admin:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error en getAdminLogs:', error);
    return [];
  }
}

// =============================================
// 5. OBTENER HISTORIAL DE HEALTH CHECKS
// =============================================

/**
 * Obtiene el historial de health checks
 *
 * @param {number} limit - Número de registros a obtener
 * @returns {Promise<Array>} - Array de health checks
 */
export async function getHealthCheckHistory(limit = 30) {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('system_health_logs')
      .select('*')
      .order('checked_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error al cargar historial de health checks:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error en getHealthCheckHistory:', error);
    return [];
  }
}

// =============================================
// 6. VERIFICAR SI EL USUARIO ES ADMIN
// =============================================

/**
 * Verifica si el usuario actual es administrador
 *
 * @returns {Promise<boolean>} - true si es admin
 */
export async function isCurrentUserAdmin() {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return false;

    // Lista de emails de admin (debe coincidir con la función SQL)
    const ADMIN_EMAILS = [
      'creafilmsvallarta@gmail.com',
      'admin@potentia.mx',
      'admin@potentiamx.com',
    ];

    return ADMIN_EMAILS.includes(user.email);
  } catch (error) {
    console.error('Error verificando admin:', error);
    return false;
  }
}
