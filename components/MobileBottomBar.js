/**
 * Barra inferior móvil para el editor de hotspots
 * Implementa el diseño mobile-first según especificación
 */

export default function MobileBottomBar({
  currentView,
  totalViews,
  hotspotCount,
  hasUnsavedChanges,
  isSaving,
  onAddHotspot,
  onBack,
  onSave,
  onViewChange,
}) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.9) 100%)',
        padding: '12px 16px 16px',
        borderTop: '2px solid rgba(255, 255, 255, 0.1)',
        zIndex: 1000,
        boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Indicador de vista actual */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '12px',
          gap: '8px',
        }}
      >
        <span style={{ color: '#9ca3af', fontSize: '13px', fontWeight: '500' }}>
          Vista {currentView + 1} de {totalViews}
        </span>
        {hotspotCount > 0 && (
          <>
            <span style={{ color: '#4b5563', fontSize: '12px' }}>•</span>
            <span style={{ color: '#10b981', fontSize: '13px', fontWeight: '600' }}>
              {hotspotCount} hotspot{hotspotCount !== 1 ? 's' : ''}
            </span>
          </>
        )}
        {hasUnsavedChanges && (
          <>
            <span style={{ color: '#4b5563', fontSize: '12px' }}>•</span>
            <span style={{ color: '#fbbf24', fontSize: '13px', fontWeight: '600' }}>
              ⚠️ Sin guardar
            </span>
          </>
        )}
      </div>

      {/* Botones principales */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '12px',
        }}
      >
        {/* Botón Agregar Hotspot - Más prominente */}
        <button
          onClick={onAddHotspot}
          disabled={isSaving}
          style={{
            gridColumn: '1 / -1',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '16px',
            padding: '18px 24px',
            fontSize: '17px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)',
            transition: 'all 0.3s ease',
            touchAction: 'manipulation',
            cursor: isSaving ? 'not-allowed' : 'pointer',
            opacity: isSaving ? 0.6 : 1,
            minHeight: '56px', // iOS recommended touch target
          }}
          onTouchStart={(e) => {
            if (!isSaving) {
              e.currentTarget.style.transform = 'scale(0.96)';
            }
          }}
          onTouchEnd={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <span style={{ fontSize: '24px' }}>➕</span>
          <span>Nuevo Hotspot</span>
        </button>

        {/* Botón Guardar */}
        <button
          onClick={onSave}
          disabled={!hasUnsavedChanges || isSaving}
          style={{
            background: hasUnsavedChanges && !isSaving
              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
              : 'rgba(75, 85, 99, 0.5)',
            color: 'white',
            border: hasUnsavedChanges ? '2px solid #fbbf24' : '2px solid transparent',
            borderRadius: '12px',
            padding: '14px 20px',
            fontSize: '15px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: hasUnsavedChanges ? '0 2px 12px rgba(16, 185, 129, 0.3)' : 'none',
            transition: 'all 0.3s ease',
            touchAction: 'manipulation',
            cursor: !hasUnsavedChanges || isSaving ? 'not-allowed' : 'pointer',
            minHeight: '48px', // Androind recommended
          }}
          onTouchStart={(e) => {
            if (hasUnsavedChanges && !isSaving) {
              e.currentTarget.style.transform = 'scale(0.96)';
            }
          }}
          onTouchEnd={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <span style={{ fontSize: '18px' }}>{isSaving ? '⏳' : hasUnsavedChanges ? '💾' : '✅'}</span>
          <span>{isSaving ? 'Guardando...' : hasUnsavedChanges ? 'Guardar' : 'Guardado'}</span>
        </button>

        {/* Botón Volver */}
        <button
          onClick={onBack}
          disabled={isSaving}
          style={{
            background: hasUnsavedChanges
              ? 'rgba(239, 68, 68, 0.9)'
              : 'rgba(55, 65, 81, 0.8)',
            color: 'white',
            border: hasUnsavedChanges ? '2px solid #fbbf24' : '2px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            padding: '14px 20px',
            fontSize: '15px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.3s ease',
            touchAction: 'manipulation',
            cursor: isSaving ? 'not-allowed' : 'pointer',
            opacity: isSaving ? 0.6 : 1,
            minHeight: '48px',
          }}
          onTouchStart={(e) => {
            if (!isSaving) {
              e.currentTarget.style.transform = 'scale(0.96)';
            }
          }}
          onTouchEnd={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <span>{hasUnsavedChanges ? '⚠️' : '←'}</span>
          <span>Volver</span>
        </button>
      </div>

      {/* Selector de vistas - Solo si hay múltiples vistas */}
      {totalViews > 1 && (
        <div
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            paddingBottom: '4px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          className="hide-scrollbar"
        >
          {Array.from({ length: totalViews }).map((_, index) => (
            <button
              key={index}
              onClick={() => onViewChange(index)}
              disabled={isSaving}
              style={{
                minWidth: '60px',
                padding: '8px 16px',
                background: currentView === index
                  ? 'rgba(102, 126, 234, 0.9)'
                  : 'rgba(75, 85, 99, 0.5)',
                color: 'white',
                border: currentView === index
                  ? '2px solid #667eea'
                  : '2px solid transparent',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: currentView === index ? '700' : '500',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                touchAction: 'manipulation',
                whiteSpace: 'nowrap',
                boxShadow: currentView === index
                  ? '0 2px 8px rgba(102, 126, 234, 0.4)'
                  : 'none',
              }}
              onTouchStart={(e) => {
                if (!isSaving && currentView !== index) {
                  e.currentTarget.style.transform = 'scale(0.94)';
                }
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}

      {/* Safe area padding para iOS */}
      <div style={{ height: 'env(safe-area-inset-bottom, 0px)' }} />
    </div>
  );
}
