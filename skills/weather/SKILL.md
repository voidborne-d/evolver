---
name: weather
description: Get current weather and forecasts (Robust with Fallback).
homepage: https://wttr.in/:help
metadata: {"clawdbot":{"emoji":"🌤️","requires":{"bins":["node"]}}}
---

# Weather

Robust weather checking with automatic fallback (wttr.in -> Open-Meteo).

## Usage

```bash
node skills/weather/index.js "New York"
```

## Legacy (Manual Curl)

If the script fails, you can try manually:
```bash
curl -s "wttr.in/London?format=3"
```
