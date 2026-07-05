# Testing

## Current posture
- There is no test runner configured in this repo.
- CI runs `pnpm typecheck` only (see `.github/workflows/ci.yml`).
- Manual verification is expected for UI and navigation changes.

## Where tests would live
If automated tests are added, keep them close to the code they cover using `*.test.ts` or `*.test.tsx` files under `src/`. Add the runner and scripts explicitly to `package.json` and CI.

## Contributor expectations
- Run `pnpm typecheck` before opening a PR.
- Exercise key user flows manually (schedule browsing, favorites, session detail, settings, notifications).
