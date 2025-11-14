// lib/supabaseClient.js
import { createBrowserClient } from '@supabase/ssr';

// ✅ SEGURIDAD: Usar variables de entorno en lugar de credenciales hardcodeadas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validar que las variables de entorno estén configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '❌ Variables de entorno de Supabase no configuradas. ' +
      'Por favor, verifica que NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY ' +
      'estén definidas en tu archivo .env.local',
  );
}

export const createClient = () =>
  createBrowserClient(supabaseUrl, supabaseAnonKey);
