// Script para verificar configuración de contacto de terrenos
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Leer variables de entorno
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach((line) => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  }
});

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

async function checkContactConfig() {
  console.log('🔍 Verificando configuración de contacto...\n');

  const { data: terrenos, error } = await supabase
    .from('terrenos')
    .select('id, title, contact_type, contact_email, contact_phone')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error:', error.message);
    return;
  }

  console.log('═'.repeat(80));
  console.log('📊 RESUMEN DE CONFIGURACIÓN DE CONTACTO');
  console.log('═'.repeat(80));

  terrenos.forEach((t, i) => {
    console.log(`\n${i + 1}. ${t.title}`);
    console.log('─'.repeat(80));

    // Icono según tipo
    let icon = '❓';
    let status = '';

    if (t.contact_type === 'formal') {
      icon = '📧';
      status = 'FORMULARIO DE EMAIL';
    } else if (t.contact_type === 'casual') {
      icon = '💬';
      status = 'WHATSAPP';
    } else if (t.contact_type === 'both') {
      icon = '📧💬';
      status = 'AMBOS MÉTODOS';
    }

    console.log(`   ${icon} Tipo: ${status}`);

    // Validar configuración
    let warnings = [];

    if (t.contact_type === 'formal' || t.contact_type === 'both') {
      if (!t.contact_email) {
        warnings.push(
          '⚠️  Falta configurar contact_email para recibir formularios',
        );
      } else {
        console.log(`   ✅ Email configurado: ${t.contact_email}`);
      }
    }

    if (t.contact_type === 'casual' || t.contact_type === 'both') {
      if (!t.contact_phone) {
        warnings.push('⚠️  Falta configurar contact_phone para WhatsApp');
      } else {
        console.log(`   ✅ WhatsApp configurado: ${t.contact_phone}`);
      }
    }

    // Mostrar advertencias
    if (warnings.length > 0) {
      console.log('');
      warnings.forEach((w) => console.log(`   ${w}`));
    }

    // Link para probar
    console.log(`\n   🔗 Probar: http://localhost:3001/terreno/${t.id}`);
  });

  console.log('\n' + '═'.repeat(80));
  console.log('📝 RESUMEN:');
  console.log('═'.repeat(80));

  const formal = terrenos.filter((t) => t.contact_type === 'formal').length;
  const casual = terrenos.filter((t) => t.contact_type === 'casual').length;
  const both = terrenos.filter((t) => t.contact_type === 'both').length;

  console.log(`   📧 Formulario solamente: ${formal}`);
  console.log(`   💬 WhatsApp solamente:   ${casual}`);
  console.log(`   📧💬 Ambos métodos:       ${both}`);
  console.log(`   📊 Total:                ${terrenos.length}`);

  console.log(
    '\n💡 TIP: Los terrenos ya funcionan con la configuración actual.',
  );
  console.log(
    '   Para cambiarla, usa SQL o espera los formularios del dashboard.\n',
  );
}

checkContactConfig().then(() => process.exit(0));
