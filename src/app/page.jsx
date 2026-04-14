"use client";
import { useState, useEffect } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --ink: #ffffff;
    --paper: #09090b;
    --warm: #18181b;
    --card: rgba(24,24,27,0.8);
    --border: #27272a;
    --accent: #f97316;
    --accent-hover: #ea580c;
    --accent-light: rgba(249,115,22,0.1);
    --accent-glow: rgba(249,115,22,0.15);
    --text: #e4e4e7;
    --muted: #a1a1aa;
    --muted-light: #71717a;
    --green: #4ade80;
    --green-light: rgba(74,222,128,0.06);
    --blue: #60a5fa;
    --blue-light: rgba(96,165,250,0.1);
    --radius: 16px;
    --radius-sm: 12px;
  }
  html, body { height: 100%; background: var(--paper); }
  body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; color: var(--text); -webkit-font-smoothing: antialiased; background: var(--paper); }
  .app { min-height: 100vh; display: flex; flex-direction: column; background: var(--paper); }

  .main { flex: 1; position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; padding: 0 20px 60px; }

  /* LANDING */
  .landing { width: 100%; max-width: 640px; padding-top: 56px; animation: fadeUp 0.7s ease both; }
  .landing-kicker {
    font-size: 11px; letter-spacing: 2px; font-weight: 700;
    text-transform: uppercase; color: var(--accent); margin-bottom: 20px;
    display: flex; align-items: center; gap: 12px;
  }
  .kicker-line { width: 32px; height: 2px; background: var(--accent); flex-shrink: 0; border-radius: 1px; }
  .landing-h1 {
    font-size: clamp(36px, 7vw, 56px);
    line-height: 1.1; color: #ffffff; margin-bottom: 20px; font-weight: 900; letter-spacing: -0.5px;
  }
  .landing-h1 em { font-style: normal; color: var(--accent); }
  .landing-sub { font-size: 15px; color: var(--muted); line-height: 1.7; max-width: 480px; margin-bottom: 40px; }
  .landing-pillars { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-bottom: 40px; border: none; }
  @media(max-width:600px){ .landing-pillars { grid-template-columns: 1fr; } }
  .pillar { padding: 20px; background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-sm); }
  .pillar-num { font-size: 10px; letter-spacing: 1px; font-weight: 700; color: var(--accent); margin-bottom: 10px; }
  .pillar-title { font-size: 14px; font-weight: 800; color: #ffffff; margin-bottom: 6px; }
  .pillar-desc { font-size: 12px; color: var(--muted); line-height: 1.6; }
  .cta-row { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
  .cta-btn {
    display: inline-flex; align-items: center; gap: 10px;
    background: var(--accent); color: #ffffff; border: none;
    font-size: 15px; font-weight: 800;
    padding: 16px 32px; cursor: pointer; transition: all 0.2s; border-radius: var(--radius-sm);
  }
  .cta-btn:hover { background: var(--accent-hover); transform: translateY(-1px); box-shadow: 0 8px 24px rgba(249,115,22,0.3); }
  .cta-note { font-size: 11px; color: var(--muted-light); }

  /* STEP CONTAINER */
  .step-container { width: 100%; max-width: 640px; padding-top: 48px; animation: fadeUp 0.5s ease both; }
  .progress-wrap { margin-bottom: 40px; }
  .progress-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
  .progress-label { font-size: 11px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; }
  .progress-bar { width: 100%; height: 4px; background: var(--border); border-radius: 2px; }
  .progress-fill { height: 100%; background: var(--accent); transition: width 0.4s ease; border-radius: 2px; }

  .step-title { font-size: clamp(22px, 4vw, 30px); color: #ffffff; margin-bottom: 8px; font-weight: 900; line-height: 1.15; letter-spacing: -0.3px; }
  .step-sub { font-size: 14px; color: var(--muted); margin-bottom: 28px; }
  .step-label { font-size: 11px; font-weight: 700; color: var(--accent); margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; }

  /* PATH SELECTION */
  .path-card {
    width: 100%; padding: 24px; border: 1px solid var(--border); background: var(--card);
    border-radius: var(--radius); cursor: pointer; transition: all 0.2s; text-align: left;
    margin-bottom: 12px; display: block;
  }
  .path-card:hover { border-color: var(--muted-light); background: rgba(39,39,42,0.8); }
  .path-card.fysio:hover { border-color: rgba(96,165,250,0.5); background: rgba(96,165,250,0.05); }
  .path-card.fitness:hover { border-color: rgba(74,222,128,0.5); background: rgba(74,222,128,0.05); }
  .path-card.pain:hover { border-color: rgba(249,115,22,0.5); background: rgba(249,115,22,0.05); }
  .path-icon { font-size: 28px; margin-bottom: 10px; display: block; }
  .path-title { font-size: 16px; font-weight: 800; color: #ffffff; margin-bottom: 4px; }
  .path-desc { font-size: 13px; color: var(--muted); margin-bottom: 10px; line-height: 1.5; }
  .path-tag { display: inline-block; font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 6px; }
  .path-tag.blue { color: var(--blue); background: var(--blue-light); border: 1px solid rgba(96,165,250,0.3); }
  .path-tag.green { color: var(--green); background: var(--green-light); border: 1px solid rgba(74,222,128,0.3); }
  .path-tag.orange { color: var(--accent); background: var(--accent-light); border: 1px solid rgba(249,115,22,0.3); }

  /* FYSIO REFERRAL NOTICE */
  .fysio-notice { background: var(--blue-light); border: 1px solid rgba(96,165,250,0.3); padding: 14px 18px; border-radius: var(--radius-sm); margin-bottom: 20px; font-size: 13px; color: var(--blue); }

  /* OPTIONS */
  .options-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 10px; margin-bottom: 28px; }
  .option-card {
    padding: 16px; border: 1px solid var(--border); background: var(--card); border-radius: var(--radius-sm);
    cursor: pointer; transition: all 0.18s; text-align: left; position: relative;
  }
  .option-card:hover { border-color: var(--muted-light); background: rgba(39,39,42,0.8); }
  .option-card.selected { border-color: var(--accent); background: var(--accent-light); }
  .option-icon { font-size: 20px; margin-bottom: 8px; display: block; }
  .option-label { font-size: 13px; font-weight: 700; color: #ffffff; display: block; margin-bottom: 2px; }
  .option-sub { font-size: 11px; color: var(--muted); }
  .option-check { position: absolute; top: 12px; right: 14px; color: var(--accent); opacity: 0; font-size: 13px; transition: opacity 0.15s; }
  .option-card.selected .option-check { opacity: 1; }

  /* PILL OPTIONS (compact, single-row) */
  .pill-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
  .pill-btn {
    padding: 10px 18px; border: 1px solid var(--border); background: var(--card);
    border-radius: 99px; cursor: pointer; transition: all 0.15s;
    font-size: 13px; font-weight: 600; color: var(--muted);
  }
  .pill-btn:hover { border-color: var(--accent); color: #ffffff; }
  .pill-btn.selected { background: var(--accent); border-color: var(--accent); color: #ffffff; }

  /* SCALE */
  .scale-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px; }
  .scale-btn {
    width: 48px; height: 48px; border: 1px solid var(--border); background: var(--card); border-radius: var(--radius-sm);
    font-size: 15px; font-weight: 700; color: var(--muted);
    cursor: pointer; transition: all 0.15s;
  }
  .scale-btn:hover { border-color: var(--accent); color: #ffffff; }
  .scale-btn.selected { background: var(--accent); border-color: var(--accent); color: #ffffff; }
  .scale-labels { display: flex; justify-content: space-between; font-size: 10px; font-weight: 600; color: var(--muted-light); margin-bottom: 28px; }

  /* TEXT AREA */
  .text-area {
    width: 100%; min-height: 100px; background: var(--paper); border: 2px solid var(--border);
    border-radius: var(--radius-sm); color: #ffffff; font-size: 14px; font-family: inherit;
    padding: 14px; outline: none; transition: border-color 0.2s; resize: vertical;
  }
  .text-area:focus { border-color: var(--accent); }
  .text-area::placeholder { color: var(--muted-light); }
  .text-hint { font-size: 11px; color: var(--muted-light); margin-top: 6px; margin-bottom: 20px; }

  /* SECTION LABEL */
  .section-label { font-size: 13px; font-weight: 700; color: #ffffff; margin-bottom: 12px; margin-top: 24px; }
  .section-label:first-child { margin-top: 0; }

  /* NAVIGATION */
  .nav-row { display: flex; align-items: center; justify-content: space-between; margin-top: 8px; }
  .next-btn {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--accent); color: #ffffff; border: none;
    font-size: 14px; font-weight: 800;
    padding: 14px 28px; cursor: pointer; transition: all 0.2s; border-radius: var(--radius-sm);
  }
  .next-btn:hover:not(:disabled) { background: var(--accent-hover); }
  .next-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .back-btn {
    background: none; border: none; font-size: 13px; font-weight: 600;
    color: var(--muted); cursor: pointer;
    padding: 8px 0; transition: color 0.2s;
  }
  .back-btn:hover { color: var(--ink); }

  /* GATE */
  .gate { width: 100%; max-width: 640px; padding-top: 56px; animation: fadeUp 0.5s ease both; }
  .gate-box { background: var(--card); border: 1px solid var(--border); padding: 40px; border-radius: var(--radius); }
  @media(max-width:640px){ .gate-box { padding: 24px 20px; } }
  .gate-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 1px; color: var(--accent); text-transform: uppercase; margin-bottom: 14px; }
  .gate-title { font-size: clamp(26px, 5vw, 36px); color: #ffffff; margin-bottom: 12px; font-weight: 900; line-height: 1.1; letter-spacing: -0.3px; }
  .gate-sub { font-size: 14px; color: var(--muted); line-height: 1.7; margin-bottom: 28px; max-width: 440px; }
  .gate-preview {
    background: var(--paper); border: 1px solid var(--border); padding: 16px 20px; border-radius: var(--radius-sm);
    margin-bottom: 28px; position: relative; overflow: hidden;
    display: flex; gap: 8px; flex-wrap: wrap;
  }
  .gate-preview::after {
    content: 'ONTGRENDEL JE RAPPORT';
    position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; letter-spacing: 2px; color: var(--accent);
    background: rgba(9,9,11,0.92); backdrop-filter: blur(4px);
  }
  .preview-pill {
    padding: 6px 12px; background: var(--warm); border: 1px solid var(--border); border-radius: 8px;
    font-size: 10px; font-weight: 600; color: var(--muted-light); filter: blur(3px);
  }
  .gate-error { font-size: 12px; font-weight: 600; color: #ef4444; margin-bottom: 16px; padding: 12px 14px; border: 1px solid rgba(239,68,68,0.2); background: rgba(239,68,68,0.06); border-radius: var(--radius-sm); }
  .gate-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 18px; }
  @media(max-width:560px){ .gate-fields { grid-template-columns: 1fr; } }
  .field-wrap { display: flex; flex-direction: column; gap: 6px; }
  .field-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--muted); }
  .field-input {
    background: var(--paper); border: 2px solid var(--border); border-radius: var(--radius-sm);
    color: #ffffff; font-size: 14px;
    padding: 12px 14px; outline: none; transition: border-color 0.2s; width: 100%; font-family: inherit;
  }
  .field-input:focus { border-color: var(--accent); }
  .field-input::placeholder { color: var(--muted-light); }
  .submit-btn {
    width: 100%; padding: 16px; background: var(--accent); color: #ffffff; border: none;
    font-size: 15px; font-weight: 800; border-radius: var(--radius-sm);
    cursor: pointer; transition: all 0.2s;
    display: flex; align-items: center; justify-content: center; gap: 10px;
  }
  .submit-btn:hover:not(:disabled) { background: var(--accent-hover); box-shadow: 0 8px 24px rgba(249,115,22,0.25); }
  .submit-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .submit-note { margin-top: 12px; font-size: 11px; color: var(--muted-light); text-align: center; }

  /* ANALYZING */
  .analyzing { width: 100%; max-width: 640px; padding-top: 100px; text-align: center; animation: fadeUp 0.4s ease both; }
  .analyzing-spinner {
    width: 48px; height: 48px; margin: 0 auto 28px;
    border: 3px solid var(--border); border-top-color: var(--accent);
    border-radius: 50%; animation: spin 0.8s linear infinite;
  }
  .analyzing-title { font-size: 24px; font-weight: 900; color: #ffffff; margin-bottom: 8px; letter-spacing: -0.3px; }
  .analyzing-sub { font-size: 13px; color: var(--muted); }
  .analyzing-steps { margin-top: 32px; display: flex; flex-direction: column; gap: 6px; max-width: 320px; margin-left: auto; margin-right: auto; }
  .a-step {
    font-size: 12px; font-weight: 600;
    color: var(--muted-light); padding: 10px 14px; border: 1px solid var(--border); border-radius: var(--radius-sm);
    text-align: left; animation: fadeUp 0.4s ease both;
  }
  .a-step.active { color: var(--green); border-color: rgba(74,222,128,0.3); background: var(--green-light); }

  /* RESULT */
  .result { width: 100%; max-width: 640px; padding-top: 48px; animation: fadeUp 0.5s ease both; }
  .result-hero { margin-bottom: 32px; padding-bottom: 32px; border-bottom: 1px solid var(--border); }
  .result-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 1px; color: var(--accent); text-transform: uppercase; margin-bottom: 12px; }
  .result-name { font-size: clamp(28px, 5vw, 44px); color: #ffffff; margin-bottom: 20px; font-weight: 900; line-height: 1.1; letter-spacing: -0.5px; }
  .result-name em { font-style: normal; color: var(--muted); font-weight: 400; }
  .risk-row { display: flex; gap: 8px; flex-wrap: wrap; }
  .risk-tag { font-size: 11px; font-weight: 700; padding: 6px 14px; border-radius: 99px; border: 1px solid; }
  .risk-low { color: #4ade80; border-color: rgba(74,222,128,0.4); background: rgba(74,222,128,0.08); }
  .risk-moderate { color: #fbbf24; border-color: rgba(251,191,36,0.4); background: rgba(251,191,36,0.08); }
  .risk-high { color: #f87171; border-color: rgba(248,113,113,0.4); background: rgba(248,113,113,0.08); }
  .risk-neutral { color: var(--muted); border-color: var(--border); }

  .r-section { margin-bottom: 12px; }
  .r-sec-head { display: flex; align-items: center; gap: 12px; padding: 14px 20px; background: var(--warm); border: 1px solid var(--border); border-radius: var(--radius-sm) var(--radius-sm) 0 0; }
  .r-sec-num { font-size: 11px; font-weight: 700; color: var(--accent); }
  .r-sec-title { font-size: 13px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; color: #ffffff; }
  .r-sec-body { border: 1px solid var(--border); border-top: none; padding: 24px; background: var(--card); border-radius: 0 0 var(--radius-sm) var(--radius-sm); }
  .r-sec-body p { font-size: 14px; color: var(--text); line-height: 1.75; margin-bottom: 10px; }
  .r-sec-body p:last-child { margin-bottom: 0; }

  .lim-list { display: flex; flex-direction: column; gap: 8px; }
  .lim-item { display: flex; gap: 14px; align-items: flex-start; padding: 14px; background: var(--paper); border: 1px solid var(--border); border-radius: var(--radius-sm); }
  .lim-icon { font-size: 18px; flex-shrink: 0; }
  .lim-label { font-size: 14px; font-weight: 800; color: #ffffff; margin-bottom: 4px; }
  .lim-desc { font-size: 12px; color: var(--muted); line-height: 1.6; }

  .insight-body { border: 1px solid rgba(249,115,22,0.2); border-top: none; padding: 24px; background: var(--accent-light); border-radius: 0 0 var(--radius-sm) var(--radius-sm); }
  .insight-text { font-size: 15px; font-weight: 400; font-style: italic; line-height: 1.8; color: var(--text); }

  /* 7-DAY PLAN */
  .plan-list { display: flex; flex-direction: column; gap: 4px; }
  .plan-day { border: 1px solid var(--border); border-radius: var(--radius-sm); overflow: hidden; }
  .plan-day-head {
    display: flex; align-items: center; gap: 14px; padding: 14px 18px;
    background: var(--warm); cursor: pointer; user-select: none; transition: background 0.15s;
  }
  .plan-day-head:hover { background: #27272a; }
  .plan-day-num { font-size: 11px; font-weight: 700; color: var(--accent); flex-shrink: 0; width: 40px; }
  .plan-day-title { font-size: 14px; font-weight: 800; color: #ffffff; flex: 1; }
  .plan-day-focus { font-size: 10px; font-weight: 700; color: var(--accent); padding: 3px 10px; border: 1px solid rgba(249,115,22,0.3); background: var(--accent-light); border-radius: 99px; }
  .plan-day-body { padding: 18px; background: var(--card); border-top: 1px solid var(--border); }
  .ex-list { display: flex; flex-direction: column; gap: 14px; }
  .ex-item { display: flex; gap: 12px; }
  .ex-num { font-size: 11px; font-weight: 700; color: var(--accent); flex-shrink: 0; padding-top: 2px; min-width: 20px; }
  .ex-name { font-size: 14px; font-weight: 800; color: #ffffff; margin-bottom: 3px; }
  .ex-spec { font-size: 11px; font-weight: 600; color: var(--muted); margin-bottom: 4px; }
  .ex-note { font-size: 12px; color: var(--muted); line-height: 1.6; }
  .day-note { margin-top: 14px; padding: 12px 14px; background: var(--accent-light); border-left: 3px solid var(--accent); border-radius: 0 var(--radius-sm) var(--radius-sm) 0; font-size: 12px; color: var(--muted); line-height: 1.6; }

  /* CALL CTA */
  .call-block {
    margin-top: 12px; padding: 32px; background: linear-gradient(135deg, var(--accent-light), var(--paper));
    border: 1px solid rgba(249,115,22,0.2); border-radius: var(--radius);
    display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap;
  }
  .call-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 1px; color: var(--accent); text-transform: uppercase; margin-bottom: 8px; }
  .call-title { font-size: 22px; color: #ffffff; margin-bottom: 8px; font-weight: 900; letter-spacing: -0.3px; }
  .call-desc { font-size: 13px; color: var(--muted); line-height: 1.6; max-width: 380px; }
  .call-btn {
    flex-shrink: 0; display: inline-flex; align-items: center; gap: 8px;
    background: var(--accent); color: #ffffff; border: none;
    font-size: 14px; font-weight: 800;
    padding: 14px 24px; cursor: pointer; transition: all 0.2s;
    text-decoration: none; white-space: nowrap; border-radius: var(--radius-sm);
  }
  .call-btn:hover { background: var(--accent-hover); box-shadow: 0 8px 24px rgba(249,115,22,0.3); }

  .email-bar { margin-top: 12px; padding: 12px 18px; border: 1px solid var(--border); border-radius: var(--radius-sm); display: flex; align-items: center; gap: 10px; font-size: 12px; font-weight: 600; color: var(--muted); }
  .email-bar.sent { color: var(--green); border-color: rgba(74,222,128,0.3); background: var(--green-light); }
  .email-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
  .restart-btn { margin-top: 12px; width: 100%; padding: 14px; background: transparent; border: 1px solid var(--border); border-radius: var(--radius-sm); font-size: 13px; font-weight: 700; color: var(--muted-light); cursor: pointer; transition: all 0.2s; }
  .restart-btn:hover { border-color: var(--accent); color: #ffffff; }

  /* SUCCESS (fitness/fysio paths) */
  .success { width: 100%; max-width: 640px; padding-top: 80px; text-align: center; animation: fadeUp 0.5s ease both; }
  .success-icon { font-size: 56px; margin-bottom: 20px; }
  .success-title { font-size: clamp(26px, 5vw, 36px); color: #ffffff; margin-bottom: 12px; font-weight: 900; line-height: 1.1; letter-spacing: -0.3px; }
  .success-sub { font-size: 15px; color: var(--muted); line-height: 1.7; max-width: 440px; margin: 0 auto 32px; }
  .success-steps { display: flex; flex-direction: column; gap: 12px; max-width: 400px; margin: 0 auto 32px; text-align: left; }
  .success-step { display: flex; gap: 14px; align-items: flex-start; padding: 16px; background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-sm); }
  .success-step-num { font-size: 12px; font-weight: 800; color: var(--accent); flex-shrink: 0; width: 24px; }
  .success-step-text { font-size: 13px; color: var(--text); line-height: 1.6; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

// ────────── DATA DEFINITIONS ──────────

const AGE_RANGES = [
  { id: "18-25", label: "18-25 jaar" },
  { id: "25-35", label: "25-35 jaar" },
  { id: "35-45", label: "35-45 jaar" },
  { id: "45-55", label: "45-55 jaar" },
  { id: "55+", label: "55+ jaar" },
];

const TRAINING_BACKGROUNDS = [
  { id: "never", label: "Nog niet begonnen", icon: "🌱" },
  { id: "less_6m", label: "Minder dan 6 maanden", icon: "🌿" },
  { id: "6m_2y", label: "6 maanden – 2 jaar", icon: "📈" },
  { id: "2y_4y", label: "2 – 4 jaar", icon: "💪" },
  { id: "4y_plus", label: "4+ jaar", icon: "🏆" },
];

const GOALS = [
  { id: "strength", label: "Sterker worden", icon: "💪" },
  { id: "muscle", label: "Spiermassa opbouwen", icon: "🏋️" },
  { id: "fat_loss", label: "Afvallen / vet verliezen", icon: "🔥" },
  { id: "health", label: "Gezondheid verbeteren", icon: "❤️" },
  { id: "athletic", label: "Atletischer worden", icon: "⚡" },
  { id: "painless", label: "Pijnvrij bewegen", icon: "🩹" },
];

const WORK_SITUATIONS = [
  { id: "desk", label: "Kantoor / bureau", icon: "💻", sub: "Vooral zittend, schermwerk" },
  { id: "physical", label: "Fysiek werk", icon: "🔧", sub: "Tillen, staan, repetitief" },
  { id: "standing", label: "Staand werk", icon: "🧍", sub: "Retail, horeca, medisch" },
  { id: "home", label: "Thuiswerk", icon: "🏠", sub: "Variabele houding" },
  { id: "travel", label: "Veel onderweg", icon: "✈️", sub: "Lange ritten of vluchten" },
];

const WORK_HOURS = [
  { id: "lt16", label: "<16 uur" },
  { id: "24", label: "24 uur" },
  { id: "32", label: "32 uur" },
  { id: "40", label: "40 uur" },
  { id: "46plus", label: "46+ uur" },
];
const TRAINING_DAYS = [2, 3, 4, 5, 6];

const START_URGENCIES = [
  { id: "direct", label: "Direct" },
  { id: "this_week", label: "Deze week" },
  { id: "soon", label: "Binnenkort" },
];

// Pain-specific data
const PAIN_LOCATIONS = [
  { icon: "🔙", label: "Onderrug", id: "lower_back", sub: "Lendenen regio" },
  { icon: "🦵", label: "Knie", id: "knee", sub: "Voor, achter of zijkant" },
  { icon: "💪", label: "Schouder", id: "shoulder", sub: "Gewricht of omliggende gebied" },
  { icon: "🦴", label: "Heup", id: "hip", sub: "Gewricht, billen of lies" },
  { icon: "🔝", label: "Nek / Bovenste Trapezius", id: "neck", sub: "Halswervels" },
  { icon: "🦶", label: "Enkel / Voet", id: "ankle", sub: "Inclusief Achillespees" },
  { icon: "✋", label: "Pols / Elleboog", id: "wrist", sub: "Onderarmen" },
  { icon: "⬆️", label: "Bovenrug / Thoracaal", id: "upper_back", sub: "Middenwervels" },
];

const PAIN_TIMINGS = [
  { icon: "🌅", label: "Ochtendstijfheid", id: "morning", sub: "Eerste 30–60 minuten" },
  { icon: "🏋️", label: "Tijdens training", id: "during_training", sub: "Pijn treedt op tijdens oefening" },
  { icon: "😓", label: "Na training", id: "after_training", sub: "Vertraagde pijn" },
  { icon: "💺", label: "Na lang zitten", id: "after_sitting", sub: "Bureau, auto of bank" },
  { icon: "🚶", label: "Bepaalde bewegingen", id: "certain_moves", sub: "Buigen, draaien, belasten" },
  { icon: "⏱️", label: "Constant / hele dag", id: "constant", sub: "Geen duidelijk patroon" },
];

const PAIN_TRIGGERS = [
  { icon: "⬇️", label: "Voorover buigen", id: "bending", sub: "Heupgewricht of flexie" },
  { icon: "🔄", label: "Draaien / torsie", id: "twisting", sub: "Romp- of gewrichtrotatie" },
  { icon: "⬆️", label: "Omhoog reiken", id: "reaching", sub: "Naar boven drukken of trekken" },
  { icon: "🪑", label: "Van zitten naar staan", id: "sittostand", sub: "Overgangsbewegingen" },
  { icon: "🏃", label: "Hardlopen / impact", id: "running", sub: "Belasting bij voetcontact" },
  { icon: "🏋️", label: "Squatten / longes", id: "squatting", sub: "Kniedominante patronen" },
];

const PAIN_DURATIONS = [
  { icon: "⚡", label: "Minder dan 1 maand", id: "acute", sub: "Recent ontstaan" },
  { icon: "📅", label: "1–3 maanden", id: "subacute", sub: "Sub-acute fase" },
  { icon: "📆", label: "3–12 maanden", id: "chronic", sub: "Chronisch patroon" },
  { icon: "♾️", label: "Meer dan een jaar", id: "longterm", sub: "Langdurige klacht" },
];

const ANALYZE_STEPS = [
  "Pijnpatroon data verwerken…",
  "Bewegingsbeperkingen in kaart brengen…",
  "Risicofactoren berekenen…",
  "7-daags correctief plan genereren…",
];

const getRiskClass = (r = "") => {
  const l = r.toLowerCase();
  if (l.includes("low") || l.includes("laag")) return "risk-low";
  if (l.includes("high") || l.includes("hoog")) return "risk-high";
  return "risk-moderate";
};

// ────────── MAIN COMPONENT ──────────

export default function App() {
  // Phases: landing → path_select → assessment → gate → analyzing → result → success
  const [phase, setPhase] = useState("landing");
  const [step, setStep] = useState(0);

  // Scan path: 'fysio' | 'fitness' | 'pain'
  const [scanPath, setScanPath] = useState("");

  // Shared data (all paths)
  const [data, setData] = useState({
    ageRange: "",
    trainingBackground: "",
    goals: [],
    yearGoalText: "",
    workSituation: "",
    workHoursPerWeek: "40",
    hasChildren: null,
    childrenCount: 0,
    trainingDaysAvailable: 3,
    startUrgency: "",
    referralSource: "",
  });

  // Pain-specific data
  const [painData, setPainData] = useState({
    painLocations: [],
    painIntensity: 5,
    painDuration: "",
    painTiming: "",
    painTriggers: [],
  });

  // User info (gate)
  const [userInfo, setUserInfo] = useState({ name: "", email: "" });

  // AI result (pain path only)
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [emailSent, setEmailSent] = useState(false);
  const [analyzeStep, setAnalyzeStep] = useState(0);
  const [expandedDays, setExpandedDays] = useState({ 0: true });
  const [submitting, setSubmitting] = useState(false);

  // Report height to parent WordPress page so iframe resizes automatically
  useEffect(() => {
    const reportHeight = () => {
      const height = document.body.scrollHeight;
      window.parent.postMessage({ type: "iframeHeight", height }, "*");
    };
    reportHeight();
    const observer = new ResizeObserver(reportHeight);
    observer.observe(document.body);
    return () => observer.disconnect();
  }, [phase, step]);

  // Check URL params for fysio referral
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get("ref") || "";
      if (ref.startsWith("fysio_")) {
        setData((d) => ({ ...d, referralSource: ref }));
        setScanPath("fysio");
        setPhase("assessment");
        setStep(0);
      }
    }
  }, []);

  // ── Build dynamic question steps based on path ──
  const getSteps = () => {
    // All paths share: About You, Goals, Situation
    // Pain path adds: Pain Location, Pain Details, Pain Triggers+Duration
    // Fysio path adds: referral context handled in gate
    const steps = [
      "about_you",       // Step 0: age + training background
      "goals",           // Step 1: goals checkboxes + year goal text
      "situation",       // Step 2: work situation + hours + training days + urgency
    ];
    if (scanPath === "pain") {
      steps.push("pain_location");   // Step 3: where + when
      steps.push("pain_details");    // Step 4: intensity + duration
      steps.push("pain_triggers");   // Step 5: movement triggers
    }
    return steps;
  };

  const steps = getSteps();
  const totalSteps = steps.length;
  const currentStepId = steps[step];
  const progress = totalSteps > 0 ? ((step + 1) / (totalSteps + 1)) * 100 : 0; // +1 for gate

  // ── Navigation ──
  const canProceed = () => {
    switch (currentStepId) {
      case "about_you":
        return data.ageRange && data.trainingBackground;
      case "goals":
        return data.goals.length > 0;
      case "situation":
        return data.workSituation && data.startUrgency;
      case "pain_location":
        return painData.painLocations.length > 0 && painData.painTiming;
      case "pain_details":
        return painData.painIntensity > 0 && painData.painDuration;
      case "pain_triggers":
        return painData.painTriggers.length > 0;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (step < totalSteps - 1) {
      setStep((s) => s + 1);
    } else {
      setPhase("gate");
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep((s) => s - 1);
    } else {
      // Go back to path selection
      setPhase("path_select");
    }
  };

  // ── Path selection ──
  const handlePathSelect = (path) => {
    setScanPath(path);
    setStep(0);
    setPhase("assessment");
  };

  // ── Toggle multi-select ──
  const toggleMulti = (arr, val) =>
    arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];

  // ── Submit for pain path (AI analysis) ──
  const runPainAnalysis = async () => {
    setPhase("analyzing");
    setError(null);
    setAnalyzeStep(0);

    for (let i = 0; i < ANALYZE_STEPS.length; i++) {
      await new Promise((r) => setTimeout(r, 950));
      setAnalyzeStep(i + 1);
    }

    try {
      // Call local AI scan endpoint
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "pain_performance",
          answers: {
            pain_location: painData.painLocations,
            pain_timing: painData.painTiming,
            movement_triggers: painData.painTriggers,
            pain_duration: painData.painDuration,
            pain_intensity: painData.painIntensity,
            work_type: data.workSituation,
            training_history: data.trainingBackground,
            activity_level: data.trainingDaysAvailable,
            previous_treatment: [], // Not asked in new flow, send empty
          },
          userInfo,
        }),
      });
      const aiData = await res.json();
      if (!aiData.success) throw new Error(aiData.error || "Analysis failed");
      setResult(aiData.result);
      setPhase("result");

      // Send email report
      fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userInfo.name,
          email: userInfo.email,
          result: aiData.result,
          answers: {
            pain_location: painData.painLocations,
            pain_timing: painData.painTiming,
            movement_triggers: painData.painTriggers,
            pain_duration: painData.painDuration,
            pain_intensity: painData.painIntensity,
            work_type: data.workSituation,
            training_history: data.trainingBackground,
            activity_level: data.trainingDaysAvailable,
            previous_treatment: [],
          },
          type: "pain_performance",
          scanPath: "pain",
          extraData: {
            age_range: data.ageRange,
            goals: data.goals,
            year_goal_text: data.yearGoalText,
            work_hours_per_week: data.workHoursPerWeek,
            has_children: data.hasChildren,
            children_count: data.childrenCount,
            start_urgency: data.startUrgency,
          },
        }),
      })
        .then(() => setEmailSent(true))
        .catch(() => {});

      // Submit to 9toFit platform (account + magic link)
      await submitToPlatform(aiData.result);
    } catch (e) {
      setError(e.message);
      setPhase("gate");
    }
  };

  // ── Submit for fitness/fysio path (no AI, just platform) ──
  const runFitnessSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await submitToPlatform(null);
      // Send coach intake email
      fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userInfo.name,
          email: userInfo.email,
          result: null,
          answers: {},
          type: scanPath === "fysio" ? "fysio_intake" : "fitness_intake",
          scanPath,
          extraData: {
            age_range: data.ageRange,
            training_background: data.trainingBackground,
            goals: data.goals,
            year_goal_text: data.yearGoalText,
            work_situation: data.workSituation,
            work_hours_per_week: data.workHoursPerWeek,
            has_children: data.hasChildren,
            children_count: data.childrenCount,
            training_days_available: data.trainingDaysAvailable,
            start_urgency: data.startUrgency,
            referral_source: data.referralSource || null,
          },
        }),
      }).catch(() => {});
      setPhase("success");
    } catch (e) {
      setError(e.message);
      setSubmitting(false);
    }
  };

  // ── Platform submit (all paths) ──
  const submitToPlatform = async (aiResult) => {
    const platformUrl =
      process.env.NEXT_PUBLIC_PLATFORM_URL || "https://app.9tofit.nl";
    const isPain = scanPath === "pain";
    const res = await fetch(`${platformUrl}/api/scan-submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: userInfo.name,
        email: userInfo.email,
        scan_path: scanPath,
        referral_source: data.referralSource || null,
        age_range: data.ageRange,
        training_background: data.trainingBackground,
        goals: data.goals,
        year_goal_text: data.yearGoalText,
        work_situation: data.workSituation,
        work_hours_per_week: data.workHoursPerWeek,
        has_children: data.hasChildren,
        children_count: data.childrenCount,
        training_days_available: data.trainingDaysAvailable,
        start_urgency: data.startUrgency,
        has_pain: isPain,
        pain_locations: isPain ? painData.painLocations : [],
        pain_intensity: isPain ? painData.painIntensity : null,
        pain_duration: isPain ? painData.painDuration : null,
        pain_timing: isPain ? painData.painTiming : null,
        pain_triggers: isPain ? painData.painTriggers : [],
        scanner_ai_result: aiResult || null,
      }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || "Account aanmaken mislukt. Probeer het opnieuw.");
    }
    return res.json();
  };

  // ── Gate submit handler ──
  const handleGateSubmit = () => {
    if (scanPath === "pain") {
      runPainAnalysis();
    } else {
      runFitnessSubmit();
    }
  };

  // ── Reset ──
  const reset = () => {
    setPhase("landing");
    setStep(0);
    setScanPath("");
    setData({ ageRange: "", trainingBackground: "", goals: [], yearGoalText: "", workSituation: "", workHoursPerWeek: "40", hasChildren: null, childrenCount: 0, trainingDaysAvailable: 3, startUrgency: "", referralSource: "" });
    setPainData({ painLocations: [], painIntensity: 5, painDuration: "", painTiming: "", painTriggers: [] });
    setUserInfo({ name: "", email: "" });
    setResult(null);
    setError(null);
    setEmailSent(false);
    setExpandedDays({ 0: true });
    setAnalyzeStep(0);
    setSubmitting(false);
  };

  // ── Derived result data ──
  const plan = Array.isArray(result?.seven_day_plan) ? result.seven_day_plan : [];
  const limitations = Array.isArray(result?.movement_limitations) ? result.movement_limitations : [];
  const riskFactors = Array.isArray(result?.risk_factors) ? result.risk_factors : [];
  const showCallCTA = result && (result.overall_risk?.toLowerCase() !== "low" || (painData.painIntensity ?? 0) >= 5);

  const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);

  // ────────── RENDER ──────────
  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <main className="main">

          {/* ═══════ LANDING ═══════ */}
          {phase === "landing" && (
            <div className="landing">
              <div className="landing-kicker">
                <span className="kicker-line" />
                Gratis Performance Scan
              </div>
              <h1 className="landing-h1">
                Ontdek wat jouw
                <br />
                lichaam <em>nodig heeft.</em>
              </h1>
              <p className="landing-sub">
                Of je nu sterker wilt worden, pijn wilt verhelpen, of doorgestuurd
                bent door een fysiotherapeut — deze scan geeft jouw coach een
                compleet beeld. In minder dan 3 minuten.
              </p>
              <div className="landing-pillars">
                <div className="pillar">
                  <div className="pillar-num">01</div>
                  <div className="pillar-title">Persoonlijk Profiel</div>
                  <div className="pillar-desc">
                    Leeftijd, ervaring, doelen en situatie — alles wat je coach
                    moet weten.
                  </div>
                </div>
                <div className="pillar">
                  <div className="pillar-num">02</div>
                  <div className="pillar-title">Pijn of Klachten?</div>
                  <div className="pillar-desc">
                    Heb je klachten? Dan krijg je direct een persoonlijke bewegingsanalyse
                    en correctief plan.
                  </div>
                </div>
                <div className="pillar">
                  <div className="pillar-num">03</div>
                  <div className="pillar-title">Coach Op Maat</div>
                  <div className="pillar-desc">
                    Je coach bouwt een schema op basis van jouw unieke profiel.
                    Geen standaard templates.
                  </div>
                </div>
              </div>
              <div className="cta-row">
                <button
                  className="cta-btn"
                  onClick={() => setPhase("path_select")}
                >
                  Start Je Scan <span>→</span>
                </button>
                <span className="cta-note">
                  Gratis · 3 minuten · Geen account nodig
                </span>
              </div>
            </div>
          )}

          {/* ═══════ PATH SELECTION ═══════ */}
          {phase === "path_select" && (
            <div className="step-container">
              <div className="step-title">Welkom bij 9toFit</div>
              <div className="step-sub">Wat brengt je hier vandaag?</div>

              <button
                className="path-card fysio"
                onClick={() => handlePathSelect("fysio")}
              >
                <span className="path-icon">🤝</span>
                <div className="path-title">Fysio doorverwijzing</div>
                <div className="path-desc">
                  Doorgestuurd door je fysiotherapeut — klachtenvrij en klaar om
                  te trainen.
                </div>
                <span className="path-tag blue">Intake · Coach bouwt schema</span>
              </button>

              <button
                className="path-card fitness"
                onClick={() => handlePathSelect("fitness")}
              >
                <span className="path-icon">💪</span>
                <div className="path-title">Fitter & sterker worden</div>
                <div className="path-desc">
                  Geen klachten — je wilt trainen met een persoonlijk schema op
                  maat.
                </div>
                <span className="path-tag green">
                  Coach bouwt schema op maat
                </span>
              </button>

              <button
                className="path-card pain"
                onClick={() => handlePathSelect("pain")}
              >
                <span className="path-icon">🩹</span>
                <div className="path-title">Pijn of klachten</div>
                <div className="path-desc">
                  Terugkerende blessures, stijfheid of pijn die je training
                  belemmert.
                </div>
                <span className="path-tag orange">
                  Persoonlijke bewegingsanalyse · Correctief plan
                </span>
              </button>

              <div style={{ marginTop: "16px" }}>
                <button className="back-btn" onClick={() => setPhase("landing")}>
                  ← Terug
                </button>
              </div>
            </div>
          )}

          {/* ═══════ ASSESSMENT ═══════ */}
          {phase === "assessment" && (
            <div className="step-container" key={currentStepId}>
              <div className="progress-wrap">
                <div className="progress-top">
                  <span className="progress-label">
                    Stap {step + 1} van {totalSteps}
                  </span>
                  <span className="progress-label">
                    {scanPath === "pain"
                      ? "Pijn & Prestatie Scan"
                      : scanPath === "fysio"
                      ? "Fysio Intake"
                      : "Performance Scan"}
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* ── STEP: About You ── */}
              {currentStepId === "about_you" && (
                <div style={{ animation: "fadeUp 0.35s ease both" }}>
                  {scanPath === "fysio" && data.referralSource && (
                    <div className="fysio-notice">
                      Doorgestuurd door je fysiotherapeut — je profiel is al
                      voorbereid.
                    </div>
                  )}
                  <div className="step-label">Over jou</div>
                  <div className="step-title">Vertel ons over jezelf</div>
                  <div className="step-sub">
                    Dit helpt je coach om het perfecte schema te bouwen.
                  </div>

                  <div className="section-label">Leeftijd</div>
                  <div className="pill-grid">
                    {AGE_RANGES.map((a) => (
                      <button
                        key={a.id}
                        className={`pill-btn ${data.ageRange === a.id ? "selected" : ""}`}
                        onClick={() => setData((d) => ({ ...d, ageRange: a.id }))}
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>

                  <div className="section-label">Trainingsachtergrond</div>
                  <div className="options-grid">
                    {TRAINING_BACKGROUNDS.map((bg) => (
                      <button
                        key={bg.id}
                        className={`option-card ${data.trainingBackground === bg.id ? "selected" : ""}`}
                        onClick={() =>
                          setData((d) => ({ ...d, trainingBackground: bg.id }))
                        }
                      >
                        <span className="option-icon">{bg.icon}</span>
                        <span className="option-label">{bg.label}</span>
                        <span className="option-check">✓</span>
                      </button>
                    ))}
                  </div>

                  <div className="nav-row">
                    <button className="back-btn" onClick={prevStep}>
                      ← Terug
                    </button>
                    <button
                      className="next-btn"
                      onClick={nextStep}
                      disabled={!canProceed()}
                    >
                      Volgende →
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP: Goals ── */}
              {currentStepId === "goals" && (
                <div style={{ animation: "fadeUp 0.35s ease both" }}>
                  <div className="step-label">Doelen & Motivatie</div>
                  <div className="step-title">Wat wil je bereiken?</div>
                  <div className="step-sub">
                    Selecteer alles wat van toepassing is.
                  </div>

                  <div className="options-grid">
                    {GOALS.map((g) => {
                      const sel = data.goals.includes(g.id);
                      return (
                        <button
                          key={g.id}
                          className={`option-card ${sel ? "selected" : ""}`}
                          onClick={() =>
                            setData((d) => ({
                              ...d,
                              goals: toggleMulti(d.goals, g.id),
                            }))
                          }
                        >
                          <span className="option-icon">{g.icon}</span>
                          <span className="option-label">{g.label}</span>
                          <span className="option-check">✓</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="section-label">
                    Wat wil je het komende jaar bereiken?
                  </div>
                  <textarea
                    className="text-area"
                    placeholder="Bijv. 'Pijnvrij 3x per week trainen', 'Weer een marathon lopen', '10 kg afvallen en sterker worden'…"
                    value={data.yearGoalText}
                    onChange={(e) =>
                      setData((d) => ({ ...d, yearGoalText: e.target.value }))
                    }
                  />
                  <div className="text-hint">
                    Optioneel — maar hoe specifieker, hoe beter je coach je kan
                    helpen.
                  </div>

                  <div className="nav-row">
                    <button className="back-btn" onClick={prevStep}>
                      ← Terug
                    </button>
                    <button
                      className="next-btn"
                      onClick={nextStep}
                      disabled={!canProceed()}
                    >
                      Volgende →
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP: Situation ── */}
              {currentStepId === "situation" && (
                <div style={{ animation: "fadeUp 0.35s ease both" }}>
                  <div className="step-label">Jouw Situatie</div>
                  <div className="step-title">
                    Hoe ziet jouw dag en week eruit?
                  </div>
                  <div className="step-sub">
                    Je werksituatie en beschikbaarheid bepalen de opbouw van je
                    schema.
                  </div>

                  <div className="section-label">Werksituatie</div>
                  <div className="options-grid">
                    {WORK_SITUATIONS.map((w) => (
                      <button
                        key={w.id}
                        className={`option-card ${data.workSituation === w.id ? "selected" : ""}`}
                        onClick={() =>
                          setData((d) => ({ ...d, workSituation: w.id }))
                        }
                      >
                        <span className="option-icon">{w.icon}</span>
                        <span className="option-label">{w.label}</span>
                        <span className="option-sub">{w.sub}</span>
                        <span className="option-check">✓</span>
                      </button>
                    ))}
                  </div>

                  <div className="section-label">Werkuren per week</div>
                  <div className="pill-grid">
                    {WORK_HOURS.map((h) => (
                      <button
                        key={h.id}
                        className={`pill-btn ${data.workHoursPerWeek === h.id ? "selected" : ""}`}
                        onClick={() =>
                          setData((d) => ({ ...d, workHoursPerWeek: h.id }))
                        }
                      >
                        {h.label}
                      </button>
                    ))}
                  </div>

                  <div className="section-label">Heb je kinderen?</div>
                  <div className="pill-grid">
                    <button
                      className={`pill-btn ${data.hasChildren === false ? "selected" : ""}`}
                      onClick={() =>
                        setData((d) => ({ ...d, hasChildren: false, childrenCount: 0 }))
                      }
                    >
                      Nee
                    </button>
                    <button
                      className={`pill-btn ${data.hasChildren === true ? "selected" : ""}`}
                      onClick={() =>
                        setData((d) => ({ ...d, hasChildren: true, childrenCount: d.childrenCount || 1 }))
                      }
                    >
                      Ja
                    </button>
                  </div>
                  {data.hasChildren && (
                    <>
                      <div className="section-label">Hoeveel kinderen?</div>
                      <div className="pill-grid">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            className={`pill-btn ${data.childrenCount === n ? "selected" : ""}`}
                            onClick={() =>
                              setData((d) => ({ ...d, childrenCount: n }))
                            }
                          >
                            {n}{n === 5 ? "+" : ""}
                          </button>
                        ))}
                      </div>
                    </>
                  )}

                  <div className="section-label">
                    Hoeveel dagen per week kun je trainen?
                  </div>
                  <div className="pill-grid">
                    {TRAINING_DAYS.map((d) => (
                      <button
                        key={d}
                        className={`pill-btn ${data.trainingDaysAvailable === d ? "selected" : ""}`}
                        onClick={() =>
                          setData((prev) => ({
                            ...prev,
                            trainingDaysAvailable: d,
                          }))
                        }
                      >
                        {d} dagen
                      </button>
                    ))}
                  </div>

                  <div className="section-label">Wanneer wil je starten?</div>
                  <div className="pill-grid">
                    {START_URGENCIES.map((u) => (
                      <button
                        key={u.id}
                        className={`pill-btn ${data.startUrgency === u.id ? "selected" : ""}`}
                        onClick={() =>
                          setData((d) => ({ ...d, startUrgency: u.id }))
                        }
                      >
                        {u.label}
                      </button>
                    ))}
                  </div>

                  <div className="nav-row">
                    <button className="back-btn" onClick={prevStep}>
                      ← Terug
                    </button>
                    <button
                      className="next-btn"
                      onClick={nextStep}
                      disabled={!canProceed()}
                    >
                      {scanPath === "pain" ? "Volgende →" : "Verder →"}
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP: Pain Location + Timing ── */}
              {currentStepId === "pain_location" && (
                <div style={{ animation: "fadeUp 0.35s ease both" }}>
                  <div className="step-label">Pijnanalyse</div>
                  <div className="step-title">
                    Waar ervaar je pijn of ongemak?
                  </div>
                  <div className="step-sub">
                    Selecteer alle gebieden die van toepassing zijn.
                  </div>

                  <div className="options-grid">
                    {PAIN_LOCATIONS.map((loc) => {
                      const sel = painData.painLocations.includes(loc.id);
                      return (
                        <button
                          key={loc.id}
                          className={`option-card ${sel ? "selected" : ""}`}
                          onClick={() =>
                            setPainData((d) => ({
                              ...d,
                              painLocations: toggleMulti(d.painLocations, loc.id),
                            }))
                          }
                        >
                          <span className="option-icon">{loc.icon}</span>
                          <span className="option-label">{loc.label}</span>
                          <span className="option-sub">{loc.sub}</span>
                          <span className="option-check">✓</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="section-label" style={{ marginTop: "28px" }}>
                    Wanneer heb je de meeste last?
                  </div>
                  <div className="options-grid">
                    {PAIN_TIMINGS.map((t) => (
                      <button
                        key={t.id}
                        className={`option-card ${painData.painTiming === t.id ? "selected" : ""}`}
                        onClick={() =>
                          setPainData((d) => ({ ...d, painTiming: t.id }))
                        }
                      >
                        <span className="option-icon">{t.icon}</span>
                        <span className="option-label">{t.label}</span>
                        <span className="option-sub">{t.sub}</span>
                        <span className="option-check">✓</span>
                      </button>
                    ))}
                  </div>

                  <div className="nav-row">
                    <button className="back-btn" onClick={prevStep}>
                      ← Terug
                    </button>
                    <button
                      className="next-btn"
                      onClick={nextStep}
                      disabled={!canProceed()}
                    >
                      Volgende →
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP: Pain Details (intensity + duration) ── */}
              {currentStepId === "pain_details" && (
                <div style={{ animation: "fadeUp 0.35s ease both" }}>
                  <div className="step-label">Pijnanalyse</div>
                  <div className="step-title">
                    Hoe erg en hoe lang heb je last?
                  </div>
                  <div className="step-sub">
                    Dit bepaalt de aanpak en urgentie van je plan.
                  </div>

                  <div className="section-label">
                    Gemiddeld pijnniveau (1–10)
                  </div>
                  <div className="scale-row">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                      <button
                        key={n}
                        className={`scale-btn ${painData.painIntensity === n ? "selected" : ""}`}
                        onClick={() =>
                          setPainData((d) => ({ ...d, painIntensity: n }))
                        }
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  <div className="scale-labels">
                    <span>Licht ongemak</span>
                    <span>Ondraaglijk</span>
                  </div>

                  <div className="section-label">Hoe lang heb je al last?</div>
                  <div className="options-grid">
                    {PAIN_DURATIONS.map((pd) => (
                      <button
                        key={pd.id}
                        className={`option-card ${painData.painDuration === pd.id ? "selected" : ""}`}
                        onClick={() =>
                          setPainData((d) => ({ ...d, painDuration: pd.id }))
                        }
                      >
                        <span className="option-icon">{pd.icon}</span>
                        <span className="option-label">{pd.label}</span>
                        <span className="option-sub">{pd.sub}</span>
                        <span className="option-check">✓</span>
                      </button>
                    ))}
                  </div>

                  <div className="nav-row">
                    <button className="back-btn" onClick={prevStep}>
                      ← Terug
                    </button>
                    <button
                      className="next-btn"
                      onClick={nextStep}
                      disabled={!canProceed()}
                    >
                      Volgende →
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP: Pain Triggers ── */}
              {currentStepId === "pain_triggers" && (
                <div style={{ animation: "fadeUp 0.35s ease both" }}>
                  <div className="step-label">Pijnanalyse</div>
                  <div className="step-title">
                    Welke bewegingen verergeren de pijn?
                  </div>
                  <div className="step-sub">
                    Selecteer alles wat van toepassing is.
                  </div>

                  <div className="options-grid">
                    {PAIN_TRIGGERS.map((tr) => {
                      const sel = painData.painTriggers.includes(tr.id);
                      return (
                        <button
                          key={tr.id}
                          className={`option-card ${sel ? "selected" : ""}`}
                          onClick={() =>
                            setPainData((d) => ({
                              ...d,
                              painTriggers: toggleMulti(d.painTriggers, tr.id),
                            }))
                          }
                        >
                          <span className="option-icon">{tr.icon}</span>
                          <span className="option-label">{tr.label}</span>
                          <span className="option-sub">{tr.sub}</span>
                          <span className="option-check">✓</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="nav-row">
                    <button className="back-btn" onClick={prevStep}>
                      ← Terug
                    </button>
                    <button
                      className="next-btn"
                      onClick={nextStep}
                      disabled={!canProceed()}
                    >
                      Bekijk Mijn Analyse →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══════ GATE (email capture) ═══════ */}
          {phase === "gate" && (
            <div className="gate">
              <div className="gate-box">
                <div className="gate-eyebrow">
                  Scan voltooid —{" "}
                  {scanPath === "pain"
                    ? "Pijn & Prestatie Analyse"
                    : scanPath === "fysio"
                    ? "Fysio Intake"
                    : "Performance Profiel"}
                </div>
                <div className="gate-title">
                  {scanPath === "pain" ? (
                    <>
                      Je rapport is klaar.
                      <br />
                      Waar moeten we het naartoe sturen?
                    </>
                  ) : (
                    <>
                      Nog één stap.
                      <br />
                      Hoe kunnen we je bereiken?
                    </>
                  )}
                </div>
                <div className="gate-sub">
                  {scanPath === "pain"
                    ? "Vul je gegevens in om je persoonlijke bewegingsanalyse en 7-daags correctief plan direct via e-mail te ontvangen."
                    : "Je coach ontvangt je volledige profiel en neemt binnen 24 uur contact met je op om je schema te bespreken."}
                </div>

                {error && (
                  <div className="gate-error">
                    ⚠ {error} — probeer het opnieuw
                  </div>
                )}

                {scanPath === "pain" && (
                  <div className="gate-preview">
                    <div className="preview-pill">
                      Bewegingsbeperkingen: geïdentificeerd
                    </div>
                    <div className="preview-pill">
                      Risico Niveau: geanalyseerd
                    </div>
                    <div className="preview-pill">
                      7-Daags Plan: gegenereerd
                    </div>
                    <div className="preview-pill">
                      Expert Beoordeling: gereed
                    </div>
                  </div>
                )}

                <div className="gate-fields">
                  <div className="field-wrap">
                    <label className="field-label">Voornaam</label>
                    <input
                      className="field-input"
                      type="text"
                      placeholder="Jan"
                      value={userInfo.name}
                      onChange={(e) =>
                        setUserInfo((p) => ({ ...p, name: e.target.value }))
                      }
                    />
                  </div>
                  <div className="field-wrap">
                    <label className="field-label">E-mailadres</label>
                    <input
                      className="field-input"
                      type="email"
                      placeholder="jan@voorbeeld.nl"
                      value={userInfo.email}
                      onChange={(e) =>
                        setUserInfo((p) => ({ ...p, email: e.target.value }))
                      }
                    />
                    {userInfo.email &&
                      userInfo.email.includes("@") &&
                      !isValidEmail(userInfo.email) && (
                        <div
                          style={{
                            fontSize: "10px",
                            color: "#ff6b6b",
                            marginTop: "6px",
                            letterSpacing: "0.5px",
                          }}
                        >
                          Check je emailadres — dit lijkt niet geldig
                        </div>
                      )}
                  </div>
                </div>

                {scanPath === "fysio" && (
                  <div className="field-wrap" style={{ marginBottom: "18px" }}>
                    <label className="field-label">
                      Naam fysiotherapeut / praktijk (optioneel)
                    </label>
                    <input
                      className="field-input"
                      type="text"
                      placeholder="Bijv. FysioFit Amsterdam"
                      value={data.referralSource || ""}
                      onChange={(e) =>
                        setData((d) => ({
                          ...d,
                          referralSource: e.target.value,
                        }))
                      }
                    />
                  </div>
                )}

                <button
                  className="submit-btn"
                  onClick={handleGateSubmit}
                  disabled={
                    !userInfo.name ||
                    !userInfo.email ||
                    !isValidEmail(userInfo.email) ||
                    submitting
                  }
                >
                  {submitting
                    ? "Bezig met versturen…"
                    : scanPath === "pain"
                    ? "Analyseer Mijn Beweging →"
                    : "Verstuur Naar Mijn Coach →"}
                </button>
                <div className="submit-note">
                  {scanPath === "pain"
                    ? "Je resultaten worden direct gemaild · Geen spam, ooit"
                    : "Je coach ontvangt je volledige profiel · Geen spam, ooit"}
                </div>
              </div>
            </div>
          )}

          {/* ═══════ ANALYZING (pain path only) ═══════ */}
          {phase === "analyzing" && (
            <div className="analyzing">
              <div className="analyzing-spinner" />
              <div className="analyzing-title">
                Je bewegingsprofiel analyseren…
              </div>
              <div className="analyzing-sub">
                Je persoonlijke rapport opbouwen
              </div>
              <div className="analyzing-steps">
                {ANALYZE_STEPS.map((s, i) => (
                  <div
                    key={i}
                    className={`a-step ${analyzeStep > i ? "active" : ""}`}
                    style={{ animationDelay: `${i * 0.12}s` }}
                  >
                    {analyzeStep > i ? "✓ " : "○ "}
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══════ RESULT (pain path — AI analysis) ═══════ */}
          {phase === "result" && result && (
            <div className="result">
              <div className="result-hero">
                <div className="result-eyebrow">
                  Pijn & Prestatie Rapport · {userInfo.name}
                </div>
                <div className="result-name">
                  {result.headline ? (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: result.headline.replace(
                          /\*(.+?)\*/g,
                          "<em>$1</em>"
                        ),
                      }}
                    />
                  ) : (
                    <>
                      Bewegingsanalyse
                      <br />
                      voltooid voor <em>{userInfo.name}</em>
                    </>
                  )}
                </div>
                <div className="risk-row">
                  {result.overall_risk && (
                    <span
                      className={`risk-tag ${getRiskClass(result.overall_risk)}`}
                    >
                      Risico: {result.overall_risk}
                    </span>
                  )}
                  {result.primary_area && (
                    <span className="risk-tag risk-neutral">
                      Primair: {result.primary_area}
                    </span>
                  )}
                  {result.urgency && (
                    <span className="risk-tag risk-moderate">
                      {result.urgency}
                    </span>
                  )}
                </div>
              </div>

              {/* MOVEMENT LIMITATIONS */}
              <div className="r-section">
                <div className="r-sec-head">
                  <span className="r-sec-num">01</span>
                  <span className="r-sec-title">
                    Geïdentificeerde Bewegingsbeperkingen
                  </span>
                </div>
                <div className="r-sec-body">
                  {limitations.length > 0 ? (
                    <div className="lim-list">
                      {limitations.map((lim, i) => (
                        <div key={i} className="lim-item">
                          <span className="lim-icon">
                            {lim.icon || "⚠️"}
                          </span>
                          <div>
                            <div className="lim-label">{lim.name || lim}</div>
                            {(lim.description || lim.desc) && (
                              <div className="lim-desc">
                                {lim.description || lim.desc}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>
                      {result.movement_limitations_text ||
                        "Zie gedetailleerde analyse in je e-mail."}
                    </p>
                  )}
                </div>
              </div>

              {/* RISK FACTORS */}
              <div className="r-section" style={{ marginTop: "2px" }}>
                <div className="r-sec-head">
                  <span className="r-sec-num">02</span>
                  <span className="r-sec-title">Risicofactor Analyse</span>
                </div>
                <div className="r-sec-body">
                  {riskFactors.length > 0
                    ? riskFactors.map((r, i) => <p key={i}>• {r}</p>)
                    : (
                        <p>
                          {result.risk_analysis ||
                            result.risk_factors_text ||
                            ""}
                        </p>
                      )}
                </div>
              </div>

              {/* EXPERT ASSESSMENT */}
              {result.coach_insight && (
                <div className="r-section" style={{ marginTop: "2px" }}>
                  <div
                    className="r-sec-head"
                    style={{ background: "#333333" }}
                  >
                    <span
                      className="r-sec-num"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                    >
                      →
                    </span>
                    <span className="r-sec-title">Expert Beoordeling</span>
                  </div>
                  <div className="insight-body">
                    <div className="insight-text">
                      &quot;{result.coach_insight}&quot;
                    </div>
                  </div>
                </div>
              )}

              {/* 7-DAY PLAN */}
              {plan.length > 0 && (
                <div className="r-section" style={{ marginTop: "2px" }}>
                  <div className="r-sec-head">
                    <span className="r-sec-num">03</span>
                    <span className="r-sec-title">
                      Je 7-Daags Correctief Plan
                    </span>
                  </div>
                  <div className="r-sec-body" style={{ padding: "16px" }}>
                    <div className="plan-list">
                      {plan.map((day, i) => (
                        <div key={i} className="plan-day">
                          <div
                            className="plan-day-head"
                            onClick={() =>
                              setExpandedDays((p) => ({
                                ...p,
                                [i]: !p[i],
                              }))
                            }
                          >
                            <span className="plan-day-num">
                              Dag {day.day || i + 1}
                            </span>
                            <span className="plan-day-title">
                              {day.title || day.theme || `Dag ${i + 1}`}
                            </span>
                            {day.focus && (
                              <span className="plan-day-focus">
                                {day.focus}
                              </span>
                            )}
                          </div>
                          {expandedDays[i] && (
                            <div className="plan-day-body">
                              <div className="ex-list">
                                {(day.exercises || []).map((ex, j) => (
                                  <div key={j} className="ex-item">
                                    <span className="ex-num">
                                      {String(j + 1).padStart(2, "0")}
                                    </span>
                                    <div>
                                      <div className="ex-name">{ex.name}</div>
                                      {(ex.sets ||
                                        ex.reps ||
                                        ex.duration) && (
                                        <div className="ex-spec">
                                          {[ex.sets, ex.reps || ex.duration]
                                            .filter(Boolean)
                                            .join(" · ")}
                                        </div>
                                      )}
                                      {ex.note && (
                                        <div className="ex-note">
                                          {ex.note}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                              {day.note && (
                                <div className="day-note">{day.note}</div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* CALL CTA */}
              {showCallCTA && (
                <div className="call-block">
                  <div>
                    <div className="call-eyebrow">
                      Aanbevolen volgende stap
                    </div>
                    <div className="call-title">
                      Boek een Gratis Strategiegesprek
                    </div>
                    <div className="call-desc">
                      Op basis van jouw profiel zou een 30-minuten sessie met
                      Max je een precieze diagnose geven en een
                      versnellingsprotocol gericht op jouw lichaam en leefstijl.
                    </div>
                  </div>
                  <a
                    href="https://calendly.com/max-9tofit/performance-strategy-call"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="call-btn"
                  >
                    Boek Gratis Gesprek →
                  </a>
                </div>
              )}

              <div className={`email-bar ${emailSent ? "sent" : ""}`}>
                <span className="email-dot" />
                {emailSent
                  ? `Volledig rapport verzonden naar ${userInfo.email}`
                  : "Je rapport via e-mail versturen…"}
              </div>
              <button className="restart-btn" onClick={reset}>
                ← Nieuwe Scan Starten
              </button>
            </div>
          )}

          {/* ═══════ SUCCESS (fitness/fysio paths) ═══════ */}
          {phase === "success" && (
            <div className="success">
              <div className="success-icon">
                {scanPath === "fysio" ? "🤝" : "💪"}
              </div>
              <div className="success-title">
                {scanPath === "fysio"
                  ? "Je intake is ontvangen!"
                  : "Je profiel is verzonden!"}
              </div>
              <div className="success-sub">
                {scanPath === "fysio"
                  ? "Je coach Max ontvangt nu je volledige profiel en neemt zo snel mogelijk contact met je op om je programma te bespreken."
                  : "Je coach Max heeft je profiel ontvangen en bouwt een schema op maat. Je ontvangt binnen 24 uur bericht."}
              </div>
              <div className="success-steps">
                <div className="success-step">
                  <span className="success-step-num">01</span>
                  <div className="success-step-text">
                    Check je inbox — je ontvangt een magic link om direct in te
                    loggen in de 9toFit app.
                  </div>
                </div>
                <div className="success-step">
                  <span className="success-step-num">02</span>
                  <div className="success-step-text">
                    Je coach bekijkt je profiel en stelt een persoonlijk
                    trainingsschema op.
                  </div>
                </div>
                <div className="success-step">
                  <span className="success-step-num">03</span>
                  <div className="success-step-text">
                    Je kunt direct starten zodra je schema klaarstaat in de app.
                  </div>
                </div>
              </div>
              <a
                href="https://calendly.com/max-9tofit/performance-strategy-call"
                target="_blank"
                rel="noopener noreferrer"
                className="call-btn"
                style={{ margin: "0 auto", display: "inline-flex" }}
              >
                Plan een Kennismakingsgesprek →
              </a>
              <div style={{ marginTop: "20px" }}>
                <button className="restart-btn" onClick={reset}>
                  ← Nieuwe Scan Starten
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
