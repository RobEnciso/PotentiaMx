const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Leer variables de entorno de .env.local
const envFile = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkUserTerreno() {
  console.log('🔍 Revisando terrenos sin coordenadas...\n');

  // Obtener terrenos sin coordenadas
  const { data: terrenos, error } = await supabase
    .from('terrenos')
    .select('id, title, user_id, latitude, longitude, is_marketplace_listing, status')
    .is('latitude', null)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }

  if (terrenos.length === 0) {
    console.log('✅ Todos los terrenos tienen coordenadas');
    return;
  }

  console.log(`📊 Terrenos sin coordenadas: ${terrenos.length}\n`);

  for (const terreno of terrenos) {
    console.log(`📍 Terreno: ${terreno.title}`);
    console.log(`   ID del terreno: ${terreno.id}`);
    console.log(`   Marketplace: ${terreno.is_marketplace_listing ? 'Sí' : 'No'}`);
    console.log(`   Estado: ${terreno.status || 'No definido'}`);

    // Obtener información del usuario desde user_profiles
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('full_name, email')
      .eq('id', terreno.user_id)
      .single();

    if (profile) {
      console.log(`   👤 Usuario: ${profile.full_name || 'Sin nombre'}`);
      console.log(`   📧 Email: ${profile.email || 'No disponible'}`);
    } else {
      console.log(`   👤 Usuario ID: ${terreno.user_id}`);
    }

    console.log('');
  }

  console.log('\n💡 Para agregar coordenadas a un terreno, usa este comando SQL en Supabase:');
  console.log('\nUPDATE terrenos');
  console.log("SET latitude = 20.XXXXX, longitude = -105.XXXXX");
  console.log("WHERE id = 'ID_DEL_TERRENO';");
  console.log('\n📍 Puedes obtener las coordenadas en: https://www.google.com/maps');
  console.log('   (Click derecho en el mapa → primero es latitud, segundo es longitud)');
}

checkUserTerreno();
