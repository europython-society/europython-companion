import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import type { Theme as NavTheme } from "@react-navigation/native";
import { PaperProvider, MD3Theme } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Notifications from "expo-notifications";

import "@utils/webAlertPolyfill";
import { SettingsProvider, useSettings } from "@store/settings";
import navigationRef from "@navigation/navigationRef";
import { AppTabs } from "@navigation/AppTabs";
import { builtStacks } from "@navigation/stacks";
import { ConferenceDataProvider } from "@store/conferenceData";
import { FavoritesProvider } from "@store/favorites";
import { useScheduleNotifications } from "@hooks/useScheduleNotifications";
import { useNotificationDeepLink } from "@hooks/useNotificationDeepLink";
import { useUrlDeepLink } from "@hooks/useUrlDeepLink";
import { useAppNavTheme } from "@hooks/useAppNavTheme";
import { usePwaInstallPrompt } from "@hooks/usePwaInstallPrompt";
import InstallPrompt from "@components/status/InstallPrompt";

function ScheduleNotificationManager() {
  useScheduleNotifications();
  return null;
}

function UrlDeepLinkManager() {
  useUrlDeepLink();
  return null;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function AppContent() {
  const { conferenceYear, themeMode, onboardingSeen, hydrated } = useSettings();
  const { paperTheme: activePaperTheme, navTheme } = useAppNavTheme(themeMode);
  const { onNavReady } = useNotificationDeepLink();
  const pwaInstallPrompt = usePwaInstallPrompt();

  if (!hydrated) {
    return null;
  }

  const OnboardingStackNavigator = builtStacks.onboarding;

  if (!onboardingSeen) {
    return (
      <AppScaffold theme={activePaperTheme} navTheme={navTheme} onNavReady={onNavReady}>
        <OnboardingStackNavigator />
      </AppScaffold>
    );
  }

  return (
    <AppScaffold theme={activePaperTheme} navTheme={navTheme} onNavReady={onNavReady}>
      <ConferenceDataProvider year={conferenceYear}>
        <FavoritesProvider year={conferenceYear}>
          <ScheduleNotificationManager />
          <UrlDeepLinkManager />
          <InstallPrompt {...pwaInstallPrompt} />
          <AppTabs theme={activePaperTheme} />
        </FavoritesProvider>
      </ConferenceDataProvider>
    </AppScaffold>
  );
}

export default function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}

function AppScaffold({
  children,
  theme,
  navTheme,
  onNavReady,
}: {
  children: React.ReactNode;
  theme: MD3Theme;
  navTheme: NavTheme;
  onNavReady: () => void;
}) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <SafeAreaProvider>
          <NavigationContainer theme={navTheme} ref={navigationRef} onReady={onNavReady}>
            {children}
          </NavigationContainer>
        </SafeAreaProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
