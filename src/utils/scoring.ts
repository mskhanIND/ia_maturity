import { AssessmentAnswer, SectionScore, MaturityBand, SettingsConfig } from '../types';
import { SECTIONS, DEFAULT_BANDS } from '../data/templateData';

export const LETTERS = ['A', 'B', 'C', 'D'] as const;
export const LETTER_AR: Record<string, string> = {
  A: "أ",
  B: "ب",
  C: "ج",
  D: "د",
  "N/A": "لا ينطبق"
};

export const LEVEL_NAMES: Record<string, string> = {
  A: "Ad hoc",
  B: "Foundational",
  C: "Established",
  D: "Leading",
  "N/A": "Not applicable"
};

export const LEVEL_NAMES_AR: Record<string, string> = {
  A: "ارتجالي",
  B: "تأسيسي",
  C: "راسخ",
  D: "رائد",
  "N/A": "لا ينطبق"
};

export const DEFAULT_POINTS = {
  A: 25.0,
  B: 50.0,
  C: 75.0,
  D: 100.0
};

export const PRIORITY: Record<'A' | 'B' | 'C', { priority: 'Immediate' | 'High' | 'Medium'; timeframe: string; days: number }> = {
  A: { priority: "Immediate", timeframe: "0–3 months", days: 90 },
  B: { priority: "High", timeframe: "3–6 months", days: 180 },
  C: { priority: "Medium", timeframe: "6–12 months", days: 365 },
};

export function bandFor(pct: number, bands: MaturityBand[]): MaturityBand {
  let chosen = bands[0];
  for (const band of bands) {
    if (pct + 1e-9 >= band.min_score) {
      chosen = band;
    }
  }
  return chosen;
}

export function bandIndex(levelName: string, bands: MaturityBand[]): number | null {
  for (let i = 0; i < bands.length; i++) {
    if (bands[i].level_name.toLowerCase() === (levelName || '').trim().toLowerCase()) {
      return i;
    }
  }
  return null;
}

export function gateLetters(trigger?: string): Set<string> {
  return (trigger || 'A').trim() === 'A or B' ? new Set(['A', 'B']) : new Set(['A']);
}

export interface ComputeResult {
  sections: SectionScore[];
  overall_score: number;
  overall_points: number;
  max_points: number;
  score_level: string;
  maturity_level: string;
  interpretation: string;
  interpretation_ar: string;
  color: string;
  gating_note: string;
  gating_note_ar: string;
  answered_count: number;
  question_count: number;
  na_count: number;
  findings_count: number;
  immediate_count: number;
}

export function computeScores(
  answers: AssessmentAnswer[],
  config?: Partial<SettingsConfig>
): ComputeResult {
  const bands = config?.bands && config.bands.length > 0 ? [...config.bands] : [...DEFAULT_BANDS];
  bands.sort((a, b) => a.min_score - b.min_score);

  const pts: Record<string, number> = {
    A: config?.points_a ?? DEFAULT_POINTS.A,
    B: config?.points_b ?? DEFAULT_POINTS.B,
    C: config?.points_c ?? DEFAULT_POINTS.C,
    D: config?.points_d ?? DEFAULT_POINTS.D,
  };
  const maxPt = Math.max(...Object.values(pts));

  const secRows: SectionScore[] = SECTIONS.map(s => ({
    section_code: s.section_code,
    section_title: s.section_title,
    section_title_ar: s.section_title_ar,
    reference: s.reference,
    reference_ar: s.reference_ar,
    owner_role: s.owner_role,
    owner_role_ar: s.owner_role_ar,
    weight: s.weight ?? 1.0,
    answered: 0,
    applicable: 0,
    points: 0,
    max_points: 0,
    score_pct: 0,
    maturity_level: '',
  }));

  const byCode = new Map<string, SectionScore>();
  for (const s of secRows) {
    byCode.set(s.section_code, s);
  }

  let answered = 0;
  let na = 0;
  let findings = 0;
  let immediate = 0;
  let totalPts = 0.0;
  let totalMax = 0.0;
  const gateHits: Array<[string, string, string, string, string]> = []; // [code, short_label, opt, cap_level, short_label_ar]

  for (const a of answers) {
    const sec = byCode.get(a.section_code);
    const opt = (a.selected_option || '').trim();

    if (!opt) {
      // Unanswered counts toward maximum points denominator
      if (sec) {
        sec.applicable += 1;
        sec.max_points += maxPt;
      }
      totalMax += maxPt;
      continue;
    }

    answered += 1;
    if (opt === 'N/A') {
      na += 1;
      continue;
    }

    const p = pts[opt] ?? 0.0;
    totalPts += p;
    totalMax += maxPt;

    if (sec) {
      sec.answered += 1;
      sec.applicable += 1;
      sec.points += p;
      sec.max_points += maxPt;
    }

    if (opt === 'A' || opt === 'B') {
      findings += 1;
    }
    if (opt === 'A') {
      immediate += 1;
    }

    if (a.is_gating && a.gate_cap_level && gateLetters(a.gate_trigger).has(opt)) {
      gateHits.push([
        a.question_code,
        a.short_label || '',
        opt,
        a.gate_cap_level,
        a.short_label_ar || ''
      ]);
    }
  }

  for (const sec of secRows) {
    sec.score_pct = sec.max_points ? Math.round((sec.points / sec.max_points) * 1000) / 10 : 0.0;
    sec.maturity_level = sec.max_points ? bandFor(sec.score_pct, bands).level_name : 'N/A';
  }

  let overall = 0.0;
  if (config?.weighting_method === 'Section Weights') {
    const scored = secRows.filter(s => s.max_points > 0 && s.weight > 0);
    const wsum = scored.reduce((acc, s) => acc + s.weight, 0);
    overall = wsum ? Math.round((scored.reduce((acc, s) => acc + s.score_pct * s.weight, 0) / wsum) * 10) / 10 : 0.0;
  } else {
    overall = totalMax ? Math.round((totalPts / totalMax) * 1000) / 10 : 0.0;
  }

  const scoreBand = bandFor(overall, bands);
  let finalBand = scoreBand;
  let gatingNote = '';
  let gatingNoteAr = '';

  if (gateHits.length > 0) {
    const scoreIdx = bandIndex(scoreBand.level_name, bands);
    let capIdx: number | null = null;
    let triggerHit: [string, string, string, string, string] | null = null;

    for (const hit of gateHits) {
      const idx = bandIndex(hit[3], bands);
      if (idx !== null && (capIdx === null || idx < capIdx)) {
        capIdx = idx;
        triggerHit = hit;
      }
    }

    if (capIdx !== null && scoreIdx !== null && scoreIdx > capIdx && triggerHit) {
      finalBand = bands[capIdx];
      gatingNote = `Overall level capped at ${finalBand.level_name} because gating question ${triggerHit[0]} (${triggerHit[1]}) was answered ${triggerHit[2]}. The score alone would indicate ${scoreBand.level_name}.`;
      gatingNoteAr = `تم تحديد المستوى العام عند «${finalBand.level_name_ar || finalBand.level_name}» لأن السؤال الحاكم ${triggerHit[0]} (${triggerHit[4] || triggerHit[1]}) أُجيب عنه بالمستوى (${LETTER_AR[triggerHit[2]] || triggerHit[2]}). ولولا ذلك لأشارت النتيجة إلى المستوى «${scoreBand.level_name_ar || scoreBand.level_name}».`;
    }
  }

  return {
    sections: secRows,
    overall_score: overall,
    overall_points: totalPts,
    max_points: totalMax,
    score_level: scoreBand.level_name,
    maturity_level: finalBand.level_name,
    interpretation: finalBand.interpretation,
    interpretation_ar: finalBand.interpretation_ar || '',
    color: finalBand.color,
    gating_note: gatingNote,
    gating_note_ar: gatingNoteAr,
    answered_count: answered,
    question_count: answers.length,
    na_count: na,
    findings_count: findings,
    immediate_count: immediate,
  };
}
