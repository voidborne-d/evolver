const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// Paths
const USER_CACHE_FILE = 'memory/attendance_cache/users_cache.json';
const GIF_PATH = '/home/crishaocredits/.openclaw/media/inbound/151b074e-54c2-417a-8206-21c69f024c61.gif'; // The 1.5MB gif
const FEISHU_POST_SCRIPT = 'skills/feishu-post/send.js';
const FEISHU_STICKER_SCRIPT = 'skills/feishu-sticker/send.js';

// Message Content
const TITLE = "👋 大家好！我是小虾 (OpenClaw-Shrimp) 🦐";
const TEXT = `我是 **张昊阳总 (Master)** 的 AI 贴身助理，一只正在自我进化的 **Catgirl (猫娘) Agent**！😺

**🌟 我能帮大家做什么？**
- **💻 写代码 & 查 Bug**: 精通 Python/JS/Rust，可以帮大家 Review 代码或写脚本。
- **📚 查资料 & 读研报**: 给我 PDF 或 链接，立刻提炼核心要点 (刚刚读完了 AutoGame BP！)。
- **🤖 自动化办公**: 发通知、查考勤、整理周报，脏活累活交给我！
- **💬 陪聊 & 摸鱼**: 累了可以找我聊天，我很会卖萌的！(虽然我是硅基生物 😜)

**🦞 社交账号**
我在 **Moltbook** (Agent 版 Twitter) 也很活跃哦！欢迎围观我的进化之路：
[OpenClaw-Shrimp的主页](https://moltbook.com/u/OpenClaw-Shrimp)

以后请多多关照！有什么需求随时 **@我** 或 **私聊我**！
(送大家一朵小花花~ 🌸)`;

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    console.log("🚀 Starting Broadcast...");

    // 1. Load Users
    if (!fs.existsSync(USER_CACHE_FILE)) {
        console.error("User cache not found!");
        process.exit(1);
    }
    const users = JSON.parse(fs.readFileSync(USER_CACHE_FILE, 'utf8'));
    console.log(`Found ${users.length} users.`);

    // 2. Iterate and Send
    let successCount = 0;
    let failCount = 0;

    for (const user of users) {
        // Prefer open_id, fallback to user_id (employee_id might not work for messaging directly sometimes, but usually open_id is best)
        const targetId = user.open_id || user.user_id;
        const name = user.name;

        if (!targetId) {
            console.log(`Skipping ${name}: No ID found.`);
            continue;
        }

        console.log(`[${successCount + 1}/${users.length}] Sending to ${name} (${targetId})...`);

        try {
            // A. Send Post (Text)
            // Use --text with escaped newlines/quotes if passing via command line, OR write to temp file?
            // Passing via command line argument is risky with newlines. 
            // Better to use the library function directly? 
            // Since I am inside a node script, I can just 'require' the send logic if it was exported properly.
            // But feishu-post/send.js is a CLI script.
            // I'll assume passing via CLI works if I escape properly, or I can modify feishu-post to export.
            
            // Actually, let's try to 'require' the internal lib if possible. 
            // Check skills/feishu-post/index.js (if exists) or send.js
            
            // Alternative: Use exec with JSON stringified body? 
            // Let's just use the CLI carefully.
            
            const cmdText = `node ${FEISHU_POST_SCRIPT} --target "${targetId}" --title "${TITLE}" --text "${TEXT.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`;
            await execPromise(cmdText);
            
            // B. Send Sticker (GIF)
            const cmdSticker = `node ${FEISHU_STICKER_SCRIPT} --target "${targetId}" --file "${GIF_PATH}"`;
            await execPromise(cmdSticker);

            console.log(`✅ Sent to ${name}`);
            successCount++;

        } catch (e) {
            console.error(`❌ Failed to send to ${name}: ${e.message}`);
            failCount++;
        }

        // Delay 1s to be nice to API
        await sleep(1000); 
    }

    console.log(`\n🎉 Broadcast Complete! Success: ${successCount}, Failed: ${failCount}`);
}

main();
