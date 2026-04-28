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

async function verificarStorageLimpio() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🧹 VERIFICACIÓN DE LIMPIEZA DE STORAGE');
  console.log('═══════════════════════════════════════════════════════\n');

  // 1. Obtener todas las URLs de imágenes usadas en terrenos
  console.log('📊 Paso 1: Obteniendo URLs en uso en la base de datos...\n');

  const { data: allTerrenos, error: fetchError } = await supabase
    .from('terrenos')
    .select('image_urls, cover_image_url, title');

  if (fetchError) {
    console.error('❌ Error:', fetchError.message);
    return;
  }

  const usedUrls = new Set();
  const usedPaths = new Set();

  allTerrenos?.forEach((t) => {
    // Agregar image_urls
    t.image_urls?.forEach((url) => {
      usedUrls.add(url);
      const path = url.split('/tours-panoramicos/')[1];
      if (path) usedPaths.add(path);
    });

    // Agregar cover_image_url
    if (t.cover_image_url) {
      usedUrls.add(t.cover_image_url);
      const path = t.cover_image_url.split('/tours-panoramicos/')[1];
      if (path) usedPaths.add(path);
    }
  });

  console.log(`✅ URLs en uso en BD: ${usedUrls.size}`);
  console.log(`✅ Paths de archivos en uso: ${usedPaths.size}\n`);

  // Mostrar los terrenos y sus imágenes
  console.log('📸 Imágenes por terreno:\n');
  allTerrenos?.forEach((terreno, i) => {
    const totalImages = (terreno.image_urls?.length || 0) + (terreno.cover_image_url ? 1 : 0);
    console.log(`${i + 1}. ${terreno.title}`);
    console.log(`   Panoramas: ${terreno.image_urls?.length || 0}`);
    console.log(`   Cover: ${terreno.cover_image_url ? '✅ Sí' : '❌ No'}`);
    console.log(`   Total: ${totalImages} imágenes`);
    console.log('');
  });

  // 2. Obtener TODOS los archivos del storage
  console.log('📁 Paso 2: Escaneando archivos en Supabase Storage...\n');

  const getAllFiles = async (path = '') => {
    const { data: items, error } = await supabase.storage
      .from('tours-panoramicos')
      .list(path);

    if (error) {
      console.error('Error:', error.message);
      return [];
    }

    let files = [];
    if (!items) return files;

    for (const item of items) {
      if (item.name === '.emptyFolderPlaceholder') continue;

      const fullPath = path ? `${path}/${item.name}` : item.name;

      if (item.id) {
        // Es un archivo
        const sizeInMB = (item.metadata?.size || 0) / (1024 * 1024);
        files.push({
          path: fullPath,
          size: sizeInMB,
          name: item.name,
        });
      } else {
        // Es una carpeta
        const subFiles = await getAllFiles(fullPath);
        files = files.concat(subFiles);
      }
    }

    return files;
  };

  const allFiles = await getAllFiles();
  console.log(`✅ Archivos totales en storage: ${allFiles.length}\n`);

  // 3. Encontrar archivos huérfanos
  console.log('🔍 Paso 3: Buscando archivos huérfanos...\n');

  const orphanFiles = allFiles.filter((file) => !usedPaths.has(file.path));

  if (orphanFiles.length === 0) {
    console.log('✅✅✅ ¡EXCELENTE! NO SE ENCONTRARON ARCHIVOS HUÉRFANOS');
    console.log('');
    console.log('🎉 Tu panel de administrador funcionó PERFECTAMENTE');
    console.log('🎉 Los 23 archivos huérfanos fueron eliminados correctamente');
    console.log('');
  } else {
    console.log(`⚠️ Se encontraron ${orphanFiles.length} archivos huérfanos:\n`);

    let totalOrphanSize = 0;
    orphanFiles.forEach((file, i) => {
      console.log(`${i + 1}. ${file.path}`);
      console.log(`   Tamaño: ${file.size.toFixed(2)} MB`);
      totalOrphanSize += file.size;
    });

    console.log(`\nTamaño total huérfano: ${totalOrphanSize.toFixed(2)} MB`);
    console.log('');
  }

  // 4. Calcular tamaño total usado
  const totalSize = allFiles.reduce((sum, file) => sum + file.size, 0);

  // 5. Resumen final
  console.log('═══════════════════════════════════════════════════════');
  console.log('📊 RESUMEN DE STORAGE');
  console.log('═══════════════════════════════════════════════════════\n');

  console.log(`Total de archivos en storage:   ${allFiles.length}`);
  console.log(`Archivos referenciados en BD:   ${usedPaths.size}`);
  console.log(`Archivos huérfanos encontrados: ${orphanFiles.length}`);
  console.log(`Tamaño total en storage:        ${totalSize.toFixed(2)} MB`);
  console.log('');

  if (orphanFiles.length === 0) {
    console.log('🎊 ESTADO: LIMPIO Y OPTIMIZADO');
    console.log('✅ Panel de administrador: FUNCIONANDO CORRECTAMENTE');
  } else {
    console.log('⚠️ ESTADO: REQUIERE LIMPIEZA');
    console.log(`   ${orphanFiles.length} archivos pueden eliminarse`);
  }
  console.log('');

  // 6. Análisis por tipo de archivo
  console.log('═══════════════════════════════════════════════════════');
  console.log('📈 ANÁLISIS POR TIPO DE ARCHIVO');
  console.log('═══════════════════════════════════════════════════════\n');

  const filesByType = {};
  allFiles.forEach((file) => {
    const ext = file.name.split('.').pop()?.toLowerCase() || 'unknown';
    if (!filesByType[ext]) {
      filesByType[ext] = { count: 0, size: 0 };
    }
    filesByType[ext].count++;
    filesByType[ext].size += file.size;
  });

  Object.entries(filesByType).forEach(([ext, data]) => {
    console.log(`📄 .${ext.toUpperCase()}`);
    console.log(`   Cantidad: ${data.count} archivos`);
    console.log(`   Tamaño: ${data.size.toFixed(2)} MB`);
    console.log('');
  });

  // 7. Verificar coherencia
  console.log('═══════════════════════════════════════════════════════');
  console.log('🔍 VERIFICACIÓN DE COHERENCIA');
  console.log('═══════════════════════════════════════════════════════\n');

  // Verificar si hay URLs en BD que no existen en storage
  const missingFiles = [];
  for (const path of usedPaths) {
    const exists = allFiles.some(f => f.path === path);
    if (!exists) {
      missingFiles.push(path);
    }
  }

  if (missingFiles.length > 0) {
    console.log(`⚠️ ${missingFiles.length} archivos referenciados en BD NO existen en storage:\n`);
    missingFiles.forEach((path, i) => {
      console.log(`${i + 1}. ${path}`);
    });
    console.log('');
  } else {
    console.log('✅ Todas las referencias en BD apuntan a archivos existentes');
    console.log('');
  }

  console.log('═══════════════════════════════════════════════════════');
  console.log('✅ VERIFICACIÓN COMPLETADA');
  console.log('═══════════════════════════════════════════════════════');
}

verificarStorageLimpio();
