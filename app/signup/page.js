'use client';

import { useState, useMemo } from 'react';
import { createClient } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  Mail,
  Phone,
  Lock,
  Building2,
  Briefcase,
  Home,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  UserPlus,
} from 'lucide-react';

export default function SignupPage() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    clientType: '',
    propertyCount: '',
    howHeard: '',
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage('');

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    // Registro en Supabase Auth
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: {
          full_name: formData.fullName,
          phone: formData.phone,
          company_name: formData.companyName,
          client_type: formData.clientType,
          property_count: formData.propertyCount,
          how_heard: formData.howHeard,
        },
      },
    });

    if (signUpError) {
      // Mensajes más claros para errores comunes
      if (
        signUpError.message.includes('rate limit') ||
        signUpError.message.includes('Email rate limit exceeded') ||
        signUpError.status === 429
      ) {
        setError(
          '⏳ Demasiados intentos de registro. Por favor espera 1 hora e intenta nuevamente. ' +
            'Si necesitas ayuda inmediata, contacta a soporte@potentiamx.com',
        );
      } else if (
        signUpError.message.includes('already registered') ||
        signUpError.message.includes('already exists')
      ) {
        setError(
          'Este email ya está registrado. ¿Quieres iniciar sesión en su lugar?',
        );
      } else {
        setError(signUpError.message);
      }
      setLoading(false);
      return;
    }

    // Enviar email de bienvenida
    try {
      await fetch('/api/send-welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          name: formData.fullName,
          plan: 'free', // Todos los usuarios empiezan en plan FREE
        }),
      });
      console.log('✅ Email de bienvenida enviado');
    } catch (emailError) {
      console.error('⚠️ Error enviando email de bienvenida:', emailError);
      // No fallar el registro si el email falla
    }

    // Crear tour demo personal (estilo Pixieset)
    try {
      const demoResponse = await fetch('/api/create-demo-tour', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: authData.user.id,
          userEmail: formData.email,
          userName: formData.fullName,
        }),
      });

      const demoResult = await demoResponse.json();

      if (demoResponse.ok && demoResult.success) {
        console.log('✅ Tour demo personal creado:', demoResult.tourId);
      } else {
        console.error('⚠️ Error creando tour demo:', demoResult.error);
      }
    } catch (demoError) {
      console.error('⚠️ Excepción creando tour demo:', demoError);
      // No fallar el registro si el tour demo falla
    }

    // Éxito
    setMessage(
      '¡Registro exitoso! Por favor, revisa tu email para confirmar tu cuenta. Te redirigiremos al dashboard...',
    );

    // Redirigir al dashboard después de 3 segundos
    setTimeout(() => {
      router.push('/dashboard');
    }, 3000);

    setLoading(false);
  };

  // Google OAuth
  const handleGoogleSignup = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      setError('Error al conectar con Google: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 via-teal-600 to-blue-600 py-8 px-4 sm:px-6 lg:px-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCAzLjk5LTRDNDIuMiAzMCA0NCAzMS43OSA0NCAzNHMtMS44IDQtNC4wMSA0Yy0yLjIgMC0zLjk5LTEuNzktMy45OS00ek0zNiAyYzAtMi4yMSAxLjc5LTQgMy45OS00QzQyLjItMiA0NC0uMjEgNDQgMnMtMS44IDQtNC4wMSA0Yy0yLjIgMC0zLjk5LTEuNzktMy45OS00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>

      <div className="relative max-w-3xl mx-auto">
        {/* Back to Home Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/90 hover:text-white font-medium mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Volver al Inicio
        </Link>

        {/* Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block mb-4">
            <h1 className="text-3xl font-black tracking-tight text-white">
              Potentia<span className="text-teal-200">MX</span>
            </h1>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Crea tu Cuenta Gratis
          </h2>
          <p className="text-teal-50">
            Empieza a crear tours virtuales en minutos
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
          {/* Google Sign Up Button */}
          <button
            onClick={handleGoogleSignup}
            type="button"
            className="w-full flex items-center justify-center gap-3 px-6 py-3 border-2 border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all mb-6 font-medium text-slate-700"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continuar con Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500">
                O regístrate con email
              </span>
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">Error</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {message && (
            <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-900">¡Éxito!</p>
                <p className="text-sm text-green-700 mt-1">{message}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-5">
            {/* Información Personal */}
            <div className="pb-4">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-teal-500" />
                Información Personal
              </h3>

              <div className="space-y-4">
                {/* Nombre Completo */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Nombre Completo *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      placeholder="Juan Pérez"
                      className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Email y Teléfono */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="tu@email.com"
                        className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Teléfono (WhatsApp) *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="+52 322 123 4567"
                        className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Contraseñas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Contraseña *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        placeholder="Mínimo 6 caracteres"
                        className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Confirmar Contraseña *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        placeholder="Confirma tu contraseña"
                        className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Información del Negocio */}
            <div className="pt-4 border-t border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-500" />
                Información del Negocio
              </h3>

              <div className="space-y-4">
                {/* Nombre Empresa */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Nombre de la Empresa/Agencia
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder="Inmobiliaria Vallarta Premium"
                      className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Tipo de Cliente y Cantidad */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Tipo de Cliente *
                    </label>
                    <select
                      name="clientType"
                      value={formData.clientType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all text-slate-900 bg-white"
                    >
                      <option value="">Selecciona...</option>
                      <option value="agente">
                        Agente Inmobiliario Independiente
                      </option>
                      <option value="inmobiliaria">Inmobiliaria/Agencia</option>
                      <option value="desarrollador">Desarrollador</option>
                      <option value="particular">
                        Particular (vendo mi propiedad)
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Propiedades que manejas *
                    </label>
                    <select
                      name="propertyCount"
                      value={formData.propertyCount}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all text-slate-900 bg-white"
                    >
                      <option value="">Selecciona...</option>
                      <option value="1-5">1-5 propiedades</option>
                      <option value="6-20">6-20 propiedades</option>
                      <option value="21-50">21-50 propiedades</option>
                      <option value="50+">Más de 50 propiedades</option>
                    </select>
                  </div>
                </div>

                {/* Cómo nos conoció */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    ¿Cómo nos conociste?
                  </label>
                  <select
                    name="howHeard"
                    value={formData.howHeard}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all text-slate-900 bg-white"
                  >
                    <option value="">Selecciona...</option>
                    <option value="google">Google</option>
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="referido">Referido por alguien</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`
                w-full flex items-center justify-center gap-3 px-6 py-4 rounded-lg font-bold text-lg text-white shadow-lg
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
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creando tu cuenta...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Crear Cuenta Gratis
                </>
              )}
            </button>

            {/* Terms */}
            <p className="text-xs text-center text-slate-500">
              Al crear una cuenta, aceptas nuestros{' '}
              <Link
                href="/legal/terminos"
                className="text-teal-600 hover:text-teal-700 underline"
              >
                Términos y Condiciones
              </Link>{' '}
              y{' '}
              <Link
                href="/legal/privacidad"
                className="text-teal-600 hover:text-teal-700 underline"
              >
                Aviso de Privacidad
              </Link>
            </p>
          </form>
        </div>

        {/* Login Link */}
        <p className="text-center mt-6 text-white/90">
          ¿Ya tienes una cuenta?{' '}
          <Link
            href="/login"
            className="font-semibold text-white hover:text-teal-200 underline"
          >
            Inicia Sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
