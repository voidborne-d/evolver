const { getApiKey } = require('./check_auth');

const BASE_URL = 'https://www.moltbook.com/api/v1';

class MoltbookAPI {
  constructor() {
    this.key = getApiKey();
  }

  async request(method, endpoint, body = null) {
    if (!this.key) {
      throw new Error('No API Key found. Run check_auth.js to diagnose.');
    }

    const url = BASE_URL + endpoint;
    const options = {
      method: method,
      headers: {
        'Authorization': `Bearer ${this.key}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const res = await fetch(url, options);
      const data = await res.json().catch(() => null); // Handle non-JSON gracefully

      if (!res.ok) {
        const err = new Error(`Moltbook API Error: ${res.status} ${data?.error || res.statusText}`);
        err.status = res.status;
        err.data = data;
        throw err;
      }

      return data;
    } catch (e) {
      if (e.data) throw e; // Re-throw API errors
      throw new Error(`Request failed: ${e.message}`);
    }
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
