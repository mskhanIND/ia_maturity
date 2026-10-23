import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DEFAULT_BANDS } from '../../data/templateData';
import { getPeerBenchmark } from '../../utils/benchmark';
import { t } from '../../utils/i18n';
import {
  Printer,
  Download,
  Award,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  BarChart2,
  ShieldCheck,
  FileText,
  Clock,
  ArrowRight,
  HelpCircle,
  Building,
  Loader2
} from 'lucide-react';
import { generateAssessmentPDF } from '../../utils/pdfExport';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend
} from 'recharts';

export const PortalScorecard: React.FC = () => {
  const {
    language,
    activeAssessment,
    assessments,
    organizations,
    settings,
    currentUser,
    setView,
    logActivity
  } = useApp();

  const isAr = activeAssessment?.language === 'ar' || language === 'ar';
  const [activeTab, setActiveTab] = useState<'summary' | 'sections' | 'benchmark' | 'findings' | 'responses'>('summary');

  if (!activeAssessment) {
    return (
      <div className="text-center py-16 space-y-4">
        <h3 className="text-lg font-bold text-gray-900">No assessment loaded for scorecard view.</h3>
        <button
          onClick={() => setView('portal_assessments')}
          className="px-4 py-2 bg-[#12506E] text-white rounded-lg text-xs font-semibold"
        >
          Go to Assessments
        </button>
      </div>
    );
  }

  const isApproved = activeAssessment.review_status === 'Approved';
  const benchmarkResult = getPeerBenchmark(activeAssessment, assessments, organizations, settings);

  // Derive findings (Answers with A or B)
  const findings = activeAssessment.answers.filter(
    a => a.selected_option === 'A' || a.selected_option === 'B'
  );

  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    setIsExporting(true);
    try {
      generateAssessmentPDF({
        assessment: activeAssessment,
        benchmark: benchmarkResult,
        isArabic: isAr,
      });

      // Audit log the report download
      logActivity({
        action: 'REPORT_DOWNLOAD',
        actionLabel: 'Executive PDF Report Downloaded',
        actionLabelAr: 'تنزيل التقرير الرسمي بصيغة PDF',
        details: `Exported multi-page executive assessment PDF report for ${activeAssessment.name} (${activeAssessment.entity}) - Score: ${activeAssessment.overall_score}%.`,
        detailsAr: `تم إنشاء وتنزيل تقرير PDF التنفيذي الرسمي لـ ${activeAssessment.name} (${activeAssessment.entity}) بنتيجة ${activeAssessment.overall_score}%.`,
        status: 'Info',
      });

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 4000);
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 text-start max-w-5xl mx-auto pb-12 print-page">
      {/* Top Banner: Distinguish Preliminary Self-Assessment vs Approved Official Report */}
      <div
        className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm ${
          isApproved
            ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
            : 'bg-amber-50 border-amber-300 text-amber-950'
        }`}
      >
        <div className="flex items-center gap-2.5">
          {isApproved ? (
            <ShieldCheck className="w-5 h-5 text-emerald-700 flex-none" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-700 flex-none" />
          )}
          <div>
            <div className="font-extrabold text-xs uppercase tracking-wider">
              {isApproved ? t('approved_notice', language) : t('preliminary_notice', language)}
            </div>
            <div className="text-[11px] opacity-80 mt-0.5">
              {isApproved
                ? `Reviewed and signed off by ${activeAssessment.reviewer || 'IRSAA Senior GRC Reviewer'} on ${activeAssessment.reviewed_on || 'recent'}`
                : 'Submitted to IRSAA GRC Review Queue. Formal verification in progress.'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-none no-print">
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-white border border-gray-300 hover:bg-gray-100 rounded-lg text-xs font-semibold text-gray-800 flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{isAr ? 'طباعة' : 'Print'}</span>
          </button>
          <button
            disabled={isExporting}
            onClick={handleDownloadPDF}
            className="px-4 py-1.5 bg-[#12506E] hover:bg-[#0e4058] disabled:opacity-50 rounded-lg text-xs font-bold text-white flex items-center gap-1.5 shadow-sm transition-all"
            title="Download executive-ready PDF report"
          >
            {isExporting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>
              {isExporting
                ? isAr
                  ? 'جاري تجهيز PDF...'
                  : 'Generating PDF...'
                : isAr
                ? 'تنزيل PDF'
                : 'Download PDF'}
            </span>
          </button>
        </div>
      </div>

      {/* Export Success Notification Banner */}
      {exportSuccess && (
        <div className="p-3 bg-emerald-100/90 border border-emerald-300 rounded-xl text-emerald-900 text-xs flex items-center justify-between shadow-sm animate-fade-in no-print">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-none" />
            <span className="font-semibold">
              {isAr
                ? `تم إنشاء وتنزيل تقرير PDF الرسمي بنجاح لـ ${activeAssessment.entity}!`
                : `Official PDF report for ${activeAssessment.entity} has been downloaded successfully!`}
            </span>
          </div>
          <span className="text-[11px] opacity-75">Multi-page Executive Report</span>
        </div>
      )}

      {/* Main Scorecard Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-gray-100 text-gray-800">
                {activeAssessment.template}
              </span>
              <span className="text-xs text-gray-400">Ref: {activeAssessment.name}</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mt-2">
              {isAr ? 'بطاقة نضج وظيفة التدقيق الداخلي' : 'Internal Audit Function Maturity Scorecard'}
            </h1>
            <div className="text-xs text-gray-600 mt-1 flex flex-wrap gap-4">
              <span><b>{isAr ? 'المنشأة:' : 'Entity:'}</b> {activeAssessment.entity}</span>
              <span><b>{isAr ? 'التاريخ:' : 'Date:'}</b> {activeAssessment.assessment_date}</span>
              <span><b>{isAr ? 'المُقيِّم:' : 'Assessed by:'}</b> {activeAssessment.respondent_name}</span>
            </div>
          </div>

          {/* Big Score Display */}
          <div className="text-center sm:text-end bg-gray-50 p-4 rounded-xl border border-gray-200 flex-none">
            <div className="text-[11px] uppercase tracking-wider font-bold text-gray-500">
              {isAr ? 'المستوى العام للنضج' : 'Overall Maturity Level'}
            </div>
            <div className="text-4xl font-black tracking-tight mt-1" style={{ color: activeAssessment.color }}>
              {activeAssessment.overall_score}%
            </div>
            <div
              className="mt-1 px-3 py-1 rounded-full text-xs font-bold inline-block text-white"
              style={{ backgroundColor: activeAssessment.color }}
            >
              {activeAssessment.maturity_level}
            </div>
          </div>
        </div>

        {/* Gating Note Banner if triggered */}
        {activeAssessment.gating_note && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-900 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-none mt-0.5" />
            <div className="leading-relaxed font-semibold">
              {isAr ? activeAssessment.gating_note_ar || activeAssessment.gating_note : activeAssessment.gating_note}
            </div>
          </div>
        )}

        {/* Maturity Bands Spectrum Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-gray-600">
            <span>Critical (&lt;35%)</span>
            <span>Low (35–55%)</span>
            <span>Medium (55–75%)</span>
            <span>High (75–90%)</span>
            <span>Leading (90–100%)</span>
          </div>
          <div className="h-3 w-full rounded-full overflow-hidden flex bg-gray-200">
            {DEFAULT_BANDS.map(b => (
              <div
                key={b.level_name}
                className="h-full"
                style={{
                  width: `${b.max_score - b.min_score}%`,
                  backgroundColor: b.color,
                  opacity: 0.85,
                }}
                title={`${b.level_name}: ${b.min_score}% - ${b.max_score}%`}
              ></div>
            ))}
          </div>
          <div className="text-xs text-gray-600 leading-relaxed pt-1">
            <b>{isAr ? 'التفسير والنتيجة: ' : 'Interpretation: '}</b>
            {isAr ? activeAssessment.interpretation_ar || activeAssessment.interpretation : activeAssessment.interpretation}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 gap-2 text-xs font-bold no-print">
        {[
          { key: 'summary', label: 'Summary & Sections', label_ar: 'النتائج والأقسام' },
          { key: 'benchmark', label: 'Anonymous Peer Benchmark', label_ar: 'المقارنة مع النظراء' },
          { key: 'findings', label: `Findings & Roadmap (${findings.length})`, label_ar: `الملاحظات والتحسين (${findings.length})` },
          { key: 'responses', label: 'Detailed 20Q Responses', label_ar: 'تفاصيل كافة الأسئلة' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`pb-3 px-3 transition-colors border-b-2 ${
              activeTab === tab.key
                ? 'border-[#12506E] text-[#12506E]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            {isAr ? tab.label_ar : tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Summary & Sections */}
      {activeTab === 'summary' && (() => {
        const radarData = activeAssessment.section_scores.map(sec => {
          const shortDomain = isAr
            ? sec.section_code === 'S1' ? 'الحوكمة'
              : sec.section_code === 'S2' ? 'التخطيط'
              : sec.section_code === 'S3' ? 'التنفيذ'
              : sec.section_code === 'S4' ? 'التقارير'
              : sec.section_code === 'S5' ? 'الموارد'
              : 'التقنية'
            : sec.section_code === 'S1' ? 'Governance'
              : sec.section_code === 'S2' ? 'Planning'
              : sec.section_code === 'S3' ? 'Execution'
              : sec.section_code === 'S4' ? 'Reporting'
              : sec.section_code === 'S5' ? 'Resources'
              : 'Tech & Regs';

          const secBenchmark = benchmarkResult.sections?.find(b => b.code === sec.section_code);
          const peerMedian = secBenchmark ? Math.round(secBenchmark.median) : 65;

          return {
            code: sec.section_code,
            domain: `${sec.section_code}: ${shortDomain}`,
            fullTitle: isAr ? sec.section_title_ar : sec.section_title,
            score: Math.round(sec.score_pct),
            peerMedian: peerMedian,
            target: 75,
          };
        });

        return (
          <div className="space-y-6">
            {/* Visual Analytics Grid: Radar Chart + Section Progress Bars */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Radar Chart */}
              <div className="lg:col-span-6 bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#12506E]" />
                      <span>{isAr ? 'مخطط الرادار لنضج مجالات التدقيق' : 'Audit Domains Maturity Radar'}</span>
                    </h3>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-blue-50 text-[#12506E] border border-blue-200">
                      IIA GIAS
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1.5">
                    {isAr
                      ? 'مخطط متعدد المحاور يقارن نضج المنشأة في المجالات الستة مع وسيط النظراء P50'
                      : 'Multivariate radar comparing organization maturity across the 6 audit domains against peer median'}
                  </p>
                </div>

                <div className="py-2 flex items-center justify-center min-h-[320px]">
                  <ResponsiveContainer width="100%" height={320}>
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                      <PolarGrid stroke="#E2E8F0" />
                      <PolarAngleAxis
                        dataKey="domain"
                        tick={{ fill: '#334155', fontSize: 11, fontWeight: 600 }}
                      />
                      <PolarRadiusAxis
                        angle={30}
                        domain={[0, 100]}
                        tick={{ fill: '#94A3B8', fontSize: 10 }}
                        tickCount={5}
                      />
                      <Radar
                        name={isAr ? 'درجة المنشأة (%)' : 'Your Score (%)'}
                        dataKey="score"
                        stroke="#12506E"
                        fill="#12506E"
                        fillOpacity={0.45}
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: '#12506E' }}
                      />
                      {benchmarkResult.available && (
                        <Radar
                          name={isAr ? 'وسيط النظراء P50 (%)' : 'Peer Median P50 (%)'}
                          dataKey="peerMedian"
                          stroke="#059669"
                          fill="#059669"
                          fillOpacity={0.15}
                          strokeWidth={2}
                          strokeDasharray="4 4"
                          dot={{ r: 3, fill: '#059669' }}
                        />
                      )}
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const item = payload[0].payload;
                            return (
                              <div className="bg-gray-900 text-white text-xs p-3 rounded-lg shadow-xl border border-gray-700 space-y-1">
                                <div className="font-bold text-cyan-300">{item.fullTitle}</div>
                                <div className="flex items-center justify-between gap-4">
                                  <span className="text-gray-300">{isAr ? 'درجة المنشأة:' : 'Your Score:'}</span>
                                  <span className="font-extrabold text-white">{item.score}%</span>
                                </div>
                                {benchmarkResult.available && (
                                  <div className="flex items-center justify-between gap-4">
                                    <span className="text-gray-300">{isAr ? 'وسيط النظراء:' : 'Peer Median:'}</span>
                                    <span className="font-bold text-emerald-400">{item.peerMedian}%</span>
                                  </div>
                                )}
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                        iconType="circle"
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="pt-2.5 border-t border-gray-100 text-[11px] text-gray-500 flex items-center justify-between">
                  <span>{isAr ? 'عتبة النضج المرتفع: 75% فأعلى' : 'High Maturity Threshold: ≥75%'}</span>
                  <span className="font-bold text-[#12506E]">{activeAssessment.maturity_level}</span>
                </div>
              </div>

              {/* Section Score Bars */}
              <div className="lg:col-span-6 bg-white rounded-xl p-5 border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2.5">
                    {isAr ? 'النتائج التفصيلية حسب الأقسام الستة' : 'Maturity Scores by Section (IIA GIAS Domains)'}
                  </h3>
                  <div className="space-y-3 pt-2">
                    {activeAssessment.section_scores.map(sec => (
                      <div key={sec.section_code} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-gray-900 truncate max-w-[240px]">
                            <span className="font-bold text-[#12506E]">{sec.section_code}:</span>{' '}
                            {isAr ? sec.section_title_ar : sec.section_title}
                          </span>
                          <div className="flex items-center gap-1.5 flex-none">
                            <span className="font-extrabold text-gray-900">{sec.score_pct}%</span>
                            <span className="text-[10px] text-gray-500">({sec.maturity_level})</span>
                          </div>
                        </div>

                        <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${sec.score_pct}%`,
                              backgroundColor:
                                sec.score_pct >= 90
                                  ? '#1C5CA3'
                                  : sec.score_pct >= 75
                                  ? '#2D7A33'
                                  : sec.score_pct >= 55
                                  ? '#9A6F00'
                                  : sec.score_pct >= 35
                                  ? '#BF530B'
                                  : '#B42318',
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-500 flex items-center justify-between">
                  <span>{isAr ? 'إجمالي الأسئلة المستجابة:' : 'Applicable Questions Answered:'} 20/20</span>
                  <button
                    onClick={() => setActiveTab('responses')}
                    className="text-[#12506E] font-bold hover:underline"
                  >
                    {isAr ? 'عرض الإجابات ←' : 'View Answers →'}
                  </button>
                </div>
              </div>
            </div>

          {/* Section Summary Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[11px]">
                    <th className="p-3 text-start">Code</th>
                    <th className="p-3 text-start">Section Title</th>
                    <th className="p-3 text-start">Answered / Applicable</th>
                    <th className="p-3 text-start">Points</th>
                    <th className="p-3 text-start">Score %</th>
                    <th className="p-3 text-start">Maturity Band</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {activeAssessment.section_scores.map(s => (
                    <tr key={s.section_code} className="hover:bg-gray-50">
                      <td className="p-3 font-bold text-[#12506E]">{s.section_code}</td>
                      <td className="p-3 font-semibold text-gray-900">
                        {isAr ? s.section_title_ar : s.section_title}
                      </td>
                      <td className="p-3 text-gray-600">
                        {s.answered} / {s.applicable}
                      </td>
                      <td className="p-3 text-gray-600">
                        {s.points} / {s.max_points}
                      </td>
                      <td className="p-3 font-bold text-gray-900">{s.score_pct}%</td>
                      <td className="p-3 font-semibold text-gray-700">{s.maturity_level}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
      })()}

      {/* TAB 2: Anonymous Peer Benchmark */}
      {activeTab === 'benchmark' && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-gray-900">
              {t('benchmark_title', language)}
            </h3>
            <p className="text-xs text-gray-500">
              {benchmarkResult.available && benchmarkResult.overall
                ? `Compared with the latest submitted assessment of ${benchmarkResult.peer_count} other entities (${benchmarkResult.peer_group}). Strictly anonymized aggregate quartiles.`
                : 'Peer benchmark requires at least 3 submitted peer entities in the selected peer group.'}
            </p>
          </div>

          {benchmarkResult.available && benchmarkResult.overall ? (
            <div className="space-y-6">
              {/* Overall Percentile & Median Card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-[#F4F6F8] rounded-xl border border-gray-200">
                <div>
                  <div className="text-[11px] font-bold text-gray-500 uppercase">Your Organization</div>
                  <div className="text-2xl font-black text-gray-900 mt-1">
                    {benchmarkResult.overall.value}%
                  </div>
                  <div className="text-xs text-gray-500">Score Achieved</div>
                </div>

                <div>
                  <div className="text-[11px] font-bold text-gray-500 uppercase">Peer Median (P50)</div>
                  <div className="text-2xl font-black text-[#12506E] mt-1">
                    {benchmarkResult.overall.median}%
                  </div>
                  <div className="text-xs text-gray-500">
                    Delta: {Math.round((benchmarkResult.overall.value - benchmarkResult.overall.median) * 10) / 10}%
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-bold text-gray-500 uppercase">Percentile Standing</div>
                  <div className="text-2xl font-black text-emerald-700 mt-1">
                    {benchmarkResult.overall.percentile}th
                  </div>
                  <div className="text-xs text-gray-500">Higher than {benchmarkResult.overall.percentile}% of peers</div>
                </div>
              </div>

              {/* Section-by-Section Benchmark Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-start">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[11px]">
                      <th className="p-3 text-start">Section</th>
                      <th className="p-3 text-start">Your Score</th>
                      <th className="p-3 text-start">Peer Median</th>
                      <th className="p-3 text-start">Middle 50% (P25 - P75)</th>
                      <th className="p-3 text-start">vs Median</th>
                      <th className="p-3 text-start">Percentile</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {benchmarkResult.sections?.map(sec => (
                      <tr key={sec.code} className="hover:bg-gray-50">
                        <td className="p-3 font-semibold text-gray-900">
                          {sec.code}: {isAr ? sec.title_ar : sec.title}
                        </td>
                        <td className="p-3 font-bold text-gray-900">{sec.value}%</td>
                        <td className="p-3 text-gray-700">{sec.median}%</td>
                        <td className="p-3 text-gray-500">
                          {sec.p25}% – {sec.p75}%
                        </td>
                        <td className="p-3 font-bold">
                          <span
                            className={
                              sec.delta >= 0 ? 'text-emerald-700' : 'text-red-700'
                            }
                          >
                            {sec.delta >= 0 ? `+${sec.delta}%` : `${sec.delta}%`}
                          </span>
                        </td>
                        <td className="p-3 text-gray-700">{sec.percentile}th</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-gray-50 rounded-xl text-xs text-gray-600">
              Benchmark statistics will become active when additional peers submit on this template.
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Findings & Improvement Roadmap */}
      {activeTab === 'findings' && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                {isAr ? 'أبرز الملاحظات وخارطة طريق التحسين' : 'Audit Findings & Roadmap to Leading'}
              </h3>
              <p className="text-xs text-gray-500">
                Findings are automatically logged for questions answered at Level A (Immediate 0–3 months) or Level B (High 3–6 months).
              </p>
            </div>
          </div>

          {findings.length === 0 ? (
            <div className="p-6 text-center text-xs text-gray-500 bg-gray-50 rounded-xl">
              No findings: All questions were answered at Level C (Established) or Level D (Leading).
            </div>
          ) : (
            <div className="space-y-4">
              {findings.map(f => {
                const isImmediate = f.selected_option === 'A';
                return (
                  <div
                    key={f.question_code}
                    className="p-4 rounded-xl border border-gray-200 bg-white space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#12506E]">{f.question_code}</span>
                        <span className="font-bold text-gray-900">{isAr ? f.short_label_ar : f.short_label}</span>
                      </div>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                          isImmediate
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isImmediate ? 'Immediate Priority (0–3 Mos)' : 'High Priority (3–6 Mos)'}
                      </span>
                    </div>

                    <div className="text-gray-700">
                      <span className="font-bold text-gray-900">Current Level ({f.selected_option}): </span>
                      {isAr ? f.question_text_ar : f.question_text}
                    </div>

                    <div className="p-3 bg-[#F4F6F8] rounded-lg border border-gray-200 text-gray-800">
                      <span className="font-bold text-emerald-800">Target Level Practice: </span>
                      Upgrade capability to next standard maturity band with formal Audit Committee approval and verification.
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Detailed Responses */}
      {activeTab === 'responses' && (
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">
            Detailed 20-Question Responses Audit Log
          </h3>

          <div className="space-y-3">
            {activeAssessment.answers.map(ans => (
              <div
                key={ans.question_code}
                className="p-3.5 rounded-lg border border-gray-200 bg-gray-50/50 space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-gray-900">
                    <span className="text-[#12506E]">{ans.question_code}:</span>{' '}
                    {isAr ? ans.short_label_ar : ans.short_label}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold px-2 py-0.5 rounded bg-white border border-gray-300">
                      Option {ans.selected_option || 'Unanswered'} ({ans.points} pts)
                    </span>
                  </div>
                </div>
                <div className="text-gray-600">{isAr ? ans.question_text_ar : ans.question_text}</div>
                {ans.comment && (
                  <div className="text-[11px] text-gray-500 bg-white p-2 rounded border border-gray-200">
                    <b>Note:</b> {ans.comment}
                  </div>
                )}
                {ans.evidence && (
                  <div className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Evidence Attached: {ans.evidence}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviewer Sign-off Section */}
      {activeAssessment.reviewer_comments && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-2 text-xs">
          <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>IRSAA GRC Reviewer Comments & Sign-off</span>
          </h4>
          <p className="text-gray-700 leading-relaxed bg-[#F4F6F8] p-4 rounded-lg border border-gray-200">
            {activeAssessment.reviewer_comments}
          </p>
          <div className="text-gray-500 text-[11px]">
            Reviewed by <b>{activeAssessment.reviewer}</b> on {activeAssessment.reviewed_on}
          </div>
        </div>
      )}
    </div>
  );
};
