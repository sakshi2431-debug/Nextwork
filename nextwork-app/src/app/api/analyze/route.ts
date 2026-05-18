import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(request: Request) {
  const { jobDescription } = await request.json()

  if (!jobDescription?.trim()) {
    return Response.json({ error: 'Job description is required' }, { status: 400 })
  }

  if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key_here') {
    return Response.json({ error: 'GROQ_API_KEY is not configured. Add it to .env.local and restart the dev server.' }, { status: 500 })
  }

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    response_format: { type: 'json_object' },
    temperature: 0.3,
    messages: [
      {
        role: 'system',
        content: `You are a product design hiring expert. Analyze job descriptions and extract the key information a candidate needs to prepare.
Return ONLY valid JSON with these exact keys:
{
  "role": "exact job title from the description",
  "company": "company name or null if not mentioned",
  "skills": ["5 to 7 key skills required — mix technical and soft skills"],
  "values": ["3 to 5 design values or working principles the team clearly cares about"]
}`,
      },
      {
        role: 'user',
        content: `Analyze this job description:\n\n${jobDescription}`,
      },
    ],
  })

  const data = JSON.parse(completion.choices[0].message.content!)
  return Response.json(data)
}
