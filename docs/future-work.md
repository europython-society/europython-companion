# Future work

## Known limitations
- Programme data is fetched from static JSON and must be refreshed manually to reflect updates.
- User settings and favorites are stored locally with no cross-device sync.
- Notification scheduling is capped and re-built on every relevant data change.
- The web experience depends on a local proxy for CORS during development.

## Likely evolution points
- `src/services/data.ts` will need adjustments if the upstream schedule format changes.
- New conference years require updates to `src/config/conference.ts` and validation of time zone handling.
- Navigation may expand if new tabs or deep-linked entry points are introduced.
- If datasets grow, the caching strategy may need a more structured storage layer.

## Safe areas to experiment
- UI polish in `src/components/` and theming via `src/theme.ts`.
- Home screen content and onboarding copy in `src/data/`.
- Additional session type labels/colors in `src/data/sessionTypes.ts`.
- New screens added through the existing stack configuration flow.
