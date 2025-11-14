import { NextResponse } from 'next/server';
import { sendLeadNotification } from '@/lib/resend';
import { createClient } from '@supabase/supabase-js';

// Inicializar Supabase con service role para bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

/**
 * API Route para manejar solicitudes de contacto desde el formulario
 *
 * Funcionalidad:
 * 1. Valida los datos del formulario
 * 2. Guarda el lead en la base de datos
 * 3. Envía email de notificación al vendedor
 */
export async function POST(request) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      phone,
      message,
      terrenoTitle,
      terrenoId,
      contactEmail,
      timestamp,
    } = body;

    // Validación básica
    if (!name || !email || !terrenoId || !contactEmail) {
      return NextResponse.json(
        { error: 'Nombre, email, terreno y email de contacto son requeridos' },
        { status: 400 },
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || !emailRegex.test(contactEmail)) {
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400 },
      );
    }

    console.log('📧 Procesando nueva solicitud de contacto:', {
      lead: { name, email, phone },
      terreno: { id: terrenoId, title: terrenoTitle },
      destino: contactEmail,
    });

    // 1️⃣ Guardar lead en base de datos
    const { data: leadData, error: leadError } = await supabaseAdmin
      .from('leads')
      .insert([
        {
          name,
          email,
          phone: phone || null,
          message: message || null,
          terreno_id: terrenoId,
          terreno_title: terrenoTitle,
          contact_email: contactEmail,
          source: 'contact_form',
          status: 'new',
        },
      ])
      .select()
      .single();

    if (leadError) {
      console.error('❌ Error al guardar lead en BD:', leadError);
      // Continuar con envío de email aunque falle la BD
    } else {
      console.log('✅ Lead guardado en BD:', leadData.id);
    }

    // 2️⃣ Enviar email de notificación al vendedor/agente
    if (process.env.RESEND_API_KEY) {
      try {
        const result = await sendLeadNotification({
          to: contactEmail,
          leadName: name,
          leadEmail: email,
          leadPhone: phone,
          leadMessage: message,
          terrenoTitle,
          terrenoId,
        });

        if (result.success) {
          console.log('✅ Email enviado exitosamente');
        } else {
          console.error('❌ Error al enviar email:', result.error);
        }

        /* CÓDIGO ANTERIOR - AHORA ESTÁ EN lib/resend.js
        const { data: emailData, error: emailError } = await resend.emails.send({
            from: 'Potentia MX <hola@potentiamx.com>',
            to: contactEmail,
            replyTo: email,
            subject: `🏡 Nueva solicitud: ${terrenoTitle}`,
            html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">

              <!-- Header -->
              <div style="background: linear-gradient(135deg, #14b8a6 0%, #0891b2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">Potentia<span style="font-weight: 300;">MX</span></h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Nueva Solicitud de Información</p>
              </div>

              <!-- Content -->
              <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">

                <p style="font-size: 16px; margin-bottom: 20px;">Has recibido una nueva solicitud de información para:</p>

                <div style="background: #f0fdfa; border-left: 4px solid #14b8a6; padding: 15px; margin-bottom: 25px; border-radius: 4px;">
                  <h2 style="margin: 0 0 5px 0; color: #0f766e; font-size: 20px;">🏡 ${terrenoTitle}</h2>
                </div>

                <h3 style="color: #0891b2; margin: 25px 0 15px 0; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
                  📋 Información del Prospecto
                </h3>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;"><strong>Nombre:</strong></td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; text-align: right;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;"><strong>Email:</strong></td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; text-align: right;"><a href="mailto:${email}" style="color: #0891b2; text-decoration: none;">${email}</a></td>
                  </tr>
                  ${
                    phone
                      ? `
                  <tr>
                    <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;"><strong>Teléfono:</strong></td>
                    <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; text-align: right;"><a href="tel:${phone}" style="color: #0891b2; text-decoration: none;">${phone}</a></td>
                  </tr>
                  `
                      : ''
                  }
                </table>

                ${
                  message
                    ? `
                <h3 style="color: #0891b2; margin: 25px 0 15px 0; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
                  💬 Mensaje
                </h3>
                <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 25px; border-left: 3px solid #14b8a6;">
                  <p style="margin: 0; color: #374151; white-space: pre-wrap;">${message}</p>
                </div>
                `
                    : ''
                }

                <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 25px 0; border-radius: 4px;">
                  <p style="margin: 0; color: #92400e; font-size: 14px;">
                    <strong>⏰ Tip:</strong> Los prospectos que reciben respuesta en las primeras 5 minutos tienen 21x más probabilidad de convertir. ¡Responde pronto!
                  </p>
                </div>

                <!-- CTA Button -->
                <div style="text-align: center; margin: 30px 0;">
                  <a href="mailto:${email}?subject=Re: ${encodeURIComponent(terrenoTitle)}" style="display: inline-block; background: linear-gradient(135deg, #14b8a6 0%, #0891b2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    📧 Responder a ${name.split(' ')[0]}
                  </a>
                </div>

              </div>

              <!-- Footer -->
              <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px; text-align: center;">
                <p style="margin: 0; color: #6b7280; font-size: 12px;">
                  Recibido el ${new Date(timestamp).toLocaleString('es-MX', { dateStyle: 'long', timeStyle: 'short' })}
                </p>
                <p style="margin: 10px 0 0 0; color: #9ca3af; font-size: 11px;">
                  Este email fue generado automáticamente por <strong>Potentia MX</strong>
                </p>
              </div>

            </body>
            </html>
          `,
        });
        */ // FIN CÓDIGO MOVIDO
      } catch (emailException) {
        console.error('❌ Excepción al enviar email:', emailException);
        // No fallar la request si el email falla
      }
    } else {
      console.warn('⚠️ RESEND_API_KEY no configurada. Email no enviado.');
    }

    return NextResponse.json({
      success: true,
      message: 'Solicitud enviada correctamente',
      leadId: leadData?.id,
    });
  } catch (error) {
    console.error('❌ Error en API de contacto:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}
