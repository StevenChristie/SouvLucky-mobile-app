import { Platform, type TextStyle, type ViewStyle } from "react-native";

/** Palette sampled from the splash video: parchment, Aegean blue and sea-foam sky. */
export const colors = {
  cream: "#F3EDE1",
  parchment: "#FBF8F2",
  sand: "#E9E0CE",
  ink: "#1D2A57",
  inkSoft: "#4A5478",
  muted: "#8A8FA6",
  aegean: "#40579B",
  aegeanDeep: "#2D3F7A",
  sky: "#90C0E0",
  skySoft: "#DCEAF4",
  gold: "#C5A059",
  goldSoft: "#F3E6C8",
  olive: "#6E8B4E",
  terracotta: "#D46B45",
  danger: "#C4493D",
  white: "#FFFFFF",
  line: "rgba(64, 87, 155, 0.16)",
  scrim: "rgba(18, 26, 56, 0.45)",
} as const;

export const fonts = {
  /** GFS Didot — loaded in the root layout. */
  display: "GFSDidot",
  body: Platform.select({ ios: "System", default: undefined }),
} as const;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const radius = { sm: 10, md: 16, lg: 24, xl: 32, pill: 999 } as const;

export const type = {
  hero: { fontFamily: fonts.display, fontSize: 38, lineHeight: 44, color: colors.ink },
  title: { fontFamily: fonts.display, fontSize: 30, lineHeight: 36, color: colors.ink },
  heading: { fontFamily: fonts.display, fontSize: 22, lineHeight: 28, color: colors.ink },
  body: { fontSize: 15, lineHeight: 22, color: colors.inkSoft },
  label: { fontSize: 13, fontWeight: "600", color: colors.ink },
  caption: { fontSize: 12, lineHeight: 16, color: colors.muted },
  overline: { fontSize: 11, fontWeight: "700", letterSpacing: 1.6, color: colors.aegean, textTransform: "uppercase" },
} satisfies Record<string, TextStyle>;

export const shadow = {
  soft: {
    shadowColor: colors.ink,
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  lifted: {
    shadowColor: colors.ink,
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
} satisfies Record<string, ViewStyle>;
