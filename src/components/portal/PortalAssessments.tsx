import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';
import { RESPONDENT_ROLES, TEMPLATE_INFO } from '../../data/templateData';
import { AssessmentDoc } from '../../types';
import {
  FileCheck2,
  Plus,
  Search,
  Filter,
  ArrowRight,
  Eye,
  Trash2,
  AlertCircle,
  Building,
  CheckCircle2,
  Clock,
  Edit3,
  Send,
  ClipboardCheck,
  MessageSquareQuote,
  Award,
  ShieldCheck,
  FileText,
  Activity,
  Calendar,
  User,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface LifecycleStageInfo {
  step: number;
  label: string;
  labelAr: string;
  subLabel: string;
  subLabelAr: string;
  icon: React.ComponentType<{ className?: string }>;
}

const LIFECYCLE_STAGES: LifecycleStageInfo[] = [
  {
    step: 1,
    label: 'Questionnaire Drafting',
    labelAr: 'إعداد المسودة والإجابة',
    subLabel: 'Respond to 20 domains & attach proof',
    subLabelAr: 'إجابة أسئلة المعايير وإرفاق الأدلة',
    icon: Edit3,
  },
  {
    step: 2,
    label: 'Submission & Intake',
    labelAr: 'الإرسال وقائمة الفرز',
    subLabel: 'Queued for GRC consultant allocation',
    subLabelAr: 'توزيع التقييم على مستشاري إرساء',
    icon: Send,
  },
  {
    step: 3,
    label: 'Technical GRC Review',
    labelAr: 'الفحص والمراجعة الفنية',
    subLabel: 'Evidence audit & scoring verification',
    subLabelAr: 'فحص الأدلة وتدقيق القواعد والدرجات',
    icon: ClipboardCheck,
  },
  {
    step: 4,
    label: 'Clarification & Verification',
    labelAr: 'الاستيضاح والتحقق',
    subLabel: 'Address feedback or final check',
    subLabelAr: 'تلبية ملاحظات المراجع والتحقق',
    icon: MessageSquareQuote,
  },
  {
    step: 5,
    label: 'Approved & Report Released',
    labelAr: 'الاعتماد وإصدار التقرير',
    subLabel: 'Official executive report unlocked',
    subLabelAr: 'اعتماد رسمي وإصدار تقرير الإدارة',
    icon: Award,
  },
];

function getLifecycleProgress(asm: AssessmentDoc) {
  // Determine current active stage (1 to 5)
  let currentStage = 1;
  let statusText = 'Draft in Progress';
  let statusTextAr = 'مسودة قيد الاستكمال';
  let badgeColor = 'amber';
  let nextAction = `Complete remaining ${asm.question_count - asm.answered_count} questions to submit for review.`;
  let nextActionAr = `استكمال إجابة ${asm.question_count - asm.answered_count} سؤالاً متبقياً لتقديم التقييم.`;
  let ctaLabel = 'Resume Assessment';
  let ctaLabelAr = 'متابعة الإجابة';
  let ctaView = 'portal_take_assessment';

  if (asm.docstatus === 0) {
    currentStage = 1;
    if (asm.answered_count === 0) {
      statusText = 'Draft Not Started';
      statusTextAr = 'مسودة لم تبدأ';
      nextAction = 'Start answering the 20 IIA GIAS questions.';
      nextActionAr = 'ابدأ الإجابة على أسئلة المعايير العالمية العشرين.';
    }
  } else if (asm.review_status === 'Pending Review') {
    currentStage = 2;
    statusText = 'Submitted to Intake Queue';
    statusTextAr = 'تم الإرسال لقائمة الفرز';
    badgeColor = 'blue';
    nextAction = 'Assessment submitted! IRSAA Advisory lead is allocating your review to a senior consultant.';
    nextActionAr = 'تم استلام التقييم بنجاح وجاري تعيين مستشار الحوكمة المعتمد لفحصه.';
    ctaLabel = 'Preview Submission';
    ctaLabelAr = 'معاينة الإجابات';
    ctaView = 'portal_scorecard';
  } else if (asm.review_status === 'Under Review' || asm.review_status === 'Reviewed') {
    currentStage = 3;
    statusText = `Under Technical Review (${asm.reviewer || 'IRSAA Consultant'})`;
    statusTextAr = `قيد الفحص والمراجعة (${asm.reviewer || 'مستشار إرساء'})`;
    badgeColor = 'blue';
    nextAction = `Auditing responses and evidence files. Preliminary Score: ${asm.overall_score}%.`;
    nextActionAr = `يقوم المستشار بتدقيق الأدلة والوثائق. النتيجة الأولية: ${asm.overall_score}%.`;
    ctaLabel = 'View Preliminary Scorecard';
    ctaLabelAr = 'عرض بطاقة الأداء الأولية';
    ctaView = 'portal_scorecard';
  } else if (asm.review_status === 'Clarification Required') {
    currentStage = 4;
    statusText = 'Clarification & Revision Required';
    statusTextAr = 'مطلوب استيضاح وتعديل';
    badgeColor = 'orange';
    nextAction = asm.reviewer_comments || 'Reviewer noted clarifications required on specific domain questions. Please review comments and resubmit.';
    nextActionAr = asm.reviewer_comments || 'دوّن المستشار استفسارات على بعض الأسئلة والأدلة. يرجى توضيحها وإعادة الإرسال.';
    ctaLabel = 'Respond to Feedback';
    ctaLabelAr = 'الرد على الاستفسارات';
    ctaView = 'portal_take_assessment';
  } else if (asm.review_status === 'Resubmitted') {
    currentStage = 4;
    statusText = 'Resubmitted – Under Verification';
    statusTextAr = 'أعيد الإرسال – قيد الفحص النهائي';
    badgeColor = 'blue';
    nextAction = 'Updated answers received by GRC reviewer for final check.';
    nextActionAr = 'تم استلام التعديلات والمستندات وجاري التحقق النهائي منها.';
    ctaLabel = 'View Updated Submission';
    ctaLabelAr = 'عرض التقييم المحدث';
    ctaView = 'portal_scorecard';
  } else if (asm.review_status === 'Approved' || asm.review_status === 'Report Released') {
    currentStage = 5;
    statusText = 'Approved & Signed Off';
    statusTextAr = 'معتمد وموقع رسمياً';
    badgeColor = 'emerald';
    nextAction = `Signed off by ${asm.reviewer || 'GRC Director'} on ${asm.reviewed_on || asm.modified}. Official executive report is unlocked for board reporting.`;
    nextActionAr = `تم التوقيع والاعتماد النهائي من ${asm.reviewer || 'مدير الحوكمة'}. التقرير الرسمي متاح للتنزيل والعرض على مجلس الإدارة.`;
    ctaLabel = 'View Official Scorecard & PDF';
    ctaLabelAr = 'عرض التقرير الرسمي وتنزيل PDF';
    ctaView = 'portal_scorecard';
  }

  return {
    currentStage,
    statusText,
    statusTextAr,
    badgeColor,
    nextAction,
    nextActionAr,
    ctaLabel,
    ctaLabelAr,
    ctaView,
    pctComplete: Math.round((currentStage / 5) * 100),
  };
}

export const PortalAssessments: React.FC = () => {
  const {
    language,
    setView,
    assessments,
    activeAssessment,
    setActiveAssessmentId,
    startAssessment,
    currentUser,
    activityLogs
  } = useApp();

  const isAr = language === 'ar';
  const [activeTab, setActiveTab] = useState<'assessments' | 'audit_trail'>('assessments');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showNewModal, setShowNewModal] = useState(false);

  // Selected assessment for the top progress tracker (defaults to activeAssessment or first assessment)
  const [selectedAsmId, setSelectedAsmId] = useState<string>(
    activeAssessment?.id || assessments[0]?.id || ''
  );

  const trackerAssessment = assessments.find(a => a.id === selectedAsmId) || assessments[0] || null;
  const trackerInfo = trackerAssessment ? getLifecycleProgress(trackerAssessment) : null;

  // New assessment dialog state
  const [entityName, setEntityName] = useState(currentUser.orgName || 'Al-Noor Financial Group');
  const [role, setRole] = useState(currentUser.roleTitle || 'Chief Audit Executive');
  const [jobTitle, setJobTitle] = useState('Chief Audit Executive');
  const [assessmentLang, setAssessmentLang] = useState<'en' | 'ar'>(language);

  const filteredAssessments = assessments.filter(asm => {
    const matchesSearch = asm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asm.entity.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (statusFilter === 'Draft') return asm.docstatus === 0;
    if (statusFilter === 'Submitted') return asm.docstatus === 1;
    if (statusFilter === 'Approved') return asm.review_status === 'Approved' || asm.review_status === 'Report Released';
    return true;
  });

  // Filter activity logs related to assessments
  const assessmentLogs = activityLogs.filter(
    l => l.action.startsWith('ASSESSMENT_') || l.action === 'REPORT_DOWNLOAD' || l.action === 'EVIDENCE_UPLOAD'
  );

  const handleStartSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = startAssessment(entityName, role, jobTitle, assessmentLang);
    setSelectedAsmId(newId);
    setShowNewModal(false);
  };

  return (
    <div className="space-y-6 text-start max-w-6xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isAr ? 'التقييمات والاستبيانات' : 'Assessments & Diagnostic Surveys'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            {isAr
              ? 'متابعة دورة حياة تقييم نضج التدقيق الداخلي خطوة بخطوة من المسودة حتى الاعتماد الرسمي.'
              : 'End-to-end assessment lifecycle tracking from drafting to formal IRSAA GRC sign-off.'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowNewModal(true)}
            className="px-4 py-2.5 bg-[#12506E] hover:bg-[#0e4058] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'بدء تقييم جديد' : 'Start New Assessment'}</span>
          </button>
        </div>
      </div>

      {/* Primary Tab Navigation */}
      <div className="flex border-b border-gray-200 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('assessments')}
          className={`pb-3 px-2 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'assessments'
              ? 'border-[#12506E] text-[#12506E]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>{isAr ? 'التقييمات ومسار التقدم' : 'Assessments & Lifecycle Progress'}</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-gray-100 text-gray-700">
            {assessments.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('audit_trail')}
          className={`pb-3 px-2 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'audit_trail'
              ? 'border-[#12506E] text-[#12506E]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>{isAr ? 'سجل تدقيق العمليات (Audit Trail)' : 'Assessment Audit Trail'}</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-50 text-blue-700 font-bold">
            {assessmentLogs.length} events
          </span>
        </button>
      </div>

      {activeTab === 'assessments' && (
        <div className="space-y-6">
          {/* =========================================================
              VISUAL PROGRESS TIMELINE CARD (Lifecycle Progress Tracker)
             ========================================================= */}
          {trackerAssessment && trackerInfo && (
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-200 shadow-sm space-y-6">
              {/* Timeline Header & Assessment Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <h2 className="text-sm sm:text-base font-bold text-gray-900">
                      {isAr ? 'مؤشر مسار التقدم في دورة حياة التقييم' : 'Assessment Lifecycle Progress Tracker'}
                    </h2>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-[#12506E]/10 text-[#12506E]">
                      {trackerInfo.pctComplete}% {isAr ? 'مكتمل' : 'Complete'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {isAr
                      ? `التقييم المعروض: ${trackerAssessment.name} (${trackerAssessment.entity}) · معايير IIA GIAS العالمية`
                      : `Tracking active lifecycle for: ${trackerAssessment.name} (${trackerAssessment.entity}) · IIA GIAS Standards`}
                  </p>
                </div>

                {/* Inline Assessment Switcher */}
                {assessments.length > 1 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 font-semibold">{isAr ? 'التقييم:' : 'Select:'}</span>
                    <select
                      value={selectedAsmId}
                      onChange={e => {
                        setSelectedAsmId(e.target.value);
                        setActiveAssessmentId(e.target.value);
                      }}
                      className="text-xs px-3 py-1.5 border border-gray-300 rounded-lg bg-gray-50 font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#12506E]"
                    >
                      {assessments.map(a => (
                        <option key={a.id} value={a.id}>
                          {a.name} · {a.entity} ({a.review_status})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Stepped Visual Timeline (Horizontal on md+, clean stacked on mobile) */}
              <div className="py-2">
                <div className="relative">
                  {/* Background connecting bar for desktop */}
                  <div className="hidden md:block absolute top-5 left-10 right-10 h-1 bg-gray-200 z-0">
                    <div
                      className="h-full bg-emerald-600 transition-all duration-500"
                      style={{
                        width: `${((trackerInfo.currentStage - 1) / (LIFECYCLE_STAGES.length - 1)) * 100}%`,
                      }}
                    ></div>
                  </div>

                  {/* 5 Stage Nodes */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-2 relative z-10">
                    {LIFECYCLE_STAGES.map((st, idx) => {
                      const isCompleted = trackerInfo.currentStage > st.step;
                      const isCurrent = trackerInfo.currentStage === st.step;
                      const isUpcoming = trackerInfo.currentStage < st.step;
                      const IconComp = st.icon;

                      return (
                        <div
                          key={st.step}
                          className={`flex md:flex-col items-center md:items-center text-start md:text-center gap-3 md:gap-2 p-2.5 rounded-xl transition-all ${
                            isCurrent
                              ? 'bg-blue-50/80 border border-blue-200 ring-2 ring-blue-500/20'
                              : isCompleted
                              ? 'bg-gray-50/60'
                              : 'opacity-60'
                          }`}
                        >
                          {/* Node Circle */}
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs flex-none transition-all shadow-sm ${
                              isCompleted
                                ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                                : isCurrent
                                ? 'bg-[#12506E] text-white ring-4 ring-blue-200 animate-pulse'
                                : 'bg-white border-2 border-gray-300 text-gray-400'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-white" />
                            ) : (
                              <IconComp className="w-5 h-5" />
                            )}
                          </div>

                          {/* Stage Text */}
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 md:justify-center">
                              <span
                                className={`text-xs font-bold leading-tight ${
                                  isCurrent
                                    ? 'text-[#12506E]'
                                    : isCompleted
                                    ? 'text-gray-900'
                                    : 'text-gray-500'
                                }`}
                              >
                                {isAr ? st.labelAr : st.label}
                              </span>
                            </div>

                            <p className="text-[10px] text-gray-500 hidden sm:block leading-tight">
                              {isAr ? st.subLabelAr : st.subLabel}
                            </p>

                            {/* State Label Tag */}
                            <div className="pt-0.5">
                              {isCompleted && (
                                <span className="inline-block text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                  {isAr ? 'مكتمل' : 'Completed'}
                                </span>
                              )}
                              {isCurrent && (
                                <span className="inline-block text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#12506E] text-white">
                                  {isAr ? 'المرحلة الحالية' : 'Current Stage'}
                                </span>
                              )}
                              {isUpcoming && (
                                <span className="inline-block text-[9px] font-semibold text-gray-400 uppercase">
                                  {isAr ? 'المرحلة القادمة' : 'Upcoming'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Next Required Action Dynamic Banner */}
              <div
                className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm ${
                  trackerInfo.currentStage === 5
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : trackerInfo.currentStage === 4
                    ? 'bg-orange-50 border-orange-300 text-orange-950'
                    : trackerInfo.currentStage === 1
                    ? 'bg-amber-50 border-amber-300 text-amber-950'
                    : 'bg-cyan-50 border-cyan-300 text-cyan-950'
                }`}
              >
                <div className="flex items-start gap-3">
                  {trackerInfo.currentStage === 5 ? (
                    <ShieldCheck className="w-5 h-5 text-emerald-700 flex-none mt-0.5" />
                  ) : trackerInfo.currentStage === 4 ? (
                    <AlertCircle className="w-5 h-5 text-orange-700 flex-none mt-0.5" />
                  ) : trackerInfo.currentStage === 1 ? (
                    <Edit3 className="w-5 h-5 text-amber-700 flex-none mt-0.5" />
                  ) : (
                    <Clock className="w-5 h-5 text-cyan-700 flex-none mt-0.5" />
                  )}
                  <div>
                    <div className="font-extrabold text-xs uppercase tracking-wider">
                      {isAr ? 'الحالة الحالية والإجراء المطلوب:' : 'Current Status & Required Next Action:'}
                    </div>
                    <div className="text-xs font-semibold mt-0.5">
                      {isAr ? trackerInfo.nextActionAr : trackerInfo.nextAction}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveAssessmentId(trackerAssessment.id);
                    setView(trackerInfo.ctaView as any);
                  }}
                  className={`px-4 py-2 text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 whitespace-nowrap flex-none transition-colors ${
                    trackerInfo.currentStage === 5
                      ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                      : 'bg-[#12506E] hover:bg-[#0e4058] text-white'
                  }`}
                >
                  <span>{isAr ? trackerInfo.ctaLabelAr : trackerInfo.ctaLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </button>
              </div>
            </div>
          )}

          {/* Filter & Search Bar */}
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 rtl:right-3 rtl:left-auto" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder={isAr ? 'بحث بالاسم أو المنشأة...' : 'Search by assessment name or entity...'}
                className="w-full pl-9 pr-3 rtl:pr-9 rtl:pl-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12506E] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500 font-semibold">{isAr ? 'تصفية الحالة:' : 'Filter:'}</span>
              {['All', 'Draft', 'Submitted', 'Approved'].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                    statusFilter === st
                      ? 'bg-[#12506E] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Table of Assessments with Lifecycle Stage Column */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[11px]">
                    <th className="p-3.5 text-start">{isAr ? 'التقييم / المرجع' : 'Assessment Reference'}</th>
                    <th className="p-3.5 text-start">{isAr ? 'المنشأة' : 'Assessed Entity'}</th>
                    <th className="p-3.5 text-start">{isAr ? 'مرحلة دورة الحياة' : 'Lifecycle Stage (1 to 5)'}</th>
                    <th className="p-3.5 text-start">{isAr ? 'الحالة ومسار المراجعة' : 'Review Status'}</th>
                    <th className="p-3.5 text-start">{isAr ? 'النتيجة والنضج' : 'Score / Band'}</th>
                    <th className="p-3.5 text-end">{isAr ? 'الإجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAssessments.map(asm => {
                    const isDraft = asm.docstatus === 0;
                    const stageData = getLifecycleProgress(asm);
                    const isSelected = asm.id === selectedAsmId;

                    return (
                      <tr
                        key={asm.id}
                        onClick={() => setSelectedAsmId(asm.id)}
                        className={`transition-colors cursor-pointer ${
                          isSelected ? 'bg-cyan-50/50 hover:bg-cyan-50' : 'hover:bg-gray-50/80'
                        }`}
                      >
                        <td className="p-3.5">
                          <div className="font-bold text-gray-900 flex items-center gap-1.5">
                            <span>{asm.name}</span>
                            {isSelected && (
                              <span className="w-2 h-2 rounded-full bg-[#12506E]"></span>
                            )}
                          </div>
                          <div className="text-[11px] text-gray-400">
                            {asm.template} · {asm.answered_count} / {asm.question_count} answered
                          </div>
                        </td>

                        <td className="p-3.5 text-gray-700 font-medium">
                          {asm.entity}
                          <div className="text-[10px] text-gray-400">{asm.assessment_date}</div>
                        </td>

                        {/* Lifecycle Stage Column with Progress Bar */}
                        <td className="p-3.5">
                          <div className="space-y-1 w-36">
                            <div className="flex items-center justify-between text-[11px] font-bold">
                              <span className="text-[#12506E]">
                                Stage {stageData.currentStage}/5
                              </span>
                              <span className="text-gray-500 font-semibold">{stageData.pctComplete}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                  stageData.currentStage === 5
                                    ? 'bg-emerald-600'
                                    : stageData.currentStage >= 3
                                    ? 'bg-[#12506E]'
                                    : 'bg-amber-500'
                                }`}
                                style={{ width: `${stageData.pctComplete}%` }}
                              ></div>
                            </div>
                            <div className="text-[10px] text-gray-500 truncate">
                              {LIFECYCLE_STAGES[stageData.currentStage - 1]?.label}
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                              asm.docstatus === 1
                                ? asm.review_status === 'Approved'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : asm.review_status === 'Clarification Required'
                                  ? 'bg-orange-50 text-orange-800 border-orange-200'
                                  : 'bg-blue-50 text-blue-800 border-blue-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}
                          >
                            {asm.docstatus === 1 ? (
                              asm.review_status === 'Approved' ? (
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Clock className="w-3 h-3 text-blue-600" />
                              )
                            ) : (
                              <AlertCircle className="w-3 h-3 text-amber-600" />
                            )}
                            <span>{asm.docstatus === 1 ? asm.review_status : 'Draft in Progress'}</span>
                          </span>
                        </td>

                        <td className="p-3.5">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-gray-900">{asm.overall_score}%</span>
                            <span
                              className="px-2 py-0.5 rounded text-[10px] font-bold"
                              style={{ backgroundColor: `${asm.color}15`, color: asm.color }}
                            >
                              {asm.maturity_level}
                            </span>
                          </div>
                        </td>

                        <td className="p-3.5 text-end">
                          <div className="flex items-center justify-end gap-1.5">
                            {isDraft ? (
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  setActiveAssessmentId(asm.id);
                                  setView('portal_take_assessment');
                                }}
                                className="px-3 py-1.5 bg-[#12506E] hover:bg-[#0e4058] text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                              >
                                <span>{isAr ? 'متابعة' : 'Resume'}</span>
                                <ArrowRight className="w-3 h-3 rtl:rotate-180" />
                              </button>
                            ) : (
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  setActiveAssessmentId(asm.id);
                                  setView('portal_scorecard');
                                }}
                                className="px-3 py-1.5 bg-gray-100 hover:bg-[#12506E] hover:text-white text-gray-800 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                              >
                                <Eye className="w-3 h-3" />
                                <span>{isAr ? 'تقرير الأداء' : 'Scorecard'}</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 2: ASSESSMENT AUDIT TRAIL
         ========================================================= */}
      {activeTab === 'audit_trail' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#12506E]" />
                <span>{isAr ? 'سجل تدقيق التقييمات والأدلة' : 'Assessment Audit & Activity Log'}</span>
              </h3>
              <p className="text-xs text-gray-500">
                {isAr
                  ? 'سجل زمني لعمليات إرسال التقييمات، حفظ المسودات، إرفاق الأدلة وتنزيل التقارير الرسمية لأغراض التدقيق والامتثال.'
                  : 'Immutable audit trail of submissions, draft saves, evidence attachments, and report downloads.'}
              </p>
            </div>
            <span className="text-xs font-bold text-gray-500">
              {assessmentLogs.length} {isAr ? 'عملية مسجلة' : 'Recorded Events'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[11px]">
                  <th className="p-3 text-start">Timestamp</th>
                  <th className="p-3 text-start">Actor / Role</th>
                  <th className="p-3 text-start">Action Type</th>
                  <th className="p-3 text-start">Audit Details</th>
                  <th className="p-3 text-start">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {assessmentLogs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50/70">
                    <td className="p-3 font-mono text-[11px] text-gray-500 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-gray-900">{log.userName}</div>
                      <div className="text-[10px] text-gray-500">{log.userRole}</div>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.action === 'ASSESSMENT_SUBMIT'
                            ? 'bg-blue-100 text-blue-800'
                            : log.action === 'REPORT_DOWNLOAD'
                            ? 'bg-emerald-100 text-emerald-800'
                            : log.action === 'EVIDENCE_UPLOAD'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isAr ? log.actionLabelAr : log.actionLabel}
                      </span>
                    </td>
                    <td className="p-3 text-gray-700 leading-relaxed max-w-md">
                      {isAr ? log.detailsAr : log.details}
                      {log.ipAddress && (
                        <span className="block text-[10px] text-gray-400 font-mono mt-0.5">
                          Session IP: {log.ipAddress}
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Verified</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Start New Assessment Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200">
            <div className="bg-[#12506E] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">
                {isAr ? 'بدء تقييم نضج جديد (20 سؤالاً)' : 'Start New Maturity Assessment (20 Qs)'}
              </h3>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-cyan-200 hover:text-white p-1 rounded-md"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleStartSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  {isAr ? 'المنشأة محل التقييم *' : 'Assessed Entity Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={entityName}
                  onChange={e => setEntityName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12506E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  {isAr ? 'صفة المشارك في التقييم *' : 'Respondent Role / Perspective *'}
                </label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12506E] focus:outline-none"
                >
                  {RESPONDENT_ROLES.map(r => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  {isAr ? 'المسمى الوظيفي *' : 'Job Title *'}
                </label>
                <input
                  type="text"
                  required
                  value={jobTitle}
                  onChange={e => setJobTitle(e.target.value)}
                  placeholder="e.g. Chief Audit Executive"
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12506E] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  {isAr ? 'لغة الاستبيان *' : 'Survey Language *'}
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="asm_lang"
                      value="en"
                      checked={assessmentLang === 'en'}
                      onChange={() => setAssessmentLang('en')}
                    />
                    <span>English</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="asm_lang"
                      value="ar"
                      checked={assessmentLang === 'ar'}
                      onChange={() => setAssessmentLang('ar')}
                    />
                    <span>العربية (Arabic)</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg font-semibold"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#12506E] hover:bg-[#0e4058] text-white rounded-lg font-bold"
                >
                  {isAr ? 'بدء التقييم الآن' : 'Start Assessment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
