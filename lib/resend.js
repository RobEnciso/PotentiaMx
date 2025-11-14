import { Resend } from 'resend';
import {
  emailTemplate,
  emailSignature,
  ctaButton,
  infoBox,
  dataTable,
  statsCard,
  COLORS,
} from './emailTemplates.js';

// Función para obtener cliente Resend (lazy initialization)
function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

/**
 * Email de origen configurado
 * Usa hola@potentiamx.com (tu email de Google Workspace)
 */
const FROM_EMAIL = 'Potentia MX <hola@potentiamx.com>';
const NOREPLY_EMAIL = 'Potentia MX <noreply@potentiamx.com>';
const SUPPORT_EMAIL = 'hola@potentiamx.com';

/**
 * Wrapper para enviar emails con manejo de errores
 */
export async function sendEmail({
  to,
  subject,
  html,
  from = FROM_EMAIL,
  replyTo,
}) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('⚠️ RESEND_API_KEY no configurada');
      return { success: false, error: 'API key not configured' };
    }

    const resend = getResend();
    const { data, error } = await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      replyTo: replyTo || SUPPORT_EMAIL,
    });

    if (error) {
      console.error('❌ Error enviando email:', error);
      return { success: false, error };
    }

    console.log('✅ Email enviado:', data.id);
    return { success: true, data };
  } catch (exception) {
    console.error('❌ Excepción enviando email:', exception);
    return { success: false, error: exception.message };
  }
}

/**
 * Templates de email - Usando diseño profesional estilo Bitso
 * Importados desde emailTemplates.js
 */

/**
 * Email de Bienvenida según Plan
 */
export async function sendWelcomeEmail(userEmail, userName, plan = 'free') {
  const planInfo = {
    free: {
      name: 'FREE',
      features: [
        '2 tours activos',
        'Editor completo',
        'Marketplace (1 propiedad)',
      ],
      nextSteps: [
        'Crea tu primer tour 360° en 5 minutos',
        'Publica en el marketplace gratis',
        'Explora las funcionalidades',
      ],
      cta: 'Ir al Dashboard',
      ctaUrl: 'https://potentiamx.com/dashboard',
    },
    starter: {
      name: 'STARTER',
      features: [
        '10 tours activos',
        '1 sesión de captura cada 3 meses',
        'Sin marca de agua',
        'Captura de leads',
      ],
      nextSteps: [
        'Programa tu primera sesión de captura',
        'Configura tu formulario de leads',
        'Publica propiedades en marketplace',
      ],
      cta: 'Programar Sesión',
      ctaUrl: 'https://potentiamx.com/dashboard',
    },
    pro: {
      name: 'PRO',
      features: [
        '30 tours activos',
        '1 sesión de captura mensual',
        'Analytics con sugerencias IA',
        'Branding personalizado',
      ],
      nextSteps: [
        'Configura tu logo y colores de marca',
        'Programa sesión de captura aérea',
        'Activa analytics avanzados',
      ],
      cta: 'Configurar Branding',
      ctaUrl: 'https://potentiamx.com/dashboard/branding',
    },
    business: {
      name: 'BUSINESS',
      features: [
        'Tours ilimitados',
        '2 sesiones de captura mensuales',
        'White-label completo',
        'Soporte dedicado',
      ],
      nextSteps: [
        'Agenda call con tu account manager',
        'Configura tu dominio personalizado',
        'Setup de integración CRM',
      ],
      cta: 'Agendar Call',
      ctaUrl: 'https://potentiamx.com/contacto',
    },
  };

  const info = planInfo[plan] || planInfo.free;

  const content = `
    <h2 style="color: ${COLORS.primaryDark}; margin-top: 0; font-size: 24px;">¡Hola ${userName}! 👋</h2>

    <p style="font-size: 16px; color: ${COLORS.gray[700]}; line-height: 1.6;">
      Estamos emocionados de tenerte en el plan <strong>${info.name}</strong>. Tu plataforma ya está lista para crear tours virtuales 360° que venden más rápido.
    </p>

    ${infoBox({
      title: '✨ Incluido en tu plan',
      content: `
        <ul style="margin: 0; padding-left: 20px;">
          ${info.features.map((feature) => `<li style="margin: 8px 0;">${feature}</li>`).join('')}
        </ul>
      `,
      type: 'info',
    })}

    <h3 style="color: ${COLORS.primaryDark}; margin: 30px 0 15px 0; font-size: 18px;">🚀 Próximos Pasos</h3>
    <ol style="color: ${COLORS.gray[700]}; padding-left: 20px; line-height: 1.8;">
      ${info.nextSteps.map((step) => `<li style="margin: 10px 0;">${step}</li>`).join('')}
    </ol>

    ${
      plan !== 'free'
        ? infoBox({
            title: '💡 Tip Especial',
            content:
              'Programa tu primera sesión de captura dentro de las primeras 48h y te daremos un <strong>descuento adicional del 10%</strong>.',
            type: 'warning',
          })
        : ''
    }

    ${ctaButton({
      text: info.cta,
      url: info.ctaUrl,
      fullWidth: false,
    })}

    ${
      plan === 'free'
        ? `
    <div style="background: linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%); padding: 20px; border-radius: 12px; text-align: center; margin: 30px 0;">
      <p style="color: white; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">🎯 ¿Sabías que con nuestro servicio ahorras hasta 78% vs competencia?</p>
      <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 14px;">Matterport + fotógrafo independiente: ~$8,500 MXN | PotentiaMX: $2,500 MXN</p>
      <div style="margin-top: 15px;">
        <a href="https://potentiamx.com/calculadora" style="display: inline-block; background: white; color: ${COLORS.primary}; padding: 10px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">Calcular mi Ahorro</a>
      </div>
    </div>
    `
        : ''
    }

    <p style="text-align: center; color: ${COLORS.gray[600]}; font-size: 14px; margin-top: 30px;">
      ¿Tienes preguntas? Responde a este email y te ayudamos en menos de 2 horas.
    </p>
  `;

  return sendEmail({
    to: userEmail,
    subject: `¡Bienvenido a PotentiaMX ${info.name}! 🎉`,
    html: emailTemplate({
      preheader: `Tu cuenta ${info.name} está lista. Crea tu primer tour 360° en 5 minutos.`,
      title: '¡Bienvenido!',
      content,
      showSignature: true,
      signatureData: {
        name: 'Equipo PotentiaMX',
        role: 'Onboarding & Soporte',
        email: 'hola@potentiamx.com',
        phone: '+52 1 55 1234 5678',
      },
    }),
  });
}

/**
 * Email de Notificación de Lead
 */
export async function sendLeadNotification({
  to,
  leadName,
  leadEmail,
  leadPhone,
  leadMessage,
  terrenoTitle,
  terrenoId,
}) {
  const leadData = [
    { label: 'Nombre', value: `<strong>${leadName}</strong>` },
    {
      label: 'Email',
      value: `<a href="mailto:${leadEmail}" style="color: ${COLORS.primary}; text-decoration: none; font-weight: 500;">${leadEmail}</a>`,
    },
  ];

  if (leadPhone) {
    leadData.push({
      label: 'Teléfono',
      value: `<a href="tel:${leadPhone}" style="color: ${COLORS.primary}; text-decoration: none; font-weight: 500;">${leadPhone}</a>`,
    });
  }

  const content = `
    <p style="font-size: 16px; color: ${COLORS.gray[700]}; margin-bottom: 20px; line-height: 1.6;">
      ¡Excelente noticia! Has recibido una nueva solicitud de información.
    </p>

    ${statsCard({
      value: '🏡',
      label: terrenoTitle,
    })}

    <h3 style="color: ${COLORS.primaryDark}; margin: 30px 0 15px 0; font-size: 18px; border-bottom: 2px solid ${COLORS.gray[200]}; padding-bottom: 10px;">
      📋 Información del Prospecto
    </h3>

    ${dataTable(leadData)}

    ${
      leadMessage
        ? `
    <h3 style="color: ${COLORS.primaryDark}; margin: 30px 0 15px 0; font-size: 18px; border-bottom: 2px solid ${COLORS.gray[200]}; padding-bottom: 10px;">
      💬 Mensaje
    </h3>
    <div style="background: ${COLORS.gray[50]}; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 3px solid ${COLORS.primary};">
      <p style="margin: 0; color: ${COLORS.gray[700]}; white-space: pre-wrap; line-height: 1.6;">${leadMessage}</p>
    </div>
    `
        : ''
    }

    ${infoBox({
      title: '⏰ Responde Rápido',
      content:
        'Los prospectos que reciben respuesta en las <strong>primeras 5 minutos</strong> tienen <strong>21x más probabilidad</strong> de convertir. ¡Actúa ahora!',
      type: 'warning',
    })}

    ${ctaButton({
      text: `📧 Responder a ${leadName.split(' ')[0]}`,
      url: `mailto:${leadEmail}?subject=Re: ${encodeURIComponent(terrenoTitle)}`,
      fullWidth: false,
    })}

    <div style="text-align: center; margin: 25px 0;">
      <a href="https://potentiamx.com/terreno/${terrenoId}" style="color: ${COLORS.gray[600]}; text-decoration: none; font-size: 14px;">
        Ver tour completo →
      </a>
    </div>
  `;

  return sendEmail({
    to,
    subject: `🏡 Nuevo Lead: ${terrenoTitle}`,
    html: emailTemplate({
      preheader: `Nueva solicitud de ${leadName} para ${terrenoTitle}`,
      title: 'Nueva Solicitud de Información',
      content,
      showSignature: true,
      signatureData: {
        name: 'Sistema PotentiaMX',
        role: 'Notificaciones de Leads',
        email: 'marketplace@potentiamx.com',
      },
    }),
    replyTo: leadEmail,
  });
}

/**
 * Email Semanal de Analytics
 */
export async function sendWeeklyAnalytics({ to, userName, stats }) {
  const analyticsData = [
    {
      label: 'Duración promedio',
      value: `${stats.avgDuration || '0'} segundos`,
    },
    {
      label: 'Tasa de conversión',
      value: `<strong>${stats.conversionRate || '0'}%</strong>`,
    },
    {
      label: 'Tour más visitado',
      value:
        stats.topTour ||
        '<em style="color: ' + COLORS.gray[400] + ';">N/A</em>',
    },
  ];

  const content = `
    <h2 style="color: ${COLORS.primaryDark}; margin-top: 0; font-size: 24px;">Hola ${userName} 👋</h2>

    <p style="font-size: 16px; color: ${COLORS.gray[700]}; margin-bottom: 25px; line-height: 1.6;">
      Aquí está tu <strong>resumen semanal</strong> de rendimiento. Sigue así!
    </p>

    <!-- Stats Cards en Grid -->
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 25px 0;">
      <tr>
        <td width="48%" style="vertical-align: top;">
          ${statsCard({
            value: stats.totalVisits || 0,
            label: 'Visitas Totales',
            icon: '👁️',
          })}
        </td>
        <td width="4%"></td>
        <td width="48%" style="vertical-align: top;">
          ${statsCard({
            value: stats.totalLeads || 0,
            label: 'Leads Generados',
            icon: '🎯',
          })}
        </td>
      </tr>
    </table>

    <h3 style="color: ${COLORS.primaryDark}; margin: 30px 0 15px 0; font-size: 18px; border-bottom: 2px solid ${COLORS.gray[200]}; padding-bottom: 10px;">
      📊 Detalles de Rendimiento
    </h3>

    ${dataTable(analyticsData)}

    ${
      stats.suggestions && stats.suggestions.length > 0
        ? infoBox({
            title: '💡 Sugerencias para Mejorar',
            content: `
          <ul style="margin: 0; padding-left: 20px;">
            ${stats.suggestions.map((s) => `<li style="margin: 8px 0;">${s}</li>`).join('')}
          </ul>
        `,
            type: 'warning',
          })
        : ''
    }

    ${
      (stats.conversionRate || 0) < 2
        ? infoBox({
            title: '🚀 Tip para Aumentar Conversión',
            content:
              'Agrega un <strong>formulario de contacto visible</strong> en tus tours y menciona una promoción especial. Esto puede aumentar tu tasa de conversión hasta <strong>3x</strong>.',
            type: 'info',
          })
        : ''
    }

    ${ctaButton({
      text: '📊 Ver Dashboard Completo',
      url: 'https://potentiamx.com/dashboard/analytics',
      fullWidth: false,
    })}

    <p style="text-align: center; color: ${COLORS.gray[600]}; font-size: 14px; margin-top: 25px;">
      Estos reportes se envían cada semana. ¿Quieres cambiar la frecuencia?<br/>
      <a href="https://potentiamx.com/dashboard/configuracion" style="color: ${COLORS.primary}; text-decoration: none;">Configurar preferencias</a>
    </p>
  `;

  return sendEmail({
    to,
    subject: `📊 Tu Resumen Semanal - PotentiaMX`,
    html: emailTemplate({
      preheader: `${stats.totalVisits || 0} visitas, ${stats.totalLeads || 0} leads esta semana`,
      title: 'Resumen Semanal',
      content,
      showSignature: true,
      signatureData: {
        name: 'Equipo Analytics',
        role: 'PotentiaMX',
        email: 'analytics@potentiamx.com',
      },
    }),
  });
}

export { getResend, FROM_EMAIL, NOREPLY_EMAIL, SUPPORT_EMAIL };
