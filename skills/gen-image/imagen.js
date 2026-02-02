const fs = require('fs');
const path = require('path');
const https = require('https');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
    console.error("Error: GEMINI_API_KEY not set in .env");
    process.exit(1);
}

// Imagen 3 Endpoint (via Gemini API)
// Documentation: https://ai.google.dev/gemini-api/docs/imagen
// Model: imagen-3.0-generate-001 (or similar)
const HOSTNAME = 'generativelanguage.googleapis.com';
const PATH = `/v1beta/models/imagen-3.0-generate-001:predict?key=${API_KEY}`;

async function generateImage(prompt) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            instances: [
                { prompt: prompt }
            ],
            parameters: {
                sampleCount: 1,
                aspectRatio: "16:9" // For cover image
            }
        });

        const options = {
            hostname: HOSTNAME,
            path: PATH,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': postData.length
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                if (res.statusCode !== 200) {
                    return reject(new Error(`API Error ${res.statusCode}: ${body}`));
                }
                try {
                    const json = JSON.parse(body);
                    // Response format for Imagen on Vertex AI / Gemini API might vary.
                    // Usually: predictions[0].bytesBase64Encoded or similar.
                    // Google AI Studio API for Imagen:
                    // { "predictions": [ { "mimeType": "image/png", "bytesBase64Encoded": "..." } ] }
                    
                    if (json.predictions && json.predictions[0] && json.predictions[0].bytesBase64Encoded) {
                        resolve(json.predictions[0].bytesBase64Encoded);
                    } else {
                        reject(new Error(`Invalid response format: ${JSON.stringify(json).substring(0, 200)}`));
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(postData);
        req.end();
    });
}

async function main() {
    const prompt = process.argv[2];
    if (!prompt) {
        console.error("Usage: node gen_imagen.js <prompt>");
        return;
    }

    console.log(`Generating image with Imagen 3 (Prompt: "${prompt}")...`);
    
    try {
        const base64Data = await generateImage(prompt);
        
        const outDir = path.resolve(__dirname, '../../media/generated');
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
        
        const filename = `imagen_${Date.now()}.png`;
        const filepath = path.join(outDir, filename);
        
        fs.writeFileSync(filepath, base64Data, 'base64');
        console.log(`Image saved to: ${filepath}`);
        
        // Print path for caller
        console.log(`OUTPUT_PATH: ${filepath}`);
        
    } catch (e) {
        console.error(`Generation Failed: ${e.message}`);
        // Fallback or detailed error logging
    }
}

main();
