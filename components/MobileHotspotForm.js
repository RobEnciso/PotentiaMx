/**
 * Formulario mobile-optimizado para crear/editar hotspots
 * Diseñado para funcionar dentro de MobileBottomSheet
 */

export default function MobileHotspotForm({
  hotspot,
  isEditing = false,
  viewNames = [],
  currentViewIndex = 0,
  onSubmit,
  onCancel,
  isLoading = false,
}) {
  const [formData, setFormData] = React.useState({
    title: hotspot?.title || '',
    type: hotspot?.type || 'navigation',
    targetImageIndex: hotspot?.targetImageIndex ?? ((currentViewIndex + 1) % viewNames.length),
    content_text: hotspot?.content_text || '',
    create_backlink: hotspot?.create_backlink !== false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Por favor ingresa un título');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Título */}
      <div>
        <label style={{ display: 'block', fontWeight: '600', fontSize: '15px', color: '#1f2937', marginBottom: '8px' }}>
          Título del Hotspot *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Ej: Sala de estar"
          autoFocus
          style={{
            width: '100%',
            padding: '14px 16px',
            fontSize: '16px', // iOS no zoom
            borderRadius: '12px',
            border: '2px solid #e5e7eb',
            outline: 'none',
            transition: 'border-color 0.2s',
            background: 'white',
            color: '#1f2937', // ✅ TEXTO OSCURO VISIBLE
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#667eea';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e5e7eb';
          }}
        />
      </div>

      {/* Tipo de Hotspot */}
      <div>
        <label style={{ display: 'block', fontWeight: '600', fontSize: '15px', color: '#1f2937', marginBottom: '8px' }}>
          Tipo de Hotspot *
        </label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          style={{
            width: '100%',
            padding: '14px 16px',
            fontSize: '16px',
            borderRadius: '12px',
            border: '2px solid #e5e7eb',
            outline: 'none',
            background: 'white',
            color: '#1f2937', // ✅ TEXTO OSCURO VISIBLE
          }}
        >
          <option value="navigation">🧭 Navegación (ir a otra vista)</option>
          <option value="info">ℹ️ Información (texto)</option>
          <option value="image">🖼️ Galería de imágenes</option>
          <option value="video">🎥 Video</option>
        </select>
      </div>

      {/* Campos condicionales según tipo */}
      {formData.type === 'navigation' && (
        <>
          {/* Vista de destino */}
          <div>
            <label style={{ display: 'block', fontWeight: '600', fontSize: '15px', color: '#1f2937', marginBottom: '8px' }}>
              ¿A dónde lleva? *
            </label>
            <select
              value={formData.targetImageIndex}
              onChange={(e) => setFormData({ ...formData, targetImageIndex: parseInt(e.target.value) })}
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '16px',
                borderRadius: '12px',
                border: '2px solid #e5e7eb',
                outline: 'none',
                background: 'white',
                color: '#1f2937', // ✅ TEXTO OSCURO VISIBLE
              }}
            >
              {viewNames.map((name, index) => (
                <option key={index} value={index}>
                  {name || `Vista ${index + 1}`}
                </option>
              ))}
            </select>
          </div>

          {/* Crear hotspot de regreso */}
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 16px',
              background: '#f3f4f6',
              borderRadius: '12px',
              cursor: 'pointer',
              touchAction: 'manipulation',
            }}
            onTouchStart={(e) => {
              e.currentTarget.style.background = '#e5e7eb';
            }}
            onTouchEnd={(e) => {
              e.currentTarget.style.background = '#f3f4f6';
            }}
          >
            <input
              type="checkbox"
              checked={formData.create_backlink}
              onChange={(e) => setFormData({ ...formData, create_backlink: e.target.checked })}
              style={{
                width: '22px',
                height: '22px',
                cursor: 'pointer',
              }}
            />
            <span style={{ fontSize: '15px', color: '#1f2937', fontWeight: '500' }}>
              ↩️ Crear hotspot de regreso automático
            </span>
          </label>
        </>
      )}

      {formData.type === 'info' && (
        <div>
          <label style={{ display: 'block', fontWeight: '600', fontSize: '15px', color: '#1f2937', marginBottom: '8px' }}>
            Texto Informativo *
          </label>
          <textarea
            value={formData.content_text}
            onChange={(e) => setFormData({ ...formData, content_text: e.target.value })}
            placeholder="Escribe la información que se mostrará..."
            rows={5}
            style={{
              width: '100%',
              padding: '14px 16px',
              fontSize: '16px',
              borderRadius: '12px',
              border: '2px solid #e5e7eb',
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit',
              background: 'white',
              color: '#1f2937', // ✅ TEXTO OSCURO VISIBLE
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#667eea';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e5e7eb';
            }}
          />
        </div>
      )}

      {formData.type === 'image' && (
        <div
          style={{
            padding: '16px',
            background: '#fef3c7',
            borderRadius: '12px',
            border: '2px solid #fbbf24',
          }}
        >
          <p style={{ margin: 0, fontSize: '14px', color: '#92400e', lineHeight: 1.5 }}>
            📱 Para agregar imágenes a la galería, usa la versión de escritorio del editor.
            En móvil solo puedes crear el hotspot de navegación.
          </p>
        </div>
      )}

      {formData.type === 'video' && (
        <div
          style={{
            padding: '16px',
            background: '#fef3c7',
            borderRadius: '12px',
            border: '2px solid #fbbf24',
          }}
        >
          <p style={{ margin: 0, fontSize: '14px', color: '#92400e', lineHeight: 1.5 }}>
            📱 Para agregar videos, usa la versión de escritorio del editor.
            En móvil solo puedes crear el hotspot de navegación.
          </p>
        </div>
      )}

      {/* Botones de acción */}
      <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
        <button
          type="submit"
          disabled={isLoading}
          style={{
            flex: 1,
            padding: '16px 24px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '14px',
            fontSize: '17px',
            fontWeight: '700',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            touchAction: 'manipulation',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            opacity: isLoading ? 0.6 : 1,
            minHeight: '56px',
          }}
          onTouchStart={(e) => {
            if (!isLoading) {
              e.currentTarget.style.transform = 'scale(0.96)';
            }
          }}
          onTouchEnd={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {isLoading ? '⏳ Guardando...' : isEditing ? '💾 Guardar Cambios' : '✅ Crear Hotspot'}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          style={{
            flex: 1,
            padding: '16px 24px',
            background: 'rgba(239, 68, 68, 0.9)',
            color: 'white',
            border: 'none',
            borderRadius: '14px',
            fontSize: '17px',
            fontWeight: '700',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            touchAction: 'manipulation',
            opacity: isLoading ? 0.6 : 1,
            minHeight: '56px',
          }}
          onTouchStart={(e) => {
            if (!isLoading) {
              e.currentTarget.style.transform = 'scale(0.96)';
            }
          }}
          onTouchEnd={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          ❌ Cancelar
        </button>
      </div>
    </form>
  );
}

// Importar React para useState
import React from 'react';
