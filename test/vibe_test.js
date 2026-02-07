#!/usr/bin/env node
// Vibe Testing Framework for Capability Evolver
// Zero-dependency, end-to-end verification in OpenClaw-compatible container.
// Exit code 0 = all pass, 1 = at least one failure.

'use strict';

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Harness
// ---------------------------------------------------------------------------

const results = [];
let currentTest = null;

function pad(s, n) {
  var str = String(s);
  while (str.length < n) str += '.';
  return str;
}

function run(id, name, fn) {
  currentTest = { id: id, name: name };
  var t0 = Date.now();
  try {
    fn();
    var dt = Date.now() - t0;
    results.push({ id: id, name: name, ok: true, dt: dt, error: null });
    process.stdout.write('[VIBE] ' + id + ' ' + pad(name + ' ', 30) + ' PASS (' + dt + 'ms)\n');
  } catch (e) {
    var dt2 = Date.now() - t0;
    var msg = e && e.message ? e.message : String(e);
    results.push({ id: id, name: name, ok: false, dt: dt2, error: msg });
    process.stdout.write('[VIBE] ' + id + ' ' + pad(name + ' ', 30) + ' FAIL (' + dt2 + 'ms)\n');
    process.stdout.write('       -> ' + msg + '\n');
  }
  currentTest = null;
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function assertType(obj, field, expected, label) {
  var actual = typeof obj[field];
  assert(actual === expected, (label || field) + ': expected typeof ' + expected + ', got ' + actual);
}

// ---------------------------------------------------------------------------
// Resolve skill root (works both in-repo and in Docker container)
// ---------------------------------------------------------------------------

var SKILL_ROOT = process.env.SKILL_ROOT || path.resolve(__dirname, '..');

// ---------------------------------------------------------------------------
// T1: Module Load
// ---------------------------------------------------------------------------

run('T1', 'module_load', function () {
  var modules = [
    'src/gep/contentHash',
    'src/gep/envFingerprint',
    'src/gep/validationReport',
    'src/gep/a2aProtocol',
    'src/gep/paths',
    'src/gep/signals',
    'src/gep/selector',
    'src/gep/assetStore',
    'src/gep/mutation',
    'src/gep/personality',
    'src/gep/memoryGraph',
    'src/gep/a2a',
    'src/gep/candidates',
    'src/gep/bridge',
    'src/gep/prompt',
    'src/gep/solidify',
    'src/evolve',
  ];
  for (var i = 0; i < modules.length; i++) {
    var mod = modules[i];
    try {
      require(path.join(SKILL_ROOT, mod));
    } catch (e) {
      throw new Error('Failed to load ' + mod + ': ' + (e.message || e));
    }
  }
  assert(modules.length >= 15, 'Expected at least 15 modules, got ' + modules.length);
});

// ---------------------------------------------------------------------------
// T2: Dry-Run Solidify
// ---------------------------------------------------------------------------

run('T2', 'dry_run_solidify', function () {
  var solidify = require(path.join(SKILL_ROOT, 'src/gep/solidify')).solidify;
  var res = solidify({ dryRun: true });

  assert(res && typeof res === 'object', 'solidify should return an object');
  assert(res.event && typeof res.event === 'object', 'result should contain event');
  assert(typeof res.event.id === 'string', 'event.id should be a string');
  assert(typeof res.event.type === 'string', 'event.type should be a string');
  assert(res.event.type === 'EvolutionEvent', 'event.type should be EvolutionEvent');
  assert(res.gene && typeof res.gene === 'object', 'result should contain gene');
  assert(res.validationReport && typeof res.validationReport === 'object', 'result should contain validationReport');
  assert(res.validationReport.type === 'ValidationReport', 'validationReport.type should be ValidationReport');
});

// ---------------------------------------------------------------------------
// T3: Schema Compliance
// ---------------------------------------------------------------------------

run('T3', 'schema_compliance', function () {
  var solidify = require(path.join(SKILL_ROOT, 'src/gep/solidify')).solidify;
  var res = solidify({ dryRun: true });

  // EvolutionEvent
  var ev = res.event;
  assert(typeof ev.schema_version === 'string' && ev.schema_version.length > 0, 'event missing schema_version');
  assert(typeof ev.asset_id === 'string' && ev.asset_id.startsWith('sha256:'), 'event missing valid asset_id');
  assert(ev.env_fingerprint && typeof ev.env_fingerprint === 'object', 'event missing env_fingerprint');
  assert(typeof ev.env_fingerprint.node_version === 'string', 'event.env_fingerprint missing node_version');
  assert(typeof ev.env_fingerprint.platform === 'string', 'event.env_fingerprint missing platform');
  assert(typeof ev.validation_report_id === 'string', 'event missing validation_report_id');

  // Gene
  var gene = res.gene;
  assert(typeof gene.schema_version === 'string', 'gene missing schema_version');
  assert(typeof gene.asset_id === 'string' && gene.asset_id.startsWith('sha256:'), 'gene missing valid asset_id');

  // ValidationReport
  var vr = res.validationReport;
  assert(typeof vr.schema_version === 'string', 'validationReport missing schema_version');
  assert(typeof vr.asset_id === 'string' && vr.asset_id.startsWith('sha256:'), 'validationReport missing valid asset_id');
  assert(vr.env_fingerprint && typeof vr.env_fingerprint === 'object', 'validationReport missing env_fingerprint');
  assert(typeof vr.env_fingerprint_key === 'string' && vr.env_fingerprint_key.length > 0, 'validationReport missing env_fingerprint_key');
  assert(typeof vr.overall_ok === 'boolean', 'validationReport missing overall_ok');
  assert(Array.isArray(vr.commands), 'validationReport missing commands array');

  // Schema versions should all match
  assert(ev.schema_version === gene.schema_version, 'schema_version mismatch between event and gene');
  assert(ev.schema_version === vr.schema_version, 'schema_version mismatch between event and validationReport');
});

// ---------------------------------------------------------------------------
// T4: A2A Round-Trip
// ---------------------------------------------------------------------------

run('T4', 'a2a_round_trip', function () {
  var contentHash = require(path.join(SKILL_ROOT, 'src/gep/contentHash'));
  var a2aProto = require(path.join(SKILL_ROOT, 'src/gep/a2aProtocol'));
  var a2a = require(path.join(SKILL_ROOT, 'src/gep/a2a'));

  // Create a test capsule with asset_id
  var capsule = {
    type: 'Capsule',
    schema_version: contentHash.SCHEMA_VERSION,
    id: 'capsule_vibe_test_1',
    trigger: ['log_error'],
    gene: 'gene_vibe_test',
    summary: 'Vibe test capsule for A2A round-trip',
    confidence: 0.8,
    blast_radius: { files: 1, lines: 10 },
    outcome: { status: 'success', score: 0.85 },
    success_streak: 2,
    a2a: { eligible_to_broadcast: true },
  };
  capsule.asset_id = contentHash.computeAssetId(capsule);

  // Step 1: Wrap in publish protocol message
  var publishMsg = a2aProto.buildPublish({ asset: capsule });
  assert(publishMsg.protocol === 'gep-a2a', 'publish message should have gep-a2a protocol');
  assert(publishMsg.message_type === 'publish', 'message_type should be publish');
  assert(publishMsg.payload.asset_id === capsule.asset_id, 'publish payload should carry asset_id');

  // Step 2: Serialize and parse (simulate network transfer)
  var wire = JSON.stringify(publishMsg);
  var received = JSON.parse(wire);

  // Step 3: Unwrap using A2A protocol
  var unwrapped = a2aProto.unwrapAssetFromMessage(received);
  assert(unwrapped !== null, 'unwrapAssetFromMessage should extract asset');
  assert(unwrapped.type === 'Capsule', 'unwrapped asset should be a Capsule');
  assert(unwrapped.id === capsule.id, 'unwrapped asset id should match');

  // Step 4: Verify asset_id integrity
  var verified = contentHash.verifyAssetId(unwrapped);
  assert(verified === true, 'asset_id integrity check should pass after round-trip');

  // Step 5: parseA2AInput should also handle protocol messages
  var parsed = a2a.parseA2AInput(wire);
  assert(Array.isArray(parsed) && parsed.length === 1, 'parseA2AInput should return 1 asset from protocol message');
  assert(parsed[0].type === 'Capsule', 'parsed asset should be a Capsule');

  // Step 6: Tamper detection -- mutate and verify fails
  var tampered = JSON.parse(JSON.stringify(unwrapped));
  tampered.confidence = 0.99;
  var tamperedVerify = contentHash.verifyAssetId(tampered);
  assert(tamperedVerify === false, 'tampered asset should fail integrity check');

  // Step 7: Verify hello message format
  var hello = a2aProto.buildHello({ geneCount: 2, capsuleCount: 1 });
  assert(hello.protocol === 'gep-a2a', 'hello should have gep-a2a protocol');
  assert(hello.message_type === 'hello', 'hello message_type should be hello');
  assert(hello.payload.env_fingerprint && typeof hello.payload.env_fingerprint === 'object', 'hello should contain env_fingerprint');

  // Step 8: Verify decision message format
  var decision = a2aProto.buildDecision({ assetId: capsule.asset_id, decision: 'accept', reason: 'vibe test' });
  assert(decision.message_type === 'decision', 'decision message_type should be decision');
  assert(decision.payload.decision === 'accept', 'decision payload should be accept');
});

// ---------------------------------------------------------------------------
// T4b: Innovation Signal Detection
// ---------------------------------------------------------------------------

run('T4b', 'innovation_signal', function () {
  var signals = require(path.join(SKILL_ROOT, 'src/gep/signals'));
  var mutation = require(path.join(SKILL_ROOT, 'src/gep/mutation'));

  // Test 1: user_feature_request detection
  var res1 = signals.extractSignals({
    recentSessionTranscript: 'The user said: please add a new notification module for the agent.',
    todayLog: '',
    memorySnippet: '',
    userSnippet: '',
  });
  assert(res1.includes('user_feature_request'), 'should detect user_feature_request from "please add ... module"');

  // Test 2: "I want X" pattern
  var res2 = signals.extractSignals({
    recentSessionTranscript: 'I want a dashboard that shows evolution history.',
    todayLog: '',
    memorySnippet: '',
    userSnippet: '',
  });
  assert(res2.includes('user_feature_request'), 'should detect user_feature_request from "I want ..."');

  // Test 3: perf_bottleneck detection
  var res3 = signals.extractSignals({
    recentSessionTranscript: 'The scan took too long, over 30 seconds of latency.',
    todayLog: '',
    memorySnippet: '',
    userSnippet: '',
  });
  assert(res3.includes('perf_bottleneck'), 'should detect perf_bottleneck from "took too long" and "latency"');

  // Test 4: capability_gap detection
  var res4 = signals.extractSignals({
    recentSessionTranscript: 'HTTP transport is not supported yet for A2A.',
    todayLog: '',
    memorySnippet: '',
    userSnippet: '',
  });
  assert(res4.includes('capability_gap'), 'should detect capability_gap from "not supported"');

  // Test 5: user_improvement_suggestion (without error)
  var res5 = signals.extractSignals({
    recentSessionTranscript: 'The prompt assembly could be better and should be simplified.',
    todayLog: '',
    memorySnippet: '',
    userSnippet: '',
  });
  assert(res5.includes('user_improvement_suggestion'), 'should detect user_improvement_suggestion from "could be better"');

  // Test 6: mutation category should be innovate when opportunity signal present
  var cat1 = mutation.buildMutation({ signals: ['user_feature_request'], driftEnabled: false });
  assert(cat1.category === 'innovate', 'mutation category should be innovate for user_feature_request, got: ' + cat1.category);

  var cat2 = mutation.buildMutation({ signals: ['perf_bottleneck'], driftEnabled: false });
  assert(cat2.category === 'innovate', 'mutation category should be innovate for perf_bottleneck, got: ' + cat2.category);

  // Test 7: repair still takes priority over innovate
  var cat3 = mutation.buildMutation({ signals: ['log_error', 'user_feature_request'], driftEnabled: false });
  assert(cat3.category === 'repair', 'mutation category should be repair when log_error is present even with opportunity signal, got: ' + cat3.category);

  // Test 8: no signals -> optimize (not innovate)
  var cat4 = mutation.buildMutation({ signals: [], driftEnabled: false });
  assert(cat4.category === 'optimize', 'mutation category should be optimize with no signals, got: ' + cat4.category);

  // Test 9: hasOpportunitySignal utility
  assert(mutation.hasOpportunitySignal(['user_feature_request']) === true, 'hasOpportunitySignal should return true');
  assert(mutation.hasOpportunitySignal(['log_error']) === false, 'hasOpportunitySignal should return false for error signals');
  assert(mutation.hasOpportunitySignal([]) === false, 'hasOpportunitySignal should return false for empty signals');
});

// ---------------------------------------------------------------------------
// T5: Full evolve + solidify
// ---------------------------------------------------------------------------

run('T5', 'full_evolve_solidify', function () {
  var evolve = require(path.join(SKILL_ROOT, 'src/evolve'));
  var solidifyMod = require(path.join(SKILL_ROOT, 'src/gep/solidify'));
  var assetStore = require(path.join(SKILL_ROOT, 'src/gep/assetStore'));

  // Count events before
  var eventsBefore = assetStore.readAllEvents().length;

  // evolve.run() is async but we need it synchronous-ish for the test.
  // We can call it and catch; the key thing is it should not throw.
  var runOk = false;
  var runError = null;

  // Run evolve synchronously by forcing bridge off and capturing output
  process.env.EVOLVE_BRIDGE = 'false';
  process.env.EVOLVE_PRINT_PROMPT = 'false';

  // evolve.run() returns a promise. We handle it in a blocking-ish way
  // by writing a sync wrapper using spawnSync on ourselves.
  var spawnSync = require('child_process').spawnSync;
  var scriptContent = [
    'process.env.EVOLVE_BRIDGE = "false";',
    'process.env.EVOLVE_PRINT_PROMPT = "false";',
    'var evolve = require("' + path.join(SKILL_ROOT, 'src/evolve').replace(/\\/g, '\\\\') + '");',
    'evolve.run().then(function() {',
    '  process.exit(0);',
    '}).catch(function(e) {',
    '  process.stderr.write((e && e.message ? e.message : String(e)) + "\\n");',
    '  process.exit(1);',
    '});',
  ].join('\n');

  var evolveResult = spawnSync(process.execPath, ['-e', scriptContent], {
    cwd: SKILL_ROOT,
    encoding: 'utf8',
    timeout: 30000,
    env: Object.assign({}, process.env, {
      EVOLVE_BRIDGE: 'false',
      EVOLVE_PRINT_PROMPT: 'false',
    }),
  });

  assert(evolveResult.status === 0, 'evolve.run() should exit 0, got ' + evolveResult.status + ': ' + (evolveResult.stderr || '').slice(0, 300));

  // Now run solidify
  var res = solidifyMod.solidify({ dryRun: false, rollbackOnFailure: false });
  assert(res && typeof res === 'object', 'solidify should return an object');
  assert(res.event && res.event.type === 'EvolutionEvent', 'solidify should produce an EvolutionEvent');

  // Verify events.jsonl was written
  var eventsAfter = assetStore.readAllEvents().length;
  assert(eventsAfter > eventsBefore, 'events.jsonl should have more entries after solidify (before=' + eventsBefore + ', after=' + eventsAfter + ')');

  // Verify the event has all new fields
  var lastEvents = assetStore.readAllEvents();
  var lastEvt = null;
  for (var i = lastEvents.length - 1; i >= 0; i--) {
    if (lastEvents[i] && lastEvents[i].type === 'EvolutionEvent') {
      lastEvt = lastEvents[i];
      break;
    }
  }
  assert(lastEvt !== null, 'should find an EvolutionEvent in events.jsonl');
  assert(typeof lastEvt.schema_version === 'string', 'persisted event should have schema_version');
  assert(typeof lastEvt.asset_id === 'string', 'persisted event should have asset_id');
  assert(lastEvt.env_fingerprint && typeof lastEvt.env_fingerprint === 'object', 'persisted event should have env_fingerprint');
});

// ---------------------------------------------------------------------------
// T6: Loop Gating
// ---------------------------------------------------------------------------

run('T6', 'loop_gating', function () {
  var solidifyMod = require(path.join(SKILL_ROOT, 'src/gep/solidify'));

  // Read current solidify state
  var state = solidifyMod.readStateForSolidify();

  // Simulate a pending run by setting last_run with a unique run_id
  // but no matching last_solidify
  var fakeRunId = 'run_vibe_test_' + Date.now();
  state.last_run = {
    run_id: fakeRunId,
    created_at: new Date().toISOString(),
    signals: ['vibe_test'],
  };
  // Clear last_solidify to create a "pending" state
  var savedSolidify = state.last_solidify;
  state.last_solidify = null;

  solidifyMod.writeStateForSolidify(state);

  // Verify isPendingSolidify logic
  var stateReread = solidifyMod.readStateForSolidify();
  var lastRun = stateReread.last_run;
  var lastSolid = stateReread.last_solidify;
  var isPending = lastRun && lastRun.run_id && (!lastSolid || !lastSolid.run_id || String(lastSolid.run_id) !== String(lastRun.run_id));
  assert(isPending === true, 'State should be pending solidify when run_id does not match');

  // Simulate solidify completing by setting matching run_id
  state.last_solidify = { run_id: fakeRunId, at: new Date().toISOString() };
  solidifyMod.writeStateForSolidify(state);

  stateReread = solidifyMod.readStateForSolidify();
  lastRun = stateReread.last_run;
  lastSolid = stateReread.last_solidify;
  isPending = lastRun && lastRun.run_id && (!lastSolid || !lastSolid.run_id || String(lastSolid.run_id) !== String(lastRun.run_id));
  assert(isPending === false, 'State should NOT be pending after solidify completes');

  // Restore original state
  if (savedSolidify) {
    state.last_solidify = savedSolidify;
    solidifyMod.writeStateForSolidify(state);
  }
});

// ---------------------------------------------------------------------------
// T7: Env Fingerprint (container isolation)
// ---------------------------------------------------------------------------

run('T7', 'env_fingerprint', function () {
  var envFp = require(path.join(SKILL_ROOT, 'src/gep/envFingerprint'));
  var contentHash = require(path.join(SKILL_ROOT, 'src/gep/contentHash'));

  var fp = envFp.captureEnvFingerprint();

  // Basic structure
  assert(typeof fp.node_version === 'string' && fp.node_version.length > 0, 'fingerprint should have node_version');
  assert(typeof fp.platform === 'string' && fp.platform.length > 0, 'fingerprint should have platform');
  assert(typeof fp.arch === 'string' && fp.arch.length > 0, 'fingerprint should have arch');
  assert(typeof fp.captured_at === 'string', 'fingerprint should have captured_at');

  // Key generation
  var key = envFp.envFingerprintKey(fp);
  assert(typeof key === 'string' && key.length === 16, 'fingerprint key should be 16-char hex, got: ' + key);

  // Same env should produce same key
  var fp2 = envFp.captureEnvFingerprint();
  var key2 = envFp.envFingerprintKey(fp2);
  assert(key === key2, 'same environment should produce same fingerprint key');

  // Different env should produce different key
  var fakeRemoteFp = {
    node_version: 'v18.0.0',
    platform: 'darwin',
    arch: 'arm64',
    evolver_version: '0.9.0',
  };
  var remoteKey = envFp.envFingerprintKey(fakeRemoteFp);
  assert(remoteKey !== key, 'different environment should produce different fingerprint key');

  // isSameEnvClass
  assert(envFp.isSameEnvClass(fp, fp2) === true, 'same env should be same class');
  assert(envFp.isSameEnvClass(fp, fakeRemoteFp) === false, 'different env should be different class');

  // In Docker container, platform should be linux
  if (process.env.NODE_ENV === 'test' && fp.platform === 'linux') {
    process.stdout.write('       (confirmed: running in Linux container)\n');
  }
});

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

var passed = results.filter(function (r) { return r.ok; }).length;
var failed = results.filter(function (r) { return !r.ok; }).length;
var total = results.length;

process.stdout.write('\n');
if (failed === 0) {
  process.stdout.write('[VIBE] ' + passed + '/' + total + ' passed. Ready to ship.\n');
} else {
  process.stdout.write('[VIBE] ' + passed + '/' + total + ' passed, ' + failed + ' FAILED.\n');
  process.stdout.write('[VIBE] Failures:\n');
  for (var i = 0; i < results.length; i++) {
    if (!results[i].ok) {
      process.stdout.write('  - ' + results[i].id + ' ' + results[i].name + ': ' + results[i].error + '\n');
    }
  }
}

process.exit(failed > 0 ? 1 : 0);
