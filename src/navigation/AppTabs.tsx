import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import type { MD3Theme } from "react-native-paper";

import { RootTabParamList, TabRouteName } from "@navigation/routes";
import { tabIconNames, tabScreens } from "@navigation/stackConfigs";
import { builtStacks } from "@navigation/stacks";

const Tab = createBottomTabNavigator<RootTabParamList>();

export function AppTabs({ theme }: { theme: MD3Theme }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
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
  );
}

export default AppTabs;
