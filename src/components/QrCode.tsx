import createQr from "qrcode-generator";
import { memo, useMemo } from "react";
import { View } from "react-native";

import { colors } from "@/theme";

/**
 * A scannable QR code drawn with plain Views (no SVG dependency). Each row merges runs of dark
 * modules into one View, so a typical code is a few hundred small rectangles.
 */
export const QrCode = memo(function QrCode({ value, size = 220, color = colors.ink }: { value: string; size?: number; color?: string }) {
  const rows = useMemo(() => {
    const qr = createQr(0, "M");
    qr.addData(value);
    qr.make();
    const n = qr.getModuleCount();
    const out: { start: number; length: number }[][] = [];
    for (let r = 0; r < n; r++) {
      const runs: { start: number; length: number }[] = [];
      let c = 0;
      while (c < n) {
        if (!qr.isDark(r, c)) {
          c++;
          continue;
        }
        const start = c;
        while (c < n && qr.isDark(r, c)) c++;
        runs.push({ start, length: c - start });
      }
      out.push(runs);
    }
    return { n, rows: out };
  }, [value]);

  // A quiet zone of 2 modules around the code helps scanners lock on.
  const cell = size / (rows.n + 4);
  return (
    <View style={{ width: size, height: size, backgroundColor: colors.white, padding: cell * 2 }} accessibilityLabel="Your member QR code">
      {rows.rows.map((runs, r) => (
        <View key={r} style={{ height: cell, flexDirection: "row" }}>
          {runs.map(({ start, length }) => (
            <View key={start} style={{ position: "absolute", left: start * cell, width: length * cell + 0.5, height: cell + 0.5, backgroundColor: color }} />
          ))}
        </View>
      ))}
    </View>
  );
});
