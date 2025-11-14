import LegalLayout from '@/components/legal/LegalLayout';
import Link from 'next/link';

export const metadata = {
  title: 'Términos y Condiciones | PotentiaMX',
  description:
    'Términos y Condiciones de Uso de PotentiaMX - Plataforma de tours virtuales 360°',
};

export default function TermsOfServicePage() {
  return (
    <LegalLayout
      title="Términos y Condiciones de Uso"
      lastUpdated="13 de Noviembre, 2025"
    >
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          1. Aceptación de los Términos
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Al acceder y utilizar la plataforma <strong>PotentiaMX</strong>, usted
          acepta cumplir con estos Términos y Condiciones de Uso.
        </p>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
          <h3 className="font-semibold text-gray-900 mb-2">Capacidad Legal</h3>
          <p className="text-sm text-gray-700">
            Para utilizar este Servicio, usted debe:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
            <li>Ser mayor de 18 años</li>
            <li>
              Tener capacidad legal para contratar conforme a las leyes de
              México
            </li>
            <li>No estar inhabilitado legalmente para usar el Servicio</li>
          </ul>
        </div>
      </section>

      <section className="mb-8 mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          2. Descripción del Servicio
        </h2>
        <p className="text-gray-700 mb-4">
          PotentiaMX es una plataforma SaaS que permite crear, gestionar y
          publicar <strong>tours virtuales 360°</strong> de propiedades
          inmobiliarias.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-lg border border-teal-200">
            <h4 className="font-semibold text-gray-900 mb-2">
              📸 Software de Tours
            </h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Editor 360° interactivo</li>
              <li>• Visor público responsivo</li>
              <li>• Sistema de embedding</li>
              <li>• Captura de leads</li>
              <li>• Analytics (según plan)</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-gray-900 mb-2">
              🎥 Servicio de Captura
            </h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Sesiones terrestres (Insta360 X4)</li>
              <li>• Sesiones aéreas (DJI Air 3S)</li>
              <li>• Video promocional (GH5)</li>
              <li>• Edición profesional</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-gray-900 mb-2">🏘️ Marketplace</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Publicación gratuita</li>
              <li>• Sin comisiones</li>
              <li>• Visibilidad amplia</li>
              <li>• Moderación de calidad</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          3. Planes y Suscripciones
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Plan
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Precio
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Tours
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Características
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 font-medium">FREE</td>
                <td className="px-4 py-3 text-sm">$0</td>
                <td className="px-4 py-3 text-sm">2</td>
                <td className="px-4 py-3 text-sm">Marca de agua, limitado</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">STARTER</td>
                <td className="px-4 py-3 text-sm">$580 MXN/mes</td>
                <td className="px-4 py-3 text-sm">10</td>
                <td className="px-4 py-3 text-sm">
                  Sin marca, leads, 1 sesión/trimestre
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">PRO</td>
                <td className="px-4 py-3 text-sm">$1,580 MXN/mes</td>
                <td className="px-4 py-3 text-sm">30</td>
                <td className="px-4 py-3 text-sm">
                  Branding, analytics, 1 sesión/mes
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">BUSINESS</td>
                <td className="px-4 py-3 text-sm">$3,980 MXN/mes</td>
                <td className="px-4 py-3 text-sm">Ilimitados</td>
                <td className="px-4 py-3 text-sm">
                  White-label, CRM, 2 sesiones/mes
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          4. Pagos y Facturación
        </h2>

        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-gray-900 mb-2">
              💳 Métodos de Pago
            </h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Tarjetas de crédito/débito (Visa, Mastercard, AmEx)</li>
              <li>• OXXO y tiendas de conveniencia (vía OpenPay)</li>
              <li>• Transferencias bancarias (SPEI)</li>
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-semibold text-gray-900 mb-2">
              📄 Facturación Electrónica
            </h4>
            <p className="text-sm text-gray-700">
              Emitimos facturas electrónicas (CFDIs) conforme al SAT. Solicita
              tu factura con tu RFC y datos fiscales dentro de las primeras 72
              horas del pago.
            </p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-semibold text-gray-900 mb-2">💰 IVA</h4>
            <p className="text-sm text-gray-700">
              Los precios <strong>NO incluyen IVA (16%)</strong>, el cual se
              aplicará conforme a la legislación fiscal mexicana.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          5. Período de Prueba y Garantía
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-2 border-teal-300 rounded-lg p-6 bg-white">
            <div className="text-3xl mb-3">✨</div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Prueba de 7 Días
            </h4>
            <p className="text-sm text-gray-700">
              Nuevos usuarios de planes de pago tienen 7 días de prueba
              gratuita. Cancela sin cargos durante este período.
            </p>
          </div>

          <div className="border-2 border-green-300 rounded-lg p-6 bg-white">
            <div className="text-3xl mb-3">💰</div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Garantía de Devolución
            </h4>
            <p className="text-sm text-gray-700">
              Garantía de devolución de <strong>7 días sin preguntas</strong>.
              Si no está satisfecho, solicite reembolso completo a:
              hola@potentiamx.com
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          6. Propiedad Intelectual
        </h2>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              🔐 Derechos de PotentiaMX
            </h4>
            <p className="text-gray-700 text-sm">
              Todo el software, código, diseño y marcas son propiedad de
              PotentiaMX. No puede copiar, modificar o redistribuir sin
              autorización.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              📸 Sus Derechos sobre Contenido
            </h4>
            <p className="text-gray-700 text-sm mb-2">
              <strong>Usted conserva todos los derechos</strong> sobre
              fotografías y descripciones que suba.
            </p>
            <p className="text-gray-700 text-sm">
              Nos otorga una <strong>licencia no exclusiva</strong> para mostrar
              su contenido en la plataforma y marketplace. Esta licencia termina
              cuando elimina el contenido.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          7. Marketplace y Publicación de Propiedades
        </h2>

        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-lg border border-teal-200 mb-4">
          <h4 className="font-semibold text-gray-900 mb-3">
            Requisitos para Publicar
          </h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Imágenes 360° nítidas y bien iluminadas</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>
                Información veraz (ubicación, precio, características)
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Sin conflictos legales o documentación incompleta</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>Sin contenido discriminatorio</span>
            </li>
          </ul>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-700">
            <strong>💰 Sin Comisiones:</strong> No cobramos comisiones por
            ventas o rentas generadas a través del marketplace. La transacción
            es directamente entre usted y el interesado.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          8. Uso Aceptable y Prohibiciones
        </h2>

        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <h4 className="font-semibold text-red-900 mb-2">
            ❌ NO puede utilizar PotentiaMX para:
          </h4>
          <ul className="text-sm text-red-800 space-y-1">
            <li>• Publicar contenido ilegal, obsceno o fraudulento</li>
            <li>• Violar derechos de propiedad intelectual</li>
            <li>• Realizar phishing, spam o actividades fraudulentas</li>
            <li>• Intentar hackear o dañar la plataforma</li>
            <li>• Usar bots o scrapers no autorizados</li>
            <li>• Publicar propiedades inexistentes o con información falsa</li>
            <li>
              • Discriminar por raza, género, religión, orientación sexual, etc.
            </li>
          </ul>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <p className="text-sm text-orange-800">
            <strong>Consecuencias:</strong> Violaciones pueden resultar en
            advertencia, suspensión temporal, cancelación permanente sin
            reembolso, o acciones legales.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          9. Responsabilidades y Limitaciones
        </h2>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Disponibilidad del Servicio (SLA)
            </h4>
            <p className="text-sm text-gray-700 mb-2">
              <strong>Objetivo de disponibilidad:</strong> 99.5% de uptime
              mensual
            </p>
            <p className="text-sm text-gray-600">
              No garantizamos disponibilidad ininterrumpida. Podemos realizar
              mantenimientos programados (notificando con 48h de anticipación).
            </p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-semibold text-gray-900 mb-2">
              ⚠️ Limitación de Responsabilidad
            </h4>
            <p className="text-sm text-gray-700 mb-2">
              PotentiaMX NO es responsable de:
            </p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Pérdida de ganancias o ventas no concretadas</li>
              <li>• Errores en información proporcionada por usuarios</li>
              <li>• Disputas entre usuarios y visitantes/compradores</li>
              <li>• Daños indirectos o consecuenciales</li>
            </ul>
            <p className="text-sm text-gray-700 mt-3">
              <strong>Responsabilidad máxima:</strong> Limitada al monto pagado
              en los últimos 3 meses.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          10. Cancelación y Terminación
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2">Por el Usuario</h4>
            <p className="text-sm text-gray-700">
              Puede cancelar su suscripción en cualquier momento desde su panel
              de control. La cancelación será efectiva al final del período
              actual.
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2">Por PotentiaMX</h4>
            <p className="text-sm text-gray-700">
              Podemos suspender o cancelar su cuenta por violación de estos
              Términos, pagos rechazados, o actividades ilegales.
            </p>
          </div>
        </div>

        <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-700">
            <strong>Al cancelar:</strong> Sus tours permanecerán visibles por 30
            días para que pueda descargarlos. Después serán eliminados
            permanentemente.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          11. Privacidad
        </h2>
        <p className="text-gray-700">
          El tratamiento de sus datos personales se rige por nuestro{' '}
          <Link
            href="/legal/privacidad"
            className="text-teal-600 font-medium underline"
          >
            Aviso de Privacidad
          </Link>
          , el cual forma parte integral de estos Términos.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          12. Legislación Aplicable y Jurisdicción
        </h2>
        <p className="text-gray-700 mb-4">
          Estos Términos se rigen por las leyes de <strong>México</strong>:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
          <li>Código de Comercio</li>
          <li>Código Civil Federal</li>
          <li>Ley Federal de Protección al Consumidor</li>
          <li>LFPDPPP</li>
        </ul>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-700">
            <strong>Jurisdicción:</strong> Para cualquier controversia, las
            partes se someten a los tribunales de{' '}
            <strong>Puerto Vallarta, Jalisco, México</strong>.
          </p>
        </div>

        <div className="mt-4 bg-teal-50 p-4 rounded-lg border border-teal-200">
          <p className="text-sm text-gray-700">
            <strong>PROFECO:</strong> Como consumidor, puede presentar quejas
            ante la Procuraduría Federal del Consumidor:{' '}
            <a
              href="https://www.gob.mx/profeco"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 underline"
            >
              www.gob.mx/profeco
            </a>{' '}
            | Tel: 55 5568 8722
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          13. Consentimiento
        </h2>
        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-lg border-2 border-teal-300">
          <p className="text-gray-800 font-medium">
            Al hacer clic en "Acepto" o al utilizar el Servicio, usted reconoce
            que ha leído, entendido y aceptado estos Términos y Condiciones en
            su totalidad.
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
