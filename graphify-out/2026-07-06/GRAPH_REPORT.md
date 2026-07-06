# Graph Report - .  (2026-07-06)

## Corpus Check
- 40 files · ~29,402 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 545 nodes · 910 edges · 36 communities (31 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.69)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Conference Data Layer|Conference Data Layer]]
- [[_COMMUNITY_Schedule Utilities & Notifications|Schedule Utilities & Notifications]]
- [[_COMMUNITY_Architecture & Documentation|Architecture & Documentation]]
- [[_COMMUNITY_Navigation & Routing|Navigation & Routing]]
- [[_COMMUNITY_Package Dependencies|Package Dependencies]]
- [[_COMMUNITY_App Config (app.json)|App Config (app.json)]]
- [[_COMMUNITY_Schedule Filters UI|Schedule Filters UI]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_CoC Contacts & Markdown|CoC Contacts & Markdown]]
- [[_COMMUNITY_Home Screen Components|Home Screen Components]]
- [[_COMMUNITY_Speaker & Session Detail Screens|Speaker & Session Detail Screens]]
- [[_COMMUNITY_Theme & Detail Actions|Theme & Detail Actions]]
- [[_COMMUNITY_Favorites & Data States|Favorites & Data States]]
- [[_COMMUNITY_Settings UI|Settings UI]]
- [[_COMMUNITY_Speaker Detail & Notifications Screens|Speaker Detail & Notifications Screens]]
- [[_COMMUNITY_Settings & Timezone State|Settings & Timezone State]]
- [[_COMMUNITY_Favorites Storage|Favorites Storage]]
- [[_COMMUNITY_App Root Composition|App Root Composition]]
- [[_COMMUNITY_NPM Scripts|NPM Scripts]]
- [[_COMMUNITY_Dev Dependencies|Dev Dependencies]]
- [[_COMMUNITY_Screen Container & Onboarding|Screen Container & Onboarding]]
- [[_COMMUNITY_Upcoming & Break List Items|Upcoming & Break List Items]]
- [[_COMMUNITY_Package Metadata|Package Metadata]]
- [[_COMMUNITY_Settings Row Component|Settings Row Component]]
- [[_COMMUNITY_Conference Meta Config|Conference Meta Config]]
- [[_COMMUNITY_Schedule Level Filter|Schedule Level Filter]]
- [[_COMMUNITY_Social Links Component|Social Links Component]]
- [[_COMMUNITY_Notification Deep Link|Notification Deep Link]]
- [[_COMMUNITY_Onboarding Data|Onboarding Data]]
- [[_COMMUNITY_Share Utility|Share Utility]]
- [[_COMMUNITY_Dev Proxy Server|Dev Proxy Server]]
- [[_COMMUNITY_App Icon Asset|App Icon Asset]]
- [[_COMMUNITY_Prod Base URL Constant|Prod Base URL Constant]]

## God Nodes (most connected - your core abstractions)
1. `spacing` - 35 edges
2. `Architecture (docs)` - 20 edges
3. `radius` - 17 edges
4. `Data and State (docs)` - 14 edges
5. `paths` - 13 edges
6. `Project Structure (docs)` - 12 edges
7. `Development Workflow (docs)` - 11 edges
8. `expo` - 11 edges
9. `useScheduleNotifications()` - 9 edges
10. `Documentation Index` - 9 edges

## Surprising Connections (you probably didn't know these)
- `pnpm-workspace nodeLinker: hoisted` --conceptually_related_to--> `CI Type Check Job`  [INFERRED]
  pnpm-workspace.yaml → .github/workflows/ci.yml
- `Architecture (docs)` --references--> `ConferenceDataProvider (src/store/conferenceData.tsx)`  [EXTRACTED]
  docs/architecture.md → architecture.md
- `Architecture (docs)` --references--> `FavoritesProvider (src/store/favorites.tsx)`  [EXTRACTED]
  docs/architecture.md → architecture.md
- `Architecture (docs)` --references--> `SettingsProvider (src/store/settings.tsx)`  [EXTRACTED]
  docs/architecture.md → architecture.md
- `Architecture (docs)` --references--> `useAppTheme hook`  [EXTRACTED]
  docs/architecture.md → architecture.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **App bootstrap: App.tsx mounts SettingsProvider, ConferenceDataProvider, FavoritesProvider** — architecture_app_tsx, architecture_settingsprovider, architecture_conferencedataprovider, architecture_favoritesprovider [EXTRACTED 1.00]
- **Cross-cutting hooks centralizing side effects and derived values** — architecture_usescheduleNotifications, architecture_usecalendarsync, architecture_useappnavigation, architecture_useeffectivetimezone, architecture_useapptheme [EXTRACTED 1.00]
- **Documentation suite organized by docs/README.md** — docs_readme_index, docs_architecture_doc, docs_project_structure_doc, docs_development_workflow_doc, docs_navigation_doc, docs_configuration_doc, docs_data_and_state_doc, docs_testing_doc, docs_future_work_doc [EXTRACTED 1.00]

## Communities (36 total, 5 thin omitted)

### Community 0 - "Conference Data Layer"
Cohesion: 0.05
Nodes (57): MAX_DATE_ISO, NOTIFICATION_LEAD_OPTIONS, useSpeakerAvatars(), addMinutesToIso(), buildBasePath(), buildDays(), buildProdBaseUrl(), CachedConferencePayload (+49 more)

### Community 1 - "Schedule Utilities & Notifications"
Cohesion: 0.06
Nodes (50): FavoriteToggleButton(), IconButtonProps, Props, nameOrUnknown(), Props, SessionListItem(), styles, sessionTypeAccentMap (+42 more)

### Community 2 - "Architecture & Documentation"
Cohesion: 0.06
Nodes (64): app.json (Expo config), App.tsx (root component), ConferenceDataProvider (src/store/conferenceData.tsx), src/config/conference.ts, src/config/constants.ts, src/data/sessionTypes.ts, dev-proxy.mjs, FavoritesProvider (src/store/favorites.tsx) (+56 more)

### Community 3 - "Navigation & Routing"
Cohesion: 0.10
Nodes (28): navigationRef, AgendaStackParamList, AgendaStackRoutes, CombinedParamList, HomeStackParamList, HomeStackRoutes, OnboardingStackParamList, OnboardingStackRoutes (+20 more)

### Community 4 - "Package Dependencies"
Cohesion: 0.07
Nodes (28): dependencies, expo, expo-calendar, @expo/dom-webview, expo-font, expo-haptics, expo-notifications, expo-splash-screen (+20 more)

### Community 5 - "App Config (app.json)"
Cohesion: 0.08
Nodes (23): backgroundColor, foregroundImage, adaptiveIcon, package, permissions, predictiveBackGestureEnabled, expo, android (+15 more)

### Community 6 - "Schedule Filters UI"
Cohesion: 0.12
Nodes (12): DayOption, Props, styles, Props, styles, Props, styles, Props (+4 more)

### Community 7 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, noUnusedLocals, noUnusedParameters, paths, strict, extends, @/*, @app-types/* (+10 more)

### Community 8 - "CoC Contacts & Markdown"
Cohesion: 0.13
Nodes (11): Contact, Props, styles, Props, styles, createStyles(), MarkdownBody(), Props (+3 more)

### Community 9 - "Home Screen Components"
Cohesion: 0.13
Nodes (9): Props, styles, NeedToKnowList(), Action, Props, styles, needToKnow, NeedToKnowCard (+1 more)

### Community 10 - "Speaker & Session Detail Screens"
Cohesion: 0.16
Nodes (8): Props, OfflineBanner(), Props, styles, OfflineNotice(), Props, styles, styles

### Community 11 - "Theme & Detail Actions"
Cohesion: 0.18
Nodes (10): DetailAction, Props, styles, createPaperTheme(), darkPalette, lightPalette, nightPalette, Palette (+2 more)

### Community 12 - "Favorites & Data States"
Cohesion: 0.19
Nodes (7): Props, styles, Props, Props, StateMessage(), styles, styles

### Community 13 - "Settings UI"
Cohesion: 0.17
Nodes (8): Option, Props, styles, CardProps, Props, SettingsSection(), styles, styles

### Community 14 - "Speaker Detail & Notifications Screens"
Cohesion: 0.19
Nodes (7): PaddedScrollView(), Props, Props, SpeakerAvatar(), ScheduledItem, styles, styles

### Community 15 - "Settings & Timezone State"
Cohesion: 0.22
Nodes (8): useEffectiveTimeZone(), getEffectiveTimeZone(), SettingsContext, SettingsContextValue, SettingsState, ThemeMode, TimeZonePreference, useSettings()

### Community 16 - "Favorites Storage"
Cohesion: 0.32
Nodes (10): FavoritesContext, FavoritesContextValue, FavoritesProvider(), KEY_PER_YEAR(), loadFavorites(), saveFavorites(), loadJsonData(), loadJsonFromStorage() (+2 more)

### Community 17 - "App Root Composition"
Cohesion: 0.22
Nodes (3): builtStacks, stackScreenOptions, Tab

### Community 18 - "NPM Scripts"
Cohesion: 0.22
Nodes (9): scripts, android, dev:proxy, format, format:check, ios, start, typecheck (+1 more)

### Community 19 - "Dev Dependencies"
Cohesion: 0.25
Nodes (8): devDependencies, babel-plugin-module-resolver, express, http-proxy-middleware, prettier, @types/express, @types/react, typescript

### Community 20 - "Screen Container & Onboarding"
Cohesion: 0.25
Nodes (4): Props, styles, SlideAction, styles

### Community 21 - "Upcoming & Break List Items"
Cohesion: 0.29
Nodes (3): Props, Props, styles

### Community 22 - "Package Metadata"
Cohesion: 0.33
Nodes (5): main, name, packageManager, private, version

### Community 23 - "Settings Row Component"
Cohesion: 0.33
Nodes (3): BaseProps, styles, SwitchProps

### Community 24 - "Conference Meta Config"
Cohesion: 0.33
Nodes (4): CONFERENCE_META, CONFERENCE_YEARS, ConferenceMeta, DEFAULT_CONFERENCE_YEAR

### Community 25 - "Schedule Level Filter"
Cohesion: 0.50
Nodes (4): capitalizeWords(), Props, ScheduleLevelFilter(), styles

### Community 26 - "Social Links Component"
Cohesion: 0.40
Nodes (3): Props, SocialLink, styles

### Community 27 - "Notification Deep Link"
Cohesion: 0.83
Nodes (3): extractSessionId(), navigateToSession(), useNotificationDeepLink()

## Knowledge Gaps
- **211 isolated node(s):** `DetailAction`, `Props`, `styles`, `Props`, `Props` (+206 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `spacing` connect `Schedule Filters UI` to `Schedule Utilities & Notifications`, `Navigation & Routing`, `CoC Contacts & Markdown`, `Home Screen Components`, `Speaker & Session Detail Screens`, `Theme & Detail Actions`, `Favorites & Data States`, `Settings UI`, `Speaker Detail & Notifications Screens`, `Screen Container & Onboarding`, `Upcoming & Break List Items`, `Settings Row Component`, `Schedule Level Filter`, `Social Links Component`?**
  _High betweenness centrality (0.123) - this node is a cross-community bridge._
- **Why does `Session` connect `Schedule Utilities & Notifications` to `Conference Data Layer`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Package Dependencies` to `Package Metadata`?**
  _High betweenness centrality (0.007) - this node is a cross-community bridge._
- **What connects `DetailAction`, `Props`, `styles` to the rest of the system?**
  _219 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Conference Data Layer` be split into smaller, more focused modules?**
  _Cohesion score 0.0502283105022831 - nodes in this community are weakly interconnected._
- **Should `Schedule Utilities & Notifications` be split into smaller, more focused modules?**
  _Cohesion score 0.06340326340326341 - nodes in this community are weakly interconnected._
- **Should `Architecture & Documentation` be split into smaller, more focused modules?**
  _Cohesion score 0.05505952380952381 - nodes in this community are weakly interconnected._