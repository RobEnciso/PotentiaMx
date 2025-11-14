-- ============================================
-- AGREGAR COORDENADAS A TERRENOS EXISTENTES
-- ============================================
-- Región: Boca de Tomatlán, Puerto Vallarta, Jalisco
-- Fecha: 2025-01-19
-- ============================================

-- ============================================
-- COORDENADAS DE REFERENCIA - BOCA DE TOMATLÁN
-- ============================================
-- Centro de Boca de Tomatlán: 20.567894, -105.357222
-- Playa Boca de Tomatlán: 20.563456, -105.359012
-- Zona de terrenos: 20.570000, -105.355000
-- ============================================

-- TERRENO 1: "boca de tomatlan" (activo en marketplace)
-- ID: 6540877e-7c97-4833-b126-d47eb1e67144
-- Precio: $3,000,120 MXN
UPDATE terrenos
SET
  latitude = 20.567894,
  longitude = -105.357222
WHERE id = '6540877e-7c97-4833-b126-d47eb1e67144';

-- TERRENO 2: "boca de tmatlan" (pendiente aprobación)
-- ID: 1de8b81f-f079-4363-a3ce-71a997012fea
-- Precio: $900,000 MXN
-- Nota: Ligeramente diferente ubicación para que no se superpongan en el mapa
UPDATE terrenos
SET
  latitude = 20.568500,
  longitude = -105.356800
WHERE id = '1de8b81f-f079-4363-a3ce-71a997012fea';

-- TERRENO 3: "Terreno para desarollo" (NO en marketplace)
-- ID: 062e89fd-6629-40a4-8eaa-9f51cbe9ecdf
-- Precio: $665,640 MXN
-- Nota: Como no está en marketplace, puedes dejarlo sin coordenadas o agregárselas
UPDATE terrenos
SET
  latitude = 20.569200,
  longitude = -105.358100
WHERE id = '062e89fd-6629-40a4-8eaa-9f51cbe9ecdf';

-- ============================================
-- VERIFICACIÓN
-- ============================================
-- Ver los terrenos con sus nuevas coordenadas
SELECT
  title,
  sale_price,
  is_marketplace_listing,
  status,
  latitude,
  longitude,
  CASE
    WHEN latitude IS NOT NULL AND longitude IS NOT NULL THEN '✅ Con ubicación'
    ELSE '❌ Sin ubicación'
  END AS ubicacion_status
FROM terrenos
ORDER BY created_at DESC;

-- ============================================
-- IMPORTANTE - AJUSTAR COORDENADAS
-- ============================================
-- Si conoces las ubicaciones EXACTAS de estos terrenos:
-- 1. Ve a Google Maps
-- 2. Click derecho en la ubicación del terreno
-- 3. Click en las coordenadas para copiarlas
-- 4. Actualiza este script con las coordenadas reales
-- 5. Vuelve a ejecutarlo
--
-- Por ahora usé coordenadas del centro de Boca de Tomatlán
-- con pequeñas variaciones para que no se superpongan en el mapa
-- ============================================

-- ✅ Script completado
SELECT '✅ Coordenadas agregadas a 3 terrenos en Boca de Tomatlán' AS status;
