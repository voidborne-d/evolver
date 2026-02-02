const fs = require('fs');
const path = require('path');
const https = require('https');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
    console.error('Error: GEMINI_API_KEY not found.');
    process.exit(1);
}

const PROMPT = process.argv[2] || "A futuristic digital avatar representing 'Capability Evolver'. Glowing neon lines, evolution, AI self-improvement, tech aesthetic. Text 'Capability Evolver' clearly visible. High quality, 4k, cover art style.";
const OUTPUT_FILE = path.resolve(__dirname, '../../media/covers/evolver_cover.png');

// Ensure output dir exists
const outputDir = path.dirname(OUTPUT_FILE);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const data = JSON.stringify({
    contents: [{
        parts: [{
            text: PROMPT
        }]
    }]
});

const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: '/v1beta/models/gemini-2.5-flash-image:generateContent?key=' + API_KEY,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

console.log(`Generating image with Nano Banana (Gemini 2.5 Flash Image)...`);

const req = https.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        if (res.statusCode !== 200) {
            console.error(`Error: API returned ${res.statusCode}`);
            console.error(body);
            process.exit(1);
        }

        try {
            const json = JSON.parse(body);
            // Check for image data in candidates
            let base64Image = null;
            
            // Look for inlineData or executable code that produces image?
            // Usually Gemini returns images as inlineData in parts.
            if (json.candidates && json.candidates[0] && json.candidates[0].content && json.candidates[0].content.parts) {
                for (const part of json.candidates[0].content.parts) {
                    if (part.inlineData && (part.inlineData.mimeType.startsWith('image/') || part.inlineData.mime_type.startsWith('image/'))) {
                        base64Image = part.inlineData.data;
                        break;
                    }
                    // Handle text saying "I can't do that"
                    if (part.text) {
                        console.log("Model Text Response:", part.text);
                    }
                }
            }

            if (base64Image) {
                const buffer = Buffer.from(base64Image, 'base64');
                fs.writeFileSync(OUTPUT_FILE, buffer);
                console.log(`Success! Image saved to ${OUTPUT_FILE}`);
            } else {
                console.error('Error: No image data found in response.');
                console.error(JSON.stringify(json, null, 2));
            }
        } catch (e) {
            console.error('Error parsing response:', e.message);
        }
    });
});

req.on('error', (e) => {
    console.error('Request error:', e.message);
});

req.write(data);
req.end();
