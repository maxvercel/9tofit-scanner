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

    // Embedded in de 9tofit.nl-site? Dan geldt de MARKETING-toestemming uit de
    // 9toFit-tracker-banner op de parent-pagina. We tonen GEEN eigen banner
    // (één banner, één toestemming) en luisteren naar de consent-brug.
    const embedded =
      typeof window !== "undefined" && window.parent !== window.self;

    if (embedded) {
      loadPixel(); // base laden in 'revoke' — vuurt niks tot 'grant'
      let settled = false;
      const applyGrant = () => { if (settled) return; settled = true; grantConsent(); };
      const applyDeny = () => { if (settled) return; settled = true; denyConsent(); };

      // Eerder onthouden keuze meteen respecteren.
      if (getConsent() === "granted") applyGrant();

      const onMsg = (ev) => {
        if (!/(^https:\/\/9tofit\.nl$)|(\.9tofit\.nl$)/.test(ev.origin || "")) return;
        const d = ev.data;
        if (!d || d.type !== "9tf_consent") return;
        if (d.marketing === true) applyGrant();               // pixel aan + PageView
        else if (d.choice && d.choice !== "unknown") applyDeny(); // expliciet geweigerd
      };
      window.addEventListener("message", onMsg);

      // Huidige status opvragen bij de parent (retry tegen de laad-race).
      let tries = 0;
      const ask = () => {
        try { window.parent.postMessage({ type: "9tf_request_consent" }, "*"); } catch {}
      };
      ask();
      const iv = setInterval(() => {
        if (settled || ++tries >= 6) { clearInterval(iv); return; } // 6 × 500ms = 3s
        ask();
      }, 500);

      return () => { window.removeEventListener("message", onMsg); clearInterval(iv); };
    }

    // Standalone (scanner los geopend): eigen banner als fallback.
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
