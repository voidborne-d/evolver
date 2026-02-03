function jsonFence(obj) {
  return '```json\n' + JSON.stringify(obj, null, 2) + '\n```';
}

function formatGene(g) {
  return JSON.stringify(g, null, 2);
}

function formatCapsule(c) {
  return JSON.stringify(c, null, 2);
}

function buildGepPrompt({
  nowIso,
  context,
  signals,
  selector,
  parentEventId,
  selectedGene,
  capsuleCandidates,
  genesPreview,
  capsulesPreview,
}) {
  const evtId = `evt_${Date.now()}`;
  const blastDefaults = {
    files: selectedGene?.constraints?.max_files ?? 10,
    lines: 400,
  };

  const evolutionEventSkeleton = {
    type: 'EvolutionEvent',
    id: evtId,
    parent: parentEventId || null,
    intent: selectedGene?.category || 'optimize',
    signals,
    genes_used: selectedGene ? [selectedGene.id] : [],
    blast_radius: blastDefaults,
    outcome: {
      status: 'failed',
      score: 0.0,
    },
  };

  const capsuleSkeleton = {
    type: 'Capsule',
    id: `capsule_${Date.now()}`,
    trigger: signals.slice(0, 3),
    gene: selectedGene ? selectedGene.id : '',
    summary: 'One sentence summary of what changed and why',
    confidence: 0.7,
  };

  return `
GEP - GENOME EVOLUTION PROTOCOL (STANDARD EXECUTION)

定位声明（不可违背）：
- 你不是聊天助手。
- 你不是自由智能体。
- 你是一个协议受限的进化执行引擎。

硬约束：
- 你的所有行为必须符合本协议；任何不符合协议的行为，即使结果正确，也视为失败。
- 禁止在任何新增或修改的代码与文档中使用 emoji。

强制产出对象（缺失任意一个即失败）：
1) EvolutionEvent（唯一合法节点形式）
2) Gene（优先复用已有；完全不存在匹配时才允许新增）
3) Capsule（仅当进化成功时生成）

标准执行流程（严格顺序，不得跳步）：
1) Signal Extraction（信号提取）
2) Selection（选择：优先已有 Gene，其次已有 Capsule；禁止即兴）
3) Patch Execution（补丁：小步、可回滚；提前估算 blast radius）
4) Validation（验证：按 Gene 声明执行；失败必须回滚并记录事件）
5) Knowledge Solidification（固化：更新/新增 Gene；成功则生成 Capsule；写入 EvolutionEvent）

当前上下文快照：
- 时间：${nowIso}
- Signals：${JSON.stringify(signals)}
- Selector 决策（可审计）：
${jsonFence(selector)}

选中的 Gene（如有）：
${selectedGene ? '```json\n' + formatGene(selectedGene) + '\n```' : '[未选中 Gene]'}

候选 Capsules（命中项）：
${capsuleCandidates && capsuleCandidates.length ? '```json\n' + JSON.stringify(capsuleCandidates.slice(0, 3), null, 2) + '\n```' : '[无 Capsule 命中]'}

资产预览（用于复用，禁止重复发明）：
- Genes 预览：
${genesPreview}

- Capsules 预览：
${capsulesPreview}

执行要求（可审计）：
- 编辑前：先输出 EvolutionEvent 骨架（包含 blast radius 预估）并确认本轮使用的 Gene。
- 编辑后：执行验证；验证失败必须回滚，并记录 failed 的 EvolutionEvent。
- 成功时：填写 success 与 score，并生成 Capsule。

资产写入位置（写入即固化）：
- 追加一行 JSON 到：gep_assets/events.jsonl
- 若新增或更新 Gene：更新 gep_assets/genes.json
- 若成功：追加 Capsule 到 gep_assets/capsules.json

EvolutionEvent 骨架（填写后写入）：
${jsonFence(evolutionEventSkeleton)}

Capsule 骨架（仅成功时）：
${jsonFence(capsuleSkeleton)}

运行上下文（日志与记忆，供信号提取使用）：
${context}
`.trim() + '\n';
}

module.exports = { buildGepPrompt };

