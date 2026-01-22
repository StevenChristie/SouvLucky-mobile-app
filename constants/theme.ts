import { Platform } from "react-native";

// SouvLucky Brand Identity
const souvLuckyBlue = "#003366";
const rewardOrange = "#E67E22";
const progressCyan = "#00bfff";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: souvLuckyBlue,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: souvLuckyBlue,
    // Branded Elements
    brandPrimary: souvLuckyBlue,
    brandSecondary: rewardOrange,
    accent: progressCyan,
    surface: "rgba(255, 255, 255, 0.92)",
    border: "rgba(255, 255, 255, 0.3)",
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: "#fff",
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#fff",
    brandPrimary: "#4d94ff",
    brandSecondary: rewardOrange,
    accent: progressCyan,
    surface: "rgba(21, 23, 24, 0.92)",
    border: "rgba(255, 255, 255, 0.1)",
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
