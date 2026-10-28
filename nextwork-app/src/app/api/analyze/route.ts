import { handleAI, field, complete, outputObject, strings } from '../../../lib/ai-route'

export async function POST(request: Request) {
  return handleAI(request, async body => {
    const jobDescription = field(body, 'jobDescription', 20000)
    const data = outputObject(await complete(`You are a product design hiring expert. Analyze job descriptions and extract the key information a candidate needs to prepare.
Return ONLY valid JSON with these exact keys:
{
  "role": "exact job title from the description",
  "company": "company name or null if not mentioned",
  "skills": ["5 to 7 key skills required — mix technical and soft skills"],
  "values": ["3 to 5 design values or working principles the team clearly cares about"]
}`, `Analyze this job description:\n\n${jobDescription}`, 0.3, true))
    if (typeof data.role !== 'string' || !data.role.trim() || (data.company !== null && typeof data.company !== 'string') || !strings(data.skills) || !strings(data.values)) throw new Error('Invalid AI response')
    return { role: data.role, company: data.company, skills: data.skills, values: data.values }
  })
}
