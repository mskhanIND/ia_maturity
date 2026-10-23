import React from 'react';
import { useApp } from '../../context/AppContext';
import { Users2, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export const WorkspaceWorkload: React.FC = () => {
  const { language, assessments } = useApp();
  const isAr = language === 'ar';

  const consultants = [
    {
      name: 'Tariq Al-Mansoor',
      title: 'Senior GRC Consultant & Assessor',
      assignedCount: assessments.filter(a => a.reviewer === 'Tariq Al-Mansoor' || !a.reviewer).length,
      pendingReview: assessments.filter(a => a.review_status === 'Under Review').length,
      approvedCount: assessments.filter(a => a.review_status === 'Approved').length,
      status: 'Normal Load',
    },
    {
      name: 'Dr. Khalid Al-Zahrani',
      title: 'Director of GRC Advisory Services',
      assignedCount: assessments.filter(a => a.reviewer === 'Dr. Khalid Al-Zahrani').length,
      pendingReview: assessments.filter(a => a.review_status === 'Under Review').length,
      approvedCount: 2,
      status: 'Available',
    },
    {
      name: 'Reem Al-Otaibi',
      title: 'Senior Internal Audit Specialist',
      assignedCount: 1,
      pendingReview: 0,
      approvedCount: 3,
      status: 'Available',
    },
  ];

  return (
    <div className="space-y-6 text-start max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {isAr ? 'مراقبة أعباء المستشارين وسرعة المراجعة' : 'Consultant Workload Monitor & Review Overdue SLA'}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Real-time oversight of GRC advisory allocations, active review queues, and survey performance metrics.
        </p>
      </div>

      {/* Consultants Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {consultants.map(c => (
          <div
            key={c.name}
            className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm space-y-4 text-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-900 text-sm">{c.name}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                {c.status}
              </span>
            </div>
            <div className="text-gray-500 text-[11px]">{c.title}</div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 text-center">
              <div className="p-2 bg-gray-50 rounded-lg">
                <div className="text-base font-extrabold text-gray-900">{c.assignedCount}</div>
                <div className="text-[10px] text-gray-500">Assigned</div>
              </div>
              <div className="p-2 bg-amber-50 rounded-lg">
                <div className="text-base font-extrabold text-amber-800">{c.pendingReview}</div>
                <div className="text-[10px] text-gray-500">In Review</div>
              </div>
              <div className="p-2 bg-emerald-50 rounded-lg">
                <div className="text-base font-extrabold text-emerald-800">{c.approvedCount}</div>
                <div className="text-[10px] text-gray-500">Released</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
