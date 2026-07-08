import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useWindowDimensions } from "react-native";
import type { MD3Theme } from "react-native-paper";

import { RootTabParamList, TabRouteName } from "@navigation/routes";
import { tabIconNames, tabScreens } from "@navigation/stackConfigs";
import { builtStacks } from "@navigation/stacks";

const Tab = createBottomTabNavigator<RootTabParamList>();

export function AppTabs({ theme }: { theme: MD3Theme }) {
  const { width } = useWindowDimensions();
  const isNarrowScreen = width < 768;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
          height: isNarrowScreen ? 55 : undefined,
        },
        tabBarLabelStyle: {
          fontSize: theme.fonts.labelMedium.fontSize,
          lineHeight: theme.fonts.labelMedium.lineHeight,
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
  );
}

export default AppTabs;
