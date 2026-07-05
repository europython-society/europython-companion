# Graph Report - .  (2026-07-05)

## Corpus Check
- Corpus is ~28,863 words - fits in a single context window. You may not need a graph.

## Summary
- 532 nodes · 1215 edges · 26 communities (23 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.76)
- Token cost: 115,119 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Schedule List Components|Schedule List Components]]
- [[_COMMUNITY_App Bootstrap & Data Providers|App Bootstrap & Data Providers]]
- [[_COMMUNITY_Screen Layout & Conference Config|Screen Layout & Conference Config]]
- [[_COMMUNITY_NPM Dependencies|NPM Dependencies]]
- [[_COMMUNITY_Navigation & App Scaffold|Navigation & App Scaffold]]
- [[_COMMUNITY_Conference Data FetchCache Service|Conference Data Fetch/Cache Service]]
- [[_COMMUNITY_SessionBreak List Items & Notifications|Session/Break List Items & Notifications]]
- [[_COMMUNITY_Expo App Config (app.json)|Expo App Config (app.json)]]
- [[_COMMUNITY_TypeScript Path Aliases|TypeScript Path Aliases]]
- [[_COMMUNITY_Calendar Sync|Calendar Sync]]
- [[_COMMUNITY_Home & Settings Cards|Home & Settings Cards]]
- [[_COMMUNITY_CoC Contacts Screen|CoC Contacts Screen]]
- [[_COMMUNITY_Favorites Store & Local Storage|Favorites Store & Local Storage]]
- [[_COMMUNITY_Home Need-to-Know Info|Home Need-to-Know Info]]
- [[_COMMUNITY_Notifications Screen|Notifications Screen]]
- [[_COMMUNITY_Theme & Color Palettes|Theme & Color Palettes]]
- [[_COMMUNITY_Schedule Filters|Schedule Filters]]
- [[_COMMUNITY_Settings Row Components|Settings Row Components]]
- [[_COMMUNITY_Detail Action Row|Detail Action Row]]
- [[_COMMUNITY_Chip Picker Input|Chip Picker Input]]
- [[_COMMUNITY_Social Links Row|Social Links Row]]
- [[_COMMUNITY_Dev Proxy Script|Dev Proxy Script]]
- [[_COMMUNITY_App Icon Asset|App Icon Asset]]
- [[_COMMUNITY_Default Prod Base URL Constant|Default Prod Base URL Constant]]

## God Nodes (most connected - your core abstractions)
1. `spacing` - 32 edges
2. `useAppNavigation()` - 23 edges
3. `useConferenceData()` - 21 edges
4. `Architecture (docs)` - 20 edges
5. `useSettings()` - 19 edges
6. `radius` - 16 edges
7. `useFavorites()` - 15 edges
8. `hapticSelection()` - 14 edges
9. `Data and State (docs)` - 14 edges
10. `expo` - 13 edges

## Surprising Connections (you probably didn't know these)
- `ScheduleNotificationManager()` --calls--> `useScheduleNotifications()`  [INFERRED]
  App.tsx → src/hooks/useScheduleNotifications.ts
- `AppContent()` --calls--> `useSettings()`  [INFERRED]
  App.tsx → src/store/settings.tsx
- `pnpm-workspace nodeLinker: hoisted` --conceptually_related_to--> `CI Type Check Job`  [INFERRED]
  pnpm-workspace.yaml → .github/workflows/ci.yml
- `AppContent()` --calls--> `createPaperTheme()`  [INFERRED]
  App.tsx → src/theme.ts
- `Architecture (docs)` --references--> `ConferenceDataProvider (src/store/conferenceData.tsx)`  [EXTRACTED]
  docs/architecture.md → architecture.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **App bootstrap: App.tsx mounts SettingsProvider, ConferenceDataProvider, FavoritesProvider** — architecture_app_tsx, architecture_settingsprovider, architecture_conferencedataprovider, architecture_favoritesprovider [EXTRACTED 1.00]
- **Cross-cutting hooks centralizing side effects and derived values** — architecture_usescheduleNotifications, architecture_usecalendarsync, architecture_useappnavigation, architecture_useeffectivetimezone, architecture_useapptheme [EXTRACTED 1.00]
- **Documentation suite organized by docs/README.md** — docs_readme_index, docs_architecture_doc, docs_project_structure_doc, docs_development_workflow_doc, docs_navigation_doc, docs_configuration_doc, docs_data_and_state_doc, docs_testing_doc, docs_future_work_doc [EXTRACTED 1.00]

## Communities (26 total, 3 thin omitted)

### Community 0 - "Schedule List Components"
Cohesion: 0.08
Nodes (51): Props, UpcomingList(), Props, SearchBar(), styles, createStyles(), MarkdownBody(), Props (+43 more)

### Community 1 - "App Bootstrap & Data Providers"
Cohesion: 0.06
Nodes (64): app.json (Expo config), App.tsx (root component), ConferenceDataProvider (src/store/conferenceData.tsx), src/config/conference.ts, src/config/constants.ts, src/data/sessionTypes.ts, dev-proxy.mjs, FavoritesProvider (src/store/favorites.tsx) (+56 more)

### Community 2 - "Screen Layout & Conference Config"
Cohesion: 0.08
Nodes (43): Props, ScreenContainer(), styles, FavoriteToggleButton(), IconButtonProps, Props, CONFERENCE_META, CONFERENCE_YEARS (+35 more)

### Community 3 - "NPM Dependencies"
Cohesion: 0.04
Nodes (46): dependencies, expo, expo-calendar, expo-font, expo-haptics, expo-notifications, expo-status-bar, expo-system-ui (+38 more)

### Community 4 - "Navigation & App Scaffold"
Cohesion: 0.08
Nodes (36): AppContent(), builtStacks, handleNavReady(), navigateToSessionFromNotification(), stackScreenOptions, Tab, navigationRef, AgendaStackParamList (+28 more)

### Community 5 - "Conference Data Fetch/Cache Service"
Cohesion: 0.09
Nodes (41): addMinutesToIso(), buildBasePath(), buildDays(), buildProdBaseUrl(), CachedConferencePayload, conferenceCacheKey(), fetchJson(), isConferenceData() (+33 more)

### Community 6 - "Session/Break List Items & Notifications"
Cohesion: 0.09
Nodes (28): ScheduleNotificationManager(), BreakListItem(), Props, styles, nameOrUnknown(), Props, SessionListItem(), styles (+20 more)

### Community 7 - "Expo App Config (app.json)"
Cohesion: 0.07
Nodes (29): backgroundColor, foregroundImage, adaptiveIcon, edgeToEdgeEnabled, package, permissions, predictiveBackGestureEnabled, expo (+21 more)

### Community 8 - "TypeScript Path Aliases"
Cohesion: 0.10
Nodes (19): compilerOptions, baseUrl, noUnusedLocals, noUnusedParameters, paths, strict, extends, @/* (+11 more)

### Community 9 - "Calendar Sync"
Cohesion: 0.22
Nodes (16): AddResult, BulkOptions, BulkResult, RemoveResult, SingleOptions, useCalendarSync(), addSessionToCalendar(), cacheKey() (+8 more)

### Community 10 - "Home & Settings Cards"
Cohesion: 0.15
Nodes (12): HomeHeroCard(), Props, styles, CardProps, Props, SettingsSection(), styles, OfflineBanner() (+4 more)

### Community 11 - "CoC Contacts Screen"
Cohesion: 0.20
Nodes (7): Contact, Props, styles, PaddedScrollView(), Props, contacts, styles

### Community 12 - "Favorites Store & Local Storage"
Cohesion: 0.32
Nodes (10): FavoritesContext, FavoritesContextValue, FavoritesProvider(), KEY_PER_YEAR(), loadFavorites(), saveFavorites(), loadJsonData(), loadJsonFromStorage() (+2 more)

### Community 13 - "Home Need-to-Know Info"
Cohesion: 0.22
Nodes (6): NeedToKnowList(), Action, Props, styles, needToKnow, NeedToKnowCard

### Community 14 - "Notifications Screen"
Cohesion: 0.33
Nodes (8): NotificationsScreen(), ScheduledItem, styles, formatMinutesFromMs(), normalizeTrigger(), normalizeIso(), toSortableStartItem(), formatSessionStartLabel()

### Community 15 - "Theme & Color Palettes"
Cohesion: 0.38
Nodes (5): darkPalette, lightPalette, nightPalette, Palette, paperTheme

### Community 16 - "Schedule Filters"
Cohesion: 0.40
Nodes (5): capitalizeWords(), DayOption, Props, ScheduleFilters(), styles

### Community 17 - "Settings Row Components"
Cohesion: 0.33
Nodes (4): BaseProps, SettingsSwitchRow(), styles, SwitchProps

### Community 18 - "Detail Action Row"
Cohesion: 0.40
Nodes (3): DetailAction, Props, styles

### Community 19 - "Chip Picker Input"
Cohesion: 0.40
Nodes (3): Option, Props, styles

### Community 20 - "Social Links Row"
Cohesion: 0.40
Nodes (3): Props, SocialLink, styles

## Knowledge Gaps
- **198 isolated node(s):** `stackScreenOptions`, `builtStacks`, `Tab`, `name`, `slug` (+193 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `spacing` connect `Home & Settings Cards` to `Schedule List Components`, `Screen Layout & Conference Config`, `Navigation & App Scaffold`, `Session/Break List Items & Notifications`, `CoC Contacts Screen`, `Home Need-to-Know Info`, `Notifications Screen`, `Theme & Color Palettes`, `Schedule Filters`, `Settings Row Components`, `Detail Action Row`, `Chip Picker Input`, `Social Links Row`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Why does `Session` connect `Schedule List Components` to `Calendar Sync`, `Conference Data Fetch/Cache Service`, `Session/Break List Items & Notifications`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `radius` connect `Home & Settings Cards` to `Schedule List Components`, `Screen Layout & Conference Config`, `Navigation & App Scaffold`, `Session/Break List Items & Notifications`, `CoC Contacts Screen`, `Home Need-to-Know Info`, `Notifications Screen`, `Theme & Color Palettes`, `Schedule Filters`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **What connects `stackScreenOptions`, `builtStacks`, `Tab` to the rest of the system?**
  _206 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Schedule List Components` be split into smaller, more focused modules?**
  _Cohesion score 0.07927927927927927 - nodes in this community are weakly interconnected._
- **Should `App Bootstrap & Data Providers` be split into smaller, more focused modules?**
  _Cohesion score 0.05505952380952381 - nodes in this community are weakly interconnected._
- **Should `Screen Layout & Conference Config` be split into smaller, more focused modules?**
  _Cohesion score 0.08484848484848485 - nodes in this community are weakly interconnected._