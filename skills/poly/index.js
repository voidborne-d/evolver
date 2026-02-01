#!/usr/bin/env node
const { spawn } = require('child_process');

const args = process.argv.slice(2);

// Simple wrapper to call 'clawhub' CLI
const cmd = 'clawhub';

console.log(`[Poly] 🦞 Invoking ClawHub: ${cmd} ${args.join(' ')}`);

const child = spawn(cmd, args, {
    stdio: 'inherit',
    env: process.env,
    shell: true
});

child.on('close', (code) => {
    process.exit(code);
});

child.on('error', (err) => {
    console.error('[Poly] ❌ Failed to spawn clawhub:', err);
    process.exit(1);
});
