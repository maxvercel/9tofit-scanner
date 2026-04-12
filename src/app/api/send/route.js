export async function POST(request) {
  try {
    const { name, email, result, answers } = await request.json();

    console.log('Send route called for:', email, 'risk:', result?.overall_risk);

    const fromEmail = 'noreply@9tofit.nl';
    const coachEmail = process.env.NEXT_PUBLIC_COACH_EMAIL || 'max@9tofit.nl';

    const riskColor = result?.overall_risk?.toLowerCase() === 'high' ? '#ff4444'
      : result?.overall_risk?.toLowerCase() === 'low' ? '#44bb44'
      : '#ffaa00';

    const planHtml = Array.isArray(result?.seven_day_plan)
      ? result.seven_day_plan.map(day => `
        <tr><td style="padding:0 0 12px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#1e1e1e;">
            <tr><td style="padding:12px 16px;border-bottom:1px solid #2a2a2a;">
              <span style="font-size:10px;color:#666;font-family:monospace;letter-spacing:2px;">DAY ${day.day || ''}</span>
              <strong style="font-size:13px;color:#fff;margin-left:10px;">${day.title || ''}</strong>
              ${day.focus ? `<span style="font-size:10px;color:#888;margin-left:8px;font-family:monospace;">${day.focus}</span>` : ''}
            </td></tr>
            <tr><td style="padding:12px 16px;">
              ${(day.exercises || []).map((ex, i) => `
                <div style="margin-bottom:10px;">
                  <div style="font-size:13px;font-weight:700;color:#fff;">${i + 1}. ${ex.name || ''}</div>
                  ${ex.sets || ex.duration || ex.reps ? `<div style="font-size:11px;color:#888;font-family:monospace;margin:2px 0;">${[ex.sets, ex.reps || ex.duration].filter(Boolean).join(' · ')}</div>` : ''}
                  ${ex.note ? `<div style="font-size:12px;color:#aaa;line-height:1.5;">${ex.note}</div>` : ''}
                </div>`).join('')}
            </td></tr>
          </table>
        </td></tr>`).join('')
      : '';

    const limitationsHtml = Array.isArray(result?.movement_limitations)
      ? result.movement_limitations.map(lim => `
        <div style="margin-bottom:10px;padding:14px 16px;background:#1e1e1e;border-left:3px solid ${riskColor};">
          <div style="font-size:13px;font-weight:700;color:#fff;margin-bottom:4px;">${lim.icon || ''} ${lim.name || ''}</div>
          ${lim.description ? `<div style="font-size:12px;color:#aaa;line-height:1.6;">${lim.description}</div>` : ''}
        </div>`).join('')
      : '';

    const riskFactorsHtml = Array.isArray(result?.risk_factors)
      ? result.risk_factors.map(r => `<div style="font-size:13px;color:#aaa;padding:6px 0;border-bottom:1px solid #2a2a2a;">• ${r}</div>`).join('')
      : '';

    const clientHtml = `<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#111;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#111;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <tr><td style="background:#000;padding:24px 28px;border-bottom:3px solid ${riskColor};">
    <div style="font-size:20px;font-weight:900;letter-spacing:3px;color:#fff;text-transform:uppercase;">9tofit</div>
    <div style="font-size:8px;letter-spacing:3px;color:#444;text-transform:uppercase;margin-top:2px;">PRESTATIECOACHING</div>
  </td></tr>

  <tr><td style="background:#1a1a1a;padding:28px 28px 20px;">
    <div style="font-size:10px;letter-spacing:3px;color:#555;text-transform:uppercase;margin-bottom:10px;font-family:monospace;">Bewegingsanalyse Rapport</div>
    <div style="font-size:28px;font-weight:900;color:#fff;margin-bottom:14px;line-height:1;text-transform:uppercase;">Hallo ${name},</div>
    <div style="font-size:14px;color:#888;line-height:1.7;">Jouw persoonlijke bewegingsanalyse is klaar. Bekijk jouw bewegingsbeperkingen, risicofactoren en het 7-daagse correctieplan hieronder.</div>
  </td></tr>

  <tr><td style="padding:2px 0;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="background:#1a1a1a;padding:16px 28px;border-right:1px solid #2a2a2a;width:33%;">
          <div style="font-size:9px;letter-spacing:2px;color:#444;text-transform:uppercase;font-family:monospace;margin-bottom:6px;">Risiconiveau</div>
          <div style="font-size:20px;font-weight:900;color:${riskColor};text-transform:uppercase;">${result?.overall_risk || '—'}</div>
        </td>
        <td style="background:#1a1a1a;padding:16px 28px;border-right:1px solid #2a2a2a;width:33%;">
          <div style="font-size:9px;letter-spacing:2px;color:#444;text-transform:uppercase;font-family:monospace;margin-bottom:6px;">Probleemgebied</div>
          <div style="font-size:14px;font-weight:700;color:#fff;">${result?.primary_area || '—'}</div>
        </td>
        <td style="background:#1a1a1a;padding:16px 28px;width:33%;">
          <div style="font-size:9px;letter-spacing:2px;color:#444;text-transform:uppercase;font-family:monospace;margin-bottom:6px;">Pijnscore</div>
          <div style="font-size:14px;font-weight:700;color:#fff;">${answers?.pain_intensity ?? '—'}/10</div>
        </td>
      </tr>
    </table>
  </td></tr>

  ${result?.coach_insight ? `
  <tr><td style="padding:2px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-left:3px solid ${riskColor};">
      <tr><td style="padding:20px 28px;">
        <div style="font-size:9px;letter-spacing:2px;color:${riskColor};text-transform:uppercase;font-family:monospace;margin-bottom:10px;">Expert Beoordeling</div>
        <div style="font-size:14px;color:#ddd;line-height:1.8;font-style:italic;">"${result.coach_insight}"</div>
        <div style="font-size:9px;letter-spacing:2px;color:#444;text-transform:uppercase;font-family:monospace;margin-top:12px;">— Max, 9toFit Bewegingsspecialist</div>
      </td></tr>
    </table>
  </td></tr>` : ''}

  ${limitationsHtml ? `
  <tr><td style="padding:2px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a;">
      <tr><td style="padding:20px 28px 10px;">
        <div style="font-size:9px;letter-spacing:2px;color:#444;text-transform:uppercase;font-family:monospace;margin-bottom:14px;">Bewegingsbeperkingen</div>
        ${limitationsHtml}
      </td></tr>
    </table>
  </td></tr>` : ''}

  ${riskFactorsHtml ? `
  <tr><td style="padding:2px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a;">
      <tr><td style="padding:20px 28px;">
        <div style="font-size:9px;letter-spacing:2px;color:#444;text-transform:uppercase;font-family:monospace;margin-bottom:14px;">Risicofactoren</div>
        ${riskFactorsHtml}
      </td></tr>
    </table>
  </td></tr>` : ''}

  ${planHtml ? `
  <tr><td style="padding:2px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a;">
      <tr><td style="padding:20px 28px 8px;">
        <div style="font-size:9px;letter-spacing:2px;color:#444;text-transform:uppercase;font-family:monospace;margin-bottom:14px;">Je 7-Daags Correctieplan</div>
        <table width="100%" cellpadding="0" cellspacing="0">${planHtml}</table>
      </td></tr>
    </table>
  </td></tr>` : ''}

  <tr><td style="padding:2px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff;">
      <tr><td style="padding:28px;">
        <div style="font-size:9px;letter-spacing:2px;color:#888;text-transform:uppercase;font-family:monospace;margin-bottom:8px;">Volgende Stap</div>
        <div style="font-size:22px;font-weight:900;color:#111;text-transform:uppercase;margin-bottom:10px;line-height:1.1;">Boek Je Gratis Strategiegesprek</div>
        <div style="font-size:13px;color:#555;line-height:1.7;margin-bottom:20px;">Een 30-minuten sessie met Max geeft je een precieze diagnose en een geacceleerd herstelprotocol speciaal voor jouw situatie.</div>
        <a href="https://calendly.com/max-9tofit/performance-strategy-call" style="display:inline-block;background:#111;color:#fff;text-decoration:none;font-size:12px;font-weight:700;letter-spacing:2px;padding:14px 28px;text-transform:uppercase;">GRATIS AFSPRAAK MAKEN →</a>
      </td></tr>
    </table>
  </td></tr>

  <tr><td style="padding:24px 0 8px;">
    <div style="font-size:9px;letter-spacing:2px;color:#333;text-transform:uppercase;font-family:monospace;text-align:center;">9toFit Performance Coaching · 9tofit.nl</div>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

    // Build full Q&A table
    const qaRows = [
      { q: 'Pijnlocatie(s)', a: Array.isArray(answers?.pain_location) ? answers.pain_location.join(', ') : '—' },
      { q: 'Wanneer doet het pijn', a: answers?.pain_timing || '—' },
      { q: 'Bewegingstriggers', a: Array.isArray(answers?.movement_triggers) ? answers.movement_triggers.join(', ') : '—' },
      { q: 'Duur', a: answers?.pain_duration || '—' },
      { q: 'Pijnintensiteit', a: `${answers?.pain_intensity ?? '—'}/10` },
      { q: 'Werksituatie', a: answers?.work_type || '—' },
      { q: 'Trainingsachtergrond', a: answers?.training_history || '—' },
      { q: 'Activiteitsniveau', a: `${answers?.activity_level ?? '—'} dagen/week` },
      { q: 'Eerdere behandeling', a: Array.isArray(answers?.previous_treatment) ? answers.previous_treatment.join(', ') : '—' },
    ].map(row => `
      <tr>
        <td style="padding:10px 14px;border-bottom:1px solid #f0f0f0;width:40%;vertical-align:top;">
          <span style="font-size:11px;font-weight:700;color:#333;text-transform:uppercase;letter-spacing:0.5px;">${row.q}</span>
        </td>
        <td style="padding:10px 14px;border-bottom:1px solid #f0f0f0;vertical-align:top;">
          <span style="font-size:13px;color:#111;">${row.a}</span>
        </td>
      </tr>`).join('');

    // Build limitations for coach
    const coachLimitations = Array.isArray(result?.movement_limitations)
      ? result.movement_limitations.map(lim => `
        <div style="margin-bottom:12px;padding:14px;background:#fafafa;border-left:3px solid ${riskColor};">
          <div style="font-size:13px;font-weight:700;color:#111;margin-bottom:4px;">${lim.icon || ''} ${lim.name || ''}</div>
          <div style="font-size:12px;color:#555;line-height:1.6;">${lim.description || lim.desc || ''}</div>
        </div>`).join('')
      : '';

    // Build risk factors for coach
    const coachRiskFactors = Array.isArray(result?.risk_factors)
      ? result.risk_factors.map(r => `<div style="font-size:13px;color:#333;padding:6px 0;border-bottom:1px solid #f0f0f0;">• ${r}</div>`).join('')
      : '';

    // Build 7-day plan for coach
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

  <!-- HEADER -->
  <tr><td style="background:#111;padding:20px 28px;border-bottom:4px solid ${riskColor};">
    <div style="font-size:18px;font-weight:900;letter-spacing:3px;color:#fff;text-transform:uppercase;">9toFit — Coach Intake Brief</div>
    <div style="font-size:10px;letter-spacing:2px;color:#555;text-transform:uppercase;margin-top:4px;">Nieuwe Bewegingsanalyse Formuliering</div>
  </td></tr>

  <!-- ALERT BANNER -->
  <tr><td style="background:${riskColor};padding:14px 28px;">
    <div style="font-size:13px;font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:2px;">
      ⚡ ${result?.overall_risk?.toUpperCase() || 'GEMIDDELD'} RISICO — ${result?.primary_area || 'Zie hieronder'} — Pijn ${answers?.pain_intensity ?? '?'}/10
    </div>
  </td></tr>

  <!-- CLIENT INFO -->
  <tr><td style="background:#fff;padding:24px 28px 0;">
    <div style="font-size:10px;letter-spacing:2px;color:#aaa;text-transform:uppercase;margin-bottom:12px;">Cliënt</div>
    <div style="font-size:22px;font-weight:900;color:#111;margin-bottom:4px;">${name}</div>
    <a href="mailto:${email}" style="font-size:14px;color:#0066cc;text-decoration:none;">${email}</a>
    <div style="margin-top:16px;">
      <a href="https://calendly.com/max-9tofit/performance-strategy-call" style="display:inline-block;background:#111;color:#fff;text-decoration:none;font-size:11px;font-weight:700;letter-spacing:2px;padding:10px 20px;text-transform:uppercase;margin-right:8px;">Maak afspraak met ${name} →</a>
    </div>
  </td></tr>

  <!-- DIVIDER -->
  <tr><td style="background:#fff;padding:20px 28px 0;">
    <div style="height:1px;background:#eee;"></div>
    <div style="font-size:10px;letter-spacing:2px;color:#aaa;text-transform:uppercase;margin-top:20px;margin-bottom:12px;">Volledige Vragenlijst Antwoorden</div>
  </td></tr>

  <!-- Q&A TABLE -->
  <tr><td style="background:#fff;padding:0 28px 20px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8e8e8;">
      ${qaRows}
    </table>
  </td></tr>

  <!-- AI ANALYSIS HEADER -->
  <tr><td style="background:#111;padding:14px 28px;">
    <div style="font-size:10px;letter-spacing:2px;color:#888;text-transform:uppercase;">AI Bewegingsanalyse</div>
  </td></tr>

  <!-- EXPERT INSIGHT -->
  ${result?.coach_insight ? `
  <tr><td style="background:#fff;padding:20px 28px;border-left:4px solid ${riskColor};">
    <div style="font-size:10px;letter-spacing:2px;color:#aaa;text-transform:uppercase;margin-bottom:10px;">Expert Beoordeling</div>
    <div style="font-size:15px;color:#111;line-height:1.8;font-style:italic;">"${result.coach_insight}"</div>
  </td></tr>` : ''}

  <!-- MOVEMENT LIMITATIONS -->
  ${coachLimitations ? `
  <tr><td style="background:#fff;padding:20px 28px 8px;">
    <div style="font-size:10px;letter-spacing:2px;color:#aaa;text-transform:uppercase;margin-bottom:12px;">Bewegingsbeperkingen</div>
    ${coachLimitations}
  </td></tr>` : ''}

  <!-- RISK FACTORS -->
  ${coachRiskFactors ? `
  <tr><td style="background:#fff;padding:8px 28px 20px;">
    <div style="font-size:10px;letter-spacing:2px;color:#aaa;text-transform:uppercase;margin-bottom:12px;">Risicofactoren</div>
    ${coachRiskFactors}
  </td></tr>` : ''}

  <!-- 7-DAY PLAN -->
  ${coachPlan ? `
  <tr><td style="background:#fff;padding:8px 28px 20px;">
    <div style="height:1px;background:#eee;margin-bottom:20px;"></div>
    <div style="font-size:10px;letter-spacing:2px;color:#aaa;text-transform:uppercase;margin-bottom:14px;">Voorgesteld 7-Daags Plan</div>
    ${coachPlan}
  </td></tr>` : ''}

  <!-- CALL PREP NOTES -->
  <tr><td style="background:#fffbf0;padding:20px 28px;border:1px solid #ffe08a;">
    <div style="font-size:10px;letter-spacing:2px;color:#b8860b;text-transform:uppercase;margin-bottom:10px;">📋 Notities voor Voorbereiding Gesprek</div>
    <div style="font-size:13px;color:#333;line-height:1.8;">
      <strong>Belangrijk voor het strategiegesprek:</strong><br>
      • Pijngebied: <strong>${Array.isArray(answers?.pain_location) ? answers.pain_location.join(' + ') : '—'}</strong> — duur <strong>${answers?.pain_duration || '—'}</strong><br>
      • Intensiteit <strong>${answers?.pain_intensity ?? '—'}/10</strong> — geactiveerd door <strong>${Array.isArray(answers?.movement_triggers) ? answers.movement_triggers.slice(0,2).join(', ') : '—'}</strong><br>
      • Werksituatie: <strong>${answers?.work_type || '—'}</strong> — training: <strong>${answers?.training_history || '—'}</strong><br>
      • Eerdere behandeling: <strong>${Array.isArray(answers?.previous_treatment) ? answers.previous_treatment.join(', ') : 'Geen'}</strong><br>
      • Risiconiveau: <strong style="color:${riskColor};">${result?.overall_risk || '—'}</strong> — primaire beperking: <strong>${result?.primary_area || '—'}</strong>
    </div>
  </td></tr>

  <!-- FOOTER -->
  <tr><td style="padding:16px 0;">
    <div style="font-size:9px;letter-spacing:2px;color:#aaa;text-transform:uppercase;text-align:center;font-family:monospace;">9toFit Coach Dashboard · Gegenereerd uit Bewegingsanalyse Scan</div>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

    // Send client email
    console.log('Sending to client:', email);
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
        subject: `Nieuwe Scan: ${name} — ${result?.overall_risk || ''} Risico · ${result?.primary_area || 'Pijn'}`,
        html: coachHtml
      })
    });

    // Mailchimp
    const { MAILCHIMP_API_KEY, MAILCHIMP_SERVER, MAILCHIMP_AUDIENCE_ID } = process.env;
    if (MAILCHIMP_API_KEY && MAILCHIMP_SERVER && MAILCHIMP_AUDIENCE_ID) {
      const parts = name.trim().split(' ');
      const mcRes = await fetch(`https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_AUDIENCE_ID}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString('base64')}`
        },
        body: JSON.stringify({
          email_address: email, status: 'subscribed',
          merge_fields: { FNAME: parts[0] || name, LNAME: parts.slice(1).join(' ') || '' },
          tags: ['pain-performance-scan']
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
