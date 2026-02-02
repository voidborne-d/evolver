const https = require('https');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const API_KEY = process.env.GEMINI_FLASH_API_KEY;
if (!API_KEY) {
    console.error("Error: GEMINI_FLASH_API_KEY not set in .env");
    process.exit(1);
}

const ENDPOINT = "https://api5.xhub.chat/v1beta/models/gemini-2.5-flash:generateContent";

const args = process.argv.slice(2);
const prompt = args.join(' ') || "Hello";

const data = JSON.stringify({
    contents: [{
        role: "user",
        parts: [{ text: prompt }]
    }],
    generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4096
    }
});

const url = new URL(ENDPOINT);

const options = {
    hostname: url.hostname,
    path: url.pathname,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Length': data.length
    }
};

console.log(`Sending prompt to Gemini 2.5 Flash: "${prompt.substring(0, 50)}..."`);

const req = https.request(options, (res) => {
    let responseBody = '';

    res.on('data', (chunk) => {
        responseBody += chunk;
    });

    res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
                const json = JSON.parse(responseBody);
                const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                    console.log("\n--- Gemini Response ---\n");
                    console.log(text);
                    console.log("\n-----------------------\n");
                    console.log("Finish Reason:", json.candidates?.[0]?.finishReason);
                } else {
                    console.log("No text in response:", json);
                }
            } catch (e) {
                console.error("Failed to parse JSON:", e);
                console.log("Raw body:", responseBody);
            }
        } else {
            console.error(`Request failed with status ${res.statusCode}`);
            console.error(responseBody);
        }
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.write(data);
req.end();
