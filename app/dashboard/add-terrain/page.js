'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import imageCompression from 'browser-image-compression';
import dynamic from 'next/dynamic';
import {
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  DollarSign,
  Ruler,
  Info,
  AlertCircle,
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

export default function AddTerrain() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

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
  });

  const [images, setImages] = useState([]);
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [compressionProgress, setCompressionProgress] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [terrenosCount, setTerrenosCount] = useState(0);
  const [limitReached, setLimitReached] = useState(false);

  // Proteger ruta y validar límite de tours
  useEffect(() => {
    const checkSessionAndLimits = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      // Obtener perfil del usuario
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('subscription_plan, max_tours')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        console.error('Error obteniendo perfil:', profileError);
        return;
      }

      setUserProfile(profile);

      // Contar terrenos actuales del usuario
      const { count, error: countError } = await supabase
        .from('terrenos')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id);

      if (countError) {
        console.error('Error contando terrenos:', countError);
        return;
      }

      setTerrenosCount(count || 0);

      // Verificar si alcanzó el límite
      if (count >= profile.max_tours) {
        setLimitReached(true);
      }
    };
    checkSessionAndLimits();
  }, [supabase, router]);

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

  const compressImage = async (file, index, total) => {
    setCompressionProgress(
      `🔄 Optimizando imagen ${index + 1} de ${total}... (esto puede tomar unos segundos)`,
    );

    // ✅ OPTIMIZADO: Mayor calidad para tours 360° profesionales
    const options = {
      maxWidthOrHeight: 3840, // 4K para máxima calidad
      useWebWorker: true,
      fileType: 'image/webp',
      initialQuality: 0.92, // 92% de calidad (antes 85%)
      maxSizeMB: 5, // 5MB para mantener calidad premium (antes 2MB)
    };

    try {
      console.log(
        `📦 Imagen original: ${file.name}, tamaño: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
      );

      const compressedFile = await imageCompression(file, options);

      console.log(
        `✅ Imagen comprimida: ${compressedFile.name}, tamaño: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`,
      );

      return compressedFile;
    } catch (error) {
      console.error('Error al comprimir imagen:', error);
      alert(
        'Error al optimizar la imagen. Se usará la imagen original: ' +
          error.message,
      );
      return file;
    }
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setCompressionProgress('⏳ Preparando imágenes...');

    const compressedImages = [];
    for (let i = 0; i < files.length; i++) {
      const compressed = await compressImage(files[i], i, files.length);
      compressedImages.push(compressed);
    }

    setImages(compressedImages);
    setCompressionProgress('');
    console.log('✅ Todas las imágenes optimizadas y listas para subir');
  };

  const handleCoverImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setCompressionProgress('🔄 Optimizando imagen de portada...');

    // ✅ OPTIMIZADO: Mayor calidad para portadas atractivas
    const options = {
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/webp',
      initialQuality: 0.9, // 90% de calidad (antes 85%)
      maxSizeMB: 2, // 2MB para portadas de alta calidad (antes 1MB)
    };

    try {
      const compressedFile = await imageCompression(file, options);
      setCoverImage(compressedFile);
      setCompressionProgress('');
    } catch (error) {
      console.error('Error al comprimir portada:', error);
      alert('Error al optimizar la imagen de portada: ' + error.message);
      setCompressionProgress('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      alert('Por favor, sube al menos una imagen panorámica 360°');
      return;
    }

    // Validar coordenadas obligatorias
    if (!formData.latitude || !formData.longitude) {
      alert(
        '⚠️ La ubicación del terreno es obligatoria.\n\nPor favor, marca la ubicación en el mapa antes de continuar.',
      );
      return;
    }

    setLoading(true);
    setUploadProgress('Iniciando...');

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert('Error: No hay usuario autenticado');
        setLoading(false);
        return;
      }

      // Subir imagen de portada
      let coverImageUrl = null;
      if (coverImage) {
        setUploadProgress('📤 Subiendo imagen de portada...');
        const coverFilePath = `${user.id}/${uuidv4()}-cover.webp`;

        const { error: coverUploadError } = await supabase.storage
          .from('tours-panoramicos')
          .upload(coverFilePath, coverImage);

        if (coverUploadError) {
          throw new Error(
            `Error al subir portada: ${coverUploadError.message}`,
          );
        }

        const { data: coverPublicUrlData } = supabase.storage
          .from('tours-panoramicos')
          .getPublicUrl(coverFilePath);

        coverImageUrl = coverPublicUrlData.publicUrl;
      }

      // Subir imágenes 360°
      const imageUrls = [];
      for (let i = 0; i < images.length; i++) {
        setUploadProgress(`📤 Subiendo imagen ${i + 1} de ${images.length}...`);

        const image = images[i];
        const filePath = `${user.id}/${uuidv4()}.webp`;

        const { error: uploadError } = await supabase.storage
          .from('tours-panoramicos')
          .upload(filePath, image);

        if (uploadError) {
          throw new Error(`Error al subir imagen: ${uploadError.message}`);
        }

        const { data: publicUrlData } = supabase.storage
          .from('tours-panoramicos')
          .getPublicUrl(filePath);

        imageUrls.push(publicUrlData.publicUrl);
      }

      // Guardar en BD
      setUploadProgress('💾 Guardando tour en la base de datos...');

      const { error: dbError } = await supabase.from('terrenos').insert([
        {
          ...formData,
          user_id: user.id,
          sale_price: parseFloat(formData.sale_price) || 0,
          total_square_meters: parseFloat(formData.total_square_meters) || 0,
          image_urls: imageUrls,
          cover_image_url: coverImageUrl,
        },
      ]);

      if (dbError) {
        throw new Error(`Error al guardar tour: ${dbError.message}`);
      }

      alert('✅ ¡Tour 360° creado exitosamente!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error al crear tour:', error);
      alert(error.message);
    } finally {
      setLoading(false);
      setUploadProgress('');
    }
  };

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
              Crear Nuevo Tour <span className="text-teal-500">360°</span>
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Limit Reached Alert */}
        {limitReached && userProfile && (
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">
                  Has alcanzado el límite de tu plan
                </h3>
                <p className="text-white/90 mb-4">
                  Tu plan{' '}
                  <span className="font-semibold capitalize">
                    {userProfile.subscription_plan}
                  </span>{' '}
                  permite crear hasta{' '}
                  <span className="font-semibold">
                    {userProfile.max_tours} tours
                  </span>{' '}
                  activos. Actualmente tienes{' '}
                  <span className="font-semibold">{terrenosCount} tours</span>{' '}
                  creados.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => router.push('/pricing')}
                    className="px-6 py-3 bg-white text-orange-600 font-bold rounded-lg hover:bg-slate-50 transition-colors shadow-lg"
                  >
                    📈 Ver Planes Premium
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push('/dashboard')}
                    className="px-6 py-3 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm"
                  >
                    Volver al Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <Info className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Información Básica
              </h2>
            </div>

            <div className="space-y-4">
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
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
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
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-y text-slate-900 placeholder-slate-400"
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
                    <option value="">
                      Selecciona una categoría (opcional)
                    </option>
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
                          setFormData((prev) => ({
                            ...prev,
                            available_for_contribution: e.target.checked,
                          }))
                        }
                        className="mt-1 w-5 h-5 text-teal-600 border-slate-300 rounded focus:ring-2 focus:ring-teal-500"
                      />
                      <div>
                        <span className="block text-sm font-semibold text-slate-900 mb-1">
                          💼 Se ofrece en aportación para proyecto
                        </span>
                        <span className="text-xs text-slate-600">
                          Indica si este terreno puede ser aportado como parte
                          de un proyecto de desarrollo conjunto
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
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Medidas y Precio */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Medidas y Precio
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Superficie (m²)
                </label>
                <div className="relative">
                  <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="number"
                    name="total_square_meters"
                    value={formData.total_square_meters}
                    onChange={handleInputChange}
                    step="0.01"
                    placeholder="500"
                    className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Precio por m²
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="number"
                    name="price_per_sqm"
                    value={formData.price_per_sqm}
                    onChange={handleInputChange}
                    step="0.01"
                    placeholder="5000"
                    className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Precio Total (calculado automáticamente)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-600" />
                  <input
                    type="text"
                    name="sale_price"
                    value={
                      formData.sale_price
                        ? `$${parseFloat(formData.sale_price).toLocaleString('es-MX')}`
                        : ''
                    }
                    readOnly
                    placeholder="Se calcula automáticamente"
                    className="w-full pl-11 pr-4 py-3 border-2 border-green-200 rounded-lg bg-green-50 text-slate-900 font-bold text-lg"
                  />
                </div>
              </div>

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
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
                />
              </div>

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
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Configuración de Contacto */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
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
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-slate-900 bg-white"
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
                      className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
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
                      className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-slate-900 placeholder-slate-400"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Formato internacional: 52 + código de área + número (ej:
                    5213221234567)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Imagen de Portada */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Imagen de Portada{' '}
                <span className="text-slate-500 text-sm font-normal">
                  (Opcional)
                </span>
              </h2>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">
                💡 <strong>Recomendación:</strong> Sube una foto normal (no
                360°) que se mostrará como miniatura en el dashboard. Si no
                subes ninguna, se usará la primera imagen 360°.
              </p>
            </div>

            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
                disabled={loading}
                className="hidden"
                id="cover-upload"
              />
              <label
                htmlFor="cover-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-teal-300 rounded-lg cursor-pointer bg-teal-50 hover:bg-teal-100 transition-colors"
              >
                <Upload className="w-8 h-8 text-teal-500 mb-2" />
                <span className="text-sm font-medium text-teal-700">
                  Click para seleccionar imagen de portada
                </span>
                <span className="text-xs text-teal-600 mt-1">
                  Formatos: JPG, PNG, WebP
                </span>
              </label>
            </div>

            {coverImage && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-semibold text-green-800 mb-1">
                  ✅ Imagen de portada lista
                </p>
                <p className="text-xs text-green-700">
                  {coverImage.name} (
                  {(coverImage.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              </div>
            )}
          </div>

          {/* Imágenes 360° */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Upload className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Imágenes Panorámicas 360° *
              </h2>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-800">
                💡 <strong>Recomendación:</strong> Sube imágenes con la máxima
                calidad posible. Las imágenes se optimizarán automáticamente a
                4K (WebP, 85% calidad).
              </p>
            </div>

            <div className="relative">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                disabled={loading}
                className="hidden"
                id="images-upload"
              />
              <label
                htmlFor="images-upload"
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                <Upload className="w-10 h-10 text-blue-500 mb-2" />
                <span className="text-base font-medium text-blue-700">
                  Click para seleccionar imágenes 360°
                </span>
                <span className="text-sm text-blue-600 mt-1">
                  Puedes seleccionar múltiples imágenes
                </span>
              </label>
            </div>

            {compressionProgress && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">{compressionProgress}</p>
              </div>
            )}

            {images.length > 0 && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-semibold text-green-800 mb-2">
                  ✅ {images.length} imagen(es) optimizada(s) y lista(s)
                </p>
                <ul className="space-y-1">
                  {images.map((img, idx) => (
                    <li key={idx} className="text-xs text-green-700">
                      • {img.name} ({(img.size / 1024 / 1024).toFixed(2)} MB)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Progress */}
          {uploadProgress && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-green-800">
                {uploadProgress}
              </p>
            </div>
          )}

          {/* Ubicación Geográfica */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
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
                  Marca la ubicación exacta en el mapa para que aparezca en el
                  marketplace
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
                <strong>💡 Consejo:</strong> Para obtener la ubicación exacta:
              </p>
              <ul className="mt-2 text-sm text-blue-700 space-y-1 ml-4 list-disc">
                <li>
                  Busca la dirección en el campo de búsqueda arriba del mapa
                </li>
                <li>
                  O haz clic directamente en el mapa donde está el terreno
                </li>
                <li>Puedes arrastrar el marcador para ajustar la posición</li>
                <li>
                  El terreno aparecerá en el mapa del marketplace en esta
                  ubicación
                </li>
              </ul>
            </div>
          </div>

          {/* Submit Button */}
          <div className="sticky bottom-0 bg-gradient-to-t from-slate-100 to-transparent pt-6 pb-4">
            <button
              type="submit"
              disabled={loading || limitReached}
              className="w-full py-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
            >
              {limitReached
                ? '🚫 Límite de tours alcanzado'
                : loading
                  ? uploadProgress || 'Procesando...'
                  : '✅ Crear Tour 360°'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
