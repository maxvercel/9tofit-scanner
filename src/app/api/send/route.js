export async function POST(request) {
  try {
    const { name, email, result, answers, type, scanPath, extraData } = await request.json();

    console.log('Send route called for:', email, 'type:', type || scanPath, 'risk:', result?.overall_risk);

    const fromEmail = 'noreply@9tofit.nl';
    const coachEmail = process.env.NEXT_PUBLIC_COACH_EMAIL || 'max@9tofit.nl';

    // ── Determine which flow we're in ──
    const isPainPath = scanPath === 'pain' || type === 'pain_performance';
    const isFysioPath = scanPath === 'fysio' || type === 'fysio_intake';
    const isFitnessPath = scanPath === 'fitness' || type === 'fitness_intake';

    // ── PAIN PATH: Full AI analysis emails ──
    if (isPainPath && result) {
      await sendPainEmails({ name, email, result, answers, fromEmail, coachEmail, extraData });
    }
    // ── FITNESS/FYSIO PATH: Intake confirmation + coach brief ──
    else if (isFitnessPath || isFysioPath) {
      await sendIntakeEmails({ name, email, fromEmail, coachEmail, scanPath: isFysioPath ? 'fysio' : 'fitness', extraData });
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
async function sendPainEmails({ name, email, result, answers, fromEmail, coachEmail, extraData }) {
  const riskColor = result?.overall_risk?.toLowerCase() === 'high' || result?.overall_risk?.toLowerCase() === 'hoog' ? '#ff4444'
    : result?.overall_risk?.toLowerCase() === 'low' || result?.overall_risk?.toLowerCase() === 'laag' ? '#44bb44'
    : '#ffaa00';

  const planHtml = Array.isArray(result?.seven_day_plan)
    ? result.seven_day_plan.map(day => `
      <tr><td style="padding:0 0 12px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#111318;border:1px solid #27272a;border-radius:6px;">
          <tr><td style="padding:12px 16px;border-bottom:1px solid #27272a;">
            <span style="font-size:10px;color:#71717a;font-family:'Courier New',monospace;letter-spacing:2px;">DAG ${day.day || ''}</span>
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
    <div style="font-size:10px;letter-spacing:3px;color:${riskColor};text-transform:uppercase;font-family:'Courier New',monospace;">Bewegingsanalyse Rapport</div>
  </td></tr>

  <tr><td style="padding:0 0 24px 0;">
    <div style="font-size:32px;font-weight:900;color:#ffffff;line-height:1.05;text-transform:uppercase;letter-spacing:1px;">${name}, jouw<br>analyse is klaar.</div>
  </td></tr>

  <tr><td style="padding:0 0 28px 0;">
    <div style="width:100%;height:1px;background:#27272a;"></div>
  </td></tr>

  <tr><td style="padding:0 0 24px 0;">
    <div style="font-size:15px;color:#a1a1aa;line-height:1.8;max-width:460px;">Bekijk hieronder jouw bewegingsbeperkingen, risicofactoren en het 7-daagse correctieplan.</div>
  </td></tr>

  <tr><td style="padding:0 0 2px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #27272a;border-radius:8px;">
      <tr>
        <td style="padding:16px 20px;border-right:1px solid #27272a;width:33%;vertical-align:top;">
          <div style="font-size:9px;letter-spacing:2px;color:#71717a;text-transform:uppercase;font-family:'Courier New',monospace;margin-bottom:6px;">Risiconiveau</div>
          <div style="font-size:20px;font-weight:900;color:${riskColor};text-transform:uppercase;">${result?.overall_risk || '—'}</div>
        </td>
        <td style="padding:16px 20px;border-right:1px solid #27272a;width:33%;vertical-align:top;">
          <div style="font-size:9px;letter-spacing:2px;color:#71717a;text-transform:uppercase;font-family:'Courier New',monospace;margin-bottom:6px;">Probleemgebied</div>
          <div style="font-size:14px;font-weight:700;color:#ffffff;">${result?.primary_area || '—'}</div>
        </td>
        <td style="padding:16px 20px;width:33%;vertical-align:top;">
          <div style="font-size:9px;letter-spacing:2px;color:#71717a;text-transform:uppercase;font-family:'Courier New',monospace;margin-bottom:6px;">Pijnscore</div>
          <div style="font-size:14px;font-weight:700;color:#ffffff;">${answers?.pain_intensity ?? '—'}/10</div>
        </td>
      </tr>
    </table>
  </td></tr>

  ${result?.coach_insight ? `
  <tr><td style="padding:16px 0 2px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#18181b;border-left:3px solid ${riskColor};border-radius:0 8px 8px 0;">
      <tr><td style="padding:20px 24px;">
        <div style="font-size:9px;letter-spacing:2px;color:${riskColor};text-transform:uppercase;font-family:'Courier New',monospace;margin-bottom:10px;">Expert Beoordeling</div>
        <div style="font-size:14px;color:#e4e4e7;line-height:1.8;font-style:italic;">"${result.coach_insight}"</div>
        <div style="font-size:9px;letter-spacing:2px;color:#71717a;text-transform:uppercase;font-family:'Courier New',monospace;margin-top:12px;">— Max, 9toFit Bewegingsspecialist</div>
      </td></tr>
    </table>
  </td></tr>` : ''}

  ${limitationsHtml ? `
  <tr><td style="padding:16px 0 2px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#18181b;border:1px solid #27272a;border-radius:8px;">
      <tr><td style="padding:20px 24px 10px;">
        <div style="font-size:9px;letter-spacing:2px;color:#71717a;text-transform:uppercase;font-family:'Courier New',monospace;margin-bottom:14px;">Bewegingsbeperkingen</div>
        ${limitationsHtml}
      </td></tr>
    </table>
  </td></tr>` : ''}

  ${riskFactorsHtml ? `
  <tr><td style="padding:16px 0 2px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#18181b;border:1px solid #27272a;border-radius:8px;">
      <tr><td style="padding:20px 24px;">
        <div style="font-size:9px;letter-spacing:2px;color:#71717a;text-transform:uppercase;font-family:'Courier New',monospace;margin-bottom:14px;">Risicofactoren</div>
        ${riskFactorsHtml}
      </td></tr>
    </table>
  </td></tr>` : ''}

  ${planHtml ? `
  <tr><td style="padding:16px 0 2px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#18181b;border:1px solid #27272a;border-radius:8px;">
      <tr><td style="padding:20px 24px 8px;">
        <div style="font-size:9px;letter-spacing:2px;color:#71717a;text-transform:uppercase;font-family:'Courier New',monospace;margin-bottom:14px;">Je 7-Daags Correctieplan</div>
        <table width="100%" cellpadding="0" cellspacing="0">${planHtml}</table>
      </td></tr>
    </table>
  </td></tr>` : ''}

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
    <div style="font-size:10px;letter-spacing:2px;color:#888;text-transform:uppercase;">AI Bewegingsanalyse</div>
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
      subject: `Jouw Bewegingsanalyse Rapport - ${result?.overall_risk || ''} Risico - 7-Daags Plan`,
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
      subject: `🩹 Pijn Scan: ${name} — ${result?.overall_risk || ''} Risico · ${result?.primary_area || 'Pijn'}`,
      html: coachHtml
    })
  });
}

// ════════════════════════════════════════
// FITNESS / FYSIO PATH EMAILS
// ════════════════════════════════════════
async function sendIntakeEmails({ name, email, fromEmail, coachEmail, scanPath, extraData }) {
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
    <div style="font-size:10px;letter-spacing:3px;color:${accentColor};text-transform:uppercase;font-family:'Courier New',monospace;">${isFysio ? 'Fysio Intake' : 'Performance Scan'}</div>
  </td></tr>

  <tr><td style="padding:0 0 24px 0;">
    <div style="font-size:32px;font-weight:900;color:#ffffff;line-height:1.05;text-transform:uppercase;letter-spacing:1px;">
      ${name}, ${isFysio ? 'je intake<br>is ontvangen.' : 'welkom<br>bij 9toFit.'}
    </div>
  </td></tr>

  <tr><td style="padding:0 0 28px 0;">
    <div style="width:100%;height:1px;background:#27272a;"></div>
  </td></tr>

  <tr><td style="padding:0 0 32px 0;">
    <div style="font-size:15px;color:#a1a1aa;line-height:1.8;max-width:460px;">
      ${isFysio
        ? 'Je profiel is doorgestuurd naar coach Max. Hij neemt zo snel mogelijk contact met je op om je persoonlijke trainingsschema te bespreken.'
        : 'Je profiel is ontvangen! Coach Max bouwt een persoonlijk trainingsschema op maat. Je ontvangt binnen 24 uur bericht zodra je schema klaarstaat.'
      }
    </div>
  </td></tr>

  <tr><td style="padding:0 0 36px 0;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:16px 20px;background:#18181b;border:1px solid #27272a;border-radius:8px;">
        <div style="font-size:9px;letter-spacing:2px;color:#71717a;text-transform:uppercase;font-family:'Courier New',monospace;margin-bottom:16px;">Wat nu?</div>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:0 0 12px 0;">
            <span style="font-size:10px;font-weight:700;color:${accentColor};font-family:'Courier New',monospace;vertical-align:top;">01</span>
            <span style="font-size:13px;color:#e4e4e7;margin-left:12px;">Check je inbox — je ontvangt een aparte <strong style="color:#fff;">magic link</strong> om direct in te loggen</span>
          </td></tr>
          <tr><td style="padding:0 0 12px 0;">
            <span style="font-size:10px;font-weight:700;color:${accentColor};font-family:'Courier New',monospace;vertical-align:top;">02</span>
            <span style="font-size:13px;color:#e4e4e7;margin-left:12px;">Je coach bekijkt je profiel en stelt een schema op</span>
          </td></tr>
          <tr><td style="padding:0;">
            <span style="font-size:10px;font-weight:700;color:${accentColor};font-family:'Courier New',monospace;vertical-align:top;">03</span>
            <span style="font-size:13px;color:#e4e4e7;margin-left:12px;">Start met trainen zodra je schema klaarstaat in de app</span>
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
          <div style="font-size:14px;color:#ffffff;font-weight:700;">14 dagen gratis</div>
        </td>
        <td width="50%" style="padding:20px;vertical-align:top;">
          <div style="font-size:9px;letter-spacing:2px;color:#71717a;text-transform:uppercase;font-family:'Courier New',monospace;margin-bottom:8px;">Volgende stap</div>
          <div style="font-size:14px;color:#ffffff;font-weight:700;">${isFysio ? 'Coach intake' : 'Schema op maat'}</div>
        </td>
      </tr>
    </table>
  </td></tr>

  <tr><td style="padding:24px 0 0 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#18181b;border:1px solid rgba(249,115,22,0.2);border-radius:8px;">
      <tr><td style="padding:24px;">
        <div style="font-size:9px;letter-spacing:2px;color:#f97316;text-transform:uppercase;font-family:'Courier New',monospace;margin-bottom:8px;">Sneller starten?</div>
        <div style="font-size:18px;font-weight:900;color:#ffffff;margin-bottom:8px;line-height:1.1;">Plan een kennismakingsgesprek</div>
        <div style="font-size:13px;color:#a1a1aa;line-height:1.7;margin-bottom:16px;">30 minuten met Max — gratis en vrijblijvend.</div>
        <a href="https://calendly.com/max-9tofit/performance-strategy-call" style="display:inline-block;background:#f97316;color:#ffffff;text-decoration:none;font-size:12px;font-weight:700;letter-spacing:2px;padding:12px 24px;text-transform:uppercase;border-radius:8px;">PLAN GESPREK →</a>
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
        <div style="font-size:13px;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:2px;">⚡ WIL DIRECT STARTEN</div>
       </td></tr>`
    : '';

  const coachHtml = `<!DOCTYPE html>
<html lang="nl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f0f0f0;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
<tr><td align="center">
<table width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;">

  <tr><td style="background:#111;padding:20px 28px;border-bottom:4px solid ${accentColor};">
    <div style="font-size:18px;font-weight:900;letter-spacing:3px;color:#fff;text-transform:uppercase;">9toFit — ${typeLabel}</div>
    <div style="font-size:10px;letter-spacing:2px;color:#555;text-transform:uppercase;margin-top:4px;">Nieuw Scan Profiel</div>
  </td></tr>

  ${urgencyBanner}

  <tr><td style="background:#fff;padding:24px 28px 0;">
    <div style="font-size:10px;letter-spacing:2px;color:#aaa;text-transform:uppercase;margin-bottom:12px;">Cliënt</div>
    <div style="font-size:22px;font-weight:900;color:#111;margin-bottom:4px;">${name}</div>
    <a href="mailto:${email}" style="font-size:14px;color:#0066cc;text-decoration:none;">${email}</a>
    <div style="margin-top:8px;">
      <span style="display:inline-block;font-size:10px;font-weight:700;padding:4px 10px;border-radius:4px;background:${isFysio ? '#eff6ff' : '#f0fdf4'};color:${accentColor};text-transform:uppercase;letter-spacing:1px;">${typeLabel}</span>
    </div>
  </td></tr>

  <tr><td style="background:#fff;padding:20px 28px 0;">
    <div style="height:1px;background:#eee;"></div>
    <div style="font-size:10px;letter-spacing:2px;color:#aaa;text-transform:uppercase;margin-top:20px;margin-bottom:12px;">Volledig Profiel</div>
  </td></tr>

  <tr><td style="background:#fff;padding:0 28px 20px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8e8e8;">${qaHtml}</table>
  </td></tr>

  <tr><td style="background:#fffbf0;padding:20px 28px;border:1px solid #ffe08a;">
    <div style="font-size:10px;letter-spacing:2px;color:#b8860b;text-transform:uppercase;margin-bottom:10px;">📋 Actiepunten</div>
    <div style="font-size:13px;color:#333;line-height:1.8;">
      ${isFysio
        ? `<strong>Fysio doorverwijzing</strong> — neem contact op voor intake gesprek<br>
           • Doorverwijzer: <strong>${extraData?.referral_source || 'Niet opgegeven'}</strong><br>
           • Doel: <strong>${Array.isArray(extraData?.goals) ? extraData.goals.join(', ') : '—'}</strong><br>
           • Jaardoel: <strong>${extraData?.year_goal_text || 'Niet ingevuld'}</strong><br>
           • Beschikbaar: <strong>${extraData?.training_days_available || '?'} dagen/week</strong>`
        : `<strong>Schema opstellen</strong> — klant wil ${extraData?.start_urgency === 'direct' ? 'direct' : 'binnenkort'} beginnen<br>
           • Ervaring: <strong>${extraData?.training_background || '—'}</strong><br>
           • Doel: <strong>${Array.isArray(extraData?.goals) ? extraData.goals.join(', ') : '—'}</strong><br>
           • Jaardoel: <strong>${extraData?.year_goal_text || 'Niet ingevuld'}</strong><br>
           • Beschikbaar: <strong>${extraData?.training_days_available || '?'} dagen/week, ${extraData?.work_hours_per_week || '?'} werkuren</strong>`
      }
    </div>
  </td></tr>

  <tr><td style="padding:16px 0;">
    <div style="font-size:9px;letter-spacing:2px;color:#aaa;text-transform:uppercase;text-align:center;font-family:monospace;">9toFit Coach Dashboard · Gegenereerd uit Performance Scan</div>
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
        ? 'Je intake is ontvangen — je coach neemt contact op'
        : 'Je Performance Scan is ontvangen — schema wordt gebouwd',
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
      subject: `${emoji} ${typeLabel}: ${name} — ${extraData?.start_urgency === 'direct' ? 'Wil Direct Starten' : 'Schema Opstellen'}`,
      html: coachHtml
    })
  });
}
