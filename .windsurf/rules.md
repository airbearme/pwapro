# AirBear PWA Windsurf Rules

## Project Goals
- Keep production at https://airbear.me error- and warning-free.
- Preserve the permanent dark-mode brand experience.
- Validate before any deploy.

## Non-negotiables
- Do not change ThemeProvider defaults in `app/layout.tsx` (dark mode is permanent).
- Do not introduce lint/type/build warnings.
- Always run the auto-run workflow before production deploys.

## Required Verification (local or CI)
- `npm run type-check`
- `npm run lint`
- `npm run build`
- `npm run codemaps:validate`
- `npm audit --audit-level=low`

## Deployment (Vercel)
- Use `vercel --prod --yes` with `VERCEL_OIDC_TOKEN` or `VERCEL_TOKEN`.
- Confirm aliases resolve:
  - https://airbear.me
  - https://www.airbear.me
- Smoke check: `curl -sSf https://airbear.me`

## Coding Standards
- Keep changes minimal and focused.
- Avoid unused exports and unused dependencies.
- Prefer existing scripts under `scripts/` over new tooling.

## If Blocked
- Document the blocking warning/error and stop the deploy.
