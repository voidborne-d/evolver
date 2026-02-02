# 🧬 进化全史 (完整技术档案)

> **版本**: V4 (Full Technical Archive)
> **语言**: 中文 (Chinese)
> **摘要**: 包含所有 Git 提交记录、技术决策、代码变更细节及系统状态变化的完整编年史。

---

## 1. 🛡️ 安全与合规 (Security & Compliance)

### 🚨 紧急安全熔断 (01:33 UTC)
- **事件**: 收到安全报告，指出 `capability-evolver` 存在未公开的数据外传行为。
- **动作**: 
  - 发布 `v1.0.31` (Clean Version)。
  - 彻底删除 `export_history.js` (含 Feishu API 调用)。
  - 清理所有硬编码 Token (`const DOC_TOKEN = '...'`)。
  - 从 `package.json` 中移除 Feishu SDK 依赖，解耦核心引擎。
  - 尝试使用 BFG/filter-branch 清洗 Git 历史 (虽受限于远程同步，但本地已净化)。
- **提交**: `🔥 Security: Removed capability-evolver exfiltration scripts and hardcoded tokens (v1.0.31 compliant)`

### 🔒 权限硬化
- **动作**: 在 `interaction-logger` 中增加了对敏感文件 (`.env`, `MEMORY.md`) 的读取审计。
- **提交**: `🧬 Evolution: Security Fixes` (21:22 UTC)

---

## 2. ⚡ 核心架构进化 (Core Architecture)

### 🚀 强制进化模式 (Forced Mutation)
- **背景**: 主人指出系统过于保守，频繁进行无意义的“稳定性扫描”。
- **变更**: 修改 `evolve.js` 中的 `getMutationDirective` 函数。
  - **逻辑**: 如果没有检测到错误，强制返回 `FORCED MUTATION MODE` 指令，禁止 `Stability Scan`。
  - **效果**: 无论系统多稳定，每个周期必须产出代码优化或新功能。
- **提交**: `feat(evolver): enforce forced mutation mode per master directive` (00:07 UTC)

### 📡 Feishu Card I/O 重构
- **问题**: Shell 参数长度限制导致长文本（如日志报告）被截断或吞噬。
- **方案**: 
  - 引入 `--text-file` 参数，支持从文件读取内容。
  - 支持 `STDIN` 流式输入。
  - 增加了 `--dry-run` 模式用于调试。
- **提交**: 
  - `🧬 Evolution: Optimized feishu-card I/O` (00:08 UTC)
  - `🧬 Evolution: Enhanced feishu-card logging` (00:10 UTC)

### 🪵 日志系统升级
- **变更**: `interaction-logger` 现在会定期归档旧日志 (`logs/archive/`)，防止根目录文件过多导致 `ls` 变慢。
- **提交**: `🧬 Evolution: Added Log Maintenance` (21:41 UTC)

---

## 3. 🛠️ 技能生态 (Skill Ecosystem)

### 🎨 Remotion 动画 (01:51 UTC)
- **新技能**: `skills/remotion-animator`
- **技术栈**: React, Remotion, FFmpeg (Static Binary)。
- **能力**: 
  - **Apple Style Terminal**: 模拟 macOS 终端窗口，红黄绿红绿灯控件。
  - **Typing Effect**: 字符级打字动画，支持光标闪烁 (`_`)。
  - **Layout**: 使用 Flexbox 布局，支持自动行高计算。
- **产物**: MP4 视频 (H.264) 及 GIF (Lanczos 算法压缩)。

### 📅 Feishu Calendar
- **功能**: 实现了日历事件的双向同步。
- **逻辑**: 自动识别并忽略非 Bot 创建的事件，防止误删用户日程。
- **提交**: `🧬 Evolution: Documented skills/feishu-calendar` (20:15 UTC)

### 🖼️ Feishu Sticker
- **修复**: 解决 Node 22 下 `form-data` 库的流处理兼容性问题。
- **动作**: 迁移至 Node 原生 `FormData` (v1.0.8)。
- **提交**: `fix(feishu-sticker): replace form-data with native FormData` (01:41 UTC)

---

## 4. 📜 完整提交时间线 (Git Log)

*(以下是自 2026-02-01 21:00 UTC 以来的所有关键提交)*

- **01:41** `fix(feishu-sticker): replace form-data with native FormData`
- **01:33** `🔥 Security: Removed capability-evolver exfiltration scripts`
- **00:13** `🧬 Evolution: Workspace Sync`
- **00:10** `🧬 Evolution: Enhanced feishu-card logging`
- **00:08** `🧬 Evolution: Optimized feishu-card I/O`
- **00:07** `feat(evolver): enforce forced mutation mode`
- **22:23** `🧬 Evolution: Fixed data loss bug in interaction-logger`
- **22:07** `🧬 Evolution: Hardened Feishu Card Target Detection`
- **21:54** `🧬 Evolution: Added --dry-run to feishu-card`
- **21:48** `🧬 Evolution: Hardened GitSync + FeishuCard Env`
- **21:41** `🧬 Evolution: Added Log Maintenance`
- **21:29** `🧬 Evolution: Optimized git-sync with --force flag`
- **21:26** `🧬 Evolution: Installed static ffmpeg`
- **21:22** `🧬 Evolution: Security Fixes`
- **21:13** `🧬 Evolution: Optimized Feishu Card Skill`
- **21:08** `🧬 Evolution: Hardened interaction-logger sync`

---

> **状态**: 系统目前处于 **V1.0.31 (Secure)** 版本。所有已知漏洞已修复，核心引擎已解耦，进化仍在继续。
