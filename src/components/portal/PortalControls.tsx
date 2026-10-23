import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GRCControl } from '../../data/grcData';
import { Sliders, Search, Filter, ShieldCheck, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const PortalControls: React.FC = () => {
  const { language, controls, updateControl } = useApp();
  const isAr = language === 'ar';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFramework, setSelectedFramework] = useState('All');

  const filteredControls = controls.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.owner.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (selectedFramework !== 'All' && c.framework_id !== selectedFramework) return false;
    return true;
  });

  return (
    <div className="space-y-6 text-start max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isAr ? 'دليل الضوابط الرقابية الموحد' : 'Unified Control Catalog'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            {isAr
              ? 'متابعة تنفيذ وفاعلية الضوابط الرقابية المتوافقة مع معايير NCA ECC وSAMA CSF وIIA GIAS.'
              : 'Framework requirements, internal controls, assigned ownership, test results, and evidence files.'}
          </p>
        </div>

        <div className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
          {controls.filter(c => c.status === 'Implemented').length} / {controls.length} Controls Implemented
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 rtl:right-3 rtl:left-auto" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={isAr ? 'بحث بالكود، العنوان، أو المسؤول...' : 'Search control code, title, or owner...'}
            className="w-full pl-9 pr-3 rtl:pr-9 rtl:pl-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12506E] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-500 font-semibold">{isAr ? 'الإطار:' : 'Framework:'}</span>
          {[
            { id: 'All', label: 'All Frameworks' },
            { id: 'nca-ecc', label: 'NCA ECC' },
            { id: 'iia-gias', label: 'IIA GIAS' },
            { id: 'sama-csf', label: 'SAMA CSF' },
            { id: 'cma-cgr', label: 'CMA CGR' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedFramework(f.id)}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                selectedFramework === f.id
                  ? 'bg-[#12506E] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Controls Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[11px]">
                <th className="p-3 text-start">Control Code</th>
                <th className="p-3 text-start">Requirement & Description</th>
                <th className="p-3 text-start">Domain</th>
                <th className="p-3 text-start">Assigned Owner</th>
                <th className="p-3 text-start">Implementation Status</th>
                <th className="p-3 text-start">Test Result</th>
                <th className="p-3 text-end">Evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredControls.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="p-3 font-mono font-bold text-[#12506E]">{c.code}</td>
                  <td className="p-3">
                    <div className="font-bold text-gray-900">{isAr ? c.title_ar : c.title}</div>
                  </td>
                  <td className="p-3 text-gray-500">{c.domain}</td>
                  <td className="p-3 font-semibold text-gray-800">{c.owner}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        c.status === 'Implemented'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : c.status === 'In Progress'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-red-50 text-red-800 border-red-200'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`font-semibold text-xs ${
                        c.testResult === 'Effective'
                          ? 'text-emerald-700'
                          : c.testResult === 'Partially Effective'
                          ? 'text-amber-700'
                          : 'text-gray-500'
                      }`}
                    >
                      {c.testResult}
                    </span>
                  </td>
                  <td className="p-3 text-end">
                    <span className="font-semibold text-[#12506E] bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                      {c.evidenceCount} docs
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
