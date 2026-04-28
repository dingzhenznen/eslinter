#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

DIFF="$(git diff --cached)"
if [ -z "$DIFF" ]; then
  echo "No staged changes."
  exit 0
fi

if ! command -v claude >/dev/null 2>&1; then
  echo "claude CLI is not installed or not in PATH."
  exit 1
fi

RESULT="$(
  printf '%s' "$DIFF" | claude -p \
    --output-format text \
    --append-system-prompt-file .claude/review-prompt.txt \
    "Review this staged git diff."
)"

echo "$RESULT"

if printf '%s\n' "$RESULT" | grep -q "^REVIEW_STATUS: PASS$"; then
  exit 0
fi

echo "Claude review failed."
exit 1
