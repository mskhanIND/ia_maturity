import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SECTIONS, QUESTIONS, TEMPLATE_INFO } from '../../data/templateData';
import { t } from '../../utils/i18n';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Paperclip,
  Save,
  HelpCircle,
  ShieldAlert,
  Send,
  Sparkles,
  Lock,
  MessageSquare,
  Clock,
  CornerDownRight,
  Check,
  RotateCcw
} from 'lucide-react';

export const PortalTakeAssessment: React.FC = () => {
  const {
    language,
    setView,
    activeAssessment,
    updateAssessmentAnswer,
    submitAssessment,
    q1GatingEnabled,
    q20AllowNaEnabled,
    q13IssueRegisterEnabled,
    questionComments,
    addQuestionComment,
    currentUser
  } = useApp();

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [saveStatus, setSaveStatus] = useState<string>('All changes saved');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [customerReplyText, setCustomerReplyText] = useState<Record<string, string>>({});
  const [customerReplyFile, setCustomerReplyFile] = useState<Record<string, string>>({});
  const [replySentToast, setReplySentToast] = useState<Record<string, boolean>>({});

  if (!activeAssessment) {
    return (
      <div className="text-center py-16 space-y-4">
        <h3 className="text-lg font-bold text-gray-900">No active assessment selected.</h3>
        <button
          onClick={() => setView('portal_assessments')}
          className="px-4 py-2 bg-[#12506E] text-white rounded-lg text-xs font-semibold"
        >
          Return to Assessments
        </button>
      </div>
    );
  }

  const isAr = activeAssessment.language === 'ar' || language === 'ar';
  const currentSection = SECTIONS[currentSectionIndex];
  const sectionQuestions = QUESTIONS.filter(q => q.section_code === currentSection.section_code);

  const answeredTotal = activeAssessment.answers.filter(a => a.selected_option).length;
  const progressPct = Math.round((answeredTotal / activeAssessment.answers.length) * 100);

  const handleSelectOption = (questionCode: string, option: string) => {
    updateAssessmentAnswer(activeAssessment.id, questionCode, option);
    setSaveStatus('Saving...');
    setTimeout(() => setSaveStatus('All changes saved'), 400);
  };

  const handleCommentChange = (questionCode: string, comment: string) => {
    updateAssessmentAnswer(activeAssessment.id, questionCode, undefined as any, comment);
    setSaveStatus('Saving comment...');
    setTimeout(() => setSaveStatus('All changes saved'), 400);
  };

  const handleAttachEvidence = (questionCode: string) => {
    const mockFile = `Audit_Evidence_${questionCode}_Signed.pdf`;
    updateAssessmentAnswer(activeAssessment.id, questionCode, undefined as any, undefined, mockFile);
    setSaveStatus('Evidence file attached');
    setTimeout(() => setSaveStatus('All changes saved'), 400);
  };

  const handleCustomerAttachFile = (questionCode: string) => {
    const mockFile = `Customer_Clarification_${questionCode}_Addendum.pdf`;
    setCustomerReplyFile(prev => ({ ...prev, [questionCode]: mockFile }));
  };

  const handleCustomerSendReply = (questionCode: string) => {
    const msg = customerReplyText[questionCode]?.trim();
    if (!msg || !activeAssessment) return;

    addQuestionComment({
      assessment_id: activeAssessment.id,
      question_code: questionCode,
      message: msg,
      attachment: customerReplyFile[questionCode] || undefined,
      status: 'open',
    });

    setCustomerReplyText(prev => ({ ...prev, [questionCode]: '' }));
    setCustomerReplyFile(prev => ({ ...prev, [questionCode]: '' }));
    setReplySentToast(prev => ({ ...prev, [questionCode]: true }));
    setTimeout(() => {
      setReplySentToast(prev => ({ ...prev, [questionCode]: false }));
    }, 3500);
  };

  const handleInitiateSubmit = () => {
    const unanswered = activeAssessment.answers.filter(a => !a.selected_option);
    if (unanswered.length > 0) {
      setSubmitError(
        isAr
          ? `يرجى الإجابة عن جميع الأسئلة قبل التقديم. الأسئلة المتبقية دون إجابة: ${unanswered.map(u => u.question_code).join(', ')}`
          : `Please answer all questions before submitting. Unanswered questions: ${unanswered.map(u => u.question_code).join(', ')}`
      );
      return;
    }
    setSubmitError(null);
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = () => {
    const success = submitAssessment(activeAssessment.id);
    if (success) {
      setShowConfirmModal(false);
      setView('portal_scorecard');
    }
  };

  return (
    <div className="space-y-6 text-start max-w-5xl mx-auto pb-12">
      {/* Top Navigation & Status Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setView('portal_assessments')}
            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-700"
            title="Return to Assessments"
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          </button>
          <div>
            <h2 className="text-sm font-bold text-gray-900">{activeAssessment.name}</h2>
            <div className="text-[11px] text-gray-500">
              {activeAssessment.entity} · {activeAssessment.job_title} ({activeAssessment.respondent_role})
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{saveStatus}</span>
          </div>
          <div className="text-gray-500 font-medium">
            <span className="font-bold text-gray-900">{answeredTotal}</span> of 20 Answered ({progressPct}%)
          </div>
        </div>
      </div>

      {/* Open Clarifications Banner */}
      {(() => {
        const assessmentThreads = questionComments.filter(c => c.assessment_id === activeAssessment.id);
        const openQuestions = Array.from(
          new Set(assessmentThreads.filter(t => t.status === 'open').map(t => t.question_code))
        );
        if (openQuestions.length === 0) return null;

        return (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-1.5 shadow-2xs">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-none" />
                <span>
                  {isAr
                    ? `تنبيه تدقيق: استفسارات مفتوحة بانتظار إيضاح العميل على الأسئلة (${openQuestions.join(', ')})`
                    : `GRC Clarifications Pending on Questions: ${openQuestions.join(', ')}`}
                </span>
              </div>
              <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                {openQuestions.length} Pending Inquiries
              </span>
            </div>
            <p className="text-amber-800 text-[11px] leading-relaxed">
              {isAr
                ? 'دوّن مستشار الحوكمة استفسارات تدقيق محددة حول هذه المعايير. يرجى الاطلاع على الملاحظات أدناه والرد عليها لاستكمال الاعتماد.'
                : 'The GRC reviewer has requested technical clarifications on these standards. Please inspect the feedback threads below and reply with explanations or updated evidence.'}
            </p>
          </div>
        );
      })()}

      {/* Progress Bar & Stepper */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
        {/* Progress Bar Line */}
        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#12506E] h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          ></div>
        </div>

        {/* 6 Sections Stepper Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
          {SECTIONS.map((sec, idx) => {
            const isCurrent = idx === currentSectionIndex;
            const secAnswers = activeAssessment.answers.filter(a => a.section_code === sec.section_code);
            const secComplete = secAnswers.length > 0 && secAnswers.every(a => a.selected_option);

            return (
              <button
                key={sec.section_code}
                onClick={() => setCurrentSectionIndex(idx)}
                className={`p-2.5 rounded-lg border text-start transition-all flex flex-col justify-between ${
                  isCurrent
                    ? 'border-[#12506E] bg-cyan-50/60 ring-1 ring-[#12506E]'
                    : secComplete
                    ? 'border-emerald-200 bg-emerald-50/40 text-gray-700'
                    : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[11px] text-[#12506E]">{sec.section_code}</span>
                  {secComplete && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <div className="font-semibold text-gray-900 truncate mt-1">
                  {isAr ? sec.section_title_ar : sec.section_title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section Header */}
      <div className="bg-[#12506E] text-white p-6 rounded-xl shadow-md space-y-1">
        <div className="text-xs font-semibold text-cyan-200 uppercase tracking-wider">
          {isAr ? `القسم ${currentSection.section_code}` : `Section ${currentSection.section_code}`} · {TEMPLATE_INFO.framework}
        </div>
        <h3 className="text-xl font-bold">
          {isAr ? currentSection.section_title_ar : currentSection.section_title}
        </h3>
        <div className="text-xs text-cyan-100 pt-1">
          <span className="font-semibold">{isAr ? 'المرجع النظامي والمعياري: ' : 'Framework Reference: '}</span>
          {isAr ? currentSection.reference_ar : currentSection.reference}
        </div>
      </div>

      {/* Submission Error Banner if any */}
      {submitError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-none mt-0.5" />
          <div className="leading-relaxed font-medium">{submitError}</div>
        </div>
      )}

      {/* Questions List for Current Section */}
      <div className="space-y-6">
        {sectionQuestions.map(q => {
          const ans = activeAssessment.answers.find(a => a.question_code === q.question_code);
          const selected = ans?.selected_option || '';
          const isGating = q1GatingEnabled && q.is_gating === 1;
          const isAutoClosure = q.question_code === 'Q13' && q13IssueRegisterEnabled;
          const commentsOpen = openComments[q.question_code] || Boolean(ans?.comment || ans?.evidence);

          return (
            <div
              key={q.question_code}
              className={`bg-white rounded-xl p-6 border shadow-sm space-y-5 transition-all ${
                selected ? 'border-gray-200' : 'border-amber-300 ring-1 ring-amber-200'
              }`}
            >
              {/* Question Header & Special Badges */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xs px-2.5 py-1 rounded bg-[#12506E] text-white">
                    {q.question_code}
                  </span>
                  <h4 className="font-bold text-sm text-gray-900">
                    {isAr ? q.short_label_ar : q.short_label}
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  {isGating && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                      <ShieldAlert className="w-3 h-3 text-red-600" />
                      <span>{isAr ? 'سؤال حاكم (Gating Question)' : 'Gating Question (Caps at Low)'}</span>
                    </span>
                  )}
                  {isAutoClosure && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-cyan-50 text-cyan-800 border border-cyan-200">
                      <Sparkles className="w-3 h-3 text-cyan-600" />
                      <span>{isAr ? 'محسوب من سجل الملاحظات' : 'Auto-Derived from Issue Register'}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Full Question Text */}
              <div className="text-sm font-semibold text-gray-900 leading-relaxed">
                {isAr ? q.question_text_ar : q.question_text}
              </div>

              {/* Options A, B, C, D Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    letter: 'A',
                    text: isAr ? q.option_a_ar : q.option_a,
                    levelName: isAr ? 'أ - ارتجالي (25 نقطة)' : 'A – Ad hoc (25 pts)',
                    badgeColor: 'border-red-200 bg-red-50/50',
                  },
                  {
                    letter: 'B',
                    text: isAr ? q.option_b_ar : q.option_b,
                    levelName: isAr ? 'ب - تأسيسي (50 نقطة)' : 'B – Foundational (50 pts)',
                    badgeColor: 'border-orange-200 bg-orange-50/50',
                  },
                  {
                    letter: 'C',
                    text: isAr ? q.option_c_ar : q.option_c,
                    levelName: isAr ? 'ج - راسخ (75 نقطة)' : 'C – Established (75 pts)',
                    badgeColor: 'border-amber-200 bg-amber-50/50',
                  },
                  {
                    letter: 'D',
                    text: isAr ? q.option_d_ar : q.option_d,
                    levelName: isAr ? 'د - رائد (100 نقطة)' : 'D – Leading (100 pts)',
                    badgeColor: 'border-emerald-200 bg-emerald-50/50',
                  },
                ].map(opt => {
                  const isChecked = selected === opt.letter;
                  return (
                    <button
                      key={opt.letter}
                      type="button"
                      onClick={() => handleSelectOption(q.question_code, opt.letter)}
                      className={`text-start p-4 rounded-xl border transition-all flex flex-col justify-between gap-2 ${
                        isChecked
                          ? 'border-[#12506E] bg-cyan-50/60 ring-2 ring-[#12506E] shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/80 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-[#12506E]">{opt.levelName}</span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isChecked ? 'border-[#12506E] bg-[#12506E]' : 'border-gray-300'
                          }`}
                        >
                          {isChecked && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                        </div>
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed font-normal">{opt.text}</p>
                    </button>
                  );
                })}
              </div>

              {/* Not Applicable Button (if permitted on this question, e.g. Q20) */}
              {(q.allow_na === 1 || (q.question_code === 'Q20' && q20AllowNaEnabled)) && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => handleSelectOption(q.question_code, 'N/A')}
                    className={`px-4 py-2 rounded-lg border text-xs font-semibold transition-all ${
                      selected === 'N/A'
                        ? 'border-gray-800 bg-gray-800 text-white'
                        : 'border-dashed border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {isAr ? 'لا ينطبق (مستبعد من المقام وحساب النتيجة)' : 'Not Applicable (Excluded from score denominator)'}
                  </button>
                </div>
              )}

              {/* Auto Note info for Q13 */}
              {isAutoClosure && ans?.auto_note && (
                <div className="p-3 rounded-lg bg-cyan-50 border border-cyan-200 text-xs text-cyan-900 leading-relaxed">
                  <span className="font-bold">{isAr ? 'بيانات سجل الملاحظات: ' : 'Audit Register Derivation: '}</span>
                  {isAr ? ans.auto_note_ar || ans.auto_note : ans.auto_note}
                </div>
              )}

              {/* Gating Alert Note if Q1 answered A */}
              {q.question_code === 'Q1' && selected === 'A' && q1GatingEnabled && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-900 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 flex-none mt-0.5" />
                  <div>
                    {isAr
                      ? 'تنبيه: اختيار المستوى (أ) في خطوط التبعية يحدّ من مستوى النضج العام عند «منخفض» بغض النظر عن مجموع النقاط.'
                      : 'Warning: Reporting administratively to CEO without direct Audit Committee access caps overall maturity at Low.'}
                  </div>
                </div>
              )}

              {/* Evidence & Comment Collapsible Drawer */}
              <div className="pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() =>
                    setOpenComments(prev => ({
                      ...prev,
                      [q.question_code]: !prev[q.question_code],
                    }))
                  }
                  className="text-xs text-[#12506E] font-semibold hover:underline flex items-center gap-1.5"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>
                    {ans?.evidence || ans?.comment
                      ? isAr
                        ? 'عرض / تعديل الأدلة والتعليق'
                        : 'Edit Evidence & Comments'
                      : isAr
                      ? '+ إضافة وثيقة إثبات أو تعليق (اختياري)'
                      : '+ Add Supporting Evidence or Notes (Optional)'}
                  </span>
                </button>

                {commentsOpen && (
                  <div className="mt-3 p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3 animate-fade-in text-xs">
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        {isAr ? 'ملاحظات وتوضيحات حول الممارسة الحالية:' : 'Notes / Clarifications on Current Practice:'}
                      </label>
                      <textarea
                        rows={2}
                        value={ans?.comment || ''}
                        onChange={e => handleCommentChange(q.question_code, e.target.value)}
                        placeholder={
                          isAr
                            ? 'مثال: تم اعتماد ميثاق لجنة المراجعة في اجتماع مجلس الإدارة الربع الأول 2026...'
                            : 'e.g. Audit Committee Charter updated and approved in Q1 2026 Board meeting...'
                        }
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12506E] focus:outline-none bg-white"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        {ans?.evidence ? (
                          <div className="flex items-center gap-1.5 font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                            <FileText className="w-3.5 h-3.5" />
                            <span>{ans.evidence}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">No document attached yet</span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAttachEvidence(q.question_code)}
                        className="px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-100 rounded-lg font-semibold text-gray-700 flex items-center gap-1.5 shadow-sm"
                      >
                        <Paperclip className="w-3.5 h-3.5" />
                        <span>{ans?.evidence ? 'Replace Evidence File' : 'Upload Evidence (PDF/Doc)'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Question Clarification Thread (Reviewer Inquiries & Customer Replies) */}
              {(() => {
                const threads = questionComments.filter(
                  c => c.assessment_id === activeAssessment.id && c.question_code === q.question_code
                );
                if (threads.length === 0) return null;

                const hasOpenInquiry = threads.some(t => t.status === 'open');

                return (
                  <div
                    className={`mt-4 rounded-xl border p-4 space-y-3 text-xs ${
                      hasOpenInquiry
                        ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-300 shadow-2xs'
                        : 'bg-emerald-50/50 border-emerald-200'
                    }`}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <MessageSquare className={`w-4 h-4 ${hasOpenInquiry ? 'text-amber-700' : 'text-emerald-700'}`} />
                        <span className="font-bold text-xs text-gray-900">
                          {isAr ? 'نقاش واستفسار مراجع الحوكمة (GRC Feedback Thread)' : 'GRC Reviewer Technical Clarification Thread'}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          hasOpenInquiry
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        }`}
                      >
                        {hasOpenInquiry
                          ? (isAr ? 'مطلوب إيضاح من العميل' : 'Action Required · Open Clarification')
                          : (isAr ? 'تم التحقق واعتماد الإيضاح' : 'Verified & Resolved by Reviewer')}
                      </span>
                    </div>

                    {/* Messages in thread */}
                    <div className="space-y-2.5">
                      {threads.map((msg, mIdx) => {
                        const isReviewer = msg.author_role === 'grc_consultant' || msg.author_role === 'grc_manager';
                        return (
                          <div
                            key={msg.id || mIdx}
                            className={`p-3 rounded-lg border text-xs space-y-1 ${
                              isReviewer
                                ? 'bg-white border-cyan-200 text-gray-800 me-3'
                                : 'bg-white border-amber-200 text-gray-800 ms-3'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[11px]">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-[#12506E]">{msg.author_name}</span>
                                <span
                                  className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                                    isReviewer ? 'bg-cyan-100 text-cyan-900' : 'bg-amber-100 text-amber-900'
                                  }`}
                                >
                                  {msg.author_title || (isReviewer ? 'GRC Reviewer' : 'Respondent')}
                                </span>
                              </div>
                              <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {msg.created_at}
                              </span>
                            </div>
                            <p className="text-xs text-gray-700 leading-relaxed ps-1">
                              {msg.message}
                            </p>
                            {msg.attachment && (
                              <div className="ps-1 pt-1">
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#12506E] bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
                                  <Paperclip className="w-3 h-3" />
                                  <span>{msg.attachment}</span>
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Customer reply box */}
                    <div className="pt-2 border-t border-gray-200/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block font-semibold text-xs text-gray-800">
                          {isAr ? 'الرد على استفسار المراجع وإرفاق الإيضاح:' : 'Reply to Reviewer with Clarifications or Evidence:'}
                        </label>
                        {replySentToast[q.question_code] && (
                          <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 bg-emerald-100 px-2 py-0.5 rounded">
                            <Check className="w-3.5 h-3.5" />
                            {isAr ? 'تم إرسال الرد بنجاح!' : 'Clarification reply sent to reviewer!'}
                          </span>
                        )}
                      </div>

                      <textarea
                        rows={2}
                        value={customerReplyText[q.question_code] || ''}
                        onChange={e =>
                          setCustomerReplyText(prev => ({
                            ...prev,
                            [q.question_code]: e.target.value,
                          }))
                        }
                        placeholder={
                          isAr
                            ? 'اكتب ردك التوضيحي حول الممارسة أو مرجع الاعتماد...'
                            : 'Type your explanation, updated charter reference, or compliance context...'
                        }
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12506E] focus:outline-none bg-white"
                      />

                      <div className="flex items-center justify-between gap-2">
                        <div>
                          {customerReplyFile[q.question_code] ? (
                            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 flex items-center gap-1">
                              <Paperclip className="w-3 h-3" />
                              {customerReplyFile[q.question_code]}
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleCustomerAttachFile(q.question_code)}
                              className="text-[11px] text-gray-700 hover:text-black font-semibold flex items-center gap-1 bg-white border border-gray-300 px-2.5 py-1 rounded-lg hover:bg-gray-50 shadow-2xs"
                            >
                              <Paperclip className="w-3 h-3" />
                              <span>{isAr ? 'إرفاق وثيقة إيضاح (PDF)' : 'Attach Clarifying PDF'}</span>
                            </button>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCustomerSendReply(q.question_code)}
                          disabled={!customerReplyText[q.question_code]?.trim()}
                          className="px-3.5 py-1.5 bg-[#12506E] hover:bg-[#0e4058] disabled:opacity-40 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{isAr ? 'إرسال الرد للمستشار' : 'Send Clarification Reply'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          );
        })}
      </div>

      {/* Bottom Navigation Buttons */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
        <button
          disabled={currentSectionIndex === 0}
          onClick={() => setCurrentSectionIndex(prev => prev - 1)}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          <span>{isAr ? 'القسم السابق' : 'Previous Section'}</span>
        </button>

        {currentSectionIndex < SECTIONS.length - 1 ? (
          <button
            onClick={() => setCurrentSectionIndex(prev => prev + 1)}
            className="px-5 py-2 bg-[#12506E] hover:bg-[#0e4058] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <span>{isAr ? 'القسم التالي' : 'Next Section'}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        ) : (
          <button
            onClick={handleInitiateSubmit}
            className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-extrabold flex items-center gap-2 shadow-md transition-all"
          >
            <Send className="w-4 h-4" />
            <span>{isAr ? 'تقديم التقييم وإنشاء التقرير' : 'Submit Assessment & Generate Scorecard'}</span>
          </button>
        )}
      </div>

      {/* Confirmation Modal before Submit */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200">
            <div className="bg-[#12506E] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">
                {isAr ? 'تأكيد تقديم التقييم النهائي' : 'Confirm Assessment Submission'}
              </h3>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-cyan-200 hover:text-white p-1 rounded-md"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <p className="text-gray-700 leading-relaxed">
                {isAr
                  ? 'عند تقديم التقييم، سيتم قفل الإجابات وإرسال النتائج إلى فريق التدقيق الداخلي والحوكمة في (IRSAA) للمراجعة والاعتماد الرسمي.'
                  : 'Upon submission, your responses are finalized and submitted into the IRSAA GRC Team review queue for verification and formal scorecard generation.'}
              </p>

              <div className="p-3.5 bg-cyan-50 border border-cyan-200 rounded-lg space-y-1">
                <div className="font-bold text-gray-900">
                  {isAr ? 'المسار التالي بعد التقديم:' : 'Next Workflow Step:'}
                </div>
                <div className="text-gray-600">
                  Submitted → Under Review by IRSAA Consultant → Official Approved Scorecard & Report Release.
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100"
                >
                  {isAr ? 'مراجعة الإجابات' : 'Review Again'}
                </button>
                <button
                  onClick={handleConfirmSubmit}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-lg shadow-sm"
                >
                  {isAr ? 'تأكيد التقديم الآن' : 'Confirm & Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
