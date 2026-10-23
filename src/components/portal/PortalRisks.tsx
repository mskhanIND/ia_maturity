import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GRCRisk } from '../../data/grcData';
import { AlertTriangle, Plus, Shield, CheckCircle, Search, Server } from 'lucide-react';

export const PortalRisks: React.FC = () => {
  const { language, risks, addRisk, assets } = useApp();
  const isAr = language === 'ar';

  const [activeTab, setActiveTab] = useState<'risks' | 'assets'>('risks');
  const [showAddRiskModal, setShowAddRiskModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<GRCRisk['category']>('Cybersecurity');
  const [newLikelihood, setNewLikelihood] = useState<number>(3);
  const [newImpact, setNewImpact] = useState<number>(4);
  const [newOwner, setNewOwner] = useState('Chief Risk Officer');
  const [newTreatment, setNewTreatment] = useState<GRCRisk['treatment']>('Mitigate');

  const handleAddRiskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const inherent = newLikelihood * newImpact;
    const residual = Math.max(1, Math.round(inherent * 0.4));

    addRisk({
      code: `RSK-2026-${String(risks.length + 1).padStart(2, '0')}`,
      title: newTitle,
      title_ar: newTitle,
      category: newCategory,
      likelihood: newLikelihood as any,
      impact: newImpact as any,
      inherentScore: inherent,
      treatment: newTreatment,
      residualScore: residual,
      owner: newOwner,
      status: 'Under Review',
    });

    setShowAddRiskModal(false);
    setNewTitle('');
  };

  return (
    <div className="space-y-6 text-start max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isAr ? 'إدارة المخاطر وسجل الأصول' : 'Risk Management & Asset Risk Register'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            {isAr
              ? 'مصفوفة المخاطر المؤسسية والسيبرانية، تقييم المخاطر الكامنة والمتبقية، وتصنيف الأصول الحيوية.'
              : 'Enterprise & Cyber Risk register, 5x5 Likelihood x Impact scoring, treatment plans, and asset threat catalog.'}
          </p>
        </div>

        <button
          onClick={() => setShowAddRiskModal(true)}
          className="px-4 py-2 bg-[#12506E] hover:bg-[#0e4058] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{isAr ? 'إضافة خطر جديد' : 'Log New Risk'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('risks')}
          className={`pb-3 px-3 transition-colors border-b-2 ${
            activeTab === 'risks'
              ? 'border-[#12506E] text-[#12506E]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          {isAr ? 'سجل المخاطر والمصفوفة (5×5)' : 'Risk Register & 5x5 Matrix'}
        </button>
        <button
          onClick={() => setActiveTab('assets')}
          className={`pb-3 px-3 transition-colors border-b-2 ${
            activeTab === 'assets'
              ? 'border-[#12506E] text-[#12506E]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          {isAr ? 'سجل الأصول والتهديدات' : 'Asset Risk Register'}
        </button>
      </div>

      {activeTab === 'risks' ? (
        <div className="space-y-6">
          {/* 5x5 Heatmap Preview Box */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900">
              {isAr ? 'مصفوفة تقييم المخاطر (الاحتمالية × الأثر)' : '5x5 Risk Assessment Matrix'}
            </h3>
            <div className="grid grid-cols-5 gap-2 text-center text-xs font-mono font-bold">
              {[5, 4, 3, 2, 1].map(imp => (
                <React.Fragment key={imp}>
                  {[1, 2, 3, 4, 5].map(lik => {
                    const score = imp * lik;
                    const bg =
                      score >= 15
                        ? 'bg-red-500 text-white'
                        : score >= 10
                        ? 'bg-amber-400 text-gray-900'
                        : score >= 5
                        ? 'bg-yellow-200 text-gray-900'
                        : 'bg-emerald-200 text-gray-900';
                    return (
                      <div
                        key={`${imp}-${lik}`}
                        className={`p-2 rounded-lg ${bg} flex flex-col justify-center items-center shadow-xs`}
                      >
                        <span className="text-sm">{score}</span>
                        <span className="text-[10px] opacity-75 font-sans font-normal">
                          L{lik}×I{imp}
                        </span>
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 font-semibold pt-1">
              <span>Low Risk (&lt;5)</span>
              <span>Moderate (5–9)</span>
              <span>High (10–14)</span>
              <span>Critical (15–25)</span>
            </div>
          </div>

          {/* Risk Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[11px]">
                    <th className="p-3 text-start">Code</th>
                    <th className="p-3 text-start">Risk Title</th>
                    <th className="p-3 text-start">Category</th>
                    <th className="p-3 text-start">Likelihood × Impact</th>
                    <th className="p-3 text-start">Inherent</th>
                    <th className="p-3 text-start">Treatment Strategy</th>
                    <th className="p-3 text-start">Residual</th>
                    <th className="p-3 text-start">Owner</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {risks.map(r => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="p-3 font-mono font-bold text-[#12506E]">{r.code}</td>
                      <td className="p-3 font-semibold text-gray-900">{isAr ? r.title_ar : r.title}</td>
                      <td className="p-3 text-gray-600">{r.category}</td>
                      <td className="p-3 text-gray-600">
                        L: {r.likelihood} · I: {r.impact}
                      </td>
                      <td className="p-3 font-bold text-red-600">{r.inherentScore}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-cyan-50 text-cyan-800 border border-cyan-200">
                          {r.treatment}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-emerald-700">{r.residualScore}</td>
                      <td className="p-3 text-gray-700 font-medium">{r.owner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Asset Register Tab */
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[11px]">
                  <th className="p-3 text-start">Asset Tag</th>
                  <th className="p-3 text-start">Asset Name</th>
                  <th className="p-3 text-start">Type</th>
                  <th className="p-3 text-start">Data Classification</th>
                  <th className="p-3 text-start">Asset Owner</th>
                  <th className="p-3 text-start">Custodian</th>
                  <th className="p-3 text-end">Vulnerabilities</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {assets.map(ast => (
                  <tr key={ast.id} className="hover:bg-gray-50">
                    <td className="p-3 font-mono font-bold text-[#12506E]">{ast.assetTag}</td>
                    <td className="p-3 font-semibold text-gray-900">{isAr ? ast.name_ar : ast.name}</td>
                    <td className="p-3 text-gray-600">{ast.type}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                        {ast.classification}
                      </span>
                    </td>
                    <td className="p-3 text-gray-700 font-medium">{ast.owner}</td>
                    <td className="p-3 text-gray-600">{ast.custodian}</td>
                    <td className="p-3 text-end font-bold text-amber-700">
                      {ast.vulnerabilitiesCount} active
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Risk Modal */}
      {showAddRiskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200">
            <div className="bg-[#12506E] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">Log New Enterprise / Cyber Risk</h3>
              <button
                onClick={() => setShowAddRiskModal(false)}
                className="text-cyan-200 hover:text-white p-1 rounded-md"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddRiskSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Risk Title & Description *</label>
                <textarea
                  required
                  rows={2}
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Failure of off-site backup synchronization..."
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12506E] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12506E] focus:outline-none"
                  >
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Compliance">Compliance</option>
                    <option value="Operational">Operational</option>
                    <option value="Strategic">Strategic</option>
                    <option value="Financial">Financial</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Treatment</label>
                  <select
                    value={newTreatment}
                    onChange={e => setNewTreatment(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12506E] focus:outline-none"
                  >
                    <option value="Mitigate">Mitigate</option>
                    <option value="Accept">Accept</option>
                    <option value="Transfer">Transfer</option>
                    <option value="Avoid">Avoid</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Likelihood (1–5)</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={newLikelihood}
                    onChange={e => setNewLikelihood(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12506E] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Impact (1–5)</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={newImpact}
                    onChange={e => setNewImpact(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#12506E] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddRiskModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#12506E] hover:bg-[#0e4058] text-white font-bold rounded-lg shadow-sm"
                >
                  Save Risk Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
