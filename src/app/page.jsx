"use client";
import { useState } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --ink: #ffffff;
    --paper: #111111;
    --warm: #1a1a1a;
    --border: #2a2a2a;
    --accent: #ffffff;
    --accent-light: rgba(255,255,255,0.06);
    --gold: #cccccc;
    --text: #e8e8e8;
    --muted: #888888;
    --muted-light: #555555;
    --green: #aaaaaa;
    --green-light: rgba(255,255,255,0.04);
  }
  html, body { height: 100%; background: var(--paper); }
  body { font-family: 'Barlow', sans-serif; color: var(--text); -webkit-font-smoothing: antialiased; }
  .app { min-height: 100vh; display: flex; flex-direction: column; background: var(--paper); }
  .app::before { content: none; }
  .header {
    position: relative; z-index: 10;
    padding: 18px 48px; display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid var(--border); background: #111111;
  }
  @media(max-width:640px){ .header { padding: 16px 20px; } }
  .header-brand {
    font-family: 'Barlow Condensed', sans-serif; font-size: 20px; font-weight: 900;
    letter-spacing: 3px; color: #ffffff; text-transform: uppercase;
  }
  .header-tag {
    font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 2.5px;
    text-transform: uppercase; color: var(--muted); border: 1px solid var(--border); padding: 5px 12px;
  }
  .main { flex: 1; position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; padding: 0 20px 80px; }

  /* LANDING */
  .landing { width: 100%; max-width: 820px; padding-top: 72px; animation: fadeUp 0.7s ease both; }
  .landing-kicker {
    font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 3px;
    text-transform: uppercase; color: #888888; margin-bottom: 28px;
    display: flex; align-items: center; gap: 14px;
  }
  .kicker-line { width: 40px; height: 1px; background: #888888; flex-shrink: 0; }
  .landing-h1 {
    font-family: 'Barlow Condensed', sans-serif; font-size: clamp(52px, 9vw, 96px);
    line-height: 0.92; color: #ffffff; margin-bottom: 28px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase;
  }
  .landing-h1 em { font-style: italic; color: var(--accent); }
  .landing-sub { font-size: 15px; color: #888888; line-height: 1.7; max-width: 500px; margin-bottom: 52px; font-family: 'Barlow', sans-serif; font-weight: 400; }
  .landing-divider { width: 100%; height: 1px; background: var(--border); margin-bottom: 48px; }
  .landing-pillars { display: grid; grid-template-columns: repeat(3,1fr); border: 1px solid var(--border); margin-bottom: 52px; }
  @media(max-width:600px){ .landing-pillars { grid-template-columns: 1fr; } }
  .pillar { padding: 28px 24px; border-right: 1px solid var(--border); }
  .pillar:last-child { border-right: none; }
  .pillar-num { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 2px; color: var(--muted-light); margin-bottom: 12px; }
  .pillar-title { font-size: 13px; font-family: 'Barlow Condensed', sans-serif; font-weight: 700; color: #ffffff; margin-bottom: 6px; letter-spacing: 1px; text-transform: uppercase; }
  .pillar-desc { font-size: 12px; color: var(--muted); line-height: 1.6; }
  .cta-row { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
  .cta-btn {
    display: inline-flex; align-items: center; gap: 14px;
    background: #ffffff; color: #111111; border: none;
    font-family: 'Barlow Condensed', sans-serif; font-size: 15px; font-weight: 700;
    letter-spacing: 3px; padding: 16px 36px; cursor: pointer; transition: all 0.25s; text-transform: uppercase;
  }
  .cta-btn:hover { background: #dddddd; transform: translateY(-2px); }
  .cta-note { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 1.5px; color: var(--muted-light); text-transform: uppercase; }

  /* ASSESSMENT */
  .assessment { width: 100%; max-width: 820px; padding-top: 56px; animation: fadeUp 0.5s ease both; }
  .progress-wrap { margin-bottom: 52px; }
  .progress-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
  .progress-label { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 2px; color: var(--muted); text-transform: uppercase; }
  .progress-bar { width: 100%; height: 2px; background: var(--border); }
  .progress-fill { height: 100%; background: var(--accent); transition: width 0.4s ease; }
  .q-block { animation: fadeUp 0.35s ease both; }
  .q-number { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 3px; color: var(--muted-light); text-transform: uppercase; margin-bottom: 14px; }
  .q-title { font-family: 'Barlow Condensed', sans-serif; font-size: clamp(26px, 4vw, 38px); color: #ffffff; margin-bottom: 8px; font-weight: 800; line-height: 1.1; text-transform: uppercase; letter-spacing: 1px; }
  .q-sub { font-size: 13px; color: #888888; margin-bottom: 32px; font-family: 'Barlow', sans-serif; }
  .options-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(192px, 1fr)); gap: 10px; margin-bottom: 32px; }
  .option-card {
    padding: 16px 18px; border: 1px solid var(--border); background: #1a1a1a;
    cursor: pointer; transition: all 0.18s; text-align: left; font-family: 'Syne', sans-serif; position: relative;
  }
  .option-card:hover { border-color: #ffffff; background: rgba(255,255,255,0.06); }
  .option-card.selected { border-color: #ffffff; background: rgba(255,255,255,0.08); }
  .option-icon { font-size: 20px; margin-bottom: 10px; display: block; }
  .option-label { font-size: 13px; font-family: 'Barlow Condensed', sans-serif; font-weight: 700; color: #ffffff; display: block; margin-bottom: 3px; letter-spacing: 0.5px; text-transform: uppercase; }
  .option-sub { font-size: 11px; color: var(--muted); }
  .option-check { position: absolute; top: 12px; right: 14px; color: #ffffff; opacity: 0; font-size: 13px; transition: opacity 0.15s; }
  .option-card.selected .option-check { opacity: 1; }
  .scale-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px; }
  .scale-btn {
    width: 52px; height: 52px; border: 1px solid var(--border); background: #1a1a1a;
    font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; color: #888888;
    cursor: pointer; transition: all 0.15s;
  }
  .scale-btn:hover { border-color: #ffffff; color: #ffffff; }
  .scale-btn.selected { background: #ffffff; border-color: #ffffff; color: #111111; }
  .scale-labels { display: flex; justify-content: space-between; font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 1px; color: var(--muted-light); margin-bottom: 32px; text-transform: uppercase; }
  .nav-row { display: flex; align-items: center; justify-content: space-between; }
  .next-btn {
    display: inline-flex; align-items: center; gap: 10px;
    background: #ffffff; color: #111111; border: none;
    font-family: 'Barlow Condensed', sans-serif; font-size: 15px; font-weight: 700;
    letter-spacing: 3px; padding: 14px 28px; cursor: pointer; transition: all 0.2s; text-transform: uppercase;
  }
  .next-btn:hover:not(:disabled) { background: #dddddd; }
  .next-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .back-btn {
    background: none; border: none; font-family: 'DM Mono', monospace; font-size: 10px;
    letter-spacing: 2px; color: var(--muted); cursor: pointer; text-transform: uppercase;
    padding: 8px 0; transition: color 0.2s;
  }
  .back-btn:hover { color: var(--ink); }

  /* GATE */
  .gate { width: 100%; max-width: 820px; padding-top: 64px; animation: fadeUp 0.5s ease both; }
  .gate-box { background: #1a1a1a; border: 1px solid var(--border); padding: 48px; }
  @media(max-width:640px){ .gate-box { padding: 28px 20px; } }
  .gate-eyebrow { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 3px; color: var(--accent); text-transform: uppercase; margin-bottom: 16px; }
  .gate-title { font-family: 'Barlow Condensed', sans-serif; font-size: clamp(32px, 5vw, 48px); color: #ffffff; margin-bottom: 12px; font-weight: 900; line-height: 1.0; text-transform: uppercase; letter-spacing: 1px; }
  .gate-sub { font-size: 13px; color: var(--muted); line-height: 1.7; margin-bottom: 32px; max-width: 440px; }
  .gate-preview {
    background: #111111; border: 1px solid var(--border); padding: 20px 24px;
    margin-bottom: 32px; position: relative; overflow: hidden;
    display: flex; gap: 10px; flex-wrap: wrap;
  }
  .gate-preview::after {
    content: 'UNLOCK YOUR REPORT';
    position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
    font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 3px; color: var(--ink);
    background: rgba(26,26,26,0.92); backdrop-filter: blur(4px);
  }
  .preview-pill {
    padding: 8px 14px; background: #222222; border: 1px solid var(--border);
    font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 1px; color: #666666; filter: blur(3px);
  }
  .gate-error { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--accent); margin-bottom: 16px; padding: 10px 14px; border: 1px solid rgba(200,57,43,0.2); background: var(--accent-light); letter-spacing: 1px; }
  .gate-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
  @media(max-width:560px){ .gate-fields { grid-template-columns: 1fr; } }
  .field-wrap { display: flex; flex-direction: column; gap: 7px; }
  .field-label { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); }
  .field-input {
    background: #111111; border: 1px solid var(--border); border-bottom: 2px solid var(--border);
    color: #ffffff; font-family: 'Syne', sans-serif; font-size: 14px;
    padding: 12px 14px; outline: none; transition: border-color 0.2s; width: 100%;
  }
  .field-input:focus { border-bottom-color: #ffffff; }
  .field-input::placeholder { color: var(--muted-light); }
  .submit-btn {
    width: 100%; padding: 18px; background: #ffffff; color: #111111; border: none;
    font-family: 'Barlow Condensed', sans-serif; font-size: 16px; font-weight: 700; letter-spacing: 3px;
    cursor: pointer; transition: all 0.2s; text-transform: uppercase;
    display: flex; align-items: center; justify-content: center; gap: 12px;
  }
  .submit-btn:hover:not(:disabled) { background: #dddddd; }
  .submit-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .submit-note { margin-top: 12px; font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 1.5px; color: var(--muted-light); text-align: center; text-transform: uppercase; }

  /* ANALYZING */
  .analyzing { width: 100%; max-width: 820px; padding-top: 120px; text-align: center; animation: fadeUp 0.4s ease both; }
  .analyzing-spinner {
    width: 56px; height: 56px; margin: 0 auto 32px;
    border: 2px solid #333333; border-top-color: #ffffff;
    border-radius: 50%; animation: spin 0.9s linear infinite;
  }
  .analyzing-title { font-family: 'Barlow Condensed', sans-serif; font-size: 32px; font-weight: 900; color: #ffffff; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 2px; }
  .analyzing-sub { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 2px; color: var(--muted); text-transform: uppercase; }
  .analyzing-steps { margin-top: 36px; display: flex; flex-direction: column; gap: 8px; max-width: 340px; margin-left: auto; margin-right: auto; }
  .a-step {
    font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 1px;
    color: #555555; padding: 10px 16px; border: 1px solid var(--border);
    text-align: left; animation: fadeUp 0.4s ease both;
  }
  .a-step.active { color: #ffffff; border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.05); }

  /* RESULT */
  .result { width: 100%; max-width: 820px; padding-top: 64px; animation: fadeUp 0.5s ease both; }
  .result-hero { margin-bottom: 48px; padding-bottom: 48px; border-bottom: 1px solid var(--border); }
  .result-eyebrow { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 3px; color: var(--muted); text-transform: uppercase; margin-bottom: 16px; }
  .result-name { font-family: 'Barlow Condensed', sans-serif; font-size: clamp(36px, 6vw, 60px); color: #ffffff; margin-bottom: 24px; font-weight: 900; line-height: 0.95; text-transform: uppercase; letter-spacing: 1px; }
  .result-name em { font-style: italic; color: #aaaaaa; font-weight: 400; }
  .risk-row { display: flex; gap: 10px; flex-wrap: wrap; }
  .risk-tag { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 2px; padding: 6px 14px; text-transform: uppercase; border: 1px solid; }
  .risk-low { color: #aaffaa; border-color: rgba(170,255,170,0.4); background: rgba(170,255,170,0.05); }
  .risk-moderate { color: #ffddaa; border-color: rgba(255,221,170,0.4); background: rgba(255,221,170,0.05); }
  .risk-high { color: #ffaaaa; border-color: rgba(255,170,170,0.4); background: rgba(255,170,170,0.05); }
  .risk-neutral { color: #888888; border-color: #333333; }

  .r-section { margin-bottom: 2px; }
  .r-sec-head { display: flex; align-items: center; gap: 14px; padding: 16px 22px; background: #000000; border: 1px solid var(--border); }
  .r-sec-num { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 2px; color: rgba(245,242,237,0.35); }
  .r-sec-title { font-family: 'Barlow Condensed', sans-serif; font-size: 13px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #ffffff; }
  .r-sec-body { border: 1px solid var(--border); border-top: none; padding: 28px; background: #1a1a1a; }
  .r-sec-body p { font-size: 13px; color: var(--text); line-height: 1.8; margin-bottom: 10px; }
  .r-sec-body p:last-child { margin-bottom: 0; }

  .lim-list { display: flex; flex-direction: column; gap: 10px; }
  .lim-item { display: flex; gap: 14px; align-items: flex-start; padding: 16px; background: #111111; border: 1px solid var(--border); }
  .lim-icon { font-size: 18px; flex-shrink: 0; }
  .lim-label { font-family: 'Barlow Condensed', sans-serif; font-size: 15px; font-weight: 700; color: #ffffff; margin-bottom: 3px; letter-spacing: 0.5px; text-transform: uppercase; }
  .lim-desc { font-size: 12px; color: var(--muted); line-height: 1.6; }

  .insight-body { border: 1px solid rgba(255,255,255,0.15); border-top: none; padding: 28px; background: rgba(255,255,255,0.04); }
  .insight-text { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 400; font-style: italic; line-height: 1.85; color: #e8e8e8; }

  /* 7-DAY PLAN */
  .plan-list { display: flex; flex-direction: column; gap: 2px; }
  .plan-day { border: 1px solid var(--border); overflow: hidden; }
  .plan-day-head {
    display: flex; align-items: center; gap: 16px; padding: 14px 20px;
    background: #222222; cursor: pointer; user-select: none; transition: background 0.15s;
  }
  .plan-day-head:hover { background: #2a2a2a; }
  .plan-day-num { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 2px; color: var(--muted); text-transform: uppercase; flex-shrink: 0; width: 44px; }
  .plan-day-title { font-family: 'Barlow Condensed', sans-serif; font-size: 15px; font-weight: 700; color: #ffffff; flex: 1; letter-spacing: 1px; text-transform: uppercase; }
  .plan-day-focus { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 1px; color: #aaaaaa; text-transform: uppercase; padding: 3px 10px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.04); }
  .plan-day-body { padding: 20px; background: #111111; border-top: 1px solid var(--border); }
  .ex-list { display: flex; flex-direction: column; gap: 16px; }
  .ex-item { display: flex; gap: 14px; }
  .ex-num { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--muted-light); flex-shrink: 0; padding-top: 2px; min-width: 22px; }
  .ex-name { font-family: 'Barlow Condensed', sans-serif; font-size: 15px; font-weight: 700; color: #ffffff; margin-bottom: 3px; letter-spacing: 0.5px; text-transform: uppercase; }
  .ex-spec { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 1px; color: #888888; margin-bottom: 4px; }
  .ex-note { font-size: 12px; color: var(--muted); line-height: 1.6; }
  .day-note { margin-top: 14px; padding: 12px 14px; background: #1a1a1a; border-left: 3px solid #444444; font-size: 12px; color: #888888; line-height: 1.6; }

  /* CALL CTA */
  .call-block {
    margin-top: 2px; padding: 36px; background: #ffffff;
    display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap;
  }
  .call-eyebrow { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 2px; color: #888888; text-transform: uppercase; margin-bottom: 10px; }
  .call-title { font-family: 'Barlow Condensed', sans-serif; font-size: 28px; color: #111111; margin-bottom: 8px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase; }
  .call-desc { font-size: 13px; color: #555555; line-height: 1.6; max-width: 380px; }
  .call-btn {
    flex-shrink: 0; display: inline-flex; align-items: center; gap: 10px;
    background: #111111; color: #ffffff; border: none;
    font-family: 'Barlow Condensed', sans-serif; font-size: 15px; font-weight: 700;
    letter-spacing: 3px; padding: 14px 28px; cursor: pointer; transition: all 0.2s;
    text-decoration: none; text-transform: uppercase; white-space: nowrap;
  }
  .call-btn:hover { background: #333333; color: #ffffff; }

  .email-bar { margin-top: 2px; padding: 12px 20px; border: 1px solid var(--border); display: flex; align-items: center; gap: 10px; font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); }
  .email-bar.sent { color: #aaffaa; border-color: rgba(170,255,170,0.3); background: rgba(170,255,170,0.04); }
  .email-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
  .restart-btn { margin-top: 2px; width: 100%; padding: 15px; background: transparent; border: 1px solid #333333; font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #555555; cursor: pointer; transition: all 0.2s; }
  .restart-btn:hover { border-color: #888888; color: #ffffff; }

  .footer { position: relative; z-index: 1; border-top: 1px solid var(--border); padding: 18px 48px; display: flex; align-items: center; justify-content: space-between; }
  .footer-text { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 2px; color: var(--muted-light); text-transform: uppercase; }
  @media(max-width:640px){ .footer { padding: 16px 20px; } }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

const QUESTIONS = [
  {
    id: "pain_location", number: "01 / 09",
    title: "Where is the pain or discomfort?",
    sub: "Select all areas that apply.",
    type: "multi",
    options: [
      { icon: "🔙", label: "Lower Back", sub: "Lumbar region" },
      { icon: "🦵", label: "Knee", sub: "Front, back or side" },
      { icon: "💪", label: "Shoulder", sub: "Joint or surrounding area" },
      { icon: "🦴", label: "Hip", sub: "Joint, glute or groin" },
      { icon: "🔝", label: "Neck / Upper Trap", sub: "Cervical spine" },
      { icon: "🦶", label: "Ankle / Foot", sub: "Including Achilles" },
      { icon: "✋", label: "Wrist / Elbow", sub: "Forearm chain" },
      { icon: "⬆️", label: "Upper Back / Thoracic", sub: "Mid-spine region" },
    ],
  },
  {
    id: "pain_timing", number: "02 / 09",
    title: "When does it hurt most?",
    sub: "Pick the option that best describes your pain pattern.",
    type: "single",
    options: [
      { icon: "🌅", label: "Morning stiffness", sub: "First 30–60 mins after waking" },
      { icon: "🏋️", label: "During training", sub: "Pain appears while exercising" },
      { icon: "😓", label: "After training", sub: "Delayed onset or inflammation" },
      { icon: "💺", label: "After sitting long", sub: "Desk, car or couch" },
      { icon: "🚶", label: "Specific movements", sub: "Bending, rotating, loading" },
      { icon: "⏱️", label: "Constant / all day", sub: "No clear pattern" },
    ],
  },
  {
    id: "movement_triggers", number: "03 / 09",
    title: "Which movements trigger the pain?",
    sub: "Select all that apply.",
    type: "multi",
    options: [
      { icon: "⬇️", label: "Bending forward", sub: "Hip hinge or flexion" },
      { icon: "🔄", label: "Rotating / twisting", sub: "Torso or joint rotation" },
      { icon: "⬆️", label: "Overhead reach", sub: "Pressing or pulling up" },
      { icon: "🪑", label: "Sit to stand", sub: "Transition movements" },
      { icon: "🏃", label: "Running / impact", sub: "Foot strike loading" },
      { icon: "🏋️", label: "Squatting / lunging", sub: "Knee-dominant patterns" },
      { icon: "🛏️", label: "Lying flat", sub: "Supine or prone position" },
      { icon: "❓", label: "Unsure", sub: "No clear trigger" },
    ],
  },
  {
    id: "pain_duration", number: "04 / 09",
    title: "How long have you had this issue?",
    sub: "Acute vs chronic pain requires different approaches.",
    type: "single",
    options: [
      { icon: "⚡", label: "Less than 1 week", sub: "Acute onset" },
      { icon: "📅", label: "1–4 weeks", sub: "Sub-acute phase" },
      { icon: "🗓️", label: "1–3 months", sub: "Early chronic" },
      { icon: "📆", label: "3–12 months", sub: "Chronic pattern" },
      { icon: "♾️", label: "Over a year", sub: "Long-term issue" },
    ],
  },
  {
    id: "pain_intensity", number: "05 / 09",
    title: "Rate your average pain intensity",
    sub: "0 = no pain · 10 = worst imaginable pain",
    type: "scale", min: 0, max: 10,
    minLabel: "No pain", maxLabel: "Unbearable",
  },
  {
    id: "work_type", number: "06 / 09",
    title: "What best describes your work situation?",
    sub: "Daily posture patterns directly impact movement quality.",
    type: "single",
    options: [
      { icon: "💻", label: "Desk / office", sub: "Mostly seated, screen work" },
      { icon: "✈️", label: "Frequent travel", sub: "Long flights, sitting" },
      { icon: "🔧", label: "Manual / physical", sub: "Lifting, standing, repetitive" },
      { icon: "🏃", label: "Mostly on feet", sub: "Retail, hospitality, medical" },
      { icon: "🏠", label: "Working from home", sub: "Variable posture setup" },
    ],
  },
  {
    id: "training_history", number: "07 / 09",
    title: "How would you describe your training background?",
    sub: "This calibrates the intensity of your corrective plan.",
    type: "single",
    options: [
      { icon: "🌱", label: "Beginner", sub: "Less than 6 months consistent" },
      { icon: "📈", label: "Intermediate", sub: "1–3 years of training" },
      { icon: "💪", label: "Advanced", sub: "3+ years, structured program" },
      { icon: "⏸️", label: "Currently inactive", sub: "Stopped due to pain or life" },
      { icon: "🏆", label: "Athletic background", sub: "Former or current athlete" },
    ],
  },
  {
    id: "activity_level", number: "08 / 09",
    title: "How many days per week are you currently active?",
    sub: "Include any form of exercise, sport or physical activity.",
    type: "scale", min: 0, max: 7,
    minLabel: "None", maxLabel: "Every day",
  },
  {
    id: "previous_treatment", number: "09 / 09",
    title: "Have you sought professional help for this issue?",
    sub: "Select all that apply.",
    type: "multi",
    options: [
      { icon: "👨‍⚕️", label: "GP / Doctor", sub: "General diagnosis" },
      { icon: "🦴", label: "Physiotherapist", sub: "Movement rehabilitation" },
      { icon: "💆", label: "Osteopath / Chiro", sub: "Manual therapy" },
      { icon: "🩺", label: "Specialist / MRI", sub: "Imaging or diagnosis" },
      { icon: "❌", label: "No treatment yet", sub: "First time seeking guidance" },
    ],
  },
];

const ANALYZE_STEPS = [
  "Processing pain pattern data…",
  "Mapping movement limitations…",
  "Calculating risk factors…",
  "Generating 7-day corrective plan…",
];

const getRiskClass = (r = "") => {
  const l = r.toLowerCase();
  if (l.includes("low")) return "risk-low";
  if (l.includes("high")) return "risk-high";
  return "risk-moderate";
};

export default function App() {
  const [phase, setPhase] = useState("landing");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [userInfo, setUserInfo] = useState({ name: "", email: "" });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [emailSent, setEmailSent] = useState(false);
  const [analyzeStep, setAnalyzeStep] = useState(0);
  const [expandedDays, setExpandedDays] = useState({ 0: true });

  const q = QUESTIONS[step];
  const progress = (step / QUESTIONS.length) * 100;

  const handleSelect = (val) => {
    setAnswers((prev) => {
      if (q.type === "multi") {
        const arr = Array.isArray(prev[q.id]) ? prev[q.id] : [];
        return { ...prev, [q.id]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val] };
      }
      return { ...prev, [q.id]: val };
    });
  };

  const canProceed = () => {
    const a = answers[q.id];
    if (q.type === "multi") return Array.isArray(a) && a.length > 0;
    if (q.type === "single") return !!a;
    if (q.type === "scale") return a !== undefined && a !== null && a !== "";
    return false;
  };

  const nextStep = () => {
    if (step < QUESTIONS.length - 1) setStep((s) => s + 1);
    else setPhase("gate");
  };

  const runAnalysis = async () => {
    setPhase("analyzing");
    setError(null);
    for (let i = 0; i < ANALYZE_STEPS.length; i++) {
      await new Promise((r) => setTimeout(r, 950));
      setAnalyzeStep(i + 1);
    }
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "pain_performance", answers, userInfo }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Analysis failed");
      setResult(data.result);
      setPhase("result");
      fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: userInfo.name, email: userInfo.email, result: data.result, answers, type: "pain_performance" }),
      }).then(() => setEmailSent(true)).catch(() => {});
    } catch (e) {
      setError(e.message);
      setPhase("gate");
    }
  };

  const reset = () => {
    setPhase("landing"); setStep(0); setAnswers({});
    setUserInfo({ name: "", email: "" }); setResult(null);
    setError(null); setEmailSent(false); setExpandedDays({ 0: true });
    setAnalyzeStep(0);
  };

  const plan = Array.isArray(result?.seven_day_plan) ? result.seven_day_plan : [];
  const limitations = Array.isArray(result?.movement_limitations) ? result.movement_limitations : [];
  const riskFactors = Array.isArray(result?.risk_factors) ? result.risk_factors : [];
  const showCallCTA = result && (result.overall_risk?.toLowerCase() !== "low" || (answers.pain_intensity ?? 0) >= 5);

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">

        {/* HEADER */}
        <header className="header">
          <img
            src="data:image/png;base64,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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgvo/1N0ZvZkHvVUAAAAASUVORK5CYII="
            alt="9toFit Performance Coaching"
            style={{height:'42px', width:'auto'}}
          />
          <span className="header-tag">Pain &amp; Performance Scan</span>
        </header>

        <main className="main">

          {/* LANDING */}
          {phase === "landing" && (
            <div className="landing">
              <div className="landing-kicker"><span className="kicker-line" />Free Movement Assessment</div>
              <h1 className="landing-h1">Your body is<br />telling you<br /><em>something.</em></h1>
              <p className="landing-sub">
                Answer 9 targeted questions about your pain, movement patterns and lifestyle.
                Get a clinical-grade movement analysis and a personalised 7-day corrective plan — in under 3 minutes.
              </p>
              <div className="landing-divider" />
              <div className="landing-pillars">
                <div className="pillar">
                  <div className="pillar-num">01</div>
                  <div className="pillar-title">Movement Limitations</div>
                  <div className="pillar-desc">Identify exactly which patterns are compromised and why.</div>
                </div>
                <div className="pillar">
                  <div className="pillar-num">02</div>
                  <div className="pillar-title">Risk Factor Analysis</div>
                  <div className="pillar-desc">Understand what's driving your pain before it becomes injury.</div>
                </div>
                <div className="pillar">
                  <div className="pillar-num">03</div>
                  <div className="pillar-title">7-Day Corrective Plan</div>
                  <div className="pillar-desc">Daily exercises tailored to your specific complaint.</div>
                </div>
              </div>
              <div className="cta-row">
                <button className="cta-btn" onClick={() => setPhase("assessment")}>
                  Start Your Scan <span>→</span>
                </button>
                <span className="cta-note">Free · 3 minutes · No login required</span>
              </div>
            </div>
          )}

          {/* ASSESSMENT */}
          {phase === "assessment" && (
            <div className="assessment">
              <div className="progress-wrap">
                <div className="progress-top">
                  <span className="progress-label">Assessment Progress</span>
                  <span className="progress-label">{step + 1} / {QUESTIONS.length}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="q-block" key={q.id}>
                <div className="q-number">{q.number}</div>
                <div className="q-title">{q.title}</div>
                <div className="q-sub">{q.sub}</div>

                {(q.type === "single" || q.type === "multi") && (
                  <div className="options-grid">
                    {q.options.map((opt) => {
                      const sel = q.type === "multi"
                        ? Array.isArray(answers[q.id]) && answers[q.id].includes(opt.label)
                        : answers[q.id] === opt.label;
                      return (
                        <button key={opt.label} className={`option-card ${sel ? "selected" : ""}`} onClick={() => handleSelect(opt.label)}>
                          <span className="option-icon">{opt.icon}</span>
                          <span className="option-label">{opt.label}</span>
                          {opt.sub && <span className="option-sub">{opt.sub}</span>}
                          <span className="option-check">✓</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {q.type === "scale" && (
                  <>
                    <div className="scale-row">
                      {Array.from({ length: q.max - q.min + 1 }, (_, i) => i + q.min).map((n) => (
                        <button key={n} className={`scale-btn ${answers[q.id] === n ? "selected" : ""}`} onClick={() => setAnswers((p) => ({ ...p, [q.id]: n }))}>{n}</button>
                      ))}
                    </div>
                    <div className="scale-labels"><span>{q.minLabel}</span><span>{q.maxLabel}</span></div>
                  </>
                )}

                <div className="nav-row">
                  {step > 0 ? <button className="back-btn" onClick={() => setStep((s) => s - 1)}>← Back</button> : <span />}
                  <button className="next-btn" onClick={nextStep} disabled={!canProceed()}>
                    {step === QUESTIONS.length - 1 ? "Get My Report" : "Next"} →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* GATE */}
          {phase === "gate" && (
            <div className="gate">
              <div className="gate-box">
                <div className="gate-eyebrow">Assessment complete — 9 / 9 questions</div>
                <div className="gate-title">Your report is ready.<br />Where should we send it?</div>
                <div className="gate-sub">
                  Enter your details below to receive your personalised movement analysis and 7-day corrective plan immediately by email.
                </div>
                {error && <div className="gate-error">⚠ {error} — please try again</div>}
                <div className="gate-preview">
                  <div className="preview-pill">Movement Limitations: identified</div>
                  <div className="preview-pill">Risk Level: analysed</div>
                  <div className="preview-pill">7-Day Plan: generated</div>
                  <div className="preview-pill">Expert Assessment: ready</div>
                </div>
                <div className="gate-fields">
                  <div className="field-wrap">
                    <label className="field-label">First Name</label>
                    <input className="field-input" type="text" placeholder="John" value={userInfo.name} onChange={(e) => setUserInfo((p) => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div className="field-wrap">
                    <label className="field-label">Email Address</label>
                    <input className="field-input" type="email" placeholder="john@example.com" value={userInfo.email} onChange={(e) => setUserInfo((p) => ({ ...p, email: e.target.value }))} />
                  </div>
                </div>
                <button className="submit-btn" onClick={runAnalysis} disabled={!userInfo.name || !userInfo.email || !userInfo.email.includes("@")}>
                  Analyse My Movement →
                </button>
                <div className="submit-note">Your results will be emailed immediately · No spam, ever</div>
              </div>
            </div>
          )}

          {/* ANALYZING */}
          {phase === "analyzing" && (
            <div className="analyzing">
              <div className="analyzing-spinner" />
              <div className="analyzing-title">Analysing your movement profile…</div>
              <div className="analyzing-sub">Building your personalised report</div>
              <div className="analyzing-steps">
                {ANALYZE_STEPS.map((s, i) => (
                  <div key={i} className={`a-step ${analyzeStep > i ? "active" : ""}`} style={{ animationDelay: `${i * 0.12}s` }}>
                    {analyzeStep > i ? "✓ " : "○ "}{s}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RESULT */}
          {phase === "result" && result && (
            <div className="result">
              <div className="result-hero">
                <div className="result-eyebrow">Pain & Performance Report · {userInfo.name}</div>
                <div className="result-name">
                  {result.headline
                    ? <span dangerouslySetInnerHTML={{ __html: result.headline.replace(/\*(.+?)\*/g, '<em>$1</em>') }} />
                    : <>Movement analysis<br />complete for <em>{userInfo.name}</em></>
                  }
                </div>
                <div className="risk-row">
                  {result.overall_risk && <span className={`risk-tag ${getRiskClass(result.overall_risk)}`}>Risk: {result.overall_risk}</span>}
                  {result.primary_area && <span className="risk-tag risk-neutral">Primary: {result.primary_area}</span>}
                  {result.urgency && <span className="risk-tag risk-moderate">{result.urgency}</span>}
                </div>
              </div>

              {/* MOVEMENT LIMITATIONS */}
              <div className="r-section">
                <div className="r-sec-head"><span className="r-sec-num">01</span><span className="r-sec-title">Movement Limitations Identified</span></div>
                <div className="r-sec-body">
                  {limitations.length > 0 ? (
                    <div className="lim-list">
                      {limitations.map((lim, i) => (
                        <div key={i} className="lim-item">
                          <span className="lim-icon">{lim.icon || "⚠️"}</span>
                          <div>
                            <div className="lim-label">{lim.name || lim}</div>
                            {(lim.description || lim.desc) && <div className="lim-desc">{lim.description || lim.desc}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>{result.movement_limitations_text || "See detailed analysis in your email."}</p>
                  )}
                </div>
              </div>

              {/* RISK FACTORS */}
              <div className="r-section" style={{ marginTop: "2px" }}>
                <div className="r-sec-head"><span className="r-sec-num">02</span><span className="r-sec-title">Risk Factor Analysis</span></div>
                <div className="r-sec-body">
                  {riskFactors.length > 0
                    ? riskFactors.map((r, i) => <p key={i}>• {r}</p>)
                    : <p>{result.risk_analysis || result.risk_factors_text || ""}</p>
                  }
                </div>
              </div>

              {/* EXPERT ASSESSMENT */}
              {result.coach_insight && (
                <div className="r-section" style={{ marginTop: "2px" }}>
                  <div className="r-sec-head" style={{ background: "#333333" }}>
                    <span className="r-sec-num" style={{ color: "rgba(255,255,255,0.4)" }}>→</span>
                    <span className="r-sec-title">Expert Assessment</span>
                  </div>
                  <div className="insight-body">
                    <div className="insight-text">"{result.coach_insight}"</div>
                  </div>
                </div>
              )}

              {/* 7-DAY PLAN */}
              {plan.length > 0 && (
                <div className="r-section" style={{ marginTop: "2px" }}>
                  <div className="r-sec-head"><span className="r-sec-num">03</span><span className="r-sec-title">Your 7-Day Corrective Plan</span></div>
                  <div className="r-sec-body" style={{ padding: "16px" }}>
                    <div className="plan-list">
                      {plan.map((day, i) => (
                        <div key={i} className="plan-day">
                          <div className="plan-day-head" onClick={() => setExpandedDays((p) => ({ ...p, [i]: !p[i] }))}>
                            <span className="plan-day-num">Day {day.day || i + 1}</span>
                            <span className="plan-day-title">{day.title || day.theme || `Day ${i + 1}`}</span>
                            {day.focus && <span className="plan-day-focus">{day.focus}</span>}
                          </div>
                          {expandedDays[i] && (
                            <div className="plan-day-body">
                              <div className="ex-list">
                                {(day.exercises || []).map((ex, j) => (
                                  <div key={j} className="ex-item">
                                    <span className="ex-num">{String(j + 1).padStart(2, "0")}</span>
                                    <div>
                                      <div className="ex-name">{ex.name}</div>
                                      {(ex.sets || ex.reps || ex.duration) && (
                                        <div className="ex-spec">{[ex.sets, ex.reps || ex.duration].filter(Boolean).join(" · ")}</div>
                                      )}
                                      {ex.note && <div className="ex-note">{ex.note}</div>}
                                    </div>
                                  </div>
                                ))}
                              </div>
                              {day.note && <div className="day-note">{day.note}</div>}
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
                    <div className="call-eyebrow">Recommended next step</div>
                    <div className="call-title">Book a Free Strategy Call</div>
                    <div className="call-desc">Based on your profile, a 30-minute session with Max would give you a precise diagnosis and an accelerated recovery protocol tailored to your body and lifestyle.</div>
                  </div>
                  <a href="https://calendly.com/max-9tofit/performance-strategy-call" target="_blank" rel="noopener noreferrer" className="call-btn">Book Free Call →</a>
                </div>
              )}

              <div className={`email-bar ${emailSent ? "sent" : ""}`}>
                <span className="email-dot" />
                {emailSent ? `Full report sent to ${userInfo.email}` : "Sending your report by email…"}
              </div>
              <button className="restart-btn" onClick={reset}>← Start New Assessment</button>
            </div>
          )}

        </main>

        <footer className="footer">
          <span className="footer-text">9toFit · Pain &amp; Performance Scan</span>
          <span className="footer-text">9tofit.nl</span>
        </footer>
      </div>
    </>
  );
}
