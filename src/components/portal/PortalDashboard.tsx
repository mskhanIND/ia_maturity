import React from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';
import {
  FileCheck2,
  Award,
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Building,
  Plus
} from 'lucide-react';

export const PortalDashboard: React.FC = () => {
  const {
    language,
    setView,
    assessments,
    setActiveAssessmentId,
    auditActions,
    risks,
    controls,
    currentUser,
    subscription
  } = useApp();

  const isAr = language === 'ar';

  const myAssessments = assessments.filter(a => a.entity === currentUser.orgName || true);
  const latestAssessment = myAssessments[0];
  const pendingActions = auditActions.filter(a => a.status === 'Open' || a.status === 'In Progress');
  const highRisks = risks.filter(r => r.residualScore >= 8);
  const activeControls = controls.filter(c => c.status === 'Implemented');

  return (
    <div className="space-y-6 text-start">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-800 border border-cyan-200">
            <Building className="w-3.5 h-3.5" />
            <span>{currentUser.orgName || 'Al-Noor Financial Group'}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isAr ? `مرحباً، ${currentUser.name}` : `Welcome back, ${currentUser.name}`}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            {isAr
              ? 'متابعة شاملة لتقييمات نضج التدقيق الداخلي، سجل المخاطر، حالة الضوابط الرقابية، وخطط معالجة الملاحظات.'
              : 'Governance, Risk, Compliance and Internal Audit overview for your organization.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('portal_assessments')}
            className="px-4 py-2.5 bg-[#12506E] hover:bg-[#0e4058] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'تقييم جديد' : 'New Assessment'}</span>
          </button>
          <button
            onClick={() => setView('portal_scorecard')}
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
          >
            <span>{isAr ? 'عرض بطاقة الأداء' : 'View Scorecard'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Maturity Score */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>{isAr ? 'مؤشر نضج التدقيق' : 'Overall IA Maturity'}</span>
            <Award className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-gray-900">
              {latestAssessment ? `${latestAssessment.overall_score}%` : '—'}
            </span>
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: latestAssessment ? `${latestAssessment.color}15` : '#f3f4f6',
                color: latestAssessment?.color || '#374151'
              }}
            >
              {latestAssessment?.maturity_level || 'N/A'}
            </span>
          </div>
          <div className="text-[11px] text-gray-500 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Higher than 74% of peers</span>
          </div>
        </div>

        {/* Pending Assessments */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>{isAr ? 'التقييمات المسجلة' : 'Active Assessments'}</span>
            <FileCheck2 className="w-4 h-4 text-[#12506E]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-gray-900">{myAssessments.length}</span>
            <span className="text-xs text-gray-500 font-medium">
              ({myAssessments.filter(a => a.docstatus === 1).length} Submitted)
            </span>
          </div>
          <div className="text-[11px] text-gray-500">
            Latest: {latestAssessment?.assessment_date || 'Recent'}
          </div>
        </div>

        {/* Open Audit Findings & Actions */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>{isAr ? 'خطة المعالجة والمتابعة' : 'Open Audit Actions'}</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-gray-900">{pendingActions.length}</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
              {auditActions.filter(a => a.priority === 'Immediate').length} Immediate
            </span>
          </div>
          <div className="text-[11px] text-gray-500">
            {auditActions.filter(a => a.status === 'Completed').length} resolved to date
          </div>
        </div>

        {/* Regulatory Controls */}
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>{isAr ? 'الضوابط المفعلة' : 'Implemented Controls'}</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-gray-900">
              {activeControls.length} / {controls.length}
            </span>
            <span className="text-xs font-bold text-emerald-600">
              {Math.round((activeControls.length / controls.length) * 100)}%
            </span>
          </div>
          <div className="text-[11px] text-gray-500">
            Aligned with NCA ECC & SAMA CSF
          </div>
        </div>
      </div>

      {/* Main Grid: Assessments Overview & Open Action Items */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Assessments Pipeline */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-bold text-sm text-gray-900">
              {isAr ? 'التقييمات الأخيرة وحالة المراجعة' : 'Recent Assessments & Review Status'}
            </h3>
            <button
              onClick={() => setView('portal_assessments')}
              className="text-xs text-[#12506E] font-semibold hover:underline flex items-center gap-1"
            >
              <span>{isAr ? 'عرض الكل' : 'View All'}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>

          <div className="space-y-3">
            {myAssessments.map(asm => (
              <div
                key={asm.id}
                className="p-3.5 rounded-xl border border-gray-200 hover:border-[#12506E] transition-all bg-[#F4F6F8]/50 flex items-center justify-between gap-3"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-gray-900 truncate">{asm.name}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        asm.docstatus === 1
                          ? asm.review_status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-blue-50 text-blue-800 border-blue-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {asm.docstatus === 1 ? asm.review_status : 'Draft / In Progress'}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-500">
                    {asm.assessment_date} · Assessed by {asm.respondent_name}
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-none">
                  <div className="text-end">
                    <div className="text-base font-extrabold text-gray-900">{asm.overall_score}%</div>
                    <div className="text-[10px] font-semibold text-gray-500">{asm.maturity_level}</div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveAssessmentId(asm.id);
                      if (asm.docstatus === 1) {
                        setView('portal_scorecard');
                      } else {
                        setView('portal_take_assessment');
                      }
                    }}
                    className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-[#12506E] hover:text-white transition-colors"
                    title={asm.docstatus === 1 ? 'View Scorecard' : 'Continue Answering'}
                  >
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Priority Audit Actions & Roadmap */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-bold text-sm text-gray-900">
              {isAr ? 'أولويات خارطة طريق التحسين' : 'Improvement Roadmap Actions'}
            </h3>
            <button
              onClick={() => setView('portal_actions')}
              className="text-xs text-[#12506E] font-semibold hover:underline"
            >
              {isAr ? 'إدارة الملاحظات' : 'Manage Actions'}
            </button>
          </div>

          <div className="space-y-3">
            {pendingActions.map(action => (
              <div
                key={action.id}
                className="p-3 rounded-lg border border-gray-200 bg-white space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-bold text-[10px] px-2 py-0.5 rounded ${
                      action.priority === 'Immediate'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {action.priority} Priority
                  </span>
                  <span className="text-gray-400 font-mono text-[11px]">Due: {action.due_date}</span>
                </div>
                <div className="font-semibold text-gray-900 line-clamp-1">{action.finding_title}</div>
                <div className="text-[11px] text-gray-500 line-clamp-2">{action.recommended_action}</div>
                <div className="text-[11px] font-medium text-[#12506E] pt-1">
                  Owner: {action.action_owner}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
