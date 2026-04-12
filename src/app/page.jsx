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
    --radius: 16px;
    --radius-sm: 12px;
  }
  html, body { height: 100%; background: var(--paper); }
  body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; color: var(--text); -webkit-font-smoothing: antialiased; background: var(--paper); }
  .app { min-height: 100vh; display: flex; flex-direction: column; background: var(--paper); }
  .app::before { content: none; }

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
  .landing-divider { display: none; }
  .landing-pillars { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-bottom: 40px; border: none; }
  @media(max-width:600px){ .landing-pillars { grid-template-columns: 1fr; } }
  .pillar { padding: 20px; background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-sm); }
  .pillar:last-child { border-right: 1px solid var(--border); }
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

  /* ASSESSMENT */
  .assessment { width: 100%; max-width: 640px; padding-top: 48px; animation: fadeUp 0.5s ease both; }
  .progress-wrap { margin-bottom: 40px; }
  .progress-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
  .progress-label { font-size: 11px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; }
  .progress-bar { width: 100%; height: 4px; background: var(--border); border-radius: 2px; }
  .progress-fill { height: 100%; background: var(--accent); transition: width 0.4s ease; border-radius: 2px; }
  .q-block { animation: fadeUp 0.35s ease both; }
  .q-number { font-size: 11px; font-weight: 700; color: var(--accent); margin-bottom: 10px; }
  .q-title { font-size: clamp(22px, 4vw, 30px); color: #ffffff; margin-bottom: 8px; font-weight: 900; line-height: 1.15; letter-spacing: -0.3px; }
  .q-sub { font-size: 14px; color: var(--muted); margin-bottom: 28px; }
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
  .scale-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px; }
  .scale-btn {
    width: 48px; height: 48px; border: 1px solid var(--border); background: var(--card); border-radius: var(--radius-sm);
    font-size: 15px; font-weight: 700; color: var(--muted);
    cursor: pointer; transition: all 0.15s;
  }
  .scale-btn:hover { border-color: var(--accent); color: #ffffff; }
  .scale-btn.selected { background: var(--accent); border-color: var(--accent); color: #ffffff; }
  .scale-labels { display: flex; justify-content: space-between; font-size: 10px; font-weight: 600; color: var(--muted-light); margin-bottom: 28px; }
  .nav-row { display: flex; align-items: center; justify-content: space-between; }
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
    padding: 12px 14px; outline: none; transition: border-color 0.2s; width: 100%;
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

  @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

const QUESTIONS = [
  {
    id: "pain_location", number: "01 / 09",
    title: "Waar ervaar je pijn of ongemak?",
    sub: "Selecteer alle gebieden die van toepassing zijn.",
    type: "multi",
    options: [
      { icon: "🔙", label: "Onderrug", sub: "Lendenen regio" },
      { icon: "🦵", label: "Knie", sub: "Voor, achter of zijkant" },
      { icon: "💪", label: "Schouder", sub: "Gewricht of omliggende gebied" },
      { icon: "🦴", label: "Heup", sub: "Gewricht, billen of lies" },
      { icon: "🔝", label: "Nek / Bovenste Trapezius", sub: "Halswervels" },
      { icon: "🦶", label: "Enkel / Voet", sub: "Inclusief Achillespees" },
      { icon: "✋", label: "Pols / Elleboog", sub: "Onderarmen" },
      { icon: "⬆️", label: "Bovenrug / Thoracaal", sub: "Middenwervels" },
    ],
  },
  {
    id: "pain_timing", number: "02 / 09",
    title: "Wanneer heb je de meeste last?",
    sub: "Kies de optie die je pijnpatroon het best beschrijft.",
    type: "single",
    options: [
      { icon: "🌅", label: "Ochtendstijfheid", sub: "Eerste 30–60 minuten na het wakker worden" },
      { icon: "🏋️", label: "Tijdens training", sub: "Pijn treedt op tijdens lichaamsbeweging" },
      { icon: "😓", label: "Na training", sub: "Vertraagde pijn of ontstekingsreactie" },
      { icon: "💺", label: "Na lang zitten", sub: "Bureau, auto of bank" },
      { icon: "🚶", label: "Bepaalde bewegingen", sub: "Buigen, draaien, belasten" },
      { icon: "⏱️", label: "Constant / hele dag", sub: "Geen duidelijk patroon" },
    ],
  },
  {
    id: "movement_triggers", number: "03 / 09",
    title: "Welke bewegingen verergeren de pijn?",
    sub: "Selecteer alles wat van toepassing is.",
    type: "multi",
    options: [
      { icon: "⬇️", label: "Voorover buigen", sub: "Heupgewricht of flexie" },
      { icon: "🔄", label: "Draaien / torsie", sub: "Romp- of gewrichtrotatie" },
      { icon: "⬆️", label: "Omhoog reiken", sub: "Naar boven drukken of trekken" },
      { icon: "🪑", label: "Van zitten naar staan", sub: "Overgangsbewegingen" },
      { icon: "🏃", label: "Hardlopen / impact", sub: "Belasting bij voetcontact" },
      { icon: "🏋️", label: "Squatten / longes", sub: "Kniedominante patronen" },
      { icon: "🛏️", label: "Vlak liggend", sub: "Rug- of buikpositie" },
      { icon: "❓", label: "Onzeker", sub: "Geen duidelijke trigger" },
    ],
  },
  {
    id: "pain_duration", number: "04 / 09",
    title: "Hoe lang heb je hier al last van?",
    sub: "Acute versus chronische pijn vereist verschillende benaderingen.",
    type: "single",
    options: [
      { icon: "⚡", label: "Minder dan 1 week", sub: "Recent ontstaan" },
      { icon: "📅", label: "1–4 weken", sub: "Sub-acute fase" },
      { icon: "🗓️", label: "1–3 maanden", sub: "Vroeg chronisch" },
      { icon: "📆", label: "3–12 maanden", sub: "Chronisch patroon" },
      { icon: "♾️", label: "Meer dan een jaar", sub: "Langdurige klacht" },
    ],
  },
  {
    id: "pain_intensity", number: "05 / 09",
    title: "Beoordeel je gemiddelde pijnniveau",
    sub: "0 = geen pijn · 10 = ernstigst voorstelbare pijn",
    type: "scale", min: 0, max: 10,
    minLabel: "Geen pijn", maxLabel: "Ondraaglijk",
  },
  {
    id: "work_type", number: "06 / 09",
    title: "Wat beschrijft jouw werkdag het best?",
    sub: "Dagelijkse houdings patronen beïnvloeden bewegingskwaliteit rechtstreeks.",
    type: "single",
    options: [
      { icon: "💻", label: "Bureau / kantoor", sub: "Vooral zittend, schermwerk" },
      { icon: "✈️", label: "Veel reizen", sub: "Lange vluchtreizen, zittend" },
      { icon: "🔧", label: "Handwerk / fysiek", sub: "Tillen, staan, repetitief" },
      { icon: "🏃", label: "Vooral staand", sub: "Retail, horeca, medisch" },
      { icon: "🏠", label: "Thuis werken", sub: "Variabele houding" },
    ],
  },
  {
    id: "training_history", number: "07 / 09",
    title: "Hoe beschrijf je je trainingsgeschiedenis?",
    sub: "Dit bepaalt de intensiteit van je correctieve plan.",
    type: "single",
    options: [
      { icon: "🌱", label: "Beginner", sub: "Minder dan 6 maanden consistent" },
      { icon: "📈", label: "Gemiddeld", sub: "1–3 jaar trainingserfaring" },
      { icon: "💪", label: "Gevorderd", sub: "3+ jaar, gestructureerd programma" },
      { icon: "⏸️", label: "Momenteel inactief", sub: "Gestopt vanwege pijn of leven" },
      { icon: "🏆", label: "Sportachtergrond", sub: "Voormalig of huidig atleet" },
    ],
  },
  {
    id: "activity_level", number: "08 / 09",
    title: "Hoeveel dagen per week ben je actief?",
    sub: "Inclusief elke vorm van oefening, sport of fysieke activiteit.",
    type: "scale", min: 0, max: 7,
    minLabel: "Geen", maxLabel: "Dagelijks",
  },
  {
    id: "previous_treatment", number: "09 / 09",
    title: "Heb je eerder professionele hulp gezocht?",
    sub: "Selecteer alles wat van toepassing is.",
    type: "multi",
    options: [
      { icon: "👨‍⚕️", label: "Huisarts / Arts", sub: "Algemene diagnose" },
      { icon: "🦴", label: "Fysiotherapeut", sub: "Bewegingsrevalidatie" },
      { icon: "💆", label: "Osteopaat / Chiropractor", sub: "Handelijke therapie" },
      { icon: "🩺", label: "Specialist / MRI", sub: "Beeldvorming of diagnose" },
      { icon: "❌", label: "Nog geen behandeling", sub: "Eerste keer hulp zoeken" },
    ],
  },
];

const ANALYZE_STEPS = [
  "Pijnpatroon data verwerken…",
  "Bewegingsbeperkingen in kaart brengen…",
  "Risicofactoren berekenen…",
  "7-daags correctief plan genereren…",
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
              <div className="landing-kicker"><span className="kicker-line" />Gratis Bewegingsanalyse</div>
              <h1 className="landing-h1">Je lichaam is<br />je iets aan<br /><em>het vertellen.</em></h1>
              <p className="landing-sub">
                Beantwoord 9 gerichte vragen over je pijn, bewegingspatronen en leefstijl.
                Ontvang een klinische bewegingsanalyse en een persoonlijk 7-daags correctief plan — in minder dan 3 minuten.
              </p>
              <div className="landing-divider" />
              <div className="landing-pillars">
                <div className="pillar">
                  <div className="pillar-num">01</div>
                  <div className="pillar-title">Bewegingsbeperkingen</div>
                  <div className="pillar-desc">Ontdek precies welke patronen beperkt zijn en waarom.</div>
                </div>
                <div className="pillar">
                  <div className="pillar-num">02</div>
                  <div className="pillar-title">Risicofactor Analyse</div>
                  <div className="pillar-desc">Begrijp wat je pijn veroorzaakt voordat het een blessure wordt.</div>
                </div>
                <div className="pillar">
                  <div className="pillar-num">03</div>
                  <div className="pillar-title">7-Daags Correctief Plan</div>
                  <div className="pillar-desc">Dagelijkse oefeningen afgestemd op jouw specifieke klacht.</div>
                </div>
              </div>
              <div className="cta-row">
                <button className="cta-btn" onClick={() => setPhase("assessment")}>
                  Start Je Scan <span>→</span>
                </button>
                <span className="cta-note">Gratis · 3 minuten · Geen account nodig</span>
              </div>
            </div>
          )}

          {/* ASSESSMENT */}
          {phase === "assessment" && (
            <div className="assessment">
              <div className="progress-wrap">
                <div className="progress-top">
                  <span className="progress-label">Voortgang Beoordeling</span>
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
                  {step > 0 ? <button className="back-btn" onClick={() => setStep((s) => s - 1)}>← Terug</button> : <span />}
                  <button className="next-btn" onClick={nextStep} disabled={!canProceed()}>
                    {step === QUESTIONS.length - 1 ? "Ontvang Mijn Rapport" : "Volgende"} →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* GATE */}
          {phase === "gate" && (
            <div className="gate">
              <div className="gate-box">
                <div className="gate-eyebrow">Beoordeling voltooid — 9 / 9 vragen</div>
                <div className="gate-title">Je rapport is klaar.<br />Waar moeten we het naartoe sturen?</div>
                <div className="gate-sub">
                  Vul je gegevens in om je persoonlijke bewegingsanalyse en 7-daags correctief plan direct via e-mail te ontvangen.
                </div>
                {error && <div className="gate-error">⚠ {error} — probeer alstublieft opnieuw</div>}
                <div className="gate-preview">
                  <div className="preview-pill">Bewegingsbeperkingen: geïdentificeerd</div>
                  <div className="preview-pill">Risico Niveau: geanalyseerd</div>
                  <div className="preview-pill">7-Daags Plan: gegenereerd</div>
                  <div className="preview-pill">Expert Beoordeling: gereed</div>
                </div>
                <div className="gate-fields">
                  <div className="field-wrap">
                    <label className="field-label">Voornaam</label>
                    <input className="field-input" type="text" placeholder="Jan" value={userInfo.name} onChange={(e) => setUserInfo((p) => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div className="field-wrap">
                    <label className="field-label">E-mailadres</label>
                    <input className="field-input" type="email" placeholder="jan@voorbeeld.nl" value={userInfo.email} onChange={(e) => setUserInfo((p) => ({ ...p, email: e.target.value }))} />
                    {userInfo.email && userInfo.email.includes("@") && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(userInfo.email) && (
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "10px", color: "#ff6b6b", marginTop: "6px", letterSpacing: "0.5px" }}>Check je emailadres — dit lijkt niet geldig</div>
                    )}
                  </div>
                </div>
                <button className="submit-btn" onClick={runAnalysis} disabled={!userInfo.name || !userInfo.email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(userInfo.email)}>
                  Analyseer Mijn Beweging →
                </button>
                <div className="submit-note">Je resultaten worden direct gemaild · Geen spam, ooit</div>
              </div>
            </div>
          )}

          {/* ANALYZING */}
          {phase === "analyzing" && (
            <div className="analyzing">
              <div className="analyzing-spinner" />
              <div className="analyzing-title">Je bewegingsprofiel analyseren…</div>
              <div className="analyzing-sub">Je persoonlijke rapport opbouwen</div>
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
                <div className="result-eyebrow">Pijn & Prestatie Rapport · {userInfo.name}</div>
                <div className="result-name">
                  {result.headline
                    ? <span dangerouslySetInnerHTML={{ __html: result.headline.replace(/\*(.+?)\*/g, '<em>$1</em>') }} />
                    : <>Bewegingsanalyse<br />voltooid voor <em>{userInfo.name}</em></>
                  }
                </div>
                <div className="risk-row">
                  {result.overall_risk && <span className={`risk-tag ${getRiskClass(result.overall_risk)}`}>Risico: {result.overall_risk}</span>}
                  {result.primary_area && <span className="risk-tag risk-neutral">Primair: {result.primary_area}</span>}
                  {result.urgency && <span className="risk-tag risk-moderate">{result.urgency}</span>}
                </div>
              </div>

              {/* MOVEMENT LIMITATIONS */}
              <div className="r-section">
                <div className="r-sec-head"><span className="r-sec-num">01</span><span className="r-sec-title">Geïdentificeerde Bewegingsbeperkingen</span></div>
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
                    <p>{result.movement_limitations_text || "Zie gedetailleerde analyse in je e-mail."}</p>
                  )}
                </div>
              </div>

              {/* RISK FACTORS */}
              <div className="r-section" style={{ marginTop: "2px" }}>
                <div className="r-sec-head"><span className="r-sec-num">02</span><span className="r-sec-title">Risicofactor Analyse</span></div>
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
                    <span className="r-sec-title">Expert Beoordeling</span>
                  </div>
                  <div className="insight-body">
                    <div className="insight-text">"{result.coach_insight}"</div>
                  </div>
                </div>
              )}

              {/* 7-DAY PLAN */}
              {plan.length > 0 && (
                <div className="r-section" style={{ marginTop: "2px" }}>
                  <div className="r-sec-head"><span className="r-sec-num">03</span><span className="r-sec-title">Je 7-Daags Correctief Plan</span></div>
                  <div className="r-sec-body" style={{ padding: "16px" }}>
                    <div className="plan-list">
                      {plan.map((day, i) => (
                        <div key={i} className="plan-day">
                          <div className="plan-day-head" onClick={() => setExpandedDays((p) => ({ ...p, [i]: !p[i] }))}>
                            <span className="plan-day-num">Dag {day.day || i + 1}</span>
                            <span className="plan-day-title">{day.title || day.theme || `Dag ${i + 1}`}</span>
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
                    <div className="call-eyebrow">Aanbevolen volgende stap</div>
                    <div className="call-title">Boek een Gratis Strategiebeslissing</div>
                    <div className="call-desc">Op basis van jouw profiel zou een 30-minuten sessie met Max je een precieze diagnose geven en een versnellingsprotocol gericht op jouw lichaam en leefstijl.</div>
                  </div>
                  <a href="https://calendly.com/max-9tofit/performance-strategy-call" target="_blank" rel="noopener noreferrer" className="call-btn">Boek Gratis Gesprek →</a>
                </div>
              )}

              <div className={`email-bar ${emailSent ? "sent" : ""}`}>
                <span className="email-dot" />
                {emailSent ? `Volledig rapport verzonden naar ${userInfo.email}` : "Je rapport via e-mail versturen…"}
              </div>
              <button className="restart-btn" onClick={reset}>← Nieuwe Beoordeling Starten</button>
            </div>
          )}

        </main>


      </div>
    </>
  );
}
