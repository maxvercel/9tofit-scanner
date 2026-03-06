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
<html lang="en">
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
    <div style="font-size:8px;letter-spacing:3px;color:#444;text-transform:uppercase;margin-top:2px;">PERFORMANCE COACHING</div>
  </td></tr>

  <tr><td style="background:#1a1a1a;padding:28px 28px 20px;">
    <div style="font-size:10px;letter-spacing:3px;color:#555;text-transform:uppercase;margin-bottom:10px;font-family:monospace;">Pain & Performance Report</div>
    <div style="font-size:28px;font-weight:900;color:#fff;margin-bottom:14px;line-height:1;text-transform:uppercase;">Hey ${name},</div>
    <div style="font-size:14px;color:#888;line-height:1.7;">Your personalised movement analysis is ready. Review your limitations, risk factors and 7-day corrective plan below.</div>
  </td></tr>

  <tr><td style="padding:2px 0;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="background:#1a1a1a;padding:16px 28px;border-right:1px solid #2a2a2a;width:33%;">
          <div style="font-size:9px;letter-spacing:2px;color:#444;text-transform:uppercase;font-family:monospace;margin-bottom:6px;">Risk Level</div>
          <div style="font-size:20px;font-weight:900;color:${riskColor};text-transform:uppercase;">${result?.overall_risk || '—'}</div>
        </td>
        <td style="background:#1a1a1a;padding:16px 28px;border-right:1px solid #2a2a2a;width:33%;">
          <div style="font-size:9px;letter-spacing:2px;color:#444;text-transform:uppercase;font-family:monospace;margin-bottom:6px;">Primary Area</div>
          <div style="font-size:14px;font-weight:700;color:#fff;">${result?.primary_area || '—'}</div>
        </td>
        <td style="background:#1a1a1a;padding:16px 28px;width:33%;">
          <div style="font-size:9px;letter-spacing:2px;color:#444;text-transform:uppercase;font-family:monospace;margin-bottom:6px;">Pain Score</div>
          <div style="font-size:14px;font-weight:700;color:#fff;">${answers?.pain_intensity ?? '—'}/10</div>
        </td>
      </tr>
    </table>
  </td></tr>

  ${result?.coach_insight ? `
  <tr><td style="padding:2px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-left:3px solid ${riskColor};">
      <tr><td style="padding:20px 28px;">
        <div style="font-size:9px;letter-spacing:2px;color:${riskColor};text-transform:uppercase;font-family:monospace;margin-bottom:10px;">Expert Assessment</div>
        <div style="font-size:14px;color:#ddd;line-height:1.8;font-style:italic;">"${result.coach_insight}"</div>
        <div style="font-size:9px;letter-spacing:2px;color:#444;text-transform:uppercase;font-family:monospace;margin-top:12px;">— Max, 9toFit Movement Specialist</div>
      </td></tr>
    </table>
  </td></tr>` : ''}

  ${limitationsHtml ? `
  <tr><td style="padding:2px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a;">
      <tr><td style="padding:20px 28px 10px;">
        <div style="font-size:9px;letter-spacing:2px;color:#444;text-transform:uppercase;font-family:monospace;margin-bottom:14px;">Movement Limitations Identified</div>
        ${limitationsHtml}
      </td></tr>
    </table>
  </td></tr>` : ''}

  ${riskFactorsHtml ? `
  <tr><td style="padding:2px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a;">
      <tr><td style="padding:20px 28px;">
        <div style="font-size:9px;letter-spacing:2px;color:#444;text-transform:uppercase;font-family:monospace;margin-bottom:14px;">Risk Factors</div>
        ${riskFactorsHtml}
      </td></tr>
    </table>
  </td></tr>` : ''}

  ${planHtml ? `
  <tr><td style="padding:2px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a;">
      <tr><td style="padding:20px 28px 8px;">
        <div style="font-size:9px;letter-spacing:2px;color:#444;text-transform:uppercase;font-family:monospace;margin-bottom:14px;">Your 7-Day Corrective Plan</div>
        <table width="100%" cellpadding="0" cellspacing="0">${planHtml}</table>
      </td></tr>
    </table>
  </td></tr>` : ''}

  <tr><td style="padding:2px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff;">
      <tr><td style="padding:28px;">
        <div style="font-size:9px;letter-spacing:2px;color:#888;text-transform:uppercase;font-family:monospace;margin-bottom:8px;">Recommended next step</div>
        <div style="font-size:22px;font-weight:900;color:#111;text-transform:uppercase;margin-bottom:10px;line-height:1.1;">Book a Free Strategy Call</div>
        <div style="font-size:13px;color:#555;line-height:1.7;margin-bottom:20px;">A 30-minute session with Max will give you a precise diagnosis and an accelerated recovery protocol tailored to your specific situation.</div>
        <a href="https://calendly.com/max-9tofit/performance-strategy-call" style="display:inline-block;background:#111;color:#fff;text-decoration:none;font-size:12px;font-weight:700;letter-spacing:2px;padding:14px 28px;text-transform:uppercase;">BOOK FREE CALL →</a>
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

    const coachHtml = `<!DOCTYPE html>
<html>
<body style="margin:0;padding:32px;background:#f5f5f5;font-family:Arial,sans-serif;">
<div style="max-width:520px;background:#fff;padding:28px;border-left:4px solid ${riskColor};">
  <h2 style="margin:0 0 16px;font-size:16px;">New Pain & Performance Scan</h2>
  <p style="margin:0 0 6px;font-size:13px;"><strong>Name:</strong> ${name}</p>
  <p style="margin:0 0 6px;font-size:13px;"><strong>Email:</strong> ${email}</p>
  <p style="margin:0 0 6px;font-size:13px;"><strong>Risk:</strong> <span style="color:${riskColor};font-weight:bold;">${result?.overall_risk || '—'}</span></p>
  <p style="margin:0 0 6px;font-size:13px;"><strong>Primary area:</strong> ${result?.primary_area || '—'}</p>
  <p style="margin:0 0 6px;font-size:13px;"><strong>Pain intensity:</strong> ${answers?.pain_intensity ?? '—'}/10</p>
  <p style="margin:0 0 6px;font-size:13px;"><strong>Duration:</strong> ${answers?.pain_duration || '—'}</p>
  <p style="margin:0 0 6px;font-size:13px;"><strong>Location(s):</strong> ${Array.isArray(answers?.pain_location) ? answers.pain_location.join(', ') : '—'}</p>
  <p style="margin:0 0 6px;font-size:13px;"><strong>Work:</strong> ${answers?.work_type || '—'}</p>
  <p style="margin:0 0 6px;font-size:13px;"><strong>Training:</strong> ${answers?.training_history || '—'}</p>
  <p style="margin:0 0 6px;font-size:13px;"><strong>Activity:</strong> ${answers?.activity_level ?? '—'} days/week</p>
  <p style="margin:0 0 16px;font-size:13px;"><strong>Prior treatment:</strong> ${Array.isArray(answers?.previous_treatment) ? answers.previous_treatment.join(', ') : '—'}</p>
  <hr style="border:none;border-top:1px solid #eee;margin:0 0 16px;">
  <p style="margin:0;font-size:12px;color:#555;font-style:italic;">"${result?.coach_insight || ''}"</p>
</div>
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
        subject: `Your Pain and Performance Report - ${result?.overall_risk || ''} Risk - 7-Day Plan Inside`,
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
        subject: `New Scan: ${name} — ${result?.overall_risk || ''} Risk · ${result?.primary_area || 'Pain'}`,
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
      if (!mcRes.ok && mcData.title !== 'Member Exists') console.error('Mailchimp:', mcData.detail);
    }

    return Response.json({ success: true });

  } catch (error) {
    console.error('Send error:', error.message);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
