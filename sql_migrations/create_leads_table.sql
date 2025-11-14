-- Migración: Crear tabla de leads para sistema CRM
-- Fecha: 2025-10-17
-- Propósito: Almacenar todas las solicitudes de contacto de los clientes

-- Crear tabla de leads
CREATE TABLE IF NOT EXISTS leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    -- Información del lead
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT,

    -- Información del terreno consultado
    terreno_id UUID NOT NULL REFERENCES terrenos(id) ON DELETE CASCADE,
    terreno_title TEXT NOT NULL,

    -- Información del destinatario
    contact_email TEXT NOT NULL,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    source TEXT DEFAULT 'contact_form',
    ip_address TEXT,
    user_agent TEXT,

    -- Gestión del lead
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
    notes TEXT,
    assigned_to UUID REFERENCES auth.users(id),
    contacted_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar búsquedas
CREATE INDEX IF NOT EXISTS idx_leads_terreno_id ON leads(terreno_id);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON leads(assigned_to);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
DROP TRIGGER IF EXISTS trigger_update_leads_updated_at ON leads;
CREATE TRIGGER trigger_update_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_leads_updated_at();

-- Comentarios explicativos
COMMENT ON TABLE leads IS 'Almacena todas las solicitudes de contacto de clientes potenciales';
COMMENT ON COLUMN leads.name IS 'Nombre completo del prospecto';
COMMENT ON COLUMN leads.email IS 'Email del prospecto para seguimiento';
COMMENT ON COLUMN leads.phone IS 'Teléfono del prospecto (opcional)';
COMMENT ON COLUMN leads.message IS 'Mensaje o consulta del prospecto';
COMMENT ON COLUMN leads.terreno_id IS 'ID del terreno consultado';
COMMENT ON COLUMN leads.terreno_title IS 'Título del terreno (snapshot para mantener historial)';
COMMENT ON COLUMN leads.contact_email IS 'Email del vendedor/agente que recibió la consulta';
COMMENT ON COLUMN leads.status IS 'Estado del lead en el proceso de ventas';
COMMENT ON COLUMN leads.source IS 'Origen del lead (contact_form, whatsapp_button, etc.)';
COMMENT ON COLUMN leads.assigned_to IS 'Usuario asignado para dar seguimiento al lead';

-- RLS (Row Level Security) - Solo los dueños del terreno pueden ver sus leads
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver los leads de sus propios terrenos
CREATE POLICY "Users can view leads from their terrenos"
    ON leads
    FOR SELECT
    USING (
        terreno_id IN (
            SELECT id FROM terrenos WHERE user_id = auth.uid()
        )
    );

-- Política: El sistema puede insertar leads (mediante API con service role)
-- Esta política permite INSERT sin restricciones para que el API route pueda crear leads
CREATE POLICY "Anyone can create leads"
    ON leads
    FOR INSERT
    WITH CHECK (true);

-- Política: Los usuarios pueden actualizar leads de sus propios terrenos
CREATE POLICY "Users can update leads from their terrenos"
    ON leads
    FOR UPDATE
    USING (
        terreno_id IN (
            SELECT id FROM terrenos WHERE user_id = auth.uid()
        )
    );

-- Política: Los usuarios pueden eliminar leads de sus propios terrenos
CREATE POLICY "Users can delete leads from their terrenos"
    ON leads
    FOR DELETE
    USING (
        terreno_id IN (
            SELECT id FROM terrenos WHERE user_id = auth.uid()
        )
    );
