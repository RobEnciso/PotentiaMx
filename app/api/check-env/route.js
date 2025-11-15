import { NextResponse } from 'next/server';

/**
 * Endpoint temporal para verificar variables de entorno
 * ELIMINAR después de verificar
 */
export async function GET() {
  const hasServiceRole = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  const hasPublicUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return NextResponse.json({
    environment: process.env.NODE_ENV,
    variables: {
      SUPABASE_SERVICE_ROLE_KEY: hasServiceRole ? 'CONFIGURED' : 'MISSING ⚠️',
      NEXT_PUBLIC_SUPABASE_URL: hasPublicUrl ? 'CONFIGURED' : 'MISSING ⚠️',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: hasAnonKey ? 'CONFIGURED' : 'MISSING ⚠️',
    },
    warning: hasServiceRole
      ? null
      : 'SUPABASE_SERVICE_ROLE_KEY is missing - demo tour creation will fail',
  });
}
