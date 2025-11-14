'use client';

import { useState } from 'react';
import { HelpCircle, Play, Eye, X } from 'lucide-react';

interface HelpButtonProps {
  onStartTutorial: () => void;
  onViewDemo?: () => void;
}

export default function HelpButton({
  onStartTutorial,
  onViewDemo,
}: HelpButtonProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleToggleMenu = () => {
    console.log('HelpButton clicked, current state:', isMenuOpen);
    setIsMenuOpen(!isMenuOpen);
  };

  const handleStartTutorial = () => {
    console.log('Starting tutorial from HelpButton');
    setIsMenuOpen(false);
    onStartTutorial();
  };

  const handleViewDemo = () => {
    console.log('Starting demo from HelpButton');
    setIsMenuOpen(false);
    if (onViewDemo) {
      onViewDemo();
    }
  };

  return (
    <>
      {/* Overlay cuando el menú está abierto - debe estar ANTES para capturar clicks */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-[999]"
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(false);
          }}
        />
      )}

      {/* Botón flotante y menú */}
      <div className="fixed bottom-6 right-6 z-[1000]">
        {/* Menú desplegable */}
        {isMenuOpen && (
          <div className="absolute bottom-full right-0 mb-3 w-64 bg-white rounded-lg shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="bg-gradient-to-r from-teal-500 to-blue-600 px-4 py-3">
              <h3 className="text-white font-bold text-sm">
                ¿Necesitas ayuda?
              </h3>
              <p className="text-teal-50 text-xs">
                Elige una opción para comenzar
              </p>
            </div>

            <div className="p-2">
              <button
                onClick={handleStartTutorial}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-teal-50 rounded-lg transition-colors text-left group"
              >
                <div className="p-2 bg-teal-100 text-teal-600 rounded-lg group-hover:bg-teal-500 group-hover:text-white transition-colors">
                  <Play className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-sm">
                    Tutorial Guiado
                  </div>
                  <div className="text-xs text-slate-500">
                    Aprende paso a paso
                  </div>
                </div>
              </button>

              {onViewDemo && (
                <button
                  onClick={handleViewDemo}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-purple-50 rounded-lg transition-colors text-left group"
                >
                  <div className="p-2 bg-purple-100 text-purple-600 rounded-lg group-hover:bg-purple-500 group-hover:text-white transition-colors">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">
                      Ver Tour Demo
                    </div>
                    <div className="text-xs text-slate-500">
                      Explora un ejemplo
                    </div>
                  </div>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Botón principal */}
        <button
          onClick={handleToggleMenu}
          className={`
            flex items-center justify-center w-14 h-14 rounded-full shadow-2xl
            transition-all duration-200 hover:scale-110
            ${
              isMenuOpen
                ? 'bg-slate-700 rotate-90'
                : 'bg-gradient-to-br from-teal-500 to-blue-600 hover:shadow-teal-500/50'
            }
          `}
          aria-label="Ayuda"
          type="button"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <HelpCircle className="w-6 h-6 text-white" />
          )}
        </button>

        {/* Pulse effect cuando está cerrado */}
        {!isMenuOpen && (
          <div className="absolute inset-0 rounded-full bg-teal-400 animate-ping opacity-20 pointer-events-none" />
        )}
      </div>

      <style jsx global>{`
        @keyframes slide-in-from-bottom {
          from {
            opacity: 0;
            transform: translateY(0.5rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .slide-in-from-bottom-2 {
          animation-name: slide-in-from-bottom;
        }

        .animate-in {
          animation-fill-mode: both;
        }

        .fade-in {
          animation-name: fade-in;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .duration-200 {
          animation-duration: 200ms;
        }
      `}</style>
    </>
  );
}
