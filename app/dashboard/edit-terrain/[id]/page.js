'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabaseClient';
import { useRouter, useParams } from 'next/navigation';
import slugify from 'slugify';
import dynamic from 'next/dynamic';
import {
  ArrowLeft,
  Info,
  DollarSign,
  Ruler,
  ImageIcon,
  Save,
  Loader2,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';

// Importar LocationPicker dinámicamente para evitar SSR issues
const LocationPicker = dynamic(() => import('@/components/LocationPicker'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-slate-100 rounded-lg flex items-center justify-center">
      <p className="text-slate-600">Cargando mapa...</p>
    </div>
  ),
});

export default function EditTerrain() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();
  const params = useParams();
  const terrenoId = params.id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    property_type: 'terreno', // Nuevo: casa, departamento, terreno
    land_category: '', // Nuevo: solo para terrenos (residencia, desarrollo, proyecto)
    available_for_contribution: false, // Nuevo: solo para desarrollo/proyecto
    land_use: '',
    total_square_meters: '',
    price_per_sqm: '',
    sale_price: '',
    front_measures: '',
    depth_measures: '',
    contact_type: 'casual',
    contact_email: '',
    contact_phone: '5213221234567',
    latitude: null, // Coordenadas geográficas
    longitude: null,
    north_offset: 0, // 🧭 Calibración de Norte para radar (0-360 grados)
  });

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // Proteger ruta y cargar datos
  useEffect(() => {
    const checkSessionAndLoadData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      // ✅ MULTI-TENANCY: Obtener usuario actual
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        alert('❌ Error: No hay usuario autenticado');
        router.push('/login');
        return;
      }

      // Cargar datos del terreno
      const { data: terreno, error } = await supabase
        .from('terrenos')
        .select('*')
        .eq('id', terrenoId)
        .single();

      if (error) {
        console.error('Error al cargar terreno:', error);
        alert('Error al cargar el terreno');
        router.push('/dashboard');
        return;
      }

      // ✅ MULTI-TENANCY: Verificar que el terreno pertenece al usuario actual
      if (terreno.user_id !== user.id) {
        alert('❌ Error: No tienes permiso para editar este terreno');
        router.push('/dashboard');
        return;
      }

      // Precarga los datos en el formulario
      setFormData({
        title: terreno.title || '',
        description: terreno.description || '',
        property_type: terreno.property_type || 'terreno', // Nuevo
        land_category: terreno.land_category || '', // Nuevo
        available_for_contribution: terreno.available_for_contribution || false, // Nuevo
        land_use: terreno.land_use || '',
        total_square_meters: terreno.total_square_meters?.toString() || '',
        price_per_sqm: terreno.price_per_sqm?.toString() || '',
        sale_price: terreno.sale_price?.toString() || '',
        front_measures: terreno.front_measures || '',
        depth_measures: terreno.depth_measures || '',
        contact_type: terreno.contact_type || 'casual',
        contact_email: terreno.contact_email || '',
        contact_phone: terreno.contact_phone || '5213221234567',
        latitude: terreno.latitude || null, // ✅ Cargar coordenadas
        longitude: terreno.longitude || null, // ✅ Cargar coordenadas
        north_offset: terreno.north_offset || 0, // 🧭 Cargar calibración de Norte
      });

      setLoadingData(false);
    };

    checkSessionAndLoadData();
  }, [supabase, router, terrenoId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newFormData = { ...prev, [name]: value };

      // Calcular precio de venta automáticamente
      if (name === 'price_per_sqm' || name === 'total_square_meters') {
        const price = parseFloat(newFormData.price_per_sqm) || 0;
        const meters = parseFloat(newFormData.total_square_meters) || 0;
        newFormData.sale_price = (price * meters).toFixed(2);
      }

      return newFormData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar coordenadas obligatorias
    if (!formData.latitude || !formData.longitude) {
      alert(
        '⚠️ La ubicación del terreno es obligatoria.\n\nPor favor, marca la ubicación en el mapa antes de guardar.',
      );
      return;
    }

    setLoading(true);

    try {
      // 🔍 Regenerar slug si el título cambió
      let updatedSlug = null;

      // Obtener el terreno actual para comparar el título
      const { data: currentTerreno } = await supabase
        .from('terrenos')
        .select('title, slug')
        .eq('id', terrenoId)
        .single();

      // Si el título cambió, regenerar el slug
      if (currentTerreno && currentTerreno.title !== formData.title) {
        updatedSlug = slugify(formData.title || 'propiedad', {
          lower: true,
          strict: true,
          locale: 'es',
          remove: /[*+~.()'"!:@]/g,
        }) + '-' + terrenoId.substring(0, 8);

        console.log('🏷️ Título cambió, slug actualizado:', updatedSlug);
      }

      const { error } = await supabase
        .from('terrenos')
        .update({
          title: formData.title,
          description: formData.description,
          ...(updatedSlug && { slug: updatedSlug }), // ✅ Actualizar slug solo si cambió el título
          property_type: formData.property_type, // Nuevo
          land_category: formData.land_category, // Nuevo
          available_for_contribution: formData.available_for_contribution, // Nuevo
          land_use: formData.land_use,
          total_square_meters: parseFloat(formData.total_square_meters) || 0,
          price_per_sqm: parseFloat(formData.price_per_sqm) || 0,
          sale_price: parseFloat(formData.sale_price) || 0,
          front_measures: formData.front_measures,
          depth_measures: formData.depth_measures,
          contact_type: formData.contact_type,
          contact_email: formData.contact_email,
          contact_phone: formData.contact_phone,
          latitude: formData.latitude, // ✅ Guardar coordenadas
          longitude: formData.longitude, // ✅ Guardar coordenadas
          north_offset: parseFloat(formData.north_offset) || 0, // 🧭 Guardar calibración de Norte
        })
        .eq('id', terrenoId);

      if (error) {
        throw new Error(`Error al actualizar: ${error.message}`);
      }

      alert('✅ ¡Terreno actualizado exitosamente!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent mb-4"></div>
          <p className="text-slate-600 text-lg font-medium">
            Cargando datos del terreno...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-sm bg-white/90">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </button>
            <h1 className="text-2xl font-bold text-slate-900">
              Editar Tour <span className="text-teal-500">360°</span>
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <section className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <Info className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Información Básica
              </h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Título del Tour *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Ej: Terreno Residencial Vista Hermosa"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Descripción
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Descripción detallada del terreno o propiedad..."
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all resize-vertical text-slate-900 placeholder:text-slate-400"
                />
              </div>

              {/* Tipo de Propiedad */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Tipo de Propiedad *
                </label>
                <select
                  name="property_type"
                  value={formData.property_type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-slate-900 bg-white"
                >
                  <option value="terreno">🏞️ Terreno</option>
                  <option value="casa">🏡 Casa</option>
                  <option value="departamento">🏢 Departamento</option>
                </select>
              </div>

              {/* Categoría de Terreno - Solo si property_type === 'terreno' */}
              {formData.property_type === 'terreno' && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Categoría del Terreno
                  </label>
                  <select
                    name="land_category"
                    value={formData.land_category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-slate-900 bg-white"
                  >
                    <option value="">Selecciona una categoría</option>
                    <option value="residencia">Terreno para Residencia</option>
                    <option value="desarrollo">Terreno para Desarrollo</option>
                    <option value="proyecto">Terreno para Proyecto</option>
                  </select>
                </div>
              )}

              {/* Disponible en Aportación - Solo para desarrollo/proyecto */}
              {formData.property_type === 'terreno' &&
                (formData.land_category === 'desarrollo' ||
                  formData.land_category === 'proyecto') && (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="available_for_contribution"
                        checked={formData.available_for_contribution}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            available_for_contribution: e.target.checked,
                          })
                        }
                        className="mt-1 w-5 h-5 text-blue-600 border-blue-300 rounded focus:ring-blue-500"
                      />
                      <div>
                        <span className="text-sm font-semibold text-blue-900 block">
                          Disponible en Aportación para Proyecto
                        </span>
                        <span className="text-xs text-blue-700 mt-1 block">
                          Marca esta opción si el terreno puede aportarse como
                          parte de un proyecto de desarrollo inmobiliario
                        </span>
                      </div>
                    </label>
                  </div>
                )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Uso de Suelo
                </label>
                <input
                  type="text"
                  name="land_use"
                  value={formData.land_use}
                  onChange={handleInputChange}
                  placeholder="Ej: Residencial, Comercial, Mixto"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>
          </section>

          {/* Medidas y Precio */}
          <section className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Precio y Medidas
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Superficie */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Superficie Total (m²)
                </label>
                <div className="relative">
                  <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="number"
                    name="total_square_meters"
                    value={formData.total_square_meters}
                    onChange={handleInputChange}
                    step="0.01"
                    placeholder="Ej: 500"
                    className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Precio por m² */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Precio por m²
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="number"
                    name="price_per_sqm"
                    value={formData.price_per_sqm}
                    onChange={handleInputChange}
                    step="0.01"
                    placeholder="Ej: 5000"
                    className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Precio Total (Calculado) */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Precio Total (Calculado Automáticamente)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                  <input
                    type="text"
                    name="sale_price"
                    value={
                      formData.sale_price
                        ? `$${parseFloat(formData.sale_price).toLocaleString('es-MX')}`
                        : ''
                    }
                    readOnly
                    placeholder="Se calculará automáticamente"
                    className="w-full pl-11 pr-4 py-3 border-2 border-green-200 rounded-lg bg-green-50 text-slate-900 font-bold text-lg cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Este valor se calcula multiplicando la superficie por el
                  precio por m²
                </p>
              </div>

              {/* Medidas de Frente */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Medidas de Frente
                </label>
                <input
                  type="text"
                  name="front_measures"
                  value={formData.front_measures}
                  onChange={handleInputChange}
                  placeholder="Ej: 20m"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                />
              </div>

              {/* Profundidad */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Profundidad
                </label>
                <input
                  type="text"
                  name="depth_measures"
                  value={formData.depth_measures}
                  onChange={handleInputChange}
                  placeholder="Ej: 25m"
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>
          </section>

          {/* Configuración de Contacto */}
          <section className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Configuración de Contacto
              </h2>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-900 font-medium mb-2">
                💡 Elige cómo quieres que los interesados te contacten:
              </p>
              <ul className="text-sm text-blue-700 space-y-1 ml-4">
                <li>
                  • <strong>Casual (WhatsApp):</strong> Para propiedades
                  residenciales - contacto inmediato
                </li>
                <li>
                  • <strong>Formal (Formulario):</strong> Para terrenos de
                  desarrollo - captura profesional de leads
                </li>
                <li>
                  • <strong>Ambos:</strong> Máxima flexibilidad para el cliente
                </li>
              </ul>
            </div>

            <div className="space-y-5">
              {/* Tipo de Contacto */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Tipo de Contacto *
                </label>
                <select
                  name="contact_type"
                  value={formData.contact_type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all text-slate-900 bg-white"
                >
                  <option value="casual">🟢 Casual - Solo WhatsApp</option>
                  <option value="formal">
                    🔵 Formal - Solo Formulario de Email
                  </option>
                  <option value="both">🟣 Ambos - WhatsApp + Formulario</option>
                </select>
              </div>

              {/* Email de Contacto - Solo si es formal o both */}
              {(formData.contact_type === 'formal' ||
                formData.contact_type === 'both') && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email de Contacto *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      name="contact_email"
                      value={formData.contact_email}
                      onChange={handleInputChange}
                      required={
                        formData.contact_type === 'formal' ||
                        formData.contact_type === 'both'
                      }
                      placeholder="ventas@tuempresa.com"
                      className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Las solicitudes de información llegarán a este correo
                  </p>
                </div>
              )}

              {/* Teléfono WhatsApp - Solo si es casual o both */}
              {(formData.contact_type === 'casual' ||
                formData.contact_type === 'both') && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Número de WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="tel"
                      name="contact_phone"
                      value={formData.contact_phone}
                      onChange={handleInputChange}
                      required={
                        formData.contact_type === 'casual' ||
                        formData.contact_type === 'both'
                      }
                      placeholder="5213221234567"
                      className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Formato internacional: 52 + código de área + número (ej:
                    5213221234567)
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Nota sobre imágenes */}
          <section className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Imágenes y Hotspots
              </h2>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Info className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">
                    Gestión de Imágenes 360° y Hotspots
                  </p>
                  <p className="text-sm text-blue-700">
                    Para agregar, editar o eliminar imágenes panorámicas y
                    hotspots de navegación, utiliza el botón{' '}
                    <strong>&quot;Editar Hotspots&quot;</strong> desde el
                    dashboard principal.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Ubicación Geográfica */}
          <section className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  📍 Ubicación del Terreno
                </h3>
                <p className="text-sm text-slate-600">
                  <strong className="text-red-500">* Obligatorio</strong> -
                  Ajusta la ubicación exacta en el mapa
                </p>
              </div>
            </div>

            <LocationPicker
              latitude={formData.latitude}
              longitude={formData.longitude}
              onChange={(lat, lng) => {
                setFormData((prev) => ({
                  ...prev,
                  latitude: lat,
                  longitude: lng,
                }));
              }}
              required={true}
            />

            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>💡 Consejo:</strong> Para ajustar la ubicación:
              </p>
              <ul className="mt-2 text-sm text-blue-700 space-y-1 ml-4 list-disc">
                <li>Busca la dirección en el campo de búsqueda</li>
                <li>Haz clic en el mapa para cambiar la ubicación</li>
                <li>Arrastra el marcador para afinar la posición</li>
                <li>Esta ubicación se mostrará en el marketplace</li>
              </ul>
            </div>

            {/* 🧭 Calibración de Norte para Radar */}
            <div className="mt-6 bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    🧭 Calibración del Radar (Opcional)
                  </h3>
                  <p className="text-sm text-slate-600">
                    Ajusta la orientación del mini-radar para que apunte al Norte real
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Offset del Norte (0-360 grados)
                  </label>
                  <input
                    type="number"
                    name="north_offset"
                    value={formData.north_offset}
                    onChange={handleInputChange}
                    min="0"
                    max="360"
                    step="1"
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-lg"
                    placeholder="0"
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Si las imágenes 360° tienen rotación, ajusta este valor para alinear el radar.
                    <strong className="text-purple-600"> Tip:</strong> Ve al editor de hotspots, activa una vista y gira hasta que sepas dónde está el Norte. Luego ajusta este número.
                  </p>
                </div>

                <div className="bg-purple-100 rounded-lg p-4">
                  <p className="text-sm text-purple-800">
                    <strong>🎯 Vista previa en vivo:</strong> Los cambios se reflejarán en el mini-radar del visor público inmediatamente después de guardar.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Botón Submit - Sticky al bottom */}
          <div className="sticky bottom-0 bg-gradient-to-t from-slate-100 via-slate-50 to-transparent pt-6 pb-8">
            <button
              type="submit"
              disabled={loading}
              className={`
                w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg text-white shadow-lg
                transition-all duration-200
                ${
                  loading
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                }
              `}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Guardando Cambios...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Actualizar Tour
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
