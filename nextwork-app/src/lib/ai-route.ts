import Groq from 'groq-sdk'

export class InputError extends Error {}

export function field(body: Record<string, unknown>, name: string, max = 12000): string {
  const value = body[name]
  if (typeof value !== 'string' || !value.trim() || value.length > max) {
    throw new InputError(`${name} must be text between 1 and ${max} characters`)
  }
  return value.trim()
}

export function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new InputError('Expected a JSON object')
  return value as Record<string, unknown>
}

export function strings(value: unknown): value is string[] {
  return Array.isArray(value) && value.length <= 10 && value.every(item => typeof item === 'string' && item.length <= 1000)
}

export function analysisFrom(value: unknown) {
  const data = object(value)
  const role = field(data, 'role', 500)
  if (data.company !== null && data.company !== undefined && (typeof data.company !== 'string' || data.company.length > 500)) throw new InputError('Invalid company')
  if (!strings(data.skills) || !strings(data.values)) throw new InputError('Invalid skills or values')
  return { role, company: data.company as string | null | undefined, skills: data.skills, values: data.values }
}

async function readObject(request: Request) {
  const reader = request.body?.getReader()
  if (!reader) throw new InputError('A JSON body is required')
  const chunks: Uint8Array[] = []
  let size = 0
  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    size += value.byteLength
    if (size > 64000) { await reader.cancel(); throw new InputError('Request is too large') }
    chunks.push(value)
  }
  const bytes = new Uint8Array(size)
  let offset = 0
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length }
  try { return object(JSON.parse(new TextDecoder().decode(bytes))) }
  catch { throw new InputError('Provide a valid JSON object') }
}

export async function handleAI(request: Request, action: (body: Record<string, unknown>) => Promise<unknown>) {
  try {
    const data = await action(await readObject(request))
    return Response.json(data)
  } catch (error) {
    if (error instanceof InputError) return Response.json({ error: error.message }, { status: 400 })
    // Do not expose provider messages, credentials, or user text in responses/logs.
    if (error instanceof Error && error.message === 'AI_NOT_CONFIGURED') return Response.json({ error: 'AI service is not configured' }, { status: 503 })
    return Response.json({ error: 'AI request did not finish. Please try again.' }, { status: 502 })
  }
}

export async function complete(system: string, user: string, temperature: number, json = false): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey || apiKey === 'your_groq_api_key_here') throw new Error('AI_NOT_CONFIGURED')
  // Initialize per request: an unset key must not crash route imports or builds.
  const groq = new Groq({ apiKey, timeout: 20000, maxRetries: 0 })
  const result = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile', temperature, max_tokens: 1800,
    ...(json ? { response_format: { type: 'json_object' as const } } : {}),
    messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
  })
  const text = result.choices?.[0]?.message?.content
  if (typeof text !== 'string' || !text.trim()) throw new Error('Invalid AI response')
  return text.trim()
}

export function outputObject(text: string): Record<string, unknown> {
  const value: unknown = JSON.parse(text)
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid AI response')
  return value as Record<string, unknown>
}
