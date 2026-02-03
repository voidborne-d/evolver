function uniq(arr) {
  return [...new Set(arr.filter(Boolean))];
}

function extractSignals({ recentSessionTranscript = '', todayLog = '', memorySnippet = '', userSnippet = '' } = {}) {
  const hay = [recentSessionTranscript, todayLog, memorySnippet, userSnippet].join('\n');
  const signals = [];

  const errorMatches = hay.match(/\[ERROR|Error:|Exception:|FAIL|Failed|"isError":true/gi) || [];
  if (errorMatches.length > 0) signals.push('error_detected');
  if (errorMatches.length > 2) signals.push('unstable');

  if (/permission|auth|unauthori[sz]ed|forbidden/i.test(hay)) signals.push('permission_or_auth');
  if (/timeout|slow|performance|latency|optimi[sz]/i.test(hay)) signals.push('performance_or_optimization');

  // Protocol signals (these are stable "meta" signals that help selection)
  signals.push('protocol_gep');
  signals.push('auditability_required');
  signals.push('no_emoji');

  return uniq(signals);
}

module.exports = { extractSignals };

