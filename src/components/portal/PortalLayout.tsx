import React, { useState } from 'react';
import { useApp, AppView } from '../../context/AppContext';
import { t } from '../../utils/i18n';
import {
  LayoutDashboard,
  Building,
  FileCheck2,
  Award,
  Sliders,
  AlertTriangle,
  Server,
  Scale,
  ClipboardList,
  ShieldAlert,
  Settings,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
  Activity,
  Sparkles
} from 'lucide-react';

export const PortalLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language, view, setView, currentUser, organizations, subscription } = useApp();
  const isAr = language === 'ar';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentOrg = organizations.find(o => o.id === currentUser.orgId) || {
    entity_name: currentUser.orgName || 'Al-Noor Financial Group',
    sector: 'Banking & Finance',
  };

  const navItems: { view: AppView; label: string; label_ar: string; icon: React.ElementType }[] = [
    { view: 'portal_dashboard', label: 'Dashboard', label_ar: 'لوحة التحكم', icon: LayoutDashboard },
    { view: 'portal_organization', label: 'Organization', label_ar: 'ملف المنشأة', icon: Building },
    { view: 'portal_assessments', label: 'Assessments & Surveys', label_ar: 'التقييمات والاستبيانات', icon: FileCheck2 },
    { view: 'portal_scorecard', label: 'Scorecards & Reports', label_ar: 'بطاقات الأداء والتقارير', icon: Award },
    { view: 'portal_controls', label: 'Control Catalog', label_ar: 'دليل الضوابط الرقابية', icon: Sliders },
    { view: 'portal_risks', label: 'Risk Management', label_ar: 'إدارة المخاطر', icon: AlertTriangle },
    { view: 'portal_assets', label: 'Asset Risk Register', label_ar: 'سجل مخاطر الأصول', icon: Server },
    { view: 'portal_compliance', label: 'Compliance Management', label_ar: 'إدارة الالتزام', icon: Scale },
    { view: 'portal_actions', label: 'Audit Findings & Actions', label_ar: 'ملاحظات وإجراءات التدقيق', icon: ClipboardList },
    { view: 'portal_secops', label: 'Security Operations', label_ar: 'العمليات السيبرانية', icon: ShieldAlert },
    { view: 'portal_activity', label: 'Audit & Activity Trail', label_ar: 'سجل الأنشطة والتدقيق', icon: Activity },
    { view: 'portal_settings', label: 'Settings', label_ar: 'إعدادات المنشأة', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F4F6F8] flex flex-col md:flex-row text-gray-900">
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between no-print">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-bold text-sm text-gray-900 truncate">
            {currentOrg.entity_name}
          </span>
        </div>
        <span className="text-[11px] font-semibold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
          Client Portal
        </span>
      </div>

      {/* Left Sidebar */}
      <aside
        className={`fixed md:sticky top-16 z-40 h-[calc(100vh-4rem)] w-64 bg-white border-r rtl:border-l rtl:border-r-0 border-gray-200 flex flex-col justify-between transition-transform duration-200 no-print ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 rtl:translate-x-full md:rtl:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Organization Tenant Card */}
          <div className="p-3 bg-gradient-to-r from-gray-50 to-cyan-50/40 rounded-xl border border-gray-200 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
              <Building className="w-3.5 h-3.5 text-[#12506E]" />
              <span className="truncate">{currentOrg.sector}</span>
            </div>
            <h4 className="font-bold text-sm text-gray-900 leading-tight truncate">
              {currentOrg.entity_name}
            </h4>
            <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Isolated Organization Tenant</span>
            </div>
          </div>

          {/* Trial status badge in sidebar */}
          {subscription.plan_tier === 'trial' && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1.5 text-xs text-start">
              <div className="flex items-center justify-between font-bold text-amber-900 text-[11px]">
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>{isAr ? 'النسخة التجريبية (14 يوماً)' : '14-Day Evaluation'}</span>
                </div>
                <span className="px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 font-mono text-[10px] font-bold">
                  {subscription.days_remaining}d left
                </span>
              </div>
              <div className="w-full bg-amber-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-amber-600 h-1.5 rounded-full"
                  style={{ width: `${Math.min(100, (subscription.used_assessments / subscription.max_assessments) * 100)}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-[10px] text-amber-800">
                <span>{subscription.used_assessments}/{subscription.max_assessments} {isAr ? 'تقييمات' : 'assessments'}</span>
                <button
                  onClick={() => setView('admin_settings')}
                  className="font-bold underline hover:text-amber-950"
                >
                  {isAr ? 'ترقية / تعديل' : 'Manage'}
                </button>
              </div>
            </div>
          )}

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = view === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => {
                    setView(item.view);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#12506E] text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                    <span>{isAr ? item.label_ar : item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card at bottom of sidebar */}
        <div className="p-4 border-t border-gray-200 bg-gray-50/80 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#12506E] text-white font-bold flex items-center justify-center text-xs">
              {currentUser.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1 text-start">
              <div className="text-xs font-bold text-gray-900 truncate">{currentUser.name}</div>
              <div className="text-[11px] text-gray-500 truncate">{currentUser.roleTitle}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
};
