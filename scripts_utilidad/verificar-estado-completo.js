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

async function verificarEstadoCompleto() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🔍 VERIFICACIÓN COMPLETA DEL SISTEMA');
  console.log('═══════════════════════════════════════════════════════\n');

  // 1. Ver todos los terrenos
  console.log('📍 1. TODOS LOS TERRENOS EN LA BASE DE DATOS\n');
  const { data: allTerrenos, error: terrenosError } = await supabase
    .from('terrenos')
    .select('*')
    .order('created_at', { ascending: false });

  if (terrenosError) {
    console.error('❌ Error:', terrenosError.message);
    return;
  }

  console.log(`Total de terrenos: ${allTerrenos.length}\n`);

  for (const terreno of allTerrenos) {
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📌 ${terreno.title}`);
    console.log(`   ID: ${terreno.id}`);
    console.log(`   Usuario ID: ${terreno.user_id}`);
    console.log(`   Tipo: ${terreno.property_type || 'No definido'}`);
    console.log(`   Marketplace: ${terreno.is_marketplace_listing ? '✅ SÍ' : '❌ NO'}`);
    console.log(`   Estado: ${terreno.status || 'No definido'}`);
    console.log(`   Coordenadas: ${terreno.latitude && terreno.longitude ? '✅ SÍ' : '❌ NO'}`);
    if (terreno.latitude && terreno.longitude) {
      console.log(`   Lat/Lng: ${terreno.latitude}, ${terreno.longitude}`);
    }
    console.log(`   Imágenes: ${terreno.image_urls?.length || 0} panoramas`);
    console.log(`   Precio: $${terreno.sale_price?.toLocaleString('es-MX') || '0'}`);
    console.log(`   Creado: ${new Date(terreno.created_at).toLocaleString('es-MX')}`);

    // Obtener info del usuario
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('full_name, email')
      .eq('id', terreno.user_id)
      .single();

    if (profile) {
      console.log(`   👤 Usuario: ${profile.full_name || 'Sin nombre'} (${profile.email})`);
    } else {
      console.log(`   ⚠️ Usuario NO ENCONTRADO (posiblemente eliminado)`);
    }
    console.log('');
  }

  // 2. Ver usuarios activos
  console.log('\n👥 2. USUARIOS REGISTRADOS\n');
  const { data: profiles, error: profilesError } = await supabase
    .from('user_profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (profilesError) {
    console.error('❌ Error:', profilesError.message);
  } else {
    console.log(`Total de usuarios: ${profiles.length}\n`);

    for (const profile of profiles) {
      // Contar terrenos de este usuario
      const userTerrenos = allTerrenos.filter(t => t.user_id === profile.id);
      const terrenosMarketplace = userTerrenos.filter(t => t.is_marketplace_listing);
      const terrenosConCoords = userTerrenos.filter(t => t.latitude && t.longitude);

      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`👤 ${profile.full_name || 'Sin nombre'}`);
      console.log(`   Email: ${profile.email || 'No disponible'}`);
      console.log(`   Plan: ${profile.subscription_plan || 'No definido'}`);
      console.log(`   Terrenos totales: ${userTerrenos.length}`);
      console.log(`   En marketplace: ${terrenosMarketplace.length}`);
      console.log(`   Con coordenadas: ${terrenosConCoords.length}`);
      console.log('');
    }
  }

  // 3. Resumen de terrenos visibles en /propiedades
  console.log('\n🌐 3. TERRENOS VISIBLES EN /PROPIEDADES\n');
  const terrenosVisibles = allTerrenos.filter(t =>
    t.is_marketplace_listing === true &&
    t.status === 'active' &&
    t.latitude &&
    t.longitude
  );

  console.log(`Terrenos que DEBERÍAN verse en /propiedades: ${terrenosVisibles.length}\n`);

  if (terrenosVisibles.length === 0) {
    console.log('⚠️ NO HAY TERRENOS VISIBLES EN EL MARKETPLACE');
    console.log('');
    console.log('Posibles causas:');
    console.log('  1. No están marcados como "marketplace listing"');
    console.log('  2. No tienen estado "active"');
    console.log('  3. No tienen coordenadas (latitude/longitude)');
    console.log('');
  } else {
    terrenosVisibles.forEach((t, i) => {
      console.log(`${i + 1}. ${t.title}`);
      console.log(`   Coordenadas: ${t.latitude}, ${t.longitude}`);
      console.log('');
    });
  }

  // 4. Terrenos huérfanos
  console.log('\n⚠️ 4. TERRENOS HUÉRFANOS (usuario eliminado)\n');
  const terrenosHuerfanos = [];
  for (const terreno of allTerrenos) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', terreno.user_id)
      .single();

    if (!profile) {
      terrenosHuerfanos.push(terreno);
    }
  }

  if (terrenosHuerfanos.length > 0) {
    console.log(`Se encontraron ${terrenosHuerfanos.length} terrenos huérfanos:\n`);
    terrenosHuerfanos.forEach(t => {
      console.log(`⚠️ ${t.title}`);
      console.log(`   ID: ${t.id}`);
      console.log(`   Usuario eliminado: ${t.user_id}`);
      console.log('');
    });
    console.log('💡 Estos terrenos deberían eliminarse o reasignarse\n');
  } else {
    console.log('✅ No hay terrenos huérfanos\n');
  }

  // 5. Resumen final
  console.log('═══════════════════════════════════════════════════════');
  console.log('📊 RESUMEN FINAL');
  console.log('═══════════════════════════════════════════════════════\n');

  const terrenosMarketplace = allTerrenos.filter(t => t.is_marketplace_listing && t.status === 'active');
  const terrenosConCoords = allTerrenos.filter(t => t.latitude && t.longitude);
  const terrenosSinCoords = allTerrenos.filter(t => !t.latitude || !t.longitude);

  console.log(`Total usuarios:                 ${profiles.length}`);
  console.log(`Total terrenos:                 ${allTerrenos.length}`);
  console.log(`Terrenos en marketplace:        ${terrenosMarketplace.length}`);
  console.log(`Terrenos con coordenadas:       ${terrenosConCoords.length}`);
  console.log(`Terrenos SIN coordenadas:       ${terrenosSinCoords.length}`);
  console.log(`Terrenos huérfanos:             ${terrenosHuerfanos.length}`);
  console.log(`Terrenos VISIBLES en /propiedades: ${terrenosVisibles.length}`);
  console.log('');

  if (terrenosSinCoords.length > 0) {
    console.log('⚠️ ACCIÓN REQUERIDA:');
    console.log(`   ${terrenosSinCoords.length} terreno(s) necesitan coordenadas:`);
    terrenosSinCoords.forEach(t => {
      console.log(`   - ${t.title} (ID: ${t.id})`);
    });
    console.log('');
  }
}

verificarEstadoCompleto();
