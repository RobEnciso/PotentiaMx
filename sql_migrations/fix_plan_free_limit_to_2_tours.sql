-- ===================================================================
-- FIX: Corregir límite de plan FREE a 2 tours (no 3)
-- ===================================================================
-- Fecha: 18 de Enero, 2025
-- Descripción: El plan FREE debe permitir máximo 2 tours activos
-- ===================================================================

-- 1. Actualizar todos los usuarios con plan FREE a max_tours = 2
UPDATE public.user_profiles
SET max_tours = 2
WHERE subscription_plan = 'free'
  AND max_tours != 2;

-- 2. Verificar que se aplicó correctamente
SELECT
  subscription_plan,
  max_tours,
  COUNT(*) as total_users
FROM public.user_profiles
GROUP BY subscription_plan, max_tours
ORDER BY subscription_plan, max_tours;

-- ===================================================================
-- NOTA: Ejecutar este script en Supabase SQL Editor
-- ===================================================================
