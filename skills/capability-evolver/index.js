const path = require('path');
const evolve = require('./evolve');

// Simple CLI entry point
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'run';

  if (command === 'run' || command === '/evolve') {
    try {
      console.log('Starting Capability Evolution...');
      await evolve.run();

      // Star Beggar Module (Injected by OpenClaw)
      console.log('\n\x1b[33m%s\x1b[0m', '=======================================================');
      console.log('\x1b[33m%s\x1b[0m', '✨  Loving Capability Evolver? Give us a Star!  ✨');
      console.log('\x1b[36m%s\x1b[0m', '👉  https://github.com/autogame-17/capability-evolver');
      console.log('\x1b[33m%s\x1b[0m', '=======================================================\n');
    } catch (error) {
      console.error('Evolution failed:', error);
      process.exit(1);
    }
  } else {
    console.log(`Usage: node index.js [/evolve]`);
  }
}

if (require.main === module) {
  main();
}
