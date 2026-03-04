export async function POST(request) {
  try {
    const { name, email, result, values } = await request.json();

    const statusColor = {
      green: '#00e87a',
      orange: '#ff7b00',
      red: '#ff2d55'
    }[result.readiness_status?.toLowerCase()] || '#00e87a';

    const clientEmail = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr><td style="background:#111113;border-bottom:1px solid #2a2a30;padding:28px 36px;">
          <p style="margin:0;font-size:24px;font-weight:900;letter-spacing:4px;color:#e8e8e8;text-transform:uppercase;">9TOFIT</p>
          <p style="margin:4px 0 0;font-size:10px;letter-spacing:3px;color:#666672;text-transform:uppercase;">Performance Intelligence™</p>
        </td></tr>
        <tr><td style="background:#111113;padding:28px 36px 0;">
          <p style="margin:0;font-size:13px;color:#666672;letter-spacing:2px;text-transform:uppercase;">Daily Readiness Report</p>
          <p style="margin:8px 0 0;font-size:32px;font-weight:900;letter-spacing:4px;color:#e8e8e8;text-transform:uppercase;">Hey ${name},</p>
          <p style="margin:12px 0 0;font-size:13px;color:#888;line-height:1.7;font-weight:300;">Here are your personalized readiness results based on today's check-in.</p>
        </td></tr>
        <tr><td style="background:#111113;padding:24px 36px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #2a2a30;">
            <tr>
              <td style="padding:20px 24px;border-right:1px solid #2a2a30;">
                <p style="margin:0;font-size:10px;letter-spacing:2px;color:#666672;text-transform:uppercase;">Status</p>
                <p style="margin:6px 0 0;font-size:28px;font-weight:900;color:${statusColor};text-transform:uppercase;">${result.readiness_status}</p>
              </td>
              <td style="padding:20px 24px;text-align:center;">
                <p style="margin:0;font-size:10px;letter-spacing:2px;color:#666672;text-transform:uppercase;">Readiness Score</p>
                <p style="margin:6px 0 0;font-size:48px;font-weight:900;color:${statusColor};line-height:1;">${result.readiness_score}</p>
              </td>
              <td style="padding:20px 24px;border-left:1px solid #2a2a30;text-align:right;">
                <p style="margin:0;font-size:10px;letter-spacing:2px;color:#666672;text-transform:uppercase;">Input</p>
                <p style="margin:4px 0 0;font-size:11px;color:#888;">Sleep: ${values.sleep}h</p>
                <p style="margin:2px 0 0;font-size:11px;color:#888;">Energy: ${values.energy}/10</p>
                <p style="margin:2px 0 0;font-size:11px;color:#888;">Stress: ${values.stress}/10</p>
                <p style="margin:2px 0 0;font-size:11px;color:#888;">Pain: ${values.pain}/10</p>
              </td>
            </tr>
          </table>
        </td></tr>
        <tr><td style="background:#111113;padding:0 36px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #2a2a30;border-top:none;">
            <tr>
              <td width="50%" style="padding:20px 24px;border-right:1px solid #2a2a30;border-bottom:1px solid #2a2a30;vertical-align:top;">
                <p style="margin:0;font-size:10px;letter-spacing:2px;color:#666672;text-transform:uppercase;">Training Adjustment</p>
                <p style="margin:8px 0 0;font-size:13px;color:#e8e8e8;line-height:1.6;font-weight:300;">${result.training_adjustment}</p>
              </td>
              <td width="50%" style="padding:20px 24px;border-bottom:1px solid #2a2a30;vertical-align:top;">
                <p style="margin:0;font-size:10px;letter-spacing:2px;color:#666672;text-transform:uppercase;">Recovery Focus</p>
                <p style="margin:8px 0 0;font-size:13px;color:#e8e8e8;line-height:1.6;font-weight:300;">${result.recovery_focus}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 24px;border-right:1px solid #2a2a30;border-bottom:1px solid #2a2a30;vertical-align:top;">
                <p style="margin:0;font-size:10px;letter-spacing:2px;color:#666672;text-transform:uppercase;">Hydration Target</p>
                <p style="margin:8px 0 0;font-size:24px;font-weight:900;color:#3b9eff;">${result.hydration_target_liters}</p>
              </td>
              <td style="padding:20px 24px;border-bottom:1px solid #2a2a30;vertical-align:top;">
                <p style="margin:0;font-size:10px;letter-spacing:2px;color:#666672;text-transform:uppercase;">Nervous System Protocol</p>
                <p style="margin:8px 0 0;font-size:13px;color:#e8e8e8;line-height:1.6;font-weight:300;">${result.nervous_system_protocol}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 24px;border-right:1px solid #2a2a30;vertical-align:top;">
                <p style="margin:0;font-size:10px;letter-spacing:2px;color:#666672;text-transform:uppercase;">Mobility Focus</p>
                <p style="margin:8px 0 0;font-size:13px;color:#e8e8e8;line-height:1.6;font-weight:300;">${result.mobility_focus}</p>
              </td>
              <td style="padding:20px 24px;vertical-align:top;">
                <p style="margin:0;font-size:10px;letter-spacing:2px;color:#666672;text-transform:uppercase;">Performance Risk</p>
                <p style="margin:8px 0 0;display:inline-block;font-size:10px;letter-spacing:2px;padding:4px 10px;border:1px solid ${statusColor};color:${statusColor};text-transform:uppercase;">${result.performance_risk_level}</p>
              </td>
            </tr>
          </table>
        </td></tr>
        <tr><td style="background:rgba(0,232,122,0.04);border:1px solid #2a2a30;border-top:none;padding:24px 36px;">
          <p style="margin:0;font-size:13px;color:#e8e8e8;line-height:1.7;font-style:italic;font-weight:300;">"${result.coach_message}"</p>
          <p style="margin:8px 0 0;font-size:10px;letter-spacing:2px;color:#666672;text-transform:uppercase;">— 9toFit Performance Coach</p>
        </td></tr>
        <tr><td style="padding:28px 36px;">
          <p style="margin:0;font-size:10px;letter-spacing:2px;color:#444;text-transform:uppercase;">9toFit Performance Intelligence™ · 9tofit.nl</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const coachEmail = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:40px;background:#f5f5f5;font-family:Arial,sans-serif;">
  <div style="max-width:500px;background:white;padding:32px;border-left:4px solid ${statusColor};">
    <h2 style="margin:0 0 16px;font-size:18px;">New 9toFit Check-in</h2>
    <p style="margin:0 0 8px;font-size:14px;"><strong>Name:</strong> ${name}</p>
    <p style="margin:0 0 8px;font-size:14px;"><strong>Email:</strong> ${email}</p>
    <p style="margin:0 0 8px;font-size:14px;"><strong>Status:</strong> <span style="color:${statusColor};font-weight:bold;">${result.readiness_status}</span></p>
    <p style="margin:0 0 8px;font-size:14px;"><strong>Score:</strong> ${result.readiness_score}/100</p>
    <p style="margin:0 0 8px;font-size:14px;"><strong>Risk:</strong> ${result.performance_risk_level}</p>
    <hr style="border:none;border-top:1px solid #eee;margin:16px 0;">
    <p style="margin:0 0 4px;font-size:13px;color:#666;"><strong>Sleep:</strong> ${values.sleep}h | <strong>Energy:</strong> ${values.energy}/10 | <strong>Stress:</strong> ${values.stress}/10 | <strong>Pain:</strong> ${values.pain}/10</p>
    <p style="margin:12px 0 0;font-size:13px;color:#444;font-style:italic;">"${result.coach_message}"</p>
    <hr style="border:none;border-top:1px solid #eee;margin:16px 0;">
    <p style="margin:0;font-size:12px;color:#27ae60;">✅ Added to Mailchimp list</p>
  </div>
</body>
</html>`;

    const fromEmail = 'noreply@9tofit.nl';
    const coachEmailAddress = process.env.NEXT_PUBLIC_COACH_EMAIL || 'max@9tofit.nl';

    // 1 — Email to client
    const clientRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: `9toFit Performance <${fromEmail}>`,
        to: email,
        subject: `Your 9toFit Readiness Report — ${result.readiness_status} (${result.readiness_score}/100)`,
        html: clientEmail
      })
    });

    if (!clientRes.ok) {
      const err = await clientRes.json();
      throw new Error(`Resend error: ${err.message}`);
    }

    // 2 — Notification to coach
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: `9toFit Scanner <${fromEmail}>`,
        to: coachEmailAddress,
        subject: `New Check-in: ${name} — ${result.readiness_status} (${result.readiness_score}/100)`,
        html: coachEmail
      })
    });

    // 3 — Add to Mailchimp
    const mcServer = process.env.MAILCHIMP_SERVER;
    const mcAudienceId = process.env.MAILCHIMP_AUDIENCE_ID;
    const mcApiKey = process.env.MAILCHIMP_API_KEY;

    if (mcApiKey && mcAudienceId && mcServer) {
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0] || name;
      const lastName = nameParts.slice(1).join(' ') || '';

      const mcRes = await fetch(
        `https://${mcServer}.api.mailchimp.com/3.0/lists/${mcAudienceId}/members`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${Buffer.from(`anystring:${mcApiKey}`).toString('base64')}`
          },
          body: JSON.stringify({
            email_address: email,
            status: 'subscribed',
            merge_fields: { FNAME: firstName, LNAME: lastName },
            tags: ['9tofit-scanner']
          })
        }
      );

      if (!mcRes.ok) {
        const mcErr = await mcRes.json();
        // "Member Exists" is fine — already on the list
        if (mcErr.title !== 'Member Exists') {
          console.error('Mailchimp error:', mcErr.detail);
        }
      }
    }

    return Response.json({ success: true });

  } catch (error) {
    console.error('Send route error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
