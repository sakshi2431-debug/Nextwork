import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(request: Request) {
  const { question, answer, analysis } = await request.json()

  if (!question || !answer || !analysis) {
    return Response.json({ error: 'question, answer, and analysis are required' }, { status: 400 })
  }

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    response_format: { type: 'json_object' },
    temperature: 0.5,
    messages: [
      {
        role: 'system',
        content: `You are an expert product design interview coach. Evaluate candidate answers and give specific, actionable feedback.
Return ONLY valid JSON:
{
  "score": 7,
  "strengths": ["specific concrete strength from the answer", "another strength"],
  "improvements": ["specific concrete thing to add or improve", "another improvement"],
  "rewrite": "One or two sentences showing how to open the answer more powerfully."
}
Score rubric: 9-10 = hire immediately, 7-8 = strong signal, 5-6 = potential with coaching, 3-4 = significant gaps, 1-2 = off-topic or missing.
Be specific — reference the actual content of the answer in your feedback, not generic advice.`,
      },
      {
        role: 'user',
        content: `Evaluate this interview answer.

Role: ${analysis.role}${analysis.company ? ` at ${analysis.company}` : ''}
What this team values: ${(analysis.values as string[]).join(', ')}

Interview question: ${question}

Candidate's answer:
${answer}

Give a score, 2-3 specific strengths, 2-3 specific improvements, and rewrite the opening sentence to show how to start stronger.`,
      },
    ],
  })

  const data = JSON.parse(completion.choices[0].message.content!)
  return Response.json(data)
}
