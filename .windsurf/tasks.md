# AirBear PWA Tasks

## Auto-Run Everything (Preflight)

- Command: `npm run auto:run`
- Purpose: clean, warning-free verification before deploy.

## Deploy Production (Vercel)

- Command: `npm run auto:deploy`
- Requires: `VERCEL_OIDC_TOKEN` or `VERCEL_TOKEN`

## Smoke Test Production

- Command: `curl -sSf https://airbear.me`

## Optional

- Build only: `npm run build`
- Type check: `npm run type-check`
- Lint: `npm run lint`
- CodeMaps validate: `npm run codemaps:validate`
