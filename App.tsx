import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import type { Theme as NavTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { PaperProvider, MD3Theme } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";

import { colors } from "@theme";
import { SettingsProvider, useSettings } from "@store/settings";
import navigationRef from "@navigation/navigationRef";
import { RootTabParamList, TabRouteName } from "@navigation/routes";
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
import { useNotificationDeepLink } from "@hooks/useNotificationDeepLink";
import { useAppNavTheme } from "@hooks/useAppNavTheme";

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
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <NavigationContainer theme={navTheme} ref={navigationRef} onReady={onNavReady}>
          {children}
        </NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>
  );
}
