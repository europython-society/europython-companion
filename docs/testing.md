# Testing

## Current posture
- There is no test runner configured in this repo (no Jest/Vitest config, no `*.test.ts` files anywhere in `src/`).
- CI (`.github/workflows/ci.yml`) runs `pnpm install --frozen-lockfile` then `pnpm typecheck` (`tsc --noEmit`) on every push/PR — that's the entire automated gate.
- Manual verification is expected for UI, navigation, and data-flow changes.

## Where tests would live
If automated tests are added, keep them close to the code they cover using `*.test.ts`/`*.test.tsx` files under `src/`. You'd need to add the runner and its scripts explicitly to `package.json` and to `.github/workflows/ci.yml` — neither currently references one. Good first candidates, since they're pure functions with no React/platform dependencies: `src/services/conferenceTransform.ts` (`buildDays`, `normalizeSession`/`normalizeSpeaker`), `src/utils/schedule.ts` (`compareSessionsByStart`, `sortScheduleItems`), `src/services/guards.ts`.

## Contributor expectations
- Run `pnpm typecheck` before opening a PR — this is the only thing CI checks, so a type error is a guaranteed CI failure.
- Exercise the flows you touched manually: schedule browsing/filtering/search, favoriting, session/speaker detail, settings changes (theme, year, notifications, time zone), calendar add/remove, and — if you touched anything notification- or navigation-related — a cold-start notification tap (`useNotificationDeepLink` only runs its cold-start check on native, not web).
- If you touch web-specific code (`AppTabs.tsx`, `usePwaInstallPrompt`, `webAlertPolyfill.ts`), test with `pnpm web`, not just native — the platform-split files mean native testing alone won't catch web regressions and vice versa.
