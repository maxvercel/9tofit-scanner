"use client";
import { useState, useEffect } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --ink: #ffffff;
    --paper: #161616;
    --warm: #1e1e1e;
    --border: #252525;
    --accent: #ffffff;
    --accent-light: rgba(255,255,255,0.06);
    --gold: #cccccc;
    --text: #e8e8e8;
    --muted: #888888;
    --muted-light: #555555;
    --green: #aaaaaa;
    --green-light: rgba(255,255,255,0.04);
  }
  html, body { height: 100%; background: #161616; }
  body { font-family: 'Barlow', sans-serif; color: var(--text); -webkit-font-smoothing: antialiased; background: #161616; }
  .app { min-height: 100vh; display: flex; flex-direction: column; background: #161616; }
  .app::before { content: none; }

  .main { flex: 1; position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; padding: 0 20px 60px; }

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

  // Report height to parent WordPress page so iframe resizes automatically
  useEffect(() => {
    const reportHeight = () => {
      const height = document.body.scrollHeight;
      window.parent.postMessage({ type: 'iframeHeight', height }, '*');
    };
    reportHeight();
    const observer = new ResizeObserver(reportHeight);
    observer.observe(document.body);
    return () => observer.disconnect();
  }, [phase]);

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
      // Send email report (existing flow)
      fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: userInfo.name, email: userInfo.email, result: data.result, answers, type: "pain_performance" }),
      }).then(() => setEmailSent(true)).catch(() => {});
      // Submit to 9toFit platform → creates account + AI program + magic link
      const platformUrl = process.env.NEXT_PUBLIC_PLATFORM_URL || "https://app.9tofit.nl";
      fetch(`${platformUrl}/api/scan-submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: userInfo.name,
          email: userInfo.email,
          pain_locations: answers.pain_location || [],
          pain_timing: answers.pain_timing || "",
          movement_triggers: answers.movement_triggers || [],
          pain_duration: answers.pain_duration || "",
          pain_intensity: answers.pain_intensity ?? 0,
          work_situation: answers.work_type || "",
          training_background: answers.training_history || "",
          activity_days_per_week: answers.activity_level ?? 0,
          professional_help: answers.previous_treatment || [],
          // Pass scanner AI result for logging/future reuse (platform still runs its own generation)
          scanner_ai_result: data.result || null,
        }),
      }).catch((err) => console.error("Platform submit error:", err));
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
                    {userInfo.email && userInfo.email.includes("@") && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(userInfo.email) && (
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", color: "#ff6b6b", marginTop: "6px", letterSpacing: "0.5px" }}>Check je emailadres — dit lijkt niet geldig</div>
                    )}
                  </div>
                </div>
                <button className="submit-btn" onClick={runAnalysis} disabled={!userInfo.name || !userInfo.email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(userInfo.email)}>
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


      </div>
    </>
  );
}
