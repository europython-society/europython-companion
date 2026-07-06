import { useEffect, useState } from "react";
import { Platform, ImageSourcePropType } from "react-native";
import { createNativeBottomTabNavigator } from "@bottom-tabs/react-navigation";
import { Ionicons } from "@expo/vector-icons";
import type { MD3Theme } from "react-native-paper";

import { RootTabParamList, TabRouteName } from "@navigation/routes";
import { tabIconNames, tabScreens, tabSfSymbols } from "@navigation/stackConfigs";
import { builtStacks } from "@navigation/stacks";

const Tab = createNativeBottomTabNavigator<RootTabParamList>();

// Native tabs can't render React components as icons (unlike JS tabs), so
// Android/web icons must be resolved to image sources up front. iOS uses SF
// Symbols instead, which need no async resolution.
async function resolveAndroidIcons(): Promise<Record<TabRouteName, ImageSourcePropType>> {
  const entries = await Promise.all(
    (Object.keys(tabIconNames) as TabRouteName[]).map(async (route) => {
      // Color is rendered as a template image and re-tinted natively per
      // active/inactive state, so the exact value passed here doesn't matter.
      const source = await Ionicons.getImageSource(tabIconNames[route], 24, "black");
      return [route, source as ImageSourcePropType] as const;
    }),
  );
  return Object.fromEntries(entries) as Record<TabRouteName, ImageSourcePropType>;
}

export function AppTabs({ theme }: { theme: MD3Theme }) {
  const [androidIcons, setAndroidIcons] = useState<Record<
    TabRouteName,
    ImageSourcePropType
  > | null>(
    Platform.OS === "ios" ? ({} as Record<TabRouteName, ImageSourcePropType>) : null,
  );

  useEffect(() => {
    if (Platform.OS === "ios") return;
    let cancelled = false;
    resolveAndroidIcons().then((icons) => {
      if (!cancelled) setAndroidIcons(icons);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!androidIcons) {
    return null;
  }

  return (
    <Tab.Navigator
      labeled
      tabBarActiveTintColor={theme.colors.primary}
      tabBarInactiveTintColor={theme.colors.onSurfaceVariant}
      tabBarStyle={{ backgroundColor: theme.colors.surface }}
      screenOptions={({ route }) => ({
        tabBarIcon: () =>
          Platform.OS === "ios"
            ? { sfSymbol: tabSfSymbols[route.name as TabRouteName] }
            : androidIcons[route.name as TabRouteName],
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
  );
}

export default AppTabs;
