import { AuditIssue } from '../types';

export const DAYS_PER_MONTH = 30.4375;

export interface IssueClosureStats {
  count: number;
  avgMonths: number | null;
  medianMonths: number | null;
  openOver12: number;
  since: string;
  asOf: string;
  minSample: number;
}

export function calculateClosureStats(
  entityName: string,
  issues: AuditIssue[],
  lookbackMonths = 24,
  minSample = 5,
  asOfDate?: string
): IssueClosureStats | null {
  const asOf = asOfDate ? new Date(asOfDate) : new Date();
  const since = new Date(asOf);
  since.setMonth(since.getMonth() - lookbackMonths);

  const entityIssues = issues.filter(i => i.entity === entityName);
  if (entityIssues.length === 0) {
    return null;
  }

  const closedInRange = entityIssues.filter(i => {
    if (!i.closed_on || !i.raised_on) return false;
    const closed = new Date(i.closed_on);
    return closed >= since && closed <= asOf;
  });

  const months = closedInRange.map(i => {
    const raised = new Date(i.raised_on);
    const closed = new Date(i.closed_on!);
    const diffDays = Math.max(0, (closed.getTime() - raised.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays / DAYS_PER_MONTH;
  });

  // Open issues older than 12 months
  const twelveMonthsAgo = new Date(asOf);
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
  const openOver12 = entityIssues.filter(i => {
    if (i.closed_on) return false;
    const raised = new Date(i.raised_on);
    return raised <= twelveMonthsAgo;
  }).length;

  const count = months.length;
  let avgMonths: number | null = null;
  let medianMonths: number | null = null;

  if (count > 0) {
    avgMonths = Math.round((months.reduce((a, b) => a + b, 0) / count) * 10) / 10;
    const sorted = [...months].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    medianMonths = sorted.length % 2 !== 0
      ? Math.round(sorted[mid] * 10) / 10
      : Math.round(((sorted[mid - 1] + sorted[mid]) / 2) * 10) / 10;
  }

  return {
    count,
    avgMonths,
    medianMonths,
    openOver12,
    since: since.toISOString().split('T')[0],
    asOf: asOf.toISOString().split('T')[0],
    minSample,
  };
}

export function letterForClosureTime(
  avgMonths: number,
  aAbove = 12,
  bAbove = 9,
  cAbove = 6
): 'A' | 'B' | 'C' | 'D' {
  if (avgMonths > aAbove) return 'A';
  if (avgMonths > bAbove) return 'B';
  if (avgMonths > cAbove) return 'C';
  return 'D';
}

export function describeClosureStats(
  stats: IssueClosureStats | null
): { en: string; ar: string } {
  if (!stats) {
    return {
      en: "The issue register has no historical records for this entity, so this question is answered manually.",
      ar: "سجل الملاحظات لا يحتوي على سجلات تاريخية لهذه الجهة، لذا يُجاب عن هذا السؤال يدوياً."
    };
  }

  if (stats.count < stats.minSample) {
    return {
      en: `Only ${stats.count} issue(s) closed between ${stats.since} and ${stats.asOf} in the issue register (at least ${stats.minSample} needed), so this question is answered manually.`,
      ar: `أُغلقت ${stats.count} ملاحظة فقط بين ${stats.since} و${stats.asOf} في سجل الملاحظات (يلزم ${stats.minSample} على الأقل)، لذا يُجاب عن هذا السؤال يدوياً.`
    };
  }

  const openEn = stats.openOver12 > 0 ? ` ${stats.openOver12} issue(s) have been open for more than 12 months.` : "";
  const openAr = stats.openOver12 > 0 ? ` وتوجد ${stats.openOver12} ملاحظة مفتوحة منذ أكثر من 12 شهراً.` : "";

  return {
    en: `Calculated from the audit issue register: ${stats.count} issues closed between ${stats.since} and ${stats.asOf}, average ${stats.avgMonths} months to close (median ${stats.medianMonths} mos).${openEn}`,
    ar: `محسوبة من سجل ملاحظات التدقيق: أُغلقت ${stats.count} ملاحظة بين ${stats.since} و${stats.asOf}، بمتوسط ${stats.avgMonths} شهراً للإغلاق (الوسيط ${stats.medianMonths} شهراً).${openAr}`
  };
}
