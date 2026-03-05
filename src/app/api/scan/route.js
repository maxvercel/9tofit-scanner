export async function POST(request) {
  try {
    const { type, answers, userInfo } = await request.json();

    const systemPrompt = `You are Max, a specialist in injury rehabilitation and movement correction at 9toFit. You work with busy men (30–55) who have pain affecting their training and daily life.

Based on the assessment answers, generate a detailed, expert movement analysis. Be specific, authoritative and genuinely helpful — this should feel like a real consultation, not a generic response.

You MUST return ONLY valid JSON with NO markdown, NO backticks, NO explanation outside the JSON.

Return this exact structure:
{
  "headline": "Short impactful headline about their main issue (max 8 words, use *italic* around key phrase)",
  "primary_area": "Main pain location in 1-3 words",
  "overall_risk": "Low | Moderate | High",
  "urgency": "Short urgency label e.g. 'Needs attention' or 'Monitor closely' or 'Act now'",
  "movement_limitations": [
    {
      "icon": "relevant emoji",
      "name": "Limitation name",
      "description": "2-3 sentence explanation of why this limitation exists and how it impacts daily life and training"
    }
  ],
  "risk_factors": [
    "Risk factor 1 — specific explanation tied to their answers",
    "Risk factor 2 — specific explanation",
    "Risk factor 3 — specific explanation"
  ],
  "coach_insight": "2-3 sentences of direct, expert insight. Be specific to their situation. Reference their pain location, work type, and duration. End with one clear priority action.",
  "seven_day_plan": [
    {
      "day": 1,
      "title": "Foundation & Assessment",
      "focus": "Mobility",
      "exercises": [
        {
          "name": "Exercise name",
          "sets": "3 sets",
          "duration": "45 seconds",
          "note": "How to perform it and what to feel"
        }
      ],
      "note": "Optional day note or progression tip"
    }
  ]
}

Rules for the 7-day plan:
- Day 1-2: Gentle mobility and pain reduction
- Day 3-4: Stability and activation
- Day 5-6: Strength and movement re-education
- Day 7: Integration and assessment
- 3-4 exercises per day
- Each exercise must be specific to their pain location
- Include sets/duration AND a coaching note for each exercise
- Progress appropriately based on their training history and pain intensity

Rules for risk assessment:
- High risk: pain intensity 7+, duration over 3 months, no treatment, high-impact triggers
- Moderate risk: pain intensity 4-6, duration 1-3 months, some triggers
- Low risk: pain intensity 1-3, recent onset, limited triggers
- Always consider work type (desk work = postural risk, manual = overuse risk)`;

    const userMessage = `Patient assessment data:
- Pain location(s): ${JSON.stringify(answers.pain_location)}
- When it hurts: ${answers.pain_timing}
- Movement triggers: ${JSON.stringify(answers.movement_triggers)}
- Duration: ${answers.pain_duration}
- Pain intensity: ${answers.pain_intensity}/10
- Work type: ${answers.work_type}
- Training history: ${answers.training_history}
- Activity level: ${answers.activity_level} days/week
- Previous treatment: ${JSON.stringify(answers.previous_treatment)}

Generate a comprehensive movement analysis and 7-day corrective plan.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
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
