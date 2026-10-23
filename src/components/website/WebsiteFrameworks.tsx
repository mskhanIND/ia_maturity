import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SAUDI_FRAMEWORKS, SaudiFramework } from '../../data/grcData';
import { Shield, Building, Filter, CheckCircle, ExternalLink, HelpCircle } from 'lucide-react';

export const WebsiteFrameworks: React.FC = () => {
  const { language, setShowConsultationModal } = useApp();
  const isAr = language === 'ar';

  const [selectedSector, setSelectedSector] = useState<string>('All');

  const sectors = [
    'All',
    'Banking & Finance',
    'Government',
    'Listed Companies',
    'Healthcare',
    'Energy & Utilities',
    'Logistics & Transport',
  ];

  const filteredFrameworks = selectedSector === 'All'
    ? SAUDI_FRAMEWORKS
    : SAUDI_FRAMEWORKS.filter(fw =>
        fw.sectors.includes(selectedSector) || fw.sectors.includes('All Entities')
      );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-start space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
          <Shield className="w-3.5 h-3.5" />
          <span>{isAr ? 'منظومة الامتثال والأطر الوطنية السعودية' : 'Saudi Regulatory Frameworks Directory'}</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          {isAr ? 'الأطر والمعايير الرقابية في المملكة العربية السعودية' : 'Saudi Regulatory Frameworks & Sector Applicability'}
        </h1>
        <p className="text-sm text-gray-600 max-w-3xl leading-relaxed">
          {isAr
            ? 'دليل استرشادي لتحديد الأطر الإلزامية والاسترشادية المطبقة على منشأتك بحسب قطاع عملها، ومواءمة متطلبات التدقيق الداخلي مع معايير الهيئة الوطنية للأمن السيبراني وساما وهيئة السوق وسدايا.'
            : 'Interactive sector-based mapping of regulatory compliance mandates. Discover which standards apply to your organization and how the IRSAA GRC platform unifies control evidence across regulators.'}
        </p>
      </div>

      {/* Sector Filter Bar */}
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
          <Filter className="w-4 h-4 text-[#12506E]" />
          <span>{isAr ? 'تصفية الأطر بحسب قطاع منشأتك:' : 'Filter Applicable Frameworks by Sector:'}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {sectors.map(sec => (
            <button
              key={sec}
              onClick={() => setSelectedSector(sec)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedSector === sec
                  ? 'bg-[#12506E] text-white shadow-sm'
                  : 'bg-[#F4F6F8] text-gray-700 hover:bg-gray-200'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Frameworks Detailed Cards */}
      <div className="space-y-6">
        {filteredFrameworks.map(fw => (
          <div
            key={fw.id}
            className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${fw.badgeColor}`}>
                    {fw.category}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">Version {fw.version}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mt-1">
                  {isAr ? fw.name_ar : fw.name}
                </h3>
                <div className="text-xs font-semibold text-[#12506E]">
                  {isAr ? fw.authority_ar : fw.authority}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                  {fw.totalControls} Controls
                </span>
                <button
                  onClick={() => setShowConsultationModal(true)}
                  className="px-3.5 py-1.5 bg-[#12506E] hover:bg-[#0e4058] text-white text-xs font-bold rounded-lg transition-colors whitespace-nowrap"
                >
                  {isAr ? 'طلب مواءمة الضوابط' : 'Map My Controls'}
                </button>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {isAr ? fw.description_ar : fw.description}
            </p>

            <div className="pt-2">
              <div className="text-xs font-bold text-gray-700 mb-2">
                {isAr ? 'القطاعات المشمولة بالالتزام:' : 'Mandatory / Applicable Sectors:'}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {fw.sectors.map(s => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#F4F6F8] text-gray-700 border border-gray-200 flex items-center gap-1"
                  >
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    <span>{s}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Advisory Note */}
      <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-amber-700 flex-none mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold">Important Governance Disclaimer: </span>
          Maturity assessment scores and diagnostic results provide self-evaluation and gap analysis insights. They do not automatically constitute formal regulatory certification or compliance endorsement by statutory authorities.
        </div>
      </div>
    </div>
  );
};
