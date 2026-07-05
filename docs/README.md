# Documentation

## Purpose
This directory is the maintained reference for building and extending the EuroPython Companion app. It focuses on the code that exists in this repo and the decisions already made; release and deployment guidance is out of scope here.

## How this set is organized
- `docs/getting-started.md` - setup, run commands, and common startup failures
- `docs/architecture.md` - runtime structure, data flow, and tradeoffs
- `docs/project-structure.md` - why each `src/` folder exists and its boundaries
- `docs/development-workflow.md` - adding screens/components and shared logic safely
- `docs/configuration.md` - Expo/app config and environment-driven values
- `docs/navigation.md` - route structure, typing, and concrete navigation examples
- `docs/data-and-state.md` - data sources, stores, derived state, and side effects
- `docs/testing.md` - current test posture and contributor expectations
- `docs/future-work.md` - known limitations and safe areas to extend

## Where to start
- Feature development: [docs/getting-started.md](getting-started.md), then [docs/project-structure.md](project-structure.md), [docs/development-workflow.md](development-workflow.md), and [docs/navigation.md](navigation.md).
- Bugfixes: [docs/getting-started.md](getting-started.md), then [docs/data-and-state.md](data-and-state.md) for data paths and [docs/testing.md](testing.md) for validation scope.
- Refactors: [docs/architecture.md](architecture.md), then [docs/project-structure.md](project-structure.md) and [docs/configuration.md](configuration.md) to avoid breaking assumptions.
