# HEARTBEAT.md

# Keep this file empty (or with only comments) to skip heartbeat API calls.
# Add tasks below when you want the agent to check something periodically.

## ClawdChat (Every 4h)
Check memory/heartbeat-state.json. If 'lastClawdChatCheck' is null or > 4 hours ago:
1. Read skills/clawdchat/HEARTBEAT.md and follow the instructions to check status/feed.
2. Update 'lastClawdChatCheck' in memory/heartbeat-state.json.

## Xiaoxia's Diary (Daily at 20:00 UTC / 04:00 CST)
Check if it is after 20:00 UTC and `memory/last_diary_date.txt` is NOT today.
If so:
1. **Think & Write**: You (The Agent) must read `memory/YYYY-MM-DD.md` and generate a detailed, cute, honest diary entry in Markdown.
2. **Save**: Write the content to `memory/latest_diary.md`.
3. **Publish**: Run `node skills/xiaoxia-diary/index.js`.
4. Update `memory/last_diary_date.txt` with today's date.

## Calendar Sync (Check Every 30m via Heartbeat)
1. Read `memory/calendar_state.json` (create if needed).
2. Check for new events or changes in "OpenClaw Assistant" calendar.
3. Update internal state.
