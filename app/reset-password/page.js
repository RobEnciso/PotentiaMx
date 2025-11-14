'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

export default function ResetPasswordPage() {
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [validToken, setValidToken] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);

  // Verificar que hay una sesión válida (token de reset)
  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log('🔍 [RESET] Iniciando verificación de sesión...');
        console.log('🔍 [RESET] URL completa:', window.location.href);
        console.log('🔍 [RESET] Hash:', window.location.hash);
        console.log('🔍 [RESET] Search:', window.location.search);

        // OPCIÓN 1: Intentar obtener tokens del hash (formato nuevo de Supabase)
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1),
        );
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const hashType = hashParams.get('type');

        console.log('🔍 [RESET] Tokens en hash:', {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          type: hashType,
        });

        if (accessToken && refreshToken) {
          console.log('✅ [RESET] Estableciendo sesión con tokens del hash...');

          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            console.error(
              '❌ [RESET] Error estableciendo sesión:',
              sessionError,
            );
            setError(
              'Error al procesar el enlace de recuperación. Por favor solicita uno nuevo.',
            );
            setCheckingToken(false);
            return;
          }

          if (data.session) {
            console.log(
              '✅ [RESET] Sesión establecida exitosamente desde hash!',
            );
            setValidToken(true);
            setCheckingToken(false);
            window.history.replaceState(null, '', window.location.pathname);
            return;
          }
        }

        // OPCIÓN 2: Intentar obtener token_hash del query parameter (formato correcto para recovery)
        const searchParams = new URLSearchParams(window.location.search);
        const tokenHash = searchParams.get('token_hash');
        const type = searchParams.get('type');

        console.log('🔍 [RESET] Parámetros en URL:', {
          hasTokenHash: !!tokenHash,
          type: type,
          tokenHashPreview: tokenHash?.substring(0, 20) + '...',
        });

        if (tokenHash && type === 'recovery') {
          console.log(
            '✅ [RESET] Encontrado token_hash de recovery, verificando...',
          );

          const { data, error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: 'recovery',
          });

          console.log('🔍 [RESET] Resultado de verifyOtp:', {
            hasData: !!data,
            hasSession: !!data?.session,
            hasUser: !!data?.user,
            error: verifyError,
          });

          if (verifyError) {
            console.error('❌ [RESET] Error verificando token:', verifyError);
            setError(
              'El enlace de recuperación no es válido o ha expirado. Por favor solicita uno nuevo.',
            );
            setCheckingToken(false);
            return;
          }

          if (data.session) {
            console.log(
              '✅ [RESET] Sesión establecida exitosamente desde token_hash!',
            );
            setValidToken(true);
            setCheckingToken(false);
            window.history.replaceState(null, '', window.location.pathname);
            return;
          }
        }

        // OPCIÓN 3: Verificar si ya hay una sesión activa
        console.log('🔍 [RESET] Verificando sesión existente...');
        const {
          data: { session },
        } = await supabase.auth.getSession();

        console.log('🔍 [RESET] Resultado de getSession:', {
          hasSession: !!session,
          userId: session?.user?.id,
        });

        if (!session) {
          console.error('❌ [RESET] No hay sesión válida');
          setError(
            'El enlace de recuperación no es válido o ha expirado. Por favor solicita uno nuevo.',
          );
          setCheckingToken(false);
          return;
        }

        console.log('✅ [RESET] Sesión válida encontrada!');
        setValidToken(true);
        setCheckingToken(false);
      } catch (err) {
        console.error('❌ [RESET] Error inesperado:', err);
        setError(
          'Error al verificar el enlace de recuperación. Por favor intenta nuevamente.',
        );
        setCheckingToken(false);
      }
    };

    checkSession();
  }, [supabase]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validaciones
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        throw updateError;
      }

      setSuccess(true);

      // Redirigir al dashboard después de 3 segundos
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    } catch (err) {
      console.error('Error al actualizar contraseña:', err);
      setError(err.message || 'Error al actualizar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  // Pantalla de verificación
  if (checkingToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-500 via-teal-600 to-blue-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
          <div className="inline-block w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-600">
            Verificando enlace de recuperación...
          </p>
        </div>
      </div>
    );
  }

  // Pantalla de éxito
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-500 via-teal-600 to-blue-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              ¡Contraseña Actualizada!
            </h2>
            <p className="text-slate-600 mb-6">
              Tu contraseña ha sido cambiada exitosamente. Serás redirigido al
              dashboard en unos segundos...
            </p>
            <div className="inline-block w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  // Pantalla de token inválido
  if (!validToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-500 via-teal-600 to-blue-600 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Enlace No Válido
            </h2>
            <p className="text-slate-600 mb-4">{error}</p>
          </div>

          <Link
            href="/login"
            className="block w-full text-center px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all"
          >
            Volver al Login
          </Link>
        </div>
      </div>
    );
  }

  // Formulario de nueva contraseña
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 via-teal-600 to-blue-600 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCAzLjk5LTRDNDIuMiAzMCA0NCAzMS43OSA0NCAzNHMtMS44IDQtNC4wMSA0Yy0yLjIgMC0zLjk5LTEuNzktMy45OS00ek0zNiAyYzAtMi4yMSAxLjc5LTQgMy45OS00QzQyLjItMiA0NC0uMjEgNDQgMnMtMS44IDQtNC4wMSA0Yy0yLjIgMC0zLjk5LTEuNzktMy45OS00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>

      {/* Reset Password Card */}
      <div className="relative w-full max-w-md">
        {/* Back to Login Link */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-white/90 hover:text-white font-medium mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Volver al Login
        </Link>

        <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <h1 className="text-3xl font-black tracking-tight text-slate-900">
                Potentia<span className="text-teal-500">MX</span>
              </h1>
            </Link>
            <p className="text-slate-600 mt-2">Restablecer Contraseña</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">Error</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Reset Password Form */}
          <form onSubmit={handleResetPassword} className="space-y-5">
            {/* Nueva Contraseña */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Nueva Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  placeholder="Repite la contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Indicador de fortaleza */}
            {password.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <div
                    className={`flex-1 h-1 rounded ${
                      password.length < 6
                        ? 'bg-red-300'
                        : password.length < 10
                          ? 'bg-yellow-300'
                          : 'bg-green-300'
                    }`}
                  ></div>
                  <span
                    className={`font-medium ${
                      password.length < 6
                        ? 'text-red-600'
                        : password.length < 10
                          ? 'text-yellow-600'
                          : 'text-green-600'
                    }`}
                  >
                    {password.length < 6
                      ? 'Débil'
                      : password.length < 10
                        ? 'Media'
                        : 'Fuerte'}
                  </span>
                </div>
                {password !== confirmPassword && confirmPassword.length > 0 && (
                  <p className="text-xs text-red-600">
                    Las contraseñas no coinciden
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`
                w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-lg font-bold text-white shadow-lg
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
                  Actualizando...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Cambiar Contraseña
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
