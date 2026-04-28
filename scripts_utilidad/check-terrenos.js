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

async function checkTerrenos() {
  console.log('🔍 Revisando terrenos en la base de datos...\n');

  // Primero ver TODOS los terrenos
  console.log('=== TODOS LOS TERRENOS ===\n');
  const { data: allData, error: allError } = await supabase
    .from('terrenos')
    .select('id, title, is_marketplace_listing, status, latitude, longitude, property_type')
    .order('created_at', { ascending: false });

  if (allError) {
    console.error('❌ Error:', allError.message);
    return;
  }

  console.log(`📊 Total de terrenos en la base de datos: ${allData.length}\n`);

  allData.forEach((terreno, index) => {
    const hasCoords = terreno.latitude && terreno.longitude;
    console.log(`${index + 1}. ${terreno.title}`);
    console.log(`   ID: ${terreno.id}`);
    console.log(`   Tipo: ${terreno.property_type || 'No definido'}`);
    console.log(`   Marketplace: ${terreno.is_marketplace_listing ? '✅' : '❌'}`);
    console.log(`   Estado: ${terreno.status || 'No definido'}`);
    console.log(`   Coordenadas: ${hasCoords ? '✅ SÍ' : '❌ NO'}`);
    if (hasCoords) {
      console.log(`   Lat: ${terreno.latitude}, Lng: ${terreno.longitude}`);
    }
    console.log('');
  });

  console.log('\n=== FILTRADOS PARA MARKETPLACE (activos) ===\n');

  const { data, error } = await supabase
    .from('terrenos')
    .select('id, title, is_marketplace_listing, status, latitude, longitude, property_type')
    .eq('is_marketplace_listing', true)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }

  console.log(`📊 Total de terrenos activos en marketplace: ${data.length}\n`);

  data.forEach((terreno, index) => {
    const hasCoords = terreno.latitude && terreno.longitude;
    console.log(`${index + 1}. ${terreno.title}`);
    console.log(`   ID: ${terreno.id}`);
    console.log(`   Tipo: ${terreno.property_type || 'No definido'}`);
    console.log(`   Coordenadas: ${hasCoords ? '✅ SÍ' : '❌ NO'}`);
    if (hasCoords) {
      console.log(`   Lat: ${terreno.latitude}, Lng: ${terreno.longitude}`);
    }
    console.log('');
  });

  const conCoordenadas = data.filter(t => t.latitude && t.longitude);
  const sinCoordenadas = data.filter(t => !t.latitude || !t.longitude);

  console.log(`\n📍 Resumen:`);
  console.log(`   Con coordenadas: ${conCoordenadas.length}`);
  console.log(`   Sin coordenadas: ${sinCoordenadas.length}`);
}

checkTerrenos();
