import LegalLayout from '@/components/legal/LegalLayout';

export const metadata = {
  title: 'Aviso de Privacidad | PotentiaMX',
  description:
    'Aviso de Privacidad de PotentiaMX conforme a la Ley Federal de Protección de Datos Personales en Posesión de Particulares (LFPDPPP)',
};

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      title="Aviso de Privacidad"
      lastUpdated="13 de Noviembre, 2025"
    >
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Identidad y Domicilio del Responsable
        </h2>
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
          <dl className="grid grid-cols-1 gap-4">
            <div>
              <dt className="font-semibold text-gray-700">Responsable:</dt>
              <dd className="text-gray-600">José Roberto Enciso Sánchez</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-700">Nombre Comercial:</dt>
              <dd className="text-gray-600">PotentiaMX</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-700">RFC:</dt>
              <dd className="text-gray-600">EISR870806JHA</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-700">Domicilio:</dt>
              <dd className="text-gray-600">
                Pimpinela 521, Col. Palmar del Progreso, Puerto Vallarta,
                Jalisco, México
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-700">Teléfono:</dt>
              <dd className="text-gray-600">+52 322 355 0795</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-700">
                Correo electrónico:
              </dt>
              <dd className="text-gray-600">legal@potentiamx.com</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-700">Sitio web:</dt>
              <dd>
                <a
                  href="https://potentiamx.com"
                  className="text-teal-600 hover:underline"
                >
                  https://potentiamx.com
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          1. Introducción
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          PotentiaMX (en adelante <strong>"nosotros"</strong>,{' '}
          <strong>"nuestro"</strong> o <strong>"la Plataforma"</strong>) se
          compromete a proteger la privacidad y los datos personales de sus
          usuarios (en adelante <strong>"usted"</strong> o{' '}
          <strong>"el Usuario"</strong>).
        </p>
        <p className="text-gray-700 leading-relaxed">
          Este Aviso de Privacidad describe cómo recopilamos, usamos,
          almacenamos, compartimos y protegemos su información personal de
          conformidad con la{' '}
          <strong>
            Ley Federal de Protección de Datos Personales en Posesión de
            Particulares (LFPDPPP)
          </strong>{' '}
          y su Reglamento.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          2. Datos Personales que Recopilamos
        </h2>

        <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
          2.1 Datos de Identificación y Contacto
        </h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
          <li>Nombre completo</li>
          <li>Correo electrónico</li>
          <li>Número de teléfono</li>
          <li>Contraseña (encriptada y protegida mediante hash)</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
          2.2 Datos de Propiedades Inmobiliarias
        </h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
          <li>Título y descripción de propiedades</li>
          <li>Ubicación de terrenos, casas o departamentos</li>
          <li>Fotografías panorámicas 360°</li>
          <li>Imágenes convencionales</li>
          <li>Información de precios y características</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
          2.3 Datos de Navegación y Uso
        </h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
          <li>Dirección IP</li>
          <li>Tipo de dispositivo (móvil, desktop, tablet)</li>
          <li>Navegador web utilizado</li>
          <li>Páginas visitadas y duración</li>
          <li>
            Interacciones con tours virtuales (hotspots clickeados, tiempo de
            visualización)
          </li>
          <li>Cookies y tecnologías similares (ver Política de Cookies)</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
          2.4 Datos de Facturación y Pago
        </h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
          <li>Nombre para facturación</li>
          <li>RFC (Registro Federal de Contribuyentes)</li>
          <li>Domicilio fiscal</li>
          <li>
            Datos de tarjeta de crédito/débito (procesados por OpenPay/Stripe de
            forma segura)
          </li>
        </ul>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <p className="text-sm text-yellow-800">
            <strong>IMPORTANTE:</strong> No almacenamos datos completos de
            tarjetas de crédito en nuestros servidores. Los datos de pago son
            procesados de forma segura por procesadores certificados PCI-DSS.
          </p>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
          2.5 Datos de Leads (Visitantes de Tours)
        </h3>
        <p className="text-gray-700 mb-3">
          Cuando un visitante completa un formulario de contacto en un tour
          virtual, recopilamos:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Nombre</li>
          <li>Correo electrónico</li>
          <li>Teléfono</li>
          <li>Mensaje o consulta</li>
        </ul>
        <p className="text-gray-600 text-sm mt-2 italic">
          Estos datos son compartidos con el propietario del tour (agente
          inmobiliario o desarrollador).
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          3. Finalidades del Tratamiento de Datos
        </h2>

        <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
          3.1 Finalidades Primarias (Necesarias para el servicio)
        </h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span>
              <strong>Autenticación y acceso:</strong> Crear y gestionar su
              cuenta de usuario
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span>
              <strong>Prestación del servicio:</strong> Permitirle crear, editar
              y publicar tours virtuales 360°
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span>
              <strong>Procesamiento de pagos:</strong> Gestionar suscripciones y
              pagos de servicios
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span>
              <strong>Comunicación transaccional:</strong> Enviar notificaciones
              sobre su cuenta, cambios en el servicio, confirmaciones de pago
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span>
              <strong>Facturación:</strong> Emitir facturas fiscales (CFDIs)
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span>
              <strong>Soporte técnico:</strong> Responder consultas y resolver
              problemas técnicos
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span>
              <strong>Marketplace:</strong> Publicar propiedades en nuestro
              marketplace público (con su consentimiento)
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-green-600 mr-2">✓</span>
            <span>
              <strong>Captura de leads:</strong> Permitir que visitantes de sus
              tours le contacten
            </span>
          </li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
          3.2 Finalidades Secundarias (Requieren consentimiento)
        </h3>
        <ul className="space-y-2 text-gray-700 mb-4">
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">◯</span>
            <span>
              <strong>Analytics y mejora del servicio:</strong> Analizar el uso
              de la plataforma para mejorar funcionalidades
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">◯</span>
            <span>
              <strong>Marketing y comunicaciones comerciales:</strong> Enviar
              newsletters, ofertas, promociones y actualizaciones de productos
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">◯</span>
            <span>
              <strong>SEO y optimización:</strong> Sugerir palabras clave y
              mejoras para posicionar mejor sus propiedades
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">◯</span>
            <span>
              <strong>Casos de éxito:</strong> Usar capturas de pantalla de
              tours (anónimas o con su permiso) para marketing
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">◯</span>
            <span>
              <strong>Inteligencia artificial:</strong> Analizar datos de uso
              para mejorar recomendaciones y predicciones
            </span>
          </li>
        </ul>
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
          <p className="text-sm text-blue-800">
            Usted puede oponerse al tratamiento de sus datos para finalidades
            secundarias en cualquier momento contactándonos en:{' '}
            <a
              href="mailto:legal@potentiamx.com"
              className="underline font-medium"
            >
              legal@potentiamx.com
            </a>
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          4. Transferencias de Datos
        </h2>
        <p className="text-gray-700 mb-4">
          Sus datos personales pueden ser compartidos con las siguientes
          terceras partes:
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
          4.1 Proveedores de Servicios Esenciales
        </h3>
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                  Proveedor
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                  Servicio
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                  Ubicación
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                  Datos compartidos
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  Supabase Inc.
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  Backend, autenticación, almacenamiento
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  Estados Unidos
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  Email, contraseña (encriptada), datos de propiedades, imágenes
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  OpenPay / Stripe
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  Procesamiento de pagos
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  México / EE.UU.
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  Nombre, email, datos de facturación, datos de pago
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  Resend
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  Envío de correos electrónicos
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  Estados Unidos
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  Email, nombre
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  Netlify
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  Hosting y CDN
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  Estados Unidos
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  Datos de navegación, IP
                </td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  Google Analytics
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  Análisis de tráfico web
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  Estados Unidos
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  IP, navegador, comportamiento de navegación
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          5. Medidas de Seguridad
        </h2>
        <p className="text-gray-700 mb-4">
          Implementamos medidas de seguridad técnicas, físicas y administrativas
          para proteger sus datos:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
            <h4 className="font-semibold text-gray-900 mb-3">
              🔒 Seguridad Técnica
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Encriptación SSL/TLS (HTTPS)</li>
              <li>• Contraseñas hasheadas con bcrypt</li>
              <li>• Autenticación OAuth 2.0</li>
              <li>• Firewall de aplicaciones web (WAF)</li>
              <li>• Prevención de inyección SQL</li>
              <li>• Validación contra XSS</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-gray-900 mb-3">
              🛡️ Seguridad Operativa
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Acceso restringido a personal autorizado</li>
              <li>• Logs de auditoría</li>
              <li>• Respaldos automáticos diarios</li>
              <li>• Pruebas de seguridad periódicas</li>
            </ul>
          </div>
        </div>

        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-sm text-red-800">
            <strong>Importante:</strong> A pesar de nuestros esfuerzos, ningún
            sistema es 100% seguro. En caso de una brecha de seguridad que
            comprometa sus datos, le notificaremos dentro de las 72 horas
            siguientes conforme a la ley.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          6. Derechos ARCO (Acceso, Rectificación, Cancelación, Oposición)
        </h2>
        <p className="text-gray-700 mb-4">Usted tiene derecho a:</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-start space-x-3 p-4 bg-white border border-gray-200 rounded-lg">
            <span className="text-2xl">✓</span>
            <div>
              <h4 className="font-semibold text-gray-900">ACCESO</h4>
              <p className="text-sm text-gray-600">
                Conocer qué datos personales tenemos sobre usted y para qué los
                usamos
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-white border border-gray-200 rounded-lg">
            <span className="text-2xl">✏️</span>
            <div>
              <h4 className="font-semibold text-gray-900">RECTIFICACIÓN</h4>
              <p className="text-sm text-gray-600">
                Solicitar la corrección de datos inexactos o desactualizados
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-white border border-gray-200 rounded-lg">
            <span className="text-2xl">🗑️</span>
            <div>
              <h4 className="font-semibold text-gray-900">CANCELACIÓN</h4>
              <p className="text-sm text-gray-600">
                Solicitar la eliminación de sus datos de nuestras bases de datos
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-white border border-gray-200 rounded-lg">
            <span className="text-2xl">🚫</span>
            <div>
              <h4 className="font-semibold text-gray-900">OPOSICIÓN</h4>
              <p className="text-sm text-gray-600">
                Oponerse al tratamiento de sus datos para finalidades
                específicas
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">
          Cómo Ejercer sus Derechos ARCO
        </h3>
        <p className="text-gray-700 mb-3">
          Para ejercer sus derechos ARCO, envíe un correo electrónico a:{' '}
          <a
            href="mailto:legal@potentiamx.com"
            className="text-teal-600 font-medium underline"
          >
            legal@potentiamx.com
          </a>
        </p>

        <p className="text-gray-700 mb-3">Su solicitud debe incluir:</p>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-4">
          <li>Nombre completo</li>
          <li>Correo electrónico registrado en la plataforma</li>
          <li>Descripción clara del derecho que desea ejercer</li>
          <li>
            Documentos que acrediten su identidad (INE, pasaporte escaneado)
          </li>
          <li>Domicilio o medio para recibir respuesta</li>
        </ol>

        <div className="bg-teal-50 border-l-4 border-teal-400 p-4">
          <p className="text-sm text-teal-800">
            <strong>Tiempo de respuesta:</strong> Máximo 20 días hábiles a
            partir de la recepción de su solicitud.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          7. Retención y Eliminación de Datos
        </h2>

        <div className="space-y-4">
          <div className="border-l-4 border-gray-400 pl-4">
            <h4 className="font-semibold text-gray-900 mb-2">
              Cuentas Activas
            </h4>
            <p className="text-gray-700 text-sm">
              Mientras su cuenta esté activa, conservamos sus datos para prestar
              el servicio.
            </p>
          </div>

          <div className="border-l-4 border-orange-400 pl-4">
            <h4 className="font-semibold text-gray-900 mb-2">
              Cancelación de Cuenta
            </h4>
            <p className="text-gray-700 text-sm mb-2">Si cancela su cuenta:</p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Datos de usuario: Eliminados inmediatamente</li>
              <li>• Datos de propiedades: Archivados por 30 días</li>
              <li>
                • Datos de facturación: Conservados 5 años (obligación fiscal)
              </li>
              <li>• Logs de seguridad: Conservados 90 días</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          8. Cookies y Tecnologías de Rastreo
        </h2>
        <p className="text-gray-700 mb-4">
          Utilizamos cookies y tecnologías similares. Para más información,
          consulte nuestra{' '}
          <a
            href="/legal/cookies"
            className="text-teal-600 font-medium underline"
          >
            Política de Cookies
          </a>
          .
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          9. Menores de Edad
        </h2>
        <p className="text-gray-700 mb-4">
          Nuestros servicios están dirigidos a{' '}
          <strong>mayores de 18 años</strong>.
        </p>
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-sm text-red-800">
            <strong>
              No recopilamos intencionalmente datos de menores de edad.
            </strong>{' '}
            Si descubrimos que hemos recopilado datos de un menor sin
            consentimiento parental, eliminaremos esos datos de inmediato.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          10. Cambios a este Aviso de Privacidad
        </h2>
        <p className="text-gray-700 mb-4">
          Podemos actualizar este Aviso de Privacidad periódicamente. Le
          notificaremos mediante:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
          <li>Correo electrónico (para cambios sustanciales)</li>
          <li>Aviso en nuestro sitio web</li>
          <li>Notificación dentro de la plataforma</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          11. Legislación Aplicable
        </h2>
        <p className="text-gray-700 mb-4">
          Este Aviso de Privacidad se rige por las leyes de México:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>
            Ley Federal de Protección de Datos Personales en Posesión de
            Particulares (LFPDPPP)
          </li>
          <li>Reglamento de la LFPDPPP</li>
          <li>Código de Comercio</li>
          <li>Código Civil Federal</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          12. Autoridad de Protección de Datos
        </h2>
        <p className="text-gray-700 mb-4">
          Para más información sobre protección de datos personales, puede
          visitar el sitio del{' '}
          <strong>
            Instituto Nacional de Transparencia, Acceso a la Información y
            Protección de Datos Personales (INAI)
          </strong>
          :
        </p>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-gray-700 mb-2">
            🌐 Web:{' '}
            <a
              href="https://home.inai.org.mx/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 underline"
            >
              https://home.inai.org.mx/
            </a>
          </p>
          <p className="text-gray-700">📞 INFOTEL: 01 800 835 43 24</p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          13. Consentimiento
        </h2>
        <p className="text-gray-700">
          Al utilizar PotentiaMX, usted declara haber leído y aceptado este
          Aviso de Privacidad.
        </p>
        <p className="text-gray-700 mt-4">
          Si <strong>NO está de acuerdo</strong>, le solicitamos{' '}
          <strong>no utilizar nuestros servicios</strong>.
        </p>
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
