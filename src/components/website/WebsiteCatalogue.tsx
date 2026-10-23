import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TEMPLATE_INFO } from '../../data/templateData';
import { FileCheck, Sparkles, Clock, CheckCircle2, ArrowRight, ShieldCheck, Filter } from 'lucide-react';

export const WebsiteCatalogue: React.FC = () => {
  const { language, setView, setShowAuthModal, currentUser } = useApp();
  const isAr = language === 'ar';
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const surveys = [
    {
      id: 'iia-gias-20q',
      title: TEMPLATE_INFO.name,
      title_ar: 'استبيان معايير التدقيق الداخلي العالمية (20 سؤالاً)',
      framework: 'IIA Global Internal Audit Standards (GIAS 2024)',
      category: 'Internal Audit',
      questionsCount: 20,
      estimatedTime: '20 mins',
      description: 'The core 20-question maturity assessment measuring Governance, Risk-Based Planning, Methodology, Reporting, QAIP, and Strategic Tech Contribution.',
      description_ar: 'التقييم القياسي المعتمد المكون من 20 سؤالاً لقياس الحوكمة والتخطيط ومنهجية الفحص والتقارير وضمان الجودة والامتثال.',
      isFlagship: true,
      status: 'Active / Self-Service',
    },
    {
      id: 'nca-ecc-baseline',
      title: 'NCA ECC-1:2018 Cybersecurity Baseline Assessment',
      title_ar: 'تقييم الامتثال للضوابط الأساسية للأمن السيبراني (NCA ECC)',
      framework: 'National Cybersecurity Authority (NCA)',
      category: 'Cybersecurity',
      questionsCount: 35,
      estimatedTime: '45 mins',
      description: 'Comprehensive gap evaluation against 5 main cybersecurity domains and priority sub-controls for government and critical infrastructure.',
      description_ar: 'تقييم فجوات شامل للمجالات الخمسة الأساسية لضوابط الهيئة الوطنية للأمن السيبراني للجهات الحكومية والخاصة.',
      isFlagship: false,
      status: 'Available with Consultation',
    },
    {
      id: 'sama-csf-readiness',
      title: 'SAMA Cybersecurity Framework Readiness Review',
      title_ar: 'مراجعة الجاهزية لإطار الأمن السيبراني (البنك المركزي السعودي)',
      framework: 'Saudi Central Bank (SAMA)',
      category: 'Banking & Finance',
      questionsCount: 40,
      estimatedTime: '60 mins',
      description: 'Specialized for banks, fintechs, and financing institutions covering governance, third-party risk, cloud computing, and incident response.',
      description_ar: 'مخصص للمصارف وشركات التقنية المالية والتمويل لتغطية الحوكمة ومخاطر الطرف الثالث والحوسبة السحابية.',
      isFlagship: false,
      status: 'Available with Consultation',
    },
    {
      id: 'cma-cg-eval',
      title: 'CMA Audit Committee & Governance Maturity',
      title_ar: 'تقييم نضج لجنة المراجعة والحوكمة (هيئة السوق المالية)',
      framework: 'Capital Market Authority (CMA)',
      category: 'Corporate Governance',
      questionsCount: 25,
      estimatedTime: '30 mins',
      description: 'Evaluates board oversight, independence of audit committees, disclosure practices, and compliance with the Companies Law.',
      description_ar: 'تقييم رقابة مجلس الإدارة واستقلالية لجنة المراجعة وممارسات الإفصاح والامتثال لنظام الشركات ولائحة حوكمة الشركات.',
      isFlagship: false,
      status: 'Active / Self-Service',
    },
    {
      id: 'pdpl-privacy-gap',
      title: 'PDPL Privacy Impact & Readiness Survey',
      title_ar: 'استبيان قياس الجاهزية لنظام حماية البيانات الشخصية (سدايا)',
      framework: 'SDAIA Personal Data Protection Law',
      category: 'Data Privacy',
      questionsCount: 22,
      estimatedTime: '25 mins',
      description: 'Assesses personal data inventory, consent mechanisms, cross-border transfer controls, and DPO operational readiness.',
      description_ar: 'تقييم حصر البيانات الشخصية وآليات الموافقة وضوابط النقل عبر الحدود وجاهزية مسؤول حماية البيانات.',
      isFlagship: false,
      status: 'Active / Self-Service',
    },
  ];

  const filtered = filterCategory === 'All' ? surveys : surveys.filter(s => s.category === filterCategory);

  const handleStartSurvey = (surveyId: string) => {
    if (surveyId === 'iia-gias-20q') {
      if (currentUser.persona === 'guest') {
        setShowAuthModal(true);
      } else {
        setView('portal_assessments');
      }
    } else {
      if (currentUser.persona === 'guest') {
        setShowAuthModal(true);
      } else {
        setView('portal_assessments');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-start space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-xs font-semibold">
          <FileCheck className="w-3.5 h-3.5" />
          <span>{isAr ? 'دليل الاستبيانات والتقييمات المتخصصة' : 'Standardized Assessment & Survey Catalogue'}</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          {isAr ? 'كتالوج التقييمات والاستبيانات الرقابية' : 'Assessment & Survey Catalogue'}
        </h1>
        <p className="text-sm text-gray-600 max-w-3xl leading-relaxed">
          {isAr
            ? 'مجموعة من التقييمات والاستبيانات المصممة وفقاً للممارسات الدولية الصادرة عن معهد المدققين الداخليين ومواءمة مع متطلبات الجهات التنظيمية في المملكة.'
            : 'Pre-configured, versioned diagnostic questionnaires aligned with IIA Standards and Saudi statutory mandates. Responses can be saved, reviewed, and converted into board-ready scorecards.'}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-gray-200 text-xs">
        {['All', 'Internal Audit', 'Cybersecurity', 'Banking & Finance', 'Corporate Governance', 'Data Privacy'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filterCategory === cat
                ? 'bg-[#12506E] text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Surveys */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(survey => (
          <div
            key={survey.id}
            className={`bg-white rounded-xl p-6 border shadow-sm hover:shadow-md transition-all space-y-4 ${
              survey.isFlagship ? 'border-[#12506E] ring-1 ring-[#12506E]/20' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-gray-100 text-gray-800 border border-gray-200">
                {survey.category}
              </span>
              <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                <span className="flex items-center gap-1">
                  <FileCheck className="w-3.5 h-3.5 text-cyan-600" />
                  {survey.questionsCount} Qs
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  {survey.estimatedTime}
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900">
                  {isAr ? survey.title_ar : survey.title}
                </h3>
                {survey.isFlagship && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300">
                    Flagship 20Q
                  </span>
                )}
              </div>
              <div className="text-xs text-[#12506E] font-medium mt-1">
                {survey.framework}
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              {isAr ? survey.description_ar : survey.description}
            </p>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                {survey.status}
              </span>
              <button
                onClick={() => handleStartSurvey(survey.id)}
                className="px-4 py-2 bg-[#12506E] hover:bg-[#0e4058] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <span>{isAr ? 'بدء الاستبيان' : 'Launch Assessment'}</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
