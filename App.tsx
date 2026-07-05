import React, { useEffect } from "react";
import {
  NavigationContainer,
  DefaultTheme as NavDefaultTheme,
  DarkTheme as NavDarkTheme,
} from "@react-navigation/native";
import type { Theme as NavTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { PaperProvider, MD3Theme } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useColorScheme } from "react-native";
import * as Notifications from "expo-notifications";

import { colors, createPaperTheme } from "@theme";
import { SettingsProvider, useSettings } from "@store/settings";
import navigationRef from "@navigation/navigationRef";
import {
  RootTabParamList,
  SharedRoutes,
  TabRouteName,
  TabRoutes,
} from "@navigation/routes";
import {
  stackConfigs,
  StackConfigKey,
  StackScreenConfig,
  tabIconNames,
  tabScreens,
} from "@navigation/stackConfigs";
import { ConferenceDataProvider } from "@store/conferenceData";
import { FavoritesProvider } from "@store/favorites";
import { useScheduleNotifications } from "@hooks/useScheduleNotifications";

let pendingNotificationSession: string | null = null;
const stackScreenOptions = { headerShown: false };

function makeStackNavigator<ParamList extends Record<string, object | undefined>>(
  screens: StackScreenConfig<ParamList>[],
) {
  const Stack = createNativeStackNavigator<ParamList>();
  return function StackNavigator() {
    return (
      <Stack.Navigator screenOptions={stackScreenOptions}>
        {screens.map((screen) => (
          <Stack.Screen key={String(screen.name)} {...screen} />
        ))}
      </Stack.Navigator>
    );
  };
}

const builtStacks = {} as Record<StackConfigKey, React.ComponentType<any>>;
(Object.keys(stackConfigs) as StackConfigKey[]).forEach((key) => {
  builtStacks[key] = makeStackNavigator(stackConfigs[key].screens);
});

const Tab = createBottomTabNavigator<RootTabParamList>();

function ScheduleNotificationManager() {
  useScheduleNotifications();
  return null;
}

function navigateToSessionFromNotification(sessionId: string) {
  const go = () => {
    navigationRef.navigate(TabRoutes.Schedule);
    setTimeout(() => {
      navigationRef.navigate(TabRoutes.Schedule, {
        screen: SharedRoutes.SessionDetail,
        params: { sessionId },
      });
    }, 0);
  };

  if (navigationRef.isReady()) {
    go();
    pendingNotificationSession = null;
    return;
  }
  pendingNotificationSession = sessionId;
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
  const systemScheme = useColorScheme();
  const effectiveMode = themeMode === "system" ? (systemScheme ?? "light") : themeMode;
  const activePaperTheme = createPaperTheme(effectiveMode === "dark" ? "dark" : effectiveMode === "light" ? "light" : "night");
  const navBase = effectiveMode === "dark" || effectiveMode === "night" ? NavDarkTheme : NavDefaultTheme;
  const navTheme = {
    ...navBase,
    colors: {
      ...navBase.colors,
      background: activePaperTheme.colors?.background ?? navBase.colors.background,
      card: activePaperTheme.colors?.surface ?? navBase.colors.card,
      primary: activePaperTheme.colors?.primary ?? navBase.colors.primary,
      text: activePaperTheme.colors?.onSurface ?? navBase.colors.text,
      border: activePaperTheme.colors?.outline ?? navBase.colors.border,
      notification: navBase.colors.notification,
    },
  };

  useEffect(() => {
    const handleResponse = (response: Notifications.NotificationResponse) => {
      const data = response?.notification?.request?.content?.data as {
        sessionId?: unknown;
      };
      const sessionId =
        typeof data?.sessionId === "string"
          ? data.sessionId
          : data?.sessionId?.toString();
      if (sessionId) {
        navigateToSessionFromNotification(sessionId);
      }
    };

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        handleResponse(response);
      }
    });

    const subscription =
      Notifications.addNotificationResponseReceivedListener(handleResponse);
    return () => subscription.remove();
  }, []);

  if (!hydrated) {
    return null;
  }

  const OnboardingStackNavigator = builtStacks.onboarding;

  if (!onboardingSeen) {
    return (
      <AppScaffold theme={activePaperTheme} navTheme={navTheme}>
        <OnboardingStackNavigator />
      </AppScaffold>
    );
  }

  return (
    <AppScaffold theme={activePaperTheme} navTheme={navTheme}>
      <ConferenceDataProvider year={conferenceYear}>
        <FavoritesProvider year={conferenceYear}>
          <ScheduleNotificationManager />
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarActiveTintColor: activePaperTheme.colors?.primary ?? colors.primary,
              tabBarInactiveTintColor:
                activePaperTheme.colors?.onSurfaceVariant ?? colors.textMuted,
              tabBarStyle: {
                backgroundColor: activePaperTheme.colors?.surface ?? colors.surface,
                borderTopColor: activePaperTheme.colors?.outline ?? colors.border,
              },
              tabBarLabelStyle: {
                fontSize: 12,
              },
              tabBarIcon: ({ color, size }) => {
                const iconName = tabIconNames[route.name as TabRouteName];
                return <Ionicons name={iconName} size={size} color={color} />;
              },
            })}
          >
            {tabScreens.map((tab) => (
              <Tab.Screen
                key={tab.name}
                name={tab.name}
                component={builtStacks[tab.stackKey]}
                options={{ title: tab.title }}
              />
            ))}
          </Tab.Navigator>
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

function handleNavReady() {
  if (pendingNotificationSession) {
    navigateToSessionFromNotification(pendingNotificationSession);
  }
}

function AppScaffold({
  children,
  theme,
  navTheme,
}: {
  children: React.ReactNode;
  theme: MD3Theme;
  navTheme: NavTheme;
}) {
  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <NavigationContainer
          theme={navTheme}
          ref={navigationRef}
          onReady={handleNavReady}
        >
          {children}
        </NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>
  );
}
