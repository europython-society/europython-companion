import { NavigatorScreenParams } from "@react-navigation/native";

export const TabRoutes = {
  Home: "HomeTab",
  Schedule: "ScheduleTab",
  Speakers: "SpeakersTab",
  Agenda: "AgendaTab",
  Settings: "SettingsTab",
} as const;

export const SharedRoutes = {
  SessionDetail: "SessionDetail",
  SpeakerDetail: "SpeakerDetail",
} as const;

export const HomeStackRoutes = {
  Home: "HomeMain",
  CoC: "CoC",
  CoCContacts: "CoCContacts",
  SessionDetail: SharedRoutes.SessionDetail,
  SpeakerDetail: SharedRoutes.SpeakerDetail,
} as const;

export const ScheduleStackRoutes = {
  Schedule: "ScheduleMain",
  SessionDetail: SharedRoutes.SessionDetail,
  SpeakerDetail: SharedRoutes.SpeakerDetail,
} as const;

export const SpeakersStackRoutes = {
  Speakers: "SpeakersMain",
  SessionDetail: SharedRoutes.SessionDetail,
  SpeakerDetail: SharedRoutes.SpeakerDetail,
} as const;

export const AgendaStackRoutes = {
  Agenda: "AgendaMain",
  SessionDetail: SharedRoutes.SessionDetail,
  SpeakerDetail: SharedRoutes.SpeakerDetail,
} as const;

export const SettingsStackRoutes = {
  Settings: "SettingsMain",
  NotificationsList: "NotificationsList",
} as const;

export const OnboardingStackRoutes = {
  Onboarding: "Onboarding",
} as const;

export type SessionDetailParams = { sessionId: string };
export type SpeakerDetailParams = { speakerId: string };

export type HomeStackParamList = {
  [HomeStackRoutes.Home]: undefined;
  [HomeStackRoutes.CoC]: undefined;
  [HomeStackRoutes.CoCContacts]: undefined;
  [HomeStackRoutes.SessionDetail]: SessionDetailParams;
  [HomeStackRoutes.SpeakerDetail]: SpeakerDetailParams;
};

export type ScheduleStackParamList = {
  [ScheduleStackRoutes.Schedule]: undefined;
  [ScheduleStackRoutes.SessionDetail]: SessionDetailParams;
  [ScheduleStackRoutes.SpeakerDetail]: SpeakerDetailParams;
};

export type SpeakersStackParamList = {
  [SpeakersStackRoutes.Speakers]: undefined;
  [SpeakersStackRoutes.SessionDetail]: SessionDetailParams;
  [SpeakersStackRoutes.SpeakerDetail]: SpeakerDetailParams;
};

export type AgendaStackParamList = {
  [AgendaStackRoutes.Agenda]: undefined;
  [AgendaStackRoutes.SessionDetail]: SessionDetailParams;
  [AgendaStackRoutes.SpeakerDetail]: SpeakerDetailParams;
};

export type SettingsStackParamList = {
  [SettingsStackRoutes.Settings]: undefined;
  [SettingsStackRoutes.NotificationsList]: undefined;
};

export type OnboardingStackParamList = {
  [OnboardingStackRoutes.Onboarding]: undefined;
};

export type RootTabParamList = {
  [TabRoutes.Home]: NavigatorScreenParams<HomeStackParamList> | undefined;
  [TabRoutes.Schedule]: NavigatorScreenParams<ScheduleStackParamList> | undefined;
  [TabRoutes.Speakers]: NavigatorScreenParams<SpeakersStackParamList> | undefined;
  [TabRoutes.Agenda]: NavigatorScreenParams<AgendaStackParamList> | undefined;
  [TabRoutes.Settings]: NavigatorScreenParams<SettingsStackParamList> | undefined;
};

export type TabRouteName = (typeof TabRoutes)[keyof typeof TabRoutes];
export type CombinedParamList = RootTabParamList &
  HomeStackParamList &
  ScheduleStackParamList &
  SpeakersStackParamList &
  AgendaStackParamList &
  SettingsStackParamList &
  OnboardingStackParamList;
