# Getting started

## Prerequisites
- Node.js LTS (CI uses the latest LTS).
- pnpm 10.x (see `package.json` `packageManager`).
- For native runs: Xcode for iOS, Android SDK/adb for Android.

## Install dependencies
```sh
pnpm install
```

## Run the app
- Dev server with QR/Simulator options:
  ```sh
  pnpm start
  ```
- iOS simulator:
  ```sh
  pnpm ios
  ```
- Android emulator/device:
  ```sh
  pnpm android
  ```
- Web (starts the proxy + Expo web server):
  ```sh
  pnpm web
  ```

## Configuration overrides
To override data sources or the web proxy, set `EXPO_PUBLIC_*` values in your shell before starting Expo.

Example:
```sh
EXPO_PUBLIC_API_BASE="https://example.com/programme/ep{year}/releases/current" pnpm start
```

See [docs/configuration.md](configuration.md) for precedence details and web proxy overrides.
For `pnpm web`, `EXPO_PUBLIC_API_BASE` is ignored; use `EXPO_PUBLIC_WEB_PROXY_BASE` to point the web dev server at a different proxy origin.

## Native builds
`pnpm ios` and `pnpm android` build from the committed native projects. If you only need JS/UI changes, `pnpm start` is usually enough.

## Code style and checks
- Format code and docs with:
  ```sh
  pnpm format
  ```
- Verify formatting without changes:
  ```sh
  pnpm format:check
  ```
- Run the repo check used in CI:
  ```sh
  pnpm typecheck
  ```

## Next steps
- For feature work and navigation changes, start with [docs/development-workflow.md](development-workflow.md).
- For data source overrides and Expo config, continue with [docs/configuration.md](configuration.md).

## Common startup failures
- `pnpm: command not found` or wrong pnpm version: install pnpm 10.x and retry.
- iOS build fails immediately: Xcode or the CLI tools are missing or out of date.
- Android build fails with missing SDK/adb: Android Studio/SDK not installed or `ANDROID_HOME` not set.
- Web loads but schedule requests fail with CORS/network errors: the local proxy did not start or port 4000 is in use.
- App launches but shows empty data: initial fetch requires network access; verify connectivity and try Refresh in Settings.
