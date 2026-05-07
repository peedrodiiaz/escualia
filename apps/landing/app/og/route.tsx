import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0a0f1e",
          padding: "80px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Top: logo + tagline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            {/* Logo mark — outer E frame + inner 2-curve + arrow */}
            <svg width="52" height="48" viewBox="0 0 220 200" fill="none">
              <path d="M 196 17 H 48 Q 17 17 17 48 V 152 Q 17 183 48 183 H 196"
                stroke="white" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M 196 57 H 107 Q 58 57 58 100 Q 58 143 107 143 H 179"
                stroke="white" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M 153 118 L 179 143 L 153 168"
                stroke="white" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontSize: "36px", fontWeight: "800", color: "white", letterSpacing: "-0.5px" }}>
              Escualia
            </span>
          </div>

          <span
            style={{
              fontSize: "13px",
              fontWeight: "600",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "#3b82f6",
            }}
          >
            Software para autoescuelas españolas
          </span>
        </div>

        {/* Center: headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <h1
            style={{
              fontSize: "72px",
              fontWeight: "800",
              color: "white",
              lineHeight: "1.05",
              letterSpacing: "-2px",
              margin: "0",
            }}
          >
            Recupera 8 horas{" "}
            <span style={{ color: "#3b82f6" }}>cada semana.</span>
          </h1>
          <p
            style={{
              fontSize: "26px",
              color: "rgba(255,255,255,0.55)",
              margin: "0",
              fontWeight: "400",
              lineHeight: "1.4",
            }}
          >
            Gestiona alumnos, agenda, facturación y tests DGT{" "}
            desde un solo lugar.
          </p>
        </div>

        {/* Bottom: stats */}
        <div
          style={{
            display: "flex",
            gap: "48px",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: "40px",
          }}
        >
          {[
            { value: "47+", label: "Autoescuelas" },
            { value: "8h", label: "Ahorradas/semana" },
            { value: "€800", label: "Recuperados/mes" },
          ].map(({ value, label }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "36px", fontWeight: "800", color: "white" }}>
                {value}
              </span>
              <span style={{ fontSize: "16px", color: "rgba(255,255,255,0.4)", fontWeight: "500" }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
