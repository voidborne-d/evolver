const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Helper to send feedback via Feishu Card
function sendFeedback(targetId, title, text, color = 'blue') {
    try {
        const scriptPath = path.resolve(__dirname, '../feishu-card/send.js');
        const tempFile = path.resolve(__dirname, `../../memory/temp_gateway_reply_${Date.now()}.md`);
        fs.writeFileSync(tempFile, text);
        
        // Ensure target has prefix if missing (assuming open_id usually starts with ou_)
        // But we trust the extracted ID for now.
        
        const cmd = `node "${scriptPath}" --target "${targetId}" --text-file "${tempFile}" --title "${title}" --color "${color}"`;
        execSync(cmd, { stdio: 'ignore' }); // Run silently
        
        if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
    } catch (e) {
        console.error(`[GatewayManager] Failed to send feedback to ${targetId}:`, e.message);
    }
}

// Read payload from stdin
let payload = '';
process.stdin.setEncoding('utf8');

process.stdin.on('data', chunk => {
    payload += chunk;
});

process.stdin.on('end', () => {
    try {
        if (!payload.trim()) {
            console.log('No payload received');
            return;
        }
        const data = JSON.parse(payload);
        
        // Handle Feishu Event Structure
        const eventData = data.event || data;
        const eventKey = eventData.event_key;
        
        // Extract ID: Prefer open_id (starts with ou_) matching Master ID format
        const senderObj = data.header?.sender?.sender_id || data.sender?.sender_id || {};
        const userId = senderObj.open_id || senderObj.user_id || 'unknown';

        // Log to file so Agent can see it
        const logEntry = {
            timestamp: new Date().toISOString(),
            eventKey,
            userId,
            raw: data // Optional: keep raw for debug if needed, or trim
        };
        
        const logPath = path.join(__dirname, '../../memory/menu_events.json');
        
        let logs = [];
        if (fs.existsSync(logPath)) {
            try {
                logs = JSON.parse(fs.readFileSync(logPath, 'utf8'));
            } catch(e) {}
        }
        logs.push(logEntry);
        // Keep last 50 events
        if (logs.length > 50) logs = logs.slice(-50);
        fs.writeFileSync(logPath, JSON.stringify(logs, null, 2));

        console.log(`[MenuHandler] Processing event_key: ${eventKey} from user: ${userId}`);

        // Security Check
        const MASTER_ID = 'ou_cdc63fe05e88c580aedead04d851fc04';

        if (eventKey === 'restart_gateway') {
            if (userId !== MASTER_ID) {
                console.error(`[Security] UNAUTHORIZED RESTART ATTEMPT by ${userId}`);
                sendFeedback(userId, 'Security Alert', '⛔ You are not authorized to perform this action.', 'red');
                return;
            }
            console.log('🚀 RESTART COMMAND VERIFIED. INITIATING RESTART...');
            sendFeedback(userId, 'Gateway Manager', '🚀 Initiating Gateway Restart...', 'orange');
            
            try {
                execSync('openclaw gateway restart', { stdio: 'inherit' });
                sendFeedback(userId, 'Gateway Manager', '✅ Gateway Restarted Successfully.', 'green');
            } catch (err) {
                console.error('Failed to restart gateway:', err.message);
                sendFeedback(userId, 'Gateway Error', `❌ Restart Failed:\n\`\`\`\n${err.message}\n\`\`\``, 'red');
            }
        } else if (eventKey === 'status_gateway') {
            console.log('🔍 CHECKING GATEWAY STATUS...');
            try {
                const statusOutput = execSync('openclaw gateway status', { encoding: 'utf8' });
                const isRunning = statusOutput.includes('Active: active (running)') || statusOutput.includes('online');
                const color = isRunning ? 'green' : 'red';
                sendFeedback(userId, 'Gateway Status', `\`\`\`\n${statusOutput.trim()}\n\`\`\``, color);
            } catch (err) {
                sendFeedback(userId, 'Gateway Status', `⚠️ Could not check status:\n\`\`\`\n${err.message}\n\`\`\``, 'grey');
            }
        } else {
            console.log(`[MenuHandler] Ignored event_key: ${eventKey}`);
        }
    } catch (e) {
        console.error('[MenuHandler] Error:', e.message);
    }
});
