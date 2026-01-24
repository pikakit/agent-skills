#!/bin/sh

MESSAGE=$(cat "$1")

# Check for doctrine tag when needed
if echo "$MESSAGE" | grep -qiE '(api|chart|data|mobile|backend)'; then
  if ! echo "$MESSAGE" | grep -q '\[doctrine:'; then
    echo "ERROR: Changes to api/chart/data/mobile/backend require [doctrine: ...] tag"
    echo ""
    echo "Examples:"
    echo "  [doctrine: Law-2]"
    echo "  [doctrine: Architecture]"
    echo "  [doctrine: Performance]"
    exit 1
  fi
fi

# Check conventional commit format
if ! echo "$MESSAGE" | grep -qE '^(feat|fix|docs|style|refactor|perf|test|chore|doctrine)(\(.+\))?!?:'; then
  echo "ERROR: Commit message must follow Conventional Commits format"
  echo ""
  echo "Format: <type>[scope]: <description>"
  echo "Example: feat(api): add caching layer"
  exit 1
fi

exit 0
