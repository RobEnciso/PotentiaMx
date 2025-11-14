-- =================================================================
-- REPARAR USER_PROFILES Y CREAR FOREIGN KEY
-- =================================================================
-- Este script soluciona el problema de integridad de datos
-- y crea la foreign key correctamente
-- =================================================================

-- PASO 1: Encontrar terrenos con user_ids que no existen en user_profiles
SELECT
  DISTINCT t.user_id,
  COUNT(*) as terrenos_count
FROM public.terrenos t
LEFT JOIN public.user_profiles up ON t.user_id = up.id
WHERE up.id IS NULL
GROUP BY t.user_id;

-- PASO 2: Crear registros faltantes en user_profiles
-- Para cada user_id que existe en terrenos pero no en user_profiles,
-- creamos un registro en user_profiles (asumiendo que el usuario existe en auth.users)

INSERT INTO public.user_profiles (
  id,
  email,
  full_name,
  subscription_plan,
  max_tours,
  created_at,
  updated_at
)
SELECT
  DISTINCT t.user_id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', au.email) as full_name,
  'free' as subscription_plan,
  3 as max_tours,
  NOW() as created_at,
  NOW() as updated_at
FROM public.terrenos t
LEFT JOIN public.user_profiles up ON t.user_id = up.id
INNER JOIN auth.users au ON t.user_id = au.id
WHERE up.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- PASO 3: Verificar si quedan terrenos huérfanos (usuarios que no existen en auth.users)
SELECT
  t.id as terreno_id,
  t.title as terreno_title,
  t.user_id as missing_user_id
FROM public.terrenos t
LEFT JOIN auth.users au ON t.user_id = au.id
WHERE au.id IS NULL;

-- PASO 4: Eliminar terrenos huérfanos (si los hay)
-- ADVERTENCIA: Esto eliminará terrenos de usuarios que ya no existen
-- Descomenta las siguientes líneas si quieres eliminarlos:

-- DELETE FROM public.hotspots
-- WHERE terreno_id IN (
--   SELECT t.id
--   FROM public.terrenos t
--   LEFT JOIN auth.users au ON t.user_id = au.id
--   WHERE au.id IS NULL
-- );

-- DELETE FROM public.terrenos
-- WHERE user_id NOT IN (
--   SELECT id FROM auth.users
-- );

-- PASO 5: Eliminar la foreign key anterior si existe
ALTER TABLE public.terrenos
DROP CONSTRAINT IF EXISTS terrenos_user_id_fkey;

-- PASO 6: Crear la FOREIGN KEY correcta
ALTER TABLE public.terrenos
ADD CONSTRAINT terrenos_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES public.user_profiles(id)
ON DELETE CASCADE;

-- PASO 7: Crear índice para mejorar performance
CREATE INDEX IF NOT EXISTS idx_terrenos_user_id ON public.terrenos(user_id);

-- =================================================================
-- VERIFICACIÓN FINAL
-- =================================================================

-- Ver la FK creada
SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'terrenos'
  AND kcu.column_name = 'user_id';

-- Contar registros en user_profiles
SELECT COUNT(*) as total_user_profiles FROM public.user_profiles;

-- Contar terrenos
SELECT COUNT(*) as total_terrenos FROM public.terrenos;

-- Verificar que NO hay terrenos huérfanos
SELECT COUNT(*) as terrenos_sin_user_profile
FROM public.terrenos t
LEFT JOIN public.user_profiles up ON t.user_id = up.id
WHERE up.id IS NULL;

-- =================================================================
-- RESULTADO ESPERADO:
-- =================================================================
-- 1. Se deben crear los registros faltantes en user_profiles
-- 2. La FK se debe crear exitosamente
-- 3. terrenos_sin_user_profile debe ser 0 (cero)
-- =================================================================
