-- Migración: Agregar configuración de contacto a terrenos
-- Fecha: 2025-10-17
-- Propósito: Permitir diferentes métodos de contacto según tipo de propiedad

-- Tipo ENUM para contact_type
DO $$ BEGIN
    CREATE TYPE contact_type_enum AS ENUM ('formal', 'casual', 'both');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Agregar columnas de configuración de contacto
ALTER TABLE terrenos
ADD COLUMN IF NOT EXISTS contact_type contact_type_enum DEFAULT 'casual',
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS contact_phone TEXT;

-- Comentarios explicativos
COMMENT ON COLUMN terrenos.contact_type IS 'Tipo de contacto: formal (formulario email), casual (WhatsApp), both (ambos)';
COMMENT ON COLUMN terrenos.contact_email IS 'Email donde se recibirán las solicitudes de información (para contact_type formal o both)';
COMMENT ON COLUMN terrenos.contact_phone IS 'Número de WhatsApp para contacto (para contact_type casual o both)';

-- Actualizar terrenos existentes con datos por defecto si no tienen teléfono
UPDATE terrenos
SET contact_phone = '5213221234567'
WHERE contact_phone IS NULL;

-- Índice para mejorar búsquedas por tipo de contacto
CREATE INDEX IF NOT EXISTS idx_terrenos_contact_type ON terrenos(contact_type);
