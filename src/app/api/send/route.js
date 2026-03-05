export async function POST(request) {
  try {
    const { name, email, result, answers } = await request.json();

    const riskColor = {
      low: '#1a6b3c',
      moderate: '#b8922a',
      high: '#c8392b'
    }[result.overall_risk?.toLowerCase()] || '#b8922a';

    const planRows = Array.isArray(result.seven_day_plan)
      ? result.seven_day_plan.map(day => `
        <tr>
          <td style="padding:14px 20px;border-bottom:1px solid #2a2a2a;vertical-align:top;width:80px;">
            <span style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:2px;color:#666666;text-transform:uppercase;">Day ${day.day}</span>
          </td>
          <td style="padding:14px 20px;border-bottom:1px solid #2a2a2a;vertical-align:top;">
            <strong style="font-size:13px;color:#ffffff;">${day.title || ''}</strong>
            ${day.focus ? `<span style="display:inline-block;margin-left:8px;font-family:'Courier New',monospace;font-size:9px;letter-spacing:1px;color:#aaaaaa;text-transform:uppercase;padding:2px 8px;border:1px solid rgba(200,57,43,0.3);">${day.focus}</span>` : ''}
            <ul style="margin:10px 0 0;padding:0;list-style:none;">
              ${(day.exercises || []).map(ex => `<li style="font-size:12px;color:#888888;margin-bottom:4px;padding-left:12px;border-left:2px solid #e8e4dd;">
                <strong style="color:#ffffff;">${ex.name}</strong>
                ${ex.sets ? ` — ${ex.sets}` : ''}${ex.duration ? ` · ${ex.duration}` : ''}${ex.reps ? ` · ${ex.reps}` : ''}
              </li>`).join('')}
            </ul>
          </td>
        </tr>`).join('')
      : '';

    const limitationsRows = Array.isArray(result.movement_limitations)
      ? result.movement_limitations.map(lim => `
        <tr>
          <td style="padding:14px 20px;border-bottom:1px solid #2a2a2a;vertical-align:top;">
            <span style="font-size:18px;">${lim.icon || '⚠️'}</span>
          </td>
          <td style="padding:14px 20px;border-bottom:1px solid #2a2a2a;vertical-align:top;">
            <strong style="font-size:13px;color:#ffffff;">${lim.name || ''}</strong><br>
            <span style="font-size:12px;color:#888888;line-height:1.6;">${lim.description || lim.desc || ''}</span>
          </td>
        </tr>`).join('')
      : '';

    const clientHtml = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#111111;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#111111;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- HEADER -->
  <tr><td style="background:#000000;padding:28px 36px;border-bottom:3px solid ${riskColor};">
    <p style="margin:0;font-size:20px;font-weight:800;letter-spacing:4px;color:#ffffff;text-transform:uppercase;">9TOFIT</p>
    <p style="margin:4px 0 0;font-family:'Courier New',monospace;font-size:9px;letter-spacing:3px;color:rgba(255,255,255,0.4);text-transform:uppercase;">Pain & Performance Report</p>
  </td></tr>

  <!-- INTRO -->
  <tr><td style="background:#1a1a1a;padding:32px 36px 24px;">
    <p style="margin:0;font-family:'Courier New',monospace;font-size:9px;letter-spacing:3px;color:#666666;text-transform:uppercase;margin-bottom:12px;">Your Assessment Results</p>
    <p style="margin:0;font-size:28px;color:#0c0c0e;font-weight:400;margin-bottom:16px;line-height:1.2;">Hey ${name},</p>
    <p style="margin:0;font-size:13px;color:#888888;line-height:1.8;">Here is your personalised Pain & Performance report based on your assessment. Review your movement limitations, risk factors and your 7-day corrective plan below.</p>
  </td></tr>

  <!-- RISK BANNER -->
  <tr><td style="padding:0 36px 24px;background:#1a1a1a;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #2a2a2a;">
      <tr>
        <td style="padding:16px 20px;border-right:1px solid #e8e4dd;">
          <p style="margin:0;font-family:'Courier New',monospace;font-size:9px;letter-spacing:2px;color:#666666;text-transform:uppercase;margin-bottom:6px;">Overall Risk</p>
          <p style="margin:0;font-size:20px;font-weight:800;letter-spacing:2px;color:${riskColor};text-transform:uppercase;">${result.overall_risk || 'Moderate'}</p>
        </td>
        <td style="padding:16px 20px;border-right:1px solid #e8e4dd;">
          <p style="margin:0;font-family:'Courier New',monospace;font-size:9px;letter-spacing:2px;color:#666666;text-transform:uppercase;margin-bottom:6px;">Primary Area</p>
          <p style="margin:0;font-size:14px;font-weight:700;color:#ffffff;">${result.primary_area || 'See below'}</p>
        </td>
        <td style="padding:16px 20px;">
          <p style="margin:0;font-family:'Courier New',monospace;font-size:9px;letter-spacing:2px;color:#666666;text-transform:uppercase;margin-bottom:6px;">Pain Intensity</p>
          <p style="margin:0;font-size:14px;font-weight:700;color:#ffffff;">${answers?.pain_intensity ?? '—'}/10</p>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- EXPERT INSIGHT -->
  ${result.coach_insight ? `
  <tr><td style="padding:0 36px 24px;background:#1a1a1a;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.03);">
      <tr><td style="padding:20px 24px;">
        <p style="margin:0 0 8px;font-family:'Courier New',monospace;font-size:9px;letter-spacing:2px;color:#aaaaaa;text-transform:uppercase;">Expert Assessment</p>
        <p style="margin:0;font-size:14px;color:#ffffff;line-height:1.8;font-style:italic;">"${result.coach_insight}"</p>
        <p style="margin:8px 0 0;font-family:'Courier New',monospace;font-size:9px;letter-spacing:1px;color:#666666;text-transform:uppercase;">— Max, 9toFit Movement Specialist</p>
      </td></tr>
    </table>
  </td></tr>` : ''}

  <!-- MOVEMENT LIMITATIONS -->
  ${limitationsRows ? `
  <tr><td style="padding:0 36px 8px;background:#1a1a1a;">
    <p style="margin:0 0 12px;font-family:'Courier New',monospace;font-size:9px;letter-spacing:2px;color:#666666;text-transform:uppercase;">Movement Limitations Identified</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #2a2a2a;">
      ${limitationsRows}
    </table>
  </td></tr>` : ''}

  <!-- 7-DAY PLAN -->
  ${planRows ? `
  <tr><td style="padding:24px 36px 8px;background:#1a1a1a;">
    <p style="margin:0 0 12px;font-family:'Courier New',monospace;font-size:9px;letter-spacing:2px;color:#666666;text-transform:uppercase;">Your 7-Day Corrective Plan</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #2a2a2a;">
      ${planRows}
    </table>
  </td></tr>` : ''}

  <!-- CTA -->
  <tr><td style="padding:24px 36px 36px;background:#1a1a1a;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#000000;padding:28px;">
      <tr><td>
        <p style="margin:0 0 8px;font-family:'Courier New',monospace;font-size:9px;letter-spacing:2px;color:rgba(255,255,255,0.4);text-transform:uppercase;">Recommended next step</p>
        <p style="margin:0 0 8px;font-size:20px;color:#ffffff;font-weight:400;">Want faster results?</p>
        <p style="margin:0 0 20px;font-size:13px;color:rgba(255,255,255,0.6);line-height:1.7;">Book a free 30-minute strategy call with Max to get a precise diagnosis and an accelerated recovery protocol tailored to your specific situation.</p>
        <a href="https://calendly.com/max-9tofit/performance-strategy-call" style="display:inline-block;background:#111111;color:#0c0c0e;text-decoration:none;font-size:11px;font-weight:700;letter-spacing:2px;padding:12px 24px;text-transform:uppercase;">Book Free Call →</a>
      </td></tr>
    </table>
  </td></tr>

  <!-- FOOTER -->
  <tr><td style="padding:20px 36px;">
    <p style="margin:0;font-family:'Courier New',monospace;font-size:9px;letter-spacing:2px;color:#666666;text-transform:uppercase;">9toFit Performance · 9tofit.nl</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

    const coachHtml = `<!DOCTYPE html>
<html>
<body style="margin:0;padding:40px;background:#f5f5f5;font-family:Arial,sans-serif;">
<div style="max-width:520px;background:#1a1a1a;padding:32px;border-left:4px solid ${riskColor};">
  <h2 style="margin:0 0 20px;font-size:17px;">New Pain & Performance Assessment</h2>
  <p style="margin:0 0 8px;font-size:14px;"><strong>Name:</strong> ${name}</p>
  <p style="margin:0 0 8px;font-size:14px;"><strong>Email:</strong> ${email}</p>
  <p style="margin:0 0 8px;font-size:14px;"><strong>Risk:</strong> <span style="color:${riskColor};font-weight:bold;">${result.overall_risk}</span></p>
  <p style="margin:0 0 8px;font-size:14px;"><strong>Primary area:</strong> ${result.primary_area || '—'}</p>
  <p style="margin:0 0 8px;font-size:14px;"><strong>Pain intensity:</strong> ${answers?.pain_intensity ?? '—'}/10</p>
  <p style="margin:0 0 8px;font-size:14px;"><strong>Duration:</strong> ${answers?.pain_duration || '—'}</p>
  <p style="margin:0 0 8px;font-size:14px;"><strong>Location(s):</strong> ${Array.isArray(answers?.pain_location) ? answers.pain_location.join(', ') : '—'}</p>
  <p style="margin:0 0 8px;font-size:14px;"><strong>Work:</strong> ${answers?.work_type || '—'}</p>
  <p style="margin:0 0 8px;font-size:14px;"><strong>Training:</strong> ${answers?.training_history || '—'}</p>
  <p style="margin:0 0 8px;font-size:14px;"><strong>Activity:</strong> ${answers?.activity_level ?? '—'} days/week</p>
  <p style="margin:0 0 8px;font-size:14px;"><strong>Prior treatment:</strong> ${Array.isArray(answers?.previous_treatment) ? answers.previous_treatment.join(', ') : '—'}</p>
  <hr style="border:none;border-top:1px solid #eee;margin:16px 0;">
  <p style="margin:0;font-size:13px;color:#444;font-style:italic;">"${result.coach_insight || ''}"</p>
  <hr style="border:none;border-top:1px solid #eee;margin:16px 0;">
  <p style="margin:0;font-size:12px;color:#27ae60;">✅ Added to Mailchimp list</p>
</div>
</body>
</html>`;

    const fromEmail = 'noreply@9tofit.nl';
    const coachEmail = process.env.NEXT_PUBLIC_COACH_EMAIL || 'max@9tofit.nl';

    // 1 — Email to client
    const clientRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.RESEND_API_KEY}` },
      body: JSON.stringify({
        from: `9toFit Performance <${fromEmail}>`,
        to: email,
        subject: `Your Pain & Performance Report — ${result.overall_risk} Risk · 7-Day Plan Inside`,
        html: clientHtml
      })
    });
    if (!clientRes.ok) {
      const e = await clientRes.json();
      console.error('Resend client email error:', JSON.stringify(e));
      throw new Error(`Resend: ${e.message} (name: ${e.name})`);
    }
    console.log('Client email sent successfully to:', email);

    // 2 — Notification to coach
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.RESEND_API_KEY}` },
      body: JSON.stringify({
        from: `9toFit Scanner <${fromEmail}>`,
        to: coachEmail,
        subject: `New Assessment: ${name} — ${result.overall_risk} Risk · ${result.primary_area || 'Pain'}`,
        html: coachHtml
      })
    });
    console.log('Coach notification sent to:', coachEmail);

    // 3 — Mailchimp
    const mcServer = process.env.MAILCHIMP_SERVER;
    const mcAudienceId = process.env.MAILCHIMP_AUDIENCE_ID;
    const mcApiKey = process.env.MAILCHIMP_API_KEY;
    if (mcApiKey && mcAudienceId && mcServer) {
      const parts = name.trim().split(' ');
      const mcRes = await fetch(`https://${mcServer}.api.mailchimp.com/3.0/lists/${mcAudienceId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Basic ${Buffer.from(`anystring:${mcApiKey}`).toString('base64')}` },
        body: JSON.stringify({
          email_address: email, status: 'subscribed',
          merge_fields: { FNAME: parts[0] || name, LNAME: parts.slice(1).join(' ') || '' },
          tags: ['pain-performance-scan']
        })
      });
      if (!mcRes.ok) { const e = await mcRes.json(); if (e.title !== 'Member Exists') console.error('Mailchimp:', e.detail); }
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Send error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
