import { AssessmentDoc, PeerBenchmarkResult, SettingsConfig, EntityRecord } from '../types';

export function calculateQuartiles(values: number[]): [number, number, number] {
  if (values.length === 0) return [0, 0, 0];
  const sorted = [...values].sort((a, b) => a - b);
  if (sorted.length === 1) return [sorted[0], sorted[0], sorted[0]];

  const getPercentile = (p: number) => {
    const pos = (sorted.length - 1) * p;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
      return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    }
    return sorted[base];
  };

  const q1 = Math.round(getPercentile(0.25) * 10) / 10;
  const med = Math.round(getPercentile(0.5) * 10) / 10;
  const q3 = Math.round(getPercentile(0.75) * 10) / 10;
  return [q1, med, q3];
}

export function percentileRank(value: number, values: number[]): number {
  if (!values.length) return 50;
  const below = values.filter(v => v < value).length;
  const equal = values.filter(v => v === value).length;
  return Math.round(((below + 0.5 * equal) / values.length) * 100);
}

export function getPeerBenchmark(
  currentAssessment: AssessmentDoc,
  allAssessments: AssessmentDoc[],
  entities: EntityRecord[],
  settings: SettingsConfig
): PeerBenchmarkResult {
  const minPeers = settings.benchmark_min_peers || 5;
  const enabled = settings.enable_benchmarking;

  if (!enabled) {
    return { enabled: false, available: false, min_peers: minPeers };
  }

  const currentEntity = entities.find(e => e.entity_name === currentAssessment.entity);
  const currentSector = currentEntity?.sector;

  let peerGroup = 'All entities';
  let sectorFilter = '';

  if (settings.benchmark_peer_group === 'Same sector') {
    peerGroup = 'Same sector';
    if (!currentSector) {
      return {
        enabled: true,
        available: false,
        min_peers: minPeers,
        peer_group: peerGroup,
        reason: 'no_sector'
      };
    }
    sectorFilter = currentSector;
  }

  // Get submitted peer assessments excluding the current entity
  const submittedPeers = allAssessments.filter(a => {
    if (a.docstatus !== 1) return false;
    if (a.entity === currentAssessment.entity) return false;
    if (sectorFilter) {
      const ent = entities.find(e => e.entity_name === a.entity);
      if (ent?.sector !== sectorFilter) return false;
    }
    return true;
  });

  // Get latest per entity
  const latestByEntity = new Map<string, AssessmentDoc>();
  for (const peer of submittedPeers) {
    if (!latestByEntity.has(peer.entity)) {
      latestByEntity.set(peer.entity, peer);
    }
  }

  const peers = Array.from(latestByEntity.values());
  const peerCount = peers.length;

  if (peerCount < minPeers) {
    return {
      enabled: true,
      available: false,
      min_peers: minPeers,
      peer_count: peerCount,
      peer_group: peerGroup,
      sector: sectorFilter,
      reason: 'too_few_peers'
    };
  }

  const overallScores = peers.map(p => p.overall_score);
  const [q1, med, q3] = calculateQuartiles(overallScores);
  const avg = Math.round((overallScores.reduce((a, b) => a + b, 0) / peerCount) * 10) / 10;
  const pRank = percentileRank(currentAssessment.overall_score, overallScores);

  // Calculate sections
  const sectionBenchmarks = currentAssessment.section_scores.map(sec => {
    const secScores = peers.map(p => {
      const pSec = p.section_scores.find(s => s.section_code === sec.section_code);
      return pSec ? pSec.score_pct : 0;
    });

    const [sq1, smed, sq3] = calculateQuartiles(secScores);
    const savg = Math.round((secScores.reduce((a, b) => a + b, 0) / secScores.length) * 10) / 10;
    const srank = percentileRank(sec.score_pct, secScores);
    const sdelta = Math.round((sec.score_pct - smed) * 10) / 10;

    return {
      code: sec.section_code,
      title: sec.section_title,
      title_ar: sec.section_title_ar,
      value: sec.score_pct,
      p25: sq1,
      median: smed,
      p75: sq3,
      average: savg,
      delta: sdelta,
      percentile: srank,
    };
  });

  return {
    enabled: true,
    available: true,
    min_peers: minPeers,
    peer_count: peerCount,
    peer_group: peerGroup,
    sector: sectorFilter,
    as_of: new Date().toISOString().split('T')[0],
    overall: {
      value: currentAssessment.overall_score,
      p25: q1,
      median: med,
      p75: q3,
      average: avg,
      percentile: pRank
    },
    sections: sectionBenchmarks
  };
}
