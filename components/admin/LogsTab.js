'use client';

import { useState, useEffect } from 'react';
import {
  FileText,
  Filter,
  Calendar,
  User,
  Activity,
  RefreshCw,
  Download,
  Search,
} from 'lucide-react';
import { getAdminLogs, getHealthCheckHistory } from '@/lib/adminSecurity';

export default function LogsTab() {
  const [adminLogs, setAdminLogs] = useState([]);
  const [healthLogs, setHealthLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('admin'); // 'admin' or 'health'

  useEffect(() => {
    loadLogs();
  }, [filterAction]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const logs = await getAdminLogs(
        100,
        filterAction === 'all' ? null : filterAction,
      );
      setAdminLogs(logs);

      const health = await getHealthCheckHistory(30);
      setHealthLogs(health);
    } catch (error) {
      console.error('Error cargando logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = adminLogs.filter((log) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      log.admin_email?.toLowerCase().includes(query) ||
      log.action?.toLowerCase().includes(query) ||
      JSON.stringify(log.details).toLowerCase().includes(query)
    );
  });

  const getActionBadgeColor = (action) => {
    const colors = {
      approve_tour: 'bg-green-100 text-green-800',
      reject_tour: 'bg-red-100 text-red-800',
      clean_storage: 'bg-orange-100 text-orange-800',
      analyze_storage: 'bg-blue-100 text-blue-800',
      run_health_check: 'bg-purple-100 text-purple-800',
      repair_system: 'bg-yellow-100 text-yellow-800',
      other: 'bg-slate-100 text-slate-800',
    };
    return colors[action] || colors.other;
  };

  const getSeverityBadgeColor = (severity) => {
    const colors = {
      ok: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      critical: 'bg-red-500 text-white',
    };
    return colors[severity] || colors.ok;
  };

  const exportLogsToCSV = () => {
    const headers = ['Fecha', 'Admin', 'Acción', 'Target ID', 'Detalles'];
    const rows = filteredLogs.map((log) => [
      new Date(log.created_at).toLocaleString('es-MX'),
      log.admin_email,
      log.action,
      log.target_id || '',
      JSON.stringify(log.details),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `admin_logs_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Logs del Sistema</h2>
              <p className="text-indigo-100">
                Historial completo de acciones y eventos
              </p>
            </div>
          </div>

          <button
            onClick={loadLogs}
            disabled={loading}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg font-semibold transition-all flex items-center gap-2"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>
      </div>

      {/* Tab Selector */}
      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-2 flex gap-2">
        <button
          onClick={() => setSelectedTab('admin')}
          className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
            selectedTab === 'admin'
              ? 'bg-indigo-500 text-white shadow-md'
              : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <User className="w-5 h-5" />
          Acciones de Admin ({adminLogs.length})
        </button>
        <button
          onClick={() => setSelectedTab('health')}
          className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
            selectedTab === 'health'
              ? 'bg-purple-500 text-white shadow-md'
              : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-5 h-5" />
          Health Checks ({healthLogs.length})
        </button>
      </div>

      {/* Admin Logs Tab */}
      {selectedTab === 'admin' && (
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar en logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                />
              </div>
            </div>

            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
            >
              <option value="all">Todas las acciones</option>
              <option value="approve_tour">Aprobar tour</option>
              <option value="reject_tour">Rechazar tour</option>
              <option value="clean_storage">Limpiar storage</option>
              <option value="analyze_storage">Analizar storage</option>
              <option value="run_health_check">Health check</option>
              <option value="repair_system">Reparar sistema</option>
              <option value="other">Otras</option>
            </select>

            <button
              onClick={exportLogsToCSV}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Exportar CSV
            </button>
          </div>

          {/* Logs Table */}
          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin mx-auto mb-3" />
              <p className="text-slate-600">Cargando logs...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600">No se encontraron logs</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Fecha
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Admin
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Acción
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">
                      Detalles
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {new Date(log.created_at).toLocaleString('es-MX', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-slate-900">
                        {log.admin_email}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getActionBadgeColor(log.action)}`}
                        >
                          {log.action.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600 max-w-md">
                        <details className="cursor-pointer">
                          <summary className="hover:text-indigo-600 transition-colors">
                            Ver detalles
                          </summary>
                          <pre className="mt-2 text-xs bg-slate-100 p-2 rounded overflow-x-auto">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </details>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Health Checks Tab */}
      {selectedTab === 'health' && (
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Historial de Health Checks
          </h3>

          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="w-8 h-8 text-purple-500 animate-spin mx-auto mb-3" />
              <p className="text-slate-600">Cargando historial...</p>
            </div>
          ) : healthLogs.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600">No hay health checks registrados</p>
            </div>
          ) : (
            <div className="space-y-4">
              {healthLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 border-2 border-slate-200 rounded-lg hover:border-purple-300 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityBadgeColor(log.severity)}`}
                      >
                        {log.severity?.toUpperCase() || 'UNKNOWN'}
                      </span>
                      <span className="text-sm text-slate-600">
                        {new Date(log.checked_at).toLocaleString('es-MX')}
                      </span>
                      <span className="text-sm text-slate-500">
                        • {log.execution_time_ms}ms
                      </span>
                    </div>
                    <span className="text-lg font-bold text-slate-900">
                      {log.issues_found} issues
                    </span>
                  </div>

                  {log.details && log.details.length > 0 && (
                    <details className="mt-3">
                      <summary className="cursor-pointer text-sm font-semibold text-purple-600 hover:text-purple-700">
                        Ver {log.details.length} issue(s) encontrado(s)
                      </summary>
                      <div className="mt-2 space-y-2">
                        {log.details.map((issue, idx) => (
                          <div
                            key={idx}
                            className={`p-3 rounded-lg text-sm ${
                              issue.severity === 'error'
                                ? 'bg-red-50 text-red-900'
                                : 'bg-yellow-50 text-yellow-900'
                            }`}
                          >
                            <p className="font-semibold">{issue.message}</p>
                            {issue.count && (
                              <p className="text-xs mt-1">
                                Cantidad: {issue.count}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
