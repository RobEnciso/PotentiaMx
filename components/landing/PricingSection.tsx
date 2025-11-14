'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Check,
  X,
  Sparkles,
  Camera,
  Store,
  BarChart3,
  Zap,
  Crown,
  TrendingUp,
} from 'lucide-react';
import SavingsCalculator from './SavingsCalculator';

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>(
    'monthly',
  );
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  // Descuento del 20% en plan anual
  const getPrice = (monthlyPrice: number) => {
    if (billingCycle === 'annual') {
      return Math.round(monthlyPrice * 0.8); // 20% descuento
    }
    return monthlyPrice;
  };

  const plans = [
    {
      id: 'free',
      name: 'FREE',
      tagline: 'Perfecto para empezar',
      price: 0,
      priceUSD: 0,
      icon: Sparkles,
      iconColor: 'text-slate-500',
      bgGradient: 'from-slate-50 to-slate-100',
      borderColor: 'border-slate-200',
      ctaStyle: 'bg-slate-600 hover:bg-slate-700 text-white',
      features: {
        tours: '2 tours activos',
        storage: '500 MB',
        watermark: true,
        leads: false,
        analytics: 'Básicos',
        branding: false,
        marketplace: '1 propiedad',
        marketplaceCommission: '5%',
        captureService: false,
        sessionsPerMonth: 0,
        support: 'Email (72h)',
      },
      cta: 'Comenzar Gratis',
      href: '/signup',
    },
    {
      id: 'starter',
      name: 'STARTER',
      tagline: 'Para agentes independientes',
      price: 580,
      priceUSD: 29,
      icon: Camera,
      iconColor: 'text-teal-500',
      bgGradient: 'from-teal-50 to-cyan-50',
      borderColor: 'border-teal-300',
      ctaStyle: 'bg-teal-500 hover:bg-teal-600 text-white shadow-lg',
      features: {
        tours: '10 tours activos',
        storage: '5 GB',
        watermark: false,
        leads: '100/mes',
        analytics: 'Básicos + Dashboard',
        branding: 'Colores básicos',
        marketplace: 'Ilimitadas',
        marketplaceCommission: '4%',
        captureService: true,
        sessionsPerMonth: '1 cada 3 meses',
        sessionsIncluded: 'Terrestre (8-12 fotos)',
        sessionsDiscount: '20%',
        support: 'Email (24-48h) + Chat',
      },
      cta: 'Empezar 14 días gratis',
      href: '/signup?plan=starter',
      popular: false,
    },
    {
      id: 'pro',
      name: 'PRO',
      tagline: 'El favorito de agencias',
      price: 1580,
      priceUSD: 79,
      icon: Crown,
      iconColor: 'text-purple-500',
      bgGradient: 'from-purple-50 to-pink-50',
      borderColor: 'border-purple-400',
      ctaStyle:
        'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-xl',
      features: {
        tours: '30 tours activos',
        storage: '20 GB',
        watermark: false,
        leads: '500/mes',
        analytics: 'Avanzados + Sugerencias IA',
        branding: 'Completo (logo + colores)',
        marketplace: 'Ilimitadas',
        marketplaceCommission: '3.5%',
        captureService: true,
        sessionsPerMonth: '1/mes',
        sessionsIncluded: 'Terrestre + opción aérea',
        sessionsDiscount: '30%',
        support: 'Prioritario + Videollamadas',
      },
      cta: 'Prueba Pro gratis',
      href: '/signup?plan=pro',
      popular: true,
      badge: 'Más Popular',
    },
    {
      id: 'business',
      name: 'BUSINESS',
      tagline: 'Para desarrolladores',
      price: 3980,
      priceUSD: 199,
      icon: TrendingUp,
      iconColor: 'text-orange-500',
      bgGradient: 'from-orange-50 to-red-50',
      borderColor: 'border-orange-400',
      ctaStyle:
        'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-xl',
      features: {
        tours: 'Ilimitados',
        storage: '100 GB',
        watermark: false,
        leads: 'Ilimitados',
        analytics: 'IA + Predicciones ML',
        branding: 'White-label completo',
        marketplace: 'Ilimitadas + Destacadas',
        marketplaceCommission: '3%',
        captureService: true,
        sessionsPerMonth: '2/mes',
        sessionsIncluded: 'Terrestre + Aérea + Video',
        sessionsDiscount: '40%',
        support: 'Dedicado (WhatsApp + Llamadas)',
      },
      cta: 'Contactar Ventas',
      href: '/signup?plan=business',
      popular: false,
    },
  ];

  return (
    <section
      id="precios"
      className="py-20 sm:py-28 bg-gradient-to-b from-white via-slate-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Title */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            El Modelo de Negocio{' '}
            <span className="text-teal-500">Todo en Uno</span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            SaaS + Servicio de Captura + Marketplace con Comisión.
            <br />
            <span className="font-semibold text-slate-900">
              Paga una vez, obtén tres fuentes de valor.
            </span>
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-slate-100 rounded-full p-1 shadow-inner">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mensual
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-full font-medium transition-all relative ${
                billingCycle === 'annual'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Anual
              <span className="absolute -top-2 -right-2 bg-teal-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border-2 ${plan.borderColor} bg-gradient-to-br ${plan.bgGradient} p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                plan.popular ? 'ring-4 ring-purple-400 ring-opacity-50' : ''
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                    <Sparkles className="w-3 h-3" />
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Icon */}
              <div className="mb-4">
                <plan.icon className={`w-10 h-10 ${plan.iconColor}`} />
              </div>

              {/* Plan Name */}
              <h3 className="text-2xl font-bold text-slate-900 mb-1">
                {plan.name}
              </h3>
              <p className="text-sm text-slate-600 mb-4">{plan.tagline}</p>

              {/* Price */}
              <div className="mb-6">
                {plan.price === 0 ? (
                  <div>
                    <span className="text-4xl font-black text-slate-900">
                      Gratis
                    </span>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-semibold text-slate-600">
                        $
                      </span>
                      <span className="text-5xl font-black text-slate-900">
                        {getPrice(plan.price).toLocaleString()}
                      </span>
                      <span className="text-slate-600 font-medium">MXN</span>
                    </div>
                    <div className="text-sm text-slate-500 mt-1">
                      ~${getPrice(plan.priceUSD)} USD/mes
                    </div>
                    {billingCycle === 'annual' && (
                      <div className="text-xs text-teal-600 font-semibold mt-1">
                        Ahorra ${(plan.price * 0.2 * 12).toLocaleString()} MXN
                        al año
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <Link
                href={plan.href}
                className={`block w-full text-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 mb-6 ${plan.ctaStyle}`}
              >
                {plan.cta}
              </Link>

              {/* Features Summary */}
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">
                    <strong>{plan.features.tours}</strong>
                  </span>
                </div>

                <div className="flex items-start gap-2">
                  <Camera className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <div className="text-slate-700">
                    <strong>Servicio de Captura:</strong>
                    {plan.features.captureService ? (
                      <div className="text-xs mt-1">
                        • {plan.features.sessionsPerMonth}
                        <br />• {plan.features.sessionsIncluded}
                        <br />• {plan.features.sessionsDiscount} desc.
                        adicionales
                      </div>
                    ) : (
                      <div className="text-xs mt-1">Disponible a la carta</div>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Store className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div className="text-slate-700">
                    <strong>Marketplace:</strong>
                    <div className="text-xs mt-1">
                      • {plan.features.marketplace}
                      <br />• Comisión: {plan.features.marketplaceCommission}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="text-slate-700">
                    <strong>Analytics:</strong>
                    <div className="text-xs mt-1">
                      {plan.features.analytics}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500 to-blue-500 px-6 py-4">
            <h3 className="text-xl font-bold text-white">
              Comparación Completa de Features
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-6 py-4 font-semibold text-slate-700">
                    Feature
                  </th>
                  {plans.map((plan) => (
                    <th
                      key={plan.id}
                      className="px-4 py-4 text-center font-bold text-slate-900"
                    >
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* Tours */}
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-700">
                    Tours Activos
                  </td>
                  {plans.map((plan) => (
                    <td
                      key={plan.id}
                      className="px-4 py-4 text-center text-slate-600"
                    >
                      {plan.features.tours}
                    </td>
                  ))}
                </tr>

                {/* Storage */}
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-700">
                    Almacenamiento
                  </td>
                  {plans.map((plan) => (
                    <td
                      key={plan.id}
                      className="px-4 py-4 text-center text-slate-600"
                    >
                      {plan.features.storage}
                    </td>
                  ))}
                </tr>

                {/* Watermark */}
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-700">
                    Sin Marca de Agua
                  </td>
                  {plans.map((plan) => (
                    <td key={plan.id} className="px-4 py-4 text-center">
                      {plan.features.watermark ? (
                        <X className="w-5 h-5 text-red-500 mx-auto" />
                      ) : (
                        <Check className="w-5 h-5 text-teal-500 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>

                {/* Leads */}
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-700">
                    Captura de Leads
                  </td>
                  {plans.map((plan) => (
                    <td
                      key={plan.id}
                      className="px-4 py-4 text-center text-slate-600"
                    >
                      {plan.features.leads || (
                        <X className="w-5 h-5 text-red-500 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>

                {/* Analytics */}
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-700">
                    Analytics
                  </td>
                  {plans.map((plan) => (
                    <td
                      key={plan.id}
                      className="px-4 py-4 text-center text-slate-600 text-sm"
                    >
                      {plan.features.analytics}
                    </td>
                  ))}
                </tr>

                {/* Branding */}
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-700">
                    Personalización de Marca
                  </td>
                  {plans.map((plan) => (
                    <td
                      key={plan.id}
                      className="px-4 py-4 text-center text-slate-600 text-sm"
                    >
                      {plan.features.branding || (
                        <X className="w-5 h-5 text-red-500 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>

                {/* Marketplace Props */}
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-700">
                    Propiedades en Marketplace
                  </td>
                  {plans.map((plan) => (
                    <td
                      key={plan.id}
                      className="px-4 py-4 text-center text-slate-600"
                    >
                      {plan.features.marketplace}
                    </td>
                  ))}
                </tr>

                {/* Commission */}
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-700">
                    Comisión por Venta
                  </td>
                  {plans.map((plan) => (
                    <td
                      key={plan.id}
                      className="px-4 py-4 text-center font-semibold text-teal-600"
                    >
                      {plan.features.marketplaceCommission}
                    </td>
                  ))}
                </tr>

                {/* Capture Sessions */}
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-700">
                    Sesiones de Captura Incluidas
                  </td>
                  {plans.map((plan) => (
                    <td
                      key={plan.id}
                      className="px-4 py-4 text-center text-slate-600 text-sm"
                    >
                      {plan.features.captureService ? (
                        plan.features.sessionsPerMonth
                      ) : (
                        <X className="w-5 h-5 text-red-500 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>

                {/* Support */}
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-700">
                    Soporte
                  </td>
                  {plans.map((plan) => (
                    <td
                      key={plan.id}
                      className="px-4 py-4 text-center text-slate-600 text-sm"
                    >
                      {plan.features.support}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ROI Calculator Teaser */}
        <div className="mt-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 sm:p-12 text-center text-white shadow-2xl">
          <Zap className="w-16 h-16 mx-auto mb-4 animate-pulse" />
          <h3 className="text-2xl sm:text-3xl font-bold mb-4">
            ¿Cuánto Ahorrarías con PotentiaMX?
          </h3>
          <p className="text-lg sm:text-xl text-purple-100 mb-6 max-w-2xl mx-auto">
            Descubre tu ahorro personalizado en menos de 1 minuto.
            <br />
            <strong className="text-white">
              Hasta $250,000 MXN de ahorro anual vs competencia
            </strong>
          </p>
          <button
            onClick={() => setIsCalculatorOpen(true)}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 font-bold rounded-lg hover:bg-purple-50 transition-all transform hover:scale-105 shadow-xl"
          >
            Calcular mi Ahorro
            <TrendingUp className="w-5 h-5" />
          </button>
        </div>

        {/* Savings Calculator Modal */}
        <SavingsCalculator
          isOpen={isCalculatorOpen}
          onClose={() => setIsCalculatorOpen(false)}
        />

        {/* FAQ Snippet */}
        <div className="mt-16 text-center">
          <p className="text-slate-600 mb-4">
            ¿Tienes dudas sobre qué plan elegir?
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 text-teal-500 hover:text-teal-600 font-semibold"
          >
            Habla con nuestro equipo
            <span className="text-xl">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
