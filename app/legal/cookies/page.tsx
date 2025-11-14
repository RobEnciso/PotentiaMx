import LegalLayout from '@/components/legal/LegalLayout';

export const metadata = {
  title: 'Política de Cookies | PotentiaMX',
  description:
    'Política de Cookies de PotentiaMX - Información sobre cookies y tecnologías de rastreo',
};

export default function CookiesPolicyPage() {
  return (
    <LegalLayout
      title="Política de Cookies"
      lastUpdated="13 de Noviembre, 2025"
    >
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          ¿Qué son las Cookies?
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Las <strong>cookies</strong> son pequeños archivos de texto que se
          almacenan en su dispositivo cuando visita un sitio web.
        </p>
        <p className="text-gray-700 leading-relaxed">
          Las cookies permiten que el sitio web recuerde sus preferencias,
          mantenga su sesión iniciada, y analice cómo usa el sitio para mejorar
          la experiencia.
        </p>
      </section>

      <section className="mb-8 mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          ¿Por qué Usamos Cookies?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <div className="text-3xl mb-3">🔐</div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Funcionalidad Esencial
            </h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Mantener sesión iniciada</li>
              <li>• Protección contra CSRF</li>
              <li>• Recordar preferencias</li>
            </ul>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <div className="text-3xl mb-3">📊</div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Rendimiento y Analytics
            </h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Análisis de uso</li>
              <li>• Detección de errores</li>
              <li>• Optimización del sitio</li>
            </ul>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <div className="text-3xl mb-3">🎯</div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Publicidad y Marketing
            </h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Remarketing</li>
              <li>• Email marketing</li>
              <li>• Personalización</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Tipos de Cookies que Utilizamos
        </h2>

        <div className="space-y-6">
          {/* Cookies Esenciales */}
          <div className="border-l-4 border-green-500 bg-white p-6 rounded-r-lg shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
              <span className="mr-2">🟢</span> COOKIES ESENCIALES (Necesarias)
            </h3>
            <p className="text-sm text-gray-600 mb-4 italic">
              Estas cookies son estrictamente necesarias para el funcionamiento
              de la plataforma. NO pueden deshabilitarse sin afectar el
              servicio.
            </p>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
                      Nombre
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
                      Proveedor
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
                      Propósito
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
                      Duración
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm">
                  <tr>
                    <td className="px-3 py-2 font-mono text-xs">
                      sb-access-token
                    </td>
                    <td className="px-3 py-2">Supabase</td>
                    <td className="px-3 py-2">Token de autenticación</td>
                    <td className="px-3 py-2">1 hora</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono text-xs">
                      sb-refresh-token
                    </td>
                    <td className="px-3 py-2">Supabase</td>
                    <td className="px-3 py-2">Renovar sesión</td>
                    <td className="px-3 py-2">30 días</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono text-xs">csrf-token</td>
                    <td className="px-3 py-2">PotentiaMX</td>
                    <td className="px-3 py-2">Protección CSRF</td>
                    <td className="px-3 py-2">Sesión</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Cookies de Analytics */}
          <div className="border-l-4 border-blue-500 bg-white p-6 rounded-r-lg shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
              <span className="mr-2">🔵</span> COOKIES DE ANALYTICS (Requieren
              consentimiento)
            </h3>
            <p className="text-sm text-gray-600 mb-4 italic">
              Nos ayudan a entender cómo los usuarios usan la plataforma. Puede
              desactivarlas sin afectar la funcionalidad principal.
            </p>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
                      Nombre
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
                      Proveedor
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
                      Propósito
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
                      Duración
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm">
                  <tr>
                    <td className="px-3 py-2 font-mono text-xs">_ga</td>
                    <td className="px-3 py-2">Google Analytics</td>
                    <td className="px-3 py-2">Distinguir usuarios</td>
                    <td className="px-3 py-2">2 años</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono text-xs">_gid</td>
                    <td className="px-3 py-2">Google Analytics</td>
                    <td className="px-3 py-2">Distinguir usuarios</td>
                    <td className="px-3 py-2">24 horas</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono text-xs">_gat</td>
                    <td className="px-3 py-2">Google Analytics</td>
                    <td className="px-3 py-2">Limitar solicitudes</td>
                    <td className="px-3 py-2">1 minuto</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 bg-blue-50 p-3 rounded border border-blue-200">
              <p className="text-sm text-gray-700">
                <strong>Estas cookies nos permiten:</strong>
              </p>
              <ul className="text-sm text-gray-700 mt-2 space-y-1">
                <li>• Entender qué páginas son más visitadas</li>
                <li>• Medir el tiempo de permanencia en tours</li>
                <li>• Conocer qué dispositivos usan nuestros usuarios</li>
                <li>• Identificar de qué regiones provienen las visitas</li>
              </ul>
            </div>
          </div>

          {/* Cookies de Marketing */}
          <div className="border-l-4 border-yellow-500 bg-white p-6 rounded-r-lg shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
              <span className="mr-2">🟡</span> COOKIES DE MARKETING (Requieren
              consentimiento)
            </h3>
            <p className="text-sm text-gray-600 mb-4 italic">
              Permiten mostrarle anuncios relevantes en otros sitios web. Puede
              desactivarlas en cualquier momento.
            </p>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
                      Nombre
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
                      Proveedor
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
                      Propósito
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
                      Duración
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm">
                  <tr>
                    <td className="px-3 py-2 font-mono text-xs">_fbp</td>
                    <td className="px-3 py-2">Facebook Pixel</td>
                    <td className="px-3 py-2">Remarketing</td>
                    <td className="px-3 py-2">90 días</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-mono text-xs">IDE</td>
                    <td className="px-3 py-2">Google Ads</td>
                    <td className="px-3 py-2">Remarketing</td>
                    <td className="px-3 py-2">1 año</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Cookies de Terceros
        </h2>
        <p className="text-gray-700 mb-4">
          Algunos servicios externos que utilizamos también instalan cookies:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2">🔐 Supabase</h4>
            <p className="text-sm text-gray-700 mb-2">
              Autenticación y gestión de sesión
            </p>
            <a
              href="https://supabase.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-teal-600 hover:underline"
            >
              Ver política de privacidad →
            </a>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2">
              📊 Google Analytics
            </h4>
            <p className="text-sm text-gray-700 mb-2">
              Estadísticas de uso anónimas
            </p>
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-teal-600 hover:underline"
            >
              Ver política de privacidad →
            </a>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2">
              💳 OpenPay / Stripe
            </h4>
            <p className="text-sm text-gray-700 mb-2">
              Procesamiento de pagos seguro
            </p>
            <a
              href="https://www.openpay.mx/aviso-de-privacidad.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-teal-600 hover:underline"
            >
              OpenPay →
            </a>{' '}
            |{' '}
            <a
              href="https://stripe.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-teal-600 hover:underline"
            >
              Stripe →
            </a>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2">🌐 Netlify</h4>
            <p className="text-sm text-gray-700 mb-2">Hosting y CDN</p>
            <a
              href="https://www.netlify.com/privacy/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-teal-600 hover:underline"
            >
              Ver política de privacidad →
            </a>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Gestión de Cookies
        </h2>

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-lg border border-teal-200">
            <h4 className="font-semibold text-gray-900 mb-3">
              ⚙️ Panel de Preferencias de Cookies
            </h4>
            <p className="text-sm text-gray-700 mb-3">
              Al visitar PotentiaMX por primera vez, verá un banner de
              consentimiento donde puede:
            </p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✅ Aceptar todas las cookies</li>
              <li>⚙️ Personalizar preferencias (elegir qué tipos acepta)</li>
              <li>❌ Rechazar cookies no esenciales</li>
            </ul>
            <p className="text-sm text-gray-700 mt-3">
              Puede modificar sus preferencias en cualquier momento desde el pie
              de página.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">
              🌐 Configuración del Navegador
            </h4>
            <p className="text-sm text-gray-700 mb-3">
              También puede gestionar cookies directamente desde su navegador:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white p-4 rounded border border-gray-200">
                <h5 className="font-medium text-gray-900 text-sm mb-2">
                  Google Chrome
                </h5>
                <p className="text-xs text-gray-600">
                  Menú (⋮) → Configuración → Privacidad y seguridad → Cookies y
                  otros datos de sitios
                </p>
              </div>

              <div className="bg-white p-4 rounded border border-gray-200">
                <h5 className="font-medium text-gray-900 text-sm mb-2">
                  Mozilla Firefox
                </h5>
                <p className="text-xs text-gray-600">
                  Menú (☰) → Configuración → Privacidad y seguridad → Cookies y
                  datos del sitio
                </p>
              </div>

              <div className="bg-white p-4 rounded border border-gray-200">
                <h5 className="font-medium text-gray-900 text-sm mb-2">
                  Safari
                </h5>
                <p className="text-xs text-gray-600">
                  Preferencias → Privacidad → Administrar datos de sitios web
                </p>
              </div>

              <div className="bg-white p-4 rounded border border-gray-200">
                <h5 className="font-medium text-gray-900 text-sm mb-2">
                  Microsoft Edge
                </h5>
                <p className="text-xs text-gray-600">
                  Menú (…) → Configuración → Cookies y permisos del sitio
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Consecuencias de Desactivar Cookies
        </h2>

        <div className="space-y-3">
          <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
            <h4 className="font-semibold text-red-900 mb-2">
              ❌ Si desactiva cookies esenciales:
            </h4>
            <ul className="text-sm text-red-800 space-y-1">
              <li>• No podrá iniciar sesión</li>
              <li>• No podrá crear o editar tours</li>
              <li>• Perderá acceso a su panel de control</li>
            </ul>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <h4 className="font-semibold text-blue-900 mb-2">
              📊 Si desactiva cookies de analytics:
            </h4>
            <p className="text-sm text-blue-800">
              ✅ Podrá usar la plataforma normalmente. No contribuirá a nuestras
              estadísticas de uso (anónimas).
            </p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
            <h4 className="font-semibold text-yellow-900 mb-2">
              🎯 Si desactiva cookies de marketing:
            </h4>
            <p className="text-sm text-yellow-800">
              ✅ Podrá usar la plataforma normalmente. Seguirá viendo anuncios,
              pero menos relevantes.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Cookies en Tours Embebidos (iFrames)
        </h2>
        <p className="text-gray-700 mb-4">
          Cuando embebe un tour de PotentiaMX en su sitio web, el tour puede
          usar cookies para:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
          <li>Rastrear vistas y duración de visualización</li>
          <li>Registrar hotspots clickeados</li>
          <li>Recordar progreso del tour</li>
        </ul>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p className="text-sm text-yellow-800 mb-2">
            <strong>⚖️ Responsabilidad:</strong> Si embebe un tour en su sitio
            web:
          </p>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>
              • Es responsable de informar a sus visitantes sobre las cookies de
              PotentiaMX
            </li>
            <li>
              • Debe incluir esta información en su propia Política de Cookies
            </li>
            <li>
              • Debe obtener consentimiento conforme a leyes aplicables (GDPR si
              tiene visitantes de la UE)
            </li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Recursos Adicionales
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2">
              📚 Más información sobre cookies
            </h4>
            <ul className="text-sm space-y-1">
              <li>
                <a
                  href="https://www.allaboutcookies.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:underline"
                >
                  All About Cookies →
                </a>
              </li>
              <li>
                <a
                  href="https://es.wikipedia.org/wiki/Cookie_(inform%C3%A1tica)"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:underline"
                >
                  Wikipedia - HTTP Cookie →
                </a>
              </li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2">
              🚫 Desactivar cookies de publicidad
            </h4>
            <ul className="text-sm space-y-1">
              <li>
                <a
                  href="https://www.youronlinechoices.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:underline"
                >
                  Your Online Choices (UE) →
                </a>
              </li>
              <li>
                <a
                  href="https://optout.networkadvertising.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:underline"
                >
                  Network Advertising Initiative →
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Sus Derechos</h2>
        <p className="text-gray-700 mb-4">
          Conforme a la LFPDPPP, usted tiene derecho a acceder, rectificar,
          cancelar u oponerse al uso de cookies y datos asociados.
        </p>
        <p className="text-gray-700">
          <strong>Para ejercer estos derechos:</strong>{' '}
          <a
            href="mailto:legal@potentiamx.com"
            className="text-teal-600 font-medium underline"
          >
            legal@potentiamx.com
          </a>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Consentimiento
        </h2>
        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-lg border-2 border-teal-300">
          <p className="text-gray-800 font-medium">
            Al hacer clic en <strong>"Aceptar cookies"</strong> en nuestro
            banner, usted acepta el uso de cookies conforme a esta Política.
          </p>
          <p className="text-gray-700 mt-3 text-sm">
            Puede retirar su consentimiento en cualquier momento desde{' '}
            <strong>"Configuración de Cookies"</strong> en el pie de página.
          </p>
        </div>
      </section>

      <div className="mt-12 pt-8 border-t-2 border-gray-200 text-center">
        <p className="text-sm text-gray-500">
          Fecha de entrada en vigor: 13 de Noviembre, 2025
        </p>
        <p className="text-sm text-gray-500 mt-2">
          © 2025 PotentiaMX - Todos los derechos reservados
        </p>
      </div>
    </LegalLayout>
  );
}
