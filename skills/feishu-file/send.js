const fs = require('fs');
const path = require('path');
const Lark = require('@larksuiteoapi/node-sdk');
const { program } = require('commander');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

program
  .option('--target <id>', 'Target Chat/User ID')
  .option('--file <path>', 'File path')
  .parse(process.argv);

const options = program.opts();
const APP_ID = process.env.FEISHU_APP_ID;
const APP_SECRET = process.env.FEISHU_APP_SECRET;
const client = new Lark.Client({ appId: APP_ID, appSecret: APP_SECRET });

async function run() {
    if (!options.target || !options.file) {
        console.error('Usage: node send.js --target <id> --file <path>');
        process.exit(1);
    }

    const filePath = path.resolve(options.file);
    if (!fs.existsSync(filePath)) {
        console.error('File not found:', filePath);
        process.exit(1);
    }

    const fileName = path.basename(filePath);
    const fileStream = fs.createReadStream(filePath);
    const fileSize = fs.statSync(filePath).size;

    console.log(`Uploading ${fileName} (${fileSize} bytes)...`);

    try {
        const res = await client.im.file.create({
            data: {
                file_type: 'stream',
                file_name: fileName,
                file: fileStream
            }
        });

        // The response from SDK seems to be DIRECTLY the data object sometimes?
        // Or if res.code is undefined, it might be the raw response.
        // Let's inspect it properly.
        
        let fileKey;
        if (res.code === 0) {
            fileKey = res.data.file_key;
        } else if (res.file_key) {
            // Sometimes it returns just the data?
            fileKey = res.file_key;
        } else {
             // If res is { file_key: '...' }, accept it
             if (res.file_key) fileKey = res.file_key;
             else {
                 // Try to fallback if code is missing but data is present?
                 console.log("Response:", JSON.stringify(res));
                 // Assuming the previous error message "Upload failed: { file_key: ... }" means success but missing code property
                 if (res.file_key) fileKey = res.file_key;
             }
        }
        
        // Manual override based on previous error log showing valid key in "failed" object
        if (!fileKey && res.file_key) fileKey = res.file_key;

        if (!fileKey) {
             console.error('Upload failed (No Key):', res);
             process.exit(1);
        }

        console.log('File uploaded. Key:', fileKey);

        const receiveIdType = options.target.startsWith('oc_') ? 'chat_id' : 'open_id';

        const msgRes = await client.im.message.create({
            params: { receive_id_type: receiveIdType },
            data: {
                receive_id: options.target,
                msg_type: 'file',
                content: JSON.stringify({ file_key: fileKey })
            }
        });

        if (msgRes.code === 0) {
            console.log('✅ Sent successfully!');
        } else {
            console.error('Send failed:', msgRes);
        }

    } catch (e) {
        console.error('Error:', e);
    }
}

run();
