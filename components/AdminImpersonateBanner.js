'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, X } from 'lucide-react';
import {
  isImpersonating,
  getImpersonateData,
  stopImpersonating,
  logImpersonateEnd,
} from '@/lib/adminImpersonate';

/**
 * Banner que se muestra cuando el admin está impersonando a otro usuario
 */
export default function AdminImpersonateBanner() {
  const [show, setShow] = useState(false);
  const [impersonateData, setImpersonateData] = useState(null);

  useEffect(() => {
    // Verificar si hay sesión de impersonación activa
    const checkImpersonate = () => {
      if (isImpersonating()) {
        setShow(true);
        setImpersonateData(getImpersonateData());
      } else {
        setShow(false);
        setImpersonateData(null);
      }
    };

    checkImpersonate();

    // Verificar cada 5 segundos por si cambia
    const interval = setInterval(checkImpersonate, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleStopImpersonating = async () => {
    if (confirm('¿Terminar sesión de impersonación y volver a admin?')) {
      await logImpersonateEnd();
      stopImpersonating();
    }
  };

  if (!show || !impersonateData) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left side - Warning info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm animate-pulse">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="font-bold text-lg">
              🎭 Modo Administrador: Viendo como otro usuario
            </p>
            <p className="text-sm text-yellow-100">
              Usuario:{' '}
              <span className="font-semibold">
                {impersonateData.target_email}
              </span>
              {' • '}
              Desde:{' '}
              {new Date(impersonateData.started_at).toLocaleTimeString('es-MX')}
            </p>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleStopImpersonating}
            className="px-6 py-2 bg-white text-orange-700 font-bold rounded-lg hover:bg-orange-50 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Volver a Admin
          </button>

          <button
            onClick={() => setShow(false)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title="Ocultar banner (seguirás en modo impersonación)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Warning stripe */}
      <div className="h-1 bg-gradient-to-r from-yellow-600 to-orange-600 animate-pulse"></div>
    </div>
  );
}
