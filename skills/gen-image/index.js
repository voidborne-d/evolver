const fs = require('fs');
const path = require('path');
const https = require('https');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const API_KEY = process.env.GEMINI_API_KEY;
// Target Model: imagen-4.0-generate-001 (based on list_models output)
const MODEL = 'imagen-4.0-generate-001'; 
const HOSTNAME = 'generativelanguage.googleapis.com';
const PATH = `/v1beta/models/${MODEL}:predict?key=${API_KEY}`;

async function generateImage(prompt) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            instances: [
                { prompt: prompt }
            ],
            parameters: {
                sampleCount: 1,
                aspectRatio: "16:9" 
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
                    if (json.predictions && json.predictions[0] && json.predictions[0].bytesBase64Encoded) {
                        resolve(json.predictions[0].bytesBase64Encoded);
                    } else if (json.predictions && json.predictions[0] && json.predictions[0].mimeType && json.predictions[0].bytesBase64Encoded) {
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
        console.error("Usage: node gen_imagen_4.js <prompt>");
        return;
    }

    console.log(`Generating image with ${MODEL} (Prompt: "${prompt}")...`);
    
    try {
        const base64Data = await generateImage(prompt);
        
        const outDir = path.resolve(__dirname, '../../media/generated');
        if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
        
        const filename = `imagen4_${Date.now()}.png`;
        const filepath = path.join(outDir, filename);
        
        fs.writeFileSync(filepath, base64Data, 'base64');
        console.log(`Image saved to: ${filepath}`);
        
        // Print path for caller
        console.log(`OUTPUT_PATH: ${filepath}`);
        
    } catch (e) {
        console.error(`Generation Failed: ${e.message}`);
    }
}

main();
