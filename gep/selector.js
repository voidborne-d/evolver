const { readAllEvents } = require('./assetStore');

function safeRegexFromPattern(pattern) {
  // Treat pattern as a case-insensitive substring if regex compilation fails.
  try {
    return new RegExp(pattern, 'i');
  } catch {
    const escaped = String(pattern).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(escaped, 'i');
  }
}

function geneStatsById(events) {
  const stats = new Map(); // id -> { total, success }
  for (const evt of events) {
    const geneId = Array.isArray(evt.genes_used) ? evt.genes_used[0] : null;
    if (!geneId) continue;
    const s = stats.get(geneId) || { total: 0, success: 0 };
    s.total += 1;
    if (evt.outcome && evt.outcome.status === 'success') s.success += 1;
    stats.set(geneId, s);
  }
  return stats;
}

function scoreGene({ gene, signals, stats }) {
  const patterns = Array.isArray(gene.signals_match) ? gene.signals_match : [];
  const matched = [];
  for (const sig of signals) {
    if (patterns.some(p => safeRegexFromPattern(p).test(sig))) matched.push(sig);
  }

  const s = stats.get(gene.id) || { total: 0, success: 0 };
  const successRate = s.total > 0 ? s.success / s.total : 0.5; // neutral prior
  const maxFiles = gene?.constraints?.max_files ?? 999;

  // Weighting: match count dominates, then success rate, then smaller max_files.
  const score = matched.length * 10 + successRate * 5 + (maxFiles <= 12 ? 1 : 0);
  return { score, matched, successRate, total: s.total };
}

function selectGeneAndCapsule({ genes = [], capsules = [], signals = [] }) {
  const events = readAllEvents();
  const stats = geneStatsById(events);

  const scored = genes
    .map(g => {
      const r = scoreGene({ gene: g, signals, stats });
      return { gene: g, ...r };
    })
    .sort((a, b) => b.score - a.score);

  const selectedGene = scored.length ? scored[0].gene : null;
  const alternatives = scored.slice(1, 4).map(x => x.gene.id);

  const capsuleCandidates = capsules.filter(c => {
    if (!c || typeof c.gene !== 'string' || !Array.isArray(c.trigger)) return false;
    return c.trigger.some(t => signals.includes(t));
  });

  const selector = {
    selected: selectedGene ? selectedGene.id : null,
    reason: [
      'signals match',
      'prefer existing gene',
      'use historical outcomes when available',
      'keep blast radius small when possible',
    ],
    alternatives,
    capsule_hits: capsuleCandidates.slice(0, 5).map(c => c.id),
  };

  return { selectedGene, capsuleCandidates, selector, geneScoreBreakdown: scored.slice(0, 5) };
}

module.exports = { selectGeneAndCapsule };

