import React from 'react';
import { useApp } from '../../context/AppContext';
import { SAUDI_FRAMEWORKS } from '../../data/grcData';
import { Scale, CheckCircle2, Clock, AlertTriangle, ArrowRight } from 'lucide-react';

export const PortalCompliance: React.FC = () => {
  const { language, setView, setShowConsultationModal } = useApp();
  const isAr = language === 'ar';

  const complianceReadiness = [
    { id: 'iia-gias', name: 'IIA Global Internal Audit Standards (GIAS 2024)', pct: 85, status: 'High Alignment', authority: 'IIA' },
    { id: 'nca-ecc', name: 'NCA Essential Cybersecurity Controls (ECC-1:2018)', pct: 78, status: 'Substantial Compliance', authority: 'NCA' },
    { id: 'cma-cgr', name: 'CMA Corporate Governance Regulations', pct: 92, status: 'Fully Compliant', authority: 'CMA' },
    { id: 'sama-csf', name: 'SAMA Cybersecurity Framework', pct: 74, status: 'In Progress', authority: 'SAMA' },
    { id: 'pdpl-sdaia', name: 'Personal Data Protection Law (PDPL)', pct: 68, status: 'Gap Remediation Underway', authority: 'SDAIA' },
  ];

  return (
    <div className="space-y-6 text-start max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isAr ? 'إدارة الالتزام والامتثال الرقابي' : 'Compliance & Regulatory Readiness'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            {isAr
              ? 'متابعة الجاهزية والامتثال للمتطلبات الوطنية الصادرة عن هيئة السوق المالية وساما وهيئة الأمن السيبراني وسدايا.'
              : 'Continuous diagnostic mapping of organization compliance posture across key Saudi regulators.'}
          </p>
        </div>

        <button
          onClick={() => setShowConsultationModal(true)}
          className="px-4 py-2 bg-[#12506E] hover:bg-[#0e4058] text-white text-xs font-bold rounded-lg shadow-sm whitespace-nowrap self-start sm:self-auto"
        >
          {isAr ? 'طلب تدقيق امتثال خارجي' : 'Request Readiness Audit'}
        </button>
      </div>

      {/* Compliance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {complianceReadiness.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xs text-[#12506E] bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                {item.authority}
              </span>
              <span className="text-xs font-bold text-gray-900">{item.pct}% Readiness</span>
            </div>

            <h3 className="font-bold text-sm text-gray-900">{item.name}</h3>

            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#12506E] h-full rounded-full transition-all duration-300"
                style={{ width: `${item.pct}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-100">
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{item.status}</span>
              </span>
              <button
                onClick={() => setView('portal_controls')}
                className="text-[#12506E] font-bold hover:underline flex items-center gap-1"
              >
                <span>View Controls</span>
                <ArrowRight className="w-3 h-3 rtl:rotate-180" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
