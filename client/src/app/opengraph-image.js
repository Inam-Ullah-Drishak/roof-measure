import { ImageResponse } from "next/og";
import { site, pricing } from "@/config/site";

// Preview image shown when the site is shared on social media and messaging apps.
// Generated at build time; it updates automatically when site.js changes.
export const alt = `${site.name}: ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fromPrice = Math.min(...pricing.reportTypes.map((r) => r.price));

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #0a1433 0%, #0f1f4d 60%, #1d41b5 100%)",
          padding: "64px 72px",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        {/* Left: brand and message */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 640 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <svg width="64" height="64" viewBox="0 0 40 40">
              <rect width="40" height="40" rx="9" fill="#2553e0" />
              <path d="M8 22 20 11l12 11" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 20v9h16v-9" fill="none" stroke="white" strokeWidth="3" strokeLinejoin="round" />
              <path d="M9 33h22" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" />
            </svg>
            <span style={{ fontSize: 38, fontWeight: 700 }}>{site.name}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.1 }}>Aerial roof measurements,</span>
            <span style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.1, color: "#fbb040" }}>without the ladder</span>
            <span style={{ marginTop: 24, fontSize: 28, color: "#cbd5e1" }}>
              Accurate reports in PDF, ESX, XML and DXF
            </span>
          </div>

          <div style={{ display: "flex" }}>
            <span
              style={{
                background: "#f59e0b",
                color: "#0a1433",
                fontSize: 28,
                fontWeight: 700,
                padding: "12px 28px",
                borderRadius: 999,
              }}
            >
              Reports from ${fromPrice}
            </span>
          </div>
        </div>

        {/* Right: measured hip roof, like the diagram in a report */}
        <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "flex-end" }}>
          <div style={{ display: "flex", position: "relative", width: 440, height: 330 }}>
            <svg width="440" height="330" viewBox="30 30 420 290" style={{ position: "absolute", top: 0, left: 0 }}>
              <line x1="70" y1="60" x2="410" y2="60" stroke="#94a3b8" strokeWidth="2" strokeDasharray="6 6" />
              <line x1="440" y1="90" x2="440" y2="250" stroke="#94a3b8" strokeWidth="2" strokeDasharray="6 6" />
              <g stroke="#93b4fd" strokeWidth="2.5" strokeLinejoin="round">
                <polygon points="70,90 410,90 330,170 150,170" fill="#3b6ff6" fillOpacity="0.45" />
                <polygon points="70,90 150,170 70,250" fill="#3b6ff6" fillOpacity="0.3" />
                <polygon points="410,90 410,250 330,170" fill="#3b6ff6" fillOpacity="0.3" />
                <polygon points="70,250 150,170 330,170 410,250" fill="#3b6ff6" fillOpacity="0.38" />
              </g>
              <line x1="150" y1="170" x2="330" y2="170" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
            </svg>
            <span style={{ position: "absolute", top: 2, left: 150, fontSize: 20, color: "#cbd5e1" }}>{"Eave 42' 6\""}</span>
            <span style={{ position: "absolute", top: 108, left: 170, fontSize: 20, color: "#fbb040" }}>{"Ridge 22' 3\""}</span>
            <span style={{ position: "absolute", top: 60, left: 180, fontSize: 22, color: "white" }}>A · 8/12</span>
            <span style={{ position: "absolute", top: 190, left: 180, fontSize: 22, color: "white" }}>D · 8/12</span>
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 20,
                display: "flex",
                flexDirection: "column",
                background: "white",
                color: "#0f172a",
                padding: "14px 20px",
                borderRadius: 14,
              }}
            >
              <span style={{ fontSize: 16, color: "#64748b" }}>TOTAL ROOF AREA</span>
              <span style={{ fontSize: 30 }}>2,846 sq ft</span>
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
