import { ImageResponse } from "next/og";
export const alt =
  "Sourasis Karak — Build it. Question it. Make it worth trusting.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "#faf9f6",
        color: "#262824",
        padding: "64px 80px",
        borderBottom: "2px solid #294c9b",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 18,
          letterSpacing: 0,
          color: "#6d7168",
        }}
      >
        <span>A PERSONAL WEBSITE</span>
        <span>KOLKATA, INDIA</span>
      </div>
      <div
        style={{
          fontFamily: "serif",
          fontSize: 96,
          marginTop: 80,
          letterSpacing: -2,
        }}
      >
        Sourasis Karak.
      </div>
      <div style={{ fontSize: 29, color: "#294c9b", marginTop: 20 }}>
        Build it. Question it. Make it worth trusting.
      </div>
      <div style={{ fontSize: 20, marginTop: 80, color: "#6d7168" }}>
        Machine learning · Scientific agents · Evaluation tooling
      </div>
    </div>,
    size,
  );
}
