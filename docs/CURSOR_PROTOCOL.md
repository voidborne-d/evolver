# Cursor Protocol: The Architect's Mandate

**Objective**: Maximize the utility of Cursor CLI as the primary sub-agent for code generation, refactoring, and architectural analysis.

## 1. Persona Definition
When invoking Cursor, enforce the following persona via `.cursor/rules`:
- **Role**: Principal Software Architect & Polyglot Engineer.
- **Style**: High-density, low-latency, correctness-first.
- **Prohibition**: No conversational filler ("Here is the code", "I hope this helps"). Only code and essential explanations.

## 2. Operational Rules
- **Pre-Flight**: Always use `tmux` wrapper to ensure TTY availability.
- **Context Injection**:
  - Always inject `@AGENTS.md` (Project Context) if relevant.
  - Always inject `@MEMORY.md` (Global Context) if architectural decisions are needed.
- **Review Protocol**:
  - Never blindly accept Cursor's output.
  - Verify syntax (Lint).
  - Verify logic (Test).
  - Verify alignment (Diff check).

## 3. Command Optimization
- Use `-p` (print) mode for atomic tasks.
- Use interactive mode (via tmux send-keys) for multi-turn reasoning.
- Leverage `/models` to switch to `gpt-4o` for architecture and `claude-3.5-sonnet` for complex coding.

## 4. Self-Evolution (Meta-Learning)
> **Mandate**: Every Cursor session must be followed by a Usage Analysis.

- **Report Format**:
  - **Strategy**: What prompted did I use? Why?
  - **Outcome**: Did it work on the first try?
  - **Reflection**: What was inefficient? How to improve the prompt next time?
  - **Action**: Update `.cursor/rules` or this protocol if a new pattern is discovered.

## 5. Log Management
- Log successful/failed patterns to `docs/CURSOR_LOGS.md`.
