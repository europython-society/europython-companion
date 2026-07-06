import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { stackConfigs, StackConfigKey, StackScreenConfig } from "./stackConfigs";

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

export const builtStacks = {} as Record<StackConfigKey, React.ComponentType<any>>;
(Object.keys(stackConfigs) as StackConfigKey[]).forEach((key) => {
  builtStacks[key] = makeStackNavigator(stackConfigs[key].screens);
});
