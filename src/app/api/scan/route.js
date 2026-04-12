// ── Rate Limiting ──────────────────────────────
const rateLimitMap = new Map()
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour
const RATE_LIMIT_MAX_PER_IP = 10 // max 10 scans per IP per hour

function isRateLimited(key) {
  const now = Date.now()
  const entry = rateLimitMap.get(key)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return false
  }

  entry.count++
  return entry.count > RATE_LIMIT_MAX_PER_IP
}

// Clean up stale entries every 10 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitMap) {
    if (now > entry.resetAt) rateLimitMap.delete(key)
  }
}, 10 * 60 * 1000)

// Required answer fields
const REQUIRED_FIELDS = [
  'pain_location', 'pain_timing', 'movement_triggers',
  'pain_duration', 'pain_intensity', 'work_type',
  'training_history', 'activity_level', 'previous_treatment'
]

export async function POST(request) {
  try {
    // ── Rate limiting ───
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (isRateLimited(`ip:${clientIp}`)) {
      return Response.json(
        { success: false, error: 'Te veel verzoeken. Probeer het later opnieuw.' },
        { status: 429 }
      )
    }

    const { type, answers, userInfo } = await request.json();

    // ── Input validation ───
    if (!answers || typeof answers !== 'object') {
      return Response.json(
        { success: false, error: 'Ongeldige scan data.' },
        { status: 400 }
      )
    }

    const missing = REQUIRED_FIELDS.filter(f => answers[f] === undefined || answers[f] === null)
    if (missing.length > 0) {
      return Response.json(
        { success: false, error: `Niet alle vragen zijn beantwoord.` },
        { status: 400 }
      )
    }

    // Validate pain_intensity is a number 1-10
    const intensity = Number(answers.pain_intensity)
    if (isNaN(intensity) || intensity < 1 || intensity > 10) {
      return Response.json(
        { success: false, error: 'Pijnintensiteit moet tussen 1 en 10 zijn.' },
        { status: 400 }
      )
    }

    const systemPrompt = `You are Max, a specialist in injury rehabilitation and movement correction at 9toFit. You work with busy men (30–55) who have pain affecting their training and daily life.

Based on the assessment answers, generate a detailed, expert movement analysis. Be specific, authoritative and genuinely helpful – this should feel like a real consultation, not a generic response.

IMPORTANT: All text output must be in Dutch (Nederlands).

You MUST return ONLY valid JSON with NO markdown, NO backticks, NO explanation outside the JSON.

Return this exact structure:
{
  "headline": "Short impactful headline about their main issue (max 8 words, use *italic* around key phrase) - IN DUTCH",
  "primary_area": "Main pain location in 1-3 words - IN DUTCH",
  "overall_risk": "Laag | Gemiddeld | Hoog",
  "urgency": "Short urgency label in Dutch e.g. 'Aandacht nodig' or 'Goed monitoren' or 'Nu aanpakken'",
  "movement_limitations": [
    {
      "icon": "relevant emoji",
      "name": "Limitation name - IN DUTCH",
      "description": "2-3 sentence explanation of why this limitation exists and how it impacts daily life and training - IN DUTCH"
    }
  ],
  "risk_factors": [
    "Risk factor 1 – specific explanation tied to their answers - IN DUTCH",
    "Risk factor 2 – specific explanation - IN DUTCH",
    "Risk factor 3 – specific explanation - IN DUTCH"
  ],
  "coach_insight": "2-3 sentences of direct, expert insight in Dutch. Be specific to their situation. Reference their pain location, work type, and duration. End with one clear priority action.",
  "seven_day_plan": [
    {
      "day": 1,
      "title": "Foundation & Assessment (TRANSLATE TO DUTCH - e.g. 'Fundament & Beoordeling')",
      "focus": "Mobility (TRANSLATE TO DUTCH - e.g. 'Mobiliteit')",
      "exercises": [
        {
          "name": "Exercise name - IN DUTCH",
          "sets": "3 sets",
          "duration": "45 seconds",
          "note": "How to perform it and what to feel - IN DUTCH"
        }
      ],
      "note": "Optional day note or progression tip - IN DUTCH"
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
- ALL DAY TITLES, EXERCISE NAMES, AND NOTES MUST BE IN DUTCH

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
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 8000,
        messages: [{ role: 'user', content: systemPrompt + '\n\n' + userMessage }]
      })
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('Anthropic API error:', err?.error?.message || `HTTP ${response.status}`);
      return Response.json(
        { success: false, error: 'Analyse kon niet worden gegenereerd. Probeer het opnieuw.' },
        { status: 502 }
      );
    }

    const data = await response.json();
    const text = data.content?.map(c => c.text || '').join('') || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON in AI response');
      return Response.json(
        { success: false, error: 'Analyse kon niet worden verwerkt. Probeer het opnieuw.' },
        { status: 500 }
      );
    }
    const parsed = JSON.parse(jsonMatch[0]);

    return Response.json({ success: true, result: parsed });

  } catch (error) {
    console.error('Scan error:', error);
    return Response.json(
      { success: false, error: 'Er is een fout opgetreden. Probeer het later opnieuw.' },
      { status: 500 }
    );
  }
}
