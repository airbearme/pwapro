#!/bin/bash

set -euo pipefail

if ! command -v vercel >/dev/null 2>&1; then
  echo "Vercel CLI is required (npm i -g vercel)."
  exit 1
fi

npm run auto:run
vercel --prod --yes
