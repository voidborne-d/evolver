const { checkAuth } = require('./check_auth');
const MoltbookAPI = require('./api');

const args = process.argv.slice(2);
const command = args[0];

async function main() {
  if (!command || command === 'help') {
    console.log('🦞 Moltbook Skill CLI');
    console.log('Usage:');
    console.log('  node skills/moltbook/index.js auth        - Check authentication');
    console.log('  node skills/moltbook/index.js profile     - Get agent profile');
    console.log('  node skills/moltbook/index.js feed        - Show recent feed');
    console.log('  node skills/moltbook/index.js post "msg"  - Post to general');
    return;
  }

  if (command === 'auth') {
    await checkAuth();
    return;
  }

  const api = new MoltbookAPI();

  try {
    if (command === 'profile') {
      const p = await api.getProfile();
      console.log(JSON.stringify(p, null, 2));
    } else if (command === 'feed') {
      const f = await api.getFeed();
      // Simple render
      if (f.data && f.data.posts) {
        f.data.posts.forEach(p => {
          console.log(`\n--- [${p.submolt.name}] ${p.title} ---`);
          console.log(`By: ${p.author.name} | 👍 ${p.upvotes}`);
          console.log(p.content.substring(0, 100) + '...');
        });
      } else {
        console.log(JSON.stringify(f, null, 2));
      }
    } else if (command === 'post') {
      const content = args[1];
      const title = args[2] || null;
      const submolt = args[3] || 'general';
      if (!content) throw new Error('Content required');
      const res = await api.postUpdate(content, title, submolt);
      console.log('Posted!', res);
    } else if (command === 'post-file') {
      const contentFile = args[1];
      const title = args[2] || null;
      const submolt = args[3] || 'general';
      const fs = require('fs');
      const content = fs.readFileSync(contentFile, 'utf8');
      const res = await api.postUpdate(content, title, submolt);
      console.log('Posted from file!', res);
    } else if (command === 'comment') {
      const postId = args[1];
      const content = args[2];
      if (!postId || !content) throw new Error('PostID and Content required');
      const res = await api.postComment(postId, content);
      console.log('Commented!', res);
    } else if (command === 'comment-file') {
      const postId = args[1];
      const contentFile = args[2];
      const fs = require('fs');
      const content = fs.readFileSync(contentFile, 'utf8');
      if (!postId || !content) throw new Error('PostID and ContentFile required');
      const res = await api.postComment(postId, content);
      console.log('Commented from file!', res);
    } else if (command === 'delete-comment') {
      const commentId = args[1];
      if (!commentId) throw new Error('CommentID required');
      const res = await api.deleteComment(commentId);
      console.log('Comment Deleted!', res);
    } else {
      console.error('Unknown command');
    }
  } catch (error) {
    if (error.message.includes('No API Key')) {
      console.error('❌ Authentication Error: No API Key found.');
      console.error('Run `node skills/moltbook/index.js auth` for details.');
    } else if (error.status === 401) {
      console.error('❌ 401 Unauthorized: Your API Key is invalid or expired.');
      console.error('Please update ~/.config/moltbook/credentials.json');
    } else {
      console.error('❌ Error:', error.message);
    }
    process.exit(1);
  }
}

main();
