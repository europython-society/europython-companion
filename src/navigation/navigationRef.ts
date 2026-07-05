import { createNavigationContainerRef } from "@react-navigation/native";

import { RootTabParamList } from "./routes";

export const navigationRef = createNavigationContainerRef<RootTabParamList>();

export default navigationRef;
