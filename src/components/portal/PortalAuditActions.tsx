import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { IAMaturityAction } from '../../types';
import { ClipboardList, CheckCircle2, Clock, AlertTriangle, Filter, Search } from 'lucide-react';

export const PortalAuditActions: React.FC = () => {
  const { language, auditActions, updateActionStatus } = useApp();
  const isAr = language === 'ar';

  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const filtered = auditActions.filter(a => {
    const matchesSearch = a.finding_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.action_owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.question_code.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (priorityFilter !== 'All' && a.priority !== priorityFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 text-start max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isAr ? 'ملاحظات وتوصيات التدقيق الداخلي' : 'Audit Findings & Action Tracking'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            {isAr
              ? 'متابعة خطط العمل التصحيحية المنبثقة عن نتائج التقييم مع تحديد الملاك والمهل الزمنية والتحقق من الإغلاق.'
              : 'Corrective action plans generated from assessment findings with ownership, deadlines, and closure sign-off.'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 bg-red-50 text-red-700 font-bold rounded-lg border border-red-200">
            {auditActions.filter(a => a.priority === 'Immediate' && a.status !== 'Completed').length} Immediate
          </span>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-lg border border-emerald-200">
            {auditActions.filter(a => a.status === 'Completed').length} Closed
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 rtl:right-3 rtl:left-auto" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={isAr ? 'بحث بالعنوان أو المالك أو كود السؤال...' : 'Search by title, owner, or question...'}
            className="w-full pl-9 pr-3 rtl:pr-9 rtl:pl-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12506E] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-500 font-semibold">{isAr ? 'الأولوية:' : 'Priority:'}</span>
          {['All', 'Immediate', 'High', 'Medium'].map(p => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                priorityFilter === p
                  ? 'bg-[#12506E] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Actions Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[11px]">
                <th className="p-3 text-start">Q-Code</th>
                <th className="p-3 text-start">Finding Title & Recommended Target</th>
                <th className="p-3 text-start">Section Domain</th>
                <th className="p-3 text-start">Action Owner</th>
                <th className="p-3 text-start">Priority & Due Date</th>
                <th className="p-3 text-start">Status</th>
                <th className="p-3 text-end">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(action => (
                <tr key={action.id} className="hover:bg-gray-50">
                  <td className="p-3 font-mono font-bold text-[#12506E]">{action.question_code}</td>
                  <td className="p-3 max-w-sm">
                    <div className="font-bold text-gray-900">{action.finding_title}</div>
                    <div className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">
                      <b>Target: </b>{action.recommended_action}
                    </div>
                  </td>
                  <td className="p-3 text-gray-600">{action.section_title}</td>
                  <td className="p-3 font-semibold text-gray-800">{action.action_owner}</td>
                  <td className="p-3">
                    <div className="space-y-0.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          action.priority === 'Immediate'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {action.priority}
                      </span>
                      <div className="text-[11px] text-gray-500">{action.due_date}</div>
                    </div>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                        action.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : action.status === 'In Progress'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {action.status}
                    </span>
                  </td>
                  <td className="p-3 text-end">
                    <select
                      value={action.status}
                      onChange={e => updateActionStatus(action.id, e.target.value as any)}
                      className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-semibold focus:outline-none"
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
