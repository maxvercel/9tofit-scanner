// ── Lightweight translator for email templates ──
// Default language is NL. Pass lang='en' to render English.
// Missing keys fall back to the NL value, so partial translation is safe.
const EMAIL_TRANSLATIONS = {
  // Subjects
  'Jouw Bewegingsanalyse Rapport': { en: 'Your Movement Analysis Report' },
  'Risico': { en: 'Risk' },
  '7-Daags Plan': { en: '7-Day Plan' },
  // Labels
  'Bewegingsanalyse Rapport': { en: 'Movement Analysis Report' },
  'Bewegingsanalyse': { en: 'Movement Analysis' },
  'Risiconiveau': { en: 'Risk Level' },
  'Probleemgebied': { en: 'Problem Area' },
  'Pijnscore': { en: 'Pain Score' },
  'Expert Beoordeling': { en: 'Expert Assessment' },
  'Bewegingsbeperkingen': { en: 'Movement Limitations' },
  'Risicofactoren': { en: 'Risk Factors' },
  'Je 7-Daags Correctieplan': { en: 'Your 7-Day Corrective Plan' },
  'DAG': { en: 'DAY' },
  'Toegang': { en: 'Access' },
  'Direct beschikbaar': { en: 'Available now' },
  'Programma': { en: 'Program' },
  'Persoonlijk schema': { en: 'Personal program' },
  'Vragen of opmerkingen?': { en: 'Questions or feedback?' },
  // Pain email hero
  'jouw': { en: 'your' },
  'analyse is klaar.': { en: 'analysis is ready.' },
  'Bekijk hieronder jouw bewegingsbeperkingen, risicofactoren en het 7-daagse correctieplan.': {
    en: 'See your movement limitations, risk factors and 7-day corrective plan below.',
  },
  '— Max, 9toFit Bewegingsspecialist': { en: '— Max, 9toFit Movement Specialist' },
  // Intake subjects
  'Welkom bij 9toFit — Intake Ontvangen': { en: 'Welcome to 9toFit — Intake Received' },
  'Welkom bij 9toFit — Profiel Ontvangen': { en: 'Welcome to 9toFit — Profile Received' },
  // Coach email subjects
  'Pijn Scan': { en: 'Pain Scan' },
  'Pijn': { en: 'Pain' },
  'Wil Direct Starten': { en: 'Wants To Start Now' },
  'Schema Opstellen': { en: 'Build Program' },
  // Risk values (Claude may return either depending on lang)
  'Laag': { en: 'Low' },
  'Gemiddeld': { en: 'Moderate' },
  'Hoog': { en: 'High' },
  // Intake body
  'Je intake is ontvangen': { en: 'Your intake has been received' },
  'Je profiel is ontvangen': { en: 'Your profile has been received' },
  'Wat gebeurt er nu?': { en: 'What happens next?' },
  'Je coach Max bekijkt je profiel': { en: 'Your coach Max reviews your profile' },
  'Je ontvangt binnen 24 uur een persoonlijk schema': { en: 'You receive a personal program within 24 hours' },
  'Je traint mee in de 9toFit app': { en: 'You train along in the 9toFit app' },
  'Heb je vragen? Stuur me direct een mail.': { en: 'Got questions? Send me a direct email.' },
  '— Max': { en: '— Max' },
  // Intake email
  'je intake<br>is ontvangen.': { en: 'your intake<br>has been received.' },
  'welkom<br>bij 9toFit.': { en: 'welcome<br>to 9toFit.' },
  'Fysio Intake': { en: 'Physio Intake' },
  'Performance Scan': { en: 'Performance Scan' },
  'Je profiel is doorgestuurd naar coach Max. Hij neemt zo snel mogelijk contact met je op om je persoonlijke trainingsschema te bespreken.': {
    en: 'Your profile has been forwarded to coach Max. He will contact you as soon as possible to discuss your personal training program.',
  },
  'Je profiel is ontvangen! Coach Max bouwt een persoonlijk trainingsschema op maat. Je ontvangt binnen 24 uur bericht zodra je schema klaarstaat.': {
    en: 'Your profile has been received! Coach Max is building a personal custom training program. You will hear back within 24 hours once your program is ready.',
  },
  'Wat nu?': { en: 'What now?' },
  'Check je inbox — je ontvangt een aparte <strong style="color:#fff;">magic link</strong> om direct in te loggen': {
    en: 'Check your inbox — you will receive a separate <strong style="color:#fff;">magic link</strong> to log in directly',
  },
  'Je coach bekijkt je profiel en stelt een schema op': {
    en: 'Your coach reviews your profile and builds a program',
  },
  'Start met trainen zodra je schema klaarstaat in de app': {
    en: 'Start training as soon as your program is ready in the app',
  },
  'Na pakketkeuze': { en: 'After plan selection' },
  'Volgende stap': { en: 'Next step' },
  'Coach intake': { en: 'Coach intake' },
  'Schema op maat': { en: 'Custom program' },
  'Sneller starten?': { en: 'Start sooner?' },
  'Plan een kennismakingsgesprek': { en: 'Schedule an intro call' },
  '30 minuten met Max — gratis en vrijblijvend.': {
    en: '30 minutes with Max — free and no obligation.',
  },
  'PLAN GESPREK →': { en: 'SCHEDULE CALL →' },
  'Nieuw Scan Profiel': { en: 'New Scan Profile' },
  'Cliënt': { en: 'Client' },
  '⚡ WIL DIRECT STARTEN': { en: '⚡ WANTS TO START NOW' },
};

function tEmail(text, lang) {
  if (lang !== 'en' || !text) return text;
  const entry = EMAIL_TRANSLATIONS[text];
  return entry?.en || text;
}

export async function POST(request) {
  try {
    const { name, email, result, answers, type, scanPath, extraData, lang } = await request.json();

    console.log('Send route called for:', email, 'type:', type || scanPath, 'risk:', result?.overall_risk, 'lang:', lang || 'nl');

    const fromEmail = 'noreply@9tofit.nl';
    const coachEmail = process.env.NEXT_PUBLIC_COACH_EMAIL || 'max@9tofit.nl';

    // ── Determine which flow we're in ──
    const isPainPath = scanPath === 'pain' || type === 'pain_performance';
    const isFysioPath = scanPath === 'fysio' || type === 'fysio_intake';
    const isFitnessPath = scanPath === 'fitness' || type === 'fitness_intake';

    // ── PAIN PATH: Full AI analysis emails ──
    if (isPainPath && result) {
      await sendPainEmails({ name, email, result, answers, fromEmail, coachEmail, extraData, lang });
    }
    // ── FITNESS/FYSIO PATH: Intake confirmation + coach brief ──
    else if (isFitnessPath || isFysioPath) {
      await sendIntakeEmails({ name, email, fromEmail, coachEmail, scanPath: isFysioPath ? 'fysio' : 'fitness', extraData, lang });
    }

    // ── Mailchimp subscription (all paths) ──
    const { MAILCHIMP_API_KEY, MAILCHIMP_SERVER, MAILCHIMP_AUDIENCE_ID } = process.env;
    if (MAILCHIMP_API_KEY && MAILCHIMP_SERVER && MAILCHIMP_AUDIENCE_ID) {
      const parts = name.trim().split(' ');
      const tag = isPainPath ? 'pain-performance-scan' : isFysioPath ? 'fysio-intake' : 'fitness-intake';
      const mcRes = await fetch(`https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString('base64')}`
        },
        body: JSON.stringify({
          email_address: email, status: 'subscribed',
          merge_fields: { FNAME: parts[0] || name, LNAME: parts.slice(1).join(' ') || '' },
          tags: [tag]
        })
      });
      const mcData = await mcRes.json();
      if (!mcRes.ok && mcData.title !== 'Member Exists') {
        console.error('Mailchimp error:', mcData.detail);
      } else {
        console.log('Mailchimp:', mcRes.ok ? 'subscribed' : 'already exists', email);
      }
    }

    return Response.json({ success: true });

  } catch (error) {
    console.error('Send error:', error.message);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ════════════════════════════════════════
// PAIN PATH EMAILS (existing logic, enriched with extraData)
// ════════════════════════════════════════
async function sendPainEmails({ name, email, result, answers, fromEmail, coachEmail, extraData, lang }) {
  const tt = (s) => tEmail(s, lang);
  const riskColor = result?.overall_risk?.toLowerCase() === 'high' || result?.overall_risk?.toLowerCase() === 'hoog' ? '#ff4444'
    : result?.overall_risk?.toLowerCase() === 'low' || result?.overall_risk?.toLowerCase() === 'laag' ? '#44bb44'
    : '#ffaa00';

  const planHtml = Array.isArray(result?.seven_day_plan)
    ? result.seven_day_plan.map(day => `
      <tr><td style="padding:0 0 12px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#111318;border:1px solid #27272a;border-radius:6px;">
          <tr><td style="padding:12px 16px;border-bottom:1px solid #27272a;">
            <span style="font-size:10px;color:#71717a;font-family:'Courier New',monospace;letter-spacing:2px;">${tt('DAG')} ${day.day || ''}</span>
            <strong style="font-size:13px;color:#ffffff;margin-left:10px;">${day.title || ''}</strong>
            ${day.focus ? `<span style="font-size:10px;color:#a1a1aa;margin-left:8px;font-family:'Courier New',monospace;">${day.focus}</span>` : ''}
          </td></tr>
          <tr><td style="padding:12px 16px;">
            ${(day.exercises || []).map((ex, i) => `
              <div style="margin-bottom:10px;">
                <div style="font-size:13px;font-weight:700;color:#e4e4e7;">${i + 1}. ${ex.name || ''}</div>
                ${ex.sets || ex.duration || ex.reps ? `<div style="font-size:11px;color:#71717a;font-family:'Courier New',monospace;margin:2px 0;">${[ex.sets, ex.reps || ex.duration].filter(Boolean).join(' · ')}</div>` : ''}
                ${ex.note ? `<div style="font-size:12px;color:#a1a1aa;line-height:1.5;">${ex.note}</div>` : ''}
              </div>`).join('')}
          </td></tr>
        </table>
      </td></tr>`).join('')
    : '';

  const limitationsHtml = Array.isArray(result?.movement_limitations)
    ? result.movement_limitations.map(lim => `
      <div style="margin-bottom:10px;padding:14px 16px;background:#111318;border-left:3px solid ${riskColor};border-radius:0 6px 6px 0;">
        <div style="font-size:13px;font-weight:700;color:#e4e4e7;margin-bottom:4px;">${lim.icon || ''} ${lim.name || ''}</div>
        ${lim.description ? `<div style="font-size:12px;color:#a1a1aa;line-height:1.6;">${lim.description}</div>` : ''}
      </div>`).join('')
    : '';

  const riskFactorsHtml = Array.isArray(result?.risk_factors)
    ? result.risk_factors.map(r => `<div style="font-size:13px;color:#a1a1aa;padding:6px 0;border-bottom:1px solid #27272a;">• ${r}</div>`).join('')
    : '';

  // ── Client email (dark theme — 9tofit design tokens) ──
  const clientHtml = `<!DOCTYPE html>
<html lang="nl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#09090b;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;padding:40px 16px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

  <tr><td style="padding:0 0 32px 0;">
    <div style="font-size:11px;font-weight:700;letter-spacing:4px;color:#ffffff;text-transform:uppercase;">9TOFIT</div>
    <div style="font-size:8px;letter-spacing:3px;color:#71717a;text-transform:uppercase;margin-top:4px;">PERFORMANCE COACHING</div>
  </td></tr>

  <tr><td style="padding:0 0 24px 0;">
    <div style="width:48px;height:3px;background:${riskColor};border-radius:2px;"></div>
  </td></tr>

  <tr><td style="padding:0 0 12px 0;">
    <div style="font-size:10px;letter-spacing:3px;color:${riskColor};text-transform:uppercase;font-family:'Courier New',monospace;">${tt('Bewegingsanalyse Rapport')}</div>
  </td></tr>

  <tr><td style="padding:0 0 24px 0;">
    <div style="font-size:32px;font-weight:900;color:#ffffff;line-height:1.05;text-transform:uppercase;letter-spacing:1px;">${name}, ${tt('jouw')}<br>${tt('analyse is klaar.')}</div>
  </td></tr>

  <tr><td style="padding:0 0 28px 0;">
    <div style="width:100%;height:1px;background:#27272a;"></div>
  </td></tr>

  <tr><td style="padding:0 0 24px 0;">
    <div style="font-size:15px;color:#a1a1aa;line-height:1.8;max-width:460px;">${tt('Bekijk hieronder jouw bewegingsbeperkingen, risicofactoren en het 7-daagse correctieplan.')}</div>
  </td></tr>

  <tr><td style="padding:0 0 2px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #27272a;border-radius:8px;">
      <tr>
        <td style="padding:16px 20px;border-right:1px solid #27272a;width:33%;vertical-align:top;">
          <div style="font-size:9px;letter-spacing:2px;color:#71717a;text-transform:uppercase;font-family:'Courier New',monospace;margin-bottom:6px;">${tt('Risiconiveau')}</div>
          <div style="font-size:20px;font-weight:900;color:${riskColor};text-transform:uppercase;">${result?.overall_risk || '—'}</div>
        </td>
        <td style="padding:16px 20px;border-right:1px solid #27272a;width:33%;vertical-align:top;">
          <div style="font-size:9px;letter-spacing:2px;color:#71717a;text-transform:uppercase;font-family:'Courier New',monospace;margin-bottom:6px;">${tt('Probleemgebied')}</div>
          <div style="font-size:14px;font-weight:700;color:#ffffff;">${result?.primary_area || '—'}</div>
        </td>
        <td style="padding:16px 20px;width:33%;vertical-align:top;">
          <div style="font-size:9px;letter-spacing:2px;color:#71717a;text-transform:uppercase;font-family:'Courier New',monospace;margin-bottom:6px;">${tt('Pijnscore')}</div>
          <div style="font-size:14px;font-weight:700;color:#ffffff;">${answers?.pain_intensity ?? '—'}/10</div>
        </td>
      </tr>
    </table>
  </td></tr>

  ${result?.coach_insight ? `
  <tr><td style="padding:16px 0 2px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#18181b;border-left:3px solid ${riskColor};border-radius:0 8px 8px 0;">
      <tr><td style="padding:20px 24px;">
        <div style="font-size:9px;letter-spacing:2px;color:${riskColor};text-transform:uppercase;font-family:'Courier New',monospace;margin-bottom:10px;">${tt('Expert Beoordeling')}</div>
        <div style="font-size:14px;color:#e4e4e7;line-height:1.8;font-style:italic;">"${result.coach_insight}"</div>
        <div style="font-size:9px;letter-spacing:2px;color:#71717a;text-transform:uppercase;font-family:'Courier New',monospace;margin-top:12px;">${tt('— Max, 9toFit Bewegingsspecialist')}</div>
      </td></tr>
    </table>
  </td></tr>` : ''}

  ${limitationsHtml ? `
  <tr><td style="padding:16px 0 2px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#18181b;border:1px solid #27272a;border-radius:8px;">
      <tr><td style="padding:20px 24px 10px;">
        <div style="font-size:9px;letter-spacing:2px;color:#71717a;text-transform:uppercase;font-family:'Courier New',monospace;margin-bottom:14px;">${tt('Bewegingsbeperkingen')}</div>
        ${limitationsHtml}
      </td></tr>
    </table>
  </td></tr>` : ''}

  ${riskFactorsHtml ? `
  <tr><td style="padding:16px 0 2px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#18181b;border:1px solid #27272a;border-radius:8px;">
      <tr><td style="padding:20px 24px;">
        <div style="font-size:9px;letter-spacing:2px;color:#71717a;text-transform:uppercase;font-family:'Courier New',monospace;margin-bottom:14px;">${tt('Risicofactoren')}</div>
        ${riskFactorsHtml}
      </td></tr>
    </table>
  </td></tr>` : ''}

  ${planHtml ? `
  <tr><td style="padding:16px 0 2px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#18181b;border:1px solid #27272a;border-radius:8px;">
      <tr><td style="padding:20px 24px 8px;">
        <div style="font-size:9px;letter-spacing:2px;color:#71717a;text-transform:uppercase;font-family:'Courier New',monospace;margin-bottom:14px;">${tt('Je 7-Daags Correctieplan')}</div>
        <table width="100%" cellpadding="0" cellspacing="0">${planHtml}</table>
      </td></tr>
    </table>
  </td></tr>` : ''}

  <tr><td style="padding:16px 0 2px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #27272a;border-radius:8px;">
      <tr>
        <td width="50%" style="padding:20px;border-right:1px solid #27272a;vertical-align:top;">
          <div style="font-size:9px;letter-spacing:2px;color:#71717a;text-transform:uppercase;font-family:'Courier New',monospace;margin-bottom:8px;">Toegang</div>
          <div style="font-size:14px;color:#ffffff;font-weight:700;">${tt('Direct beschikbaar')}</div>
        </td>
        <td width="50%" style="padding:20px;vertical-align:top;">
          <div style="font-size:9px;letter-spacing:2px;color:#71717a;text-transform:uppercase;font-family:'Courier New',monospace;margin-bottom:8px;">Programma</div>
          <div style="font-size:14px;color:#ffffff;font-weight:700;">7-daags correctieplan</div>
        </td>
      </tr>
    </table>
  </td></tr>

  <tr><td style="padding:24px 0 0 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#18181b;border:1px solid rgba(249,115,22,0.2);border-radius:8px;">
      <tr><td style="padding:24px;">
        <div style="font-size:9px;letter-spacing:2px;color:#f97316;text-transform:uppercase;font-family:'Courier New',monospace;margin-bottom:8px;">Volgende Stap</div>
        <div style="font-size:18px;font-weight:900;color:#ffffff;margin-bottom:8px;line-height:1.1;">Boek Je Gratis Strategiegesprek</div>
        <div style="font-size:13px;color:#a1a1aa;line-height:1.7;margin-bottom:16px;">30 minuten met Max — een precieze diagnose en een geacceleerd herstelprotocol speciaal voor jouw situatie.</div>
        <a href="https://calendly.com/max-9tofit/performance-strategy-call" style="display:inline-block;background:#f97316;color:#ffffff;text-decoration:none;font-size:12px;font-weight:700;letter-spacing:2px;padding:12px 24px;text-transform:uppercase;border-radius:8px;">GRATIS AFSPRAAK MAKEN →</a>
      </td></tr>
    </table>
  </td></tr>

  <tr><td style="padding:32px 0 0 0;">
    <div style="font-size:9px;letter-spacing:2px;color:#3f3f46;text-transform:uppercase;font-family:'Courier New',monospace;text-align:center;">9toFit Performance Coaching · 9tofit.nl</div>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  // ── Coach email (light theme, detailed brief) ──
  const qaRows = [
    { q: 'Leeftijd', a: extraData?.age_range || '—' },
    { q: 'Trainingsachtergrond', a: extraData?.training_background || answers?.training_history || '—' },
    { q: 'Doelen', a: Array.isArray(extraData?.goals) ? extraData.goals.join(', ') : '—' },
    { q: 'Jaardoel', a: extraData?.year_goal_text || '—' },
    { q: 'Werksituatie', a: answers?.work_type || extraData?.work_situation || '—' },
    { q: 'Werkuren/week', a: extraData?.work_hours_per_week || '—' },
    { q: 'Kinderen', a: extraData?.has_children ? `Ja, ${extraData.children_count || '?'}` : extraData?.has_children === false ? 'Nee' : '—' },
    { q: 'Trainingsdagen/week', a: `${answers?.activity_level ?? extraData?.training_days_available ?? '—'} dagen` },
    { q: 'Start urgentie', a: extraData?.start_urgency || '—' },
    { q: 'Pijnlocatie(s)', a: Array.isArray(answers?.pain_location) ? answers.pain_location.join(', ') : '—' },
    { q: 'Wanneer pijn', a: answers?.pain_timing || '—' },
    { q: 'Bewegingstriggers', a: Array.isArray(answers?.movement_triggers) ? answers.movement_triggers.join(', ') : '—' },
    { q: 'Duur', a: answers?.pain_duration || '—' },
    { q: 'Pijnintensiteit', a: `${answers?.pain_intensity ?? '—'}/10` },
  ].map(row => `
    <tr>
      <td style="padding:10px 14px;border-bottom:1px solid #f0f0f0;width:40%;vertical-align:top;">
        <span style="font-size:11px;font-weight:700;color:#333;text-transform:uppercase;letter-spacing:0.5px;">${row.q}</span>
      </td>
      <td style="padding:10px 14px;border-bottom:1px solid #f0f0f0;vertical-align:top;">
        <span style="font-size:13px;color:#111;">${row.a}</span>
      </td>
    </tr>`).join('');

  const coachLimitations = Array.isArray(result?.movement_limitations)
    ? result.movement_limitations.map(lim => `
      <div style="margin-bottom:12px;padding:14px;background:#fafafa;border-left:3px solid ${riskColor};">
        <div style="font-size:13px;font-weight:700;color:#111;margin-bottom:4px;">${lim.icon || ''} ${lim.name || ''}</div>
        <div style="font-size:12px;color:#555;line-height:1.6;">${lim.description || lim.desc || ''}</div>
      </div>`).join('')
    : '';

  const coachRiskFactors = Array.isArray(result?.risk_factors)
    ? result.risk_factors.map(r => `<div style="font-size:13px;color:#333;padding:6px 0;border-bottom:1px solid #f0f0f0;">• ${r}</div>`).join('')
    : '';

  const coachPlan = Array.isArray(result?.seven_day_plan)
    ? result.seven_day_plan.map(day => `
      <div style="margin-bottom:12px;border:1px solid #e8e8e8;">
        <div style="padding:10px 14px;background:#f5f5f5;border-bottom:1px solid #e8e8e8;">
          <strong style="font-size:12px;color:#111;text-transform:uppercase;letter-spacing:1px;">Dag ${day.day} — ${day.title || ''}</strong>
          ${day.focus ? `<span style="font-size:10px;color:#888;margin-left:8px;">${day.focus}</span>` : ''}
        </div>
        <div style="padding:10px 14px;">
          ${(day.exercises || []).map((ex, i) => `
            <div style="margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid #f5f5f5;">
              <span style="font-size:12px;font-weight:700;color:#111;">${i+1}. ${ex.name || ''}</span>
              ${ex.sets || ex.duration || ex.reps ? `<span style="font-size:11px;color:#888;margin-left:8px;">${[ex.sets, ex.reps || ex.duration].filter(Boolean).join(' · ')}</span>` : ''}
              ${ex.note ? `<div style="font-size:11px;color:#666;margin-top:2px;line-height:1.5;">${ex.note}</div>` : ''}
            </div>`).join('')}
          ${day.note ? `<div style="font-size:11px;color:#888;font-style:italic;padding-top:4px;">${day.note}</div>` : ''}
        </div>
      </div>`).join('')
    : '';

  const coachHtml = `<!DOCTYPE html>
<html lang="nl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f0f0;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
<tr><td align="center">
<table width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;">

  <tr><td style="background:#111;padding:20px 28px;border-bottom:4px solid ${riskColor};">
    <div style="font-size:18px;font-weight:900;letter-spacing:3px;color:#fff;text-transform:uppercase;">9toFit — Coach Intake Brief</div>
    <div style="font-size:10px;letter-spacing:2px;color:#555;text-transform:uppercase;margin-top:4px;">Pijn & Prestatie Scan</div>
  </td></tr>

  <tr><td style="background:${riskColor};padding:14px 28px;">
    <div style="font-size:13px;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:2px;">
      ⚡ ${result?.overall_risk?.toUpperCase() || 'GEMIDDELD'} RISICO — ${result?.primary_area || 'Zie hieronder'} — Pijn ${answers?.pain_intensity ?? '?'}/10
    </div>
  </td></tr>

  <tr><td style="background:#fff;padding:24px 28px 0;">
    <div style="font-size:10px;letter-spacing:2px;color:#aaa;text-transform:uppercase;margin-bottom:12px;">Cliënt</div>
    <div style="font-size:22px;font-weight:900;color:#111;margin-bottom:4px;">${name}</div>
    <a href="mailto:${email}" style="font-size:14px;color:#0066cc;text-decoration:none;">${email}</a>
  </td></tr>

  <tr><td style="background:#fff;padding:20px 28px 0;">
    <div style="height:1px;background:#eee;"></div>
    <div style="font-size:10px;letter-spacing:2px;color:#aaa;text-transform:uppercase;margin-top:20px;margin-bottom:12px;">Volledig Profiel</div>
  </td></tr>

  <tr><td style="background:#fff;padding:0 28px 20px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8e8e8;">${qaRows}</table>
  </td></tr>

  <tr><td style="background:#111;padding:14px 28px;">
    <div style="font-size:10px;letter-spacing:2px;color:#888;text-transform:uppercase;">Bewegingsanalyse</div>
  </td></tr>

  ${result?.coach_insight ? `
  <tr><td style="background:#fff;padding:20px 28px;border-left:4px solid ${riskColor};">
    <div style="font-size:10px;letter-spacing:2px;color:#aaa;text-transform:uppercase;margin-bottom:10px;">Expert Beoordeling</div>
    <div style="font-size:15px;color:#111;line-height:1.8;font-style:italic;">"${result.coach_insight}"</div>
  </td></tr>` : ''}

  ${coachLimitations ? `
  <tr><td style="background:#fff;padding:20px 28px 8px;">
    <div style="font-size:10px;letter-spacing:2px;color:#aaa;text-transform:uppercase;margin-bottom:12px;">Bewegingsbeperkingen</div>
    ${coachLimitations}
  </td></tr>` : ''}

  ${coachRiskFactors ? `
  <tr><td style="background:#fff;padding:8px 28px 20px;">
    <div style="font-size:10px;letter-spacing:2px;color:#aaa;text-transform:uppercase;margin-bottom:12px;">Risicofactoren</div>
    ${coachRiskFactors}
  </td></tr>` : ''}

  ${coachPlan ? `
  <tr><td style="background:#fff;padding:8px 28px 20px;">
    <div style="height:1px;background:#eee;margin-bottom:20px;"></div>
    <div style="font-size:10px;letter-spacing:2px;color:#aaa;text-transform:uppercase;margin-bottom:14px;">Voorgesteld 7-Daags Plan</div>
    ${coachPlan}
  </td></tr>` : ''}

  <tr><td style="padding:16px 0;">
    <div style="font-size:9px;letter-spacing:2px;color:#aaa;text-transform:uppercase;text-align:center;font-family:monospace;">9toFit Coach Dashboard</div>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  // Send client email
  console.log('Sending pain report to client:', email);
  const clientRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.RESEND_API_KEY}` },
    body: JSON.stringify({
      from: `9toFit Performance <${fromEmail}>`,
      to: [email],
      subject: `${tt('Jouw Bewegingsanalyse Rapport')} - ${result?.overall_risk || ''} ${tt('Risico')} - ${tt('7-Daags Plan')}`,
      html: clientHtml
    })
  });
  const clientData = await clientRes.json();
  console.log('Client email result:', JSON.stringify(clientData));
  if (!clientRes.ok) throw new Error(`Client email failed: ${clientData.message || JSON.stringify(clientData)}`);

  // Send coach email
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.RESEND_API_KEY}` },
    body: JSON.stringify({
      from: `9toFit Scanner <${fromEmail}>`,
      to: [coachEmail],
      subject: `🩹 ${tt('Pijn Scan')}: ${name} — ${result?.overall_risk || ''} ${tt('Risico')} · ${result?.primary_area || tt('Pijn')}`,
      html: coachHtml
    })
  });
}

// ════════════════════════════════════════
// FITNESS / FYSIO PATH EMAILS
// ════════════════════════════════════════
async function sendIntakeEmails({ name, email, fromEmail, coachEmail, scanPath, extraData, lang }) {
  const tt = (s) => tEmail(s, lang);
  const isFysio = scanPath === 'fysio';
  const accentColor = isFysio ? '#60a5fa' : '#4ade80';
  const typeLabel = isFysio ? 'Fysio Intake' : 'Fitness Intake';

  // ── Build profile rows ──
  const profileRows = [
    { q: 'Leeftijd', a: extraData?.age_range || '—' },
    { q: 'Trainingsachtergrond', a: extraData?.training_background || '—' },
    { q: 'Doelen', a: Array.isArray(extraData?.goals) ? extraData.goals.join(', ') : '—' },
    { q: 'Jaardoel', a: extraData?.year_goal_text || '—' },
    { q: 'Werksituatie', a: extraData?.work_situation || '—' },
    { q: 'Werkuren/week', a: extraData?.work_hours_per_week || '—' },
    { q: 'Kinderen', a: extraData?.has_children ? `Ja, ${extraData.children_count || '?'}` : extraData?.has_children === false ? 'Nee' : '—' },
    { q: 'Trainingsdagen/week', a: extraData?.training_days_available ? `${extraData.training_days_available} dagen` : '—' },
    { q: 'Start urgentie', a: extraData?.start_urgency || '—' },
  ];
  if (isFysio && extraData?.referral_source) {
    profileRows.push({ q: 'Doorverwijzer', a: extraData.referral_source });
  }
  const qaHtml = profileRows.map(row => `
    <tr>
      <td style="padding:10px 14px;border-bottom:1px solid #f0f0f0;width:40%;vertical-align:top;">
        <span style="font-size:11px;font-weight:700;color:#333;text-transform:uppercase;letter-spacing:0.5px;">${row.q}</span>
      </td>
      <td style="padding:10px 14px;border-bottom:1px solid #f0f0f0;vertical-align:top;">
        <span style="font-size:13px;color:#111;">${row.a}</span>
      </td>
    </tr>`).join('');

  // ── Client confirmation email ──
  const clientHtml = `<!DOCTYPE html>
<html lang="nl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#09090b;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#09090b;padding:40px 16px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

  <tr><td style="padding:0 0 32px 0;">
    <div style="font-size:11px;font-weight:700;letter-spacing:4px;color:#ffffff;text-transform:uppercase;">9TOFIT</div>
    <div style="font-size:8px;letter-spacing:3px;color:#71717a;text-transform:uppercase;margin-top:4px;">PERFORMANCE COACHING</div>
  </td></tr>

  <tr><td style="padding:0 0 24px 0;">
    <div style="width:48px;height:3px;background:${accentColor};border-radius:2px;"></div>
  </td></tr>

  <tr><td style="padding:0 0 12px 0;">
    <div style="font-size:10px;letter-spacing:3px;color:${accentColor};text-transform:uppercase;font-family:'Courier New',monospace;">${isFysio ? tt('Fysio Intake') : tt('Performance Scan')}</div>
  </td></tr>

  <tr><td style="padding:0 0 24px 0;">
    <div style="font-size:32px;font-weight:900;color:#ffffff;line-height:1.05;text-transform:uppercase;letter-spacing:1px;">
      ${name}, ${isFysio ? tt('je intake<br>is ontvangen.') : tt('welkom<br>bij 9toFit.')}
    </div>
  </td></tr>

  <tr><td style="padding:0 0 28px 0;">
    <div style="width:100%;height:1px;background:#27272a;"></div>
  </td></tr>

  <tr><td style="padding:0 0 32px 0;">
    <div style="font-size:15px;color:#a1a1aa;line-height:1.8;max-width:460px;">
      ${isFysio
        ? tt('Je profiel is doorgestuurd naar coach Max. Hij neemt zo snel mogelijk contact met je op om je persoonlijke trainingsschema te bespreken.')
        : tt('Je profiel is ontvangen! Coach Max bouwt een persoonlijk trainingsschema op maat. Je ontvangt binnen 24 uur bericht zodra je schema klaarstaat.')
      }
    </div>
  </td></tr>

  <tr><td style="padding:0 0 36px 0;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:16px 20px;background:#18181b;border:1px solid #27272a;border-radius:8px;">
        <div style="font-size:9px;letter-spacing:2px;color:#71717a;text-transform:uppercase;font-family:'Courier New',monospace;margin-bottom:16px;">${tt('Wat nu?')}</div>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:0 0 12px 0;">
            <span style="font-size:10px;font-weight:700;color:${accentColor};font-family:'Courier New',monospace;vertical-align:top;">01</span>
            <span style="font-size:13px;color:#e4e4e7;margin-left:12px;">${tt('Check je inbox — je ontvangt een aparte <strong style="color:#fff;">magic link</strong> om direct in te loggen')}</span>
          </td></tr>
          <tr><td style="padding:0 0 12px 0;">
            <span style="font-size:10px;font-weight:700;color:${accentColor};font-family:'Courier New',monospace;vertical-align:top;">02</span>
            <span style="font-size:13px;color:#e4e4e7;margin-left:12px;">${tt('Je coach bekijkt je profiel en stelt een schema op')}</span>
          </td></tr>
          <tr><td style="padding:0;">
            <span style="font-size:10px;font-weight:700;color:${accentColor};font-family:'Courier New',monospace;vertical-align:top;">03</span>
            <span style="font-size:13px;color:#e4e4e7;margin-left:12px;">${tt('Start met trainen zodra je schema klaarstaat in de app')}</span>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </td></tr>

  <tr><td style="padding:0 0 2px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #27272a;border-radius:8px;">
      <tr>
        <td width="50%" style="padding:20px;border-right:1px solid #27272a;vertical-align:top;">
          <div style="font-size:9px;letter-spacing:2px;color:#71717a;text-transform:uppercase;font-family:'Courier New',monospace;margin-bottom:8px;">Toegang</div>
          <div style="font-size:14px;color:#ffffff;font-weight:700;">${tt('Na pakketkeuze')}</div>
        </td>
        <td width="50%" style="padding:20px;vertical-align:top;">
          <div style="font-size:9px;letter-spacing:2px;color:#71717a;text-transform:uppercase;font-family:'Courier New',monospace;margin-bottom:8px;">${tt('Volgende stap')}</div>
          <div style="font-size:14px;color:#ffffff;font-weight:700;">${isFysio ? tt('Coach intake') : tt('Schema op maat')}</div>
        </td>
      </tr>
    </table>
  </td></tr>

  <tr><td style="padding:24px 0 0 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#18181b;border:1px solid rgba(249,115,22,0.2);border-radius:8px;">
      <tr><td style="padding:24px;">
        <div style="font-size:9px;letter-spacing:2px;color:#f97316;text-transform:uppercase;font-family:'Courier New',monospace;margin-bottom:8px;">${tt('Sneller starten?')}</div>
        <div style="font-size:18px;font-weight:900;color:#ffffff;margin-bottom:8px;line-height:1.1;">${tt('Plan een kennismakingsgesprek')}</div>
        <div style="font-size:13px;color:#a1a1aa;line-height:1.7;margin-bottom:16px;">${tt('30 minuten met Max — gratis en vrijblijvend.')}</div>
        <a href="https://calendly.com/max-9tofit/performance-strategy-call" style="display:inline-block;background:#f97316;color:#ffffff;text-decoration:none;font-size:12px;font-weight:700;letter-spacing:2px;padding:12px 24px;text-transform:uppercase;border-radius:8px;">${tt('PLAN GESPREK →')}</a>
      </td></tr>
    </table>
  </td></tr>

  <tr><td style="padding:32px 0 0 0;">
    <div style="font-size:9px;letter-spacing:2px;color:#3f3f46;text-transform:uppercase;font-family:'Courier New',monospace;text-align:center;">9toFit Performance Coaching · 9tofit.nl</div>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  // ── Coach intake brief ──
  const urgencyBanner = extraData?.start_urgency === 'direct'
    ? `<tr><td style="background:#f97316;padding:14px 28px;">
        <div style="font-size:13px;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:2px;">${tt('⚡ WIL DIRECT STARTEN')}</div>
       </td></tr>`
    : '';

  const coachHtml = `<!DOCTYPE html>
<html lang="${lang === 'en' ? 'en' : 'nl'}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f0f0;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
<tr><td align="center">
<table width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;">

  <tr><td style="background:#111;padding:20px 28px;border-bottom:4px solid ${accentColor};">
    <div style="font-size:18px;font-weight:900;letter-spacing:3px;color:#fff;text-transform:uppercase;">9toFit — ${tt(typeLabel)}</div>
    <div style="font-size:10px;letter-spacing:2px;color:#555;text-transform:uppercase;margin-top:4px;">${tt('Nieuw Scan Profiel')}</div>
  </td></tr>

  ${urgencyBanner}

  <tr><td style="background:#fff;padding:24px 28px 0;">
    <div style="font-size:10px;letter-spacing:2px;color:#aaa;text-transform:uppercase;margin-bottom:12px;">${tt('Cliënt')}</div>
    <div style="font-size:22px;font-weight:900;color:#111;margin-bottom:4px;">${name}</div>
    <a href="mailto:${email}" style="font-size:14px;color:#0066cc;text-decoration:none;">${email}</a>
    <div style="margin-top:8px;">
      <span style="display:inline-block;font-size:10px;font-weight:700;padding:4px 10px;border-radius:4px;background:${isFysio ? '#eff6ff' : '#f0fdf4'};color:${accentColor};text-transform:uppercase;letter-spacing:1px;">${tt(typeLabel)}</span>
    </div>
  </td></tr>

  <tr><td style="background:#fff;padding:20px 28px 0;">
    <div style="height:1px;background:#eee;"></div>
    <div style="font-size:10px;letter-spacing:2px;color:#aaa;text-transform:uppercase;margin-top:20px;margin-bottom:12px;">${lang === 'en' ? 'Full Profile' : 'Volledig Profiel'}</div>
  </td></tr>

  <tr><td style="background:#fff;padding:0 28px 20px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8e8e8;">${qaHtml}</table>
  </td></tr>

  <tr><td style="background:#fffbf0;padding:20px 28px;border:1px solid #ffe08a;">
    <div style="font-size:10px;letter-spacing:2px;color:#b8860b;text-transform:uppercase;margin-bottom:10px;">${lang === 'en' ? '📋 Action items' : '📋 Actiepunten'}</div>
    <div style="font-size:13px;color:#333;line-height:1.8;">
      ${isFysio
        ? (lang === 'en'
            ? `<strong>Physio referral</strong> — contact for intake call<br>
               • Referrer: <strong>${extraData?.referral_source || 'Not provided'}</strong><br>
               • Goals: <strong>${Array.isArray(extraData?.goals) ? extraData.goals.join(', ') : '—'}</strong><br>
               • Year goal: <strong>${extraData?.year_goal_text || 'Not provided'}</strong><br>
               • Available: <strong>${extraData?.training_days_available || '?'} days/week</strong>`
            : `<strong>Fysio doorverwijzing</strong> — neem contact op voor intake gesprek<br>
               • Doorverwijzer: <strong>${extraData?.referral_source || 'Niet opgegeven'}</strong><br>
               • Doel: <strong>${Array.isArray(extraData?.goals) ? extraData.goals.join(', ') : '—'}</strong><br>
               • Jaardoel: <strong>${extraData?.year_goal_text || 'Niet ingevuld'}</strong><br>
               • Beschikbaar: <strong>${extraData?.training_days_available || '?'} dagen/week</strong>`)
        : (lang === 'en'
            ? `<strong>Build program</strong> — client wants to start ${extraData?.start_urgency === 'direct' ? 'now' : 'soon'}<br>
               • Experience: <strong>${extraData?.training_background || '—'}</strong><br>
               • Goals: <strong>${Array.isArray(extraData?.goals) ? extraData.goals.join(', ') : '—'}</strong><br>
               • Year goal: <strong>${extraData?.year_goal_text || 'Not provided'}</strong><br>
               • Available: <strong>${extraData?.training_days_available || '?'} days/week, ${extraData?.work_hours_per_week || '?'} work hours</strong>`
            : `<strong>Schema opstellen</strong> — klant wil ${extraData?.start_urgency === 'direct' ? 'direct' : 'binnenkort'} beginnen<br>
               • Ervaring: <strong>${extraData?.training_background || '—'}</strong><br>
               • Doel: <strong>${Array.isArray(extraData?.goals) ? extraData.goals.join(', ') : '—'}</strong><br>
               • Jaardoel: <strong>${extraData?.year_goal_text || 'Niet ingevuld'}</strong><br>
               • Beschikbaar: <strong>${extraData?.training_days_available || '?'} dagen/week, ${extraData?.work_hours_per_week || '?'} werkuren</strong>`)
      }
    </div>
  </td></tr>

  <tr><td style="padding:16px 0;">
    <div style="font-size:9px;letter-spacing:2px;color:#aaa;text-transform:uppercase;text-align:center;font-family:monospace;">${lang === 'en' ? '9toFit Coach Dashboard · Generated from Performance Scan' : '9toFit Coach Dashboard · Gegenereerd uit Performance Scan'}</div>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  // Send client confirmation
  console.log('Sending intake confirmation to client:', email);
  const clientRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.RESEND_API_KEY}` },
    body: JSON.stringify({
      from: `9toFit Performance <${fromEmail}>`,
      to: [email],
      subject: isFysio
        ? (lang === 'en' ? 'Your intake has been received — your coach will be in touch' : 'Je intake is ontvangen — je coach neemt contact op')
        : (lang === 'en' ? 'Your Performance Scan has been received — program is being built' : 'Je Performance Scan is ontvangen — schema wordt gebouwd'),
      html: clientHtml
    })
  });
  const clientData = await clientRes.json();
  console.log('Client intake email result:', JSON.stringify(clientData));
  if (!clientRes.ok) throw new Error(`Client email failed: ${clientData.message || JSON.stringify(clientData)}`);

  // Send coach brief
  const emoji = isFysio ? '🤝' : '💪';
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.RESEND_API_KEY}` },
    body: JSON.stringify({
      from: `9toFit Scanner <${fromEmail}>`,
      to: [coachEmail],
      subject: `${emoji} ${tt(typeLabel)}: ${name} — ${extraData?.start_urgency === 'direct' ? tt('Wil Direct Starten') : tt('Schema Opstellen')}`,
      html: coachHtml
    })
  });
}
