# Private Evolver Development Workspace
 
This is a **private, isolated** copy of the `evolver` skill.
Use this directory for experimental development, refactoring, and testing without affecting the live `skills/evolver` or `skills/feishu-evolver-wrapper`.

## Protocol
1.  **Isolation**: Do not run `npm link` or `openclaw install` from here into the main workspace.
2.  **Safety**: Test changes locally using `node index.js`.
3.  **Sync**: Only manually copy approved changes back to `skills/evolver`.
4.  **Git**: This folder should have its own git history or be ignored by the main repo's `.gitignore` if we want strict separation (or just tracked carefully).

## Current Version
Copied from `skills/evolver` on 2026-02-03.

## Release Workflow (Private Repo as Release Tool)

目标：
- 这个 private 仓库是“源码与发布工具仓库”（包含发布脚本、内部笔记）。
- public 仓库 `autogame-17/evolver` 接收的是 **build 输出（dist-public）**，不是 private 的源码树。
- `docs/` 与 `memory/` 属于内部资料，**不得**进入 public 构建产物（`scripts/build_public.js` 会校验并阻止）。

### 一次标准发布（private -> public + GitHub Release + ClawHub）

1) 在 private 仓库完成代码与协议变更
- 更新 `package.json` 的版本号（SemVer）。
- 更新 `README.md` 与 `README.zh-CN.md` 的更新日志（包含历史版本条目）。
- 提交并 push（建议沿用仓库风格：`chore(release): prepare vX.Y.Z`）。
- 打 annotated tag 并 push tag（例如 `v1.4.2`）。

2) 创建 GitHub Release（private 仓库）
- 使用 GitHub CLI（Windows 示例路径）：
  - `& "C:\Program Files\GitHub CLI\gh.exe" release create vX.Y.Z --repo autogame-17/evolver-private-dev --generate-notes`

3) 构建 public 产物（dist-public）
- `npm run build`
- 说明：build 过程会写出 `dist-public/package.json`（版本号应与本次发布一致）。

4) 推送 public 仓库（发布产物，而不是源码）
- 使用发布脚本：`node scripts/publish_public.js`
- 必要环境变量（PowerShell 示例）：
  - `$env:PUBLIC_REPO='autogame-17/evolver'`
  - `$env:PUBLIC_BRANCH='main'`
  - `$env:PUBLIC_USE_BUILD_OUTPUT='true'`
  - `$env:PUBLIC_RELEASE_ONLY='false'`
  - `$env:RELEASE_TAG='vX.Y.Z'`
  - `$env:RELEASE_USE_GH='true'`（优先使用 gh 创建 release）
  - `$env:CLAWHUB_REGISTRY='https://clawhub.ai'`（根据 token 可用性选择）
- 注意：此脚本会在临时目录 clone public repo，将 `dist-public/` 覆盖到 public repo 后提交并 push。

5) 创建 GitHub Release（public 仓库）
- 由 `publish_public.js` 在 `RELEASE_SKIP != true` 且满足 gh/token 条件时自动创建。
- 若只想修复 public 代码而不重复创建 release，设置：
  - `$env:RELEASE_SKIP='true'`

6) 同步发布到 ClawHub（可选，但默认开启）
- `publish_public.js` 会在 release 成功后发布到两个 slug：
  - `evolver`
  - `capability-evolver`
- 常用控制开关：
  - 禁用：`$env:CLAWHUB_SKIP='true'`
  - 强制开启：`$env:CLAWHUB_PUBLISH='true'`

### 常见坑（务必注意）

- 环境变量会在同一 shell 会话中“残留”
  - 如果之前设置过 `$env:PUBLIC_RELEASE_ONLY='true'`，脚本会进入“仅创建 release 不推代码”的模式，导致 public 仓库代码没有更新。
  - 建议每次运行前显式设置：`$env:PUBLIC_RELEASE_ONLY='false'`。

- `publish_public.js` 会检查本地 tag 是否已存在
  - 如果 private 仓库已经有本地 tag（例如 `v1.4.2`），脚本会报错 `Tag v1.4.2 already exists.`（这是为了避免半发布）。
  - 解决方案（任选其一）：
    1) 临时删除本地 tag：`git tag -d vX.Y.Z`，发布结束后再 `git fetch --tags origin` 恢复；
    2) 不传 `RELEASE_TAG`，仅推送 build 输出（会失去“Release vX.Y.Z”提交信息与 tag 相关动作）。

- ClawHub registry 地址差异
  - 某些 token 对 `https://www.clawhub.ai` 会 Unauthorized，但对 `https://clawhub.ai` 可用。
  - 遇到鉴权失败优先尝试：`$env:CLAWHUB_REGISTRY='https://clawhub.ai'`。

- ClawHub 可见性（hide/unhide）
  - 发布后如果 `inspect evolver` 显示 `Skill not found`，可能处于隐藏状态；
  - 可执行：
    - `clawhub.cmd --registry https://clawhub.ai unhide evolver --yes`
    - `clawhub.cmd --registry https://clawhub.ai unhide capability-evolver --yes`
