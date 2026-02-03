const path = require('path');

function getRepoRoot() {
  // In this repo, scripts live at the repo root, so __dirname is stable.
  // Keeping it as a function makes later embedding easier.
  return path.resolve(__dirname, '..');
}

function getMemoryDir() {
  const repoRoot = getRepoRoot();
  return process.env.MEMORY_DIR || path.join(repoRoot, 'memory');
}

function getGepAssetsDir() {
  const repoRoot = getRepoRoot();
  return process.env.GEP_ASSETS_DIR || path.join(repoRoot, 'gep_assets');
}

module.exports = {
  getRepoRoot,
  getMemoryDir,
  getGepAssetsDir,
};

