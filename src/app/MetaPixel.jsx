"use client";
import { useEffect, useState } from "react";
import {
  pixelEnabled,
  getConsent,
  grantConsent,
  denyConsent,
  loadPixel,
} from "../lib/metaPixel";

// Cookie-/consent-banner + Meta Pixel bootstrap.
// Rendert NIETS zolang NEXT_PUBLIC_META_PIXEL_ID niet gezet is.
export default function MetaPixel() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!pixelEnabled()) return; // volledig dormant
    const choice = getConsent();
    if (choice === "granted") {
      grantConsent(); // pixel laden + PageView
    } else if (choice === "denied") {
      // niets doen
    } else {
      loadPixel(); // base laden (revoked) + banner tonen
      setShow(true);
    }
  }, []);

  if (!pixelEnabled() || !show) return null;

  const accept = () => {
    grantConsent();
    setShow(false);
  };
  const decline = () => {
    denyConsent();
    setShow(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie-toestemming"
      style={{
        position: "fixed",
        left: "16px",
        right: "16px",
        bottom: "16px",
        zIndex: 9999,
        maxWidth: "560px",
        margin: "0 auto",
        background: "#18181b",
        border: "1px solid #27272a",
        borderRadius: "16px",
        padding: "18px 20px",
        boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div
        style={{
          fontSize: "14px",
          lineHeight: 1.6,
          color: "#e4e4e7",
          marginBottom: "14px",
        }}
      >
        We gebruiken cookies om onze scan te verbeteren en om te meten welke
        advertenties mensen met klachten bereiken. Akkoord?
      </div>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button
          onClick={accept}
          style={{
            flex: "1 1 auto",
            minWidth: "120px",
            background: "#f97316",
            color: "#0a0a0a",
            border: "none",
            borderRadius: "10px",
            padding: "12px 18px",
            fontSize: "14px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Accepteren
        </button>
        <button
          onClick={decline}
          style={{
            flex: "0 0 auto",
            background: "transparent",
            color: "#a1a1aa",
            border: "1px solid #27272a",
            borderRadius: "10px",
            padding: "12px 18px",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Alleen noodzakelijk
        </button>
      </div>
    </div>
  );
}
