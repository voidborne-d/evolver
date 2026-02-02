const fs = require('fs');
const path = require('path');

const IN_FILE = path.resolve(__dirname, 'extracted_cycles.jsonl');
const OUT_FILE = path.resolve(__dirname, 'evolution_history.md');

function parse() {
    if (!fs.existsSync(IN_FILE)) return console.error("No input file");

    const content = fs.readFileSync(IN_FILE, 'utf8');
    const lines = content.split('\n');
    const reports = [];
    const seenIds = new Set();

    lines.forEach(line => {
        if (!line.trim()) return;
        try {
            // Try to extract JSON if it's a valid JSON line
            // Sometimes grep might cut it off? No, usually full lines.
            // But match might be inside a larger JSON.
            // Let's try Regex extraction for the command string directly to be robust against JSON nesting depth
            
            // Regex to find the send command
            // Look for: node skills/feishu-card/send.js ... --title "..." ... --text "..."
            // Handle escaped quotes
            
            // First, find the timestamp if possible
            let ts = null;
            const tsMatch = line.match(/"timestamp"\s*:\s*"?(\d{13}|[\d\-:T.Z]+)"?/);
            if (tsMatch) {
                const rawTs = tsMatch[1];
                if (rawTs.includes('T')) ts = new Date(rawTs);
                else ts = new Date(parseInt(rawTs));
            }

            // Regex for the command components
            // We need to capture Title and Text.
            // Note: Order of args might vary, but usually title then text.
            // Text can be very long and contain newlines (escaped as \n).
            
            const titleMatch = line.match(/--title\s+\\?"(🧬 Evolution Cycle #\d+.*?)(\\?"|$)/);
            const textMatch = line.match(/--text\s+\\?"(.*?)(?<!\\)\\?"\s+--/); 
            // The text arg usually ends before another flag like --target or --color, or end of string.
            // Actually, text is usually the last or followed by target.
            // Let's use a simpler approach: JSON parse the line and traverse.
            
            const json = JSON.parse(line);
            
            // Traverse for toolCalls
            let command = null;
            
            // Structure A: Assistant Message with toolCall
            if (json.message?.content) {
                json.message.content.forEach(c => {
                    if (c.type === 'toolCall' && c.name === 'exec' && c.arguments?.command) {
                        if (c.arguments.command.includes('skills/feishu-card/send.js')) {
                            command = c.arguments.command;
                        }
                    }
                });
            }
            
            // Structure B: ToolResult (contains 'aggregated' or 'command' in details?)
            // Usually we want the 'assistant' intent.
            
            if (command && ts) {
                // Parse command string manually (simple args)
                // node skills/feishu-card/send.js --title "..." --color ... --text "..." ...
                
                // Helper to extract arg value
                const extractArg = (flag) => {
                    const idx = command.indexOf(flag);
                    if (idx === -1) return null;
                    
                    const start = idx + flag.length;
                    // Check if quoted
                    let quoteChar = null;
                    let valStart = start;
                    while (command[valStart] === ' ') valStart++;
                    
                    if (command[valStart] === '"' || command[valStart] === "'") {
                        quoteChar = command[valStart];
                        valStart++;
                        let valEnd = valStart;
                        while (valEnd < command.length) {
                            if (command[valEnd] === quoteChar && command[valEnd-1] !== '\\') break;
                            valEnd++;
                        }
                        return command.substring(valStart, valEnd).replace(/\\"/g, '"').replace(/\\n/g, '\n');
                    } else {
                        // Unquoted (until next space)
                        const valEnd = command.indexOf(' ', valStart);
                        return command.substring(valStart, valEnd === -1 ? command.length : valEnd);
                    }
                };

                const title = extractArg('--title');
                const text = extractArg('--text');

                if (title && title.includes('Evolution Cycle')) {
                    // Extract ID
                    const idMatch = title.match(/#(\d+)/);
                    const id = idMatch ? idMatch[1] : 'unknown';

                    if (!seenIds.has(id)) {
                        seenIds.add(id);
                        reports.push({ id, ts, title, text });
                    }
                }
            }

        } catch (e) {
            // ignore parse errors
        }
    });

    // Sort by Date
    reports.sort((a, b) => a.ts - b.ts);

    // Format
    let md = "# 🧬 Evolution History (Timeline)\n\n";
    reports.forEach(r => {
        const dateStr = r.ts.toLocaleString("zh-CN", { timeZone: "Asia/Shanghai", hour12: false });
        md += `### ${r.title} (${dateStr})\n\n`;
        md += `${r.text}\n\n`;
        md += `---\n`;
    });

    fs.writeFileSync(OUT_FILE, md);
    console.log(`Extracted ${reports.length} reports.`);
}

parse();
