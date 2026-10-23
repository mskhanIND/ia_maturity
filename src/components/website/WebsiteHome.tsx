import React from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';
import { SAUDI_FRAMEWORKS } from '../../data/grcData';
import {
  ShieldCheck,
  CheckCircle2,
  BarChart3,
  FileText,
  Sliders,
  Users,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Lock,
  Building2,
  CalendarCheck
} from 'lucide-react';

export const WebsiteHome: React.FC = () => {
  const { language, setView, setShowAuthModal, setShowConsultationModal, startAssessment, currentUser } = useApp();
  const isAr = language === 'ar';

  const handleStartAssessment = () => {
    if (currentUser.persona === 'guest') {
      setShowAuthModal(true);
    } else {
      setView('portal_assessments');
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#181818] via-[#12242e] to-[#F4F6F8] text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isAr ? 'متوافق مع المعايير العالمية IIA GIAS والأنظمة السعودية' : 'Aligned with IIA GIAS 2024 & Saudi Regulators'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              {t('hero_title', language)}
            </h1>

            <p className="text-base sm:text-lg text-gray-300 max-w-2xl leading-relaxed">
              {t('hero_subtitle', language)}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleStartAssessment}
                className="px-6 py-3.5 rounded-lg bg-[#12506E] hover:bg-[#186287] text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                <span>{t('hero_cta_primary', language)}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
              <button
                onClick={() => setView('website_frameworks')}
                className="px-6 py-3.5 rounded-lg bg-gray-900/80 hover:bg-gray-800 text-cyan-300 border border-gray-700 font-semibold text-sm flex items-center justify-center gap-2 transition-all"
              >
                <span>{t('hero_cta_secondary', language)}</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-700/60 text-xs text-gray-300">
              <div>
                <div className="text-xl font-bold text-white">20 Qs</div>
                <div className="text-gray-400">{isAr ? 'استبيان قياسي في 6 مجالات' : 'Standardized 6 Domains'}</div>
              </div>
              <div>
                <div className="text-xl font-bold text-white">5 Bands</div>
                <div className="text-gray-400">{isAr ? 'من الحرج إلى الرائد' : 'Critical to Leading'}</div>
              </div>
              <div>
                <div className="text-xl font-bold text-white">100% KSA</div>
                <div className="text-gray-400">{isAr ? 'سيادة بيانات سحابية سعودية' : 'Sovereign Cloud Data'}</div>
              </div>
            </div>
          </div>

          {/* Right Hero Visual: Assessment Preview Card */}
          <div className="lg:col-span-5">
            <div className="bg-white text-gray-900 rounded-2xl shadow-2xl p-6 border border-gray-200 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-[#12506E] text-white font-bold flex items-center justify-center text-xs">
                    αX
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      {isAr ? 'مؤشر نضج التدقيق الداخلي' : 'Internal Audit Maturity Index'}
                    </h3>
                    <p className="text-[11px] text-gray-500">Benchmark Model · IIA GIAS</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                  78.8% High
                </span>
              </div>

              {/* Sample Radar/Spectrum Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-600 font-medium">
                  <span>Governance & Ethics</span>
                  <span className="font-bold text-gray-900">83.3%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: '83.3%' }}></div>
                </div>

                <div className="flex justify-between text-xs text-gray-600 font-medium">
                  <span>Risk-Based Planning</span>
                  <span className="font-bold text-gray-900">75.0%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-600 rounded-full" style={{ width: '75%' }}></div>
                </div>

                <div className="flex justify-between text-xs text-gray-600 font-medium">
                  <span>Execution & Skepticism</span>
                  <span className="font-bold text-gray-900">91.7%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '91.7%' }}></div>
                </div>

                <div className="flex justify-between text-xs text-gray-600 font-medium">
                  <span>Regulatory Compliance</span>
                  <span className="font-bold text-gray-900">66.7%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-600 rounded-full" style={{ width: '66.7%' }}></div>
                </div>
              </div>

              {/* Sample Action Callout */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-700 mt-0.5 flex-none" />
                <div>
                  <span className="font-bold">Target Recommendation: </span>
                  Automate issue follow-up tracking with the Audit Committee to achieve Leading (Level D).
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleStartAssessment}
                  className="w-full py-2.5 rounded-lg bg-[#181818] hover:bg-black text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  <span>{isAr ? 'ابدأ تقييم جهتك الآن' : 'Assess Your Entity in 20 Minutes'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Saudi Regulatory Universe Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <h2 className="text-xs uppercase tracking-widest text-[#12506E] font-bold">
            {isAr ? 'الأطر واللوائح الرقابية' : 'Regulatory Alignment'}
          </h2>
          <h3 className="text-2xl font-bold text-gray-900">
            {isAr ? 'منصة واحدة مبنية لمتطلبات المملكة العربية السعودية' : 'Built for the Saudi Regulatory Environment'}
          </h3>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            {isAr
              ? 'مواءمة فورية بين أعمال التدقيق الداخلي ومتطلبات الجهات الإشرافية الرقابية لتفادي الازدواجية وتوحيد جهود الامتثال.'
              : 'Seamless alignment between internal audit, cybersecurity, and regulatory mandates to eliminate assurance silos.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAUDI_FRAMEWORKS.map(fw => (
            <div
              key={fw.id}
              onClick={() => setView('website_frameworks')}
              className="bg-white rounded-xl p-5 border border-gray-200 hover:border-[#12506E] shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${fw.badgeColor}`}>
                  {fw.category}
                </span>
                <span className="text-xs text-gray-400 font-semibold">{fw.version}</span>
              </div>
              <h4 className="font-bold text-sm text-gray-900 leading-snug">
                {isAr ? fw.name_ar : fw.name}
              </h4>
              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                {isAr ? fw.description_ar : fw.description}
              </p>
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-[#12506E] font-semibold">
                <span>{isAr ? fw.authority_ar : fw.authority}</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Platform Modules */}
      <section className="bg-white py-14 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-xs uppercase tracking-widest text-[#12506E] font-bold">
              {isAr ? 'خدمات المنصة وحلول الحوكمة' : 'Integrated Platform Capabilities'}
            </h2>
            <h3 className="text-2xl font-bold text-gray-900">
              {isAr ? 'من التقييم الذاتي إلى تقارير مجلس الإدارة المعتمدة' : 'From Self-Assessment to Verified Board Reporting'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-xl bg-[#F4F6F8] border border-gray-200 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#12506E] text-white flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-gray-900">
                {isAr ? 'تقييم النضج المقارن' : 'Maturity Assessments'}
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {isAr
                  ? 'استبيان 20 سؤالاً باللغتين مع قواعد الحجب (Gating) وتضمين متوسط إغلاق الملاحظات تلقائياً.'
                  : '20-question questionnaire with gating rules, anonymous peer benchmarking, and auto issue closure calculations.'}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#F4F6F8] border border-gray-200 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-800 text-white flex items-center justify-center">
                <Sliders className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-gray-900">
                {isAr ? 'دليل الضوابط الموحد' : 'Unified Control Catalog'}
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {isAr
                  ? 'كتالوج شامل لمتطلبات هيئة الأمن السيبراني وساما وهيئة السوق وسدايا مع إدارة الأدلة والمسؤوليات.'
                  : 'Centralized mapping of NCA ECC, SAMA, CMA, and PDPL controls with ownership, test results, and evidence files.'}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#F4F6F8] border border-gray-200 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-700 text-white flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-gray-900">
                {isAr ? 'إدارة المخاطر والأصول' : 'Enterprise & Cyber Risk'}
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {isAr
                  ? 'مصفوفة تقييم المخاطر 5×5، وتحديد المخاطر الكامنة والمتبقية، وخطط المعالجة المعتمدة.'
                  : '5x5 likelihood-impact matrix, inherent vs. residual scoring, treatment strategies, and asset classification.'}
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#F4F6F8] border border-gray-200 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-800 text-white flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-gray-900">
                {isAr ? 'متابعة خطط المعالجة' : 'Audit Action Tracking'}
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {isAr
                  ? 'تحويل الملاحظات إلى خطط عمل بأولويات محددة (فورية، عالية، متوسطة) وتواريخ استحقاق واضحة.'
                  : 'Automatic generation of corrective actions from findings, assignees, deadlines, and closure verification.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#12506E] text-white rounded-2xl p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-start">
            <h3 className="text-2xl font-bold">
              {isAr ? 'جاهز لقياس نضج وظيفة التدقيق الداخلي في منشأتك؟' : 'Ready to benchmark your Internal Audit maturity?'}
            </h3>
            <p className="text-sm text-cyan-100 max-w-xl">
              {isAr
                ? 'ابدأ التقييم الآن مجاناً، أو اطلب جلسة استشارية متخصصة مع خبراء إرساء لحلول الأعمال.'
                : 'Start the assessment today, or book a consultation with IRSAA certified experts for an external quality assessment (QAIP).'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-none">
            <button
              onClick={handleStartAssessment}
              className="px-6 py-3 bg-white text-[#12506E] hover:bg-gray-100 font-bold rounded-lg text-sm shadow-md transition-colors whitespace-nowrap"
            >
              {isAr ? 'بدء التقييم الذاتي' : 'Start Assessment'}
            </button>
            <button
              onClick={() => setShowConsultationModal(true)}
              className="px-6 py-3 bg-cyan-900/60 hover:bg-cyan-900 text-white border border-cyan-400 font-semibold rounded-lg text-sm transition-colors whitespace-nowrap"
            >
              {isAr ? 'طلب استشارة' : 'Request Consultation'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
