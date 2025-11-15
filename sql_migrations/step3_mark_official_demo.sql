-- ============================================
-- PASO 3: MARCAR TOUR OFICIAL COMO DEMO
-- ============================================

-- Actualizar el tour demo oficial con metadata
UPDATE terrenos
SET metadata = jsonb_build_object(
  'is_demo', true,
  'created_from', 'official_demo',
  'demo_id', '062e89fd-6629-40a4-8eaa-9f51cbe9ecdf',
  'created_at', NOW()
)
WHERE id = '062e89fd-6629-40a4-8eaa-9f51cbe9ecdf';

-- Verificar que se actualizó correctamente
SELECT
  id,
  title,
  metadata
FROM terrenos
WHERE id = '062e89fd-6629-40a4-8eaa-9f51cbe9ecdf';
