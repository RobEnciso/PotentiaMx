'use client';

import { useState } from 'react';
import { X, Sparkles, Play, Eye } from 'lucide-react';

interface WelcomeModalProps {
  onStartTutorial: () => void;
  onViewDemo: () => void;
  onClose: () => void;
  userName?: string;
}

export default function WelcomeModal({
  onStartTutorial,
  onViewDemo,
  onClose,
  userName,
}: WelcomeModalProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header con gradiente */}
          <div className="bg-gradient-to-br from-teal-500 to-blue-600 px-8 py-10 text-white relative overflow-hidden">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Decoración de fondo */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />

            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">
                    ¡Bienvenido{userName ? `, ${userName}` : ''}!
                  </h2>
                  <p className="text-teal-50 text-lg">
                    Tu plataforma de tours 360° está lista
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                ¿Cómo quieres empezar?
              </h3>
              <p className="text-slate-600">
                Preparamos dos opciones para que te familiarices rápidamente con
                PotentiaMX
              </p>
            </div>

            {/* Opciones */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {/* Opción 1: Tutorial Guiado */}
              <button
                onClick={() => {
                  handleClose();
                  setTimeout(onStartTutorial, 300);
                }}
                className="group p-6 bg-gradient-to-br from-teal-50 to-blue-50 border-2 border-teal-200 hover:border-teal-400 rounded-xl transition-all hover:shadow-lg hover:shadow-teal-500/20 text-left"
              >
                <div className="flex items-start gap-4 mb-3">
                  <div className="p-3 bg-teal-500 text-white rounded-lg group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1">
                      Tutorial Guiado
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Recorre paso a paso las funcionalidades clave del
                      dashboard y editor
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-teal-600 font-medium text-sm">
                  <span>Comenzar ahora</span>
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </button>

              {/* Opción 2: Ver Tour de Ejemplo */}
              <button
                onClick={() => {
                  handleClose();
                  setTimeout(onViewDemo, 300);
                }}
                className="group p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 hover:border-purple-400 rounded-xl transition-all hover:shadow-lg hover:shadow-purple-500/20 text-left"
              >
                <div className="flex items-start gap-4 mb-3">
                  <div className="p-3 bg-purple-500 text-white rounded-lg group-hover:scale-110 transition-transform">
                    <Eye className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1">
                      Mi Tour de Ejemplo
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Explora tu tour precargado. Puedes editarlo, agregar
                      hotspots o eliminarlo cuando quieras
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-purple-600 font-medium text-sm">
                  <span>Ver mi tour</span>
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </button>
            </div>

            {/* Footer */}
            <div className="text-center pt-4 border-t border-slate-100">
              <button
                onClick={handleClose}
                className="text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors"
              >
                Lo haré después - Ir al dashboard
              </button>
              <p className="text-xs text-slate-400 mt-2">
                Puedes acceder al tutorial en cualquier momento desde el botón
                de ayuda &ldquo;?&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
