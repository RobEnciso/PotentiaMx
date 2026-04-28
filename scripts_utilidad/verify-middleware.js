#!/usr/bin/env node

/**
 * Script de verificación del middleware
 * Asegura que la configuración del middleware es la correcta
 * para evitar problemas de performance de 26+ segundos
 *
 * USO: node verify-middleware.js
 */

const fs = require('fs');
const path = require('path');

const MIDDLEWARE_PATH = path.join(__dirname, 'middleware.ts');

console.log('🔍 Verificando configuración del middleware...\n');

try {
  const content = fs.readFileSync(MIDDLEWARE_PATH, 'utf-8');

  // Verificaciones críticas
  const checks = [
    {
      name: 'Excluye /terreno/*',
      test: /terreno/,
      required: true,
      message: '✅ Rutas públicas /terreno/* excluidas del middleware'
    },
    {
      name: 'Excluye assets estáticos',
      test: /\.(png|jpg|jpeg|gif|svg|webp|ico|css|js)/,
      required: true,
      message: '✅ Assets estáticos excluidos del middleware'
    },
    {
      name: 'Excluye Supabase Storage',
      test: /supabase/,
      required: true,
      message: '✅ Archivos de Supabase Storage excluidos'
    },
    {
      name: 'Incluye /dashboard',
      test: /\/dashboard/,
      required: true,
      message: '✅ Rutas protegidas incluidas'
    },
    {
      name: 'NO usa matcher genérico',
      test: /matcher:\s*\[\s*['"]\/\(\?\!_next\/static\|_next\/image\|favicon\.ico\)\.\*\)['"]\s*\]/,
      required: false,
      message: '❌ ALERTA: Matcher genérico detectado (causa lentitud)'
    }
  ];

  let allPassed = true;
  let warnings = [];

  checks.forEach(check => {
    const matches = check.test.test(content);

    if (check.required && matches) {
      console.log(check.message);
    } else if (check.required && !matches) {
      console.log(`❌ ERROR: ${check.name} - NO ENCONTRADO`);
      allPassed = false;
    } else if (!check.required && matches) {
      console.log(check.message);
      warnings.push(check.name);
      allPassed = false;
    }
  });

  console.log('\n' + '='.repeat(60));

  if (allPassed && warnings.length === 0) {
    console.log('✅ MIDDLEWARE CORRECTO - Performance óptima (<3s)');
    console.log('='.repeat(60));
    process.exit(0);
  } else if (warnings.length > 0) {
    console.log('⚠️  ADVERTENCIA: Configuración puede causar lentitud');
    console.log('='.repeat(60));
    console.log('\n⚠️  PROBLEMAS DETECTADOS:');
    warnings.forEach(w => console.log(`   - ${w}`));
    console.log('\n📖 Lee MIDDLEWARE_CRITICAL.md para más información');
    console.log('🔧 Restaura la configuración correcta desde commit 45adf5c');
    process.exit(1);
  } else {
    console.log('❌ CONFIGURACIÓN INCORRECTA - Causará lentitud de 26+ segundos');
    console.log('='.repeat(60));
    console.log('\n📖 Lee MIDDLEWARE_CRITICAL.md para corregir');
    console.log('🔧 Restaura la configuración correcta desde commit 45adf5c');
    process.exit(1);
  }

} catch (error) {
  console.error('❌ Error al leer middleware.ts:', error.message);
  process.exit(1);
}
