const fs = require('fs');
const path = require('path');
const args = process.argv.slice(2);

// Parse arguments: --target <user_alias> --role <user|assistant|system> --content <text>
function parseArgs(args) {
    const config = {};
    for (let i = 0; i < args.length; i++) {
        if (args[i].startsWith('--')) {
            const key = args[i].slice(2);
            const value = args[i + 1];
            config[key] = value;
            i++;
        }
    }
    return config;
}

const config = parseArgs(args);

if (!config.target || !config.content) {
    console.error("Usage: node log.js --target <zhy|fmw|auto> --role <role> --content <message>");
    process.exit(1);
}

// Map targets to files
const fileMap = {
    'zhy': 'memory/master_history.json',
    'shiqi': 'memory/master_history.json', // Alias
    'master': 'memory/master_history.json', // Alias
    'fmw': 'fmw/history.json',
    'big-brother': 'fmw/history.json', // Alias
    'brother': 'fmw/history.json' // Alias
};

let filePath = fileMap[config.target.toLowerCase()];

// Dynamic Target Support
if (!filePath) {
    // Sanitize target to be safe for filesystem
    const safeTarget = config.target.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    if (safeTarget) {
        filePath = `memory/users/${safeTarget}.json`;
        console.log(`New target detected. Logging to: ${filePath}`);
    } else {
        console.error(`Invalid target: ${config.target}`);
        process.exit(1);
    }
}

const absolutePath = path.resolve(process.cwd(), filePath);

// Ensure directory exists
const dir = path.dirname(absolutePath);
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

// Log Rotation (Stability Guard)
const MAX_LOG_SIZE = 5 * 1024 * 1024; // 5MB
if (fs.existsSync(absolutePath)) {
    try {
        const stats = fs.statSync(absolutePath);
        if (stats.size > MAX_LOG_SIZE) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const parsedPath = path.parse(absolutePath);
            const archivePath = path.join(parsedPath.dir, `${parsedPath.name}_${timestamp}${parsedPath.ext}`);
            fs.renameSync(absolutePath, archivePath);
            console.log(`Log file too large (${(stats.size / 1024 / 1024).toFixed(2)}MB). Rotated to: ${archivePath}`);
            // File is now gone, so we start fresh below
        }
    } catch (e) {
        console.error("Rotation check failed:", e.message);
    }
}

// Read or Initialize
let data = { sessions: [] };
if (fs.existsSync(absolutePath)) {
    try {
        const fileContent = fs.readFileSync(absolutePath, 'utf8');
        if (fileContent.trim()) {
            data = JSON.parse(fileContent);
        }
    } catch (e) {
        console.error("Error reading/parsing file:", e.message);
        // We do NOT overwrite corrupted files blindly.
        console.error("Aborting to prevent data loss.");
        process.exit(1);
    }
}

// Ensure schema
if (!data.sessions) {
    data.sessions = [];
}

// Create Entry
const entry = {
    timestamp: new Date().toISOString(),
    role: config.role || 'assistant',
    content: config.content
};

// Append
data.sessions.push(entry);

// Write Atomic-ish (Write to temp, then rename)
const tempPath = absolutePath + '.tmp';
try {
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2));
    fs.renameSync(tempPath, absolutePath);
    console.log(`Successfully logged to ${filePath} (Atomic Write)`);
} catch (e) {
    console.error("Error writing file:", e.message);
    // Try to clean up temp file if it exists
    if (fs.existsSync(tempPath)) {
        try { fs.unlinkSync(tempPath); } catch (err) {}
    }
    process.exit(1);
}
