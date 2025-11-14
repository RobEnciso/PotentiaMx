/**
 * ADMIN IMPERSONATE UTILITIES
 *
 * Permite a los administradores "ver como" otro usuario
 * sin necesidad de saber su contraseña.
 *
 * Útil para:
 * - Gestionar tours del usuario interno tours@potentiamx.com
 * - Debuggear problemas de usuarios específicos
 * - Testing de permisos y flujos
 *
 * @created 2025-01-18
 */

const ADMIN_EMAILS = [
  'creafilmsvallarta@gmail.com',
  'admin@potentia.mx',
  'admin@potentiamx.com',
];

/**
 * Verifica si el usuario actual puede impersonar
 * @returns {Promise<boolean>}
 */
export async function canImpersonate() {
  try {
    const { createClient } = await import('./supabaseClient');
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return false;

    return ADMIN_EMAILS.includes(user.email);
  } catch (error) {
    console.error('Error verificando permisos de impersonate:', error);
    return false;
  }
}

/**
 * Inicia una sesión de impersonación
 * @param {string} targetUserEmail - Email del usuario a impersonar
 * @returns {Promise<void>}
 */
export async function startImpersonating(targetUserEmail) {
  try {
    const { createClient } = await import('./supabaseClient');
    const supabase = createClient();

    // 1. Verificar que quien llama sea admin
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser || !ADMIN_EMAILS.includes(currentUser.email)) {
      throw new Error('❌ Solo administradores pueden impersonar usuarios');
    }

    // 2. Verificar que el usuario objetivo existe
    const { data: targetProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id, email')
      .eq('email', targetUserEmail)
      .single();

    if (profileError || !targetProfile) {
      throw new Error(`❌ Usuario ${targetUserEmail} no encontrado`);
    }

    // 3. Guardar información de la sesión admin
    const impersonateData = {
      admin_email: currentUser.email,
      admin_id: currentUser.id,
      target_email: targetUserEmail,
      target_id: targetProfile.id,
      started_at: new Date().toISOString(),
    };

    // Guardar en localStorage
    localStorage.setItem(
      'admin_impersonating',
      JSON.stringify(impersonateData),
    );

    // Guardar en sessionStorage como backup
    sessionStorage.setItem(
      'admin_impersonating',
      JSON.stringify(impersonateData),
    );

    console.log('✅ Impersonación iniciada:', impersonateData);

    // 4. Hacer logout de la sesión actual
    await supabase.auth.signOut();

    // 5. Redirigir a login con parámetro especial
    // El usuario tendrá que hacer login con las credenciales del usuario objetivo
    // (Esto es una limitación de seguridad de Supabase - no podemos crear sesiones arbitrarias)

    // Mostrar modal con instrucciones
    return {
      success: true,
      message:
        'Para continuar, inicia sesión con las credenciales de tours@potentiamx.com',
      targetEmail: targetUserEmail,
    };
  } catch (error) {
    console.error('Error iniciando impersonación:', error);
    throw error;
  }
}

/**
 * Versión simplificada: Guardar que queremos impersonar y permitir que el admin
 * se loguee manualmente como el otro usuario
 * @param {string} targetUserEmail
 */
export function markForImpersonate(targetUserEmail) {
  const impersonateData = {
    admin_wants_to_impersonate: targetUserEmail,
    marked_at: new Date().toISOString(),
  };

  localStorage.setItem('impersonate_request', JSON.stringify(impersonateData));

  return impersonateData;
}

/**
 * Detiene la sesión de impersonación y vuelve a admin
 * @returns {void}
 */
export function stopImpersonating() {
  const impersonateData = localStorage.getItem('admin_impersonating');

  if (!impersonateData) {
    console.warn('No hay sesión de impersonación activa');
    return;
  }

  // Limpiar datos de impersonación
  localStorage.removeItem('admin_impersonating');
  sessionStorage.removeItem('admin_impersonating');

  console.log('✅ Sesión de impersonación terminada');

  // Hacer logout y redirigir a login
  window.location.href = '/login';
}

/**
 * Verifica si actualmente estás impersonando a otro usuario
 * @returns {boolean}
 */
export function isImpersonating() {
  return !!(
    localStorage.getItem('admin_impersonating') ||
    sessionStorage.getItem('admin_impersonating')
  );
}

/**
 * Obtiene los datos de la sesión de impersonación actual
 * @returns {Object|null}
 */
export function getImpersonateData() {
  try {
    const data =
      localStorage.getItem('admin_impersonating') ||
      sessionStorage.getItem('admin_impersonating');

    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error obteniendo datos de impersonación:', error);
    return null;
  }
}

/**
 * Registra el inicio de una sesión de impersonación
 * @param {string} targetEmail
 */
export async function logImpersonateStart(targetEmail) {
  try {
    const { logAdminAction } = await import('./adminSecurity');

    await logAdminAction('other', null, {
      action: 'start_impersonate',
      target_email: targetEmail,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error registrando impersonación:', error);
  }
}

/**
 * Registra el fin de una sesión de impersonación
 */
export async function logImpersonateEnd() {
  try {
    const impersonateData = getImpersonateData();
    if (!impersonateData) return;

    const { logAdminAction } = await import('./adminSecurity');

    await logAdminAction('other', null, {
      action: 'end_impersonate',
      target_email: impersonateData.target_email,
      duration_minutes: Math.round(
        (new Date() - new Date(impersonateData.started_at)) / 1000 / 60,
      ),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error registrando fin de impersonación:', error);
  }
}
