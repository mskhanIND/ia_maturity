import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Activity, Download, Filter, Search, ShieldCheck } from 'lucide-react';

export const PortalActivityLog: React.FC = () => {
  const { language, activityLogs, currentUser } = useApp();
  const isAr = language === 'ar';
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'All' | 'Success' | 'Warning' | 'Info'>('All');

  // Filter logs for this customer's organization or user
  const customerLogs = activityLogs.filter(log => {
    const isThisOrg =
      log.orgName.toLowerCase() === (currentUser.orgName || '').toLowerCase() ||
      log.userId === currentUser.id ||
      currentUser.persona === 'customer_admin' ||
      currentUser.persona === 'it_admin' ||
      currentUser.persona === 'grc_manager';

    const matchesSearch =
      log.actionLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actionLabelAr.includes(searchTerm) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity = severityFilter === 'All' || log.status === severityFilter;

    return isThisOrg && matchesSearch && matchesSeverity;
  });

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Action', 'User', 'Role', 'Status', 'Details'];
    const rows = customerLogs.map(log => [
      `"${log.timestamp}"`,
      `"${log.action}"`,
      `"${log.userName}"`,
      `"${log.userRole}"`,
      `"${log.status}"`,
      `"${log.details.replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `customer_activity_trail_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 text-start">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#12506E]" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {isAr ? 'سجل أنشطة وتدقيق المنشأة (Audit Trail)' : 'Organization Activity & Audit Trail'}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {isAr
              ? 'سجل غير قابل للتعديل لجميع أنشطة المستخدمين، وتعديل الإجابات، وإرسال التقييمات، وتنزيل التقارير لمتطلبات التدقيق والالتزام.'
              : 'Immutable record of all user activities, assessment submissions, evidence modifications, and report downloads for compliance audit.'}
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 rounded-lg bg-[#12506E] hover:bg-[#186287] text-white text-xs font-bold flex items-center gap-2 whitespace-nowrap shadow-sm transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{isAr ? 'تصدير السجل (CSV)' : 'Export Audit Log (CSV)'}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex-1 w-full relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400 rtl:right-3 rtl:left-auto" />
          <input
            type="text"
            placeholder={isAr ? 'بحث في الأنشطة...' : 'Filter organization activities...'}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rtl:pr-9 rtl:pl-3 border border-gray-300 rounded-lg text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-500 shrink-0" />
          <select
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white font-medium w-full sm:w-auto"
          >
            <option value="All">{isAr ? 'كافة الحالات' : 'All Severities'}</option>
            <option value="Success">Success</option>
            <option value="Warning">Warning</option>
            <option value="Info">Info</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 text-start">{isAr ? 'التاريخ والوقت' : 'Timestamp'}</th>
                <th className="py-3 px-4 text-start">{isAr ? 'نوع الحدث' : 'Event Action'}</th>
                <th className="py-3 px-4 text-start">{isAr ? 'المستخدم' : 'Actor'}</th>
                <th className="py-3 px-4 text-start">{isAr ? 'تفاصيل العملية' : 'Details'}</th>
                <th className="py-3 px-4 text-start">{isAr ? 'الحالة' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {customerLogs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-mono text-[11px] text-gray-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-gray-900 block">
                      {isAr ? log.actionLabelAr : log.actionLabel}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">{log.action}</span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-semibold text-gray-800">{log.userName}</div>
                    <div className="text-[10px] text-gray-500">{log.userRole}</div>
                  </td>
                  <td className="py-3 px-4 text-gray-700 max-w-lg leading-relaxed">
                    {isAr ? log.detailsAr || log.details : log.details}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.status === 'Success'
                          ? 'bg-emerald-100 text-emerald-800'
                          : log.status === 'Warning'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {log.status}
                    </span>
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
