import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FollowUpLog } from '../../data/grcData';
import {
  ListFilter,
  Bell,
  Clock,
  Phone,
  Mail,
  Calendar,
  Send,
  Plus,
  CheckCircle2,
  AlertCircle,
  Eye,
  Building
} from 'lucide-react';

export const WorkspacePipeline: React.FC = () => {
  const {
    language,
    assessments,
    followUps,
    addFollowUpLog,
    setActiveAssessmentId,
    setView,
    currentUser
  } = useApp();

  const isAr = language === 'ar';
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedAsm, setSelectedAsm] = useState<string>(assessments[0]?.id || '');
  const [actionType, setActionType] = useState<FollowUpLog['action_type']>('Reminder Email');
  const [notes, setNotes] = useState('');

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    const target = assessments.find(a => a.id === selectedAsm);
    if (!target) return;

    addFollowUpLog({
      assessment_id: target.id,
      entity_name: target.entity,
      action_type: actionType,
      logged_by: currentUser.name,
      notes: notes || `Follow-up ${actionType} recorded.`,
    });

    setShowLogModal(false);
    setNotes('');
  };

  // 8 stages mapping
  const stages = [
    { key: 'Draft', label: '1. Draft', count: assessments.filter(a => a.docstatus === 0 && a.answered_count < 10).length },
    { key: 'In Progress', label: '2. In Progress', count: assessments.filter(a => a.docstatus === 0 && a.answered_count >= 10).length },
    { key: 'Submitted', label: '3. Submitted', count: assessments.filter(a => a.docstatus === 1 && a.review_status === 'Pending Review').length },
    { key: 'Under Review', label: '4. Under Review', count: assessments.filter(a => a.review_status === 'Under Review').length },
    { key: 'Clarification Required', label: '5. Clarification', count: assessments.filter(a => a.review_status === 'Clarification Required').length },
    { key: 'Resubmitted', label: '6. Resubmitted', count: assessments.filter(a => a.review_status === 'Reviewed').length },
    { key: 'Approved', label: '7. Approved', count: assessments.filter(a => a.review_status === 'Approved').length },
    { key: 'Report Released', label: '8. Released', count: assessments.filter(a => a.review_status === 'Approved').length },
  ];

  return (
    <div className="space-y-6 text-start">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isAr ? 'مسار متابعة تقييمات واستبيانات العملاء' : 'Customer Survey Pipeline & Follow-up Tracker'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Track customer progress across all 8 workflow stages, schedule automated reminders, and log engagement history.
          </p>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="px-4 py-2 bg-[#12506E] hover:bg-[#0e4058] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isAr ? 'تسجيل متابعة / إرسال تذكير' : 'Schedule Reminder / Log Follow-up'}</span>
        </button>
      </div>

      {/* 8-Stage Pipeline Funnel Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-xs">
        {stages.map((st, i) => (
          <div
            key={st.key}
            className="bg-white p-3 rounded-xl border border-gray-200 shadow-xs space-y-1 text-center"
          >
            <div className="text-[10px] uppercase font-bold text-gray-400 truncate">{st.label}</div>
            <div className="text-xl font-extrabold text-[#12506E]">{st.count}</div>
          </div>
        ))}
      </div>

      {/* Pipeline Assessments Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden space-y-2 p-5">
        <h3 className="text-sm font-bold text-gray-900 pb-2">
          {isAr ? 'قائمة العملاء قيد المتابعة' : 'Customer Engagement Pipeline'}
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[11px]">
                <th className="p-3 text-start">Entity / Customer</th>
                <th className="p-3 text-start">Assessment Title</th>
                <th className="p-3 text-start">Current Stage</th>
                <th className="p-3 text-start">Completion Progress</th>
                <th className="p-3 text-start">Score</th>
                <th className="p-3 text-start">Assigned Reviewer</th>
                <th className="p-3 text-end">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {assessments.map(asm => (
                <tr key={asm.id} className="hover:bg-gray-50">
                  <td className="p-3 font-bold text-gray-900">{asm.entity}</td>
                  <td className="p-3 text-gray-700">{asm.name}</td>
                  <td className="p-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                        asm.docstatus === 1
                          ? asm.review_status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-blue-50 text-blue-800 border-blue-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {asm.docstatus === 1 ? asm.review_status : 'In Progress'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="w-24 bg-gray-100 h-2 rounded-full overflow-hidden inline-block align-middle me-2">
                      <div
                        className="bg-[#12506E] h-full rounded-full"
                        style={{ width: `${Math.round((asm.answered_count / asm.question_count) * 100)}%` }}
                      ></div>
                    </div>
                    <span className="font-semibold text-gray-600">{asm.answered_count} / {asm.question_count}</span>
                  </td>
                  <td className="p-3 font-bold text-gray-900">{asm.overall_score}%</td>
                  <td className="p-3 text-[#12506E] font-medium">{asm.reviewer || 'Tariq Al-Mansoor'}</td>
                  <td className="p-3 text-end">
                    <button
                      onClick={() => {
                        setActiveAssessmentId(asm.id);
                        setView('workspace_review_queue');
                      }}
                      className="px-3 py-1 bg-[#12506E] hover:bg-[#0e4058] text-white rounded text-xs font-semibold"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Follow-up & Reminder History Log */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-3">
        <h3 className="text-sm font-bold text-gray-900">
          {isAr ? 'سجل المتابعات وتاريخ الاتصال بالعملاء' : 'Audit Trail: Client Follow-up & Reminder History'}
        </h3>

        <div className="space-y-2">
          {followUps.map(log => (
            <div
              key={log.id}
              className="p-3 rounded-lg border border-gray-200 bg-[#F4F6F8]/60 flex items-start justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">{log.entity_name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-100 text-cyan-900">
                    {log.action_type}
                  </span>
                </div>
                <div className="text-gray-700">{log.notes}</div>
                <div className="text-[11px] text-gray-400">
                  Logged by: <b>{log.logged_by}</b> · {log.logged_at}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Reminder / Log Follow-up Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200">
            <div className="bg-[#12506E] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">Record Follow-up / Send Reminder</h3>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-cyan-200 hover:text-white p-1 rounded-md"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddLog} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Select Customer Assessment</label>
                <select
                  value={selectedAsm}
                  onChange={e => setSelectedAsm(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12506E] focus:outline-none"
                >
                  {assessments.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.entity} ({a.name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Engagement Action Type</label>
                <select
                  value={actionType}
                  onChange={e => setActionType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12506E] focus:outline-none"
                >
                  <option value="Reminder Email">Send Automated Reminder Email</option>
                  <option value="Phone Call">Phone Call / Discussion</option>
                  <option value="Review Meeting">Live Review & Evidence Discovery Session</option>
                  <option value="Clarification Sent">Request Written Clarification on Answers</option>
                  <option value="Report Released">Release Verified Final Scorecard</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Follow-up Notes / Email Body</label>
                <textarea
                  rows={3}
                  required
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Enter details of discussion, questions raised, or reminder text..."
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12506E] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#12506E] hover:bg-[#0e4058] text-white font-bold rounded-lg shadow-sm"
                >
                  Save Log Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
