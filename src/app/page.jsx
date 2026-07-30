"use client";
import { useState, useEffect } from "react";
import { useT, useLocale } from "../lib/i18n";
import { trackLead, trackSchedule, getFbCookies, newEventId, hasConsent } from "../lib/metaPixel";

const CALENDLY_URL =
  (typeof process !== "undefined" &&
    process.env &&
    process.env.NEXT_PUBLIC_CALENDLY_URL) ||
  "https://calendly.com/max-9tofit/performance-strategy-call";

const WHATSAPP_URL =
  (typeof process !== "undefined" &&
    process.env &&
    process.env.NEXT_PUBLIC_WHATSAPP_URL) ||
  "https://wa.me/31640113182";

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
  /* VALUE STACK (landing — concrete beloning i.p.v. abstracte pijlers) */
  .value-stack { display: flex; flex-direction: column; gap: 12px; margin-bottom: 40px; }
  .vs-item { display: flex; gap: 12px; align-items: flex-start; }
  .vs-ic { color: var(--green); font-weight: 900; font-size: 14px; flex-shrink: 0; line-height: 1.5; }
  .vs-tx { font-size: 14px; color: var(--text); line-height: 1.5; }
  .vs-tx b { color: #ffffff; font-weight: 700; }
  .cta-row { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
  .cta-btn {
    display: inline-flex; align-items: center; gap: 10px;
    background: var(--accent); color: #ffffff; border: none;
    font-size: 15px; font-weight: 800;
    padding: 16px 32px; cursor: pointer; transition: all 0.2s; border-radius: var(--radius-sm);
  }
  .cta-btn:hover { background: var(--accent-hover); transform: translateY(-1px); box-shadow: 0 8px 24px rgba(249,115,22,0.3); }
  .cta-note { font-size: 11px; color: var(--muted-light); }
  .landing-cred { display: flex; align-items: center; gap: 10px; background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 10px 12px; margin: -20px 0 32px; }
  .landing-cred .lc-av { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg,#f97316,#E8590C); display: flex; align-items: center; justify-content: center; font-weight: 900; color: #fff; font-size: 14px; flex-shrink: 0; }
  .landing-cred .lc-t { font-size: 12px; color: var(--muted); line-height: 1.35; }
  .landing-cred .lc-t b { color: #fff; display: block; font-size: 12.5px; }

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
  .step-reassure { font-size: 13px; color: var(--muted-light); margin: -16px 0 24px; line-height: 1.5; }
  .path-card::after { content: "→"; position: absolute; top: 20px; right: 20px; color: var(--muted-light); font-size: 18px; font-weight: 700; transition: color .2s, transform .2s; }
  .path-card:hover::after { color: var(--accent); transform: translateX(3px); }
  .path-card {
    position: relative;
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
    border-radius: var(--radius-sm); color: #ffffff; font-size: 16px; font-family: inherit;
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
  .gate-fields { display: grid; grid-template-columns: 1fr; gap: 14px; margin-bottom: 18px; }
  @media(max-width:560px){ .gate-fields { grid-template-columns: 1fr; } }
  .field-wrap { display: flex; flex-direction: column; gap: 6px; }
  .field-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--muted); }
  .field-input {
    background: var(--paper); border: 2px solid var(--border); border-radius: var(--radius-sm);
    color: #ffffff; font-size: 16px;
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

  /* INSTANT PROFIEL */
  .profile-card { text-align: left; background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; margin: 0 auto 28px; max-width: 460px; }
  .profile-kicker { font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; color: var(--accent); margin-bottom: 8px; }
  .profile-title { font-size: 19px; font-weight: 900; color: #fff; line-height: 1.2; margin-bottom: 14px; letter-spacing: -0.2px; }
  .profile-score { display: flex; align-items: center; gap: 14px; background: var(--paper); border: 1px solid var(--border); border-radius: 14px; padding: 12px 14px; margin-bottom: 12px; }
  .profile-ring { width: 56px; height: 56px; border-radius: 50%; flex-shrink: 0; position: relative; display: flex; align-items: center; justify-content: center; }
  .profile-ring-in { position: absolute; inset: 6px; background: var(--paper); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
  .profile-ring-in b { font-size: 15px; font-weight: 900; color: #fff; }
  .profile-score-lbl { font-size: 13px; color: #fff; font-weight: 800; }
  .profile-insight { display: flex; gap: 11px; background: var(--paper); border: 1px solid var(--border); border-radius: 13px; padding: 12px; margin-bottom: 9px; }
  .profile-insight.strong { border-color: rgba(74,222,128,0.35); }
  .profile-insight.grow { border-color: rgba(249,115,22,0.38); }
  .profile-insight.watch { border-color: rgba(96,165,250,0.35); }
  .pi-ic { font-size: 19px; line-height: 1; flex-shrink: 0; margin-top: 1px; }
  .pi-h { font-size: 12.5px; font-weight: 800; color: #fff; margin-bottom: 3px; }
  .pi-t { font-size: 12px; color: var(--muted); line-height: 1.5; }
  .profile-plan { background: var(--warm); border: 1px solid var(--border); border-radius: 14px; padding: 13px; margin-top: 14px; }
  .pp-head { font-size: 12.5px; font-weight: 900; color: #fff; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; }
  .pp-head span { font-size: 10px; font-weight: 800; color: var(--green); background: var(--green-light); padding: 3px 8px; border-radius: 999px; }
  .pp-day { display: flex; align-items: center; gap: 10px; padding: 7px 0; border-top: 1px solid var(--border); font-size: 12.5px; }
  .pp-day:first-of-type { border-top: none; }
  .pp-num { width: 20px; height: 20px; border-radius: 6px; background: var(--accent-light); color: var(--accent); font-size: 11px; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .pp-lbl { color: #fff; font-weight: 700; flex: 1; }
  .pp-ic { font-size: 15px; }

  /* ─────────── MOBIEL ─────────── */
  @media (max-width: 640px) {
    .main { padding: 0 16px 44px; }
    .landing { padding-top: 40px; }
    .landing-h1 { margin-bottom: 16px; }
    .landing-sub { margin-bottom: 28px; }
    .value-stack { margin-bottom: 28px; gap: 11px; }
    .cta-row { flex-direction: column; align-items: stretch; gap: 12px; }
    .cta-btn { width: 100%; justify-content: center; padding: 17px 24px; font-size: 16px; }
    .cta-note { text-align: center; }
    .step-container { padding-top: 32px; }
    .step-sub { margin-bottom: 22px; }
    .path-card { padding: 18px; }
    .option-label { font-size: 14px; }
    .analyzing { padding-top: 64px; }
    .success { padding-top: 44px; }
    .submit-btn { padding: 17px; font-size: 16px; }
    .profile-card { padding: 16px; }
  }

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

// Funnel v2 — intentie (koopbereidheid). Bepaalt samen met urgentie de lead-tier.
const INTENTS = [
  { id: "coach_now", label: "Ik wil dit nú aanpakken met begeleiding", icon: "🚀", sub: "Klaar om te starten met een coach" },
  { id: "serious", label: "Serieus, maar ik wil eerst weten wat er speelt", icon: "🔍", sub: "Ik overweeg het en wil inzicht" },
  { id: "explore", label: "Ik oriënteer me / doe het liever zelf", icon: "🧭", sub: "Rondkijken, nog geen concrete plannen" },
];

const INTENT_SCORE = { coach_now: 3, serious: 2, explore: 1 };
const URGENCY_SCORE = { direct: 3, this_week: 2, soon: 1 };

// Bereken lead-score + tier uit intentie, urgentie en profiel-signalen.
function computeLeadTier(data, painData, scanPath) {
  const intentPts = INTENT_SCORE[data.intent] || 1;
  const urgencyPts = URGENCY_SCORE[data.startUrgency] || 0;
  let score = intentPts + urgencyPts;

  // Modifiers
  if (scanPath === "pain") {
    if (["chronic", "longterm"].includes(painData.painDuration)) score += 1;
    if ((painData.painIntensity || 0) >= 7) score += 1;
  }
  if (parseInt(data.trainingDaysAvailable, 10) >= 4) score += 1;
  if (["25-35", "35-45", "45-55"].includes(data.ageRange)) score += 1;

  let tier = score >= 6 ? "hot" : score >= 3 ? "warm" : "cold";

  // Harde regels
  if (data.intent === "explore" && tier === "hot") tier = "warm"; // zelf-doener nooit hot
  if (data.intent === "coach_now" && ["direct", "this_week"].includes(data.startUrgency)) tier = "hot";

  return { score, tier };
}

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

const PAIN_ONSETS = [
  { icon: "⚡", label: "Plotseling / na een moment", id: "sudden", sub: "Verkeerde beweging, tillen of sport" },
  { icon: "🌊", label: "Geleidelijk opgebouwd", id: "gradual", sub: "Sluipend erger geworden" },
  { icon: "🛋️", label: "Na periode van inactiviteit", id: "inactivity", sub: "Na rust, ziekte of veel zitten" },
  { icon: "❓", label: "Geen duidelijke aanleiding", id: "unknown", sub: "Zomaar ontstaan" },
];

const PAIN_EASERS = [
  { icon: "🛌", label: "Rust", id: "rest", sub: "Even niets doen lucht op" },
  { icon: "🔥", label: "Bewegen / warm worden", id: "movement", sub: "Losser na opwarmen" },
  { icon: "🧘", label: "Rekken / mobiliseren", id: "stretch", sub: "Stretchen helpt" },
  { icon: "🧊", label: "Warmte of kou", id: "temperature", sub: "Warmtepakking of ijs" },
  { icon: "🚫", label: "Niets helpt echt", id: "nothing", sub: "Blijft constant aanwezig" },
];

const PAIN_RED_FLAGS = [
  { icon: "⚡", label: "Uitstraling of tintelingen", id: "radiating", sub: "Naar arm, been, hand of voet" },
  { icon: "🦵", label: "Krachtverlies of gevoelloosheid", id: "weakness", sub: "Spierzwakte of doof gevoel" },
  { icon: "🌙", label: "Pijn die je 's nachts wakker maakt", id: "night_pain", sub: "Wordt niet minder in rust" },
  { icon: "✅", label: "Nee, niets hiervan", id: "none", sub: "Geen van deze signalen" },
];

const PAIN_FUNCTIONS = [
  { icon: "🏋️", label: "Door de knieën zakken", id: "squat", sub: "Hurken doet pijn of lukt niet" },
  { icon: "🙆", label: "Boven je hoofd reiken", id: "overhead", sub: "Arm heffen beperkt of pijnlijk" },
  { icon: "🧍", label: "Op één been staan", id: "balance", sub: "Balans of stabiliteit slecht" },
  { icon: "🤸", label: "Bukken naar je tenen", id: "forward_bend", sub: "Voorover buigen beperkt" },
  { icon: "✅", label: "Deze gaan allemaal prima", id: "none", sub: "Geen beperking hierin" },
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

  // i18n
  const t = useT();
  const locale = useLocale();

  // Sync <html lang="..."> with current locale for SEO and a11y.
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale === "en" ? "en-US" : "nl-NL";
    }
  }, [locale]);

  // Scan path: 'fysio' | 'fitness' | 'pain'
  const [scanPath, setScanPath] = useState("");

  // Landing-hook variant (via ?hook=...). Laat de landing-kop matchen met de
  // koude outreach (bijv. ?hook=kantoorlijf voor rug-/nekklachten bij
  // kantoorwerk). Leeg = de algemene landing voor gemengd verkeer.
  const [hook, setHook] = useState("");

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
    intent: "",
    referralSource: "",
  });

  // Pain-specific data
  const [painData, setPainData] = useState({
    painLocations: [],
    painIntensity: 5,
    painDuration: "",
    painTiming: "",
    painTriggers: [],
    painOnset: "",
    painEasers: [],
    painRedFlags: [],
    painFunction: [],
  });

  // User info (gate) — v2: naam, e-mail en telefoon als drie losse vraagstappen
  const [userInfo, setUserInfo] = useState({ name: "", email: "", phone: "" });
  const [gateStep, setGateStep] = useState(0); // 0 = naam, 1 = e-mail, 2 = telefoon

  // AI result (pain path only)
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [emailSent, setEmailSent] = useState(false);
  const [analyzeStep, setAnalyzeStep] = useState(0);
  const [expandedDays, setExpandedDays] = useState({ 0: true });
  const [submitting, setSubmitting] = useState(false);
  // Visitor-id van de 9toFit-tracker op de parent-pagina (9tofit.nl). De scan
  // draait cross-origin (vercel.app) en kan de _9tf_vid cookie niet zelf lezen,
  // dus we vragen het id op via postMessage (met URL-param als fallback). Wordt
  // meegestuurd naar /api/scan-submit zodat de coach de bezoeker-journey in het
  // CRM aan deze lead gekoppeld ziet i.p.v. "Anoniem".
  const [visitorId, setVisitorId] = useState(null);

  // Vraag het visitor-id op bij de parent-pagina + luister op het antwoord.
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Fallback 1: expliciete URL-param (als de embed die ooit meegeeft).
    try {
      const p = new URLSearchParams(window.location.search).get("_9tf_vid");
      if (p) setVisitorId(p);
    } catch { /* ignore */ }

    const onMsg = (ev) => {
      const d = ev && ev.data;
      if (!d || d.type !== "9tf_vid" || !d.visitorId) return;
      // Accepteer alleen berichten van de 9tofit.nl parent-origins.
      if (ev.origin && !/\.9tofit\.nl$|^https:\/\/9tofit\.nl$/.test(ev.origin)) return;
      setVisitorId((cur) => cur || d.visitorId);
    };
    window.addEventListener("message", onMsg);

    // Vraag het id op; retry een paar keer tegen de laad-race met de tracker.
    let tries = 0;
    const ask = () => {
      try { window.parent.postMessage({ type: "9tf_request_vid" }, "*"); } catch { /* ignore */ }
    };
    ask();
    const iv = setInterval(() => {
      if (++tries >= 6) { clearInterval(iv); return; } // 6 × 500ms = 3s
      ask();
    }, 500);

    return () => { window.removeEventListener("message", onMsg); clearInterval(iv); };
  }, []);

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

  // Check URL params for fysio referral + capture UTM (campagne-attributie)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get("ref") || "";
      if (ref.startsWith("fysio_")) {
        setData((d) => ({ ...d, referralSource: ref }));
        setScanPath("fysio");
        setPhase("assessment");
        setStep(0);
      } else {
        // Deep-link direct in een pad (koude leads springen het keuzescherm over).
        // Werkt via ?pad=pijn|fitness|fysio, of als fallback utm_content=pijn|...
        const PATH_ALIASES = {
          pijn: "pain", pain: "pain",
          fitness: "fitness", fit: "fitness",
          fysio: "fysio", physio: "fysio",
        };
        const padParam = (params.get("pad") || params.get("path") || "").toLowerCase();
        const utmContent = (params.get("utm_content") || "").toLowerCase();
        const deepPath = PATH_ALIASES[padParam] || PATH_ALIASES[utmContent] || "";
        if (deepPath) {
          setScanPath(deepPath);
          setPhase("assessment");
          setStep(0);
        }
      }
      // Landing-hook (matcht de kop met de koude outreach) via ?hook=...
      const hookParam = (params.get("hook") || "").toLowerCase();
      if (hookParam) setHook(hookParam);
      // UTM vastleggen zodat de coach in het CRM ziet welke advertentie/kanaal
      // een scan-lead opleverde. Wordt meegestuurd naar /api/scan-submit en daar
      // in scan_submissions.answers bewaard; bridge-lead leidt er de route uit af.
      const utm = {
        source: params.get("utm_source") || null,
        medium: params.get("utm_medium") || null,
        campaign: params.get("utm_campaign") || null,
        content: params.get("utm_content") || null,
        term: params.get("utm_term") || null,
      };
      if (utm.source || utm.medium || utm.campaign) {
        setData((d) => ({ ...d, utm }));
      }
    }
  }, []);

  // ── Build dynamic question steps based on path ──
  const getSteps = () => {
    // Pijn-pad opent met de makkelijkste, meest herkenbare vraag ("waar zit het?")
    // zodat een koude lead direct momentum pakt vóór de zwaardere profielvragen.
    // V3: één vraag per scherm — korte, glasheldere stappen (Typeform-stijl).
    if (scanPath === "pain") {
      // Klinische stappen eerst — dit voelt als een écht bewegingsonderzoek,
      // pas daarna de profiel-/kwalificatievragen. De kinderen-vraag stellen
      // we op het pijnpad bewust niet (voelt als datagraaien in een pijnscan).
      return [
        "pain_location",
        "pain_timing",
        "pain_intensity",
        "pain_duration",
        "pain_onset",
        "pain_easers",
        "pain_triggers",
        "pain_red_flags",
        "pain_function",
        "age",
        "training_background",
        "intent",
        "work_situation",
        "work_hours",
        "training_days",
        "start_urgency",
      ];
    }
    // Fitness/fysio: profiel-vragen (geen pijn-stappen; fysio-context in de gate).
    return [
      "age",
      "training_background",
      "goals",
      "intent",
      "work_situation",
      "work_hours",
      "children",
      "training_days",
      "start_urgency",
    ];
  };

  const steps = getSteps();
  const leadTier = computeLeadTier(data, painData, scanPath).tier;
  // "Je gaf aan er nu mee aan de slag te willen" + WhatsApp-belofte alleen
  // tonen als de bezoeker dat ook écht aangaf (intent = nu een coach). Een
  // lead kan ook hot worden door klacht/leeftijd — dan geen valse claim.
  const hotContact = leadTier === "hot" && data.intent === "coach_now";
  const totalSteps = steps.length;
  const currentStepId = steps[step];
  // De 3 contactstappen (naam, e-mail, telefoon) tellen mee als echte stappen,
  // zodat de voortgangsbalk doorloopt tot 100% en het staplabel klopt.
  const GATE_STEPS = 3;
  const totalWithGate = totalSteps + GATE_STEPS;
  const progress =
    totalSteps > 0
      ? phase === "gate"
        ? ((totalSteps + gateStep + 1) / totalWithGate) * 100
        : ((step + 1) / totalWithGate) * 100
      : 0;

  // ── Navigation ──
  const canProceed = () => {
    switch (currentStepId) {
      case "age":
        return !!data.ageRange;
      case "training_background":
        return !!data.trainingBackground;
      case "goals":
        return data.goals.length > 0;
      case "intent":
        return !!data.intent;
      case "work_situation":
        return !!data.workSituation;
      case "work_hours":
        return !!data.workHoursPerWeek;
      case "children":
        return data.hasChildren !== null;
      case "training_days":
        return !!data.trainingDaysAvailable;
      case "start_urgency":
        return !!data.startUrgency;
      case "pain_location":
        return painData.painLocations.length > 0;
      case "pain_timing":
        return !!painData.painTiming;
      case "pain_intensity":
        return painData.painIntensity > 0;
      case "pain_duration":
        return !!painData.painDuration;
      case "pain_onset":
        return !!painData.painOnset;
      case "pain_easers":
        return painData.painEasers.length > 0;
      case "pain_triggers":
        return painData.painTriggers.length > 0;
      case "pain_red_flags":
        return painData.painRedFlags.length > 0;
      case "pain_function":
        return painData.painFunction.length > 0;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (step < totalSteps - 1) {
      setStep((s) => s + 1);
    } else {
      setGateStep(0);
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

  // Multi-select met een exclusieve "geen van deze"-optie: 'none' aanvinken
  // wist de rest, en een echte optie aanvinken wist 'none'. Voorkomt de
  // tegenstrijdige combinatie "Nee, niets hiervan" + een alarmsignaal.
  const toggleWithNone = (arr, val) => {
    if (val === "none") return arr.includes("none") ? [] : ["none"];
    const next = toggleMulti(arr.filter((x) => x !== "none"), val);
    return next;
  };

  // Echte alarmsignalen aangevinkt? (alles behalve 'none')
  const hasRedFlags = painData.painRedFlags.some((f) => f !== "none");

  // ── Submit bij alarmsignalen: géén oefenplan, eerst een gratis check-call ──
  // Bij uitstraling, krachtverlies of nachtpijn is online oefeningen voorschrijven
  // niet verantwoord. De lead gaat wél het platform in, de coach krijgt een
  // alarm-brief, en de bezoeker krijgt een rustig "plan eerst een gesprek"-scherm.
  const runRedFlagSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await submitToPlatform(null);
      fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userInfo.name,
          email: userInfo.email,
          phone: userInfo.phone,
          lang: locale,
          result: null,
          type: "pain_red_flag",
          scanPath: "pain",
          answers: {
            pain_location: painData.painLocations,
            pain_timing: painData.painTiming,
            movement_triggers: painData.painTriggers,
            pain_duration: painData.painDuration,
            pain_intensity: painData.painIntensity,
            pain_onset: painData.painOnset,
            pain_easers: painData.painEasers,
            pain_red_flags: painData.painRedFlags,
            functional_limitations: painData.painFunction,
            work_type: data.workSituation,
            training_history: data.trainingBackground,
            activity_level: data.trainingDaysAvailable,
          },
          extraData: {
            age_range: data.ageRange,
            work_hours_per_week: data.workHoursPerWeek,
            start_urgency: data.startUrgency,
          },
        }),
      })
        .then((r) => { if (r.ok) setEmailSent(true); })
        .catch(() => {});
      setSubmitting(false);
      setPhase("safety");
    } catch (e) {
      setError(e.message);
      setSubmitting(false);
      setGateStep(2);
      setPhase("gate");
    }
  };

  // ── Submit for pain path (AI analysis) ──
  const runPainAnalysis = async () => {
    // Alarmsignalen → geen AI-oefenplan maar de veilige route (call eerst).
    if (hasRedFlags) return runRedFlagSubmit();
    setPhase("analyzing");
    setError(null);
    setAnalyzeStep(0);

    // Start de AI-analyse METEEN, parallel met de stap-animatie. Voorkomt dat
    // het scherm ~20s stil hangt terwijl alle vinkjes al groen staan.
    const analysisPromise = fetch("/api/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "pain_performance",
        lang: locale,
        answers: {
          pain_location: painData.painLocations,
          pain_timing: painData.painTiming,
          movement_triggers: painData.painTriggers,
          pain_duration: painData.painDuration,
          pain_intensity: painData.painIntensity,
          pain_onset: painData.painOnset,
          pain_easers: painData.painEasers,
          pain_red_flags: painData.painRedFlags,
          functional_limitations: painData.painFunction,
          work_type: data.workSituation,
          training_history: data.trainingBackground,
          activity_level: data.trainingDaysAvailable,
          previous_treatment: [],
        },
        userInfo,
      }),
    }).then((r) => r.json());

    // Animeer de eerste stappen; houd de LAATSTE stap "bezig" tot de analyse binnen is.
    for (let i = 0; i < ANALYZE_STEPS.length - 1; i++) {
      await new Promise((r) => setTimeout(r, 1200));
      setAnalyzeStep(i + 1);
    }

    try {
      const aiData = await analysisPromise;
      if (!aiData.success) throw new Error(aiData.error || "Analysis failed");
      setAnalyzeStep(ANALYZE_STEPS.length);
      setResult(aiData.result);
      setPhase("result");

      // Send email report
      fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userInfo.name,
          email: userInfo.email,
          lang: locale,
          result: aiData.result,
          answers: {
            pain_location: painData.painLocations,
            pain_timing: painData.painTiming,
            movement_triggers: painData.painTriggers,
            pain_duration: painData.painDuration,
            pain_intensity: painData.painIntensity,
            pain_onset: painData.painOnset,
            pain_easers: painData.painEasers,
            pain_red_flags: painData.painRedFlags,
            functional_limitations: painData.painFunction,
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
        .then((r) => { if (r.ok) setEmailSent(true); })
        .catch(() => {});

      // Submit to 9toFit platform (account + magic link)
      await submitToPlatform(aiData.result);
    } catch (e) {
      setError(e.message);
      setGateStep(2);
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
          lang: locale,
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
    // Funnel v2: lead-score + tier (koopintentie-kwalificatie)
    const { score: leadScore, tier: leadTier } = computeLeadTier(data, painData, scanPath);
    // Meta-tracking (Fase 2): gedeeld event_id voor browser↔server dedup
    const eventId = newEventId();
    const { fbp, fbc } = getFbCookies();
    const marketingConsent = hasConsent();
    const res = await fetch(`${platformUrl}/api/scan-submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone,
        // Follow-up-Garantie: het veld op de gate zegt letterlijk "Laat je
        // (WhatsApp-)nummer achter zodat je coach je snel kan bereiken" — een
        // ingevuld nummer is dus toestemming om te appen. Reist via scan-submit
        // mee naar de leadkaart (WhatsApp-knop in het CRM).
        whatsapp_consent: isValidPhone(userInfo.phone),
        scan_path: scanPath,
        referral_source: data.referralSource || null,
        utm: data.utm || null,
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
        // Funnel v2 kwalificatie
        intent: data.intent || null,
        lead_score: leadScore,
        lead_tier: leadTier,
        has_pain: isPain,
        pain_locations: isPain ? painData.painLocations : [],
        pain_intensity: isPain ? painData.painIntensity : null,
        pain_duration: isPain ? painData.painDuration : null,
        pain_timing: isPain ? painData.painTiming : null,
        pain_triggers: isPain ? painData.painTriggers : [],
        pain_onset: isPain ? painData.painOnset : null,
        pain_easers: isPain ? painData.painEasers : [],
        pain_red_flags: isPain ? painData.painRedFlags : [],
        functional_limitations: isPain ? painData.painFunction : [],
        scanner_ai_result: aiResult || null,
        event_id: eventId,
        fbp,
        fbc,
        marketing_consent: marketingConsent,
        // Koppelt de anonieme bezoeker-journey (tracker-cookie op 9tofit.nl)
        // aan deze lead in het CRM. Null als de tracker niet reageerde (bv.
        // opt-out/WP-admin) — scan-submit slaat de koppeling dan netjes over.
        visitor_id: visitorId,
      }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || "Account aanmaken mislukt. Probeer het opnieuw.");
    }
    // Lead-event in de browser (zelfde eventId → dedup met server-CAPI)
    trackLead(eventId, { content_name: "performance_scan", scan_path: scanPath });
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
    // Bewaar UTM zodat een 2e scan in dezelfde sessie z'n kanaal-attributie houdt.
    setData((prev) => ({ ageRange: "", trainingBackground: "", goals: [], yearGoalText: "", workSituation: "", workHoursPerWeek: "40", hasChildren: null, childrenCount: 0, trainingDaysAvailable: 3, startUrgency: "", intent: "", referralSource: "", utm: prev.utm }));
    setPainData({ painLocations: [], painIntensity: 5, painDuration: "", painTiming: "", painTriggers: [], painOnset: "", painEasers: [], painRedFlags: [], painFunction: [] });
    setUserInfo({ name: "", email: "", phone: "" });
    setGateStep(0);
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
  const isValidPhone = (p) => (p || "").replace(/\D/g, "").length >= 6;

  // ── Calendly popup + Schedule-tracking (laag 4) ──
  const ensureCalendly = () =>
    new Promise((resolve) => {
      if (typeof window === "undefined") return resolve(false);
      if (window.Calendly) return resolve(true);
      if (!document.getElementById("calendly-css")) {
        const l = document.createElement("link");
        l.id = "calendly-css";
        l.rel = "stylesheet";
        l.href = "https://assets.calendly.com/assets/external/widget.css";
        document.head.appendChild(l);
      }
      const existing = document.getElementById("calendly-js");
      if (!existing) {
        const s = document.createElement("script");
        s.id = "calendly-js";
        s.async = true;
        s.src = "https://assets.calendly.com/assets/external/widget.js";
        s.onload = () => resolve(!!window.Calendly);
        s.onerror = () => resolve(false);
        document.body.appendChild(s);
      } else {
        const iv = setInterval(() => {
          if (window.Calendly) {
            clearInterval(iv);
            resolve(true);
          }
        }, 100);
        setTimeout(() => {
          clearInterval(iv);
          resolve(!!window.Calendly);
        }, 3000);
      }
    });

  const openCalendly = async () => {
    const ok = await ensureCalendly();
    // Neem de gegevens over die de bezoeker al in de scan invulde, zodat ze bij
    // Calendly niet opnieuw naam/e-mail/telefoon hoeven te typen. Voor een
    // 'phone call'-event vult `location` het telefoonnummerveld voor.
    const prefill = {
      name: userInfo.name || undefined,
      email: userInfo.email || undefined,
      location: userInfo.phone || undefined,
    };
    if (ok && typeof window !== "undefined" && window.Calendly) {
      window.Calendly.initPopupWidget({ url: CALENDLY_URL, prefill });
    } else if (typeof window !== "undefined") {
      // Fallback (geen widget): prefill via URL-parameters.
      let url = CALENDLY_URL;
      try {
        const u = new URL(CALENDLY_URL);
        if (userInfo.name) u.searchParams.set("name", userInfo.name);
        if (userInfo.email) u.searchParams.set("email", userInfo.email);
        if (userInfo.phone) u.searchParams.set("location", userInfo.phone);
        url = u.toString();
      } catch {}
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  // Luister naar Calendly's "event_scheduled" → vuur Schedule-pixel met dedup-id.
  useEffect(() => {
    const onMsg = (e) => {
      if (!e || !e.data || typeof e.data !== "object") return;
      if (e.data.event !== "calendly.event_scheduled") return;
      let eventId;
      try {
        const uri =
          e.data.payload &&
          e.data.payload.event &&
          e.data.payload.event.uri;
        if (uri)
          eventId = "cal_" + String(uri).split("/").filter(Boolean).pop();
      } catch {}
      // Alleen firen mét dedup-id, zodat we nooit dubbeltellen t.o.v. de webhook.
      if (eventId) trackSchedule(eventId, { content_name: "strategy_call" });
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  // ────────── RENDER ──────────
  // ── Instant Performance/Herstel-profiel (regel-gebaseerd → direct, geen AI-wachttijd) ──
  const buildProfile = () => {
    const L = locale === "en";
    const exp = data.trainingBackground;
    const days = parseInt(data.trainingDaysAvailable, 10) || 3;
    const work = data.workSituation;
    const primaryGoal = (data.goals && data.goals[0]) || "health";
    const first = ((userInfo.name || "").trim().split(/\s+/)[0]) || (L ? "there" : "");

    if (scanPath === "fysio") {
      return {
        kicker: L ? "Recovery & Performance Profile" : "Herstel & Performance Profiel",
        title: L ? (first ? first + ", your recovery profile is ready" : "Your recovery profile is ready")
                 : (first ? first + ", je herstelprofiel is klaar" : "Je herstelprofiel is klaar"),
        score: null,
        insights: [
          { icon: "📍", kind: "strong", h: L ? "Where you are now" : "Waar je nu staat", t: L ? "Ready to load in a controlled way — the base is there to build on safely." : "Klaar om gecontroleerd te belasten — de basis is er om veilig op door te bouwen." },
          { icon: "🎯", kind: "grow", h: L ? "Where we’re heading" : "Waar we naartoe werken", t: L ? "Building strength and stability so you can train fully again without setbacks." : "Kracht en stabiliteit opbouwen zodat je weer volledig kunt trainen zonder terugval." },
        ],
        planTitle: L ? "Your rebuild plan" : "Je opbouwplan",
        plan: [
          { label: L ? "Activate & stabilise" : "Activeren & stabiliteit", icon: "🩹" },
          { label: L ? "Mobility + control" : "Mobiliteit + controle", icon: "🌊" },
          { label: L ? "Controlled loading" : "Gecontroleerd belasten", icon: "💪" },
        ],
      };
    }

    let score = 72;
    score += ({ never: 0, less_6m: 3, "6m_2y": 6, "2y_4y": 9, "4y_plus": 12 })[exp];
    if (isNaN(score)) score = 76;
    score += days >= 5 ? 6 : days >= 4 ? 4 : days >= 3 ? 2 : 0;
    if (["25-35", "35-45"].includes(data.ageRange)) score += 2;
    score = Math.max(68, Math.min(94, score));

    const strong = (exp === "4y_plus" || exp === "2y_4y")
      ? (L ? "Your training experience and recovery — you can handle serious stimulus and progress fast." : "Je trainingservaring en herstelvermogen — je kunt serieuze prikkels aan en bouwt snel op.")
      : days >= 4
      ? (L ? "Your commitment — " + days + " days a week gives us plenty of room to get results." : "Je toewijding — " + days + " dagen per week geeft ons veel ruimte om resultaat te boeken.")
      : (L ? "Your fresh start — no ingrained habits, so we build the right technique from day one." : "Je frisse start — geen ingesleten fouten, dus we bouwen meteen de juiste techniek en gewoontes op.");

    const GROWTH = {
      muscle: L ? "Structure in progressive overload — a smart plan makes your muscle grow noticeably faster." : "Structuur in progressieve overload — met een slim schema groeit je spiermassa merkbaar sneller.",
      strength: L ? "Systematically building strength in the big lifts — that’s your biggest win." : "Kracht in de grote basisbewegingen systematisch opbouwen — daar zit je grootste winst.",
      fat_loss: L ? "Keeping strength while you lose fat — so you hold your shape and metabolism." : "Kracht behouden terwijl je vet verliest — zo hou je je vorm én je stofwisseling hoog.",
      health: L ? "Consistency and a plan that fits your week — the base for lasting results." : "Consistentie en een schema dat in je week past — de basis voor blijvend resultaat.",
      athletic: L ? "Linking explosiveness and movement quality to strength — that lifts your performance." : "Explosiviteit en bewegingskwaliteit koppelen aan kracht — daar til je je prestatie mee omhoog.",
      painless: L ? "Getting stronger without complaints through the right build-up and mobility." : "Sterker worden zónder klachten door de juiste opbouw en mobiliteit.",
    };
    const WATCH = {
      desk: L ? "Lots of sitting stiffens hips and lower back. We build in mobility so you train heavier without complaints." : "Veel zitwerk maakt heupen en onderrug stug. We bouwen mobiliteit in zodat je zwaarder traint zonder klachten.",
      home: L ? "Working from home blurs work and rest. Fixed training slots keep you consistent." : "Thuiswerken vervaagt werk en rust. Vaste trainingsmomenten houden je consistent.",
      standing: L ? "Standing a lot needs smart recovery. We dose the load so you stay fresh." : "Veel staan vraagt slim herstel. We doseren de belasting zodat je fris blijft.",
      physical: L ? "With physical work, recovery counts double. Your plan complements work instead of doubling the load." : "Naast fysiek werk telt herstel dubbel. Je schema vult je werk aan in plaats van je dubbel te belasten.",
      travel: L ? "Often on the road needs flexibility. Short, effective sessions that work anywhere." : "Veel onderweg vraagt flexibiliteit. Korte, effectieve sessies die overal werken.",
    };
    const D = {
      lower: L ? "Lower body: strength" : "Onderlichaam: kracht",
      upper: L ? "Upper body" : "Bovenlichaam",
      push: L ? "Push & pull" : "Duwen & trekken",
      mob: L ? "Mobility + core" : "Mobiliteit + core",
      explo: L ? "Explosive full body" : "Volledig lichaam: explosief",
      full: L ? "Full body" : "Volledig lichaam",
    };
    let plan;
    if (days <= 2) plan = [{ label: D.full + " A", icon: "💪" }, { label: D.full + " B", icon: "🏋️" }];
    else if (days === 3) plan = [{ label: D.lower, icon: "💪" }, { label: D.upper, icon: "🏋️" }, { label: D.mob, icon: "🌊" }];
    else if (days === 4) plan = [{ label: D.lower, icon: "💪" }, { label: D.push, icon: "🏋️" }, { label: D.mob, icon: "🌊" }, { label: D.explo, icon: "⚡" }];
    else plan = [{ label: D.lower, icon: "💪" }, { label: D.upper, icon: "🏋️" }, { label: D.push, icon: "🏋️" }, { label: D.mob, icon: "🌊" }, { label: D.explo, icon: "⚡" }];

    return {
      kicker: L ? "Performance Profile" : "Performance Profiel",
      title: L ? (first ? first + ", here’s what your body shows" : "Here’s what your body shows")
               : (first ? first + ", dit laat je lichaam nu zien" : "Dit laat je lichaam nu zien"),
      score,
      scoreLabel: L ? "Trainability" : "Trainbaarheid",
      insights: [
        { icon: "💪", kind: "strong", h: L ? "Your strong point" : "Je sterke punt", t: strong },
        { icon: "🎯", kind: "grow", h: L ? "Your biggest opportunity" : "Je grootste groeikans", t: GROWTH[primaryGoal] || GROWTH.health },
        { icon: "🪑", kind: "watch", h: L ? "Watch out for" : "Let op", t: WATCH[work] || WATCH.desk },
      ],
      planTitle: L ? "Your " + days + "-day strength plan" : "Je " + days + "-daags krachtplan",
      plan,
    };
  };

  const profile = phase === "success" && scanPath !== "pain" ? buildProfile() : null;

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
                {hook === "kantoorlijf"
                  ? t('Het Kantoorlijf-onderzoek')
                  : hook === "fysio"
                  ? t('Gratis bewegingsonderzoek')
                  : t('Gratis Performance Scan')}
              </div>
              <h1 className="landing-h1">
                {hook === "kantoorlijf" ? (
                  <>
                    {t('Zittend werk sloopt je')}
                    <br />
                    <em>{t('rug en nek.')}</em> {t('Ontdek wat jouw lichaam nodig heeft.')}
                  </>
                ) : hook === "fysio" ? (
                  <>
                    {t('Van je blessure af —')}
                    <br />
                    <em>{t('zonder te stoppen met trainen.')}</em>
                  </>
                ) : (
                  <>
                    {t('Ontdek wat jouw')}
                    <br />
                    {t('lichaam')} <em>{t('nodig heeft.')}</em>
                  </>
                )}
              </h1>
              <p className="landing-sub">
                {hook === "kantoorlijf"
                  ? t('Doe de gratis 3-minuten scan. Je krijgt een persoonlijke bewegingsanalyse, een concreet plan op jouw klacht, én 2 weken de 9toFit-app om er meteen mee aan de slag te gaan.')
                  : hook === "fysio"
                  ? t('Beantwoord de vragen die je normaal in de praktijk zou krijgen. Je krijgt direct een persoonlijk profiel en een gratis programma — of je nu een klacht hebt of gewoon sterker wilt worden.')
                  : t('Sterker worden, klachten oplossen of terug na een blessure — in 3 minuten ken je je sterke punten, je grootste groeikans én heb je een plan om vandaag te starten.')}
              </p>
              {hook === "fysio" && (
                <div className="landing-cred">
                  <div className="lc-av">M</div>
                  <div className="lc-t"><b>Gemaakt door Max Trentelman</b>{t('Performance & herstelcoach · 9toFit')}</div>
                </div>
              )}
              <div className="value-stack">
                <div className="vs-item">
                  <span className="vs-ic">✓</span>
                  <span className="vs-tx">{t('Persoonlijk profiel — je sterke punten én je grootste groeikans')}</span>
                </div>
                <div className="vs-item">
                  <span className="vs-ic">✓</span>
                  <span className="vs-tx">{t('Een concreet plan dat meteen klaarstaat')}</span>
                </div>
                <div className="vs-item">
                  <span className="vs-ic">✓</span>
                  <span className="vs-tx">{t('2 weken de 9toFit-app gratis — meteen beginnen')}</span>
                </div>
              </div>
              <div className="cta-row">
                <button
                  className="cta-btn"
                  onClick={() => setPhase("path_select")}
                >
                  {t('Start Je Scan')} <span>→</span>
                </button>
                <span className="cta-note">
                  {t('Gratis · 3 minuten · direct je resultaat')}
                </span>
              </div>
            </div>
          )}

          {/* ═══════ PATH SELECTION ═══════ */}
          {phase === "path_select" && (
            <div className="step-container">
              <div className="step-title">{t('Welkom bij 9toFit')}</div>
              <div className="step-sub">{t('Wat brengt je hier vandaag?')}</div>
              <div className="step-reassure">{t('Kies wat het best past — je bent in 3 minuten klaar.')}</div>

              {hook !== "fysio" && (
              <button
                className="path-card fysio"
                onClick={() => handlePathSelect("fysio")}
              >
                <span className="path-icon">🤝</span>
                <div className="path-title">{t('Fysio doorverwijzing')}</div>
                <div className="path-desc">
                  {t('Doorgestuurd door je fysiotherapeut — klachtenvrij en klaar om te trainen.')}
                </div>
                <span className="path-tag blue">{t('Opbouwplan · Intake volgt')}</span>
              </button>
              )}

              <button
                className="path-card fitness"
                onClick={() => handlePathSelect("fitness")}
              >
                <span className="path-icon">💪</span>
                <div className="path-title">{t('Fitter & sterker worden')}</div>
                <div className="path-desc">
                  {t('Ontdek je grootste groeikans + een plan om nu te starten.')}
                </div>
                <span className="path-tag green">
                  {t('Profiel · Krachtplan klaar')}
                </span>
              </button>

              <button
                className="path-card pain"
                onClick={() => handlePathSelect("pain")}
              >
                <span className="path-icon">🩹</span>
                <div className="path-title">{t('Pijn of klachten')}</div>
                <div className="path-desc">
                  {t('Terugkerende blessures, stijfheid of pijn die je training belemmert.')}
                </div>
                <span className="path-tag orange">
                  {t('Gratis bewegingsonderzoek · 7-daags plan')}
                </span>
              </button>

              <div style={{ marginTop: "16px" }}>
                <button className="back-btn" onClick={() => setPhase("landing")}>
                  {t('← Terug')}
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
                    {t('Stap')} {step + 1} {t('van')} {totalWithGate}
                  </span>
                  <span className="progress-label">
                    {scanPath === "pain"
                      ? t("Pijn & Prestatie Scan")
                      : scanPath === "fysio"
                      ? t("Fysio Intake")
                      : t("Performance Scan")}
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
              {/* ── V3: één vraag per scherm ──────────────────────────────── */}

              {/* PROFIEL: leeftijd */}
              {currentStepId === "age" && (
                <div style={{ animation: "fadeUp 0.35s ease both" }}>
                  {scanPath === "fysio" && data.referralSource && (
                    <div className="fysio-notice">
                      {t('Doorgestuurd door je fysiotherapeut — je profiel is al voorbereid.')}
                    </div>
                  )}
                  <div className="step-label">{t('Over jou')}</div>
                  <div className="step-title">{t('Wat is je leeftijd?')}</div>
                  <div className="step-sub">
                    {t('Leeftijd bepaalt hoe we belasting en herstel voor je inschatten.')}
                  </div>
                  <div className="pill-grid">
                    {AGE_RANGES.map((a) => (
                      <button
                        key={a.id}
                        className={`pill-btn ${data.ageRange === a.id ? "selected" : ""}`}
                        onClick={() => setData((d) => ({ ...d, ageRange: a.id }))}
                      >
                        {t(a.label)}
                      </button>
                    ))}
                  </div>
                  <div className="nav-row">
                    <button className="back-btn" onClick={prevStep}>{t('← Terug')}</button>
                    <button className="next-btn" onClick={nextStep} disabled={!canProceed()}>{t('Volgende →')}</button>
                  </div>
                </div>
              )}

              {/* PROFIEL: trainingservaring */}
              {currentStepId === "training_background" && (
                <div style={{ animation: "fadeUp 0.35s ease both" }}>
                  <div className="step-label">{t('Over jou')}</div>
                  <div className="step-title">{t('Wat is je trainingservaring?')}</div>
                  <div className="step-sub">
                    {t('Zo stemmen we het startniveau precies op jou af.')}
                  </div>
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
                        <span className="option-label">{t(bg.label)}</span>
                        <span className="option-check">✓</span>
                      </button>
                    ))}
                  </div>
                  <div className="nav-row">
                    <button className="back-btn" onClick={prevStep}>{t('← Terug')}</button>
                    <button className="next-btn" onClick={nextStep} disabled={!canProceed()}>{t('Volgende →')}</button>
                  </div>
                </div>
              )}

              {/* ── STEP: Goals (fitness/fysio) ── */}
              {currentStepId === "goals" && (
                <div style={{ animation: "fadeUp 0.35s ease both" }}>
                  <div className="step-label">{t('Doelen & Motivatie')}</div>
                  <div className="step-title">{t('Wat wil je bereiken?')}</div>
                  <div className="step-sub">
                    {t('Selecteer alles wat van toepassing is.')}
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
                          <span className="option-label">{t(g.label)}</span>
                          <span className="option-check">✓</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="section-label">
                    {t('Wat wil je het komende jaar bereiken?')}
                  </div>
                  <textarea
                    className="text-area"
                    placeholder={t("Bijv. 'Pijnvrij 3x per week trainen', 'Weer een marathon lopen', '10 kg afvallen en sterker worden'…")}
                    value={data.yearGoalText}
                    onChange={(e) =>
                      setData((d) => ({ ...d, yearGoalText: e.target.value }))
                    }
                  />
                  <div className="text-hint">
                    {t('Optioneel — maar hoe specifieker, hoe beter je coach je kan helpen.')}
                  </div>

                  <div className="nav-row">
                    <button className="back-btn" onClick={prevStep}>{t('← Terug')}</button>
                    <button className="next-btn" onClick={nextStep} disabled={!canProceed()}>{t('Volgende →')}</button>
                  </div>
                </div>
              )}

              {/* ── STEP: Intent (v2 kwalificatie) ── */}
              {currentStepId === "intent" && (
                <div style={{ animation: "fadeUp 0.35s ease both" }}>
                  <div className="step-label">{t('Waar sta je nu?')}</div>
                  <div className="step-title">{t('Wat past het best bij jou?')}</div>
                  <div className="step-sub">
                    {t('Zo weet je coach precies hoe hij je het beste kan helpen.')}
                  </div>

                  <div className="options-grid">
                    {INTENTS.map((it) => (
                      <button
                        key={it.id}
                        className={`option-card ${data.intent === it.id ? "selected" : ""}`}
                        onClick={() =>
                          setData((d) => ({ ...d, intent: it.id }))
                        }
                      >
                        <span className="option-icon">{it.icon}</span>
                        <span className="option-label">{t(it.label)}</span>
                        <span className="option-check">✓</span>
                      </button>
                    ))}
                  </div>

                  <div className="nav-row">
                    <button className="back-btn" onClick={prevStep}>{t('← Terug')}</button>
                    <button className="next-btn" onClick={nextStep} disabled={!canProceed()}>{t('Volgende →')}</button>
                  </div>
                </div>
              )}

              {/* SITUATIE: werksituatie */}
              {currentStepId === "work_situation" && (
                <div style={{ animation: "fadeUp 0.35s ease both" }}>
                  <div className="step-label">{t('Jouw Situatie')}</div>
                  <div className="step-title">{t('Hoe ziet je werkdag eruit?')}</div>
                  <div className="step-sub">
                    {t('Je werkhouding heeft directe invloed op je lichaam en je schema.')}
                  </div>
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
                        <span className="option-label">{t(w.label)}</span>
                        <span className="option-sub">{t(w.sub)}</span>
                        <span className="option-check">✓</span>
                      </button>
                    ))}
                  </div>
                  <div className="nav-row">
                    <button className="back-btn" onClick={prevStep}>{t('← Terug')}</button>
                    <button className="next-btn" onClick={nextStep} disabled={!canProceed()}>{t('Volgende →')}</button>
                  </div>
                </div>
              )}

              {/* SITUATIE: werkuren */}
              {currentStepId === "work_hours" && (
                <div style={{ animation: "fadeUp 0.35s ease both" }}>
                  <div className="step-label">{t('Jouw Situatie')}</div>
                  <div className="step-title">{t('Hoeveel uur werk je per week?')}</div>
                  <div className="step-sub">
                    {t('Zo schatten we je belasting en beschikbare energie in.')}
                  </div>
                  <div className="pill-grid">
                    {WORK_HOURS.map((h) => (
                      <button
                        key={h.id}
                        className={`pill-btn ${data.workHoursPerWeek === h.id ? "selected" : ""}`}
                        onClick={() =>
                          setData((d) => ({ ...d, workHoursPerWeek: h.id }))
                        }
                      >
                        {t(h.label)}
                      </button>
                    ))}
                  </div>
                  <div className="nav-row">
                    <button className="back-btn" onClick={prevStep}>{t('← Terug')}</button>
                    <button className="next-btn" onClick={nextStep} disabled={!canProceed()}>{t('Volgende →')}</button>
                  </div>
                </div>
              )}

              {/* SITUATIE: kinderen (alleen fitness/fysio) */}
              {currentStepId === "children" && (
                <div style={{ animation: "fadeUp 0.35s ease both" }}>
                  <div className="step-label">{t('Jouw Situatie')}</div>
                  <div className="step-title">{t('Heb je kinderen?')}</div>
                  <div className="step-sub">
                    {t('Zo houden we in je schema rekening met je agenda en je herstel.')}
                  </div>
                  <div className="pill-grid">
                    <button
                      className={`pill-btn ${data.hasChildren === false ? "selected" : ""}`}
                      onClick={() =>
                        setData((d) => ({ ...d, hasChildren: false, childrenCount: 0 }))
                      }
                    >
                      {t('Nee')}
                    </button>
                    <button
                      className={`pill-btn ${data.hasChildren === true ? "selected" : ""}`}
                      onClick={() =>
                        setData((d) => ({ ...d, hasChildren: true, childrenCount: d.childrenCount || 1 }))
                      }
                    >
                      {t('Ja')}
                    </button>
                  </div>
                  {data.hasChildren && (
                    <>
                      <div className="section-label">{t('Hoeveel kinderen?')}</div>
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
                  <div className="nav-row">
                    <button className="back-btn" onClick={prevStep}>{t('← Terug')}</button>
                    <button className="next-btn" onClick={nextStep} disabled={!canProceed()}>{t('Volgende →')}</button>
                  </div>
                </div>
              )}

              {/* SITUATIE: trainingsdagen */}
              {currentStepId === "training_days" && (
                <div style={{ animation: "fadeUp 0.35s ease both" }}>
                  <div className="step-label">{t('Jouw Situatie')}</div>
                  <div className="step-title">
                    {t('Hoeveel dagen per week kun je trainen?')}
                  </div>
                  <div className="step-sub">
                    {t('Wees realistisch — consistentie wint van volume.')}
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
                        {d} {t('dagen')}
                      </button>
                    ))}
                  </div>
                  <div className="nav-row">
                    <button className="back-btn" onClick={prevStep}>{t('← Terug')}</button>
                    <button className="next-btn" onClick={nextStep} disabled={!canProceed()}>{t('Volgende →')}</button>
                  </div>
                </div>
              )}

              {/* SITUATIE: startmoment (laatste vraag vóór de contactstappen) */}
              {currentStepId === "start_urgency" && (
                <div style={{ animation: "fadeUp 0.35s ease both" }}>
                  <div className="step-label">{t('Jouw Situatie')}</div>
                  <div className="step-title">{t('Wanneer wil je starten?')}</div>
                  <div className="step-sub">
                    {t('Geen verplichting — dit helpt je coach de juiste prioriteit te geven.')}
                  </div>
                  <div className="pill-grid">
                    {START_URGENCIES.map((u) => (
                      <button
                        key={u.id}
                        className={`pill-btn ${data.startUrgency === u.id ? "selected" : ""}`}
                        onClick={() =>
                          setData((d) => ({ ...d, startUrgency: u.id }))
                        }
                      >
                        {t(u.label)}
                      </button>
                    ))}
                  </div>
                  <div className="nav-row">
                    <button className="back-btn" onClick={prevStep}>{t('← Terug')}</button>
                    <button className="next-btn" onClick={nextStep} disabled={!canProceed()}>
                      {scanPath === "pain" ? t('Bekijk Mijn Analyse →') : t('Verder →')}
                    </button>
                  </div>
                </div>
              )}

              {/* PIJN: locatie */}
              {currentStepId === "pain_location" && (
                <div style={{ animation: "fadeUp 0.35s ease both" }}>
                  <div className="step-label">{t('Pijnanalyse')}</div>
                  <div className="step-title">
                    {t('Waar ervaar je pijn of ongemak?')}
                  </div>
                  <div className="step-sub">
                    {t('Selecteer alle gebieden die van toepassing zijn.')}
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
                          <span className="option-label">{t(loc.label)}</span>
                          <span className="option-sub">{t(loc.sub)}</span>
                          <span className="option-check">✓</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="nav-row">
                    <button className="back-btn" onClick={prevStep}>{t('← Terug')}</button>
                    <button className="next-btn" onClick={nextStep} disabled={!canProceed()}>{t('Volgende →')}</button>
                  </div>
                </div>
              )}

              {/* PIJN: timing */}
              {currentStepId === "pain_timing" && (
                <div style={{ animation: "fadeUp 0.35s ease both" }}>
                  <div className="step-label">{t('Pijnanalyse')}</div>
                  <div className="step-title">
                    {t('Wanneer heb je de meeste last?')}
                  </div>
                  <div className="step-sub">
                    {t('Kies het moment dat het meest opvalt.')}
                  </div>
                  <div className="options-grid">
                    {PAIN_TIMINGS.map((pt) => (
                      <button
                        key={pt.id}
                        className={`option-card ${painData.painTiming === pt.id ? "selected" : ""}`}
                        onClick={() =>
                          setPainData((d) => ({ ...d, painTiming: pt.id }))
                        }
                      >
                        <span className="option-icon">{pt.icon}</span>
                        <span className="option-label">{t(pt.label)}</span>
                        <span className="option-sub">{t(pt.sub)}</span>
                        <span className="option-check">✓</span>
                      </button>
                    ))}
                  </div>
                  <div className="nav-row">
                    <button className="back-btn" onClick={prevStep}>{t('← Terug')}</button>
                    <button className="next-btn" onClick={nextStep} disabled={!canProceed()}>{t('Volgende →')}</button>
                  </div>
                </div>
              )}

              {/* PIJN: intensiteit */}
              {currentStepId === "pain_intensity" && (
                <div style={{ animation: "fadeUp 0.35s ease both" }}>
                  <div className="step-label">{t('Pijnanalyse')}</div>
                  <div className="step-title">
                    {t("Hoe erg is de pijn op z'n slechtste moment?")}
                  </div>
                  <div className="step-sub">
                    {t('Dit bepaalt hoe we je klacht inschatten en aanpakken.')}
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
                    <span>{t('Licht ongemak')}</span>
                    <span>{t('Ondraaglijk')}</span>
                  </div>
                  <div className="nav-row">
                    <button className="back-btn" onClick={prevStep}>{t('← Terug')}</button>
                    <button className="next-btn" onClick={nextStep} disabled={!canProceed()}>{t('Volgende →')}</button>
                  </div>
                </div>
              )}

              {/* PIJN: duur */}
              {currentStepId === "pain_duration" && (
                <div style={{ animation: "fadeUp 0.35s ease both" }}>
                  <div className="step-label">{t('Pijnanalyse')}</div>
                  <div className="step-title">{t('Hoe lang heb je al last?')}</div>
                  <div className="step-sub">
                    {t('De duur zegt veel over de fase waarin je klacht zit.')}
                  </div>
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
                        <span className="option-label">{t(pd.label)}</span>
                        <span className="option-sub">{t(pd.sub)}</span>
                        <span className="option-check">✓</span>
                      </button>
                    ))}
                  </div>
                  <div className="nav-row">
                    <button className="back-btn" onClick={prevStep}>{t('← Terug')}</button>
                    <button className="next-btn" onClick={nextStep} disabled={!canProceed()}>{t('Volgende →')}</button>
                  </div>
                </div>
              )}

              {/* PIJN: ontstaan */}
              {currentStepId === "pain_onset" && (
                <div style={{ animation: "fadeUp 0.35s ease both" }}>
                  <div className="step-label">{t('Pijnanalyse')}</div>
                  <div className="step-title">
                    {t('Hoe is de klacht ontstaan?')}
                  </div>
                  <div className="step-sub">
                    {t('Het ontstaan zegt veel over de oorzaak en de juiste aanpak.')}
                  </div>
                  <div className="options-grid">
                    {PAIN_ONSETS.map((o) => (
                      <button
                        key={o.id}
                        className={`option-card ${painData.painOnset === o.id ? "selected" : ""}`}
                        onClick={() =>
                          setPainData((d) => ({ ...d, painOnset: o.id }))
                        }
                      >
                        <span className="option-icon">{o.icon}</span>
                        <span className="option-label">{t(o.label)}</span>
                        <span className="option-sub">{t(o.sub)}</span>
                        <span className="option-check">✓</span>
                      </button>
                    ))}
                  </div>
                  <div className="nav-row">
                    <button className="back-btn" onClick={prevStep}>{t('← Terug')}</button>
                    <button className="next-btn" onClick={nextStep} disabled={!canProceed()}>{t('Volgende →')}</button>
                  </div>
                </div>
              )}

              {/* PIJN: wat verlicht */}
              {currentStepId === "pain_easers" && (
                <div style={{ animation: "fadeUp 0.35s ease both" }}>
                  <div className="step-label">{t('Pijnanalyse')}</div>
                  <div className="step-title">{t('Wat verlicht de klacht?')}</div>
                  <div className="step-sub">
                    {t('Selecteer alles wat helpt — ook een beetje telt.')}
                  </div>
                  <div className="options-grid">
                    {PAIN_EASERS.map((e) => {
                      const sel = painData.painEasers.includes(e.id);
                      return (
                        <button
                          key={e.id}
                          className={`option-card ${sel ? "selected" : ""}`}
                          onClick={() =>
                            setPainData((d) => ({
                              ...d,
                              painEasers: toggleMulti(d.painEasers, e.id),
                            }))
                          }
                        >
                          <span className="option-icon">{e.icon}</span>
                          <span className="option-label">{t(e.label)}</span>
                          <span className="option-sub">{t(e.sub)}</span>
                          <span className="option-check">✓</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="nav-row">
                    <button className="back-btn" onClick={prevStep}>{t('← Terug')}</button>
                    <button className="next-btn" onClick={nextStep} disabled={!canProceed()}>{t('Volgende →')}</button>
                  </div>
                </div>
              )}

              {/* PIJN: triggers */}
              {currentStepId === "pain_triggers" && (
                <div style={{ animation: "fadeUp 0.35s ease both" }}>
                  <div className="step-label">{t('Pijnanalyse')}</div>
                  <div className="step-title">
                    {t('Welke bewegingen verergeren de pijn?')}
                  </div>
                  <div className="step-sub">
                    {t('Selecteer alles wat van toepassing is.')}
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
                          <span className="option-label">{t(tr.label)}</span>
                          <span className="option-sub">{t(tr.sub)}</span>
                          <span className="option-check">✓</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="nav-row">
                    <button className="back-btn" onClick={prevStep}>{t('← Terug')}</button>
                    <button className="next-btn" onClick={nextStep} disabled={!canProceed()}>{t('Volgende →')}</button>
                  </div>
                </div>
              )}

              {/* PIJN: alarmsignalen */}
              {currentStepId === "pain_red_flags" && (
                <div style={{ animation: "fadeUp 0.35s ease both" }}>
                  <div className="step-label">{t('Pijnanalyse')}</div>
                  <div className="step-title">
                    {t('Herken je een van deze signalen?')}
                  </div>
                  <div className="step-sub">
                    {t('Belangrijk om serieus te screenen voordat we een plan opstellen.')}
                  </div>
                  <div className="options-grid">
                    {PAIN_RED_FLAGS.map((rf) => {
                      const sel = painData.painRedFlags.includes(rf.id);
                      return (
                        <button
                          key={rf.id}
                          className={`option-card ${sel ? "selected" : ""}`}
                          onClick={() =>
                            setPainData((d) => ({
                              ...d,
                              painRedFlags: toggleWithNone(d.painRedFlags, rf.id),
                            }))
                          }
                        >
                          <span className="option-icon">{rf.icon}</span>
                          <span className="option-label">{t(rf.label)}</span>
                          <span className="option-sub">{t(rf.sub)}</span>
                          <span className="option-check">✓</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="nav-row">
                    <button className="back-btn" onClick={prevStep}>{t('← Terug')}</button>
                    <button className="next-btn" onClick={nextStep} disabled={!canProceed()}>{t('Volgende →')}</button>
                  </div>
                </div>
              )}

              {/* PIJN: functietest */}
              {currentStepId === "pain_function" && (
                <div style={{ animation: "fadeUp 0.35s ease both" }}>
                  <div className="step-label">{t('Pijnanalyse')}</div>
                  <div className="step-title">
                    {t('Welke bewegingen lukken niet pijnvrij?')}
                  </div>
                  <div className="step-sub">
                    {t('Een snelle functietest — kies wat niet soepel gaat.')}
                  </div>
                  <div className="options-grid">
                    {PAIN_FUNCTIONS.map((fn) => {
                      const sel = painData.painFunction.includes(fn.id);
                      return (
                        <button
                          key={fn.id}
                          className={`option-card ${sel ? "selected" : ""}`}
                          onClick={() =>
                            setPainData((d) => ({
                              ...d,
                              painFunction: toggleWithNone(d.painFunction, fn.id),
                            }))
                          }
                        >
                          <span className="option-icon">{fn.icon}</span>
                          <span className="option-label">{t(fn.label)}</span>
                          <span className="option-sub">{t(fn.sub)}</span>
                          <span className="option-check">✓</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="nav-row">
                    <button className="back-btn" onClick={prevStep}>{t('← Terug')}</button>
                    <button className="next-btn" onClick={nextStep} disabled={!canProceed()}>{t('Volgende →')}</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══════ GATE (email capture) ═══════ */}
          {phase === "gate" && (
            <div className="gate">
              <div className="gate-box">
                <div className="progress-wrap" style={{ marginBottom: "18px" }}>
                  <div className="progress-top">
                    <span className="progress-label">
                      {t('Stap')} {totalSteps + gateStep + 1} {t('van')} {totalWithGate}
                    </span>
                    <span className="progress-label">
                      {scanPath === "pain"
                        ? t("Pijn & Prestatie Scan")
                        : scanPath === "fysio"
                        ? t("Fysio Intake")
                        : t("Performance Scan")}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                  </div>
                </div>
                <div className="gate-eyebrow">
                  {t('Scan voltooid')} —{" "}
                  {scanPath === "pain"
                    ? t("Pijn & Prestatie Analyse")
                    : scanPath === "fysio"
                    ? t("Fysio Intake")
                    : t("Performance Profiel")}
                </div>
                <div className="gate-title">
                  {gateStep === 0 ? (
                    scanPath === "pain" ? (
                      <>
                        {t('Je rapport is klaar.')}
                        <br />
                        {t('Hoe mogen we je noemen?')}
                      </>
                    ) : scanPath === "fysio" ? (
                      <>
                        {t('Je herstelprofiel is klaar.')}
                        <br />
                        {t('Hoe mogen we je noemen?')}
                      </>
                    ) : (
                      <>
                        {t('Je Performance Profiel is klaar.')}
                        <br />
                        {t('Hoe mogen we je noemen?')}
                      </>
                    )
                  ) : gateStep === 1 ? (
                    <>{scanPath === "pain" ? t('Waar mag je rapport naartoe?') : t('Waar mag je profiel naartoe?')}</>
                  ) : (
                    <>{t('Laatste stap: sneller contact?')}</>
                  )}
                </div>
                {gateStep === 0 && (
                  <div className="gate-sub">
                    {scanPath === "pain"
                      ? t('Nog drie korte vragen, dan ontvang je direct je persoonlijke bewegingsanalyse.')
                      : scanPath === "fysio"
                      ? t('Nog drie korte vragen, dan zie je direct je herstelprofiel én je opbouwplan.')
                      : t('Nog drie korte vragen, dan zie je direct je bewegingsprofiel én je persoonlijke krachtplan.')}
                  </div>
                )}

                {error && (
                  <div className="gate-error">
                    ⚠ {error} — {t('probeer het opnieuw')}
                  </div>
                )}

                {gateStep === 0 && (scanPath === "pain" ? (
                  <div className="gate-preview">
                    <div className="preview-pill">
                      {t('Bewegingsbeperkingen: geïdentificeerd')}
                    </div>
                    <div className="preview-pill">
                      {t('Risico Niveau: geanalyseerd')}
                    </div>
                    <div className="preview-pill">
                      {t('7-Daags Plan: gegenereerd')}
                    </div>
                    <div className="preview-pill">
                      {t('Expert Beoordeling: gereed')}
                    </div>
                  </div>
                ) : (
                  <div className="gate-preview">
                    <div className="preview-pill">
                      {t('Bewegingsprofiel: geanalyseerd')}
                    </div>
                    <div className="preview-pill">
                      {t('Sterke punten + groeikans: in kaart')}
                    </div>
                    <div className="preview-pill">
                      {t(scanPath === "fysio" ? 'Opbouwplan: gegenereerd' : 'Krachtplan: gegenereerd')}
                    </div>
                    <div className="preview-pill">
                      {t('2 weken app: klaar')}
                    </div>
                  </div>
                ))}

                {/* ── Contactstap 1/3: voornaam ── */}
                {gateStep === 0 && (
                  <form
                    key="gate-name"
                    style={{ animation: "fadeUp 0.35s ease both" }}
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (userInfo.name.trim()) setGateStep(1);
                    }}
                  >
                    <div className="field-wrap" style={{ marginTop: "12px" }}>
                      <label className="field-label">{t('Voornaam')}</label>
                      <input
                        className="field-input"
                        type="text"
                        autoFocus
                        placeholder={t('Jan')}
                        value={userInfo.name}
                        onChange={(e) =>
                          setUserInfo((p) => ({ ...p, name: e.target.value }))
                        }
                      />
                      <div style={{ fontSize: "10px", color: "#71717a", marginTop: "6px", letterSpacing: "0.5px" }}>
                        {t('Zo spreken we je aan in je rapport.')}
                      </div>
                    </div>
                    <div className="nav-row">
                      <button
                        type="button"
                        className="back-btn"
                        onClick={() => setPhase("assessment")}
                      >
                        {t('← Terug')}
                      </button>
                      <button
                        type="submit"
                        className="next-btn"
                        disabled={!userInfo.name.trim()}
                      >
                        {t('Volgende →')}
                      </button>
                    </div>
                  </form>
                )}

                {/* ── Contactstap 2/3: e-mailadres ── */}
                {gateStep === 1 && (
                  <form
                    key="gate-email"
                    style={{ animation: "fadeUp 0.35s ease both" }}
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (isValidEmail(userInfo.email)) setGateStep(2);
                    }}
                  >
                    <div className="field-wrap" style={{ marginTop: "12px" }}>
                      <label className="field-label">{t('E-mailadres')}</label>
                      <input
                        className="field-input"
                        type="email"
                        autoFocus
                        placeholder={t('jan@voorbeeld.nl')}
                        value={userInfo.email}
                        onChange={(e) =>
                          setUserInfo((p) => ({ ...p, email: e.target.value }))
                        }
                      />
                      {userInfo.email &&
                      userInfo.email.includes("@") &&
                      !isValidEmail(userInfo.email) ? (
                        <div style={{ fontSize: "10px", color: "#ff6b6b", marginTop: "6px", letterSpacing: "0.5px" }}>
                          {t('Check je emailadres — dit lijkt niet geldig')}
                        </div>
                      ) : (
                        <div style={{ fontSize: "10px", color: "#71717a", marginTop: "6px", letterSpacing: "0.5px" }}>
                          {scanPath === "pain"
                            ? t('Hier ontvang je je rapport én je inloglink voor de 9toFit-app.')
                            : t('Hier ontvang je je profiel én je inloglink voor de 9toFit-app.')}
                        </div>
                      )}
                    </div>
                    <div className="nav-row">
                      <button
                        type="button"
                        className="back-btn"
                        onClick={() => setGateStep(0)}
                      >
                        {t('← Terug')}
                      </button>
                      <button
                        type="submit"
                        className="next-btn"
                        disabled={!isValidEmail(userInfo.email)}
                      >
                        {t('Volgende →')}
                      </button>
                    </div>
                  </form>
                )}

                {/* ── Contactstap 3/3: telefoon (optioneel) + versturen ── */}
                {gateStep === 2 && (
                  <form
                    key="gate-phone"
                    style={{ animation: "fadeUp 0.35s ease both" }}
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (
                        userInfo.name.trim() &&
                        isValidEmail(userInfo.email) &&
                        (!userInfo.phone || isValidPhone(userInfo.phone)) &&
                        !submitting
                      ) {
                        handleGateSubmit();
                      }
                    }}
                  >
                    <div className="field-wrap" style={{ marginTop: "12px" }}>
                      <label className="field-label">{t('Telefoonnummer (optioneel)')}</label>
                      <input
                        className="field-input"
                        type="tel"
                        autoFocus
                        placeholder={t('Bijv. 06 12 34 56 78')}
                        value={userInfo.phone}
                        onChange={(e) =>
                          setUserInfo((p) => ({ ...p, phone: e.target.value }))
                        }
                      />
                      {userInfo.phone && !isValidPhone(userInfo.phone) && (
                        <div style={{ fontSize: "10px", color: "#ff6b6b", marginTop: "6px", letterSpacing: "0.5px" }}>
                          {t('Check je telefoonnummer')}
                        </div>
                      )}
                    </div>

                    {scanPath === "fysio" && (
                      <div className="field-wrap" style={{ marginBottom: "18px" }}>
                        <label className="field-label">
                          {t('Naam fysiotherapeut / praktijk (optioneel)')}
                        </label>
                        <input
                          className="field-input"
                          type="text"
                          placeholder={t('Bijv. FysioFit Amsterdam')}
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
                      type="submit"
                      className="submit-btn"
                      disabled={
                        !userInfo.name.trim() ||
                        !isValidEmail(userInfo.email) ||
                        (!!userInfo.phone && !isValidPhone(userInfo.phone)) ||
                        submitting
                      }
                    >
                      {submitting
                        ? t('Bezig met versturen…')
                        : scanPath === "pain"
                        ? t('Analyseer Mijn Beweging →')
                        : t('Toon Mijn Profiel →')}
                    </button>
                    <div className="submit-note">
                      {scanPath === "pain"
                        ? t('Je resultaten worden direct gemaild')
                        : t('Je profiel + plan staan meteen klaar')}
                    </div>
                    <div className="nav-row" style={{ marginTop: "10px" }}>
                      <button
                        type="button"
                        className="back-btn"
                        onClick={() => setGateStep(1)}
                      >
                        {t('← Terug')}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* ═══════ SAFETY (pijnpad met alarmsignalen — eerst een check-call) ═══════ */}
          {phase === "safety" && (
            <div className="result">
              <div className="result-hero">
                <div className="result-eyebrow">
                  {t('Scan voltooid')} · {t('Persoonlijk advies')}
                </div>
                <div className="result-name">
                  {t('Eerst even goed kijken,')} <em>{userInfo.name}</em>.
                </div>
              </div>

              <div className="r-section">
                <div className="r-sec-head">
                  <span className="r-sec-num">01</span>
                  <span className="r-sec-title">{t('Waarom je nu geen standaard oefenplan krijgt')}</span>
                </div>
                <div className="r-sec-body">
                  <p>
                    {t('Je gaf een of meer signalen aan die we serieus nemen:')}
                  </p>
                  <div className="lim-list" style={{ margin: "12px 0" }}>
                    {PAIN_RED_FLAGS.filter(
                      (rf) => rf.id !== "none" && painData.painRedFlags.includes(rf.id)
                    ).map((rf) => (
                      <div key={rf.id} className="lim-item">
                        <span className="lim-icon">{rf.icon}</span>
                        <div>
                          <div className="lim-label">{t(rf.label)}</div>
                          <div className="lim-desc">{t(rf.sub)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p>
                    {t('Geen reden voor paniek — dit soort signalen komt vaak voor en is meestal goed te verhelpen. Maar er online zomaar oefeningen op loslaten zou niet professioneel zijn. Daarom krijg je van ons iets beters dan een standaard plan: Max kijkt eerst persoonlijk met je mee, gratis en vrijblijvend. Daarna weet je zeker dat wat je doet ook veilig is.')}
                  </p>
                </div>
              </div>

              <div className="call-block">
                <div>
                  <div className="call-eyebrow">{t('Aanbevolen volgende stap')}</div>
                  <div className="call-title">{t('Plan je gratis check-gesprek')}</div>
                  <div className="call-desc">
                    {t('In een kort gesprek (telefonisch of in de studio) loopt Max je signalen met je door en hoor je direct wat wél veilig kan. Vaak kun je daarna gewoon aan de slag.')}
                  </div>
                </div>
                <a
                  href={CALENDLY_URL}
                  onClick={(e) => { e.preventDefault(); openCalendly(); }}
                  className="call-btn"
                >
                  {t('Plan Gratis Check-Gesprek →')}
                </a>
              </div>

              <div className="r-section" style={{ marginTop: "2px" }}>
                <div className="r-sec-body">
                  <p style={{ fontSize: "12px", color: "#a1a1aa" }}>
                    {t('Liever appen?')}{" "}
                    <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" style={{ color: "#f97316" }}>
                      {t('Stuur Max een WhatsApp-bericht')}
                    </a>
                    {" · "}
                    {t('Bij plotselinge hevige klachten, koorts of verlies van controle over blaas of darmen: neem vandaag nog contact op met je huisarts.')}
                  </p>
                </div>
              </div>

              <div className={`email-bar ${emailSent ? "sent" : ""}`}>
                <span className="email-dot" />
                {emailSent
                  ? `${t('Dit advies is ook gemaild naar')} ${userInfo.email}`
                  : t('Je aanmelding is binnen — Max weet ervan en neemt contact met je op.')}
              </div>
              <button className="restart-btn" onClick={reset}>
                {t('← Nieuwe Scan Starten')}
              </button>
            </div>
          )}

          {/* ═══════ ANALYZING (pain path only) ═══════ */}
          {phase === "analyzing" && (
            <div className="analyzing">
              <div className="analyzing-spinner" />
              <div className="analyzing-title">
                {t('Je bewegingsprofiel analyseren…')}
              </div>
              <div className="analyzing-sub">
                {t('Je persoonlijke rapport opbouwen — dit kan tot een minuut duren')}
              </div>
              <div className="analyzing-steps">
                {ANALYZE_STEPS.map((s, i) => (
                  <div
                    key={i}
                    className={`a-step ${analyzeStep > i ? "active" : ""}`}
                    style={{ animationDelay: `${i * 0.12}s` }}
                  >
                    {analyzeStep > i ? "✓ " : "○ "}
                    {t(s)}
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
                  {t('Pijn & Prestatie Rapport')} · {userInfo.name}
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
                      {t('Bewegingsanalyse')}
                      <br />
                      {t('voltooid voor')} <em>{userInfo.name}</em>
                    </>
                  )}
                </div>
                <div className="risk-row">
                  {result.overall_risk && (
                    <span
                      className={`risk-tag ${getRiskClass(result.overall_risk)}`}
                    >
                      {t('Risico:')} {result.overall_risk}
                    </span>
                  )}
                  {result.primary_area && (
                    <span className="risk-tag risk-neutral">
                      {t('Primair:')} {result.primary_area}
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
                    {t('Geïdentificeerde Bewegingsbeperkingen')}
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
                        t('Zie gedetailleerde analyse in je e-mail.')}
                    </p>
                  )}
                </div>
              </div>

              {/* RISK FACTORS */}
              <div className="r-section" style={{ marginTop: "2px" }}>
                <div className="r-sec-head">
                  <span className="r-sec-num">02</span>
                  <span className="r-sec-title">{t('Risicofactor Analyse')}</span>
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
                    <span className="r-sec-title">{t('Expert Beoordeling')}</span>
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
                      {t('Je 7-Daags Correctief Plan')}
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
                              {t('Dag')} {day.day || i + 1}
                            </span>
                            <span className="plan-day-title">
                              {day.title || day.theme || `${t('Dag')} ${i + 1}`}
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
                      {leadTier === "cold" ? t('Geen haast — wanneer jij er klaar voor bent') : t('Aanbevolen volgende stap')}
                    </div>
                    <div className="call-title">
                      {hotContact ? t('Je coach neemt contact op') : leadTier === "cold" ? t('Sparren kan — geheel vrijblijvend') : t('Boek een Gratis Strategiegesprek')}
                    </div>
                    <div className="call-desc">
                      {hotContact ? t('Je gaf aan er nu mee aan de slag te willen. Je coach Max neemt binnenkort via WhatsApp contact op om samen een plan te maken — of stuur zelf even een appje.') : leadTier === "cold" ? t('Je rapport staat hierboven, neem er rustig de tijd voor. Wil je later toch sparren, dan staat een gratis gesprek altijd open.') : t('Op basis van jouw profiel zou een 30-minuten sessie met Max je een precieze diagnose geven en een versnellingsprotocol gericht op jouw lichaam en leefstijl.')}
                    </div>
                  </div>
                  <a
                    href={hotContact ? WHATSAPP_URL : CALENDLY_URL}
                    onClick={hotContact ? undefined : (e) => { e.preventDefault(); openCalendly(); }}
                    className="call-btn"
                    target={hotContact ? "_blank" : undefined}
                    rel={hotContact ? "noopener noreferrer" : undefined}
                  >
                    {hotContact ? t('App je coach op WhatsApp →') : leadTier === "cold" ? t('Plan vrijblijvend gesprek →') : t('Boek Gratis Gesprek →')}
                  </a>
                </div>
              )}

              <div className={`email-bar ${emailSent ? "sent" : ""}`}>
                <span className="email-dot" />
                {emailSent
                  ? `${t('Volledig rapport verzonden naar')} ${userInfo.email}`
                  : t('Je rapport via e-mail versturen…')}
              </div>
              <button className="restart-btn" onClick={reset}>
                {t('← Nieuwe Scan Starten')}
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
                  ? t('Je intake is ontvangen!')
                  : t('Je profiel is verzonden!')}
              </div>
              <div className="success-sub">
                {scanPath === "fysio"
                  ? t('Je coach Max ontvangt nu je volledige profiel en neemt zo snel mogelijk contact met je op om je programma te bespreken.')
                  : (hotContact ? t('Je persoonlijke plan staat klaar in de app. Omdat je er nu mee aan de slag wilt, neemt coach Max persoonlijk via WhatsApp contact op — of stuur zelf even een appje.') : leadTier === "cold" ? t('Je persoonlijke plan staat klaar in de app — begin wanneer jij wilt. Geen druk; je coach denkt vrijblijvend mee als je daar behoefte aan hebt.') : t('Je persoonlijke plan staat klaar in de app. Je coach Max kijkt mee en verfijnt het op maat.'))}
              </div>
              {profile && (
                <div className="profile-card">
                  <div className="profile-kicker">{profile.kicker}</div>
                  <div className="profile-title">{profile.title}</div>
                  {profile.score != null && (
                    <div className="profile-score">
                      <div className="profile-ring" style={{ background: `conic-gradient(var(--accent) 0 ${profile.score}%, #2a2a2a ${profile.score}% 100%)` }}>
                        <div className="profile-ring-in"><b>{profile.score}</b></div>
                      </div>
                      <div className="profile-score-lbl"><b>{profile.scoreLabel} {profile.score}/100</b></div>
                    </div>
                  )}
                  {profile.insights.map((ins, i) => (
                    <div key={i} className={`profile-insight ${ins.kind}`}>
                      <div className="pi-ic">{ins.icon}</div>
                      <div><div className="pi-h">{ins.h}</div><div className="pi-t">{ins.t}</div></div>
                    </div>
                  ))}
                  <div className="profile-plan">
                    <div className="pp-head">{profile.planTitle}<span>{t('Staat klaar')}</span></div>
                    {profile.plan.map((d, i) => (
                      <div key={i} className="pp-day">
                        <span className="pp-num">{i + 1}</span>
                        <span className="pp-lbl">{d.label}</span>
                        <span className="pp-ic">{d.icon}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="success-steps">
                <div className="success-step">
                  <span className="success-step-num">01</span>
                  <div className="success-step-text">
                    {t('Check je inbox — je ontvangt een magic link om direct in te loggen in de 9toFit app.')}
                  </div>
                </div>
                <div className="success-step">
                  <span className="success-step-num">02</span>
                  <div className="success-step-text">
                    {t('Je persoonlijke plan staat al klaar in de app.')}
                  </div>
                </div>
                <div className="success-step">
                  <span className="success-step-num">03</span>
                  <div className="success-step-text">
                    {scanPath === "fysio"
                      ? t('Je coach plant een persoonlijke intake met je in.')
                      : t('Je coach Max kijkt mee en verfijnt je schema op maat terwijl je traint.')}
                  </div>
                </div>
              </div>
              <a
                href={hotContact ? WHATSAPP_URL : CALENDLY_URL}
                onClick={hotContact ? undefined : (e) => { e.preventDefault(); openCalendly(); }}
                className="call-btn"
                    target={hotContact ? "_blank" : undefined}
                    rel={hotContact ? "noopener noreferrer" : undefined}
                style={{ margin: "0 auto", display: "inline-flex" }}
              >
                {hotContact ? t('App je coach op WhatsApp →') : leadTier === "cold" ? t('Later een gesprek plannen') : t('Plan een Kennismakingsgesprek →')}
              </a>
              <div style={{ marginTop: "20px" }}>
                <button className="restart-btn" onClick={reset}>
                  {t('← Nieuwe Scan Starten')}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
