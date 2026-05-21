// ============================================================
// 9toFit scanner — Meta Pixel + consent helper
// VOLLEDIG DORMANT zonder NEXT_PUBLIC_META_PIXEL_ID:
//   geen script, geen cookies, geen banner. Niets verandert.
// GDPR: pixel staat op "consent revoke" tot de gebruiker accepteert.
// ============================================================

export const PIXEL_ID =
  (typeof process !== "undefined" &&
    process.env &&
    process.env.NEXT_PUBLIC_META_PIXEL_ID) ||
  "";

const CONSENT_KEY = "9tofit_consent_v1"; // "granted" | "denied"

export function pixelEnabled() {
  return !!PIXEL_ID;
}

export function getConsent() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(CONSENT_KEY); // "granted" | "denied" | null
  } catch {
    return null;
  }
}

export function hasConsent() {
  return getConsent() === "granted";
}

function storeConsent(value) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {}
}

// Injecteer de Meta Pixel base-code (eenmalig). Standaard op "revoke".
export function loadPixel() {
  if (typeof window === "undefined" || !PIXEL_ID) return;
  if (window.fbq) return;
  /* eslint-disable */
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod
        ? n.callMethod.apply(n, arguments)
        : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(
    window,
    document,
    "script",
    "https://connect.facebook.net/en_US/fbevents.js"
  );
  /* eslint-enable */
  // GDPR-veilig: niets tracken tot expliciete toestemming.
  window.fbq("consent", "revoke");
  window.fbq("init", PIXEL_ID);
}

// Toestemming gegeven: pixel laden, consent verlenen, PageView vuren.
export function grantConsent() {
  storeConsent("granted");
  if (typeof window === "undefined" || !PIXEL_ID) return;
  loadPixel();
  if (window.fbq) {
    window.fbq("consent", "grant");
    window.fbq("track", "PageView");
  }
}

// Toestemming geweigerd: keuze onthouden, niets tracken.
export function denyConsent() {
  storeConsent("denied");
}

// Lees Meta's first-party cookies voor betere server-side matching.
export function getFbCookies() {
  if (typeof document === "undefined") return { fbp: null, fbc: null };
  const read = (name) => {
    const m = document.cookie.match(
      "(^|;)\\s*" + name + "\\s*=\\s*([^;]+)"
    );
    return m ? decodeURIComponent(m.pop()) : null;
  };
  return { fbp: read("_fbp"), fbc: read("_fbc") };
}

// Vuur het Lead-event in de browser. eventId moet matchen met de server-CAPI
// call zodat Meta dedupliceert. No-op zonder pixel of zonder consent.
export function trackLead(eventId, params = {}) {
  if (typeof window === "undefined" || !PIXEL_ID || !hasConsent()) return;
  if (!window.fbq) return;
  window.fbq(
    "track",
    "Lead",
    params,
    eventId ? { eventID: eventId } : undefined
  );
}

// Vuur het Schedule-event in de browser (geboekt gesprek). eventId moet matchen
// met de Calendly-webhook (CAPI) zodat Meta dedupliceert. No-op zonder consent.
export function trackSchedule(eventId, params = {}) {
  if (typeof window === "undefined" || !PIXEL_ID || !hasConsent()) return;
  if (!window.fbq) return;
  window.fbq(
    "track",
    "Schedule",
    params,
    eventId ? { eventID: eventId } : undefined
  );
}

// Genereer een uniek event-id voor browser↔server dedup.
export function newEventId() {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
  } catch {}
  return "evt_" + Date.now() + "_" + Math.random().toString(36).slice(2, 10);
}
