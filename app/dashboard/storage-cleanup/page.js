'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function StorageCleanup() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [storageFiles, setStorageFiles] = useState([]);
  const [dbImageUrls, setDbImageUrls] = useState([]);
  const [orphanedFiles, setOrphanedFiles] = useState([]);
  const [storageStats, setStorageStats] = useState({
    totalFiles: 0,
    totalSize: 0,
    orphanedCount: 0,
    orphanedSize: 0,
  });

  // Verificar autenticación
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      setLoading(false);
    };
    checkAuth();
  }, [supabase, router]);

  // Función para analizar el Storage
  const analyzeStorage = async () => {
    setAnalyzing(true);
    try {
      // 1. Obtener todos los archivos del Storage
      console.log('📂 Listando archivos en Storage...');
      const { data: filesList, error: listError } = await supabase.storage
        .from('tours-panoramicos')
        .list('', {
          limit: 1000,
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (listError) {
        throw new Error(`Error al listar Storage: ${listError.message}`);
      }

      // Obtener archivos de todas las carpetas de usuario
      let allFiles = [];
      const folders = filesList.filter((item) => item.id === null); // Las carpetas tienen id null

      for (const folder of folders) {
        const { data: folderFiles, error: folderError } = await supabase.storage
          .from('tours-panoramicos')
          .list(folder.name, {
            limit: 1000,
          });

        if (folderError) {
          console.error(`Error al listar carpeta ${folder.name}:`, folderError);
          continue;
        }

        // Agregar path completo a cada archivo
        const filesWithPath = folderFiles.map((file) => ({
          ...file,
          fullPath: `${folder.name}/${file.name}`,
          folder: folder.name,
        }));

        allFiles = [...allFiles, ...filesWithPath];
      }

      console.log(`📁 Total de archivos encontrados: ${allFiles.length}`);
      setStorageFiles(allFiles);

      // 2. Obtener todas las URLs de imágenes en la base de datos
      console.log('🗄️ Consultando base de datos...');
      const { data: terrenos, error: dbError } = await supabase
        .from('terrenos')
        .select('image_urls, cover_image_url');

      if (dbError) {
        throw new Error(`Error al consultar DB: ${dbError.message}`);
      }

      // Extraer todas las URLs únicas
      const allUrls = new Set();
      terrenos.forEach((terreno) => {
        if (terreno.image_urls) {
          terreno.image_urls.forEach((url) => allUrls.add(url));
        }
        if (terreno.cover_image_url) {
          allUrls.add(terreno.cover_image_url);
        }
      });

      console.log(`🔗 Total de URLs en DB: ${allUrls.size}`);
      setDbImageUrls(Array.from(allUrls));

      // 3. Identificar archivos huérfanos
      const orphans = allFiles.filter((file) => {
        const fileInDb = Array.from(allUrls).some((url) =>
          url.includes(file.fullPath),
        );
        return !fileInDb;
      });

      console.log(`🗑️ Archivos huérfanos encontrados: ${orphans.length}`);
      setOrphanedFiles(orphans);

      // 4. Calcular estadísticas
      const totalSize = allFiles.reduce(
        (sum, file) => sum + (file.metadata?.size || 0),
        0,
      );
      const orphanedSize = orphans.reduce(
        (sum, file) => sum + (file.metadata?.size || 0),
        0,
      );

      setStorageStats({
        totalFiles: allFiles.length,
        totalSize,
        orphanedCount: orphans.length,
        orphanedSize,
      });
    } catch (error) {
      console.error('Error al analizar Storage:', error);
      alert('Error: ' + error.message);
    } finally {
      setAnalyzing(false);
    }
  };

  // Función para eliminar archivos huérfanos
  const cleanOrphanedFiles = async () => {
    if (orphanedFiles.length === 0) {
      alert('No hay archivos huérfanos para eliminar.');
      return;
    }

    const confirmText = `⚠️ ADVERTENCIA: Esta acción eliminará ${orphanedFiles.length} archivo(s) del Storage.\n\nTamaño total a liberar: ${formatBytes(storageStats.orphanedSize)}\n\n¿Estás seguro de continuar?\n\nEsta acción NO se puede deshacer.`;

    if (!confirm(confirmText)) {
      return;
    }

    setAnalyzing(true);
    try {
      const filePaths = orphanedFiles.map((file) => file.fullPath);

      console.log('🗑️ Eliminando archivos huérfanos:', filePaths);

      // Eliminar en lotes de 50 (límite de Supabase)
      const batchSize = 50;
      for (let i = 0; i < filePaths.length; i += batchSize) {
        const batch = filePaths.slice(i, i + batchSize);
        const { error } = await supabase.storage
          .from('tours-panoramicos')
          .remove(batch);

        if (error) {
          console.error(`Error al eliminar lote ${i / batchSize + 1}:`, error);
          // Continuar con los siguientes lotes aunque haya error
        }
      }

      alert(
        `✅ Limpieza completada!\n\nArchivos eliminados: ${orphanedFiles.length}\nEspacio liberado: ${formatBytes(storageStats.orphanedSize)}`,
      );

      // Volver a analizar para actualizar estadísticas
      await analyzeStorage();
    } catch (error) {
      console.error('Error al limpiar archivos:', error);
      alert('Error: ' + error.message);
    } finally {
      setAnalyzing(false);
    }
  };

  // Formatear bytes a tamaño legible
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => router.push('/dashboard')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            ← Volver
          </button>
          <h1 style={{ margin: 0, color: '#1f2937' }}>
            🧹 Limpieza de Storage
          </h1>
        </div>
      </div>

      {/* Info Box */}
      <div
        style={{
          backgroundColor: '#dbeafe',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          border: '1px solid #3b82f6',
        }}
      >
        <h3 style={{ marginTop: 0, color: '#1e40af' }}>
          ℹ️ ¿Qué hace esta herramienta?
        </h3>
        <ul style={{ margin: '0.5rem 0', color: '#1e3a8a' }}>
          <li>Analiza todos los archivos almacenados en Supabase Storage</li>
          <li>Compara con las imágenes registradas en la base de datos</li>
          <li>
            Identifica archivos &quot;huérfanos&quot; (sin terreno asociado)
          </li>
          <li>Te permite eliminarlos de forma segura para liberar espacio</li>
        </ul>
        <p style={{ margin: '0.5rem 0 0', fontSize: '14px', color: '#1e3a8a' }}>
          <strong>Nota:</strong> Los archivos huérfanos suelen ser de terrenos
          eliminados o cargas fallidas.
        </p>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button
          onClick={analyzeStorage}
          disabled={analyzing}
          style={{
            padding: '12px 24px',
            backgroundColor: analyzing ? '#6c757d' : '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: analyzing ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          {analyzing ? '🔄 Analizando...' : '🔍 Analizar Storage'}
        </button>

        {orphanedFiles.length > 0 && (
          <button
            onClick={cleanOrphanedFiles}
            disabled={analyzing}
            style={{
              padding: '12px 24px',
              backgroundColor: analyzing ? '#6c757d' : '#dc3545',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: analyzing ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
          >
            🗑️ Eliminar Archivos Huérfanos
          </button>
        )}
      </div>

      {/* Statistics Cards */}
      {storageFiles.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          {/* Total Files Card */}
          <div
            style={{
              backgroundColor: '#fff',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <div
              style={{
                fontSize: '14px',
                color: '#6b7280',
                marginBottom: '0.5rem',
              }}
            >
              📁 Total de Archivos
            </div>
            <div
              style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937' }}
            >
              {storageStats.totalFiles}
            </div>
            <div
              style={{
                fontSize: '14px',
                color: '#6b7280',
                marginTop: '0.5rem',
              }}
            >
              {formatBytes(storageStats.totalSize)}
            </div>
          </div>

          {/* Database Images Card */}
          <div
            style={{
              backgroundColor: '#fff',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <div
              style={{
                fontSize: '14px',
                color: '#6b7280',
                marginBottom: '0.5rem',
              }}
            >
              ✅ Imágenes en Uso
            </div>
            <div
              style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}
            >
              {dbImageUrls.length}
            </div>
            <div
              style={{
                fontSize: '14px',
                color: '#6b7280',
                marginTop: '0.5rem',
              }}
            >
              En base de datos
            </div>
          </div>

          {/* Orphaned Files Card */}
          <div
            style={{
              backgroundColor: '#fff',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: orphanedFiles.length > 0 ? '2px solid #ef4444' : 'none',
            }}
          >
            <div
              style={{
                fontSize: '14px',
                color: '#6b7280',
                marginBottom: '0.5rem',
              }}
            >
              ⚠️ Archivos Huérfanos
            </div>
            <div
              style={{ fontSize: '32px', fontWeight: 'bold', color: '#ef4444' }}
            >
              {storageStats.orphanedCount}
            </div>
            <div
              style={{
                fontSize: '14px',
                color: '#6b7280',
                marginTop: '0.5rem',
              }}
            >
              {formatBytes(storageStats.orphanedSize)} a liberar
            </div>
          </div>

          {/* Percentage Card */}
          <div
            style={{
              backgroundColor: '#fff',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <div
              style={{
                fontSize: '14px',
                color: '#6b7280',
                marginBottom: '0.5rem',
              }}
            >
              📊 Eficiencia de Storage
            </div>
            <div
              style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937' }}
            >
              {storageStats.totalFiles > 0
                ? Math.round(
                    ((storageStats.totalFiles - storageStats.orphanedCount) /
                      storageStats.totalFiles) *
                      100,
                  )
                : 0}
              %
            </div>
            <div
              style={{
                fontSize: '14px',
                color: '#6b7280',
                marginTop: '0.5rem',
              }}
            >
              Archivos en uso
            </div>
          </div>
        </div>
      )}

      {/* Orphaned Files List */}
      {orphanedFiles.length > 0 && (
        <div
          style={{
            backgroundColor: '#fff',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <h3 style={{ marginTop: 0, color: '#1f2937' }}>
            🗑️ Archivos Huérfanos ({orphanedFiles.length})
          </h3>
          <div
            style={{
              maxHeight: '400px',
              overflowY: 'auto',
              border: '1px solid #e5e7eb',
              borderRadius: '5px',
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '14px',
              }}
            >
              <thead
                style={{
                  backgroundColor: '#f9fafb',
                  position: 'sticky',
                  top: 0,
                }}
              >
                <tr>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      borderBottom: '2px solid #e5e7eb',
                      color: '#374151',
                    }}
                  >
                    Archivo
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      borderBottom: '2px solid #e5e7eb',
                      color: '#374151',
                    }}
                  >
                    Carpeta
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'right',
                      borderBottom: '2px solid #e5e7eb',
                      color: '#374151',
                    }}
                  >
                    Tamaño
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      borderBottom: '2px solid #e5e7eb',
                      color: '#374151',
                    }}
                  >
                    Fecha Creación
                  </th>
                </tr>
              </thead>
              <tbody>
                {orphanedFiles.map((file, index) => (
                  <tr
                    key={index}
                    style={{
                      borderBottom: '1px solid #e5e7eb',
                      backgroundColor: index % 2 === 0 ? '#fff' : '#f9fafb',
                    }}
                  >
                    <td style={{ padding: '12px', color: '#1f2937' }}>
                      {file.name}
                    </td>
                    <td style={{ padding: '12px', color: '#6b7280' }}>
                      {file.folder}
                    </td>
                    <td
                      style={{
                        padding: '12px',
                        textAlign: 'right',
                        color: '#6b7280',
                      }}
                    >
                      {formatBytes(file.metadata?.size || 0)}
                    </td>
                    <td style={{ padding: '12px', color: '#6b7280' }}>
                      {file.created_at
                        ? new Date(file.created_at).toLocaleDateString('es-MX')
                        : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {storageFiles.length === 0 && (
        <div
          style={{
            backgroundColor: '#fff',
            padding: '3rem',
            borderRadius: '8px',
            textAlign: 'center',
            color: '#6b7280',
          }}
        >
          <p style={{ fontSize: '18px', marginBottom: '1rem' }}>
            👆 Haz clic en &quot;Analizar Storage&quot; para comenzar
          </p>
          <p style={{ fontSize: '14px' }}>
            Esto puede tomar unos segundos dependiendo de la cantidad de
            archivos.
          </p>
        </div>
      )}

      {/* Success State */}
      {storageFiles.length > 0 && orphanedFiles.length === 0 && (
        <div
          style={{
            backgroundColor: '#d1fae5',
            padding: '2rem',
            borderRadius: '8px',
            textAlign: 'center',
            border: '1px solid #10b981',
          }}
        >
          <h3 style={{ color: '#065f46', marginTop: 0 }}>
            ✅ ¡Storage limpio!
          </h3>
          <p style={{ color: '#047857', margin: 0 }}>
            No se encontraron archivos huérfanos. Todos tus archivos están en
            uso.
          </p>
        </div>
      )}
    </div>
  );
}
