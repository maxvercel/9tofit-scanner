/**
 * Stapmelder — vertelt de bovenliggende 9toFit-pagina waar de bezoeker is.
 *
 * De scan draait cross-origin in een iframe op 9tofit.nl. Daardoor kan deze app
 * niet bij de bezoeker-cookie en mag hij niet rechtstreeks naar de backend
 * schrijven. De tracker op de bovenliggende pagina kan dat wel. Dit bestand is
 * de brug:
 *
 *   scanner (hier) ──postMessage──▶ 9tofit-tracker.js ──beacon──▶ /api/track/event
 *
 * Wat er meegaat: het nummer van de stap, een sleutel, een leesbare naam en
 * welk pad de bezoeker koos. Wat er NOOIT meegaat: antwoorden, klachten, namen,
 * mailadressen. Daar is geen kanaal voor — het kan dus ook niet per ongeluk.
 *
 * Alles faalt stil. Meten mag de scan nooit breken, en een scan die los wordt
 * geopend (zonder parent) doet gewoon niets.
 */

const TARGETS = [
  'https://9tofit.nl',
  'https://www.9tofit.nl',
  'https://app.9tofit.nl',
]

const MAX_TEXT = 64

const sent = new Set()
let completed = false
let leadSent = false

function clean(v) {
  if (typeof v !== 'string') return null
  const s = v.trim()
  return s === '' ? null : s.slice(0, MAX_TEXT)
}

function post(name, params) {
  try {
    if (typeof window === 'undefined') return
    if (window.parent === window) return // los geopend: niets te melden
    const msg = { type: '9tf_scan_event', name, params: params || {} }
    for (const target of TARGETS) {
      try { window.parent.postMessage(msg, target) } catch { /* andere parent */ }
    }
  } catch {
    /* meten mag de scan nooit breken */
  }
}

/**
 * Meld dat de bezoeker bij een stap is aangekomen.
 * @param {number} index   volgorde zoals de bezoeker hem ziet, vanaf 0
 * @param {string} key     stabiele sleutel, bv. 'pain_intensity'
 * @param {string} [label] leesbare naam voor in het overzicht
 * @param {string} [path]  'pain' of 'fitness' — de twee paden zijn twee trechters
 */
export function trackScanStep(index, key, label, path) {
  try {
    const idx = Number.isFinite(index) ? index : parseInt(index, 10)
    const k = clean(key)
    if (!Number.isFinite(idx) && !k) return

    const id = `${k || 'stap'}:${idx}`
    if (sent.has(id)) return // terugklikken telt niet dubbel
    sent.add(id)

    const params = { step_index: Number.isFinite(idx) ? idx : null, step_key: k }
    const l = clean(label)
    if (l) params.step_label = l
    const p = clean(path)
    if (p) params.scan_path = p
    post('scan_step', params)
  } catch { /* stil */ }
}

/** De bezoeker heeft contactgegevens achtergelaten. Bij deze scan gebeurt dat
 *  vóór de uitslag: de gate zit tussen de vragen en de analyse. */
export function trackScanLead(path) {
  try {
    if (leadSent) return
    leadSent = true
    const p = clean(path)
    post('scan_lead', p ? { scan_path: p } : {})
  } catch { /* stil */ }
}

/** De uitslag staat op het scherm. */
export function trackScanComplete(path) {
  try {
    if (completed) return
    completed = true
    const p = clean(path)
    post('scan_complete', p ? { scan_path: p } : {})
  } catch { /* stil */ }
}

/** Handig tijdens het inbouwen. */
export function scanTrackingDebug() {
  return {
    gemeld: [...sent],
    lead: leadSent,
    afgerond: completed,
    inIframe: typeof window !== 'undefined' && window.parent !== window,
  }
}
