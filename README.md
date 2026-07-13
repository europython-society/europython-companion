# EuroPython Companion

The official, open-source companion app for [EuroPython](https://europython.eu), maintained by the EuroPython Society. Browse the schedule, favourite sessions, get reminders before your talks start, and find your way around the venue. Works fully offline once you've opened it at least once.

Built with React Native (Expo), available for iOS, Android, and the web.

## Features

- **Schedule browsing:** the full conference programme, filterable by day and track, with room and time info kept in sync with the official schedule.
- **Favourites:** star the sessions you don't want to miss and pull up a personal agenda at any time.
- **Notifications:** optional reminders shortly before a favourited session starts.
- **Speakers:** look up who's talking, what they're presenting, and when.
- **Venue maps:** floor plans for the conference venue, including accessibility info.
- **Offline-first:** the programme is cached on your device, so the app keeps working without a connection (handy inside a busy conference venue).
- **Code of Conduct:** quick access to the EuroPython Code of Conduct and contacts, right from the app.
- **Light, dark, and night mode** themes.
- **Multi-year support:** the app can switch between conference years as data becomes available.

## Getting the app

We're still waiting on approval from the Apple App Store and Google Play, so we're not listed there just yet. In the meantime:

- **Android:** grab the latest APK from the [Releases](https://github.com/EuroPython/europython-companion/releases) page and install it directly on your device.
- **iOS:** until we're approved, the only way to run the app is to build it yourself from source (see below). Sorry for the extra hoops, we'll update this section the moment we're live on the App Store.
- **Web (PWA):** always available, no store needed, just open the site and install it to your home screen. It's a solid, bare-bones way to use the app today. A few native features, like notifications and calendar integration, aren't available in the PWA yet.

## Running it yourself

You'll need [Node.js](https://nodejs.org) and [pnpm](https://pnpm.io).

```sh
pnpm install
pnpm start
```

Full setup instructions, troubleshooting, and all available scripts are in [`docs/getting-started.md`](docs/getting-started.md).

## Contributing

Bug reports, feature suggestions, and pull requests are welcome. A few things worth knowing before diving in:

- The [`docs/`](docs/README.md) directory is the maintained technical reference for this codebase: architecture, data flow, navigation, how to add a screen, and so on. Start there.
- The app has no backend of its own, it reads static, publicly published conference data. See [`docs/configuration.md`](docs/configuration.md) for details.
- There's no dedicated test suite yet; changes are validated with type-checking and manual testing of the affected flow. See [`docs/testing.md`](docs/testing.md).

If you're planning a larger change, opening an issue first to discuss it is appreciated.

## License

See [LICENSE](LICENSE) for details.
