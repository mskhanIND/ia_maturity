import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AssessmentDoc, QuestionComment } from '../../types';
import {
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Send,
  Eye,
  Paperclip,
  FileText,
  ShieldCheck,
  X,
  MessageSquare,
  CornerDownRight,
  User,
  Clock,
  Filter,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const WorkspaceReviewQueue: React.FC = () => {
  const {
    language,
    assessments,
    activeAssessment,
    setActiveAssessmentId,
    reviewerUpdateStatus,
    currentUser,
    questionComments,
    addQuestionComment,
    resolveQuestionThread
  } = useApp();

  const isAr = language === 'ar';
  const [selectedAsm, setSelectedAsm] = useState<AssessmentDoc | null>(null);
  const [comments, setComments] = useState('');
  const [statusAction, setStatusAction] = useState<AssessmentDoc['review_status']>('Approved');
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Question thread UI state
  const [expandedThreads, setExpandedThreads] = useState<Record<string, boolean>>({});
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [replyAttachment, setReplyAttachment] = useState<Record<string, string>>({});
  const [filterMode, setFilterMode] = useState<'all' | 'with_threads' | 'open_only' | 'resolved_only'>('all');

  const handleOpenReview = (asm: AssessmentDoc) => {
    setSelectedAsm(asm);
    setComments(asm.reviewer_comments || '');
    setStatusAction(asm.review_status || 'Approved');
    // By default expand questions that have open threads for immediate reviewer visibility
    const autoExpand: Record<string, boolean> = {};
    const asmThreads = questionComments.filter(c => c.assessment_id === asm.id);
    asmThreads.forEach(t => {
      if (t.status === 'open') {
        autoExpand[t.question_code] = true;
      }
    });
    setExpandedThreads(autoExpand);
    setShowReviewModal(true);
  };

  const handleSaveReview = (releaseReport: boolean) => {
    if (!selectedAsm) return;
    reviewerUpdateStatus(selectedAsm.id, statusAction, comments, releaseReport);
    setShowReviewModal(false);
  };

  const toggleThread = (questionCode: string) => {
    setExpandedThreads(prev => ({
      ...prev,
      [questionCode]: !prev[questionCode],
    }));
  };

  const handleSendComment = (questionCode: string) => {
    if (!selectedAsm) return;
    const msg = replyText[questionCode]?.trim();
    if (!msg) return;

    addQuestionComment({
      assessment_id: selectedAsm.id,
      question_code: questionCode,
      message: msg,
      attachment: replyAttachment[questionCode] || undefined,
      status: 'open',
    });

    setReplyText(prev => ({ ...prev, [questionCode]: '' }));
    setReplyAttachment(prev => ({ ...prev, [questionCode]: '' }));
  };

  const handleAttachFile = (questionCode: string) => {
    const mockFile = `GRC_Standard_Review_Note_${questionCode}.pdf`;
    setReplyAttachment(prev => ({ ...prev, [questionCode]: mockFile }));
  };

  const handleToggleResolveThread = (questionCode: string, currentStatus: 'open' | 'resolved') => {
    if (!selectedAsm) return;
    const newStatus = currentStatus === 'open' ? 'resolved' : 'open';
    resolveQuestionThread(selectedAsm.id, questionCode, newStatus);
  };

  return (
    <div className="space-y-6 text-start max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">
              {isAr ? 'قائمة مراجعة واعتماد التقييمات والاستفسارات' : 'Assessment Review & Clarification Queue'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#12506E] text-white">
              {assessments.length} {isAr ? 'تقييمات' : 'Assessments'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {isAr
              ? 'فحص إجابات العميل، والتحقق من أوراق العمل، وإدارة المحادثات والاستفسارات على مستوى كل سؤال قبل الاعتماد النهائي.'
              : 'Inspect submitted customer responses, verify workpapers, conduct question-level technical clarification threads, and issue approvals.'}
          </p>
        </div>
      </div>

      {/* Queue Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[11px]">
                <th className="p-3 text-start">Assessment Ref</th>
                <th className="p-3 text-start">Organization</th>
                <th className="p-3 text-start">Submitted By</th>
                <th className="p-3 text-start">Review Status</th>
                <th className="p-3 text-start">Score %</th>
                <th className="p-3 text-start">Clarification Threads</th>
                <th className="p-3 text-start">Assigned Reviewer</th>
                <th className="p-3 text-end">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {assessments.map(asm => {
                const asmThreads = questionComments.filter(c => c.assessment_id === asm.id);
                const openThreadsCount = new Set(asmThreads.filter(t => t.status === 'open').map(t => t.question_code)).size;
                const totalQuestionsWithThreads = new Set(asmThreads.map(t => t.question_code)).size;

                return (
                  <tr key={asm.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-[#12506E]">{asm.name}</td>
                    <td className="p-3 font-bold text-gray-900">{asm.entity}</td>
                    <td className="p-3 text-gray-600">
                      <div>{asm.respondent_name}</div>
                      <div className="text-[11px] text-gray-400">{asm.job_title}</div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold border inline-flex items-center gap-1.5 ${
                          asm.review_status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : asm.review_status === 'Clarification Required'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-blue-50 text-blue-800 border-blue-200'
                        }`}
                      >
                        {asm.review_status === 'Approved' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {asm.review_status === 'Clarification Required' && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                        {asm.review_status}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="font-extrabold text-sm text-gray-900">{asm.overall_score}%</span>
                      <span className="text-[10px] text-gray-500 block">{asm.maturity_level}</span>
                    </td>
                    <td className="p-3">
                      {totalQuestionsWithThreads > 0 ? (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {openThreadsCount > 0 ? (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                              <MessageSquare className="w-3 h-3 text-amber-700" />
                              {openThreadsCount} Open Inquiries
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                              <Check className="w-3 h-3 text-emerald-700" />
                              All {totalQuestionsWithThreads} Threads Resolved
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-[11px]">No threads</span>
                      )}
                    </td>
                    <td className="p-3 text-gray-700">{asm.reviewer || 'Dr. Khalid Al-Zahrani'}</td>
                    <td className="p-3 text-end">
                      <button
                        onClick={() => handleOpenReview(asm)}
                        className="px-3.5 py-1.5 bg-[#12506E] hover:bg-[#0e4058] text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                      >
                        Inspect & Review
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review, Verification & Thread-Based Clarification Dialog */}
      {showReviewModal && selectedAsm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full my-4 overflow-hidden border border-gray-200 flex flex-col max-h-[92vh]">
            {/* Header */}
            <div className="bg-[#12506E] text-white px-6 py-4 flex items-center justify-between flex-none">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base">
                    Technical GRC Review & Verification: {selectedAsm.entity}
                  </h3>
                  <span className="bg-white/20 text-white text-[11px] font-mono px-2 py-0.5 rounded">
                    {selectedAsm.name}
                  </span>
                </div>
                <div className="text-xs text-cyan-200 mt-0.5">
                  Assessed by: <b>{selectedAsm.respondent_name}</b> ({selectedAsm.job_title}) · Score: <b>{selectedAsm.overall_score}%</b> ({selectedAsm.maturity_level})
                </div>
              </div>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-cyan-200 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body: Review Status Decision & Questions with Threads */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs bg-gray-50/50">
              {/* Review Decision Form */}
              <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#12506E]" />
                    <span>Formal Review Decision & Stage Allocation</span>
                  </h4>
                  <span className="text-[11px] text-gray-500 font-mono">
                    Current Reviewer: {currentUser.name}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label
                    className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer font-semibold transition-all ${
                      statusAction === 'Under Review'
                        ? 'border-blue-500 bg-blue-50 text-blue-900 ring-1 ring-blue-500'
                        : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="rev_st"
                      value="Under Review"
                      checked={statusAction === 'Under Review'}
                      onChange={() => setStatusAction('Under Review')}
                      className="text-[#12506E]"
                    />
                    <div>
                      <div className="text-xs font-bold">Under Review</div>
                      <div className="text-[10px] text-gray-500 font-normal">Internal validation underway</div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer font-semibold transition-all ${
                      statusAction === 'Clarification Required'
                        ? 'border-amber-500 bg-amber-50 text-amber-900 ring-1 ring-amber-500'
                        : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="rev_st"
                      value="Clarification Required"
                      checked={statusAction === 'Clarification Required'}
                      onChange={() => setStatusAction('Clarification Required')}
                      className="text-amber-600"
                    />
                    <div>
                      <div className="text-xs font-bold text-amber-800">Clarification Required</div>
                      <div className="text-[10px] text-amber-700 font-normal">Questions pending customer reply</div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer font-semibold transition-all ${
                      statusAction === 'Approved'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-500'
                        : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="rev_st"
                      value="Approved"
                      checked={statusAction === 'Approved'}
                      onChange={() => setStatusAction('Approved')}
                      className="text-emerald-600"
                    />
                    <div>
                      <div className="text-xs font-bold text-emerald-800">Approved & Verified</div>
                      <div className="text-[10px] text-emerald-700 font-normal">Ready for official release</div>
                    </div>
                  </label>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Overall Executive Reviewer Notes & Committee Summary
                  </label>
                  <textarea
                    rows={2}
                    value={comments}
                    onChange={e => setComments(e.target.value)}
                    placeholder="Enter formal notes on assessment findings, QAIP independence confirmation, or audit committee charter updates..."
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12506E] focus:outline-none bg-white"
                  />
                </div>
              </div>

              {/* Question Feedback & Clarification Section */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-[#12506E]" />
                      <span>Question-by-Question Review & Clarification Threads</span>
                    </h4>
                    <p className="text-xs text-gray-500">
                      Provide targeted consultant feedback per question. Customers can reply directly to clarify workpapers or governance practices.
                    </p>
                  </div>

                  {/* Filter Mode */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1">
                      <Filter className="w-3 h-3" />
                      Filter:
                    </span>
                    <button
                      type="button"
                      onClick={() => setFilterMode('all')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                        filterMode === 'all'
                          ? 'bg-[#12506E] text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      All (20)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterMode('open_only')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                        filterMode === 'open_only'
                          ? 'bg-amber-600 text-white'
                          : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                      }`}
                    >
                      Open Clarifications
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterMode('with_threads')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                        filterMode === 'with_threads'
                          ? 'bg-gray-800 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      With Threads
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterMode('resolved_only')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                        filterMode === 'resolved_only'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      Resolved
                    </button>
                  </div>
                </div>

                {/* Filtered Question Answers List with Threads */}
                <div className="space-y-4">
                  {selectedAsm.answers
                    .filter(ans => {
                      const threads = questionComments.filter(
                        c => c.assessment_id === selectedAsm.id && c.question_code === ans.question_code
                      );
                      const hasOpen = threads.some(t => t.status === 'open');
                      const hasResolved = threads.length > 0 && threads.every(t => t.status === 'resolved');

                      if (filterMode === 'open_only') return hasOpen;
                      if (filterMode === 'with_threads') return threads.length > 0;
                      if (filterMode === 'resolved_only') return hasResolved;
                      return true;
                    })
                    .map(ans => {
                      const threads = questionComments.filter(
                        c => c.assessment_id === selectedAsm.id && c.question_code === ans.question_code
                      );
                      const isThreadExpanded = expandedThreads[ans.question_code] || false;
                      const hasOpenThread = threads.some(t => t.status === 'open');
                      const hasResolvedThread = threads.length > 0 && threads.every(t => t.status === 'resolved');

                      return (
                        <div
                          key={ans.question_code}
                          className={`bg-white rounded-xl border transition-all overflow-hidden ${
                            hasOpenThread
                              ? 'border-amber-300 ring-1 ring-amber-300 shadow-xs'
                              : 'border-gray-200 hover:border-gray-300 shadow-2xs'
                          }`}
                        >
                          {/* Question Header & Selected Option */}
                          <div className="p-4 space-y-2 border-b border-gray-100">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono font-bold text-white bg-[#12506E] px-2 py-0.5 rounded text-[11px]">
                                  {ans.question_code}
                                </span>
                                <span className="font-bold text-gray-900 text-xs">
                                  {isAr ? ans.short_label_ar : ans.short_label}
                                </span>
                                {ans.is_gating === 1 && (
                                  <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded border border-red-200">
                                    Gating Rule Question
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="font-bold px-2.5 py-1 rounded-lg bg-gray-100 border text-gray-800 text-[11px]">
                                  Option {ans.selected_option} · {ans.points} pts
                                </span>
                              </div>
                            </div>

                            <p className="text-gray-700 leading-relaxed text-xs">
                              {isAr ? ans.question_text_ar : ans.question_text}
                            </p>

                            {/* Customer Comment & Evidence */}
                            <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                              {ans.comment ? (
                                <div className="text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100 flex-1">
                                  <b className="text-gray-800">Respondent Note: </b>
                                  <span>{ans.comment}</span>
                                </div>
                              ) : (
                                <span className="text-gray-400 italic">No self-assessment comment attached</span>
                              )}

                              {ans.evidence ? (
                                <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex-none font-semibold">
                                  <FileText className="w-3.5 h-3.5" />
                                  <span>Workpaper: {ans.evidence}</span>
                                  <span className="text-[9px] bg-emerald-200 text-emerald-900 px-1 rounded uppercase font-bold">
                                    Verified
                                  </span>
                                </div>
                              ) : (
                                <span className="text-gray-400 italic flex-none">No document uploaded</span>
                              )}
                            </div>
                          </div>

                          {/* Thread Bar Strip */}
                          <div className="bg-gray-50/80 px-4 py-2.5 flex items-center justify-between border-b border-gray-100">
                            <div className="flex items-center gap-2">
                              <MessageSquare className="w-3.5 h-3.5 text-[#12506E]" />
                              <span className="font-bold text-xs text-gray-800">
                                {isAr ? 'نقاش واستفسار التدقيق:' : 'Clarification Thread:'}
                              </span>

                              {threads.length > 0 ? (
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 ${
                                    hasOpenThread
                                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                                      : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                  }`}
                                >
                                  {hasOpenThread ? (
                                    <>
                                      <Clock className="w-3 h-3 text-amber-700" />
                                      {threads.length} Messages · Open (Needs Customer Clarification)
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                                      {threads.length} Messages · Resolved & Verified
                                    </>
                                  )}
                                </span>
                              ) : (
                                <span className="text-gray-400 text-[11px]">No feedback posted yet</span>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => toggleThread(ans.question_code)}
                              className="text-xs font-bold text-[#12506E] hover:underline flex items-center gap-1"
                            >
                              <span>
                                {isThreadExpanded
                                  ? 'Collapse Discussion'
                                  : threads.length > 0
                                  ? `View Discussion (${threads.length})`
                                  : '+ Add Reviewer Feedback'}
                              </span>
                              {isThreadExpanded ? (
                                <ChevronUp className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>

                          {/* Expanded Thread Drawer */}
                          {isThreadExpanded && (
                            <div className="p-4 bg-white space-y-4 animate-fade-in border-t border-gray-100">
                              {/* Thread Messages List */}
                              {threads.length > 0 ? (
                                <div className="space-y-3">
                                  {threads.map((msg, idx) => {
                                    const isConsultantMsg =
                                      msg.author_role === 'grc_consultant' || msg.author_role === 'grc_manager';

                                    return (
                                      <div
                                        key={msg.id || idx}
                                        className={`p-3.5 rounded-xl border space-y-1.5 ${
                                          isConsultantMsg
                                            ? 'bg-cyan-50/50 border-cyan-200/80 ms-0 me-6'
                                            : 'bg-amber-50/50 border-amber-200/80 ms-6 me-0'
                                        }`}
                                      >
                                        <div className="flex items-center justify-between gap-2">
                                          <div className="flex items-center gap-2">
                                            <div
                                              className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${
                                                isConsultantMsg ? 'bg-[#12506E]' : 'bg-amber-600'
                                              }`}
                                            >
                                              {msg.author_name[0] || 'U'}
                                            </div>
                                            <div>
                                              <span className="font-bold text-xs text-gray-900">
                                                {msg.author_name}
                                              </span>
                                              <span
                                                className={`ms-2 px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                                                  isConsultantMsg
                                                    ? 'bg-cyan-100 text-cyan-900'
                                                    : 'bg-amber-100 text-amber-900'
                                                }`}
                                              >
                                                {msg.author_title || (isConsultantMsg ? 'GRC Reviewer' : 'Customer CAE')}
                                              </span>
                                            </div>
                                          </div>

                                          <div className="flex items-center gap-2 text-[10px] text-gray-400">
                                            <Clock className="w-3 h-3" />
                                            <span>{msg.created_at}</span>
                                          </div>
                                        </div>

                                        <p className="text-xs text-gray-800 leading-relaxed ps-8">
                                          {msg.message}
                                        </p>

                                        {msg.attachment && (
                                          <div className="ps-8 pt-1">
                                            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#12506E] bg-white px-2.5 py-1 rounded-md border border-gray-200 shadow-2xs">
                                              <Paperclip className="w-3 h-3 text-[#12506E]" />
                                              <span>{msg.attachment}</span>
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}

                                  {/* Thread Action Controls */}
                                  <div className="flex items-center justify-between pt-1 text-xs">
                                    <div className="flex items-center gap-2">
                                      <span className="text-gray-500 font-semibold">Thread Status:</span>
                                      <span
                                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                          hasOpenThread
                                            ? 'bg-amber-100 text-amber-800'
                                            : 'bg-emerald-100 text-emerald-800'
                                        }`}
                                      >
                                        {hasOpenThread ? 'Open (Waiting on Customer)' : 'Resolved & Accepted'}
                                      </span>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleToggleResolveThread(ans.question_code, hasOpenThread ? 'open' : 'resolved')
                                      }
                                      className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 shadow-2xs ${
                                        hasOpenThread
                                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-transparent'
                                          : 'bg-white hover:bg-gray-100 text-gray-700 border-gray-300'
                                      }`}
                                    >
                                      {hasOpenThread ? (
                                        <>
                                          <Check className="w-3.5 h-3.5" />
                                          <span>Mark Question as Resolved</span>
                                        </>
                                      ) : (
                                        <>
                                          <RotateCcw className="w-3.5 h-3.5" />
                                          <span>Reopen Clarification</span>
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-gray-500 text-xs italic bg-gray-50 p-3 rounded-lg border border-gray-100">
                                  No previous inquiries on this question. Enter guidance or ask for missing evidence below.
                                </div>
                              )}

                              {/* Reviewer Reply Composer */}
                              <div className="pt-2 border-t border-gray-100 space-y-2">
                                <label className="block font-bold text-xs text-gray-800">
                                  Post Consultant Inquiry or Audit Observation
                                </label>
                                <textarea
                                  rows={2}
                                  value={replyText[ans.question_code] || ''}
                                  onChange={e =>
                                    setReplyText(prev => ({
                                      ...prev,
                                      [ans.question_code]: e.target.value,
                                    }))
                                  }
                                  placeholder="e.g. Under IIA GIAS Standard 8.4, please provide the external QAIP report dated within the past 5 years..."
                                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12506E] focus:outline-none bg-white"
                                />

                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2">
                                    {replyAttachment[ans.question_code] ? (
                                      <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                                        <Paperclip className="w-3 h-3" />
                                        {replyAttachment[ans.question_code]}
                                      </span>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => handleAttachFile(ans.question_code)}
                                        className="text-[11px] text-gray-600 hover:text-gray-900 font-semibold flex items-center gap-1 border border-gray-200 px-2.5 py-1 rounded-md bg-gray-50 hover:bg-gray-100"
                                      >
                                        <Paperclip className="w-3 h-3" />
                                        <span>Attach Standard Reference</span>
                                      </button>
                                    )}
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => handleSendComment(ans.question_code)}
                                    disabled={!replyText[ans.question_code]?.trim()}
                                    className="px-4 py-1.5 bg-[#12506E] hover:bg-[#0e4058] disabled:opacity-40 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                                  >
                                    <Send className="w-3.5 h-3.5" />
                                    <span>Send Feedback</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between flex-none">
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 text-xs"
              >
                Close Window
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSaveReview(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-black text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Save Review Notes & Status
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveReview(true)}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold shadow-sm"
                >
                  Approve & Release Official Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
