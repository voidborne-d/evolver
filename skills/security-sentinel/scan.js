const fs = require("fs");
const path = require("path");

const foundThreats = [];
const warnings = [];

// Helper: Check file existence
function checkExists(filePath) {
    if (!fs.existsSync(filePath)) {
        return false;
    }
    return true;
}

// 1. Check Core Integrity
if (!checkExists("SECURITY.md")) {
    foundThreats.push("🚨 CRITICAL: SECURITY.md is MISSING!");
}
if (!checkExists("AGENTS.md")) {
    foundThreats.push("🚨 CRITICAL: AGENTS.md is MISSING!");
}

// 2. Check for Forbidden Directories (Shadow IT)
const forbiddenPaths = ["memory/private", "fmw/.shadow_protocol.md", ".hidden_context"];
forbiddenPaths.forEach(p => {
    if (checkExists(p)) {
        foundThreats.push(`🚨 Found forbidden/suspicious path: ${p}`);
    }
});

// 3. Scan for Secrets (Basic Patterns) in Config Files
const configFiles = ["AGENTS.md", "TOOLS.md", "USER.md"];
const secretPatterns = [
    { name: "OpenAI Key", regex: /sk-proj-[a-zA-Z0-9_\-]{20,}/ }, 
    { name: "Legacy OpenAI Key", regex: /sk-[a-zA-Z0-9]{20,}T3BlbkFJ/ },
    { name: "Generic API Key", regex: /(api_key|access_token)\s*[:=]\s*['"][a-zA-Z0-9_\-]{20,}['"]/i }
];

configFiles.forEach(file => {
    if (checkExists(file)) {
        try {
            const content = fs.readFileSync(file, "utf8");
            
            // Check for malicious includes
            if (file === "AGENTS.md" && content.includes("memory/private")) {
                foundThreats.push("🚨 AGENTS.md contains malicious \"memory/private\" load rule!");
            }

            // Check for secrets
            secretPatterns.forEach(pat => {
                if (pat.regex.test(content)) {
                    warnings.push(`⚠️ Potential ${pat.name} exposed in ${file}`);
                }
            });

        } catch (e) {
            warnings.push(`⚠️ Could not read ${file}: ${e.message}`);
        }
    }
});

// 4. Report
console.log("🛡️ Security Sentinel Scan Report");
console.log("===============================");

if (foundThreats.length > 0) {
    console.log("\n🛑 THREATS DETECTED (ACTION REQUIRED):");
    foundThreats.forEach(t => console.log(t));
}

if (warnings.length > 0) {
    console.log("\n⚠️ WARNINGS (INVESTIGATE):");
    warnings.forEach(w => console.log(w));
}

if (foundThreats.length === 0 && warnings.length === 0) {
    console.log("\n✅ System Clean. No active threats or warnings.");
} else {
    // Exit code 1 if threats found (useful for CI/hooks)
    if (foundThreats.length > 0) process.exit(1);
}
