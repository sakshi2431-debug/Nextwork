export interface SpeechRecognitionHandle {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
  abort(): void
}
export type SpeechRecognitionWindow = Window & {
  SpeechRecognition?: new () => SpeechRecognitionHandle
  webkitSpeechRecognition?: new () => SpeechRecognitionHandle
}
