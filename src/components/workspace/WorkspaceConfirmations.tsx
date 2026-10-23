import React from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/i18n';
import { CheckSquare, ShieldAlert, Sparkles, Sliders, CheckCircle2 } from 'lucide-react';

export const WorkspaceConfirmations: React.FC = () => {
  const {
    language,
    q1GatingEnabled,
    q20AllowNaEnabled,
    q13IssueRegisterEnabled,
    equalWeightsEnabled,
    confirmPolicy
  } = useApp();

  const isAr = language === 'ar';

  return (
    <div className="space-y-6 text-start max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t('conf_title', language)}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          {t('conf_subtitle', language)}
        </p>
      </div>

      {/* Confirmation Items */}
      <div className="space-y-4">
        {/* Q1 Gating Cap */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              <h3 className="font-bold text-sm text-gray-900">
                {t('conf_q1_label', language)}
              </h3>
            </div>
            <button
              onClick={() => confirmPolicy('q1Gating', !q1GatingEnabled)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                q1GatingEnabled
                  ? 'bg-red-700 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {q1GatingEnabled ? 'Gating Active (Cap at Low)' : 'Gating Disabled'}
            </button>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            {t('conf_q1_desc', language)}
          </p>
          <div className="text-[11px] text-gray-500 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
            <b>Current Policy: </b>
            {q1GatingEnabled
              ? 'Active. If an entity reports Option A on Q1 (reporting to CEO/CFO without direct Audit Committee reporting), overall maturity cannot exceed Low (35–54.99%), regardless of other scores.'
              : 'Disabled. Points calculate purely as mathematical average without capping.'}
          </div>
        </div>

        {/* Q20 N/A Allowance */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-cyan-600" />
              <h3 className="font-bold text-sm text-gray-900">
                {t('conf_q20_label', language)}
              </h3>
            </div>
            <button
              onClick={() => confirmPolicy('q20AllowNa', !q20AllowNaEnabled)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                q20AllowNaEnabled
                  ? 'bg-emerald-700 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {q20AllowNaEnabled ? 'N/A Allowed (Excluded)' : 'N/A Disallowed'}
            </button>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            {t('conf_q20_desc', language)}
          </p>
          <div className="text-[11px] text-gray-500 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
            <b>Current Policy: </b>
            {q20AllowNaEnabled
              ? 'Active. Non-regulated entities may select N/A for statutory coordination; denominator adjusts so score percentage is not penalized.'
              : 'Disabled. Every organization must answer between options A, B, C, or D.'}
          </div>
        </div>

        {/* Q13 Auto Derivation */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-sm text-gray-900">
                {t('conf_q13_label', language)}
              </h3>
            </div>
            <button
              onClick={() => confirmPolicy('q13IssueRegister', !q13IssueRegisterEnabled)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                q13IssueRegisterEnabled
                  ? 'bg-cyan-800 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {q13IssueRegisterEnabled ? 'Auto-Derivation Active' : 'Manual Answer Only'}
            </button>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            {t('conf_q13_desc', language)}
          </p>
          <div className="text-[11px] text-gray-500 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
            <b>Current Policy: </b>
            {q13IssueRegisterEnabled
              ? 'Active. The system auto-calculates average issue closure months from the entity issue register over the last 24 months when at least 4 closed issues exist.'
              : 'Disabled. Respondent manually selects between 12+ mos (A), 9–12 mos (B), 6–9 mos (C), or 3–6 mos (D).'}
          </div>
        </div>

        {/* Question Weighting */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-sm text-gray-900">
                {t('conf_weights_label', language)}
              </h3>
            </div>
            <button
              onClick={() => confirmPolicy('equalWeights', !equalWeightsEnabled)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                equalWeightsEnabled
                  ? 'bg-indigo-700 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {equalWeightsEnabled ? 'Equal Weighting (Points)' : 'Section Weighted'}
            </button>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            {t('conf_weights_desc', language)}
          </p>
          <div className="text-[11px] text-gray-500 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
            <b>Current Policy: </b>
            {equalWeightsEnabled
              ? 'Active. Every question contributes equally (Points weighting: total points / total maximum points).'
              : 'Active. Section weights applied (Overall = sum of section % x section weight / sum of weights).'}
          </div>
        </div>
      </div>
    </div>
  );
};
