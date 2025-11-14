'use client';

import { useState } from 'react';
import {
  FileText,
  Database,
  ExternalLink,
  Search,
  Folder,
  Code,
} from 'lucide-react';
import {
  TECHNICAL_DOCS,
  SQL_SCRIPTS,
  EXTERNAL_LINKS,
  GOOGLE_DRIVE_CONFIG,
  searchDocs,
  openDoc,
  openExternalLink,
} from '@/lib/adminDocumentation';

export default function DocumentationTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      setSearchResults(searchDocs(query));
    } else {
      setSearchResults(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Centro de Documentación</h2>
            <p className="text-purple-100">
              Acceso rápido a toda la documentación del proyecto
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mt-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
          <input
            type="text"
            placeholder="Buscar en documentación..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:border-white/50 transition-all"
          />
        </div>
      </div>

      {/* Search Results */}
      {searchResults && (
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Resultados de búsqueda para "{searchQuery}"
          </h3>

          {searchResults.docs.length === 0 &&
          searchResults.scripts.length === 0 ? (
            <p className="text-slate-600">No se encontraron resultados</p>
          ) : (
            <div className="space-y-4">
              {searchResults.docs.length > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-700 mb-2">
                    Documentos ({searchResults.docs.length})
                  </h4>
                  <div className="grid gap-2">
                    {searchResults.docs.map((doc, idx) => (
                      <DocCard key={idx} doc={doc} />
                    ))}
                  </div>
                </div>
              )}

              {searchResults.scripts.length > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-700 mb-2">
                    Scripts SQL ({searchResults.scripts.length})
                  </h4>
                  <div className="grid gap-2">
                    {searchResults.scripts.map((script, idx) => (
                      <ScriptCard key={idx} script={script} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Main Content - Only show if not searching */}
      {!searchResults && (
        <>
          {/* Google Drive Section */}
          <div className="bg-gradient-to-br from-green-500 to-teal-500 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Folder className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Google Drive Workspace</h3>
                <p className="text-green-100 text-sm">
                  Carpeta principal del proyecto Potentia MX
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-sm text-green-100 mb-1">Carpeta Principal</p>
                <p className="font-semibold">📁 Potentia MX</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-sm text-green-100 mb-1">
                  Última sincronización
                </p>
                <p className="font-semibold">
                  {new Date().toLocaleTimeString('es-MX')}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <a
                href={GOOGLE_DRIVE_CONFIG.mainFolder}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-all shadow-md hover:shadow-lg"
              >
                <Folder className="w-4 h-4" />
                Abrir Drive Principal
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href={GOOGLE_DRIVE_CONFIG.folders.documentation}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm font-semibold rounded-lg transition-all"
              >
                📄 Docs
              </a>
              <a
                href={GOOGLE_DRIVE_CONFIG.folders.sqlScripts}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm font-semibold rounded-lg transition-all"
              >
                💾 SQL
              </a>
              <a
                href={GOOGLE_DRIVE_CONFIG.folders.branding}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm font-semibold rounded-lg transition-all"
              >
                🎨 Branding
              </a>
            </div>
          </div>

          {/* Technical Documentation */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              Documentación Técnica
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              {TECHNICAL_DOCS.map((doc, idx) => (
                <DocCard key={idx} doc={doc} />
              ))}
            </div>
          </div>

          {/* SQL Scripts */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Database className="w-6 h-6 text-purple-600" />
              Scripts SQL
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              {SQL_SCRIPTS.map((script, idx) => (
                <ScriptCard key={idx} script={script} />
              ))}
            </div>
          </div>

          {/* External Links */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <ExternalLink className="w-6 h-6 text-teal-600" />
              Enlaces Externos
            </h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {EXTERNAL_LINKS.map((link, idx) => (
                <LinkCard key={idx} link={link} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ====================================
// SUB-COMPONENTS
// ====================================

function DocCard({ doc }) {
  return (
    <div className="group p-4 bg-slate-50 hover:bg-blue-50 border-2 border-slate-200 hover:border-blue-300 rounded-lg transition-all cursor-pointer">
      <div className="flex items-start gap-3">
        <div className="text-3xl flex-shrink-0">{doc.icon}</div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-slate-900 mb-1 truncate group-hover:text-blue-600 transition-colors">
            {doc.name}
          </h4>
          <p className="text-sm text-slate-600 mb-2 line-clamp-2">
            {doc.description}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-1 bg-slate-200 text-slate-700 rounded font-medium">
              {doc.category}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => openDoc(doc.localPath)}
          className="flex-1 text-sm px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded transition-colors"
        >
          Ver Archivo
        </button>
        <button
          onClick={() =>
            openExternalLink(GOOGLE_DRIVE_CONFIG.folders.documentation)
          }
          className="text-sm px-3 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded transition-colors flex items-center gap-1"
          title="Abrir en Google Drive"
        >
          <Folder className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function ScriptCard({ script }) {
  return (
    <div className="group p-4 bg-slate-50 hover:bg-purple-50 border-2 border-slate-200 hover:border-purple-300 rounded-lg transition-all cursor-pointer">
      <div className="flex items-start gap-3">
        <div className="text-3xl flex-shrink-0">{script.icon}</div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-slate-900 mb-1 truncate group-hover:text-purple-600 transition-colors flex items-center gap-2">
            <Code className="w-4 h-4" />
            {script.name}
          </h4>
          <p className="text-sm text-slate-600 mb-2 line-clamp-2">
            {script.description}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded font-medium">
              {script.category}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <button
          onClick={() => openDoc(script.localPath)}
          className="w-full text-sm px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded transition-colors"
        >
          Ver Script SQL
        </button>
      </div>
    </div>
  );
}

function LinkCard({ link }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group p-4 bg-slate-50 hover:bg-teal-50 border-2 border-slate-200 hover:border-teal-300 rounded-lg transition-all cursor-pointer block"
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl flex-shrink-0">{link.icon}</div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-slate-900 mb-1 group-hover:text-teal-600 transition-colors flex items-center gap-2">
            {link.name}
            <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h4>
          <p className="text-sm text-slate-600 mb-2 line-clamp-2">
            {link.description}
          </p>
          <span className="text-xs px-2 py-1 bg-teal-100 text-teal-700 rounded font-medium">
            {link.category}
          </span>
        </div>
      </div>
    </a>
  );
}
