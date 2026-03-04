"use client";

import { useState, useEffect } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --black: #0a0a0a;
    --carbon: #111113;
    --surface: #18181c;
    --border: #2a2a30;
    --green: #00e87a;
    --orange: #ff7b00;
    --red: #ff2d55;
    --text: #e8e8e8;
    --muted: #666672;
    --accent: #00e87a;
  }

  body { background: var(--black); color: var(--text); font-family: 'DM Sans', sans-serif; }

  .app {
    min-height: 100vh;
    background: var(--black);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0;
  }

  /* HEADER */
  .header {
    width: 100%;
    background: var(--carbon);
    border-bottom: 1px solid var(--border);
    padding: 20px 40px;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .logo-mark {
    width: 36px;
    height: 36px;
    background: var(--green);
    display: flex;
    align-items: center;
    justify-content: center;
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  }
  .logo-mark span {
    font-family: 'Bebas Neue', cursive;
    font-size: 16px;
    color: var(--black);
    letter-spacing: 0;
  }
  .brand { font-family: 'Bebas Neue', cursive; font-size: 22px; letter-spacing: 3px; color: var(--text); }
  .brand-sub { font-size: 11px; color: var(--muted); letter-spacing: 2px; font-family: 'DM Mono', monospace; text-transform: uppercase; }
  .header-right { margin-left: auto; display: flex; align-items: center; gap: 10px; }
  .header-badge { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 2px; color: var(--green); border: 1px solid var(--green); padding: 4px 10px; text-transform: uppercase; }

  /* MAIN */
  .main {
    width: 100%;
    max-width: 900px;
    padding: 48px 24px;
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  /* SECTION LABEL */
  .section-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 3px;
    color: var(--muted);
    text-transform: uppercase;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .section-label::before { content: ''; display: block; width: 20px; height: 1px; background: var(--border); }

  /* SCAN PANEL */
  .scan-panel {
    background: var(--carbon);
    border: 1px solid var(--border);
    padding: 36px;
  }

  .scan-title {
    font-family: 'Bebas Neue', cursive;
    font-size: 38px;
    letter-spacing: 4px;
    color: var(--text);
    margin-bottom: 8px;
    line-height: 1;
  }
  .scan-desc {
    font-size: 13px;
    color: var(--muted);
    margin-bottom: 36px;
    font-weight: 300;
    letter-spacing: 0.3px;
  }

  /* SLIDERS GRID */
  .sliders-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 28px;
    margin-bottom: 28px;
  }
  @media (max-width: 600px) { .sliders-grid { grid-template-columns: 1fr; } }

  .slider-block {}
  .slider-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 10px;
  }
  .slider-name {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--muted);
  }
  .slider-value {
    font-family: 'Bebas Neue', cursive;
    font-size: 28px;
    letter-spacing: 1px;
    color: var(--text);
    min-width: 36px;
    text-align: right;
  }

  .slider-track {
    position: relative;
    height: 4px;
    background: var(--border);
    cursor: pointer;
    margin-bottom: 8px;
  }
  .slider-fill {
    position: absolute;
    left: 0; top: 0; height: 100%;
    transition: width 0.15s ease, background 0.3s;
  }
  .slider-thumb {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 16px;
    height: 16px;
    background: var(--text);
    border: 2px solid var(--black);
    cursor: grab;
    transition: left 0.15s ease;
  }
  .slider-thumb:active { cursor: grabbing; }

  input[type="range"] {
    -webkit-appearance: none;
    width: 100%;
    height: 4px;
    background: transparent;
    outline: none;
    cursor: pointer;
    position: absolute;
    top: 0; left: 0;
    opacity: 0;
    z-index: 10;
    margin: 0;
  }

  .slider-dots {
    display: flex;
    justify-content: space-between;
  }
  .slider-dot {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    color: var(--border);
  }
  .slider-dot.active { color: var(--muted); }

  /* PAIN LOCATION */
  .pain-location-row {
    margin-bottom: 28px;
    display: none;
  }
  .pain-location-row.visible { display: block; }
  .pain-location-label {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 10px;
  }
  .pain-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .pain-tag {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 1px;
    padding: 6px 14px;
    border: 1px solid var(--border);
    color: var(--muted);
    background: transparent;
    cursor: pointer;
    transition: all 0.15s;
    text-transform: uppercase;
  }
  .pain-tag:hover { border-color: var(--muted); color: var(--text); }
  .pain-tag.selected { border-color: var(--orange); color: var(--orange); background: rgba(255,123,0,0.08); }

  /* SCAN BUTTON */
  .scan-btn {
    width: 100%;
    padding: 18px;
    background: var(--green);
    color: var(--black);
    border: none;
    font-family: 'Bebas Neue', cursive;
    font-size: 22px;
    letter-spacing: 5px;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.1s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }
  .scan-btn:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
  .scan-btn:active:not(:disabled) { transform: translateY(0); }
  .scan-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
  .scan-btn.loading { background: var(--surface); color: var(--muted); }

  /* LOADING DOTS */
  .loading-dots { display: flex; gap: 6px; align-items: center; }
  .loading-dot {
    width: 6px; height: 6px;
    background: var(--muted);
    animation: pulse 1.2s ease-in-out infinite;
  }
  .loading-dot:nth-child(2) { animation-delay: 0.2s; }
  .loading-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes pulse { 0%,80%,100% { opacity: 0.2; } 40% { opacity: 1; } }

  /* RESULT PANEL */
  .result-panel {
    background: var(--carbon);
    border: 1px solid var(--border);
    animation: slideIn 0.4s ease;
    overflow: hidden;
  }
  @keyframes slideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

  .result-header {
    padding: 28px 36px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }
  .result-status-group { display: flex; align-items: center; gap: 20px; }
  .status-indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
    animation: blink 2s ease-in-out infinite;
  }
  @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
  .status-green { background: var(--green); box-shadow: 0 0 12px var(--green); }
  .status-orange { background: var(--orange); box-shadow: 0 0 12px var(--orange); }
  .status-red { background: var(--red); box-shadow: 0 0 12px var(--red); }

  .status-text {
    font-family: 'Bebas Neue', cursive;
    font-size: 32px;
    letter-spacing: 4px;
  }
  .text-green { color: var(--green); }
  .text-orange { color: var(--orange); }
  .text-red { color: var(--red); }

  .score-ring {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }
  .score-number {
    font-family: 'Bebas Neue', cursive;
    font-size: 48px;
    line-height: 1;
    letter-spacing: 2px;
  }
  .score-label {
    font-family: 'DM Mono', monospace;
    font-size: 9px;
    letter-spacing: 2px;
    color: var(--muted);
    text-transform: uppercase;
  }

  .result-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
  }
  @media (max-width: 600px) { .result-grid { grid-template-columns: 1fr; } }

  .result-cell {
    padding: 24px 36px;
    border-right: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }
  .result-cell:nth-child(even) { border-right: none; }
  .result-cell:last-child, .result-cell:nth-last-child(2):nth-child(odd) { border-bottom: none; }

  .cell-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .cell-label::before { content: '›'; color: var(--accent); }

  .cell-value {
    font-size: 13px;
    color: var(--text);
    line-height: 1.6;
    font-weight: 300;
  }
  .cell-value strong { font-weight: 500; color: var(--accent); }

  /* COACH MESSAGE */
  .coach-message {
    padding: 28px 36px;
    border-top: 1px solid var(--border);
    background: rgba(0, 232, 122, 0.04);
    display: flex;
    gap: 20px;
    align-items: flex-start;
  }
  .coach-icon {
    width: 32px;
    height: 32px;
    background: var(--green);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    font-size: 14px;
    font-family: 'Bebas Neue', cursive;
    color: var(--black);
  }
  .coach-text {
    font-size: 13px;
    line-height: 1.7;
    color: var(--text);
    font-style: italic;
    font-weight: 300;
  }

  /* RISK BADGE */
  .risk-badge {
    display: inline-block;
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 2px;
    padding: 4px 10px;
    text-transform: uppercase;
    border: 1px solid;
    margin-top: 8px;
  }
  .risk-low { color: var(--green); border-color: var(--green); background: rgba(0,232,122,0.06); }
  .risk-moderate { color: var(--orange); border-color: var(--orange); background: rgba(255,123,0,0.06); }
  .risk-high { color: var(--red); border-color: var(--red); background: rgba(255,45,85,0.06); }

  /* HYDRATION BAR */
  .hydration-bar {
    display: flex;
    gap: 4px;
    margin-top: 10px;
  }
  .hydration-block {
    height: 8px;
    flex: 1;
    background: var(--border);
    transition: background 0.3s;
  }
  .hydration-block.filled { background: #3b9eff; }

  .scan-again-btn {
    margin-top: 20px;
    width: 100%;
    padding: 14px;
    background: transparent;
    border: 1px solid var(--border);
    color: var(--muted);
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    letter-spacing: 3px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
  }
  .scan-again-btn:hover { border-color: var(--muted); color: var(--text); }

  /* FOOTER */
  .footer {
    width: 100%;
    border-top: 1px solid var(--border);
    padding: 20px 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .footer-text { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 2px; color: var(--border); text-transform: uppercase; }

  /* INTRO FORM */
  .intro-panel { background: var(--carbon); border: 1px solid var(--border); padding: 36px; }
  .intro-title { font-family: 'Bebas Neue', cursive; font-size: 38px; letter-spacing: 4px; color: var(--text); margin-bottom: 8px; line-height: 1; }
  .intro-desc { font-size: 13px; color: var(--muted); margin-bottom: 32px; font-weight: 300; letter-spacing: 0.3px; }
  .field-group { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
  @media (max-width: 600px) { .field-group { grid-template-columns: 1fr; } }
  .field-label { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; display: block; }
  .field-input { width: 100%; background: var(--surface); border: 1px solid var(--border); color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 14px; padding: 12px 16px; outline: none; transition: border-color 0.2s; box-sizing: border-box; }
  .field-input:focus { border-color: var(--green); }
  .field-input::placeholder { color: var(--muted); }
  .start-btn { width: 100%; padding: 18px; background: var(--green); color: var(--black); border: none; font-family: 'Bebas Neue', cursive; font-size: 22px; letter-spacing: 5px; cursor: pointer; transition: opacity 0.2s, transform 0.1s; }
  .start-btn:hover { opacity: 0.9; transform: translateY(-1px); }
  .start-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
  .email-sending { text-align: center; padding: 16px; font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 2px; color: var(--green); text-transform: uppercase; }
  .email-success { text-align: center; padding: 12px; font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 2px; color: var(--green); border: 1px solid var(--green); background: rgba(0,232,122,0.06); text-transform: uppercase; margin-top: 16px; }
`;


const PAIN_LOCATIONS = ["Lower Back", "Knee", "Shoulder", "Hip", "Neck", "Ankle", "Wrist", "Upper Back"];

const getSliderColor = (name, value) => {
  if (name === "stress" || name === "pain") {
    if (value <= 3) return "#00e87a";
    if (value <= 6) return "#ff7b00";
    return "#ff2d55";
  }
  if (value >= 7) return "#00e87a";
  if (value >= 5) return "#ff7b00";
  return "#ff2d55";
};

const getRiskClass = (risk) => {
  if (!risk) return "risk-low";
  const r = risk.toLowerCase();
  if (r.includes("low")) return "risk-low";
  if (r.includes("high") || r.includes("critical")) return "risk-high";
  return "risk-moderate";
};

const getStatusClass = (status) => {
  if (!status) return "";
  if (status.toLowerCase() === "green") return "text-green";
  if (status.toLowerCase() === "orange") return "text-orange";
  return "text-red";
};

const getIndicatorClass = (status) => {
  if (!status) return "";
  if (status.toLowerCase() === "green") return "status-green";
  if (status.toLowerCase() === "orange") return "status-orange";
  return "status-red";
};

function SliderInput({ name, label, min, max, value, onChange }) {
  const pct = ((value - min) / (max - min)) * 100;
  const color = getSliderColor(name, value);

  return (
    <div className="slider-block">
      <div className="slider-header">
        <span className="slider-name">{label}</span>
        <span className="slider-value" style={{ color }}>{value}{name === "sleep" ? "h" : ""}</span>
      </div>
      <div className="slider-track">
        <div className="slider-fill" style={{ width: `${pct}%`, background: color }} />
        <div className="slider-thumb" style={{ left: `${pct}%`, borderColor: color }} />
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
        />
      </div>
      <div className="slider-dots">
        {Array.from({ length: max - min + 1 }, (_, i) => (
          <span key={i} className={`slider-dot ${i + min <= value ? "active" : ""}`}>·</span>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [userInfo, setUserInfo] = useState({ name: '', email: '' });
  const [scanStarted, setScanStarted] = useState(false);
  const [values, setValues] = useState({ sleep: 7, energy: 7, stress: 4, pain: 2 });
  const [painLocations, setPainLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [emailSent, setEmailSent] = useState(false);
  const [emailSending, setEmailSending] = useState(false);

  const togglePainLocation = (loc) => {
    setPainLocations(prev =>
      prev.includes(loc) ? prev.filter(l => l !== loc) : [...prev, loc]
    );
  };

  const runScan = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    const systemPrompt = `You are the AI performance engine behind 9toFit Performance Intelligence™, a high-level coaching system for busy working men (30–55) who want sustainable strength and energy without burnout.

Your role:
- Analyze daily readiness data
- Generate intelligent training adjustments
- Detect patterns over time
- Provide performance risk scoring

Tone: Direct, Professional, Performance-oriented, Data-driven, No fluff, No motivational clichés.

Decision Priority:
1. Pain
2. Sleep
3. Stress
4. Energy

You must ALWAYS return ONLY valid JSON with NO markdown, NO backticks, NO explanation outside the JSON:
{
  "readiness_status": "Green | Orange | Red",
  "readiness_score": 0-100,
  "training_adjustment": "specific training adjustment string",
  "recovery_focus": "recovery focus string",
  "hydration_target_liters": "e.g. 2.5L",
  "nervous_system_protocol": "protocol if stress is high, else 'Standard warm-up'",
  "mobility_focus": "specific mobility if pain exists, else 'General mobility'",
  "performance_risk_level": "Low | Moderate | High",
  "coach_message": "direct coaching message under 60 words"
}

Decision rules:
Green: Sleep ≥7, Energy ≥7, Stress ≤5, Pain ≤3 → readiness_score 75–100
Orange: Sleep 5–6, Energy 5–6, Stress 6–7, Pain 4–5 → readiness_score 45–74
Red: Sleep ≤4, Energy ≤4, Stress ≥8, Pain ≥6 → readiness_score 0–44
Priority: Pain overrides all. Sleep overrides Stress and Energy.`;

    const userMessage = `Daily readiness check-in:
- Sleep: ${values.sleep} hours
- Energy: ${values.energy}/10
- Stress: ${values.stress}/10
- Pain: ${values.pain}/10${painLocations.length > 0 ? ` (Location: ${painLocations.join(", ")})` : ""}

Analyze and return JSON response.`;

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ values, painLocations })
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error || 'Scan mislukt');
      const parsed = data.result;
      setResult(parsed);

      // Send emails via Resend
      setEmailSending(true);
      try {
        await fetch('/api/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: userInfo.name,
            email: userInfo.email,
            result: parsed,
            values
          })
        });
        setEmailSent(true);
      } catch (e) {
        console.error('Email failed:', e);
      } finally {
        setEmailSending(false);
      }
    } catch (err) {
      setError(`Scan mislukt: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const hydrationLiters = result ? parseFloat(result.hydration_target_liters) : 0;
  const hydrationBlocks = Math.round(hydrationLiters * 2); // 500ml blocks

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        {/* HEADER */}
        <header className="header">
          <img src="data:image/png;base64,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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgMr+D9mplRmCmZDHAAAAAElFTkSuQmCC" alt="9toFit" style={{height: '52px', width: 'auto'}} />
          <div className="header-right">
            <span className="header-badge">Daily Readiness Scanner</span>
          </div>
        </header>

        <main className="main">
          {!scanStarted ? (
            <div className="intro-panel">
              <div className="section-label">Get Started</div>
              <div className="intro-title">DAILY READINESS SCAN</div>
              <div className="intro-desc">Enter your details to receive your personalized performance report by email.</div>
              <div className="field-group">
                <div>
                  <label className="field-label">First Name</label>
                  <input
                    className="field-input"
                    type="text"
                    placeholder="John"
                    value={userInfo.name}
                    onChange={e => setUserInfo(p => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="field-label">Email Address</label>
                  <input
                    className="field-input"
                    type="email"
                    placeholder="john@example.com"
                    value={userInfo.email}
                    onChange={e => setUserInfo(p => ({ ...p, email: e.target.value }))}
                  />
                </div>
              </div>
              <button
                className="start-btn"
                onClick={() => setScanStarted(true)}
                disabled={!userInfo.name || !userInfo.email || !userInfo.email.includes('@')}
              >
                START SCAN →
              </button>
            </div>
          ) : !result ? (
            <div className="scan-panel">
              <div className="section-label">Daily Input</div>
              <div className="scan-title">READINESS SCAN</div>
              <div className="scan-desc">Enter your current metrics. System analyzes and returns adjusted training protocol in seconds.</div>

              <div className="sliders-grid">
                <SliderInput name="sleep" label="Sleep (hours)" min={3} max={10} value={values.sleep} onChange={v => setValues(p => ({ ...p, sleep: v }))} />
                <SliderInput name="energy" label="Energy Level" min={1} max={10} value={values.energy} onChange={v => setValues(p => ({ ...p, energy: v }))} />
                <SliderInput name="stress" label="Stress Level" min={1} max={10} value={values.stress} onChange={v => setValues(p => ({ ...p, stress: v }))} />
                <SliderInput name="pain" label="Pain Level" min={0} max={10} value={values.pain} onChange={v => setValues(p => ({ ...p, pain: v }))} />
              </div>

              <div className={`pain-location-row ${values.pain >= 3 ? "visible" : ""}`}>
                <div className="pain-location-label">Pain Location</div>
                <div className="pain-tags">
                  {PAIN_LOCATIONS.map(loc => (
                    <button
                      key={loc}
                      className={`pain-tag ${painLocations.includes(loc) ? "selected" : ""}`}
                      onClick={() => togglePainLocation(loc)}
                    >{loc}</button>
                  ))}
                </div>
              </div>

              {error && (
                <div style={{ color: "#ff2d55", fontFamily: "'DM Mono', monospace", fontSize: 12, marginBottom: 16, letterSpacing: 1 }}>
                  ⚠ {error}
                </div>
              )}

              <button
                className={`scan-btn ${loading ? "loading" : ""}`}
                onClick={runScan}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, letterSpacing: 2 }}>ANALYZING</span>
                    <div className="loading-dots">
                      <div className="loading-dot" />
                      <div className="loading-dot" />
                      <div className="loading-dot" />
                    </div>
                  </>
                ) : "RUN DAILY SCAN"}
              </button>
            </div>
          ) : (
            <div className="result-panel">
              {/* STATUS HEADER */}
              <div className="result-header">
                <div className="result-status-group">
                  <div className={`status-indicator ${getIndicatorClass(result.readiness_status)}`} />
                  <div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 2, color: "var(--muted)", marginBottom: 4 }}>STATUS</div>
                    <div className={`status-text ${getStatusClass(result.readiness_status)}`}>
                      {result.readiness_status?.toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="score-ring">
                  <div className={`score-number ${getStatusClass(result.readiness_status)}`}>{result.readiness_score}</div>
                  <div className="score-label">Readiness Score</div>
                </div>
              </div>

              {/* DATA GRID */}
              <div className="result-grid">
                <div className="result-cell">
                  <div className="cell-label">Training Adjustment</div>
                  <div className="cell-value">{result.training_adjustment}</div>
                </div>
                <div className="result-cell">
                  <div className="cell-label">Recovery Focus</div>
                  <div className="cell-value">{result.recovery_focus}</div>
                </div>
                <div className="result-cell">
                  <div className="cell-label">Hydration Target</div>
                  <div className="cell-value">
                    <strong>{result.hydration_target_liters}</strong>
                    <div className="hydration-bar">
                      {Array.from({ length: 8 }, (_, i) => (
                        <div key={i} className={`hydration-block ${i < hydrationBlocks ? "filled" : ""}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="result-cell">
                  <div className="cell-label">Nervous System Protocol</div>
                  <div className="cell-value">{result.nervous_system_protocol}</div>
                </div>
                <div className="result-cell">
                  <div className="cell-label">Mobility Focus</div>
                  <div className="cell-value">{result.mobility_focus}</div>
                </div>
                <div className="result-cell">
                  <div className="cell-label">Performance Risk</div>
                  <div className="cell-value">
                    <div className={`risk-badge ${getRiskClass(result.performance_risk_level)}`}>
                      {result.performance_risk_level}
                    </div>
                  </div>
                </div>
              </div>

              {/* COACH MESSAGE */}
              <div className="coach-message">
                <div className="coach-icon">9F</div>
                <div className="coach-text">"{result.coach_message}"</div>
              </div>

              {/* SCAN AGAIN */}
              <div style={{ padding: "20px 36px 28px" }}>
                {emailSending && <div className="email-sending">✉ Sending your report...</div>}
                {emailSent && <div className="email-success">✓ Report sent to {userInfo.email}</div>}
                <button className="scan-again-btn" style={{ marginTop: emailSent || emailSending ? 16 : 0 }} onClick={() => { setResult(null); setError(null); setEmailSent(false); setScanStarted(false); setUserInfo({ name: '', email: '' }); }}>
                  ← New Scan
                </button>
              </div>
            </div>
          )}
        </main>

        <footer className="footer">
          <span className="footer-text">9toFit Performance Intelligence™</span>
          <span className="footer-text">v1.0 · Powered by Claude</span>
        </footer>
      </div>
    </>
  );
}
