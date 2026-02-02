const https = require('https');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const API_KEY = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

https.get(url, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
        try {
            const data = JSON.parse(body);
            if (data.models) {
                console.log("Available Models:");
                data.models.forEach(m => {
                    if (m.name.includes('imagen') || m.name.includes('gemini')) {
                        console.log(`- ${m.name} (${m.supportedGenerationMethods})`);
                    }
                });
            } else {
                console.log("No models found or error:", data);
            }
        } catch (e) {
            console.error("Parse error:", e);
        }
    });
}).on('error', e => console.error("Request error:", e));
