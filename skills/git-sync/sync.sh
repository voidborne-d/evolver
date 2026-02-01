#!/bin/bash
# Usage: ./sync.sh ["Commit Message"]

MSG="${1:-Auto-sync: Routine evolution update}"
REPO_DIR="/home/crishaocredits/.openclaw/workspace"

cd "$REPO_DIR" || exit 1

# Check for changes
if [ -z "$(git status --porcelain)" ]; then
  echo "Nothing to commit."
  exit 0
fi

# Add everything
git add .

# Commit (pre-commit hook will run here)
if git commit -m "$MSG"; then
  echo "Commit successful."
else
  echo "Commit failed (possibly blocked by pre-commit hook or empty)."
  exit 1
fi

# Push with Retry
MAX_RETRIES=3
COUNT=0
SUCCESS=0

while [ $COUNT -lt $MAX_RETRIES ]; do
  if git push origin main; then
    echo "Push successful."
    SUCCESS=1
    break
  else
    echo "Push failed. Retrying in 3 seconds... ($((COUNT+1))/$MAX_RETRIES)"
    sleep 3
    COUNT=$((COUNT+1))
  fi
done

if [ $SUCCESS -eq 0 ]; then
  echo "Push failed after $MAX_RETRIES attempts."
  exit 1
fi
