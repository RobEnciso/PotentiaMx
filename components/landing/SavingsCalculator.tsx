'use client';

import { useState } from 'react';
import {
  X,
  TrendingUp,
  Calculator,
  Sparkles,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

interface SavingsCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SavingsCalculator({
  isOpen,
  onClose,
}: SavingsCalculatorProps) {
  const [step, setStep] = useState(1);

  // User inputs
  const [toursPerMonth, setToursPerMonth] = useState(5);
  const [captureNeeds, setCaptureNeeds] = useState<
    'none' | 'basic' | 'premium' | 'enterprise'
  >('basic');
  const [sessionsPerMonth, setSessionsPerMonth] = useState(1);
  const [useMarketplace, setUseMarketplace] = useState(false);
  const [avgPropertyValue, setAvgPropertyValue] = useState(10);
  const [propertiesPerYear, setPropertiesPerYear] = useState(2);

  if (!isOpen) return null;

  // Pricing constants based on ESTRATEGIA_MONETIZACION.md
  const PRICES = {
    // Servicios a la carta
    sessionBasic: 2500, // Terrestre
    sessionAerial: 5000, // Aérea + Terrestre
    sessionMega: 8000, // Mega con video

    // Competencia
    cloudPanoSoftware: 1380, // Solo software
    matterportBusiness: 7980, // Software enterprise
    propiedadesComListing: 1000, // Publicación mensual
    propiedadesComCommission: 0.06, // 6% comisión

    // PotentiaMX Plans
    plans: {
      free: { monthly: 0, tours: 2, sessions: 0, commission: 0.05 },
      starter: { monthly: 580, tours: 10, sessions: 1 / 3, commission: 0.04 }, // 1 cada 3 meses
      pro: { monthly: 1580, tours: 30, sessions: 1, commission: 0.035 },
      business: {
        monthly: 3980,
        tours: Infinity,
        sessions: 2,
        commission: 0.03,
      },
    },
  };

  // Calculate costs
  const calculateSavings = () => {
    let competitorCost = 0;
    let potentiaMXCost = 0;
    let recommendedPlan: 'free' | 'starter' | 'pro' | 'business' = 'free';

    // 1. Determine recommended plan based on tours needed
    if (toursPerMonth > 30) {
      recommendedPlan = 'business';
    } else if (toursPerMonth > 10) {
      recommendedPlan = 'pro';
    } else if (toursPerMonth > 2) {
      recommendedPlan = 'starter';
    }

    // 2. Calculate competitor costs (monthly)

    // Software cost
    if (toursPerMonth > 10) {
      competitorCost += PRICES.matterportBusiness; // Enterprise plan
    } else {
      competitorCost += PRICES.cloudPanoSoftware; // Basic plan
    }

    // Capture service cost (monthly)
    let sessionCost = 0;
    if (captureNeeds === 'basic') {
      sessionCost = PRICES.sessionBasic * sessionsPerMonth;
    } else if (captureNeeds === 'premium') {
      sessionCost = PRICES.sessionAerial * sessionsPerMonth;
    } else if (captureNeeds === 'enterprise') {
      sessionCost = PRICES.sessionMega * sessionsPerMonth;
    }
    competitorCost += sessionCost;

    // Marketplace listing cost (if using marketplace)
    if (useMarketplace) {
      competitorCost += PRICES.propiedadesComListing;
    }

    // 3. Calculate PotentiaMX cost
    const planPricing = PRICES.plans[recommendedPlan];
    potentiaMXCost = planPricing.monthly;

    // Calculate additional sessions needed beyond included
    const includedSessions = planPricing.sessions;
    const additionalSessions = Math.max(0, sessionsPerMonth - includedSessions);

    // Discount rates by plan
    const discountRates: Record<typeof recommendedPlan, number> = {
      free: 0,
      starter: 0.2,
      pro: 0.3,
      business: 0.4,
    };

    if (additionalSessions > 0) {
      let additionalCost = 0;
      if (captureNeeds === 'basic') {
        additionalCost =
          PRICES.sessionBasic * (1 - discountRates[recommendedPlan]);
      } else if (captureNeeds === 'premium') {
        additionalCost =
          PRICES.sessionAerial * (1 - discountRates[recommendedPlan]);
      } else if (captureNeeds === 'enterprise') {
        additionalCost =
          PRICES.sessionMega * (1 - discountRates[recommendedPlan]);
      }
      potentiaMXCost += additionalCost * additionalSessions;
    }

    // 4. Calculate yearly marketplace savings (if applicable)
    let yearlyMarketplaceSavings = 0;
    if (useMarketplace && propertiesPerYear > 0) {
      const competitorCommission =
        avgPropertyValue *
        1000000 *
        PRICES.propiedadesComCommission *
        propertiesPerYear;
      const potentiaMXCommission =
        avgPropertyValue * 1000000 * planPricing.commission * propertiesPerYear;
      yearlyMarketplaceSavings = competitorCommission - potentiaMXCommission;
    }

    const monthlySavings = competitorCost - potentiaMXCost;
    const yearlySavings = monthlySavings * 12 + yearlyMarketplaceSavings;
    const savingsPercentage =
      competitorCost > 0 ? (monthlySavings / competitorCost) * 100 : 0;

    return {
      competitorCost,
      potentiaMXCost,
      monthlySavings,
      yearlySavings,
      savingsPercentage,
      recommendedPlan,
      yearlyMarketplaceSavings,
    };
  };

  const results = calculateSavings();

  const planNames: Record<string, string> = {
    free: 'FREE',
    starter: 'STARTER',
    pro: 'PRO',
    business: 'BUSINESS',
  };

  const planColors: Record<string, string> = {
    free: 'from-slate-500 to-slate-600',
    starter: 'from-teal-500 to-cyan-600',
    pro: 'from-purple-500 to-pink-600',
    business: 'from-orange-500 to-red-600',
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-8 rounded-t-2xl text-white">
          <div className="flex items-center gap-3 mb-2">
            <Calculator className="w-8 h-8" />
            <h2 className="text-3xl font-bold">Calculadora de Ahorro</h2>
          </div>
          <p className="text-purple-100">
            Descubre cuánto puedes ahorrar con PotentiaMX vs la competencia
          </p>
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Cuéntanos sobre tus necesidades
              </h3>

              {/* Tours per month */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  ¿Cuántos tours virtuales necesitas crear al mes?
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={toursPerMonth}
                    onChange={(e) => setToursPerMonth(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                  <div className="w-20 text-center">
                    <span className="text-2xl font-bold text-purple-600">
                      {toursPerMonth}
                    </span>
                    <span className="text-sm text-slate-600 block">tours</span>
                  </div>
                </div>
              </div>

              {/* Capture service needs */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  ¿Necesitas servicio de captura profesional?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    {
                      id: 'none',
                      label: 'No necesito',
                      desc: 'Tengo mis fotos',
                    },
                    {
                      id: 'basic',
                      label: 'Terrestre',
                      desc: '8-12 fotos 360°',
                    },
                    {
                      id: 'premium',
                      label: 'Con Drone',
                      desc: 'Terrestre + Aérea',
                    },
                    {
                      id: 'enterprise',
                      label: 'Premium',
                      desc: 'Fotos + Video',
                    },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setCaptureNeeds(option.id as any)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        captureNeeds === option.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-semibold text-slate-900">
                        {option.label}
                      </div>
                      <div className="text-xs text-slate-600 mt-1">
                        {option.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sessions per month - only if capture is needed */}
              {captureNeeds !== 'none' && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    ¿Cuántas sesiones de captura necesitas al mes?
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={sessionsPerMonth}
                      onChange={(e) =>
                        setSessionsPerMonth(parseInt(e.target.value))
                      }
                      className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                    <div className="w-20 text-center">
                      <span className="text-2xl font-bold text-purple-600">
                        {sessionsPerMonth}
                      </span>
                      <span className="text-sm text-slate-600 block">
                        sesiones
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Marketplace usage */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useMarketplace}
                    onChange={(e) => setUseMarketplace(e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 text-purple-500 focus:ring-purple-500"
                  />
                  <div>
                    <div className="font-semibold text-slate-900">
                      Quiero vender en el Marketplace
                    </div>
                    <div className="text-sm text-slate-600">
                      Publica tus propiedades y paga solo cuando vendas
                    </div>
                  </div>
                </label>
              </div>

              {/* Marketplace details - only if marketplace is enabled */}
              {useMarketplace && (
                <div className="pl-8 space-y-4 border-l-4 border-purple-200">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Valor promedio de tus propiedades (millones MXN)
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="1"
                        max="50"
                        value={avgPropertyValue}
                        onChange={(e) =>
                          setAvgPropertyValue(parseInt(e.target.value))
                        }
                        className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                      />
                      <div className="w-24 text-center">
                        <span className="text-2xl font-bold text-purple-600">
                          ${avgPropertyValue}M
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      ¿Cuántas propiedades vendes al año?
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="1"
                        max="20"
                        value={propertiesPerYear}
                        onChange={(e) =>
                          setPropertiesPerYear(parseInt(e.target.value))
                        }
                        className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                      />
                      <div className="w-20 text-center">
                        <span className="text-2xl font-bold text-purple-600">
                          {propertiesPerYear}
                        </span>
                        <span className="text-sm text-slate-600 block">
                          al año
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Next button */}
              <button
                onClick={() => setStep(2)}
                className="w-full mt-8 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-xl flex items-center justify-center gap-2"
              >
                Ver mi Ahorro
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
                ¡Mira cuánto puedes ahorrar!
              </h3>

              {/* Comparison Cards */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Competitor Cost */}
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                  <div className="text-sm font-semibold text-red-600 uppercase mb-2">
                    Con la Competencia
                  </div>
                  <div className="text-4xl font-black text-red-700 mb-4">
                    ${results.competitorCost.toLocaleString()} MXN
                    <span className="text-lg text-red-600 font-normal">
                      /mes
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-red-800">
                    <div>
                      • Software: $
                      {(toursPerMonth > 10
                        ? PRICES.matterportBusiness
                        : PRICES.cloudPanoSoftware
                      ).toLocaleString()}{' '}
                      MXN
                    </div>
                    {captureNeeds !== 'none' && (
                      <div>
                        • Fotógrafo: $
                        {(
                          (captureNeeds === 'basic'
                            ? PRICES.sessionBasic
                            : captureNeeds === 'premium'
                              ? PRICES.sessionAerial
                              : PRICES.sessionMega) * sessionsPerMonth
                        ).toLocaleString()}{' '}
                        MXN
                      </div>
                    )}
                    {useMarketplace && (
                      <div>
                        • Publicación marketplace: $
                        {PRICES.propiedadesComListing.toLocaleString()} MXN
                      </div>
                    )}
                  </div>
                </div>

                {/* PotentiaMX Cost */}
                <div className="bg-green-50 border-2 border-green-400 rounded-xl p-6 relative overflow-hidden">
                  <div className="absolute top-2 right-2">
                    <Sparkles className="w-6 h-6 text-green-500" />
                  </div>
                  <div className="text-sm font-semibold text-green-600 uppercase mb-2">
                    Con PotentiaMX
                  </div>
                  <div className="text-4xl font-black text-green-700 mb-4">
                    ${Math.round(results.potentiaMXCost).toLocaleString()} MXN
                    <span className="text-lg text-green-600 font-normal">
                      /mes
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-2 bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                    <CheckCircle className="w-4 h-4" />
                    Plan {planNames[results.recommendedPlan]}
                  </div>
                </div>
              </div>

              {/* Savings Highlight */}
              <div
                className={`bg-gradient-to-r ${planColors[results.recommendedPlan]} rounded-xl p-8 text-white text-center`}
              >
                <TrendingUp className="w-16 h-16 mx-auto mb-4 animate-pulse" />
                <div className="text-6xl font-black mb-2">
                  ${Math.round(results.monthlySavings).toLocaleString()}
                </div>
                <div className="text-2xl font-semibold mb-4">
                  Ahorro mensual ({Math.round(results.savingsPercentage)}%
                  menos)
                </div>
                <div className="text-xl opacity-90">
                  ${Math.round(results.yearlySavings).toLocaleString()} MXN al
                  año
                </div>
                {results.yearlyMarketplaceSavings > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/30">
                    <div className="text-sm opacity-90 mb-1">
                      Incluye ahorro en comisiones:
                    </div>
                    <div className="text-2xl font-bold">
                      +$
                      {Math.round(
                        results.yearlyMarketplaceSavings,
                      ).toLocaleString()}{' '}
                      MXN/año
                    </div>
                    <div className="text-sm opacity-75 mt-1">
                      (Comisión{' '}
                      {(
                        PRICES.plans[results.recommendedPlan].commission * 100
                      ).toFixed(1)}
                      % vs 6% competencia)
                    </div>
                  </div>
                )}
              </div>

              {/* What's included */}
              <div className="bg-slate-50 rounded-xl p-6">
                <h4 className="font-bold text-slate-900 mb-4 text-lg">
                  ✨ El Plan {planNames[results.recommendedPlan]} incluye:
                </h4>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    `${PRICES.plans[results.recommendedPlan].tours === Infinity ? 'Tours ilimitados' : `Hasta ${PRICES.plans[results.recommendedPlan].tours} tours activos`}`,
                    'Editor visual sin curva de aprendizaje',
                    results.recommendedPlan !== 'free'
                      ? 'Sin marca de agua'
                      : 'Marca de agua PotentiaMX',
                    results.recommendedPlan !== 'free'
                      ? `${PRICES.plans[results.recommendedPlan].sessions === 2 ? '2 sesiones' : PRICES.plans[results.recommendedPlan].sessions >= 1 ? '1 sesión' : '1 sesión cada 3 meses'} de captura profesional incluida/s`
                      : 'Captura disponible a la carta',
                    'Publicación en marketplace GRATIS',
                    `Comisión reducida (${(PRICES.plans[results.recommendedPlan].commission * 100).toFixed(1)}% vs 6%)`,
                    results.recommendedPlan === 'pro' ||
                    results.recommendedPlan === 'business'
                      ? 'Analytics con sugerencias de IA'
                      : 'Analytics básicos',
                    results.recommendedPlan === 'business'
                      ? 'White-label completo'
                      : results.recommendedPlan === 'pro'
                        ? 'Branding personalizado'
                        : '',
                  ]
                    .filter(Boolean)
                    .map((feature, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">{feature}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-all"
                >
                  ← Recalcular
                </button>
                <Link
                  href={`/signup?plan=${results.recommendedPlan}`}
                  className={`flex-1 px-8 py-4 bg-gradient-to-r ${planColors[results.recommendedPlan]} text-white font-bold rounded-lg hover:shadow-2xl transition-all transform hover:scale-105 text-center`}
                >
                  Empezar Ahora con {planNames[results.recommendedPlan]}
                </Link>
              </div>

              {/* Trust badges */}
              <div className="text-center text-sm text-slate-500 mt-4">
                ✓ Sin compromiso • ✓ Cancela cuando quieras • ✓ 14 días de
                prueba gratis
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
