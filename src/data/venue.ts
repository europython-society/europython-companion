export type VenueImage = {
  source: number;
  accessibilityLabel: string;
  caption?: string;
};

export type VenueFloor = {
  floor: string;
  rooms: string[];
};

export type VenueView = {
  key: string;
  label: string;
  images?: VenueImage[];
  floors?: VenueFloor[];
  lines?: string[];
};

export const venueViews: VenueView[] = [
  {
    key: "rooms",
    label: "Rooms",
    lines: [
      "ICE Kraków Congress Centre, Marii Konopnickiej 17, Kraków.",
      "Four lifts in the foyer reach every level and the underground car park. Accessible toilets are available on every floor.",
    ],
    floors: [
      {
        floor: "Ground floor (Foyer L0)",
        rooms: [
          "Registration",
          "Exhibit Hall",
          "Conference room F0 (Glass room)",
          "Cloakroom",
          "First aid room",
        ],
      },
      {
        floor: "Level 2 (Foyer L2)",
        rooms: [
          "F2 Fishbowl room",
          "Rooms 2.017 / 2.018",
          "Red VIP F2 — low-stimulation room",
          "Dressing Room 206 — prayer / meditation room",
        ],
      },
      {
        floor: "Level 3",
        rooms: [
          "S1 — Auditorium Hall",
          "S2 — Theatre Hall",
          "S3A / S3B — Chamber Hall",
          "S4, S4A, S4B — Conference Hall Complex",
          "S4(12) — Quiet room",
        ],
      },
    ],
  },
  {
    key: "entrances",
    label: "Entrances",
    lines: [
      "Tutorial days (Mon–Tue): use Entrance #3 on the West side, off Bułhaka Street, opposite the Park Inn Hotel. It's wheelchair accessible, with ground-floor registration and lifts on the left to level 3.",
      "Conference days (Wed–Fri): use the main entrance off Barska Street. It has no exterior steps or thresholds, with a photo-cell activated door beside the revolving doors.",
    ],
    images: [
      {
        source: require("../../assets/venue/tutorial-entrance.webp"),
        accessibilityLabel:
          "Map showing accessible Entrance number 3 on the West side of ICE Kraków, off Bułhaka Street, opposite the Park Inn Hotel — used on tutorial days.",
        caption: "Tutorial days entrance (#3, Bułhaka Street)",
      },
      {
        source: require("../../assets/venue/main-entrance.webp"),
        accessibilityLabel:
          "Map showing the accessible main entrance off Barska Street, step-free with a photo-cell activated door beside the revolving doors — used on conference days.",
        caption: "Conference days main entrance (Barska Street)",
      },
    ],
  },
  {
    key: "quietRoom",
    label: "Quiet room",
    lines: [
      "The quiet room (S4(12)) is on level 3, for anyone who needs a break from noise and stimulation.",
    ],
    images: [
      {
        source: require("../../assets/venue/quiet-room-floor3.webp"),
        accessibilityLabel: "Floor 3 map showing the location of the quiet room, S4(12).",
        caption: "Quiet room location — level 3",
      },
      {
        source: require("../../assets/venue/quiet-room-s4-12.webp"),
        accessibilityLabel: "Detailed map of room S4(12), the quiet room.",
        caption: "Quiet room detail — S4(12)",
      },
    ],
  },
  {
    key: "accessibility",
    label: "Accessibility",
    lines: [
      "Quiet room S4(12), level 3 — for work or rest away from noise.",
      "Red VIP F2, level 2 — a low-stimulation empty room.",
      "Dressing Room 206, level 2 — for prayer or meditation.",
      "Accessible toilets on every floor; ground floor has larger cabins, lower wash basins, and period products.",
      "Neurodiversity bags with fidget items available at the Info Desk.",
      "Free childcare during the main conference (Mon–Fri). No restrictions on where you can breastfeed.",
      "Dietary needs: allergens are marked and menus are provided daily.",
      "No captioning is available. No interpreters unless pre-arranged. No hearing aid induction loops (live streams have a delay).",
      "Questions? Email accessibility@europython.eu or ask a volunteer.",
    ],
  },
];

export const ACCESSIBILITY_EMAIL = "accessibility@europython.eu";
