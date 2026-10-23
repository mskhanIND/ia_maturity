import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldAlert, AlertCircle, CheckCircle, Clock } from 'lucide-react';

export const PortalSecOps: React.FC = () => {
  const { language, incidents } = useApp();
  const isAr = language === 'ar';

  return (
    <div className="space-y-6 text-start max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isAr ? 'العمليات السيبرانية وتتبع الحوادث' : 'Security Operations & Incident Log'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            {isAr
              ? 'متابعة بلاغات الحوادث السيبرانية، مستوى الخطورة، وحالة المعالجة والتنسيق مع فريق الاستجابة.'
              : 'Incident & vulnerability tracking with operational status, severities, and assigned response leads.'}
          </p>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[11px]">
                <th className="p-3 text-start">Ticket Ref</th>
                <th className="p-3 text-start">Incident Summary</th>
                <th className="p-3 text-start">Severity</th>
                <th className="p-3 text-start">Reported Date</th>
                <th className="p-3 text-start">Assigned Responder</th>
                <th className="p-3 text-end">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {incidents.map(inc => (
                <tr key={inc.id} className="hover:bg-gray-50">
                  <td className="p-3 font-mono font-bold text-[#12506E]">{inc.ticket}</td>
                  <td className="p-3 font-semibold text-gray-900">{isAr ? inc.title_ar : inc.title}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        inc.severity === 'Critical'
                          ? 'bg-red-100 text-red-800'
                          : inc.severity === 'High'
                          ? 'bg-orange-100 text-orange-800'
                          : inc.severity === 'Medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {inc.severity}
                    </span>
                  </td>
                  <td className="p-3 text-gray-500">{inc.reported_on}</td>
                  <td className="p-3 font-medium text-gray-800">{inc.assigned_to}</td>
                  <td className="p-3 text-end">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {inc.status}
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
