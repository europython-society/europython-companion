export type NeedToKnowCard = {
  title: string;
  lines: string[];
  actions?: { key: string; label: string }[];
};

export const needToKnow: NeedToKnowCard[] = [
  {
    title: "Wi‑Fi Info",
    lines: ["SSID: TBD", "Password: TBD"],
  },
  {
    title: "Help and support",
    lines: [
      "Look for volunteers wearing a yellow t-shirt around the venue.",
      "Come to the debugging desk at the registration area for help with any issues. or to chat...",
    ],
  },
  {
    title: "Code of Conduct",
    lines: [
      "Please read the EuroPython Code of Conduct before attending.",
      "For urgent safety concerns, please come to the registration area or contact a CoC team member.",
      "For emergencies call 112 directly.",
    ],
    actions: [
      { key: "openCoC", label: "View CoC" },
      { key: "openCoCContacts", label: "View contacts" },
    ],
  },
];
