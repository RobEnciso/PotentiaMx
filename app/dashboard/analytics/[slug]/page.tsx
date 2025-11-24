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

// Generate mock data - Replace with real PostHog data later
const generateMockData = () => {
  const daysData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000)
      .toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })
      .replace('.', ''),
    views: Math.floor(Math.random() * 50) + 10,
    uniqueVisitors: Math.floor(Math.random() * 30) + 5,
  }));

  return { daysData };
};

interface KPICardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  suffix?: string;
  trend?: number;
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

      {trend !== undefined && (
        <div className="flex items-center gap-1">
          {trend > 0 ? (
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
          <span
            className={cn(
              'text-sm font-semibold',
              trend > 0 ? 'text-emerald-600' : 'text-red-600'
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

  // Simulated user plan - Change to true to unlock premium features
  const isPro = false;

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const loadTerrain = async () => {
      setIsLoading(true);
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
      } finally {
        setTimeout(() => setIsLoading(false), 800);
      }
    };

    loadTerrain();
  }, [slug, supabase]);

  // Get property type from terrain data (default to 'terreno')
  const propertyType: PropertyType = terrain?.property_type || 'terreno';
  const config = PROPERTY_CONFIG[propertyType];

  const { daysData } = useMemo(() => generateMockData(), []);

  // Calculate data based on time range
  const filteredData = useMemo(() => {
    if (timeRange === '7d') return daysData.slice(-7);
    if (timeRange === '30d') return daysData;
    return daysData;
  }, [timeRange, daysData]);

  const totalViews = useMemo(
    () => filteredData.reduce((sum, day) => sum + day.views, 0),
    [filteredData]
  );

  const avgTimeSpent = '2:34';
  const hotLeads = 23;
  const conversions = 8;

  // Get property type label in Spanish
  const propertyTypeLabel = {
    terreno: 'Terreno',
    casa: 'Casa',
    departamento: 'Departamento',
  }[propertyType];

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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            icon={<Eye className="w-6 h-6 text-blue-600" />}
            label="Visitas Virtuales"
            value={totalViews}
            trend={12}
            trendLabel="vs semana pasada"
            color="bg-blue-50"
            isLoading={isLoading}
          />

          <KPICard
            icon={<Clock className="w-6 h-6 text-purple-600" />}
            label="Tiempo Promedio de Enamoramiento"
            value={avgTimeSpent}
            suffix="min"
            trend={8}
            trendLabel="vs semana pasada"
            color="bg-purple-50"
            isLoading={isLoading}
          />

          <KPICard
            icon={
              <config.hotLeadsIcon className={cn('w-6 h-6', config.hotLeadsIconColor)} />
            }
            label={config.hotLeadsLabel}
            value={hotLeads}
            trend={-5}
            trendLabel="vs semana pasada"
            color={config.hotLeadsColor}
            isLoading={isLoading}
            isBlurred={!isPro}
          />

          <KPICard
            icon={<MessageCircle className="w-6 h-6 text-emerald-600" />}
            label="Intención de Compra"
            value={conversions}
            trend={25}
            trendLabel="vs semana pasada"
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
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={filteredData}>
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
            ) : (
              <div className="space-y-4">
                {config.scenes.map((scene, index) => (
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
                    {index === 0 && (
                      <p className="text-xs text-emerald-600 mt-2 font-medium">
                        {config.topInsight}
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
