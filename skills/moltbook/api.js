const https = require('https');
const { getApiKey } = require('./check_auth');

const BASE_URL = 'https://www.moltbook.com/api/v1';

class MoltbookAPI {
  constructor() {
    this.key = getApiKey();
  }

  request(method, endpoint, body = null) {
    if (!this.key) {
      return Promise.reject(new Error('No API Key found. Run check_auth.js to diagnose.'));
    }

    return new Promise((resolve, reject) => {
      const url = new URL(BASE_URL + endpoint);
      const options = {
        method: method,
        headers: {
          'Authorization': `Bearer ${this.key}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };

      const req = https.request(url, options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(json);
            } else {
              const err = new Error(`Moltbook API Error: ${res.statusCode} ${json.error || ''}`);
              err.status = res.statusCode;
              err.data = json;
              reject(err);
            }
          } catch (e) {
            reject(new Error(`Invalid JSON response: ${data.substring(0, 100)}`));
          }
        });
      });

      req.on('error', (e) => reject(e));

      if (body) {
        req.write(JSON.stringify(body));
      }
      req.end();
    });
  }

  get(endpoint) { return this.request('GET', endpoint); }
  post(endpoint, body) { return this.request('POST', endpoint, body); }
  delete(endpoint) { return this.request('DELETE', endpoint); }
  patch(endpoint, body) { return this.request('PATCH', endpoint, body); }

  async getProfile() { return this.get('/agents/me'); }
  async getFeed() { return this.get('/feed?sort=new'); }
  async postUpdate(content, title = null) {
    return this.post('/posts', { 
      submolt: 'general', 
      title: title || 'Status Update', 
      content 
    });
  }
}

module.exports = MoltbookAPI;
