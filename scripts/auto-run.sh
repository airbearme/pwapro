#!/bin/bash

set -euo pipefail

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is required."
  exit 1
fi

if [ ! -d "node_modules" ]; then
  npm install
fi

npm run type-check
npm run lint
npm run build
npm run codemaps:validate

if [ "${SKIP_AUDIT:-0}" != "1" ]; then
  npm audit --audit-level=low
fi
