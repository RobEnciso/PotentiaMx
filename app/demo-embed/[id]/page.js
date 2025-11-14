'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabaseClient';
import Link from 'next/link';

/**
 * PÁGINA DEMO DE EMBEDDING
 *
 * Muestra a los clientes cómo se verá su tour embebido en un sitio web externo.
 * Incluye ejemplos de código y preview en vivo.
 */

export default function DemoEmbedPage() {
  const params = useParams();
  const supabase = createClient();
  const [terreno, setTerreno] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    const loadTerreno = async () => {
      if (!params.id) return;

      const { data } = await supabase
        .from('terrenos')
        .select('*')
        .eq('id', params.id)
        .single();

      setTerreno(data);
      setLoading(false);
    };

    loadTerreno();
  }, [params.id, supabase]);

  const copyCode = (codeId, buttonIndex) => {
    const codes = {
      responsive: `<div style="position: relative; width: 100%; padding-bottom: 56.25%;">
    <iframe
        src="${window.location.origin}/embed/terreno/${params.id}"
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
        allowfullscreen
        loading="lazy"
        title="Tour Virtual 360°"
    ></iframe>
</div>`,
      fixed: `<iframe
    src="${window.location.origin}/embed/terreno/${params.id}"
    width="100%"
    height="600"
    frameborder="0"
    allowfullscreen
    loading="lazy"
    title="Tour Virtual 360°"
></iframe>`,
    };

    navigator.clipboard.writeText(codes[codeId]);
    setCopiedCode(buttonIndex);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-white text-lg">Cargando demo...</p>
        </div>
      </div>
    );
  }

  if (!terreno) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="text-center text-white max-w-md px-6">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-2">Tour no encontrado</h1>
          <p className="text-slate-400 mb-6">
            No se pudo cargar la información del tour
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg transition-colors"
          >
            Volver al Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="text-center text-white mb-12">
          <Link
            href="/dashboard"
            className="inline-block mb-6 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-colors text-sm"
          >
            ← Volver al Dashboard
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            🌐 Demo de Embedding
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Así se verá "{terreno.title}" incrustado en tu sitio web
          </p>
        </header>

        {/* Preview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Preview 1 - Desktop */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-r from-teal-500 to-blue-500 p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">💻 Vista Desktop</h2>
              <p className="text-teal-50">
                Así se ve en computadoras y tablets
              </p>
            </div>
            <div
              className="relative w-full bg-slate-900"
              style={{ paddingBottom: '75%' }}
            >
              <iframe
                src={`${window.location.origin}/embed/terreno/${params.id}`}
                className="absolute top-0 left-0 w-full h-full"
                allowFullScreen
                loading="lazy"
                title={`Tour Virtual 360° - ${terreno.title}`}
              />
            </div>
          </div>

          {/* Preview 2 - iPhone Mockup */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 transform hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white rounded-xl mb-6">
              <h2 className="text-2xl font-bold mb-2">📱 Vista iPhone</h2>
              <p className="text-blue-50">Perfecto en dispositivos móviles</p>
            </div>

            {/* iPhone 14 Pro Mockup */}
            <div className="flex justify-center items-center">
              <div
                className="relative"
                style={{ width: '300px', height: '610px' }}
              >
                {/* iPhone Frame */}
                <div
                  className="absolute inset-0 rounded-[50px] bg-gradient-to-b from-gray-800 to-gray-900 shadow-2xl"
                  style={{
                    border: '12px solid #1f2937',
                    boxShadow:
                      '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.1)',
                  }}
                >
                  {/* Notch */}
                  <div
                    className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-black rounded-b-3xl z-20"
                    style={{
                      width: '120px',
                      height: '30px',
                    }}
                  >
                    {/* Camera */}
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-10 h-3 bg-gray-900 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-blue-900 rounded-full"></div>
                    </div>
                  </div>

                  {/* Screen */}
                  <div className="absolute inset-0 m-1 rounded-[42px] bg-black overflow-hidden">
                    <iframe
                      src={`${window.location.origin}/embed/terreno/${params.id}`}
                      className="w-full h-full"
                      style={{ border: 'none' }}
                      allowFullScreen
                      loading="lazy"
                      title={`Tour Virtual 360° - ${terreno.title} - Mobile`}
                    />
                  </div>

                  {/* Power Button */}
                  <div
                    className="absolute right-0 bg-gray-700 rounded-r"
                    style={{
                      top: '150px',
                      width: '4px',
                      height: '60px',
                    }}
                  ></div>

                  {/* Volume Buttons */}
                  <div
                    className="absolute left-0 bg-gray-700 rounded-l"
                    style={{
                      top: '120px',
                      width: '4px',
                      height: '30px',
                    }}
                  ></div>
                  <div
                    className="absolute left-0 bg-gray-700 rounded-l"
                    style={{
                      top: '160px',
                      width: '4px',
                      height: '30px',
                    }}
                  ></div>
                  <div
                    className="absolute left-0 bg-gray-700 rounded-l"
                    style={{
                      top: '200px',
                      width: '4px',
                      height: '30px',
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <p className="text-center text-sm text-slate-600 mt-6">
              ✨ Se adapta perfectamente a cualquier dispositivo móvil
            </p>
          </div>
        </div>

        {/* Code Section */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            💻 Código para tu Sitio Web
          </h2>

          {/* Responsive Code */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-slate-700">
                Opción 1: Responsive (Recomendado)
              </h3>
              <button
                onClick={() => copyCode('responsive', 1)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  copiedCode === 1
                    ? 'bg-green-500 text-white'
                    : 'bg-teal-500 hover:bg-teal-600 text-white'
                }`}
              >
                {copiedCode === 1 ? '✅ ¡Copiado!' : '📋 Copiar Código'}
              </button>
            </div>
            <pre className="bg-slate-900 text-green-400 p-6 rounded-lg overflow-x-auto text-sm font-mono">
              {`<div style="position: relative; width: 100%; padding-bottom: 56.25%;">
    <iframe
        src="${window.location.origin}/embed/terreno/${params.id}"
        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
        allowfullscreen
        loading="lazy"
        title="Tour Virtual 360°"
    ></iframe>
</div>`}
            </pre>
          </div>

          {/* Fixed Code */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-slate-700">
                Opción 2: Dimensiones Fijas
              </h3>
              <button
                onClick={() => copyCode('fixed', 2)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  copiedCode === 2
                    ? 'bg-green-500 text-white'
                    : 'bg-teal-500 hover:bg-teal-600 text-white'
                }`}
              >
                {copiedCode === 2 ? '✅ ¡Copiado!' : '📋 Copiar Código'}
              </button>
            </div>
            <pre className="bg-slate-900 text-green-400 p-6 rounded-lg overflow-x-auto text-sm font-mono">
              {`<iframe
    src="${window.location.origin}/embed/terreno/${params.id}"
    width="100%"
    height="600"
    frameborder="0"
    allowfullscreen
    loading="lazy"
    title="Tour Virtual 360°"
></iframe>`}
            </pre>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl shadow-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-6">📝 Instrucciones Rápidas</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <span className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center">
                  1
                </span>
                Copia el código
              </h3>
              <p className="text-blue-50 leading-relaxed">
                Haz clic en "Copiar Código" para el tipo que prefieras
                (responsive o fijo)
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <span className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center">
                  2
                </span>
                Pega en tu sitio
              </h3>
              <p className="text-blue-50 leading-relaxed">
                Pega el código donde quieras que aparezca el tour (WordPress,
                Wix, HTML, etc.)
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <span className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center">
                  3
                </span>
                Publica
              </h3>
              <p className="text-blue-50 leading-relaxed">
                Guarda los cambios y publica tu página. El tour se mostrará
                automáticamente
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <span className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center">
                  4
                </span>
                ¡Listo!
              </h3>
              <p className="text-blue-50 leading-relaxed">
                Tu tour 360° estará disponible para todos tus visitantes
              </p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <p className="text-sm">
              💡 <strong>Tip:</strong> Usa la opción responsive para que se vea
              perfecto en móviles y tablets
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-white mt-12">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg font-semibold transition-colors"
            >
              ← Volver al Dashboard
            </Link>
            <Link
              href={`/embed/terreno/${params.id}`}
              target="_blank"
              className="px-6 py-3 bg-teal-500 hover:bg-teal-600 rounded-lg font-semibold transition-colors"
            >
              Ver Solo el Tour →
            </Link>
          </div>
          <p className="mt-8 text-white/70 text-sm">
            Powered by <span className="font-semibold">Potentia</span> - Tours
            Virtuales 360°
          </p>
        </footer>
      </div>
    </div>
  );
}
