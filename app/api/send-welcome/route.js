import { NextResponse } from 'next/server';
import { sendWelcomeEmail } from '@/lib/resend';

/**
 * API Route para enviar email de bienvenida
 *
 * Llamar desde signup después de crear el usuario
 */
export async function POST(request) {
  try {
    const { email, name, plan = 'free' } = await request.json();

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email y nombre son requeridos' },
        { status: 400 },
      );
    }

    console.log(`📧 Enviando email de bienvenida a ${email} (Plan: ${plan})`);

    const result = await sendWelcomeEmail(email, name, plan);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Email de bienvenida enviado',
      });
    } else {
      console.error('Error enviando bienvenida:', result.error);
      return NextResponse.json(
        { error: 'Error al enviar email' },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('Error en API send-welcome:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}
