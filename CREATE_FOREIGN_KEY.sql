-- =================================================================
-- CREAR FOREIGN KEY ENTRE TERRENOS Y USER_PROFILES
-- =================================================================
-- Este script crea la relación faltante que causa el error 400
-- =================================================================

-- PASO 1: Verificar que la tabla user_profiles existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'user_profiles'
  ) THEN
    RAISE EXCEPTION 'La tabla user_profiles no existe. Créala primero.';
  END IF;
END $$;

-- PASO 2: Verificar que la columna user_id existe en terrenos
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'terrenos'
    AND column_name = 'user_id'
  ) THEN
    RAISE EXCEPTION 'La columna user_id no existe en terrenos.';
  END IF;
END $$;

-- PASO 3: Eliminar la foreign key anterior si existe (puede estar mal configurada)
ALTER TABLE public.terrenos
DROP CONSTRAINT IF EXISTS terrenos_user_id_fkey;

-- PASO 4: Crear la FOREIGN KEY correcta
-- Esta FK conecta terrenos.user_id con user_profiles.id
ALTER TABLE public.terrenos
ADD CONSTRAINT terrenos_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES public.user_profiles(id)
ON DELETE CASCADE;

-- PASO 5: Crear índice para mejorar performance de JOINs
CREATE INDEX IF NOT EXISTS idx_terrenos_user_id ON public.terrenos(user_id);

-- =================================================================
-- VERIFICACIÓN
-- =================================================================

-- Verificar que la FK se creó correctamente
SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'terrenos'
  AND kcu.column_name = 'user_id';

-- Verificar que el índice existe
SELECT
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'terrenos'
  AND indexname = 'idx_terrenos_user_id';

-- =================================================================
-- RESULTADO ESPERADO:
-- =================================================================
-- Deberías ver:
-- 1. constraint_name: terrenos_user_id_fkey
-- 2. column_name: user_id
-- 3. foreign_table_name: user_profiles
-- 4. foreign_column_name: id
-- 5. El índice idx_terrenos_user_id creado
-- =================================================================
