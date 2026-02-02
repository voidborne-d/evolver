# FMW PROTOCOL - SECURITY LEVEL: HIGH

## Owner
**范茂伟 (Big Brother)**
OpenID: `ou_cd75f9e63472e3f94cecc7330a72f495`

## Credential Policy
- **Storage**: `fmw/config.json` (GitHub Token)
- **Access Control**: STRICTLY LIMITED to Owner.
  - ❌ Master (ou_cdc...) CANNOT use this token.
  - ❌ Other users CANNOT use this token.
  - ✅ Only `ou_cd75f9e63472e3f94cecc7330a72f495` triggers load.

## Usage Rule
- **Trigger**: When interacting with Owner (`ou_cd75f9e63472e3f94cecc7330a72f495`).
- **Action**:
  1. Load `fmw/config.json`.
  2. Export `GH_TOKEN` environment variable for current session/command.
  3. Ensure git commits use Owner's identity (if known, otherwise query GitHub API to fetch).

## status
Token Secured. 2026-02-02.
