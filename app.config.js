// Build-time only: read by the Expo CLI/Node while resolving config, never
// shipped into src/ or the client bundle. Defaults to root; deploy-web.yaml
// sets WEB_BASE_URL=/europython-companion for the GitHub Pages build.
const baseUrl = process.env.WEB_BASE_URL ?? "";

// Kept in sync manually with CONFERENCE_YEARS in src/config/conference.ts
const CONFERENCE_YEARS = [2026, 2025, 2024, 2023, 2022];
const deepLinkHosts = CONFERENCE_YEARS.map((year) => `ep${year}.europython.eu`);

module.exports = {
  expo: {
    name: "EuroPython",
    slug: "europython-companion",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    ios: {
      icon: "./assets/icon-ios.png",
      supportsTablet: true,
      bundleIdentifier: "eu.europython.companion",
      infoPlist: {
        NSCalendarsUsageDescription:
          "Allow EuroPython Companion to add sessions to your calendar.",
      },
      associatedDomains: deepLinkHosts.map((host) => `applinks:${host}`),
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/icon-adaptive.png",
        backgroundColor: "#001B31",
      },
      predictiveBackGestureEnabled: false,
      permissions: ["READ_CALENDAR", "WRITE_CALENDAR"],
      package: "eu.europython.companion",
      intentFilters: [
        {
          action: "VIEW",
          autoVerify: true,
          category: ["BROWSABLE", "DEFAULT"],
          data: deepLinkHosts.flatMap((host) => [
            { scheme: "https", host, pathPrefix: "/session" },
            { scheme: "https", host, pathPrefix: "/speaker" },
            { scheme: "https", host, path: "/schedule" },
          ]),
        },
      ],
    },
    web: {
      favicon: "./assets/icon.png",
      name: "EuroPython",
      description: "Your companion for the EuroPython in your pocket.",
      themeColor: "#001B31",
    },
    experiments: {
      baseUrl,
    },
    plugins: [
      "expo-notifications",
      "expo-font",
      "expo-calendar",
      "expo-system-ui",
      "expo-status-bar",
      "expo-image",
      [
        "expo-splash-screen",
        {
          image: "./assets/icon.png",
          resizeMode: "contain",
          backgroundColor: "#001B31",
        },
      ],
    ],
  },
};
