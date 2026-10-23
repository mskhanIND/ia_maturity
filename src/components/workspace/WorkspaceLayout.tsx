import React from 'react';
import { useApp, AppView } from '../../context/AppContext';
import { t } from '../../utils/i18n';
import {
  ListFilter,
  Layers,
  FileCheck,
  Users2,
  CheckSquare,
  Shield,
  Clock,
  Sparkles
} from 'lucide-react';

export const WorkspaceLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language, view, setView, currentUser } = useApp();
  const isAr = language === 'ar';

  const wsTabs: { view: AppView; label: string; label_ar: string; icon: React.ElementType }[] = [
    { view: 'workspace_pipeline', label: 'Customer Pipeline (8 Stages)', label_ar: 'مسار تقييمات العملاء (8 مراحل)', icon: ListFilter },
    { view: 'workspace_review_queue', label: 'Review Queue & Approvals', label_ar: 'قائمة المراجعة والاعتماد', icon: FileCheck },
    { view: 'workspace_surveys', label: 'Survey Templates & Versioning', label_ar: 'الاستبيانات والإصدارات', icon: Layers },
    { view: 'workspace_workload', label: 'Consultant Workload Monitor', label_ar: 'توزيع أعباء المستشارين', icon: Users2 },
    { view: 'workspace_confirmations', label: 'Methodology Confirmations (Scope #5)', label_ar: 'تأكيدات المنهجية (البند 5)', icon: CheckSquare },
  ];

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-gray-900 pb-12 text-start">
      {/* Top Banner identifying Internal IRSAA Workspace */}
      <div className="bg-[#0C3A50] text-white py-4 px-4 sm:px-6 lg:px-8 border-b border-cyan-900 shadow-sm no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-gray-950 font-bold flex items-center justify-center text-sm">
              IR
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight">
                  {isAr ? 'مساحة عمل فريق الحوكمة والاستشارات (إرساء)' : 'IRSAA GRC Advisory & Survey Workspace'}
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-400 text-gray-950 uppercase">
                  Staff Only
                </span>
              </div>
              <div className="text-xs text-cyan-200">
                Logged in as <b>{currentUser.name}</b> ({currentUser.roleTitle})
              </div>
            </div>
          </div>

          <div className="text-xs text-cyan-100 flex items-center gap-4">
            <span>Workflow: <b>Draft → In Progress → Submitted → Under Review → Clarification → Resubmitted → Approved → Released</b></span>
          </div>
        </div>
      </div>

      {/* Sub-navigation bar */}
      <div className="bg-white border-b border-gray-200 shadow-xs sticky top-16 z-30 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto gap-2 py-2 text-xs font-bold scrollbar-none">
            {wsTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = view === tab.view;
              return (
                <button
                  key={tab.view}
                  onClick={() => setView(tab.view)}
                  className={`px-3 py-2 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#12506E] text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{isAr ? tab.label_ar : tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Workspace Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {children}
      </main>
    </div>
  );
};
