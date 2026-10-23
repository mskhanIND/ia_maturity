import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TEMPLATE_VERSIONS } from '../../data/templateVersionsData';
import { SECTIONS, QUESTIONS } from '../../data/templateData';
import { TemplateVersion } from '../../types';
import {
  History,
  Layers,
  Scale,
  GitCompare,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Award,
  Zap,
  Info,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  FileCode,
  Sparkles
} from 'lucide-react';

export const WorkspaceSurveys: React.FC = () => {
  const { language } = useApp();
  const isAr = language === 'ar';

  const [selectedVersionCode, setSelectedVersionCode] = useState<string>('v1.5.0');
  const [compareVersionCode, setCompareVersionCode] = useState<string>('v1.2.0');
  const [activeTab, setActiveTab] = useState<'structure' | 'scoring' | 'compare' | 'impact'>('structure');
  const [expandedSection, setExpandedSection] = useState<string | null>('SEC-1');

  const currentVersion = TEMPLATE_VERSIONS.find(v => v.version === selectedVersionCode) || TEMPLATE_VERSIONS[0];
  const compareVersion = TEMPLATE_VERSIONS.find(v => v.version === compareVersionCode) || TEMPLATE_VERSIONS[1];

  return (
    <div className="space-y-6 text-start max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">
              {isAr ? 'إدارة قوالب الاستبيانات وتاريخ الإصدارات' : 'Questionnaire Versions & Scoring Governance'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#12506E] text-white">
              {TEMPLATE_VERSIONS.length} {isAr ? 'إصدارات' : 'Versions'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {isAr
              ? 'تتبع تاريخي وتفصيلي لقوالب تقييم التدقيق الداخلي، وسياسات احتساب النقاط، وقواعد السقف الإلزامية للمقارنة عبر السنوات.'
              : 'Audit questionnaire version control, scoring formula specifications, gating rules, and cross-framework historical comparisons.'}
          </p>
        </div>

        {/* Version Switcher Dropdown */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm">
          <History className="w-4 h-4 text-[#12506E] ms-2" />
          <span className="text-xs font-semibold text-gray-700">{isAr ? 'الإصدار المختار:' : 'Selected Version:'}</span>
          <select
            value={selectedVersionCode}
            onChange={e => setSelectedVersionCode(e.target.value)}
            className="text-xs font-bold bg-gray-50 border border-gray-300 rounded-lg px-3 py-1.5 text-gray-900 focus:ring-2 focus:ring-[#12506E] focus:outline-none cursor-pointer"
          >
            {TEMPLATE_VERSIONS.map(v => (
              <option key={v.version} value={v.version}>
                {v.version} – {isAr ? v.name_ar : v.name} ({v.status.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Version Banner Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-[#12506E] to-[#1d6b92] text-white p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs uppercase px-2.5 py-0.5 rounded font-black bg-white/20 text-white backdrop-blur-sm">
                  {currentVersion.version}
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold shadow-xs ${
                    currentVersion.status === 'active'
                      ? 'bg-emerald-400 text-emerald-950 font-black'
                      : currentVersion.status === 'superseded'
                      ? 'bg-amber-300 text-amber-950 font-black'
                      : 'bg-gray-300 text-gray-900 font-bold'
                  }`}
                >
                  {isAr ? currentVersion.status_label_ar : currentVersion.status_label}
                </span>
                <span className="text-xs text-cyan-100 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {isAr ? currentVersion.effective_period_ar : currentVersion.effective_period}
                </span>
              </div>
              <h2 className="text-lg md:text-xl font-bold">{isAr ? currentVersion.name_ar : currentVersion.name}</h2>
              <p className="text-xs text-cyan-100 max-w-3xl leading-relaxed">
                {isAr ? currentVersion.summary_ar : currentVersion.summary}
              </p>
            </div>

            <div className="flex md:flex-col gap-3 text-start bg-black/15 p-3.5 rounded-xl border border-white/10 flex-none text-xs">
              <div>
                <span className="text-[10px] text-cyan-200 uppercase font-semibold block">{isAr ? 'عدد الأسئلة' : 'Questions & Domains'}</span>
                <span className="font-bold text-sm text-white">{currentVersion.questions_count} Questions · {currentVersion.sections_count} Domains</span>
              </div>
              <div>
                <span className="text-[10px] text-cyan-200 uppercase font-semibold block">{isAr ? 'الاعتماد والمصادقة' : 'Approved By'}</span>
                <span className="font-bold text-xs text-white">{currentVersion.approved_by}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Regulatory & Metadata Strip */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-3 text-xs text-gray-600 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#12506E] flex-none" />
            <span className="font-semibold text-gray-800">{isAr ? 'التوافق التنظيمي:' : 'Regulatory Alignment:'}</span>
            <span>{isAr ? currentVersion.regulatory_alignment_ar : currentVersion.regulatory_alignment}</span>
          </div>
          <div className="text-[11px] text-gray-500 font-mono">
            Authored by {currentVersion.author}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-t border-gray-200 px-6 flex items-center gap-2 overflow-x-auto bg-white">
          <button
            onClick={() => setActiveTab('structure')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'structure'
                ? 'border-[#12506E] text-[#12506E]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{isAr ? 'هيكل النموذج والأسئلة' : 'Template Structure & Domains'}</span>
          </button>

          <button
            onClick={() => setActiveTab('scoring')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'scoring'
                ? 'border-[#12506E] text-[#12506E]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>{isAr ? 'قواعد احتساب الدرجات والسقف' : 'Scoring Rules & Gating Logic'}</span>
          </button>

          <button
            onClick={() => setActiveTab('compare')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'compare'
                ? 'border-[#12506E] text-[#12506E]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <GitCompare className="w-4 h-4" />
            <span>{isAr ? 'مقارنة الإصدارات والفروقات (Diff)' : 'Version Comparison & Diff'}</span>
          </button>

          <button
            onClick={() => setActiveTab('impact')}
            className={`py-3 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'impact'
                ? 'border-[#12506E] text-[#12506E]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <History className="w-4 h-4" />
            <span>{isAr ? 'الأثر التاريخي على التقييمات السابقة' : 'Historical Data & Integrity'}</span>
          </button>
        </div>
      </div>

      {/* TAB 1: STRUCTURE & DOMAINS */}
      {activeTab === 'structure' && (
        <div className="space-y-6">
          {/* Domain Distribution Grid */}
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-gray-900">
                  {isAr ? 'توزيع مجالات التدقيق والأوزان النسبية' : 'Audit Domain Distribution & Weighting Matrix'}
                </h3>
                <p className="text-xs text-gray-500">
                  {isAr
                    ? `يتكون إصدار ${currentVersion.version} من ${currentVersion.sections_count} مجالات تدقيق تشمل ${currentVersion.questions_count} معياراً تشخيصياً.`
                    : `Version ${currentVersion.version} comprises ${currentVersion.sections_count} domains covering ${currentVersion.questions_count} evaluation standards.`}
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-[#12506E] bg-cyan-50 px-2.5 py-1 rounded-md border border-cyan-200">
                Total Weight: 100%
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {currentVersion.domain_weights.map(dom => (
                <div
                  key={dom.code}
                  onClick={() => setExpandedSection(expandedSection === dom.code ? null : dom.code)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    expandedSection === dom.code
                      ? 'border-[#12506E] bg-cyan-50/40 ring-1 ring-[#12506E]'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-[#12506E] bg-white px-2 py-0.5 rounded border border-gray-200 shadow-xs">
                      {dom.code}
                    </span>
                    <span className="text-xs font-extrabold text-gray-900">
                      {dom.weight_pct}% Weight
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-gray-900 leading-snug">
                    {isAr ? dom.title_ar : dom.title}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-gray-500 mt-3 pt-2 border-t border-gray-100">
                    <span>{dom.questions_count} Questions</span>
                    <span className="text-[#12506E] font-semibold flex items-center gap-1">
                      {expandedSection === dom.code ? 'Collapse' : 'Inspect'}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expandedSection === dom.code ? 'rotate-180' : ''}`} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Question Inspector */}
          {selectedVersionCode === 'v1.5.0' ? (
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-gray-900">
                    {isAr ? 'استعراض أسئلة ومعايير الإصدار الحالي (v1.5.0)' : 'Active Standard Diagnostic Criteria (v1.5.0 Standards)'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    All 20 questions mapped to IIA GIAS 2024 with 4 progressive maturity criteria.
                  </p>
                </div>
                <span className="text-xs text-gray-500 font-semibold">20 Questions Complete</span>
              </div>

              <div className="space-y-3">
                {QUESTIONS.map(q => (
                  <div key={q.question_code} className="p-4 rounded-xl border border-gray-200 bg-white hover:border-gray-300 space-y-2 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white bg-[#12506E] px-2 py-0.5 rounded text-[11px]">
                          {q.question_code}
                        </span>
                        <span className="font-bold text-gray-900 text-xs">
                          {isAr ? q.short_label_ar : q.short_label}
                        </span>
                        <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded font-mono">
                          {q.source_ref}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        {q.is_gating === 1 && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 border border-red-200 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Gating Constraint (Caps at Low)
                          </span>
                        )}
                        {q.auto_source && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-100 text-cyan-800 border border-cyan-200 flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            Automated SLA Integration
                          </span>
                        )}
                        {q.allow_na === 1 && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                            N/A Excludable
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-700 leading-relaxed font-normal">
                      {isAr ? q.question_text_ar : q.question_text}
                    </p>

                    {/* Criteria Preview */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-2 text-[11px]">
                      <div className="p-2.5 rounded-lg bg-red-50/50 border border-red-200/60">
                        <span className="font-bold text-red-800 block mb-0.5">A – Ad hoc (25 pts)</span>
                        <p className="text-gray-600 line-clamp-2">{isAr ? q.option_a_ar : q.option_a}</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-orange-50/50 border border-orange-200/60">
                        <span className="font-bold text-orange-800 block mb-0.5">B – Foundational (50 pts)</span>
                        <p className="text-gray-600 line-clamp-2">{isAr ? q.option_b_ar : q.option_b}</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-amber-50/50 border border-amber-200/60">
                        <span className="font-bold text-amber-800 block mb-0.5">C – Established (75 pts)</span>
                        <p className="text-gray-600 line-clamp-2">{isAr ? q.option_c_ar : q.option_c}</p>
                      </div>
                      <div className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-200/60">
                        <span className="font-bold text-emerald-800 block mb-0.5">D – Leading (100 pts)</span>
                        <p className="text-gray-600 line-clamp-2">{isAr ? q.option_d_ar : q.option_d}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-amber-800 bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs">
                <Info className="w-4 h-4 flex-none text-amber-700" />
                <span>
                  {isAr
                    ? `أنت تستعرض قالباً تاريخياً مؤرشفاً (${currentVersion.version}). هذا القالب محفوظ لأغراض المقارنة وتتبع سجل التقييمات التاريخية التي نُفذت خلال الفترة (${currentVersion.effective_period}).`
                    : `You are inspecting historical archived template ${currentVersion.version}. This version is preserved in read-only format for historical baseline assessments conducted during ${currentVersion.effective_period}.`}
                </span>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-xs text-gray-900 uppercase">
                  {isAr ? 'سجل التغييرات لهذا الإصدار' : 'Version Release Notes & Scope'}
                </h4>
                <ul className="space-y-2 text-xs text-gray-700">
                  {(isAr ? currentVersion.changelog_ar : currentVersion.changelog).map((ch, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-none" />
                      <span>{ch}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SCORING RULES & GATING */}
      {activeTab === 'scoring' && (
        <div className="space-y-6">
          {/* Scoring Methodology Summary Card */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm space-y-6">
            <div>
              <h3 className="font-bold text-base text-gray-900">
                {isAr ? `سياسات احتساب النقاط للإصدار (${currentVersion.version})` : `Scoring Policy & Rules Matrix (${currentVersion.version})`}
              </h3>
              <p className="text-xs text-gray-500">
                Formal mathematical scoring guidelines, point option values, gating boundaries, and maturity bands.
              </p>
            </div>

            {/* Rule Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <div className="flex items-center gap-2 text-[#12506E] font-bold text-xs">
                  <Scale className="w-4 h-4" />
                  <span>{isAr ? 'مقياس النقاط والخيارات' : 'Point Scale & Evaluation Scheme'}</span>
                </div>
                <div className="font-semibold text-gray-900">
                  {isAr ? currentVersion.scoring.scale_type_ar : currentVersion.scoring.scale_type}
                </div>
                <div className="pt-2 flex flex-wrap gap-2">
                  {Object.entries(currentVersion.scoring.point_options).map(([k, v]) => (
                    <span key={k} className="px-2.5 py-1 bg-white rounded-lg border border-gray-300 font-mono font-bold text-gray-800 text-[11px] shadow-2xs">
                      {k}: <span className="text-[#12506E]">{v} pts</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <div className="flex items-center gap-2 text-[#12506E] font-bold text-xs">
                  <Layers className="w-4 h-4" />
                  <span>{isAr ? 'منهجية توزيع الأوزان' : 'Weighting Methodology'}</span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {isAr ? currentVersion.scoring.weighting_method_ar : currentVersion.scoring.weighting_method}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <div className="flex items-center gap-2 text-red-700 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{isAr ? 'قواعد السقف والتقييد (Gating Rules)' : 'Independence Gating Rules'}</span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {isAr ? currentVersion.scoring.gating_rules_summary_ar : currentVersion.scoring.gating_rules_summary}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <div className="flex items-center gap-2 text-[#12506E] font-bold text-xs">
                  <Zap className="w-4 h-4" />
                  <span>{isAr ? 'الحساب الآلي واستبعاد لا ينطبق' : 'Automated SLA & N/A Exclusion'}</span>
                </div>
                <div className="space-y-1 text-gray-700">
                  <div><b>N/A Policy:</b> {isAr ? currentVersion.scoring.na_handling_ar : currentVersion.scoring.na_handling}</div>
                  <div><b>Automated Sources:</b> {isAr ? currentVersion.scoring.automated_metrics_ar : currentVersion.scoring.automated_metrics}</div>
                </div>
              </div>
            </div>

            {/* Maturity Bands Threshold Table */}
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-xs text-gray-900 uppercase">
                {isAr ? 'نطاقات ومستويات النضج الرسمية' : 'Official Maturity Threshold Bands'}
              </h4>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-xs text-start">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 font-bold border-b border-gray-200 text-[11px]">
                      <th className="p-3 text-start">Maturity Band Level</th>
                      <th className="p-3 text-start">Score Range</th>
                      <th className="p-3 text-start">Regulatory Interpretation</th>
                      <th className="p-3 text-start">Color Indicator</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentVersion.scoring.bands.map(b => (
                      <tr key={b.level} className="hover:bg-gray-50">
                        <td className="p-3 font-bold text-gray-900 flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full flex-none" style={{ backgroundColor: b.color }} />
                          <span>{b.level}</span>
                        </td>
                        <td className="p-3 font-mono font-bold text-gray-800">{b.range}</td>
                        <td className="p-3 text-gray-600">
                          {b.level.includes('Leading')
                            ? 'Demonstrates proactive continuous assurance, board partnership, and tech enablement.'
                            : b.level.includes('Established')
                            ? 'Complies with all core standards and maintains consistent operational workpapers.'
                            : b.level.includes('Foundational')
                            ? 'Essential policies established but recurring gaps in external QAIP and risk updates.'
                            : 'Subordinate reporting lines or ad-hoc audit practices requiring urgent overhaul.'}
                        </td>
                        <td className="p-3">
                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white shadow-2xs"
                            style={{ backgroundColor: b.color }}
                          >
                            {b.color}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: VERSION COMPARISON & DIFF */}
      {activeTab === 'compare' && (
        <div className="space-y-6">
          {/* Comparison Selector Toolbar */}
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-sm text-gray-900">
                {isAr ? 'مقارنة الفروقات بين نموذجين' : 'Side-by-Side Version Comparator & Changelog'}
              </h3>
              <p className="text-xs text-gray-500">
                Compare structural domains, scoring formulas, and regulatory alignments across revisions.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-semibold text-gray-600">Base:</span>
                <select
                  value={selectedVersionCode}
                  onChange={e => setSelectedVersionCode(e.target.value)}
                  className="px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold"
                >
                  {TEMPLATE_VERSIONS.map(v => (
                    <option key={v.version} value={v.version}>{v.version}</option>
                  ))}
                </select>
              </div>

              <span className="text-gray-400 font-bold">vs</span>

              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-semibold text-gray-600">Compare with:</span>
                <select
                  value={compareVersionCode}
                  onChange={e => setCompareVersionCode(e.target.value)}
                  className="px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold"
                >
                  {TEMPLATE_VERSIONS.map(v => (
                    <option key={v.version} value={v.version}>{v.version}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Side-by-side Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200 text-gray-600 font-bold text-[11px]">
                    <th className="p-3 text-start w-1/4">Specification Dimension</th>
                    <th className="p-3 text-start w-3/8 bg-cyan-50/50 text-[#12506E] font-black">
                      {currentVersion.version} ({currentVersion.status})
                    </th>
                    <th className="p-3 text-start w-3/8 text-gray-700">
                      {compareVersion.version} ({compareVersion.status})
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50">
                    <td className="p-3 font-bold text-gray-900">Framework Standard</td>
                    <td className="p-3 bg-cyan-50/20 font-semibold text-[#12506E]">{currentVersion.framework}</td>
                    <td className="p-3 text-gray-700">{compareVersion.framework}</td>
                  </tr>

                  <tr className="hover:bg-gray-50">
                    <td className="p-3 font-bold text-gray-900">Total Diagnostic Criteria</td>
                    <td className="p-3 bg-cyan-50/20 font-extrabold text-gray-900">
                      {currentVersion.questions_count} Questions · {currentVersion.sections_count} Sections
                    </td>
                    <td className="p-3 text-gray-700">
                      {compareVersion.questions_count} Questions · {compareVersion.sections_count} Sections
                    </td>
                  </tr>

                  <tr className="hover:bg-gray-50">
                    <td className="p-3 font-bold text-gray-900">Maturity Scoring Scale</td>
                    <td className="p-3 bg-cyan-50/20 text-gray-800">
                      <span className="font-semibold block">{currentVersion.scoring.scale_type}</span>
                      <span className="text-[11px] text-gray-500 font-mono">
                        {Object.entries(currentVersion.scoring.point_options).map(([k, v]) => `${k}:${v}`).join(', ')}
                      </span>
                    </td>
                    <td className="p-3 text-gray-700">
                      <span className="font-semibold block">{compareVersion.scoring.scale_type}</span>
                      <span className="text-[11px] text-gray-500 font-mono">
                        {Object.entries(compareVersion.scoring.point_options).map(([k, v]) => `${k}:${v}`).join(', ')}
                      </span>
                    </td>
                  </tr>

                  <tr className="hover:bg-gray-50">
                    <td className="p-3 font-bold text-gray-900">Independence Gating Rule</td>
                    <td className="p-3 bg-cyan-50/20">
                      {currentVersion.scoring.has_gating ? (
                        <span className="px-2 py-0.5 rounded font-bold text-red-800 bg-red-100 border border-red-200">
                          Enforced (Q1 caps maturity at Low)
                        </span>
                      ) : (
                        <span className="text-gray-400">None</span>
                      )}
                    </td>
                    <td className="p-3">
                      {compareVersion.scoring.has_gating ? (
                        <span className="px-2 py-0.5 rounded font-bold text-red-800 bg-red-100 border border-red-200">
                          Enforced
                        </span>
                      ) : (
                        <span className="text-gray-400 font-medium">None (Pure weighted average)</span>
                      )}
                    </td>
                  </tr>

                  <tr className="hover:bg-gray-50">
                    <td className="p-3 font-bold text-gray-900">Weighting Logic</td>
                    <td className="p-3 bg-cyan-50/20 text-gray-800">{currentVersion.scoring.weighting_method}</td>
                    <td className="p-3 text-gray-700">{compareVersion.scoring.weighting_method}</td>
                  </tr>

                  <tr className="hover:bg-gray-50">
                    <td className="p-3 font-bold text-gray-900">Automated Data Pipelines</td>
                    <td className="p-3 bg-cyan-50/20 text-emerald-800 font-semibold">
                      {currentVersion.scoring.automated_metrics}
                    </td>
                    <td className="p-3 text-gray-500">{compareVersion.scoring.automated_metrics}</td>
                  </tr>

                  <tr className="hover:bg-gray-50">
                    <td className="p-3 font-bold text-gray-900">N/A Exclusion Support</td>
                    <td className="p-3 bg-cyan-50/20 text-gray-800">{currentVersion.scoring.na_handling}</td>
                    <td className="p-3 text-gray-700">{compareVersion.scoring.na_handling}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Categorized Diff Highlights */}
          {currentVersion.diff_from_previous && currentVersion.diff_from_previous.length > 0 && (
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm space-y-4">
              <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#12506E]" />
                <span>
                  {isAr ? `الفروقات والتحديثات المحورية في (${currentVersion.version})` : `Key Architectural Enhancements in ${currentVersion.version}`}
                </span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {currentVersion.diff_from_previous.map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900">{isAr ? item.title_ar : item.title}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                        {item.change_type}
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {isAr ? item.description_ar : item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: HISTORICAL DATA INTEGRITY */}
      {activeTab === 'impact' && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm space-y-6 text-xs text-gray-700">
          <div>
            <h3 className="font-bold text-base text-gray-900">
              {isAr ? 'نزاهة البيانات التاريخية والتحويل بين المعايير' : 'Historical Data Immutability & Framework Conversion Policy'}
            </h3>
            <p className="text-gray-500 mt-1">
              Guarantees for retrospective compliance audits, board records, and time-series maturity trending.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
              <ShieldCheck className="w-5 h-5 text-[#12506E]" />
              <h4 className="font-bold text-gray-900 text-sm">Immutable Records</h4>
              <p className="text-gray-600 leading-relaxed">
                Assessments submitted under v1.2.0 or v1.0.0 remain permanently locked to their original versioned scoring algorithms and points tables. Revisions never retroactively alter past official reports.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
              <GitCompare className="w-5 h-5 text-[#12506E]" />
              <h4 className="font-bold text-gray-900 text-sm">Normalized Time-Series</h4>
              <p className="text-gray-600 leading-relaxed">
                When generating multi-year longitudinal maturity curves in the GRC Portal, historical IPPF 2017 scores (scale 1-5) are normalized using the IRSAA Equipercentile Mapping Function onto the 100-point GIAS scale.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
              <FileCheck className="w-5 h-5 text-[#12506E]" />
              <h4 className="font-bold text-gray-900 text-sm">Regulatory Audit Trail</h4>
              <p className="text-gray-600 leading-relaxed">
                Every official PDF export includes cryptographic timestamping and references the explicit template version code (e.g., v1.5.0-GIAS2024-KSA) for verification by SAMA or CMA external inspectors.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
