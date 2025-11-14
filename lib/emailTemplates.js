/**
 * Email Templates Profesionales - Estilo Bitso
 * Diseño centrado, minimalista, branding completo
 *
 * Inspiración: Bitso, Stripe, Linear
 */

// Colores de marca PotentiaMX
const COLORS = {
  primary: '#14b8a6', // Teal 500
  primaryDark: '#0f766e', // Teal 700
  secondary: '#0891b2', // Cyan 600
  accent: '#f59e0b', // Amber 500
  success: '#10b981', // Green 500
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    600: '#6b7280',
    700: '#374151',
    900: '#111827',
  },
};

/**
 * Firma HTML Profesional con Branding
 */
export function emailSignature({
  name = 'Equipo PotentiaMX',
  role = '',
  email = 'hola@potentiamx.com',
  phone = '',
  website = 'https://www.potentiamx.com',
}) {
  return `
    <table cellpadding="0" cellspacing="0" border="0" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; color: #374151; margin-top: 30px; border-top: 2px solid ${COLORS.gray[200]}; padding-top: 20px;">
      <tr>
        <td style="padding-right: 20px; vertical-align: top;">
          <!-- Logo -->
          <div style="width: 60px; height: 60px; background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
            <span style="color: white; font-weight: 700; font-size: 20px;">PM</span>
          </div>
        </td>
        <td style="vertical-align: top;">
          <strong style="display: block; color: ${COLORS.gray[900]}; font-size: 16px; margin-bottom: 4px;">${name}</strong>
          ${role ? `<span style="display: block; color: ${COLORS.gray[600]}; font-size: 13px; margin-bottom: 8px;">${role}</span>` : ''}

          <div style="margin-top: 10px;">
            <!-- Email -->
            <a href="mailto:${email}" style="display: inline-block; color: ${COLORS.primary}; text-decoration: none; margin-right: 15px; font-size: 13px;">
              📧 ${email}
            </a>
            ${phone ? `<a href="tel:${phone}" style="display: inline-block; color: ${COLORS.primary}; text-decoration: none; margin-right: 15px; font-size: 13px;">📞 ${phone}</a>` : ''}
          </div>

          <!-- Logo Text + Website -->
          <div style="margin-top: 12px;">
            <span style="font-weight: 700; color: ${COLORS.gray[900]}; font-size: 14px;">Potentia</span><span style="font-weight: 300; color: ${COLORS.gray[900]}; font-size: 14px;">MX</span>
            <span style="color: ${COLORS.gray[400]}; margin: 0 8px;">|</span>
            <a href="${website}" style="color: ${COLORS.gray[600]}; text-decoration: none; font-size: 13px;">www.potentiamx.com</a>
          </div>

          <!-- Tagline -->
          <p style="margin: 8px 0 0 0; color: ${COLORS.gray[600]}; font-size: 12px; font-style: italic;">
            Tours 360° que venden más rápido
          </p>
        </td>
      </tr>
    </table>
  `;
}

/**
 * Template Base Moderno - Estilo Bitso
 * Diseño centrado, minimalista, responsive
 */
export function emailTemplate({
  preheader = '',
  title = '',
  content = '',
  footerText = '',
  showSignature = true,
  signatureData = {},
}) {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  ${preheader ? `<meta name="description" content="${preheader}">` : ''}
  <title>${title || 'PotentiaMX'}</title>
  <!--[if mso]>
  <style type="text/css">
    table {border-collapse:collapse;border-spacing:0;margin:0;}
    div, td {padding:0;}
    div {margin:0 !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: ${COLORS.gray[50]}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">

  <!-- Preheader (hidden text) -->
  ${
    preheader
      ? `<div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">${preheader}</div>`
      : ''
  }

  <!-- Spacer -->
  <div style="height: 40px;"></div>

  <!-- Main Container -->
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: ${COLORS.gray[50]};">
    <tr>
      <td align="center" style="padding: 0 20px;">

        <!-- Email Card (max-width 600px, centrado) -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">

          <!-- Header con gradiente -->
          <tr>
            <td style="background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%); padding: 40px 40px 30px 40px; text-align: center;">
              <!-- Logo -->
              <div style="margin-bottom: 16px;">
                <span style="color: white; font-weight: 700; font-size: 32px; letter-spacing: -0.5px;">Potentia</span><span style="color: white; font-weight: 300; font-size: 32px;">MX</span>
              </div>
              ${title ? `<p style="color: rgba(255,255,255,0.95); margin: 0; font-size: 16px; font-weight: 500;">${title}</p>` : ''}
            </td>
          </tr>

          <!-- Content Area -->
          <tr>
            <td style="padding: 40px; color: ${COLORS.gray[700]}; font-size: 15px; line-height: 1.6;">
              ${content}
            </td>
          </tr>

          ${
            showSignature
              ? `
          <!-- Signature -->
          <tr>
            <td style="padding: 0 40px 40px 40px;">
              ${emailSignature(signatureData)}
            </td>
          </tr>
          `
              : ''
          }

          <!-- Footer -->
          <tr>
            <td style="background-color: ${COLORS.gray[50]}; padding: 30px 40px; text-align: center; border-top: 1px solid ${COLORS.gray[200]};">
              ${footerText || '<p style="margin: 0 0 10px 0; color: ' + COLORS.gray[600] + '; font-size: 13px;">¿Necesitas ayuda? <a href="mailto:hola@potentiamx.com" style="color: ' + COLORS.primary + '; text-decoration: none;">Contáctanos</a></p>'}

              <!-- Social Links (opcional) -->
              <div style="margin: 15px 0;">
                <a href="https://www.potentiamx.com" style="color: ${COLORS.gray[600]}; text-decoration: none; margin: 0 8px; font-size: 13px;">Sitio Web</a>
                <span style="color: ${COLORS.gray[300]};">•</span>
                <a href="https://www.potentiamx.com/propiedades" style="color: ${COLORS.gray[600]}; text-decoration: none; margin: 0 8px; font-size: 13px;">Marketplace</a>
                <span style="color: ${COLORS.gray[300]};">•</span>
                <a href="https://www.potentiamx.com/contacto" style="color: ${COLORS.gray[600]}; text-decoration: none; margin: 0 8px; font-size: 13px;">Contacto</a>
              </div>

              <!-- Copyright -->
              <p style="margin: 15px 0 0 0; color: ${COLORS.gray[400]}; font-size: 12px;">
                © ${new Date().getFullYear()} PotentiaMX. Todos los derechos reservados.
              </p>

              <!-- Unsubscribe (opcional) -->
              <p style="margin: 10px 0 0 0; color: ${COLORS.gray[400]}; font-size: 11px;">
                <a href="{{{unsubscribe}}}" style="color: ${COLORS.gray[400]}; text-decoration: underline;">Cancelar suscripción</a>
              </p>
            </td>
          </tr>

        </table>
        <!-- End Email Card -->

      </td>
    </tr>
  </table>

  <!-- Spacer -->
  <div style="height: 40px;"></div>

</body>
</html>
  `;
}

/**
 * Componentes Reutilizables
 */

// Botón CTA Principal
export function ctaButton({
  text,
  url,
  color = COLORS.primary,
  fullWidth = false,
}) {
  return `
    <table cellpadding="0" cellspacing="0" border="0" ${fullWidth ? 'width="100%"' : ''} style="margin: 25px 0;">
      <tr>
        <td align="center">
          <a href="${url}" style="display: inline-block; background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); transition: all 0.2s;">
            ${text}
          </a>
        </td>
      </tr>
    </table>
  `;
}

// Botón Secundario
export function secondaryButton({ text, url }) {
  return `
    <table cellpadding="0" cellspacing="0" border="0" style="margin: 15px 0;">
      <tr>
        <td align="center">
          <a href="${url}" style="display: inline-block; background: #ffffff; color: ${COLORS.primary}; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: 500; font-size: 15px; border: 2px solid ${COLORS.primary};">
            ${text}
          </a>
        </td>
      </tr>
    </table>
  `;
}

// Info Box (destacar información)
export function infoBox({
  title = '',
  content,
  type = 'info', // info, success, warning, error
}) {
  const typeColors = {
    info: {
      bg: '#f0fdfa',
      border: COLORS.primary,
      text: COLORS.primaryDark,
    },
    success: {
      bg: '#f0fdf4',
      border: COLORS.success,
      text: '#065f46',
    },
    warning: {
      bg: '#fef3c7',
      border: COLORS.accent,
      text: '#92400e',
    },
    error: {
      bg: '#fef2f2',
      border: '#ef4444',
      text: '#991b1b',
    },
  };

  const colors = typeColors[type] || typeColors.info;

  return `
    <div style="background: ${colors.bg}; border-left: 4px solid ${colors.border}; padding: 20px; margin: 25px 0; border-radius: 8px;">
      ${title ? `<h3 style="margin: 0 0 10px 0; color: ${colors.text}; font-size: 16px; font-weight: 600;">${title}</h3>` : ''}
      <div style="color: ${colors.text}; font-size: 14px; line-height: 1.5;">
        ${content}
      </div>
    </div>
  `;
}

// Tabla de datos (para mostrar información estructurada)
export function dataTable(rows) {
  return `
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 25px 0; border-collapse: collapse;">
      ${rows
        .map(
          ({ label, value }) => `
        <tr>
          <td style="padding: 12px 0; border-bottom: 1px solid ${COLORS.gray[200]}; color: ${COLORS.gray[600]}; font-size: 14px;">
            <strong>${label}</strong>
          </td>
          <td style="padding: 12px 0; border-bottom: 1px solid ${COLORS.gray[200]}; text-align: right; color: ${COLORS.gray[900]}; font-size: 14px;">
            ${value}
          </td>
        </tr>
      `,
        )
        .join('')}
    </table>
  `;
}

// Stats Card (para métricas)
export function statsCard({ value, label, icon = '' }) {
  return `
    <div style="background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%); padding: 25px; border-radius: 12px; text-align: center; margin: 15px 0;">
      ${icon ? `<div style="font-size: 32px; margin-bottom: 10px;">${icon}</div>` : ''}
      <div style="color: #ffffff; font-size: 36px; font-weight: 700; line-height: 1; margin-bottom: 8px;">${value}</div>
      <div style="color: rgba(255,255,255,0.9); font-size: 14px; font-weight: 500;">${label}</div>
    </div>
  `;
}

// Divider
export function divider() {
  return `<div style="height: 1px; background: ${COLORS.gray[200]}; margin: 30px 0;"></div>`;
}

export { COLORS };
