import { useSafeAreaInsets } from "react-native-safe-area-context";

export const TAB_BAR_HEIGHT = 68;

/** Bottom padding a tab screen needs so its content clears the floating tab bar. */
export function useTabBarSpace() {
  const { bottom } = useSafeAreaInsets();
  return TAB_BAR_HEIGHT + Math.max(bottom, 12) + 24;
}
