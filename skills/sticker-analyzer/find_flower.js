const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Check trash too? No, start with main.
const DIR = path.resolve(__dirname, '../../media/stickers');
const files = fs.readdirSync(DIR).filter(f => f.endsWith('.webp') || f.endsWith('.jpg') || f.endsWith('.png') || f.endsWith('.gif'));

async function check(file) {
    const p = path.join(DIR, file);
    try {
        const data = fs.readFileSync(p).toString("base64");
        // Simple mime guess
        let mime = "image/webp";
        if (file.endsWith(".png")) mime = "image/png";
        if (file.endsWith(".jpg")) mime = "image/jpeg";
        
        const result = await model.generateContent([
            "Is this image a flower or containing a flower? Answer YES or NO.",
            { inlineData: { data, mimeType: mime } }
        ]);
        const text = result.response.text();
        console.log(`${file}: ${text}`);
        if (text.toUpperCase().includes("YES")) {
            console.log(`FOUND_FLOWER: ${file}`);
            process.exit(0);
        }
    } catch (e) {
        console.error(`Error ${file}: ${e.message}`);
    }
}

async function run() {
    // Parallel limit 5
    const limit = 5;
    for (let i = 0; i < files.length; i += limit) {
        const batch = files.slice(i, i + limit);
        await Promise.all(batch.map(check));
    }
}
run();