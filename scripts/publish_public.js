const { execSync, spawnSync } = require('child_process');

function run(cmd, opts = {}) {
  const { dryRun = false } = opts;
  if (dryRun) {
    process.stdout.write(`[dry-run] ${cmd}\n`);
    return '';
  }
  return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function hasCommand(cmd) {
  try {
    const res = spawnSync(cmd, ['--version'], { stdio: 'ignore' });
    return res.status === 0;
  } catch (e) {
    return false;
  }
}

function requireEnv(name, value) {
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
}

function ensureClean(dryRun) {
  const status = run('git status --porcelain', { dryRun });
  if (!dryRun && status) {
    throw new Error('Working tree is not clean. Commit or stash before publishing.');
  }
}

function ensureBranch(expected, dryRun) {
  const current = run('git rev-parse --abbrev-ref HEAD', { dryRun }) || expected;
  if (!dryRun && current !== expected) {
    throw new Error(`Current branch is ${current}. Expected ${expected}.`);
  }
}

function ensureRemote(remote, dryRun) {
  try {
    run(`git remote get-url ${remote}`, { dryRun });
  } catch (e) {
    throw new Error(`Remote "${remote}" not found. Add it manually before running this script.`);
  }
}

function ensureTagAvailable(tag, dryRun) {
  if (!tag) return;
  const exists = run(`git tag --list ${tag}`, { dryRun });
  if (!dryRun && exists) {
    throw new Error(`Tag ${tag} already exists.`);
  }
}

function createReleaseWithGh({ repo, tag, title, notes, notesFile, dryRun }) {
  if (!repo || !tag) return;
  if (!hasCommand('gh')) {
    throw new Error('gh CLI not found. Install GitHub CLI or disable release creation.');
  }
  const args = ['release', 'create', tag, '--repo', repo];
  if (title) args.push('-t', title);
  if (notesFile) args.push('-F', notesFile);
  else if (notes) args.push('-n', notes);
  else args.push('-n', 'Release created by publish script.');
  const cmd = `gh ${args.map(a => (/\s/.test(a) ? `"${a}"` : a)).join(' ')}`;
  run(cmd, { dryRun });
}

function main() {
  const dryRun = String(process.env.DRY_RUN || '').toLowerCase() === 'true';

  const sourceBranch = process.env.SOURCE_BRANCH || 'main';
  const publicRemote = process.env.PUBLIC_REMOTE || 'public';
  const publicBranch = process.env.PUBLIC_BRANCH || 'main';

  const releaseTag = process.env.RELEASE_TAG || '';
  const releaseTitle = process.env.RELEASE_TITLE || '';
  const releaseNotes = process.env.RELEASE_NOTES || '';
  const releaseNotesFile = process.env.RELEASE_NOTES_FILE || '';
  const releaseCreate = String(process.env.RELEASE_CREATE || '').toLowerCase() === 'true';
  const publicRepo = process.env.PUBLIC_REPO || '';

  ensureClean(dryRun);
  ensureBranch(sourceBranch, dryRun);
  ensureRemote(publicRemote, dryRun);
  ensureTagAvailable(releaseTag, dryRun);

  run(`git push ${publicRemote} ${sourceBranch}:${publicBranch}`, { dryRun });

  if (releaseTag) {
    const msg = releaseTitle || `Release ${releaseTag}`;
    run(`git tag -a ${releaseTag} -m "${msg.replace(/"/g, '\\"')}"`, { dryRun });
    run(`git push ${publicRemote} ${releaseTag}`, { dryRun });
  }

  if (releaseCreate) {
    requireEnv('PUBLIC_REPO', publicRepo);
    createReleaseWithGh({
      repo: publicRepo,
      tag: releaseTag,
      title: releaseTitle,
      notes: releaseNotes,
      notesFile: releaseNotesFile,
      dryRun,
    });
  }
}

try {
  main();
} catch (e) {
  process.stderr.write(`${e.message}\n`);
  process.exit(1);
}

