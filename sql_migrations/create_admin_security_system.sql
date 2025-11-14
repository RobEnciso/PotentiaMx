-- =====================================
-- SISTEMA DE SEGURIDAD Y AUDITORÍA ADMIN
-- Fecha: 18 de Enero, 2025
-- Propósito: Logs de acciones admin + health checks
-- =====================================

-- ===========================
-- 1. TABLA DE LOGS DE ADMIN
-- ===========================

CREATE TABLE IF NOT EXISTS admin_logs (
  id BIGSERIAL PRIMARY KEY,
  admin_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  admin_email TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN (
    'approve_tour',
    'reject_tour',
    'clean_storage',
    'analyze_storage',
    'delete_user',
    'update_user_plan',
    'run_health_check',
    'repair_system',
    'delete_tour',
    'other'
  )),
  target_id UUID, -- ID del terreno/usuario afectado (opcional)
  details JSONB DEFAULT '{}', -- Detalles adicionales de la acción
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_admin_logs_user ON admin_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON admin_logs(action);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created ON admin_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_logs_target ON admin_logs(target_id);

-- Comentarios
COMMENT ON TABLE admin_logs IS 'Registro de auditoría de todas las acciones realizadas por administradores';
COMMENT ON COLUMN admin_logs.action IS 'Tipo de acción realizada por el administrador';
COMMENT ON COLUMN admin_logs.target_id IS 'UUID del recurso afectado (terreno, usuario, etc.)';
COMMENT ON COLUMN admin_logs.details IS 'Información adicional sobre la acción en formato JSON';

-- ===========================
-- 2. FUNCIÓN PARA VERIFICAR SI ES ADMIN
-- ===========================

CREATE OR REPLACE FUNCTION is_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Lista de emails de administradores
  -- ⚠️ IMPORTANTE: Actualiza esta lista con los emails de tus admins
  RETURN user_email IN (
    'creafilmsvallarta@gmail.com',
    'admin@potentia.mx',
    'admin@potentiamx.com'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentario
COMMENT ON FUNCTION is_admin(TEXT) IS 'Verifica si un email pertenece a un administrador del sistema';

-- ===========================
-- 3. RLS (ROW LEVEL SECURITY) PARA ADMIN_LOGS
-- ===========================

-- Habilitar RLS
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Solo admins pueden insertar logs
CREATE POLICY "Solo admins pueden insertar logs"
  ON admin_logs
  FOR INSERT
  WITH CHECK (is_admin(auth.email()));

-- Policy: Solo admins pueden ver logs
CREATE POLICY "Solo admins pueden ver logs"
  ON admin_logs
  FOR SELECT
  USING (is_admin(auth.email()));

-- Policy: Solo admins pueden actualizar logs (por si acaso)
CREATE POLICY "Solo admins pueden actualizar logs"
  ON admin_logs
  FOR UPDATE
  USING (is_admin(auth.email()));

-- Policy: Nadie puede eliminar logs (auditoría permanente)
CREATE POLICY "Nadie puede eliminar logs"
  ON admin_logs
  FOR DELETE
  USING (false);

-- ===========================
-- 4. TABLA DE HEALTH CHECKS DEL SISTEMA
-- ===========================

CREATE TABLE IF NOT EXISTS system_health_logs (
  id BIGSERIAL PRIMARY KEY,
  checked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  checked_by UUID REFERENCES auth.users(id), -- NULL si es automático
  issues_found INTEGER DEFAULT 0,
  details JSONB DEFAULT '[]', -- Array de issues encontrados
  severity TEXT CHECK (severity IN ('ok', 'warning', 'error', 'critical')),
  execution_time_ms INTEGER, -- Tiempo que tardó el check
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice
CREATE INDEX IF NOT EXISTS idx_health_logs_checked ON system_health_logs(checked_at DESC);
CREATE INDEX IF NOT EXISTS idx_health_logs_severity ON system_health_logs(severity);

-- Comentarios
COMMENT ON TABLE system_health_logs IS 'Historial de chequeos de salud del sistema';
COMMENT ON COLUMN system_health_logs.details IS 'Array JSON con los problemas encontrados';
COMMENT ON COLUMN system_health_logs.severity IS 'Nivel de severidad general: ok, warning, error, critical';

-- RLS para health logs
ALTER TABLE system_health_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Solo admins pueden ver health logs"
  ON system_health_logs
  FOR SELECT
  USING (is_admin(auth.email()));

CREATE POLICY "Solo admins pueden insertar health logs"
  ON system_health_logs
  FOR INSERT
  WITH CHECK (is_admin(auth.email()));

-- ===========================
-- 5. FUNCIÓN PARA REGISTRAR ACCIONES DE ADMIN
-- ===========================

CREATE OR REPLACE FUNCTION log_admin_action(
  p_action TEXT,
  p_target_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT '{}'::JSONB
)
RETURNS VOID AS $$
DECLARE
  v_user_id UUID;
  v_user_email TEXT;
BEGIN
  -- Obtener usuario actual
  v_user_id := auth.uid();
  v_user_email := auth.email();

  -- Verificar que sea admin
  IF NOT is_admin(v_user_email) THEN
    RAISE EXCEPTION 'Solo administradores pueden registrar acciones de admin';
  END IF;

  -- Insertar log
  INSERT INTO admin_logs (
    admin_user_id,
    admin_email,
    action,
    target_id,
    details
  ) VALUES (
    v_user_id,
    v_user_email,
    p_action,
    p_target_id,
    p_details
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentario
COMMENT ON FUNCTION log_admin_action IS 'Registra una acción de administrador en el log de auditoría';

-- ===========================
-- 6. VISTA PARA ESTADÍSTICAS DE LOGS
-- ===========================

CREATE OR REPLACE VIEW admin_logs_stats AS
SELECT
  action,
  COUNT(*) as total_actions,
  COUNT(DISTINCT admin_email) as unique_admins,
  MAX(created_at) as last_action_at
FROM admin_logs
GROUP BY action
ORDER BY total_actions DESC;

-- Comentario
COMMENT ON VIEW admin_logs_stats IS 'Estadísticas agregadas de acciones de admin';

-- ===========================
-- 7. FUNCIÓN PARA OBTENER LOGS RECIENTES
-- ===========================

CREATE OR REPLACE FUNCTION get_recent_admin_logs(
  p_limit INTEGER DEFAULT 50,
  p_action TEXT DEFAULT NULL
)
RETURNS TABLE (
  id BIGINT,
  admin_email TEXT,
  action TEXT,
  target_id UUID,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  -- Verificar que quien llama sea admin
  IF NOT is_admin(auth.email()) THEN
    RAISE EXCEPTION 'Solo administradores pueden ver logs';
  END IF;

  RETURN QUERY
  SELECT
    l.id,
    l.admin_email,
    l.action,
    l.target_id,
    l.details,
    l.created_at
  FROM admin_logs l
  WHERE (p_action IS NULL OR l.action = p_action)
  ORDER BY l.created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentario
COMMENT ON FUNCTION get_recent_admin_logs IS 'Obtiene los logs de admin más recientes, opcionalmente filtrados por acción';

-- ===========================
-- 8. TRIGGER PARA AUTO-LOG EN APROBACIONES
-- ===========================

-- Función trigger para log automático
CREATE OR REPLACE FUNCTION auto_log_tour_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Solo registrar si cambió el status o is_marketplace_listing
  IF (OLD.status IS DISTINCT FROM NEW.status) OR
     (OLD.is_marketplace_listing IS DISTINCT FROM NEW.is_marketplace_listing) THEN

    -- Determinar la acción
    DECLARE
      v_action TEXT;
      v_details JSONB;
    BEGIN
      IF NEW.status = 'active' AND OLD.status = 'pending_approval' THEN
        v_action := 'approve_tour';
      ELSIF NEW.status = 'rejected' THEN
        v_action := 'reject_tour';
      ELSE
        v_action := 'update_tour_status';
      END IF;

      v_details := jsonb_build_object(
        'old_status', OLD.status,
        'new_status', NEW.status,
        'tour_title', NEW.title,
        'old_marketplace', OLD.is_marketplace_listing,
        'new_marketplace', NEW.is_marketplace_listing
      );

      -- Solo registrar si el usuario actual es admin
      IF is_admin(auth.email()) THEN
        PERFORM log_admin_action(v_action, NEW.id, v_details);
      END IF;
    END;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear trigger
DROP TRIGGER IF EXISTS trigger_log_tour_status ON terrenos;
CREATE TRIGGER trigger_log_tour_status
  AFTER UPDATE ON terrenos
  FOR EACH ROW
  EXECUTE FUNCTION auto_log_tour_status_change();

-- Comentario
COMMENT ON FUNCTION auto_log_tour_status_change IS 'Trigger que registra automáticamente cambios de status en tours';

-- ===========================
-- 9. ÍNDICE DE TEXTO COMPLETO PARA BÚSQUEDA EN LOGS
-- ===========================

CREATE INDEX IF NOT EXISTS idx_admin_logs_details_gin ON admin_logs USING GIN (details);

-- ===========================
-- 10. GRANTS (PERMISOS)
-- ===========================

-- Asegurar que usuarios autenticados puedan acceder
GRANT SELECT ON admin_logs TO authenticated;
GRANT INSERT ON admin_logs TO authenticated;
GRANT SELECT ON admin_logs_stats TO authenticated;
GRANT SELECT ON system_health_logs TO authenticated;
GRANT INSERT ON system_health_logs TO authenticated;

-- ===========================
-- FINALIZACIÓN
-- ===========================

-- Insertar log de instalación
DO $$
BEGIN
  IF is_admin(auth.email()) THEN
    INSERT INTO admin_logs (
      admin_user_id,
      admin_email,
      action,
      details
    ) VALUES (
      auth.uid(),
      auth.email(),
      'other',
      '{"message": "Sistema de seguridad y auditoría instalado correctamente"}'::JSONB
    );
  END IF;
END $$;

-- Mensaje de confirmación
DO $$
BEGIN
  RAISE NOTICE '✅ Sistema de seguridad y auditoría admin instalado correctamente';
  RAISE NOTICE 'Tablas creadas: admin_logs, system_health_logs';
  RAISE NOTICE 'Funciones creadas: is_admin(), log_admin_action(), get_recent_admin_logs()';
  RAISE NOTICE 'Triggers creados: trigger_log_tour_status';
  RAISE NOTICE '⚠️ IMPORTANTE: Actualiza la función is_admin() con los emails de tus administradores';
END $$;
