# Documentation

## Purpose
This directory is the maintained reference for building and extending the EuroPython Companion app. It focuses on the code that exists in this repo and the decisions already made; release and deployment guidance is out of scope here.

## How this set is organized
- `docs/getting-started.md` - setup, run commands, and common startup failures
- `docs/architecture.md` - runtime structure, data flow, navigation, and file-by-file walkthrough
- `docs/project-structure.md` - why each `src/` folder exists and its boundaries
- `docs/development-workflow.md` - adding screens/components and shared logic safely
- `docs/configuration.md` - Expo/app config and static (non-environment-variable) configuration
- `docs/navigation.md` - route structure, typing, and concrete navigation examples
- `docs/data-and-state.md` - data sources, stores, derived state, and side effects
- `docs/testing.md` - current test posture and contributor expectations
- `docs/future-work.md` - known limitations and safe areas to extend

## Where to start
- Feature development: [docs/getting-started.md](getting-started.md), then [docs/project-structure.md](project-structure.md), [docs/development-workflow.md](development-workflow.md), and [docs/navigation.md](navigation.md).
- Bugfixes: [docs/getting-started.md](getting-started.md), then [docs/data-and-state.md](data-and-state.md) for data paths and [docs/testing.md](testing.md) for validation scope.
- Refactors: [docs/architecture.md](architecture.md), then [docs/project-structure.md](project-structure.md) and [docs/configuration.md](configuration.md) to avoid breaking assumptions.

## Keeping this accurate
This set was rewritten from a full read of the current source (not from the previous docs, which had drifted — stale references to a removed dev proxy, `EXPO_PUBLIC_*` env vars that no longer exist, a renamed `src/services/data.ts`, and committed `ios/`/`android/` folders that are actually gitignored). When you change code that these docs describe, update the relevant doc in the same change — don't let it drift again.
