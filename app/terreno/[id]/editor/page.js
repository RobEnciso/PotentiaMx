'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabaseClient'; // ✅ Usa la nueva función
import HotspotEditor from './HotspotEditor';
import { v4 as uuidv4 } from 'uuid';
import imageCompression from 'browser-image-compression';

export default function EditorPage() {
  // ✅ Crea una instancia estable del cliente de Supabase para este componente
  const supabase = useMemo(() => createClient(), []);

  const params = useParams();
  const router = useRouter();
  const [terrain, setTerrain] = useState(null);
  const [hotspots, setHotspots] = useState([]);
  const [viewNames, setViewNames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Declarar loadData ANTES del useEffect que lo usa
  const loadData = useCallback(
    async (terrainId) => {
      setLoading(true);
      setError(null);
      try {
        // ✅ MULTI-TENANCY: Obtener usuario actual
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setError('No hay usuario autenticado');
          router.push('/login');
          return;
        }

        const { data: terrainData, error: terrainError } = await supabase
          .from('terrenos')
          .select('*')
          .eq('id', terrainId)
          .single();
        if (terrainError) throw terrainError;

        // ✅ MULTI-TENANCY: Verificar que el terreno pertenece al usuario actual
        if (terrainData.user_id !== user.id) {
          setError('No tienes permiso para editar este terreno');
          setTimeout(() => router.push('/dashboard'), 2000);
          return;
        }

        setTerrain(terrainData);

        // ✅ Inicializar nombres de vistas
        const imageUrls = Array.isArray(terrainData.image_urls)
          ? terrainData.image_urls
          : [];
        const storedViewNames = Array.isArray(terrainData.view_names)
          ? terrainData.view_names
          : [];

        // Si no hay nombres guardados o el array es más corto que las imágenes, usar nombres por defecto
        const initializedViewNames = imageUrls.map(
          (_, index) => storedViewNames[index] || `Vista ${index + 1}`,
        );
        setViewNames(initializedViewNames);

        const { data: hotspotsData, error: hotspotsError } = await supabase
          .from('hotspots')
          .select('*')
          .eq('terreno_id', terrainId);
        if (hotspotsError) throw hotspotsError;

        const transformedHotspots = (hotspotsData || []).map((h) => ({
          id: h.id,
          title: h.title,
          yaw: h.position_yaw,
          pitch: h.position_pitch,
          imageIndex: h.panorama_index,
          targetImageIndex: h.target_panorama_index,
        }));
        setHotspots(transformedHotspots);
      } catch (error) {
        console.error('❌ Error al cargar datos:', error);
        setError('Error al cargar los datos: ' + error.message);
      } finally {
        setLoading(false);
      }
    },
    [supabase, router],
  );

  useEffect(() => {
    if (params.id) {
      loadData(params.id);
    }
  }, [params.id, loadData]);

  const handleUploadNewImage = async (imageFile) => {
    try {
      console.log(
        `📦 Imagen original: ${imageFile.name}, tamaño: ${(imageFile.size / 1024 / 1024).toFixed(2)}MB`,
      );

      // ✅ OPTIMIZADO: Mayor calidad para tours 360° profesionales
      const compressionOptions = {
        maxWidthOrHeight: 3840, // 4K para máxima calidad
        useWebWorker: true,
        fileType: 'image/webp', // Mejor compresión que JPEG
        initialQuality: 0.92, // 92% de calidad (antes 85%)
        maxSizeMB: 5, // 5MB para mantener calidad premium (antes 2MB)
      };

      const compressedFile = await imageCompression(
        imageFile,
        compressionOptions,
      );

      console.log(
        `✅ Imagen comprimida: tamaño: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`,
      );
      console.log(
        `📊 Reducción: ${(((imageFile.size - compressedFile.size) / imageFile.size) * 100).toFixed(1)}%`,
      );

      // Obtener usuario actual
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      // Subir imagen COMPRIMIDA a storage
      const filePath = `${user.id}/${uuidv4()}.webp`;
      const { error: uploadError } = await supabase.storage
        .from('tours-panoramicos')
        .upload(filePath, compressedFile);

      if (uploadError) throw uploadError;

      // Obtener URL pública
      const { data: publicUrlData } = supabase.storage
        .from('tours-panoramicos')
        .getPublicUrl(filePath);

      // Actualizar el array de image_urls en la base de datos
      const currentImageUrls = Array.isArray(terrain.image_urls)
        ? terrain.image_urls
        : [];
      const updatedImageUrls = [...currentImageUrls, publicUrlData.publicUrl];

      const { error: updateError } = await supabase
        .from('terrenos')
        .update({ image_urls: updatedImageUrls })
        .eq('id', params.id);

      if (updateError) throw updateError;

      // Actualizar el estado local
      setTerrain((prev) => ({
        ...prev,
        image_urls: updatedImageUrls,
      }));

      // ✅ Agregar nombre por defecto para la nueva vista
      const newViewIndex = updatedImageUrls.length - 1;
      setViewNames((prev) => [...prev, `Vista ${newViewIndex + 1}`]);

      console.log('✅ Nueva vista agregada y optimizada correctamente');

      // Retornar el índice de la nueva imagen (será el último)
      return newViewIndex;
    } catch (error) {
      console.error('Error al subir imagen:', error);
      throw error;
    }
  };

  const handleDeleteView = async (viewIndex) => {
    const imageUrls = Array.isArray(terrain.image_urls)
      ? terrain.image_urls
      : [];

    // Validación: no permitir eliminar si solo hay 1 vista
    if (imageUrls.length <= 1) {
      alert(
        '⚠️ No puedes eliminar la última vista. Debe haber al menos una imagen 360°.',
      );
      return;
    }

    // Contar hotspots en esta vista
    const hotspotsInView = hotspots.filter((h) => h.imageIndex === viewIndex);
    const hotspotsPointingToView = hotspots.filter(
      (h) => h.targetImageIndex === viewIndex,
    );

    // Confirmar eliminación
    let confirmMessage = `¿Estás seguro de eliminar la Vista ${viewIndex + 1}?`;
    if (hotspotsInView.length > 0) {
      confirmMessage += `\n\n⚠️ Esta vista tiene ${hotspotsInView.length} hotspot(s) que serán eliminados.`;
    }
    if (hotspotsPointingToView.length > 0) {
      confirmMessage += `\n\n⚠️ ${hotspotsPointingToView.length} hotspot(s) apuntan a esta vista y se actualizarán para apuntar a Vista 1.`;
    }
    confirmMessage += '\n\n🗑️ La imagen será eliminada permanentemente.';

    if (!confirm(confirmMessage)) return;

    try {
      setSaving(true);

      // 1. Extraer la ruta del archivo desde la URL para eliminarlo de Storage
      const imageUrlToDelete = imageUrls[viewIndex];
      let fileDeleted = false;

      if (imageUrlToDelete) {
        try {
          // Extraer la ruta del archivo desde la URL pública
          // URL format: https://[project].supabase.co/storage/v1/object/public/tours-panoramicos/[filePath]
          const urlParts = imageUrlToDelete.split('/tours-panoramicos/');
          if (urlParts.length === 2) {
            const filePath = decodeURIComponent(urlParts[1]);
            console.log('🗑️ Eliminando archivo del Storage:', filePath);

            const { error: deleteError } = await supabase.storage
              .from('tours-panoramicos')
              .remove([filePath]);

            if (deleteError) {
              console.warn(
                '⚠️ Error al eliminar archivo de Storage:',
                deleteError,
              );
              // No detener el proceso, continuar eliminando la referencia
            } else {
              console.log('✅ Archivo eliminado del Storage');
              fileDeleted = true;
            }
          }
        } catch (storageError) {
          console.warn(
            '⚠️ Error al procesar eliminación de Storage:',
            storageError,
          );
          // Continuar de todos modos
        }
      }

      // 2. Eliminar imagen del array
      const updatedImageUrls = imageUrls.filter(
        (_, index) => index !== viewIndex,
      );

      // 3. Actualizar en base de datos
      const { error: updateError } = await supabase
        .from('terrenos')
        .update({ image_urls: updatedImageUrls })
        .eq('id', params.id);

      if (updateError) throw updateError;

      // 3. Actualizar hotspots:
      // - Eliminar hotspots EN esta vista
      // - Reindexar hotspots en vistas posteriores (imageIndex)
      // - Actualizar hotspots que apuntan a esta vista (targetImageIndex)
      // - Reindexar targetImageIndex de vistas posteriores
      const updatedHotspots = hotspots
        .filter((h) => h.imageIndex !== viewIndex) // Eliminar hotspots en esta vista
        .map((h) => ({
          ...h,
          // Reindexar imageIndex
          imageIndex:
            h.imageIndex > viewIndex ? h.imageIndex - 1 : h.imageIndex,
          // Actualizar targetImageIndex
          targetImageIndex:
            h.targetImageIndex === viewIndex
              ? 0 // Los que apuntaban a la vista eliminada ahora apuntan a Vista 1
              : h.targetImageIndex > viewIndex
                ? h.targetImageIndex - 1 // Reindexar los posteriores
                : h.targetImageIndex,
        }));

      // 4. Guardar hotspots actualizados en base de datos
      const hotspotsToInsert = updatedHotspots.map((h) => ({
        title: h.title,
        position_yaw: h.yaw,
        position_pitch: h.pitch,
        panorama_index: h.imageIndex,
        target_panorama_index: h.targetImageIndex,
      }));

      const { error: rpcError } = await supabase.rpc(
        'update_hotspots_for_terrain',
        {
          terrain_id_to_update: params.id,
          hotspots_data: hotspotsToInsert,
        },
      );

      if (rpcError) throw rpcError;

      // 5. Actualizar nombres de vistas (eliminar el nombre correspondiente)
      const updatedViewNames = viewNames.filter(
        (_, index) => index !== viewIndex,
      );
      setViewNames(updatedViewNames);

      // 6. Actualizar estado local
      setTerrain((prev) => ({
        ...prev,
        image_urls: updatedImageUrls,
      }));
      setHotspots(updatedHotspots);

      alert(`✅ Vista ${viewIndex + 1} eliminada correctamente.`);
    } catch (error) {
      console.error('❌ Error al eliminar vista:', error);
      alert('Error al eliminar vista: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleRenameView = async (viewIndex, newName) => {
    try {
      // Validar que el nombre no esté vacío
      const trimmedName = newName.trim();
      if (!trimmedName) {
        alert('⚠️ El nombre de la vista no puede estar vacío.');
        return false;
      }

      // Actualizar el array de nombres
      const updatedViewNames = [...viewNames];
      updatedViewNames[viewIndex] = trimmedName;

      // Guardar en la base de datos
      const { error: updateError } = await supabase
        .from('terrenos')
        .update({ view_names: updatedViewNames })
        .eq('id', params.id);

      if (updateError) {
        console.error('Error al guardar nombre de vista:', updateError);
        alert('Error al guardar el nombre: ' + updateError.message);
        return false;
      }

      // Actualizar estado local
      setViewNames(updatedViewNames);
      console.log(`✅ Vista ${viewIndex + 1} renombrada a: "${trimmedName}"`);
      return true;
    } catch (error) {
      console.error('Error al renombrar vista:', error);
      alert('Error al renombrar: ' + error.message);
      return false;
    }
  };

  const handleSaveHotspots = async (newHotspots) => {
    setSaving(true);
    // Verificación de sesión ANTES de llamar al RPC
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      alert('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
      setSaving(false);
      router.push('/login'); // O tu ruta de login
      return;
    }

    try {
      const hotspotsToInsert = newHotspots.map((h) => ({
        title: h.title,
        position_yaw: h.yaw,
        position_pitch: h.pitch,
        panorama_index: h.imageIndex,
        target_panorama_index: h.targetImageIndex,
      }));

      const { error: rpcError } = await supabase.rpc(
        'update_hotspots_for_terrain',
        {
          terrain_id_to_update: params.id,
          hotspots_data: hotspotsToInsert,
        },
      );

      if (rpcError) throw rpcError;

      // Recargar hotspots desde la BD para sincronizar
      const { data: hotspotsData, error: hotspotsError } = await supabase
        .from('hotspots')
        .select('*')
        .eq('terreno_id', params.id);

      if (!hotspotsError && hotspotsData) {
        const transformedHotspots = hotspotsData.map((h) => ({
          id: h.id,
          title: h.title,
          yaw: h.position_yaw,
          pitch: h.position_pitch,
          imageIndex: h.panorama_index,
          targetImageIndex: h.target_panorama_index,
        }));
        setHotspots(transformedHotspots);
      }

      alert(`✅ ${newHotspots.length} hotspot(s) guardado(s) correctamente.`);
    } catch (error) {
      console.error('❌ Error al guardar hotspots:', error);
      alert('Error al guardar: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>⏳ Cargando editor...</div>;
  if (error)
    return (
      <div>
        ❌ {error}{' '}
        <button onClick={() => router.push('/dashboard')}>Volver</button>
      </div>
    );
  if (!terrain)
    return (
      <div>
        ❌ Terreno no encontrado{' '}
        <button onClick={() => router.push('/dashboard')}>Volver</button>
      </div>
    );

  const imageUrls = Array.isArray(terrain.image_urls) ? terrain.image_urls : [];
  if (imageUrls.length === 0)
    return <div>⚠️ Este terreno no tiene imágenes 360°.</div>;

  return (
    <HotspotEditor
      terrainId={params.id}
      imageUrls={imageUrls}
      existingHotspots={hotspots}
      viewNames={viewNames}
      onSaveHotspots={handleSaveHotspots}
      onUploadNewImage={handleUploadNewImage}
      onDeleteView={handleDeleteView}
      onRenameView={handleRenameView}
      isSaving={saving}
    />
  );
}
