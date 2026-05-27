import { ImageResponse } from "next/og";

export const alt = "Basecamp & Co. — Rent Gear, Camp in Style";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#F9F6F0",
          padding: "84px",
          fontFamily: "serif",
          border: "16px solid #EAE5D8",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#9C8B6E",
          }}
        >
          Taiwan Gear Rental
        </div>

        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
          <div style={{ display: "flex", fontSize: 132, color: "#1E1C18" }}>
            Camp in
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 132,
              color: "#9C8B6E",
              fontStyle: "italic",
            }}
          >
            Style.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            color: "#5C5850",
            fontSize: 30,
          }}
        >
          <span style={{ display: "flex", fontSize: 36, color: "#1E1C18" }}>
            {"Basecamp & Co."}
          </span>
          <span style={{ display: "flex" }}>Glamping gear, delivered.</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
