'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { createClient } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import AdminImpersonateBanner from '@/components/AdminImpersonateBanner';
import DocumentationTab from '@/components/admin/DocumentationTab';
import LogsTab from '@/components/admin/LogsTab';
import OnboardingTutorial from '@/components/OnboardingTutorial';
import WelcomeModal from '@/components/WelcomeModal';
import HelpButton from '@/components/HelpButton';
import { dashboardTutorialSteps } from '@/utils/tutorialSteps';
import { DEMO_TOUR_ID } from '@/config/demoTour';
import {
  Eye,
  Edit,
  Trash2,
  Plus,
  LogOut,
  Target,
  Code,
  Share2,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  Database,
  HardDrive,
  RefreshCw,
  AlertCircle,
  Users,
  Home,
  FileImage,
  BarChart3,
  Store,
} from 'lucide-react';

export default function Dashboard() {
  const supabase = useMemo(() => createClient(), []);
  const [terrenos, setTerrenos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // Nuevo: datos del usuario autenticado
  const [userProfile, setUserProfile] = useState(null);
  const [embedModalOpen, setEmbedModalOpen] = useState(false);
  const [selectedTerrenoForEmbed, setSelectedTerrenoForEmbed] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const router = useRouter();

  // Estados para herramientas de admin
  const [isAdmin, setIsAdmin] = useState(false);
  const [storageData, setStorageData] = useState(null);
  const [analyzingStorage, setAnalyzingStorage] = useState(false);
  const [cleaningOrphans, setCleaningOrphans] = useState(false);
  const [adminMessage, setAdminMessage] = useState(null);
  const [systemStats, setSystemStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Estados para panel de aprobación
  const [pendingTerrenos, setPendingTerrenos] = useState([]);
  const [loadingPending, setLoadingPending] = useState(false);
  const [approvingId, setApprovingId] = useState(null);

  // Estado para tabs del admin
  const [adminActiveTab, setAdminActiveTab] = useState('supervision');

  // Estados para Onboarding Tutorial
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  // CONFIGURACIÓN: Emails de administradores
  const ADMIN_EMAILS = [
    'admin@potentiamx.com', // Admin principal
    'victor.admin@potentiamx.com', // Admin secundario (futuro)
  ];

  const fetchTerrenos = useCallback(async () => {
    setLoading(true);

    // Obtener usuario actual
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error('No hay usuario autenticado');
      setLoading(false);
      return;
    }

    // Filtrar SOLO los terrenos de este usuario
    const { data, error } = await supabase
      .from('terrenos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching terrenos:', error.message);
    } else {
      setTerrenos(data);
    }
    setLoading(false);
  }, [supabase]);

  const fetchUserProfile = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // Guardar datos del usuario autenticado (incluye email y user_metadata)
    setUser(user);

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!error && data) {
      setUserProfile(data);
    }
  }, [supabase]);

  useEffect(() => {
    const checkSessionAndFetchData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        await fetchTerrenos();
        await fetchUserProfile();

        // Verificar si es admin
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user && ADMIN_EMAILS.includes(user.email)) {
          setIsAdmin(true);
          loadSystemStats(); // Cargar estadísticas del sistema
          loadPendingTerrenos(); // Cargar terrenos pendientes de aprobación
        }
      }
    };
    checkSessionAndFetchData();
  }, [supabase, router, fetchTerrenos, fetchUserProfile]);

  // ✅ Check for first visit and show welcome modal
  useEffect(() => {
    // Solo mostrar onboarding para usuarios NO admin
    if (isAdmin) return;

    // Usar email del usuario para hacer la key única por usuario
    const welcomeKey = user?.email
      ? `hasSeenWelcome_${user.email}`
      : 'hasSeenWelcome';
    const hasSeenWelcome = localStorage.getItem(welcomeKey);

    if (!hasSeenWelcome && !loading && terrenos.length >= 0 && user) {
      // Esperar un poco para que el dashboard se cargue
      setTimeout(() => {
        setShowWelcomeModal(true);
      }, 500);
    }
  }, [isAdmin, loading, terrenos.length, user]);

  // Handlers para Onboarding
  const handleStartTutorial = () => {
    setShowTutorial(true);
    const welcomeKey = user?.email
      ? `hasSeenWelcome_${user.email}`
      : 'hasSeenWelcome';
    localStorage.setItem(welcomeKey, 'true');
  };

  const handleCompleteTutorial = () => {
    setShowTutorial(false);
    alert(
      '✅ ¡Tutorial completado! Ya conoces las funcionalidades principales de PotentiaMX.',
    );
  };

  const handleSkipTutorial = () => {
    setShowTutorial(false);
  };

  const handleViewDemo = async () => {
    const welcomeKey = user?.email
      ? `hasSeenWelcome_${user.email}`
      : 'hasSeenWelcome';
    localStorage.setItem(welcomeKey, 'true');
    setShowWelcomeModal(false);

    // Buscar el tour demo personal del usuario (estilo Pixieset)
    // Es el tour precargado que el usuario puede editar
    try {
      const { data: demoTours } = await supabase
        .from('terrenos')
        .select('id')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: true })
        .limit(1);

      if (demoTours && demoTours.length > 0) {
        // Redirigir al tour demo personal (editable)
        router.push(`/terreno/${demoTours[0].id}`);
      } else {
        // Si no hay tour demo (error), solo cerrar modal
        // El usuario verá su dashboard
        console.warn('No se encontró tour demo personal');
      }
    } catch (error) {
      console.error('Error buscando tour demo:', error);
      // Solo cerrar modal, usuario quedará en dashboard
    }
  };

  const handleCloseWelcome = () => {
    setShowWelcomeModal(false);
    const welcomeKey = user?.email
      ? `hasSeenWelcome_${user.email}`
      : 'hasSeenWelcome';
    localStorage.setItem(welcomeKey, 'true');
  };

  const handleDelete = async (terrenoId) => {
    if (
      !confirm(
        '¿Estás seguro de eliminar este tour?\n\n⚠️ Esta acción eliminará:\n- El tour de tu dashboard\n- Todas las imágenes panorámicas\n- Todos los hotspots\n\nEsta acción NO se puede deshacer.',
      )
    ) {
      return;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        alert('❌ Error: No hay usuario autenticado');
        return;
      }

      const { data: terreno, error: fetchError } = await supabase
        .from('terrenos')
        .select('image_urls, cover_image_url, user_id')
        .eq('id', terrenoId)
        .single();

      if (fetchError) {
        throw new Error(`Error al obtener terreno: ${fetchError.message}`);
      }

      if (terreno.user_id !== user.id) {
        alert('❌ Error: No tienes permiso para eliminar este tour');
        return;
      }

      // Eliminar imágenes del Storage
      const filesToDelete = [];

      if (terreno?.image_urls && terreno.image_urls.length > 0) {
        terreno.image_urls.forEach((url) => {
          const parts = url.split('/tours-panoramicos/');
          if (parts[1]) {
            filesToDelete.push(parts[1]);
          }
        });
      }

      if (terreno?.cover_image_url) {
        const parts = terreno.cover_image_url.split('/tours-panoramicos/');
        if (parts[1]) {
          filesToDelete.push(parts[1]);
        }
      }

      if (filesToDelete.length > 0) {
        await supabase.storage.from('tours-panoramicos').remove(filesToDelete);
      }

      // Eliminar hotspots
      await supabase.from('hotspots').delete().eq('terreno_id', terrenoId);

      // Eliminar el terreno
      const { error: deleteError } = await supabase
        .from('terrenos')
        .delete()
        .eq('id', terrenoId);

      if (deleteError) {
        throw new Error(`Error al eliminar terreno: ${deleteError.message}`);
      }

      setTerrenos(terrenos.filter((terreno) => terreno.id !== terrenoId));
      alert('✅ Tour eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Error: ' + error.message);
    }
  };

  const handleToggleMarketplace = async (terrenoId, currentStatus) => {
    const newStatus = !currentStatus;

    try {
      const { error } = await supabase
        .from('terrenos')
        .update({
          is_marketplace_listing: newStatus,
          status: newStatus ? 'pending_approval' : 'active',
        })
        .eq('id', terrenoId);

      if (error) throw error;

      // Actualizar estado local
      setTerrenos(
        terrenos.map((t) =>
          t.id === terrenoId
            ? {
                ...t,
                is_marketplace_listing: newStatus,
                status: newStatus ? 'pending_approval' : 'active',
              }
            : t,
        ),
      );

      alert(
        newStatus
          ? '✅ Tour enviado para aprobación en Marketplace'
          : '✅ Tour removido del Marketplace',
      );
    } catch (error) {
      console.error('Error al actualizar:', error);
      alert('Error al actualizar: ' + error.message);
    }
  };

  const generateEmbedCode = (terrenoId) => {
    const embedUrl = `${window.location.origin}/embed/terreno/${terrenoId}`;
    return `<iframe src="${embedUrl}" width="100%" height="600" frameborder="0" allowfullscreen loading="lazy" title="Tour Virtual 360°"></iframe>`;
  };

  const copyEmbedCode = () => {
    const embedCode = generateEmbedCode(selectedTerrenoForEmbed.id);
    navigator.clipboard.writeText(embedCode);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const getStatusBadge = (terreno) => {
    if (terreno.is_marketplace_listing) {
      if (terreno.status === 'pending_approval') {
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">
            <Clock className="w-3 h-3" />
            Pendiente Aprobación
          </span>
        );
      } else if (terreno.status === 'active') {
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
            <CheckCircle className="w-3 h-3" />
            Publicado en Marketplace
          </span>
        );
      } else if (terreno.status === 'rejected') {
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">
            <XCircle className="w-3 h-3" />
            Rechazado
          </span>
        );
      }
    }
    return null;
  };

  // === FUNCIONES DE ADMIN ===

  // Analizar storage de Supabase
  const analyzeStorage = async () => {
    setAnalyzingStorage(true);
    setAdminMessage(null);

    try {
      // Función recursiva para analizar todas las carpetas
      const analyzeFolder = async (path = '') => {
        const { data: items, error } = await supabase.storage
          .from('tours-panoramicos')
          .list(path);

        if (error) throw error;
        if (!items) return { files: [], totalSize: 0 };

        let allFiles = [];
        let totalSize = 0;

        for (const item of items) {
          if (item.name === '.emptyFolderPlaceholder') continue;

          const fullPath = path ? `${path}/${item.name}` : item.name;

          if (item.id) {
            // Es un archivo
            const sizeInMB = (item.metadata?.size || 0) / (1024 * 1024);
            allFiles.push({
              name: item.name,
              path: fullPath,
              size: sizeInMB,
            });
            totalSize += sizeInMB;
          } else {
            // Es una carpeta, analizar recursivamente
            const subfolder = await analyzeFolder(fullPath);
            allFiles = allFiles.concat(subfolder.files);
            totalSize += subfolder.totalSize;
          }
        }

        return { files: allFiles, totalSize };
      };

      const result = await analyzeFolder();

      // Calcular tipos de archivo
      const filesByType = {};
      result.files.forEach((file) => {
        const ext = file.name.split('.').pop()?.toLowerCase() || 'unknown';
        filesByType[ext] = (filesByType[ext] || 0) + 1;
      });

      setStorageData({
        totalFiles: result.files.length,
        totalSizeMB: result.totalSize.toFixed(2),
        filesByType,
        lastAnalyzed: new Date().toLocaleString('es-MX'),
      });

      setAdminMessage({
        type: 'success',
        text: `✅ Análisis completado: ${result.files.length} archivos, ${result.totalSize.toFixed(2)} MB usados`,
      });
    } catch (error) {
      console.error('Error analizando storage:', error);
      setAdminMessage({
        type: 'error',
        text: `Error al analizar storage: ${error.message}`,
      });
    } finally {
      setAnalyzingStorage(false);
    }
  };

  // Limpiar archivos huérfanos (sin referencia en BD)
  const cleanOrphanFiles = async () => {
    if (
      !confirm(
        '⚠️ ADVERTENCIA: Esta acción eliminará archivos que NO estén referenciados en la base de datos.\n\n¿Estás seguro de continuar?\n\nEsta acción NO se puede deshacer.',
      )
    ) {
      return;
    }

    setCleaningOrphans(true);
    setAdminMessage(null);

    try {
      // 1. Obtener todas las URLs de imágenes usadas en terrenos
      const { data: allTerrenos, error: fetchError } = await supabase
        .from('terrenos')
        .select('image_urls, cover_image_url');

      if (fetchError) throw fetchError;

      const usedUrls = new Set();

      allTerrenos?.forEach((t) => {
        // Agregar image_urls
        t.image_urls?.forEach((url) => {
          const path = url.split('/tours-panoramicos/')[1];
          if (path) usedUrls.add(path);
        });

        // Agregar cover_image_url
        if (t.cover_image_url) {
          const path = t.cover_image_url.split('/tours-panoramicos/')[1];
          if (path) usedUrls.add(path);
        }
      });

      console.log(`📊 URLs en uso: ${usedUrls.size}`);

      // 2. Obtener TODOS los archivos del storage
      const getAllFiles = async (path = '') => {
        const { data: items } = await supabase.storage
          .from('tours-panoramicos')
          .list(path);

        let files = [];
        if (!items) return files;

        for (const item of items) {
          if (item.name === '.emptyFolderPlaceholder') continue;

          const fullPath = path ? `${path}/${item.name}` : item.name;

          if (item.id) {
            // Es un archivo
            files.push(fullPath);
          } else {
            // Es una carpeta
            const subFiles = await getAllFiles(fullPath);
            files = files.concat(subFiles);
          }
        }

        return files;
      };

      const allFiles = await getAllFiles();
      console.log(`📁 Archivos totales en storage: ${allFiles.length}`);

      // 3. Encontrar archivos huérfanos
      const orphanFiles = allFiles.filter((file) => !usedUrls.has(file));

      console.log(`🗑️ Archivos huérfanos encontrados: ${orphanFiles.length}`);

      if (orphanFiles.length === 0) {
        setAdminMessage({
          type: 'success',
          text: '✅ No se encontraron archivos huérfanos. Tu storage está limpio.',
        });
        setCleaningOrphans(false);
        return;
      }

      // Mostrar confirmación con detalles
      if (
        !confirm(
          `Se encontraron ${orphanFiles.length} archivos huérfanos.\n\n¿Eliminar todos estos archivos?\n\nEsta acción NO se puede deshacer.`,
        )
      ) {
        setCleaningOrphans(false);
        return;
      }

      // 4. Eliminar archivos en lotes de 100
      const batchSize = 100;
      let deletedCount = 0;

      for (let i = 0; i < orphanFiles.length; i += batchSize) {
        const batch = orphanFiles.slice(i, i + batchSize);
        const { error } = await supabase.storage
          .from('tours-panoramicos')
          .remove(batch);

        if (!error) {
          deletedCount += batch.length;
        } else {
          console.error('Error eliminando batch:', error);
        }
      }

      setAdminMessage({
        type: 'success',
        text: `✅ Limpieza completada: ${deletedCount} archivos eliminados`,
      });

      // Reanalizar storage
      setTimeout(() => analyzeStorage(), 1000);
    } catch (error) {
      console.error('Error limpiando archivos:', error);
      setAdminMessage({
        type: 'error',
        text: `Error al limpiar archivos: ${error.message}`,
      });
    } finally {
      setCleaningOrphans(false);
    }
  };

  // Cargar estadísticas del sistema (solo admin)
  const loadSystemStats = async () => {
    setLoadingStats(true);
    try {
      // 1. Contar total de usuarios únicos (de auth.users vía user_profiles)
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('id');

      if (profilesError) throw profilesError;

      const totalUsers = profiles?.length || 0;

      // 2. Contar total de terrenos de TODOS los usuarios
      const { data: allTerrenos, error: terrenosError } = await supabase
        .from('terrenos')
        .select('id, image_urls, cover_image_url');

      if (terrenosError) throw terrenosError;

      const totalTerrenos = allTerrenos?.length || 0;

      // 3. Contar total de imágenes
      let totalImages = 0;
      allTerrenos?.forEach((terreno) => {
        if (terreno.image_urls) {
          totalImages += terreno.image_urls.length;
        }
        if (terreno.cover_image_url) {
          totalImages += 1;
        }
      });

      // 4. Obtener límite de storage de Supabase
      // Plan Free: 1 GB = 1024 MB
      // Plan Pro: 100 GB = 102400 MB
      // Por ahora asumimos Free, puedes cambiarlo manualmente
      const storageLimitMB = 1024; // 1 GB para plan free

      setSystemStats({
        totalUsers,
        totalTerrenos,
        totalImages,
        storageLimitMB,
        lastUpdated: new Date().toLocaleString('es-MX'),
      });
    } catch (error) {
      console.error('Error cargando estadísticas del sistema:', error);
      setAdminMessage({
        type: 'error',
        text: `Error al cargar estadísticas: ${error.message}`,
      });
    } finally {
      setLoadingStats(false);
    }
  };

  // Cargar terrenos pendientes de aprobación (solo admin)
  const loadPendingTerrenos = async () => {
    setLoadingPending(true);
    try {
      // Cargar terrenos pendientes
      const { data: terrenosData, error } = await supabase
        .from('terrenos')
        .select('*')
        .eq('is_marketplace_listing', true)
        .eq('status', 'pending_approval')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Para cada terreno, obtener el email del usuario usando la función RPC
      const terrenosConEmail = await Promise.all(
        (terrenosData || []).map(async (terreno) => {
          // Usar función RPC para obtener el email (solo funciona si eres admin)
          const { data: userEmail, error: emailError } = await supabase.rpc(
            'get_user_email',
            { user_uuid: terreno.user_id },
          );

          return {
            ...terreno,
            user_email: userEmail || 'Usuario desconocido',
          };
        }),
      );

      setPendingTerrenos(terrenosConEmail);
    } catch (error) {
      console.error('Error cargando terrenos pendientes:', error);
      setAdminMessage({
        type: 'error',
        text: `Error al cargar terrenos pendientes: ${error.message}`,
      });
    } finally {
      setLoadingPending(false);
    }
  };

  // Aprobar terreno para marketplace
  const approveTerrenoForMarketplace = async (terrenoId) => {
    if (!confirm('¿Aprobar este tour para publicación en Marketplace?')) {
      return;
    }

    setApprovingId(terrenoId);
    try {
      const { error } = await supabase
        .from('terrenos')
        .update({ status: 'active' })
        .eq('id', terrenoId);

      if (error) throw error;

      // Actualizar la lista de pendientes
      setPendingTerrenos(pendingTerrenos.filter((t) => t.id !== terrenoId));

      setAdminMessage({
        type: 'success',
        text: '✅ Tour aprobado y publicado en Marketplace',
      });
    } catch (error) {
      console.error('Error aprobando terreno:', error);
      setAdminMessage({
        type: 'error',
        text: `Error al aprobar: ${error.message}`,
      });
    } finally {
      setApprovingId(null);
    }
  };

  // Rechazar terreno para marketplace
  const rejectTerrenoForMarketplace = async (terrenoId) => {
    const reason = prompt('Motivo del rechazo (opcional):');

    if (!confirm('¿Rechazar este tour del Marketplace?')) {
      return;
    }

    setApprovingId(terrenoId);
    try {
      const { error } = await supabase
        .from('terrenos')
        .update({
          status: 'rejected',
          is_marketplace_listing: false, // Desactivar marketplace
        })
        .eq('id', terrenoId);

      if (error) throw error;

      // Actualizar la lista de pendientes
      setPendingTerrenos(pendingTerrenos.filter((t) => t.id !== terrenoId));

      setAdminMessage({
        type: 'success',
        text: `✅ Tour rechazado${reason ? `: ${reason}` : ''}`,
      });
    } catch (error) {
      console.error('Error rechazando terreno:', error);
      setAdminMessage({
        type: 'error',
        text: `Error al rechazar: ${error.message}`,
      });
    } finally {
      setApprovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-600 text-lg">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-sm bg-white/90">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-8">
            {/* Logo y Info */}
            <div className="flex items-center gap-6">
              <Link href="/" className="group">
                <h1 className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-slate-700 transition-colors">
                  Potentia
                  <span className="text-teal-500 group-hover:text-teal-600">
                    MX
                  </span>
                </h1>
              </Link>
              {userProfile && (
                <div className="hidden md:block text-sm text-slate-600">
                  Plan:{' '}
                  <span className="font-semibold capitalize">
                    {userProfile.subscription_plan}
                  </span>{' '}
                  • Tours:{' '}
                  <span className="font-semibold">
                    {terrenos.length}/{userProfile.max_tours}
                  </span>
                </div>
              )}
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-100 font-medium rounded-lg transition-colors"
              >
                <Home className="w-4 h-4" />
                Inicio
              </Link>
              <Link
                href="/propiedades"
                className="inline-flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-100 font-medium rounded-lg transition-colors"
              >
                <Store className="w-4 h-4" />
                Propiedades
              </Link>
            </nav>

            {/* User Info */}
            {user && (
              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 text-white font-bold text-sm">
                  {user.user_metadata?.full_name
                    ? user.user_metadata.full_name.charAt(0).toUpperCase()
                    : user.email?.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-900">
                    {user.user_metadata?.full_name || 'Usuario'}
                  </span>
                  <span className="text-xs text-slate-500">{user.email}</span>
                </div>
              </div>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>

          {/* Mobile User Info */}
          {userProfile && (
            <div className="md:hidden mt-3 text-sm text-slate-600">
              Plan:{' '}
              <span className="font-semibold capitalize">
                {userProfile.subscription_plan}
              </span>{' '}
              • Tours:{' '}
              <span className="font-semibold">
                {terrenos.length}/{userProfile.max_tours}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Impersonation Banner */}
      <AdminImpersonateBanner />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Admin Section con Tabs */}
        {isAdmin && (
          <div className="mb-8">
            {/* Tab Navigation */}
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-2 mb-6 flex gap-2">
              <button
                onClick={() => setAdminActiveTab('supervision')}
                className={`flex-1 px-6 py-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                  adminActiveTab === 'supervision'
                    ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                📊 Supervisión
              </button>
              <button
                onClick={() => setAdminActiveTab('documentation')}
                className={`flex-1 px-6 py-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                  adminActiveTab === 'documentation'
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                📚 Documentación
              </button>
              <button
                onClick={() => setAdminActiveTab('logs')}
                className={`flex-1 px-6 py-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
                  adminActiveTab === 'logs'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                📜 Logs & Auditoría
              </button>
            </div>

            {/* Tab Content - Supervisión */}
            {adminActiveTab === 'supervision' && (
              <div>
                {/* Estadísticas del Sistema */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">
                          Usuarios Activos
                        </p>
                        <p className="text-2xl font-bold text-slate-900">
                          {loadingStats ? '...' : systemStats?.totalUsers || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Home className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Total Terrenos</p>
                        <p className="text-2xl font-bold text-slate-900">
                          {loadingStats
                            ? '...'
                            : systemStats?.totalTerrenos || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <FileImage className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Total Imágenes</p>
                        <p className="text-2xl font-bold text-slate-900">
                          {loadingStats ? '...' : systemStats?.totalImages || 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <HardDrive className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Almacenamiento</p>
                        <p className="text-2xl font-bold text-slate-900">
                          {loadingStats || !storageData
                            ? '...'
                            : `${storageData.totalSizeMB} MB`}
                        </p>
                        {systemStats && storageData && (
                          <p className="text-xs text-slate-500">
                            de {systemStats.storageLimitMB} MB
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Barra de progreso de almacenamiento */}
                {systemStats && storageData && (
                  <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-slate-700">
                        Uso de Almacenamiento
                      </h3>
                      <span className="text-sm text-slate-600">
                        {(
                          (parseFloat(storageData.totalSizeMB) /
                            systemStats.storageLimitMB) *
                          100
                        ).toFixed(1)}
                        % usado
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-teal-500 to-teal-600 transition-all duration-500"
                        style={{
                          width: `${Math.min((parseFloat(storageData.totalSizeMB) / systemStats.storageLimitMB) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      {storageData.totalSizeMB} MB de{' '}
                      {systemStats.storageLimitMB} MB disponibles
                      {systemStats.storageLimitMB === 1024 && ' (Plan Free)'}
                    </p>
                  </div>
                )}

                <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl shadow-lg p-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Herramientas de Gestión
                      </h2>
                      <p className="text-red-100 text-sm">
                        Analiza y limpia el almacenamiento de archivos
                      </p>
                    </div>
                  </div>

                  {/* Admin Message */}
                  {adminMessage && (
                    <div
                      className={`mb-4 p-4 rounded-lg border-2 flex items-start gap-3 ${
                        adminMessage.type === 'success'
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      {adminMessage.type === 'success' ? (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      )}
                      <p
                        className={`text-sm font-medium flex-1 ${
                          adminMessage.type === 'success'
                            ? 'text-green-900'
                            : 'text-red-900'
                        }`}
                      >
                        {adminMessage.text}
                      </p>
                      <button
                        onClick={() => setAdminMessage(null)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Admin Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Refresh Stats */}
                    <button
                      onClick={() => {
                        loadSystemStats();
                        analyzeStorage();
                      }}
                      disabled={loadingStats || analyzingStorage}
                      className="flex items-center gap-3 px-6 py-4 bg-white/95 hover:bg-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                    >
                      <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {loadingStats || analyzingStorage ? (
                          <RefreshCw className="w-5 h-5 text-teal-600 animate-spin" />
                        ) : (
                          <BarChart3 className="w-5 h-5 text-teal-600" />
                        )}
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-semibold text-slate-900">
                          {loadingStats || analyzingStorage
                            ? 'Actualizando...'
                            : 'Actualizar Datos'}
                        </p>
                        <p className="text-xs text-slate-600">
                          Refrescar estadísticas del sistema
                        </p>
                      </div>
                    </button>

                    {/* Analyze Storage */}
                    <button
                      onClick={analyzeStorage}
                      disabled={analyzingStorage}
                      className="flex items-center gap-3 px-6 py-4 bg-white/95 hover:bg-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {analyzingStorage ? (
                          <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
                        ) : (
                          <Database className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-semibold text-slate-900">
                          {analyzingStorage
                            ? 'Analizando...'
                            : 'Analizar Storage'}
                        </p>
                        <p className="text-xs text-slate-600">
                          {storageData
                            ? `${storageData.totalFiles} archivos • ${storageData.totalSizeMB} MB`
                            : 'Ver uso de almacenamiento'}
                        </p>
                      </div>
                    </button>

                    {/* Clean Orphan Files */}
                    <button
                      onClick={cleanOrphanFiles}
                      disabled={cleaningOrphans}
                      className="flex items-center gap-3 px-6 py-4 bg-white/95 hover:bg-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                    >
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {cleaningOrphans ? (
                          <RefreshCw className="w-5 h-5 text-red-600 animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-semibold text-slate-900">
                          {cleaningOrphans
                            ? 'Limpiando...'
                            : 'Limpiar Archivos Huérfanos'}
                        </p>
                        <p className="text-xs text-slate-600">
                          Elimina imágenes sin referencia en BD
                        </p>
                      </div>
                    </button>
                  </div>

                  {/* Storage Details */}
                  {storageData && (
                    <div className="mt-4 p-4 bg-white/95 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <HardDrive className="w-4 h-4 text-slate-600" />
                        <h3 className="font-semibold text-slate-900">
                          Detalle de Almacenamiento
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-slate-600">
                            Total Archivos
                          </p>
                          <p className="text-lg font-bold text-slate-900">
                            {storageData.totalFiles}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600">Tamaño Total</p>
                          <p className="text-lg font-bold text-slate-900">
                            {storageData.totalSizeMB} MB
                          </p>
                        </div>
                        {Object.entries(storageData.filesByType).map(
                          ([ext, count]) => (
                            <div key={ext}>
                              <p className="text-xs text-slate-600 uppercase">
                                .{ext}
                              </p>
                              <p className="text-lg font-bold text-slate-900">
                                {count}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-3">
                        Último análisis: {storageData.lastAnalyzed}
                      </p>
                    </div>
                  )}
                </div>

                {/* Panel de Aprobación de Marketplace */}
                <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                        <Store className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">
                          Aprobación de Marketplace
                        </h2>
                        <p className="text-green-100 text-sm">
                          Revisa y aprueba tours para publicación pública
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={loadPendingTerrenos}
                      disabled={loadingPending}
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingPending ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                      ) : (
                        <RefreshCw className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {loadingPending ? (
                    <div className="bg-white/95 rounded-lg p-8 text-center">
                      <div className="inline-block w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                      <p className="text-slate-600">Cargando pendientes...</p>
                    </div>
                  ) : pendingTerrenos.length === 0 ? (
                    <div className="bg-white/95 rounded-lg p-8 text-center">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">
                        Sin tours pendientes
                      </h3>
                      <p className="text-slate-600 text-sm">
                        No hay tours esperando aprobación en este momento
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingTerrenos.map((terreno) => (
                        <div
                          key={terreno.id}
                          className="bg-white rounded-xl shadow-md p-5 flex items-start gap-4"
                        >
                          {/* Imagen en miniatura */}
                          {(terreno.cover_image_url ||
                            terreno.image_urls?.[0]) && (
                            <div className="relative w-24 h-24 flex-shrink-0 bg-slate-100 rounded-lg overflow-hidden">
                              <Image
                                src={
                                  terreno.cover_image_url ||
                                  terreno.image_urls[0]
                                }
                                alt={terreno.title}
                                fill
                                sizes="96px"
                                className="object-cover"
                              />
                            </div>
                          )}

                          {/* Información */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-lg font-bold text-slate-900 mb-1 truncate">
                              {terreno.title}
                            </h4>
                            <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                              {terreno.description || 'Sin descripción'}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {terreno.user_email || 'Usuario desconocido'}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(
                                  terreno.created_at,
                                ).toLocaleDateString('es-MX')}
                              </span>
                            </div>
                          </div>

                          {/* Acciones */}
                          <div className="flex flex-col gap-2">
                            <Link
                              href={`/terreno/${terreno.id}`}
                              target="_blank"
                              className="inline-flex items-center justify-center gap-1 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              Vista previa
                            </Link>
                            <button
                              onClick={() =>
                                approveTerrenoForMarketplace(terreno.id)
                              }
                              disabled={approvingId === terreno.id}
                              className="inline-flex items-center justify-center gap-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {approvingId === terreno.id ? (
                                <>
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                  Aprobando...
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4" />
                                  Aprobar
                                </>
                              )}
                            </button>
                            <button
                              onClick={() =>
                                rejectTerrenoForMarketplace(terreno.id)
                              }
                              disabled={approvingId === terreno.id}
                              className="inline-flex items-center justify-center gap-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {approvingId === terreno.id ? (
                                <>
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                  Procesando...
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-4 h-4" />
                                  Rechazar
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tours Oficiales de Potentia MX */}
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg p-6 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                        <Home className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-white">
                        <h3 className="text-xl font-bold">
                          Tours Oficiales de Potentia MX
                        </h3>
                        <p className="text-blue-100 text-sm">
                          Tours de demostración y ejemplos para clientes
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
                    <div className="grid md:grid-cols-3 gap-4 text-white">
                      <div>
                        <p className="text-sm text-blue-100">Usuario Interno</p>
                        <p className="font-bold">tours@potentiamx.com</p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-100">Tours Activos</p>
                        <p className="font-bold">2 demos oficiales</p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-100">Plan</p>
                        <p className="font-bold">Premium (Ilimitado)</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <a
                      href="/login"
                      target="_blank"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-all shadow-md hover:shadow-lg"
                    >
                      🎭 Gestionar Tours Oficiales
                    </a>
                    <button
                      onClick={() => {
                        alert(
                          'Para gestionar los tours oficiales:\n\n1. Haz clic en "Gestionar Tours Oficiales"\n2. Inicia sesión con: tours@potentiamx.com\n3. Gestiona los tours normalmente\n4. Cuando termines, cierra sesión y vuelve a entrar como admin',
                        );
                      }}
                      className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold rounded-lg transition-all"
                    >
                      ℹ️ Cómo funciona
                    </button>
                  </div>

                  <div className="mt-3 p-3 bg-yellow-500/20 backdrop-blur-sm rounded-lg border border-yellow-400/30">
                    <p className="text-sm text-yellow-100">
                      💡 <strong>Tip:</strong> Los tours de este usuario se
                      mostrarán en el marketplace con badge "DEMO OFICIAL" y se
                      usan como ejemplos para clientes potenciales.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab Content - Documentación */}
            {adminActiveTab === 'documentation' && <DocumentationTab />}

            {/* Tab Content - Logs */}
            {adminActiveTab === 'logs' && <LogsTab />}
          </div>
        )}

        {/* Actions Bar - Solo para usuarios NO admin */}
        {!isAdmin && (
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Mis Tours 360°
              </h2>
              <p className="text-slate-600 mt-1">
                Lienzos perfectos para tu próximo proyecto
              </p>
            </div>
            <Link
              href="/dashboard/add-terrain"
              data-tutorial="add-terrain-button"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Crear Tour 360°
            </Link>
          </div>
        )}

        {/* Tours Grid - Solo para usuarios NO admin */}
        {!isAdmin &&
          (terrenos.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-slate-300">
              <div className="text-slate-400 text-6xl mb-4">📸</div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                No tienes tours creados
              </h3>
              <p className="text-slate-500 mb-6">
                Crea tu primer tour 360° y empieza a mostrar tus propiedades
              </p>
              <Link
                href="/dashboard/add-terrain"
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                Crear Primer Tour
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {terrenos.map((terreno, index) => (
                <div
                  key={terreno.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-slate-200"
                >
                  {/* Imagen - Clickeable */}
                  {(terreno.cover_image_url || terreno.image_urls) &&
                    (terreno.cover_image_url ||
                      terreno.image_urls.length > 0) && (
                      <Link href={`/terreno/${terreno.id}`} className="block">
                        <div className="relative w-full h-48 bg-slate-100 cursor-pointer group">
                          <Image
                            src={
                              terreno.cover_image_url || terreno.image_urls[0]
                            }
                            alt={terreno.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {getStatusBadge(terreno) && (
                            <div className="absolute top-3 right-3">
                              {getStatusBadge(terreno)}
                            </div>
                          )}
                        </div>
                      </Link>
                    )}

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1">
                      {terreno.title}
                    </h3>
                    {terreno.description && (
                      <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                        {terreno.description}
                      </p>
                    )}

                    {/* Marketplace Toggle */}
                    <div
                      data-tutorial={
                        index === 0 ? 'marketplace-toggle' : undefined
                      }
                      className="mb-4 pb-4 border-b border-slate-200"
                    >
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={terreno.is_marketplace_listing || false}
                          onChange={() =>
                            handleToggleMarketplace(
                              terreno.id,
                              terreno.is_marketplace_listing,
                            )
                          }
                          className="w-4 h-4 text-teal-500 border-slate-300 rounded focus:ring-teal-500"
                        />
                        <span className="text-sm text-slate-700">
                          Publicar en Marketplace
                        </span>
                      </label>
                    </div>

                    {/* Actions - Reorganizadas para mejor UX */}
                    <div className="space-y-2">
                      {/* Acciones Principales - Más grandes y destacadas */}
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href={`/dashboard/edit-terrain/${terreno.id}`}
                          data-tutorial={
                            index === 0 ? 'edit-button' : undefined
                          }
                          className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                        >
                          <Edit className="w-4 h-4" />
                          Editar
                        </Link>
                        <Link
                          href={`/terreno/${terreno.id}/editor`}
                          data-tutorial={
                            index === 0 ? 'hotspots-button' : undefined
                          }
                          className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                        >
                          <Target className="w-4 h-4" />
                          Hotspots
                        </Link>
                      </div>

                      {/* Acciones Secundarias */}
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href={`/terreno/${terreno.id}`}
                          data-tutorial={
                            index === 0 ? 'view-button' : undefined
                          }
                          className="inline-flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-medium rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Ver
                        </Link>
                        <button
                          onClick={() => {
                            setSelectedTerrenoForEmbed(terreno);
                            setEmbedModalOpen(true);
                          }}
                          data-tutorial={
                            index === 0 ? 'embed-button' : undefined
                          }
                          className="inline-flex items-center justify-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors"
                        >
                          <Code className="w-4 h-4" />
                          Embed
                        </button>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(terreno.id)}
                        className="w-full inline-flex items-center justify-center gap-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-medium rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
      </main>

      {/* Embed Modal */}
      {embedModalOpen && selectedTerrenoForEmbed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">
                Código Embed
              </h3>
              <button
                onClick={() => {
                  setEmbedModalOpen(false);
                  setCopySuccess(false);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <p className="text-slate-600 mb-4">
              Copia este código y pégalo en tu sitio web para embeber el tour
              360°:
            </p>

            <div className="bg-slate-900 rounded-lg p-4 mb-4 relative">
              <code className="text-sm text-green-400 font-mono break-all">
                {generateEmbedCode(selectedTerrenoForEmbed.id)}
              </code>
            </div>

            <div className="flex gap-3">
              <button
                onClick={copyEmbedCode}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg transition-colors"
              >
                {copySuccess ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    ¡Copiado!
                  </>
                ) : (
                  <>
                    <Share2 className="w-5 h-5" />
                    Copiar Código
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setEmbedModalOpen(false);
                  setCopySuccess(false);
                }}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
              >
                Cerrar
              </button>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-purple-900 mb-1">
                    🎯 ¿Cómo se verá en tu sitio web?
                  </p>
                  <p className="text-xs text-purple-700">
                    Mira ejemplos y copia el código responsive
                  </p>
                </div>
                <Link
                  href={`/demo-embed/${selectedTerrenoForEmbed.id}`}
                  target="_blank"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                  <Eye className="w-4 h-4" />
                  Ver Demo
                </Link>
              </div>
            </div>

            <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                💡 <strong>Vista previa rápida:</strong>{' '}
                <a
                  href={`${window.location.origin}/embed/terreno/${selectedTerrenoForEmbed.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-600"
                >
                  Ver solo el tour
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Onboarding Tutorial System */}
      {!isAdmin && (
        <>
          {/* Welcome Modal - Shown on first visit */}
          {showWelcomeModal && (
            <WelcomeModal
              onStartTutorial={handleStartTutorial}
              onViewDemo={handleViewDemo}
              onClose={handleCloseWelcome}
              userName={user?.user_metadata?.full_name}
            />
          )}

          {/* Tutorial with step-by-step guidance */}
          {showTutorial && (
            <OnboardingTutorial
              steps={dashboardTutorialSteps}
              onComplete={handleCompleteTutorial}
              onSkip={handleSkipTutorial}
            />
          )}

          {/* Help Button - Always visible */}
          <HelpButton
            onStartTutorial={handleStartTutorial}
            onViewDemo={handleViewDemo}
          />
        </>
      )}
    </div>
  );
}
