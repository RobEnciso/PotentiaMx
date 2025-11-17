/**
 * Bottom Sheet Component para móvil
 * Modal deslizable desde abajo para formularios en móvil
 */

import { useEffect, useRef, useState } from 'react';

export default function MobileBottomSheet({ isOpen, onClose, title, children, fullHeight = false }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const sheetRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Prevenir scroll del body cuando el sheet está abierto
      document.body.style.overflow = 'hidden';
      // Pequeño delay para animación
      setTimeout(() => setIsVisible(true), 10);
    } else {
      document.body.style.overflow = '';
      setIsVisible(false);
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setCurrentY(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;

    const touchY = e.touches[0].clientY;
    const diff = touchY - startY;

    // Solo permitir arrastrar hacia abajo
    if (diff > 0) {
      setCurrentY(touchY);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    const diff = currentY - startY;

    // Si arrastra más de 100px, cerrar
    if (diff > 100) {
      onClose();
    }

    setIsDragging(false);
    setStartY(0);
    setCurrentY(0);
  };

  const getTranslateY = () => {
    if (!isDragging) return 0;
    const diff = currentY - startY;
    return Math.max(0, diff);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 9998,
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          maxHeight: fullHeight ? '95vh' : '85vh',
          background: 'white',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.3)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          transform: isVisible ? `translateY(${getTranslateY()}px)` : 'translateY(100%)',
          transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      >
        {/* Handle para arrastrar */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            cursor: 'grab',
            touchAction: 'none',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          {/* Barra de arrastre */}
          <div
            style={{
              width: '48px',
              height: '5px',
              background: '#d1d5db',
              borderRadius: '3px',
            }}
          />

          {/* Título */}
          {title && (
            <h3
              style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: '700',
                color: '#1f2937',
                textAlign: 'center',
              }}
            >
              {title}
            </h3>
          )}
        </div>

        {/* Contenido scrollable */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            padding: '16px 20px',
            paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))',
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
}
