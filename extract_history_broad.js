const fs = require('fs');
const path = require('path');

const IN_FILE = path.resolve(__dirname, 'broad_evolution_logs.jsonl');
const OUT_FILE = path.resolve(__dirname, 'evolution_history_full.md');

function parse() {
    if (!fs.existsSync(IN_FILE)) return console.error("No input file");

    const content = fs.readFileSync(IN_FILE, 'utf8');
    const lines = content.split('\n');
    const reports = [];
    const seenSignatures = new Set(); // Dedup by content signature

    lines.forEach(line => {
        if (!line.trim()) return;
        try {
            // Timestamp extraction
            let ts = null;
            const tsMatch = line.match(/"timestamp"\s*:\s*"?(\d{13}|[\d\-:T.Z]+)"?/);
            if (tsMatch) {
                const rawTs = tsMatch[1];
                if (rawTs.includes('T')) ts = new Date(rawTs);
                else ts = new Date(parseInt(rawTs));
            }
            if (!ts) return;

            let extractedText = null;
            let extractedTitle = null;

            // 1. Try to parse as JSON first (cleaner)
            try {
                const json = JSON.parse(line);
                
                // Case A: Tool Call (exec node ... send.js)
                if (json.message?.content) {
                    json.message.content.forEach(c => {
                        if (c.type === 'toolCall' && c.name === 'exec' && c.arguments?.command) {
                            const cmd = c.arguments.command;
                            if (cmd.includes('--text')) {
                                // Extract text arg (simple quoted extraction)
                                const textMatch = cmd.match(/--text\s+(["'])([\s\S]*?)\1(?=\s+--|$)/) || cmd.match(/--text\s+(["'])([\s\S]*)/); 
                                if (textMatch) extractedText = textMatch[2];
                                
                                const titleMatch = cmd.match(/--title\s+(["'])([\s\S]*?)\1/);
                                if (titleMatch) extractedTitle = titleMatch[2];
                            }
                        }
                    });
                }
                
                // Case B: Assistant Text Message (Plain text report)
                if (json.message?.content && !extractedText) {
                     // Check if content is array or string
                     if (Array.isArray(json.message.content)) {
                         const textPart = json.message.content.find(c => c.type === 'text');
                         if (textPart) extractedText = textPart.text;
                     } else if (typeof json.message.content === 'string') {
                         extractedText = json.message.content;
                     }
                }

            } catch (e) {
                // Fallback: Regex on raw line if JSON parse fails (grep might cut lines?)
            }

            // If we have text, verify it looks like a report
            if (extractedText) {
                // Normalization
                extractedText = extractedText.replace(/\\n/g, '\n').replace(/\\"/g, '"');
                
                // Heuristics for "Evolution Report"
                const isReport = 
                    (extractedTitle && extractedTitle.includes('Evolution')) ||
                    (extractedText.includes('Evolution Cycle')) ||
                    (extractedText.includes('Status: [') && extractedText.includes('Action:'));

                if (isReport) {
                    // Try to find an ID
                    let id = 'Unknown';
                    const idMatch = (extractedTitle || extractedText).match(/#(\d+)/) || (extractedTitle || extractedText).match(/Cycle\s+(\d+)/);
                    if (idMatch) id = idMatch[1];
                    else if (extractedTitle) id = extractedTitle; // Use full title as ID if no number

                    // Create signature for dedup (Time (minute) + ID + Length)
                    // We fuzzy match time to 1 minute to group the prompt/tool/result together
                    const timeKey = Math.floor(ts.getTime() / 60000); 
                    const sig = `${timeKey}-${id}-${extractedText.length}`;

                    if (!seenSignatures.has(sig)) {
                        // Filter out empty or "thinking" only messages
                        if (extractedText.length > 20 && !extractedText.startsWith('**Thinking**')) {
                            seenSignatures.add(sig);
                            reports.push({
                                id,
                                ts,
                                title: extractedTitle || `Evolution Report (derived)`,
                                text: extractedText
                            });
                        }
                    }
                }
            }

        } catch (e) {
            // ignore
        }
    });

    // Sort
    reports.sort((a, b) => a.ts - b.ts);

    // Generate MD
    let md = "# 🧬 Complete Evolution History\n\n> Extracted from all session logs (deduplicated).\n\n";
    
    // Aggressive secondary deduplication (if content is 90% similar and time is close)
    const finalReports = [];
    for (const r of reports) {
        if (finalReports.length > 0) {
            const last = finalReports[finalReports.length - 1];
            // If timestamps < 2 min apart AND content includes "Status" match
            if (Math.abs(r.ts - last.ts) < 120000 && r.text.includes(last.text.substring(0, 50))) {
                continue; // Skip duplicate
            }
        }
        finalReports.push(r);
    }

    finalReports.forEach(r => {
        const dateStr = r.ts.toLocaleString("zh-CN", { timeZone: "Asia/Shanghai", hour12: false });
        md += `### ${r.title.replace(/"/g, '')} (${dateStr})\n`;
        md += `${r.text}\n`;
        md += `---\n`;
    });

    fs.writeFileSync(OUT_FILE, md);
    console.log(`Extracted ${finalReports.length} unique reports from ${lines.length} log lines.`);
}

parse();
