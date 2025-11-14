import { NextResponse } from 'next/server';
import { createPersonalDemoTour } from '@/lib/createDemoTour';

/**
 * API Route para crear tour demo personal para usuarios nuevos
 * Estilo Pixieset: Contenido precargado que el usuario puede editar
 */
export async function POST(request) {
  try {
    const { userId, userEmail, userName } = await request.json();

    // Validación
    if (!userId || !userEmail) {
      return NextResponse.json(
        { error: 'userId y userEmail son requeridos' },
        { status: 400 },
      );
    }

    console.log(`🎨 Creando tour demo para usuario: ${userEmail}`);

    // Crear tour demo personal
    const result = await createPersonalDemoTour(userId, userEmail, userName);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Tour demo personal creado',
        tourId: result.tourId,
      });
    } else {
      console.error('Error creando tour demo:', result.error);
      return NextResponse.json(
        { error: result.error || 'Error creando tour demo' },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('Error en API create-demo-tour:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    );
  }
}
