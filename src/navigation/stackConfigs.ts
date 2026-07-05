import { Ionicons } from "@expo/vector-icons";

import {
  AgendaStackParamList,
  AgendaStackRoutes,
  HomeStackParamList,
  HomeStackRoutes,
  OnboardingStackParamList,
  OnboardingStackRoutes,
  ScheduleStackParamList,
  ScheduleStackRoutes,
  SettingsStackParamList,
  SettingsStackRoutes,
  SharedRoutes,
  SpeakersStackParamList,
  SpeakersStackRoutes,
  TabRouteName,
  TabRoutes,
} from "./routes";
import HomeScreen from "@screens/HomeScreen";
import CoCScreen from "@screens/CoCScreen";
import CoCContactsScreen from "@screens/CoCContactsScreen";
import SessionDetailScreen from "@screens/SessionDetailScreen";
import SpeakerDetailScreen from "@screens/SpeakerDetailScreen";
import ScheduleScreen from "@screens/ScheduleScreen";
import SpeakersScreen from "@screens/SpeakersScreen";
import MyAgendaScreen from "@screens/FavoritesScreen";
import SettingsScreen from "@screens/SettingsScreen";
import NotificationsScreen from "@screens/NotificationsScreen";
import OnboardingScreen from "@screens/OnboardingScreen";

export type StackScreenConfig<ParamList extends Record<string, object | undefined>> = {
  name: keyof ParamList;
  component: React.ComponentType<any>;
  options?: any;
};

export const tabIconNames: Record<TabRouteName, keyof typeof Ionicons.glyphMap> = {
  [TabRoutes.Home]: "home-outline",
  [TabRoutes.Schedule]: "calendar-outline",
  [TabRoutes.Speakers]: "people-outline",
  [TabRoutes.Agenda]: "star-outline",
  [TabRoutes.Settings]: "settings-outline",
};

export type TabScreenConfig = {
  name: TabRouteName;
  stackKey: "home" | "schedule" | "speakers" | "agenda" | "settings";
  title: string;
};

export const stackConfigs = {
  home: {
    screens: [
      { name: HomeStackRoutes.Home, component: HomeScreen, options: { title: "Home" } },
      {
        name: SharedRoutes.SessionDetail,
        component: SessionDetailScreen,
        options: { title: "Session" },
      },
      {
        name: SharedRoutes.SpeakerDetail,
        component: SpeakerDetailScreen,
        options: { title: "Speaker" },
      },
      {
        name: HomeStackRoutes.CoC,
        component: CoCScreen,
        options: { title: "Code of Conduct" },
      },
      {
        name: HomeStackRoutes.CoCContacts,
        component: CoCContactsScreen,
        options: { title: "CoC Contacts" },
      },
    ] satisfies StackScreenConfig<HomeStackParamList>[],
  },
  schedule: {
    screens: [
      {
        name: ScheduleStackRoutes.Schedule,
        component: ScheduleScreen,
        options: { title: "Schedule" },
      },
      {
        name: SharedRoutes.SessionDetail,
        component: SessionDetailScreen,
        options: { title: "Session" },
      },
      {
        name: SharedRoutes.SpeakerDetail,
        component: SpeakerDetailScreen,
        options: { title: "Speaker" },
      },
    ] satisfies StackScreenConfig<ScheduleStackParamList>[],
  },
  speakers: {
    screens: [
      {
        name: SpeakersStackRoutes.Speakers,
        component: SpeakersScreen,
        options: { title: "Speakers" },
      },
      {
        name: SharedRoutes.SessionDetail,
        component: SessionDetailScreen,
        options: { title: "Session" },
      },
      {
        name: SharedRoutes.SpeakerDetail,
        component: SpeakerDetailScreen,
        options: { title: "Speaker" },
      },
    ] satisfies StackScreenConfig<SpeakersStackParamList>[],
  },
  agenda: {
    screens: [
      {
        name: AgendaStackRoutes.Agenda,
        component: MyAgendaScreen,
        options: { title: "My agenda" },
      },
      {
        name: SharedRoutes.SessionDetail,
        component: SessionDetailScreen,
        options: { title: "Session" },
      },
      {
        name: SharedRoutes.SpeakerDetail,
        component: SpeakerDetailScreen,
        options: { title: "Speaker" },
      },
    ] satisfies StackScreenConfig<AgendaStackParamList>[],
  },
  settings: {
    screens: [
      {
        name: SettingsStackRoutes.Settings,
        component: SettingsScreen,
        options: { title: "Settings" },
      },
      {
        name: SettingsStackRoutes.NotificationsList,
        component: NotificationsScreen,
        options: { title: "Notifications" },
      },
    ] satisfies StackScreenConfig<SettingsStackParamList>[],
  },
  onboarding: {
    screens: [
      {
        name: OnboardingStackRoutes.Onboarding,
        component: OnboardingScreen,
      },
    ] satisfies StackScreenConfig<OnboardingStackParamList>[],
  },
} as const;

export type StackConfigKey = keyof typeof stackConfigs;

export const tabScreens: TabScreenConfig[] = [
  { name: TabRoutes.Home, stackKey: "home", title: "Home" },
  { name: TabRoutes.Schedule, stackKey: "schedule", title: "Schedule" },
  { name: TabRoutes.Speakers, stackKey: "speakers", title: "Speakers" },
  { name: TabRoutes.Agenda, stackKey: "agenda", title: "My agenda" },
  { name: TabRoutes.Settings, stackKey: "settings", title: "Settings" },
];
