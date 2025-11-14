'use client';

import { useState } from 'react';
import { Mail, Phone, User, MessageSquare } from 'lucide-react';

export default function ContactFormSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Aquí puedes integrar con tu servicio de email
      // Por ahora, simulo un envío exitoso
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // TODO: Integrar con servicio de email (Resend, SendGrid, etc.)
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });

      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });

      // Reset success message después de 5 segundos
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(
        'Hubo un error al enviar tu mensaje. Por favor intenta de nuevo.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contacto" className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Info */}
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              ¿Prefieres que{' '}
              <span className="text-teal-500">te Contactemos</span>?
            </h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Déjanos tus datos y uno de nuestros especialistas te contactará
              para mostrarte cómo Potentia puede transformar la manera en que
              vendes propiedades.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center">
                  <Phone className="w-6 h-6 text-teal-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">
                    Respuesta Rápida
                  </h3>
                  <p className="text-slate-600">
                    Te contactamos en menos de 24 horas
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-teal-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">
                    Asesoría Personalizada
                  </h3>
                  <p className="text-slate-600">
                    Plan adaptado a tus necesidades específicas
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-teal-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">
                    Sin Compromiso
                  </h3>
                  <p className="text-slate-600">
                    Solo una conversación para conocer tu proyecto
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-8 sm:p-10 rounded-2xl shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nombre */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Nombre Completo *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Juan Pérez"
                    className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-slate-900 bg-white"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="tu@email.com"
                    className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-slate-900 bg-white"
                  />
                </div>
              </div>

              {/* Teléfono */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Teléfono (WhatsApp) *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="+52 322 123 4567"
                    className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-slate-900 bg-white"
                  />
                </div>
              </div>

              {/* Mensaje */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Cuéntanos sobre tu proyecto inmobiliario..."
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none text-slate-900 bg-white"
                />
              </div>

              {/* Success Message */}
              {success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">
                    ✅ ¡Mensaje enviado! Te contactaremos pronto.
                  </p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-4 bg-teal-500 hover:bg-teal-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-lg rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                {loading ? 'Enviando...' : 'Enviar Mensaje'}
              </button>

              <p className="text-xs text-center text-slate-500">
                Al enviar este formulario, aceptas que te contactemos sobre
                nuestros servicios.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
