'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Eye,
  Clock,
  Flame,
  MessageCircle,
  TrendingUp,
  TrendingDown,
  Lock,
  ArrowLeft,
  Briefcase,
  Users,
  Landmark,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { createClient } from '@/lib/supabaseClient';
import { cn } from '@/lib/utils';

type PropertyType = 'terreno' | 'casa' | 'departamento';
type TimeRange = '7d' | '30d' | 'all';

// Adaptive content configuration based on property type
const PROPERTY_CONFIG = {
  terreno: {
    hotLeadsLabel: 'Inversionistas Potenciales',
    hotLeadsIcon: Briefcase,
    hotLeadsColor: 'bg-amber-50',
    hotLeadsIconColor: 'text-amber-600',
    heatmapTitle: '¿Qué ángulos enamoran más?',
    heatmapDescription: 'Vistas más observadas por tiempo de permanencia',
    topInsight:
      '💡 Sugerencia: La vista aérea es tu mayor gancho. Úsala en tus campañas de Instagram Ads.',
    scenes: [
      { name: 'Vista Aérea (Drone)', views: 312, percentage: 100 },
      { name: 'Vista Panorámica/Horizonte', views: 267, percentage: 86 },
      { name: 'Plataforma de Construcción', views: 198, percentage: 63 },
      { name: 'Acceso Principal', views: 176, percentage: 56 },
      { name: 'Colindancias/Vecinos', views: 145, percentage: 46 },
      { name: 'Servicios Cercanos', views: 98, percentage: 31 },
    ],
  },
  casa: {
    hotLeadsLabel: 'Clientes Muy Interesados',
    hotLeadsIcon: Flame,
    hotLeadsColor: 'bg-orange-50',
    hotLeadsIconColor: 'text-orange-600',
    heatmapTitle: '¿Qué enamora más a tus clientes?',
    heatmapDescription: 'Espacios más visitados y tiempo de permanencia',
    topInsight: '💡 Sugerencia: Sube esta foto a tu portada de Facebook.',
    scenes: [
      { name: 'Cocina Integral', views: 245, percentage: 100 },
      { name: 'Jardín Posterior', views: 198, percentage: 81 },
      { name: 'Recámara Principal', views: 187, percentage: 76 },
      { name: 'Sala de Estar', views: 156, percentage: 64 },
      { name: 'Baño Principal', views: 134, percentage: 55 },
      { name: 'Estacionamiento', views: 89, percentage: 36 },
    ],
  },
  departamento: {
    hotLeadsLabel: 'Familias Interesadas',
    hotLeadsIcon: Users,
    hotLeadsColor: 'bg-indigo-50',
    hotLeadsIconColor: 'text-indigo-600',
    heatmapTitle: '¿Qué espacios destacan más?',
    heatmapDescription: 'Áreas más atractivas para tus compradores',
    topInsight:
      '💡 Sugerencia: La vista desde el balcón vende. Destácala en MercadoLibre.',
    scenes: [
      { name: 'Vista desde el Balcón', views: 289, percentage: 100 },
      { name: 'Cocina Moderna', views: 234, percentage: 81 },
      { name: 'Recámara Principal', views: 201, percentage: 70 },
      { name: 'Baño Completo', views: 178, percentage: 62 },
      { name: 'Sala-Comedor', views: 156, percentage: 54 },
      { name: 'Amenidades del Edificio', views: 123, percentage: 43 },
    ],
  },
};

// Interface for analytics data from API
interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  avgTimeSpent: string;
  hotLeads: number;
  conversions: number;
  dailyViews: Array<{
    date: string;
    views: number;
    uniqueVisitors: number;
  }>;
  sceneMetrics: Array<{
    name: string;
    views: number;
    avgTime: number;
    percentage: number;
  }>;
  trends: {
    viewsTrend: number | null;
    avgTimeTrend: number | null;
    hotLeadsTrend: number | null;
    conversionsTrend: number | null;
  };
}

interface KPICardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  suffix?: string;
  trend?: number | null;
  trendLabel?: string;
  color: string;
  isLoading?: boolean;
  isBlurred?: boolean;
}

function KPICard({
  icon,
  label,
  value,
  suffix = '',
  trend,
  trendLabel,
  color,
  isLoading,
  isBlurred,
}: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isLoading || typeof value !== 'number') return;

    let start = 0;
    const end = value;
    const duration = 1500;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setDisplayValue(end);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, isLoading]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="h-10 w-10 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-32 mb-3"></div>
          <div className="h-10 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden',
        isBlurred && 'filter blur-sm pointer-events-none'
      )}
    >
      <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center mb-4', color)}>
        {icon}
      </div>

      <p className="text-sm text-gray-600 font-medium mb-1">{label}</p>

      <motion.div
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="text-4xl font-bold text-gray-900 mb-2"
      >
        {typeof value === 'number' ? displayValue.toLocaleString() : value}
        {suffix && <span className="text-2xl text-gray-500 ml-1">{suffix}</span>}
      </motion.div>

      {trend !== undefined && trend !== null && (
        <div className="flex items-center gap-1">
          {trend > 0 ? (
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          ) : trend < 0 ? (
            <TrendingDown className="w-4 h-4 text-red-500" />
          ) : (
            <span className="w-4 h-4 text-gray-400">—</span>
          )}
          <span
            className={cn(
              'text-sm font-semibold',
              trend > 0 ? 'text-emerald-600' : trend < 0 ? 'text-red-600' : 'text-gray-600'
            )}
          >
            {trend > 0 ? '+' : ''}
            {trend}%
          </span>
          {trendLabel && <span className="text-xs text-gray-500 ml-1">{trendLabel}</span>}
        </div>
      )}
    </motion.div>
  );
}

function PaywallOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center z-10 rounded-xl"
    >
      <Lock className="w-16 h-16 text-gray-400 mb-4" />
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        Inteligencia de Ventas Bloqueada
      </h3>
      <p className="text-gray-600 mb-6 text-center max-w-sm">
        Descubre qué enamora a tus clientes y recibe recomendaciones personalizadas
      </p>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-shadow"
      >
        🔓 Desbloquear Inteligencia de Ventas (Upgrade)
      </motion.button>
    </motion.div>
  );
}

export default function AnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [isLoading, setIsLoading] = useState(true);
  const [terrain, setTerrain] = useState<any>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Simulated user plan - Change to true to unlock premium features
  const isPro = false;

  const supabase = useMemo(() => createClient(), []);

  // Load terrain data
  useEffect(() => {
    const loadTerrain = async () => {
      try {
        const { data, error } = await supabase
          .from('terrenos')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        setTerrain(data);
      } catch (error) {
        console.error('Error loading terrain:', error);
        setError('No se pudo cargar la propiedad');
      }
    };

    loadTerrain();
  }, [slug, supabase]);

  // Load analytics data from API
  useEffect(() => {
    const loadAnalytics = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/analytics/${slug}?timeRange=${timeRange}`);

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data: AnalyticsData = await response.json();
        setAnalyticsData(data);
      } catch (error) {
        console.error('Error loading analytics:', error);
        setError(
          error instanceof Error ? error.message : 'Error al cargar los datos de analytics'
        );
        // Set default empty data on error
        setAnalyticsData({
          totalViews: 0,
          uniqueVisitors: 0,
          avgTimeSpent: '0:00',
          hotLeads: 0,
          conversions: 0,
          dailyViews: [],
          sceneMetrics: [],
          trends: {
            viewsTrend: null,
            avgTimeTrend: null,
            hotLeadsTrend: null,
            conversionsTrend: null,
          },
        });
      } finally {
        setTimeout(() => setIsLoading(false), 500);
      }
    };

    if (slug) {
      loadAnalytics();
    }
  }, [slug, timeRange]);

  // Get property type from terrain data (default to 'terreno')
  const propertyType: PropertyType = terrain?.property_type || 'terreno';
  const config = PROPERTY_CONFIG[propertyType];

  // Extract data from analytics response
  const totalViews = analyticsData?.totalViews || 0;
  const uniqueVisitors = analyticsData?.uniqueVisitors || 0;
  const avgTimeSpent = analyticsData?.avgTimeSpent || '0:00';
  const hotLeads = analyticsData?.hotLeads || 0;
  const conversions = analyticsData?.conversions || 0;
  const dailyViews = analyticsData?.dailyViews || [];
  const sceneMetrics = analyticsData?.sceneMetrics || [];

  // Extract trend data (real comparison with previous period)
  const viewsTrend = analyticsData?.trends?.viewsTrend ?? null;
  const avgTimeTrend = analyticsData?.trends?.avgTimeTrend ?? null;
  const hotLeadsTrend = analyticsData?.trends?.hotLeadsTrend ?? null;
  const conversionsTrend = analyticsData?.trends?.conversionsTrend ?? null;

  // Get property type label in Spanish
  const propertyTypeLabel = {
    terreno: 'Terreno',
    casa: 'Casa',
    departamento: 'Departamento',
  }[propertyType];

  // Get trend label based on time range
  const trendLabel = {
    '7d': 'vs 7 días anteriores',
    '30d': 'vs 30 días anteriores',
    all: 'vs periodo anterior',
  }[timeRange];

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Rendimiento de {isLoading ? '...' : terrain?.title || 'Propiedad'}
                  </h1>
                  {!isLoading && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                      {propertyTypeLabel}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  Centro de comando de ventas inmobiliarias
                </p>
              </div>
            </div>

            {/* Time Range Selector */}
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setTimeRange('7d')}
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-medium transition-all',
                  timeRange === '7d'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                7 días
              </button>
              <button
                onClick={() => setTimeRange('30d')}
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-medium transition-all',
                  timeRange === '30d'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                30 días
              </button>
              <button
                onClick={() => setTimeRange('all')}
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-medium transition-all',
                  timeRange === 'all'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                Todo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && !isLoading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="text-sm font-semibold text-yellow-800">
                Problema al cargar analytics
              </p>
              <p className="text-xs text-yellow-700 mt-1">{error}</p>
              <p className="text-xs text-yellow-600 mt-2">
                Mostrando valores por defecto. Verifica tu configuración de PostHog en .env.local
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            icon={<Eye className="w-6 h-6 text-blue-600" />}
            label="Visitas Virtuales"
            value={totalViews}
            trend={viewsTrend}
            trendLabel={trendLabel}
            color="bg-blue-50"
            isLoading={isLoading}
          />

          <KPICard
            icon={<Clock className="w-6 h-6 text-purple-600" />}
            label="Tiempo Promedio de Enamoramiento"
            value={avgTimeSpent}
            suffix="min"
            trend={avgTimeTrend}
            trendLabel={trendLabel}
            color="bg-purple-50"
            isLoading={isLoading}
          />

          <KPICard
            icon={
              <config.hotLeadsIcon className={cn('w-6 h-6', config.hotLeadsIconColor)} />
            }
            label={config.hotLeadsLabel}
            value={hotLeads}
            trend={hotLeadsTrend}
            trendLabel={trendLabel}
            color={config.hotLeadsColor}
            isLoading={isLoading}
            isBlurred={!isPro}
          />

          <KPICard
            icon={<MessageCircle className="w-6 h-6 text-emerald-600" />}
            label="Intención de Compra"
            value={conversions}
            trend={conversionsTrend}
            trendLabel={trendLabel}
            color="bg-emerald-50"
            isLoading={isLoading}
          />
        </div>

        {/* Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            Tendencia de Visitas
          </h2>

          {isLoading ? (
            <div className="h-80 animate-pulse bg-gray-100 rounded-lg"></div>
          ) : dailyViews.length === 0 ? (
            <div className="h-80 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <p className="text-lg mb-2">📊 Sin datos disponibles</p>
                <p className="text-sm">Aún no hay visitas registradas para este período</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={dailyViews}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorViews)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Heatmap - Adaptive based on property type */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative"
        >
          {!isPro && <PaywallOverlay />}

          <div className={cn(!isPro && 'filter blur-md')}>
            <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              <config.hotLeadsIcon className={cn('w-5 h-5', config.hotLeadsIconColor)} />
              {config.heatmapTitle}
            </h2>
            <p className="text-sm text-gray-600 mb-6">{config.heatmapDescription}</p>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-12 bg-gray-100 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : sceneMetrics.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                <p className="text-lg mb-2">🎬 Sin datos de escenas</p>
                <p className="text-sm">
                  Aún no hay suficientes datos para mostrar métricas por escena
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sceneMetrics.map((scene, index) => (
                  <motion.div
                    key={scene.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {scene.name}
                      </span>
                      <span className="text-sm text-gray-600">{scene.views} vistas</span>
                    </div>
                    <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${scene.percentage}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className={cn(
                          'h-full rounded-full',
                          index === 0
                            ? 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                            : index === 1
                              ? 'bg-gradient-to-r from-blue-400 to-blue-500'
                              : 'bg-gradient-to-r from-gray-300 to-gray-400'
                        )}
                      />
                    </div>
                    {index === 0 && sceneMetrics.length > 0 && (
                      <p className="text-xs text-emerald-600 mt-2 font-medium">
                        💡 Sugerencia: "{scene.name}" es tu escena más popular con{' '}
                        {scene.views} vistas. Úsala en tus campañas de marketing.
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
