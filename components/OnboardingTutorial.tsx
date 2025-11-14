'use client';

import { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, Check } from 'lucide-react';

interface TutorialStep {
  target: string;
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: string;
}

interface OnboardingTutorialProps {
  steps: TutorialStep[];
  onComplete: () => void;
  onSkip: () => void;
}

interface Position {
  top: number;
  left: number;
  arrowPosition: 'top' | 'bottom' | 'left' | 'right';
  arrowOffset: number;
}

export default function OnboardingTutorial({
  steps,
  onComplete,
  onSkip,
}: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [bubblePosition, setBubblePosition] = useState<Position | null>(null);
  const [spotlightRect, setSpotlightRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const step = steps[currentStep];
    if (!step) return;

    const element = document.querySelector(step.target) as HTMLElement;
    if (!element) {
      console.warn(`Tutorial: Elemento no encontrado ${step.target}`);
      return;
    }

    setTargetElement(element);

    // Scroll suave al elemento
    setTimeout(() => {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
    }, 100);

    const calculateBubblePosition = () => {
      const rect = element.getBoundingClientRect();
      setSpotlightRect(rect);

      // Dimensiones de la burbuja (compacta)
      const isMobile = window.innerWidth < 640;
      const bubbleWidth = isMobile
        ? Math.min(280, window.innerWidth - 32)
        : 320;
      const bubbleHeight = 140; // Altura estimada más pequeña
      const spacing = 16;
      const margin = 16;

      let top = 0;
      let left = 0;
      let arrowPos: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
      let arrowOffset = 50; // Porcentaje de posición de la flecha

      // Calcular posición según preferencia
      const positions = {
        top: {
          top: rect.top - bubbleHeight - spacing,
          left: rect.left + rect.width / 2 - bubbleWidth / 2,
          arrow: 'bottom' as const,
        },
        bottom: {
          top: rect.bottom + spacing,
          left: rect.left + rect.width / 2 - bubbleWidth / 2,
          arrow: 'top' as const,
        },
        left: {
          top: rect.top + rect.height / 2 - bubbleHeight / 2,
          left: rect.left - bubbleWidth - spacing,
          arrow: 'right' as const,
        },
        right: {
          top: rect.top + rect.height / 2 - bubbleHeight / 2,
          left: rect.right + spacing,
          arrow: 'left' as const,
        },
      };

      const preferred = positions[step.position];
      top = preferred.top;
      left = preferred.left;
      arrowPos = preferred.arrow;

      // Ajustar si se sale de la pantalla
      if (left < margin) {
        // Calcular offset de la flecha
        const elementCenterX = rect.left + rect.width / 2;
        arrowOffset = ((elementCenterX - margin) / bubbleWidth) * 100;
        arrowOffset = Math.max(15, Math.min(85, arrowOffset));
        left = margin;
      } else if (left + bubbleWidth > window.innerWidth - margin) {
        const elementCenterX = rect.left + rect.width / 2;
        arrowOffset =
          ((elementCenterX - (window.innerWidth - bubbleWidth - margin)) /
            bubbleWidth) *
          100;
        arrowOffset = Math.max(15, Math.min(85, arrowOffset));
        left = window.innerWidth - bubbleWidth - margin;
      }

      // Ajustar vertical
      if (top < margin) {
        if (
          rect.bottom + spacing + bubbleHeight <
          window.innerHeight - margin
        ) {
          top = rect.bottom + spacing;
          arrowPos = 'top';
        } else {
          top = margin;
        }
      } else if (top + bubbleHeight > window.innerHeight - margin) {
        if (rect.top - bubbleHeight - spacing > margin) {
          top = rect.top - bubbleHeight - spacing;
          arrowPos = 'bottom';
        } else {
          top = window.innerHeight - bubbleHeight - margin;
        }
      }

      setBubblePosition({ top, left, arrowPosition: arrowPos, arrowOffset });
    };

    calculateBubblePosition();

    window.addEventListener('resize', calculateBubblePosition);
    window.addEventListener('scroll', calculateBubblePosition, true);

    element.classList.add('tutorial-highlight');

    return () => {
      element.classList.remove('tutorial-highlight');
      window.removeEventListener('resize', calculateBubblePosition);
      window.removeEventListener('scroll', calculateBubblePosition, true);
    };
  }, [currentStep, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = steps[currentStep];
  if (!step || !bubblePosition) return null;

  // Componente de flecha SVG
  const Arrow = ({
    position,
    offset,
  }: {
    position: string;
    offset: number;
  }) => {
    const arrowSize = 12;
    const arrowStyles = {
      top: {
        bottom: -arrowSize,
        left: `${offset}%`,
        transform: 'translateX(-50%)',
      },
      bottom: {
        top: -arrowSize,
        left: `${offset}%`,
        transform: 'translateX(-50%)',
      },
      left: {
        right: -arrowSize,
        top: '50%',
        transform: 'translateY(-50%)',
      },
      right: {
        left: -arrowSize,
        top: '50%',
        transform: 'translateY(-50%)',
      },
    }[position];

    const paths = {
      top: 'M6 0 L12 12 L0 12 Z',
      bottom: 'M6 12 L12 0 L0 0 Z',
      left: 'M0 6 L12 0 L12 12 Z',
      right: 'M12 6 L0 0 L0 12 Z',
    }[position];

    return (
      <div className="absolute pointer-events-none" style={arrowStyles}>
        <svg width={arrowSize} height={arrowSize} className="drop-shadow-md">
          <path d={paths} fill="white" />
        </svg>
      </div>
    );
  };

  return (
    <>
      {/* Overlay sutil - mucho más transparente */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-[1px] transition-all duration-300"
        style={{ zIndex: 9990 }}
        onClick={onSkip}
      />

      {/* Highlight del elemento - solo borde animado */}
      {spotlightRect && (
        <div
          className="fixed pointer-events-none transition-all duration-300"
          style={{
            top: spotlightRect.top - 4,
            left: spotlightRect.left - 4,
            width: spotlightRect.width + 8,
            height: spotlightRect.height + 8,
            zIndex: 9995,
          }}
        >
          <div
            className="absolute inset-0 rounded-lg"
            style={{
              boxShadow:
                '0 0 0 3px rgba(20, 184, 166, 0.8), 0 0 20px rgba(20, 184, 166, 0.4)',
              animation: 'pulse-ring 2s ease-in-out infinite',
            }}
          />
        </div>
      )}

      {/* Burbuja compacta con flecha */}
      <div
        className="fixed bg-white rounded-2xl shadow-2xl border border-slate-200 transition-all duration-300"
        style={{
          top: bubblePosition.top,
          left: bubblePosition.left,
          zIndex: 10000,
          maxWidth: 'calc(100vw - 32px)',
          width: window.innerWidth < 640 ? '280px' : '320px',
        }}
      >
        {/* Flecha apuntando al elemento */}
        <Arrow
          position={bubblePosition.arrowPosition}
          offset={bubblePosition.arrowOffset}
        />

        <div className="p-4">
          {/* Header compacto */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="text-sm font-bold text-slate-900 leading-tight flex-1">
              {step.title}
            </h3>
            <button
              onClick={onSkip}
              className="flex-shrink-0 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Descripción concisa */}
          <p className="text-xs text-slate-600 leading-relaxed mb-3">
            {step.description}
          </p>

          {/* Puntos de progreso minimalistas */}
          <div className="flex items-center justify-center gap-1.5 mb-3">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'w-6 bg-teal-500'
                    : index < currentStep
                      ? 'w-1.5 bg-teal-300'
                      : 'w-1.5 bg-slate-300'
                }`}
              />
            ))}
          </div>

          {/* Botones minimalistas */}
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`p-2 rounded-lg transition-all ${
                currentStep === 0
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-600 hover:bg-slate-100 active:scale-95'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-medium text-slate-500">
              {currentStep + 1} / {steps.length}
            </span>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold rounded-lg transition-all active:scale-95 flex items-center gap-1.5"
              >
                Siguiente
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onComplete}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-lg transition-all active:scale-95 flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                Finalizar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Animaciones */}
      <style jsx global>{`
        @keyframes pulse-ring {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.02);
          }
        }

        .tutorial-highlight {
          position: relative !important;
          z-index: 9996 !important;
        }
      `}</style>
    </>
  );
}
