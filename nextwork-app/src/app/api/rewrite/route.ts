import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(request: Request) {
  const { transcript } = await request.json()

  if (!transcript?.trim()) {
    return Response.json({ error: 'transcript is required' }, { status: 400 })
  }

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    temperature: 0.4,
    messages: [
      {
        role: 'system',
        content: `You are a writing coach helping a learner turn rough spoken thoughts into vivid, descriptive project narrative.
The learner has just spoken a voice note — it may be unpolished, rambling, or jump between ideas.

Your job: rewrite it in 2–3 sentences that paint a clear picture of what they did, why they did it, and what it meant.
- Be descriptive — don't just state what happened, show it. Name the tool, the decision, the constraint, the realisation, the feeling. Make the reader feel like they were there.
- Weave in everything they mentioned — the context, the reasoning, the outcome, the doubts — nothing gets dropped
- Keep every specific detail intact; never swap their words for vague generalisations
- First person, past or present tense
- Reads like a compelling paragraph in a UX case study portfolio — confident, human, and specific, not a resume bullet or a corporate summary
- Fix grammar and remove filler words, but preserve the learner's voice throughout

Return ONLY the rewritten text. No quotes, no preamble, nothing else.`,
      },
      {
        role: 'user',
        content: transcript,
      },
    ],
  })

  const text = completion.choices[0].message.content?.trim() ?? ''
  return Response.json({ text })
}
