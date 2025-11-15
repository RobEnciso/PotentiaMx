-- ============================================
-- ELIMINAR MÚLTIPLES USUARIOS DE PRUEBA
-- ============================================
-- Usuarios a eliminar:
-- 1. f7cc163c-b681-4d43-a6b0-4ac527a3f1e2
-- 2. ec22bbce-a5cd-44db-8c4f-8fb6dd744a96
-- ============================================

-- PASO 1: Verificar datos de los usuarios
SELECT 'VERIFICACIÓN DE USUARIOS' as info;

SELECT
  id,
  email,
  created_at,
  email_confirmed_at
FROM auth.users
WHERE id IN (
  'f7cc163c-b681-4d43-a6b0-4ac527a3f1e2',
  'ec22bbce-a5cd-44db-8c4f-8fb6dd744a96'
);

-- Ver cuántos datos tienen
SELECT
  'terrenos' as tabla,
  COUNT(*) as cantidad
FROM terrenos
WHERE user_id IN (
  'f7cc163c-b681-4d43-a6b0-4ac527a3f1e2',
  'ec22bbce-a5cd-44db-8c4f-8fb6dd744a96'
)
UNION ALL
SELECT
  'user_profiles' as tabla,
  COUNT(*) as cantidad
FROM user_profiles
WHERE id IN (
  'f7cc163c-b681-4d43-a6b0-4ac527a3f1e2',
  'ec22bbce-a5cd-44db-8c4f-8fb6dd744a96'
);

-- ============================================
-- PASO 2: ELIMINAR TODOS LOS DATOS
-- Ejecutar TODO de una vez
-- ============================================

DO $$
BEGIN
  -- Eliminar hotspots
  DELETE FROM hotspots
  WHERE terreno_id IN (
    SELECT id FROM terrenos
    WHERE user_id IN (
      'f7cc163c-b681-4d43-a6b0-4ac527a3f1e2',
      'ec22bbce-a5cd-44db-8c4f-8fb6dd744a96'
    )
  );

  RAISE NOTICE 'Hotspots eliminados';

  -- Eliminar terrenos
  DELETE FROM terrenos
  WHERE user_id IN (
    'f7cc163c-b681-4d43-a6b0-4ac527a3f1e2',
    'ec22bbce-a5cd-44db-8c4f-8fb6dd744a96'
  );

  RAISE NOTICE 'Terrenos eliminados';

  -- Eliminar perfiles
  DELETE FROM user_profiles
  WHERE id IN (
    'f7cc163c-b681-4d43-a6b0-4ac527a3f1e2',
    'ec22bbce-a5cd-44db-8c4f-8fb6dd744a96'
  );

  RAISE NOTICE 'Perfiles eliminados';

  -- Eliminar cuentas de auth
  DELETE FROM auth.users
  WHERE id IN (
    'f7cc163c-b681-4d43-a6b0-4ac527a3f1e2',
    'ec22bbce-a5cd-44db-8c4f-8fb6dd744a96'
  );

  RAISE NOTICE 'Usuarios eliminados de auth';
  RAISE NOTICE 'Proceso completado exitosamente';
END $$;

-- ============================================
-- PASO 3: VERIFICAR QUE SE ELIMINÓ TODO
-- ============================================

SELECT 'VERIFICACIÓN FINAL' as info;

SELECT
  'terrenos' as tabla,
  COUNT(*) as cantidad
FROM terrenos
WHERE user_id IN (
  'f7cc163c-b681-4d43-a6b0-4ac527a3f1e2',
  'ec22bbce-a5cd-44db-8c4f-8fb6dd744a96'
)
UNION ALL
SELECT
  'user_profiles' as tabla,
  COUNT(*) as cantidad
FROM user_profiles
WHERE id IN (
  'f7cc163c-b681-4d43-a6b0-4ac527a3f1e2',
  'ec22bbce-a5cd-44db-8c4f-8fb6dd744a96'
)
UNION ALL
SELECT
  'auth.users' as tabla,
  COUNT(*) as cantidad
FROM auth.users
WHERE id IN (
  'f7cc163c-b681-4d43-a6b0-4ac527a3f1e2',
  'ec22bbce-a5cd-44db-8c4f-8fb6dd744a96'
);

-- Debe mostrar 0 en todas las tablas
