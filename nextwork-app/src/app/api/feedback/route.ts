import { handleAI, field, complete, analysisFrom, outputObject, strings } from '../../../lib/ai-route'

export async function POST(request: Request) {
  return handleAI(request, async body => {
    const question = field(body, 'question', 2000)
    const answer = field(body, 'answer')
    const analysis = analysisFrom(body.analysis)
    const data = outputObject(await complete(`You are an expert product design interview coach. Evaluate candidate answers and give specific, actionable feedback.
Return ONLY valid JSON:
{
  "score": 7,
  "strengths": ["specific concrete strength from the answer", "another strength"],
  "improvements": ["specific concrete thing to add or improve", "another improvement"],
  "rewrite": "One or two sentences showing how to open the answer more powerfully."
}
Score rubric: 9-10 = hire immediately, 7-8 = strong signal, 5-6 = potential with coaching, 3-4 = significant gaps, 1-2 = off-topic or missing.
Be specific — reference the actual content of the answer in your feedback, not generic advice.`, `Evaluate this interview answer.
Role: ${analysis.role}${analysis.company ? ` at ${analysis.company}` : ''}
What this team values: ${analysis.values.join(', ')}
Interview question: ${question}
Candidate answer: ${answer}`, 0.5, true))
    if (typeof data.score !== 'number' || !Number.isInteger(data.score) || data.score < 1 || data.score > 10 || !strings(data.strengths) || !strings(data.improvements) || typeof data.rewrite !== 'string') throw new Error('Invalid AI response')
    return { score: data.score, strengths: data.strengths, improvements: data.improvements, rewrite: data.rewrite }
  })
}
