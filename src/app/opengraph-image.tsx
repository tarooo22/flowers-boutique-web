import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Flower’s Boutique — hand-tied bouquets in Tbilisi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ height: "100%", width: "100%", display: "flex", position: "relative", overflow: "hidden", background: "#fbf7ee", color: "#1a1a1a", padding: "68px" }}>
        <div style={{ position: "absolute", width: 520, height: 520, borderRadius: "50%", right: -90, top: -120, background: "#ff5a3c", opacity: 0.18 }} />
        <div style={{ position: "absolute", width: 390, height: 390, borderRadius: "50%", left: 430, bottom: -220, background: "#123f2f", opacity: 0.14 }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 5, textTransform: "uppercase", color: "#6e6e66" }}>Flower’s Boutique · Tbilisi Studio</div>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 820 }}>
            <div style={{ display: "flex", fontSize: 80, fontWeight: 600, lineHeight: 1.05 }}>Flowers for every</div>
            <div style={{ display: "flex", fontSize: 80, fontWeight: 600, lineHeight: 1.05, color: "#d13b22" }}>beautiful moment.</div>
            <div style={{ display: "flex", marginTop: 30, fontSize: 28, color: "#3a3a36" }}>Hand-tied bouquets · Delivered across Tbilisi in 90 minutes</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 22 }}>
            <span>Vazisubani · Every day 09:00–21:00</span><span style={{ color: "#123f2f", fontWeight: 700 }}>flowersboutique.co</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
