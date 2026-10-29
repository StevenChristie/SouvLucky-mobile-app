import type { Ionicons } from "@expo/vector-icons";

export const SOCIALS: { id: string; label: string; handle: string; url: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: "instagram", label: "Instagram", handle: "@_souvlucky", url: "https://www.instagram.com/_souvlucky/", icon: "logo-instagram" },
  { id: "tiktok", label: "TikTok", handle: "@souvlucky.greek.kitchen", url: "https://www.tiktok.com/@souvlucky.greek.kitchen", icon: "logo-tiktok" },
];
