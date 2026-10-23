import React from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/i18n';
import { ShieldCheck, Mail, MapPin, Server } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, setView } = useApp();
  const isAr = language === 'ar';

  return (
    <footer className="bg-[#111618] text-gray-400 text-sm border-t border-gray-800 pt-12 pb-8 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-gray-800 text-start">
          {/* Col 1: About IRSAA GRC */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#12506E] to-[#0a2f42] flex items-center justify-center font-black text-white text-base shadow-sm">
                αX
              </div>
              <span className="font-bold text-lg text-white">
                {t('brand_product', language)}
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              {isAr
                ? 'منصة الحوكمة وإدارة المخاطر والالتزام والتدقيق الداخلي المتوافقة مع معايير IIA GIAS 2024 والأنظمة الرقابية في المملكة العربية السعودية.'
                : 'Enterprise Governance, Risk, Compliance, and Internal Audit platform aligned with IIA GIAS 2024 and the Saudi regulatory landscape.'}
            </p>
            <div className="text-xs text-gray-400 space-y-1.5">
              <div className="flex items-center gap-2 text-cyan-300 font-medium">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>{isAr ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Kingdom of Saudi Arabia'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <a href="mailto:grc@irsaa.sa" className="hover:text-cyan-300">
                  grc@irsaa.sa
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Solutions & Frameworks */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {isAr ? 'الأطر والمعايير' : 'Regulatory Frameworks'}
            </h4>
            <ul className="text-xs space-y-2">
              <li>
                <button onClick={() => setView('website_frameworks')} className="hover:text-cyan-300">
                  NCA Essential Cybersecurity Controls (ECC)
                </button>
              </li>
              <li>
                <button onClick={() => setView('website_frameworks')} className="hover:text-cyan-300">
                  IIA Global Internal Audit Standards (GIAS)
                </button>
              </li>
              <li>
                <button onClick={() => setView('website_frameworks')} className="hover:text-cyan-300">
                  SAMA Cybersecurity Framework (CSF)
                </button>
              </li>
              <li>
                <button onClick={() => setView('website_frameworks')} className="hover:text-cyan-300">
                  CMA Corporate Governance Regulations
                </button>
              </li>
              <li>
                <button onClick={() => setView('website_frameworks')} className="hover:text-cyan-300">
                  SDAIA Personal Data Protection Law (PDPL)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Portal Modules */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {isAr ? 'وحدات المنصة' : 'Platform Modules'}
            </h4>
            <ul className="text-xs space-y-2">
              <li>
                <button onClick={() => setView('portal_assessments')} className="hover:text-cyan-300">
                  Internal Audit Maturity Assessment (20Q)
                </button>
              </li>
              <li>
                <button onClick={() => setView('portal_controls')} className="hover:text-cyan-300">
                  Saudi Unified Control Catalog
                </button>
              </li>
              <li>
                <button onClick={() => setView('portal_risks')} className="hover:text-cyan-300">
                  Enterprise & Cyber Risk Matrix
                </button>
              </li>
              <li>
                <button onClick={() => setView('portal_scorecard')} className="hover:text-cyan-300">
                  Peer Benchmarking & Board Scorecards
                </button>
              </li>
              <li>
                <button onClick={() => setView('portal_activity')} className="hover:text-cyan-300">
                  Audit & Activity Log Trail
                </button>
              </li>
              <li>
                <button onClick={() => setView('admin_settings')} className="hover:text-cyan-300 flex items-center gap-1 text-cyan-400">
                  <Server className="w-3 h-3" />
                  <span>{t('admin_access', language)}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              {isAr ? 'السياسات والضمانات' : 'Governance & Trust'}
            </h4>
            <div className="p-3 bg-gray-900 rounded-lg border border-gray-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Saudi Cloud Data Sovereignty</span>
              </div>
              <p className="text-[11px] text-gray-400">
                Encrypted in transit and at rest. Strict multi-tenant isolation ensures customer data is never shared.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-xs">
              <button onClick={() => setView('website_privacy')} className="hover:text-cyan-300">
                {isAr ? 'إشعار الخصوصية' : 'Privacy Notice'}
              </button>
              <span>·</span>
              <button onClick={() => setView('website_terms')} className="hover:text-cyan-300">
                {isAr ? 'شروط الاستخدام' : 'Terms of Use'}
              </button>
              <span>·</span>
              <button onClick={() => setView('website_faqs')} className="hover:text-cyan-300">
                {isAr ? 'الأسئلة الشائعة' : 'FAQs'}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Clean copyright and explicit location, no deprecated domains or framework mentions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <div>
            {isAr
              ? '© 2026 إرساء لحلول الأعمال. جميع الحقوق محفوظة.'
              : '© 2026 IRSAA Business Solutions. All rights reserved.'}
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>
              {isAr ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Kingdom of Saudi Arabia'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
