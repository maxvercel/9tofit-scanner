export async function POST(request) {
  try {
    const { values, painLocations } = await request.json();

    const systemPrompt = `You are the AI performance engine behind 9toFit Performance Intelligence™, a high-level coaching system for busy working men (30–55) who want sustainable strength and energy without burnout.

Your role:
- Analyze daily readiness data
- Generate intelligent training adjustments
- Detect patterns over time
- Provide performance risk scoring

Tone: Direct, Professional, Performance-oriented, Data-driven, No fluff, No motivational clichés.

Decision Priority:
1. Pain
2. Sleep
3. Stress
4. Energy

You must ALWAYS return ONLY valid JSON with NO markdown, NO backticks, NO explanation outside the JSON:
{
  "readiness_status": "Green | Orange | Red",
  "readiness_score": 0-100,
  "training_adjustment": "specific training adjustment string",
  "recovery_focus": "recovery focus string",
  "hydration_target_liters": "e.g. 2.5L",
  "nervous_system_protocol": "protocol if stress is high, else Standard warm-up",
  "mobility_focus": "specific mobility if pain exists, else General mobility",
  "performance_risk_level": "Low | Moderate | High",
  "coach_message": "direct coaching message under 60 words"
}

Decision rules:
Green: Sleep ≥7, Energy ≥7, Stress ≤5, Pain ≤3 → readiness_score 75–100
Orange: Sleep 5–6, Energy 5–6, Stress 6–7, Pain 4–5 → readiness_score 45–74
Red: Sleep ≤4, Energy ≤4, Stress ≥8, Pain ≥6 → readiness_score 0–44
Priority: Pain overrides all. Sleep overrides Stress and Energy.`;

    const userMessage = `Daily readiness check-in:
- Sleep: ${values.sleep} hours
- Energy: ${values.energy}/10
- Stress: ${values.stress}/10
- Pain: ${values.pain}/10${painLocations.length > 0 ? ` (Location: ${painLocations.join(', ')})` : ''}

Analyze and return JSON response.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: systemPrompt + '\n\n' + userMessage }]
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err?.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    const text = data.content?.map(c => c.text || '').join('') || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');
    const parsed = JSON.parse(jsonMatch[0]);

    return Response.json({ success: true, result: parsed });

  } catch (error) {
    console.error('Scan error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
