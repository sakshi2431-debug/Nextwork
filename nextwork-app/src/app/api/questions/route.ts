import { handleAI, complete, analysisFrom, outputObject } from '../../../lib/ai-route'

export async function POST(request: Request) {
  return handleAI(request, async body => {
    const analysis = analysisFrom(body.analysis)
    const data = outputObject(await complete(`You are an expert product design interviewer who writes incisive, role-specific interview questions.
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
Questions should be open-ended, behavioural ("Tell me about a time…", "Walk me through…"), and specifically tied to the role's skills and values. Avoid generic questions.`, `Generate 5 targeted interview questions for this role.
Role: ${analysis.role}
Company: ${analysis.company ?? 'the company'}
Key skills required: ${analysis.skills.join(', ')}
Design values: ${analysis.values.join(', ')}`, 0.7, true))
    const categories = ['Portfolio', 'Process', 'Collaboration', 'Design Thinking', 'Metrics']
    if (!Array.isArray(data.questions) || data.questions.length !== 5 || !data.questions.every((item, index) => item && typeof item.id === 'string' && item.category === categories[index] && typeof item.question === 'string' && item.question.trim())) throw new Error('Invalid AI response')
    return { questions: data.questions }
  })
}
