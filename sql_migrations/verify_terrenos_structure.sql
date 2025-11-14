-- ============================================
-- VERIFICAR ESTRUCTURA ACTUAL DE TABLA TERRENOS
-- ============================================
-- Este script te muestra la estructura completa de tu tabla
-- antes de hacer cualquier cambio
-- ============================================

-- 1. Ver todas las columnas de la tabla terrenos
SELECT
  column_name,
  data_type,
  character_maximum_length,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'terrenos'
ORDER BY ordinal_position;

-- 2. Ver índices existentes
SELECT
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'terrenos';

-- 3. Ver restricciones (constraints)
SELECT
  conname AS constraint_name,
  contype AS constraint_type,
  pg_get_constraintdef(c.oid) AS constraint_definition
FROM pg_constraint c
JOIN pg_namespace n ON n.oid = c.connamespace
WHERE conrelid = 'public.terrenos'::regclass;

-- 4. Contar cuántos terrenos tienes actualmente
SELECT
  COUNT(*) AS total_terrenos,
  COUNT(CASE WHEN is_marketplace_listing = true THEN 1 END) AS en_marketplace,
  COUNT(CASE WHEN status = 'active' THEN 1 END) AS activos,
  COUNT(CASE WHEN status = 'pending_approval' THEN 1 END) AS pendientes
FROM terrenos;

-- 5. Ver muestra de datos (sin mostrar URLs completas)
SELECT
  id,
  title,
  user_id,
  is_marketplace_listing,
  status,
  property_type,
  sale_price,
  created_at
FROM terrenos
LIMIT 5;

-- ============================================
-- DESPUÉS DE EJECUTAR ESTE SCRIPT
-- ============================================
-- Copia y pega los resultados aquí para que Claude pueda:
-- 1. Verificar que no haya conflictos
-- 2. Confirmar que es seguro agregar las columnas de coordenadas
-- 3. Ayudarte a poblar las coordenadas en tus terrenos existentes
-- ============================================
