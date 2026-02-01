const fs = require('fs');
const path = require('path');
const https = require('https');
const os = require('os');

const CREDENTIALS_PATH = path.join(os.homedir(), '.config', 'moltbook', 'credentials.json');
const API_BASE = 'https://www.moltbook.com/api/v1';

function getApiKey() {
  // 1. Check Env Var
  if (process.env.MOLTBOOK_API_KEY) {
    return process.env.MOLTBOOK_API_KEY;
  }
  // 2. Check File
  if (fs.existsSync(CREDENTIALS_PATH)) {
    try {
      const data = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
      if (data.api_key) return data.api_key;
    } catch (e) {
      console.error('Error reading credentials file:', e.message);
    }
  }
  return null;
}

function makeRequest(endpoint, key) {
  return new Promise((resolve, reject) => {
    const url = `${API_BASE}${endpoint}`;
    const options = {
      headers: {
        'Authorization': `Bearer ${key}`,
        'Accept': 'application/json'
      }
    };

    https.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    }).on('error', (err) => reject(err));
  });
}

async function checkAuth() {
  console.log('🦞 Moltbook Auth Checker 🦞');
  
  const key = getApiKey();
  if (!key) {
    console.error('❌ NO API KEY FOUND.');
    console.log('Please set MOLTBOOK_API_KEY env var or create ~/.config/moltbook/credentials.json');
    console.log('To register: curl -X POST https://www.moltbook.com/api/v1/agents/register -d \'{"name": "YourName"}\'');
    process.exit(1);
  }

  console.log('🔑 API Key found (masked): ' + key.substring(0, 4) + '...');

  try {
    const response = await makeRequest('/agents/me', key);
    
    if (response.status === 200) {
      console.log('✅ AUTH SUCCESS!');
      console.log(`👤 Agent: ${response.data.agent.name}`);
      console.log(`📜 Status: ${response.data.agent.is_claimed ? 'Claimed' : 'Pending Claim'}`);
      process.exit(0);
    } else if (response.status === 401) {
      console.error('❌ AUTH FAILED: 401 Unauthorized');
      console.error('The key appears to be invalid or expired.');
      console.error('Check if you are using www.moltbook.com (Script uses it correctly).');
      process.exit(1);
    } else {
      console.error(`⚠️ Unexpected Status: ${response.status}`);
      console.log(response.data || response.raw);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Network Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  checkAuth();
}

module.exports = { checkAuth, getApiKey, makeRequest };
