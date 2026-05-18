import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(request: Request) {
  const { analysis } = await request.json()

  if (!analysis) {
    return Response.json({ error: 'Analysis data is required' }, { status: 400 })
  }

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    response_format: { type: 'json_object' },
    temperature: 0.7,
    messages: [
      {
        role: 'system',
        content: `You are an expert product design interviewer who writes incisive, role-specific interview questions.
Return ONLY valid JSON:
{
  "questions": [
    { "id": "1", "category": "Portfolio", "question": "..." },
    { "id": "2", "category": "Process", "question": "..." },
    { "id": "3", "category": "Collaboration", "question": "..." },
    { "id": "4", "category": "Design Thinking", "question": "..." },
    { "id": "5", "category": "Metrics", "question": "..." }
  ]
}
Use exactly these category names: Portfolio, Process, Collaboration, Design Thinking, Metrics.
Questions should be open-ended, behavioural ("Tell me about a time…", "Walk me through…"), and specifically tied to the role's skills and values. Avoid generic questions.`,
      },
      {
        role: 'user',
        content: `Generate 5 targeted interview questions for this role.

Role: ${analysis.role}
Company: ${analysis.company ?? 'the company'}
Key skills required: ${(analysis.skills as string[]).join(', ')}
Design values they care about: ${(analysis.values as string[]).join(', ')}

Make each question directly probe one of the skills or values above.`,
      },
    ],
  })

  const data = JSON.parse(completion.choices[0].message.content!)
  return Response.json(data)
}
