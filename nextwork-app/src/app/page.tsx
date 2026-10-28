'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { CheckItem } from '../components/CheckItem'
import { CodeBlock } from '../components/CodeBlock'
import type { SpeechRecognitionHandle, SpeechRecognitionWindow } from '../lib/speech'
import { Libre_Baskerville, DM_Mono } from 'next/font/google'
import styles from './page.module.css'

const baskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-baskerville',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-mono',
  display: 'swap',
})

// CSS module class helper
const s = (cls: string) => styles[cls] || ''

// Combine class names
function cx(...args: (string | false | undefined | null)[]) {
  return args.filter(Boolean).join(' ')
}

// Syntax-highlighted code block contents (using CSS module class names)
const CODE_CD = `<span class="${s('tf')}">cd</span> <span class="${s('ts')}">~/Desktop</span>`

const CODE_NPX = `<span class="${s('tf')}">npx</span> <span class="${s('ts')}">create-next-app@latest</span> design-interview-coach <span class="${s('tk')}">--yes</span>`

const CODE_LAYOUT = `<span class="${s('tk')}">import</span> <span class="${s('tp')}">type</span> <span class="${s('tp')}">{</span> <span class="${s('tt')}">Metadata</span> <span class="${s('tp')}">}</span> <span class="${s('tk')}">from</span> <span class="${s('ts')}">"next"</span><span class="${s('tp')}">;</span>
<span class="${s('tk')}">import</span> <span class="${s('ts')}">"./globals.css"</span><span class="${s('tp')}">;</span>

<span class="${s('tk')}">export</span> <span class="${s('tk')}">const</span> <span class="${s('tv')}">metadata</span><span class="${s('tp')}">:</span> <span class="${s('tt')}">Metadata</span> <span class="${s('tp')}">= {</span>
  <span class="${s('tv')}">title</span><span class="${s('tp')}">:</span> <span class="${s('ts')}">"Product Design Interview Coach"</span><span class="${s('tp')}">,</span>
  <span class="${s('tv')}">description</span><span class="${s('tp')}">:</span> <span class="${s('ts')}">"AI-powered interview prep tailored to specific job descriptions"</span><span class="${s('tp')}">,</span>
<span class="${s('tp')}">};</span>

<span class="${s('tk')}">export</span> <span class="${s('tk')}">default</span> <span class="${s('tk')}">function</span> <span class="${s('tf')}">RootLayout</span><span class="${s('tp')}">({</span>
  <span class="${s('tv')}">children</span><span class="${s('tp')}">,</span>
<span class="${s('tp')}">}:</span> <span class="${s('tt')}">Readonly</span><span class="${s('tp')}">&lt;{</span>
  <span class="${s('tv')}">children</span><span class="${s('tp')}">:</span> <span class="${s('tt')}">React.ReactNode</span><span class="${s('tp')}">;</span>
<span class="${s('tp')}">&gt;)</span> <span class="${s('tp')}">&#123;</span>
  <span class="${s('tk')}">return</span> <span class="${s('tp')}">&#40;</span>
    <span class="${s('tp')}">&lt;</span><span class="${s('tf')}">html</span> <span class="${s('tv')}">lang</span><span class="${s('tp')}">=</span><span class="${s('ts')}">"en"</span><span class="${s('tp')}">&gt;</span>
      <span class="${s('tp')}">&lt;</span><span class="${s('tf')}">body</span> <span class="${s('tv')}">className</span><span class="${s('tp')}">=</span><span class="${s('ts')}">"antialiased"</span><span class="${s('tp')}">&gt;&#123;</span><span class="${s('tv')}">children</span><span class="${s('tp')}">&#125;&lt;/</span><span class="${s('tf')}">body</span><span class="${s('tp')}">&gt;</span>
    <span class="${s('tp')}">&lt;/</span><span class="${s('tf')}">html</span><span class="${s('tp')}">&gt;</span>
  <span class="${s('tp')}">&#41;;</span>
<span class="${s('tp')}">}</span>`

const LAYOUT_ANNOTATIONS = [
  'Imports the Metadata type from Next.js so TypeScript can check your metadata object matches the expected shape.',
  'Imports your global CSS file — this stylesheet applies to every page in the app.',
  '',
  'Declares the metadata export. Next.js reads this at build time to populate the browser tab and meta tags.',
  'Sets the page title — appears in the browser tab and is used as the headline by search engines.',
  'Sets the SEO description — shown as the snippet beneath your page title in search results.',
  'Closes the metadata object.',
  '',
  'Declares the root layout function. Every page in your app is wrapped by this component on every route.',
  'Receives the page content as children — Next.js passes whichever page the user navigated to.',
  'Opens the TypeScript type for the parameter. Readonly prevents accidental mutation of the prop.',
  'Types children as a React node — anything React can render: JSX, a string, an array, or null.',
  'Closes the parameter type and list, then opens the function body.',
  'The return statement — everything below becomes the HTML skeleton sent to the browser.',
  'The root HTML element. lang="en" tells screen readers and search engines this page is in English.',
  'Wraps all page content. antialiased applies sub-pixel font smoothing for crisper text on screen.',
  'Closes the html element.',
  'Closes the return parentheses.',
  'Closes the RootLayout function.',
]

const SECTION_PROGRESS: Record<string, number> = {
  'step-0': 10, 'step-1': 28, 'step-2': 46,
  'secret': 72, 'cleanup': 88, 'mission': 100,
}

function TopBar({ progress }: { progress: number }) {
  return (
    <div className={s('top-bar')}>
      <div className={s('top-bar-inner')}>
        <div className={s('top-bar-left')}>
          <button className={s('top-back-btn')} type="button" aria-label="Back to projects">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
            Projects
          </button>
          <div
            className={s('top-progress-track')}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Tutorial progress: ${progress}%`}
          >
            <div className={s('top-progress-fill')} style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className={s('top-bar-right')}>
          <button className={s('top-avatar')} type="button" aria-label="User profile — sakshi 31 rane">
            S
            <div className={s('top-avatar-dot')} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}

type ReflectMode = 'write' | 'voice' | 'upload' | 'combine'

const MODE_CFG: Record<ReflectMode, { label: string; icon: React.ReactNode }> = {
  write: {
    label: 'Write',
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  voice: {
    label: 'Voice',
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="9" y="2" width="6" height="12" rx="3" stroke="currentColor" strokeWidth="2"/><path d="M5 10a7 7 0 0 0 14 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="12" y1="19" x2="12" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  },
  upload: {
    label: 'Upload',
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/><polyline points="21 15 16 10 5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  combine: {
    label: 'Combine',
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
}

function UploadZone({ imageKey, uploadedImages, onUpload }: {
  imageKey: string
  uploadedImages?: Record<string, { name: string; url: string }>
  onUpload?: (key: string) => void
}) {
  const img = uploadedImages?.[imageKey]
  return img ? (
    <div className={cx(s('up-row'), s('show'))} role="status" aria-live="polite">
      <div className={s('up-thumb')} aria-hidden="true">
        <Image src={img.url} alt="" width={48} height={48} unoptimized style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }} />
      </div>
      <div className={s('up-name')}>{img.name}</div>
      <div className={s('up-ok')}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14l-4-4 1.41-1.41L10 13.17l6.59-6.59L18 8l-8 8z"/></svg>
        Uploaded
      </div>
    </div>
  ) : (
    <div
      className={s('upload-z')}
      role="button" tabIndex={0}
      aria-label="Click to upload a screenshot"
      onClick={() => onUpload?.(imageKey)}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onUpload?.(imageKey) }}
    >
      <div className={s('uz-icon')} aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <div className={s('uz-txt')}><strong>Add a screenshot</strong> — click or drag and drop</div>
      <div className={s('uz-hint')}>PNG · JPG · max 10 MB</div>
    </div>
  )
}

function TaskBlock({
  id, labelId, question, placeholder,
  reflection, onReflectionChange,
  recording, processing, onStartVoice,
  saved, onSave, className,
  imageKey, uploadedImages, onUpload,
  modes, recommended,
}: {
  id: string; labelId: string; question: string; placeholder: string
  reflection: string; onReflectionChange: (val: string) => void
  recording: string | null; processing: string | null; onStartVoice: (id: string) => void
  saved: boolean; onSave: () => void; className?: string
  imageKey?: string
  uploadedImages?: Record<string, { name: string; url: string }>
  onUpload?: (key: string) => void
  modes?: ReflectMode[]
  recommended?: ReflectMode
}) {
  const [activeMode, setActiveMode] = useState<ReflectMode>(recommended ?? modes?.[0] ?? 'write')

  const showText   = !modes || activeMode === 'write' || activeMode === 'combine'
  const showVoice  = modes && activeMode === 'voice'
  const showUpload = imageKey && modes && (activeMode === 'upload' || activeMode === 'combine')
  const showTips   = showText

  return (
    <div className={cx(s('task-block'), className)} role="group" aria-labelledby={labelId}>
      <div className={s('task-head')}>
        <div className={s('task-t')} id={labelId}>{question}</div>
        {!modes && <VoiceMicButton id={id} recording={recording} processing={processing} onStart={onStartVoice} />}
      </div>

      {modes && (
        <div className={s('mode-picker')}>
          <p className={s('mode-hint')}>Choose how you&apos;d like to reflect. You can write, speak, upload, or combine them.</p>
          <div className={s('mode-opts')}>
            {modes.map(m => (
              <button
                key={m}
                className={cx(s('mode-btn'), activeMode === m && s('mode-btn-on'))}
                onClick={() => setActiveMode(m)}
                type="button"
              >
                {MODE_CFG[m].icon}
                {MODE_CFG[m].label}
                {m === recommended && <span className={s('mode-rec')}>Recommended</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {showVoice && (
        <div className={s('voice-mode')}>
          <VoiceMicButton id={id} recording={recording} processing={processing} onStart={onStartVoice} />
          <span className={s('voice-mode-lbl')}>
            {recording === id ? 'Recording… tap to stop' : processing === id ? 'Processing…' : 'Tap to start recording'}
          </span>
          {reflection && <p className={s('voice-transcript')}>{reflection}</p>}
        </div>
      )}

      {showText && (
        <textarea
          className={s('task-ta')}
          placeholder={placeholder}
          aria-label="Reflection"
          rows={4}
          value={reflection}
          onChange={e => onReflectionChange(e.target.value)}
        />
      )}

      {showUpload && (
        <div className={s('task-upload')}>
          <UploadZone imageKey={imageKey!} uploadedImages={uploadedImages} onUpload={onUpload} />
        </div>
      )}

      {showTips && (
        <div className={s('tips')}>
          <div className={s('tips-head')}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="8" r="5" stroke="currentColor" strokeWidth="2"/>
              <path d="M9.5 15.5c0-1 1-3 2.5-3s2.5 2 2.5 3v1H9.5v-1z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              <line x1="10" y1="19.5" x2="14" y2="19.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Tips to help you write
          </div>
          <ul className={s('tips-list')}>
            <li className={s('tips-item')}>
              <svg className={s('tips-icon')} width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><polyline points="9 12 11 14 15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Focus on the outcome, not the how.
            </li>
            <li className={s('tips-item')}>
              <svg className={s('tips-icon')} width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><polyline points="9 12 11 14 15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Use your own words — imagine explaining it to a teammate.
            </li>
            <li className={s('tips-item')}>
              <svg className={s('tips-icon')} width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><polyline points="9 12 11 14 15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Keep it short and clear (1–3 sentences is perfect).
            </li>
          </ul>
        </div>
      )}
      <div className={s('task-foot')}>
        <div className={s('task-foot-note')}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          This reflection is saved to your step and helps you track your learning.
        </div>
        <button
          className={cx(s('save-btn'), saved && s('saved'))}
          onClick={onSave}
          type="button"
          disabled={!reflection.trim()}
        >
          {saved ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true"><polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Saved
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke="currentColor" strokeWidth="2"/><polyline points="17 21 17 13 7 13 7 21" stroke="currentColor" strokeWidth="2"/><polyline points="7 3 7 8 15 8" stroke="currentColor" strokeWidth="2"/></svg>
              Save reflection
            </>
          )}
        </button>
      </div>
    </div>
  )
}

function WorkPanel({ open, onClose, reflections, saved }: {
  open: boolean; onClose: () => void
  reflections: Record<string, string>; saved: Record<string, boolean>
}) {
  if (!open) return null
  const steps = [
    { id: 't0', label: 'Project overview' },
    { id: 't1', label: 'Step 1 — Scaffold the Project' },
    { id: 't2', label: 'Step 2 — Build the Input Page' },
  ]
  return (
    <>
      <div className={s('work-overlay')} onClick={onClose} aria-hidden="true" />
      <aside className={s('work-panel')} aria-label="My work">
        <div className={s('work-panel-head')}>
          <span className={s('work-panel-title')}>My Work</span>
          <button className={s('work-panel-close')} onClick={onClose} aria-label="Close" type="button">✕</button>
        </div>
        <p className={s('work-panel-sub')}>Your saved reflections — the story of what you built and why.</p>
        <div className={s('work-refs')}>
          {steps.map(({ id, label }) => (
            <div key={id} className={s('work-ref')}>
              <div className={s('work-ref-label')}>{label}</div>
              {saved[id] && reflections[id] ? (
                <p className={s('work-ref-text')}>{reflections[id]}</p>
              ) : (
                <p className={s('work-ref-empty')}>No reflection saved yet.</p>
              )}
            </div>
          ))}
        </div>
      </aside>
    </>
  )
}

function VoiceMicButton({
  id, recording, processing, onStart,
}: {
  id: string
  recording: string | null
  processing: string | null
  onStart: (id: string) => void
}) {
  const isRec = recording === id
  const isProc = processing === id
  return (
    <button
      className={cx(s('mic-btn'), isRec && s('rec'))}
      onClick={() => onStart(id)}
      disabled={isProc || (!!recording && recording !== id)}
      aria-label={isRec ? 'Stop recording' : 'Record voice note'}
      title={isRec ? 'Tap to stop' : 'Dictate your reflection'}
      type="button"
    >
      {isProc ? (
        <span className={s('mic-spin')} aria-hidden="true" />
      ) : (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="9" y="2" width="6" height="12" rx="3" fill="currentColor" />
          <path d="M5 10a7 7 0 0 0 14 0" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <line x1="12" y1="19" x2="12" y2="22" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="9" y1="22" x2="15" y2="22" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      )}
    </button>
  )
}

export default function ProjectPage() {
  // Checkbox state — key format: `s{stepNum}-{itemIndex}`
  const [checks, setChecks] = useState<Record<string, boolean>>({
    's1-0': true,
    's1-1': true,
    's1-2': false,
    's2-0': false,
    's2-1': false,
    's2-2': false,
  })

  // Upload zone: whether the uploaded file row is visible
  const [uploadShown, setUploadShown] = useState(false)

  // Uploaded screenshots: key → { name, url (data URL) }
  const [uploadedImages, setUploadedImages] = useState<Record<string, { name: string; url: string }>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const pendingUploadKey = useRef('')

  // Collapsed sections
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  // Sidebar active section
  const [activeSection, setActiveSection] = useState('step-0')

  // Copy button feedback
  const [copied, setCopied] = useState<Record<string, boolean>>({})

  // Reflection textarea values (controlled)
  const [reflections, setReflections] = useState<Record<string, string>>({
    t0: '', t1: '', t2: '',
  })

  // Voice recording state: which textarea id is currently recording / processing
  const [recording, setRecording] = useState<string | null>(null)
  const [processing, setProcessing] = useState<string | null>(null)
  const [voiceError, setVoiceError] = useState('')
  const recognitionRef = useRef<SpeechRecognitionHandle | null>(null)

  useEffect(() => () => recognitionRef.current?.abort(), [])

  // Reflection save state and work panel
  const [saved, setSaved] = useState<Record<string, boolean>>({})
  const [doLater, setDoLater] = useState<Record<string, boolean>>({})
  const [workPanelOpen, setWorkPanelOpen] = useState(false)
  const [docOpen, setDocOpen] = useState(false)
  const [docExpanded, setDocExpanded] = useState(false)
  const [docTheme, setDocTheme] = useState<'light' | 'dark' | 'fun' | 'bento'>('dark')
  const [docThemeOpen, setDocThemeOpen] = useState(false)
  const docThemeRef = useRef<HTMLDivElement>(null)

  // Smooth scroll + sidebar intersection observer
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
    const sections = document.querySelectorAll<HTMLElement>('section[id]')
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: '-40% 0px -55% 0px' }
    )
    sections.forEach(s => observer.observe(s))
    return () => {
      observer.disconnect()
      document.documentElement.style.scrollBehavior = ''
    }
  }, [])

  function toggleCheck(key: string) {
    setChecks(prev => ({ ...prev, [key]: !prev[key] }))
  }

  function copyCode(key: string, text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(prev => ({ ...prev, [key]: true }))
      setTimeout(() => setCopied(prev => ({ ...prev, [key]: false })), 1500)
    }).catch(() => {})
  }

  function toggleCollapse(id: string) {
    setCollapsed(prev => ({ ...prev, [id]: !prev[id] }))
  }

  function triggerUpload(key: string) {
    pendingUploadKey.current = key
    fileInputRef.current?.click()
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const key = pendingUploadKey.current
    const reader = new FileReader()
    reader.onload = ev => {
      setUploadedImages(prev => ({ ...prev, [key]: { name: file.name, url: ev.target?.result as string } }))
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  async function startVoice(id: string) {
    if (recording === id) {
      recognitionRef.current?.stop()
      setRecording(null)
      return
    }

    const SR = (typeof window !== 'undefined') &&
      ((window as SpeechRecognitionWindow).SpeechRecognition || (window as SpeechRecognitionWindow).webkitSpeechRecognition)
    if (!SR) {
      alert('Voice input requires Chrome or Edge.')
      return
    }

    const rec = new SR()
    rec.lang = 'en-US'
    rec.interimResults = false
    rec.maxAlternatives = 1

    setVoiceError('')
    rec.onresult = async event => {
      const transcript: string = event.results[0][0].transcript
      setRecording(null)
      setProcessing(id)
      try {
        const res = await fetch('/api/rewrite', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transcript }),
          signal: AbortSignal.timeout(30000),
        })
        if (!res.ok) throw new Error('Rewrite unavailable')
        const data: unknown = await res.json()
        if (!data || typeof data !== 'object' || !('text' in data) || typeof data.text !== 'string' || !data.text.trim()) throw new Error('Invalid rewrite')
        const text = data.text
        setReflections(prev => ({ ...prev, [id]: text }))
      } catch {
        setReflections(prev => ({ ...prev, [id]: transcript }))
        setVoiceError('The rewrite did not finish. Your original transcript has been kept; you can edit it here.')
      } finally {
        setProcessing(null)
      }
    }

    rec.onerror = () => { setRecording(null); setVoiceError('Voice input stopped. You can type your reflection instead.') }
    rec.onend = () => setRecording(null)

    recognitionRef.current = rec
    try { rec.start(); setRecording(id) }
    catch { setVoiceError('Voice input could not start. You can type your reflection instead.') }
  }

  const progressPct = SECTION_PROGRESS[activeSection] ?? 10

  return (
    <div className={cx(styles.root, baskerville.variable, dmMono.variable)}>
      <TopBar progress={progressPct} />
      {voiceError && <p role="status" aria-live="polite">{voiceError}</p>}
      <WorkPanel open={workPanelOpen} onClose={() => setWorkPanelOpen(false)} reflections={reflections} saved={saved} />
      <a href="#main" className={s('skip')}>Skip to main content</a>

      <div className={s('page')}>
        {/* ═══════════ MAIN ═══════════ */}
        <main className={s('main')} id="main">

          {/* Header */}
          <header className={s('proj-header')}>
            <div className={s('proj-badge')} aria-label="Content type">
              <div className={s('badge-dot')} aria-hidden="true" />
              Project
            </div>
            <h1 className={s('proj-title')}>Build a Product Design Interview Coach</h1>
            <p className={s('proj-desc')}>Vibe code an AI interview coach tailored to any job description.</p>
            <div className={s('proj-author')}>
              <div className={s('a-avatar')} aria-hidden="true">S</div>
              <span className={s('a-name')}>sakshi 31 rane</span>
            </div>
          </header>

          {/* Meta */}
          <div className={s('meta')} role="list" aria-label="Project details">
            <div className={s('meta-cell')} role="listitem"><span className={s('meta-k')}>Difficulty</span><span className={s('meta-v')}>Medium</span></div>
            <div className={s('meta-cell')} role="listitem"><span className={s('meta-k')}>Time</span><span className={s('meta-v')}>50 Min</span></div>
            <div className={s('meta-cell')} role="listitem"><span className={s('meta-k')}>Refreshed</span><span className={s('meta-v')}>13th May &apos;26</span></div>
            <div className={s('meta-cell')} role="listitem"><span className={s('meta-k')}>Cost</span><span className={s('meta-v')}>Free</span></div>
          </div>

          {/* Beta banner */}
          <div className={s('beta')} role="note" aria-label="Beta notice">
            <div className={s('beta-t')}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{display:'inline',verticalAlign:'-2px',marginRight:'6px'}}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              Whoa! Welcome to our new beta feature!
            </div>
            <p className={s('beta-b')}>
              This is a NextWork project generated with AI. It&apos;s a new feature and may have some bugs. If you spot anything, please let us know in{' '}
              <a href="#">our community</a>.
            </p>
          </div>

          {/* Summary */}
          <section className={s('summary')} aria-labelledby="sum-h">
            <h2 className={s('sum-h')} id="sum-h">30 Second Summary</h2>
            <div className={s('prose')}>
              <p>Preparing for product design interviews is tough when you don&apos;t know what a specific company actually values. Generic practice questions miss the mark because every team looks for different signals.</p>
              <p>In this project, you will build an AI-powered interview coach that analyzes real job descriptions and generates tailored practice questions with personalized feedback. You&apos;ll vibe code the entire app using Cursor and the Groq API.</p>
            </div>

            <h2 className={cx(s('sum-h'), s('mt-24'))}>What You&apos;ll Build</h2>
            <div className={s('prose')}>
              <p>A Next.js app powered by a large language model that parses job descriptions, generates targeted interview questions across categories, and provides AI feedback on your practice answers.</p>
              <p>By the end of this project, you&apos;ll have:</p>
              <ul>
                <li>A <strong>job description analyzer</strong> that extracts the skills and design values a hiring team cares about.</li>
                <li>A <strong>practice interface</strong> with AI-powered feedback that scores your answers and gives specific suggestions for improvement.</li>
                <li><strong>Secret Mission:</strong> Add a session history feature that tracks your practice sessions and shows improvement over time.</li>
              </ul>
            </div>

            <div className={s('prereq')} role="note">
              <div className={s('prereq-t')}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{display:'inline',verticalAlign:'-2px',marginRight:'6px'}}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                Are there any prerequisites?
              </div>
              <p className={s('prereq-b')}>You should be comfortable using an IDE and familiar with web development concepts like HTML, CSS, and JavaScript. No prior experience with AI APIs or Next.js is required.</p>
            </div>
          </section>

          <div className={s('divider')} />

          {/* ═══ STEP 0 ═══ */}
          <div className={s('step-sep')} aria-hidden="true">
            <div className={s('sep-line')} /><span className={s('sep-lbl')}>Step #0</span><div className={s('sep-line')} />
          </div>

          <section className={s('step')} id="step-0" aria-labelledby="s0-title">
            <div className={s('step-head')}>
              <h2 className={s('step-title')} id="s0-title">Before We Start</h2>
              <button
                className={s('coll-btn')}
                aria-expanded={!collapsed['step-0']}
                aria-label="Collapse section"
                onClick={() => toggleCollapse('step-0')}
              >
                {collapsed['step-0'] ? '∨' : '∧'}
              </button>
            </div>

            {!collapsed['step-0'] && (
              <>
                <TaskBlock
                  id="t0" labelId="t0-lbl"
                  question="What are we doing in this project?"
                  placeholder="In this project, I'm building… so that I can…"
                  reflection={reflections['t0']}
                  onReflectionChange={val => setReflections(prev => ({ ...prev, t0: val }))}
                  recording={recording} processing={processing} onStartVoice={startVoice}
                  saved={!!saved['t0']}
                  onSave={() => setSaved(prev => ({ ...prev, t0: true }))}
                  modes={['write', 'voice']}
                  recommended="write"
                />
                <div className={s('refl-actions')}>
                  <button className={s('btn-view-work')} onClick={() => setDocOpen(true)} type="button">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    View My Work
                  </button>
                  {doLater['t0'] ? (
                    <span className={s('later-note')}>↩ Marked to revisit later.</span>
                  ) : (
                    <button className={s('btn-later')} onClick={() => setDoLater(prev => ({ ...prev, t0: true }))} type="button">Do it later →</button>
                  )}
                </div>
              </>
            )}
          </section>

          <div className={s('divider')} />

          {/* ═══ STEP 1 ═══ */}
          <div className={s('step-sep')} aria-hidden="true">
            <div className={s('sep-line')} /><span className={s('sep-lbl')}>Step #1</span><div className={s('sep-line')} />
          </div>

          <section className={s('step')} id="step-1" aria-labelledby="s1-title">
            <div className={s('step-head')}>
              <h2 className={s('step-title')} id="s1-title">Scaffold the Project in Cursor</h2>
              <button
                className={s('coll-btn')}
                aria-expanded={!collapsed['step-1']}
                aria-label="Collapse section"
                onClick={() => toggleCollapse('step-1')}
              >
                {collapsed['step-1'] ? '∨' : '∧'}
              </button>
            </div>

            {!collapsed['step-1'] && (
              <>
                <div className={s('prose')}>
                  <p>To build your interview coach, you need a foundation to work from. Next.js gives you a full-stack framework where your UI pages and API routes live in the same project.</p>
                  <p>In this step, you will scaffold a Next.js app, install the SDK that connects to the Groq API, and configure your environment so everything is ready for vibe coding.</p>
                </div>

                <div className={s('cl')} role="group" aria-label="Step checklist">
                  <div className={s('cl-lbl')}>In this step, get ready to:</div>
                  <CheckItem checked={checks["s1-0"] ?? false} onToggle={toggleCheck} id="s1-0">Scaffold a Next.js project with TypeScript and Tailwind.</CheckItem>
                  <CheckItem checked={checks["s1-1"] ?? false} onToggle={toggleCheck} id="s1-1">Install the Groq-compatible SDK and configure your API key.</CheckItem>
                  <CheckItem checked={checks["s1-2"] ?? false} onToggle={toggleCheck} id="s1-2">Start the development server and confirm everything works.</CheckItem>
                </div>

                <TaskBlock
                  id="t1" labelId="t1-lbl"
                  question="What are we doing in this step?"
                  placeholder="In this step, I'm building… so that I can…"
                  reflection={reflections['t1']}
                  onReflectionChange={val => setReflections(prev => ({ ...prev, t1: val }))}
                  recording={recording} processing={processing} onStartVoice={startVoice}
                  saved={!!saved['t1']}
                  onSave={() => setSaved(prev => ({ ...prev, t1: true }))}
                  imageKey="ss1" uploadedImages={uploadedImages} onUpload={triggerUpload}
                  modes={['write', 'voice', 'upload', 'combine']} recommended="combine"
                  className={s('mt-24')}
                />
                <div className={s('refl-actions')}>
                  <button className={s('btn-view-work')} onClick={() => setDocOpen(true)} type="button">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    View My Work
                  </button>
                  {doLater['t1'] ? (
                    <span className={s('later-note')}>↩ Marked to revisit later.</span>
                  ) : (
                    <button className={s('btn-later')} onClick={() => setDoLater(prev => ({ ...prev, t1: true }))} type="button">Do it later →</button>
                  )}
                </div>

                <div className={s('sub-h')}>Scaffold the Next.js project</div>

                <div className={s('prose')}>
                  <p>The <span className={s('ic')}>create-next-app</span> CLI scaffolds a complete project with TypeScript, Tailwind CSS, and the App Router in one command. The <span className={s('ic')}>--yes</span> flag accepts all the defaults so you skip the interactive prompts.</p>
                  <ul>
                    <li>Open the integrated terminal in Cursor by pressing <strong>Ctrl+`</strong> (backtick key, same shortcut on macOS and Windows).</li>
                    <li>Move to your Desktop by running this command:</li>
                  </ul>
                </div>

                <CodeBlock copied={copied["cd"] ?? false} onCopy={copyCode} lang="bash" copyKey="cd" copyText="cd ~/Desktop" html={CODE_CD} />

                <div className={cx(s('prose'), s('mt-16'))}>
                  <ul><li>Create your project by running this command:</li></ul>
                </div>

                <CodeBlock copied={copied["npx"] ?? false} onCopy={copyCode}
                  lang="bash"
                  copyKey="npx"
                  copyText="npx create-next-app@latest design-interview-coach --yes"
                  html={CODE_NPX}
                />


                <div className={cx(s('callout'), s('r'))} role="alert">
                  <span className={s('co-icon')} aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><circle cx="12" cy="12" r="10"/><path d="M12 17h.01"/></svg></span>
                  <div>
                    <div className={s('co-t')}>Command not found?</div>
                    <div className={s('co-b')}>If you see an error when running <span className={s('ic')}>npx</span>, confirm Node.js is installed by running <span className={s('ic')}>node --version</span>. You need Node.js 20.9 or higher for Next.js.</div>
                    <div className={s('co-lnk')}>↩ help me fix a Node.js or npx error when scaffolding a Next.js project</div>
                  </div>
                </div>

                <div className={s('sub-h')}>Configure your layout file</div>

                <CodeBlock copied={copied["layout"] ?? false} onCopy={copyCode}
                  file="app/layout.tsx"
                  lang="typescript"
                  copyKey="layout"
                  copyText={`import type { Metadata } from "next";\nimport "./globals.css";\n\nexport const metadata: Metadata = {\n  title: "Product Design Interview Coach",\n  description: "AI-powered interview prep tailored to specific job descriptions",\n};\n\nexport default function RootLayout({\n  children,\n}: Readonly<{\n  children: React.ReactNode;\n}>) {\n  return (\n    <html lang="en">\n      <body className="antialiased">{children}</body>\n    </html>\n  );\n}`}
                  html={CODE_LAYOUT}
                  showExpand
                  showNewTab
                  explanation={<>This file wraps every page in your app. The <span className={s('ic')}>metadata</span> object sets the browser tab title and SEO description — change these to match your project. <span className={s('ic')}>RootLayout</span> receives your page content as <span className={s('ic')}>children</span> and renders it inside a minimal HTML shell with <span className={s('ic')}>antialiased</span> font smoothing.</>}
                  showHint
                  lineAnnotations={LAYOUT_ANNOTATIONS}
                />


                <div className={cx(s('ss-block'), s('mt-24'))} role="group" aria-labelledby="ss1-title">
                  <div className={s('ss-head')}>
                    <div className={s('ss-title')} id="ss1-title">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{display:'inline',verticalAlign:'-2px',marginRight:'6px'}}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                      Take a screenshot of your browser showing the default Next.js welcome page at localhost:3000.
                    </div>
                    <div className={s('ss-count')} aria-label="Task 1 of 2">1/2</div>
                  </div>
                  {!uploadShown ? (
                    <div
                      className={s('upload-z')}
                      role="button"
                      tabIndex={0}
                      aria-label="Click to upload screenshot"
                      onClick={() => setUploadShown(true)}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setUploadShown(true) }}
                    >
                      <div className={s('uz-icon')} aria-hidden="true">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      </div>
                      <div className={s('uz-txt')}><strong>Hover to paste, click to upload</strong> or drag and drop</div>
                      <div className={s('uz-hint')}>PNG or JPG (max. 10MB)</div>
                    </div>
                  ) : (
                    <div className={cx(s('up-row'), s('show'))} role="status" aria-live="polite">
                      <div className={s('up-thumb')} aria-hidden="true">🖼</div>
                      <div className={s('up-name')}>Screenshot 2026-05-17 at 3.15.31 PM.png</div>
                      <div className={s('up-ok')}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="var(--emerald)" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14l-4-4 1.41-1.41L10 13.17l6.59-6.59L18 8l-8 8z"/></svg>
                        100% uploaded
                      </div>
                    </div>
                  )}
                </div>

                <div className={s('actions')}>
                  <button className={s('btn-tasks')}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                    Tasks still to complete
                  </button>
                  <div className={s('review-note')} role="status">↩ Marked for review! Remember to mark this as complete once you revisit it.</div>
                </div>
              </>
            )}
          </section>

          <div className={s('divider')} />

          {/* ═══ STEP 2 ═══ */}
          <div className={s('step-sep')} aria-hidden="true">
            <div className={s('sep-line')} /><span className={s('sep-lbl')}>Step #2</span><div className={s('sep-line')} />
          </div>

          <section className={s('step')} id="step-2" aria-labelledby="s2-title">
            <div className={s('step-head')}>
              <h2 className={s('step-title')} id="s2-title">Build the Job Description Input Page</h2>
              <button
                className={s('coll-btn')}
                aria-expanded={!collapsed['step-2']}
                aria-label="Collapse section"
                onClick={() => toggleCollapse('step-2')}
              >
                {collapsed['step-2'] ? '∨' : '∧'}
              </button>
            </div>

            {!collapsed['step-2'] && (
              <>
                <div className={s('prose')}>
                  <p>Right now, your app shows the default Next.js welcome page. To turn it into an interview coach, you need a custom interface where users paste a job description and kick off the AI analysis.</p>
                  <p>This is where vibe coding shines. Instead of writing every line yourself, you&apos;ll describe what you want to Cursor and let it generate the UI for you.</p>
                </div>

                <div className={s('cl')} role="group" aria-label="Step checklist">
                  <div className={s('cl-lbl')}>In this step, get ready to:</div>
                  <CheckItem checked={checks["s2-0"] ?? false} onToggle={toggleCheck} id="s2-0">Prompt Cursor to replace the default page with a JD input form.</CheckItem>
                  <CheckItem checked={checks["s2-1"] ?? false} onToggle={toggleCheck} id="s2-1">Review the generated code for correct state management.</CheckItem>
                  <CheckItem checked={checks["s2-2"] ?? false} onToggle={toggleCheck} id="s2-2">Add a loading spinner for processing feedback.</CheckItem>
                </div>

                <TaskBlock
                  id="t2" labelId="t2-lbl"
                  question="What are we doing in this step?"
                  placeholder="In this step, I'm building… so that I can…"
                  reflection={reflections['t2']}
                  onReflectionChange={val => setReflections(prev => ({ ...prev, t2: val }))}
                  recording={recording} processing={processing} onStartVoice={startVoice}
                  saved={!!saved['t2']}
                  onSave={() => setSaved(prev => ({ ...prev, t2: true }))}
                  imageKey="ss2" uploadedImages={uploadedImages} onUpload={triggerUpload}
                  modes={['write', 'voice', 'upload', 'combine']} recommended="combine"
                  className={s('mt-24')}
                />
                <div className={s('refl-actions')}>
                  <button className={s('btn-view-work')} onClick={() => setDocOpen(true)} type="button">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    View My Work
                  </button>
                  {doLater['t2'] ? (
                    <span className={s('later-note')}>↩ Marked to revisit later.</span>
                  ) : (
                    <button className={s('btn-later')} onClick={() => setDoLater(prev => ({ ...prev, t2: true }))} type="button">Do it later →</button>
                  )}
                </div>

                <div className={s('actions')}>
                  <button className={s('btn-tasks')}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                    Tasks still to complete
                  </button>
                  <button className={s('btn-ret')}>↩ Return to later</button>
                </div>
              </>
            )}
          </section>

          <div className={s('divider')} />

          {/* ═══ SECRET MISSION ═══ */}
          <div className={s('step-sep')} aria-hidden="true">
            <div className={s('sep-line')} /><span className={s('sep-lbl')}>Secret Mission</span><div className={s('sep-line')} />
          </div>

          <section className={s('step')} id="secret" aria-labelledby="sec-title">
            <div className={s('step-head')}>
              <h2 className={s('step-title')} id="sec-title">Add Session History</h2>
              <button
                className={s('coll-btn')}
                aria-expanded={!collapsed['secret']}
                aria-label="Collapse section"
                onClick={() => toggleCollapse('secret')}
              >
                {collapsed['secret'] ? '∨' : '∧'}
              </button>
            </div>

            {!collapsed['secret'] && (
              <>
                <div className={s('prose')}>
                  <p>Your interview coach works great for a single session. But real improvement happens over time. Can you build a session history feature that tracks your practice attempts and shows your progress across sessions?</p>
                </div>
                <div className={s('secret-card')}>
                  <div className={s('s-lock')} aria-hidden="true">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                  <div className={s('s-title')}>Secret Mission</div>
                  <p className={s('s-text')}>Ready for a challenge? Secret Missions are for students looking to showcase more advanced skills.</p>
                  <button className={s('s-btn')}>Jump in!</button>
                </div>
              </>
            )}
          </section>

          <div className={s('divider')} />

          {/* ═══ BEFORE YOU GO ═══ */}
          <div className={s('step-sep')} aria-hidden="true">
            <div className={s('sep-line')} /><span className={s('sep-lbl')}>Before You Go</span><div className={s('sep-line')} />
          </div>

          <section className={s('step')} id="cleanup" aria-labelledby="cu-title">
            <div className={s('step-head')}>
              <h2 className={s('step-title')} id="cu-title">Clean Up Your Resources</h2>
              <button
                className={s('coll-btn')}
                aria-expanded={!collapsed['cleanup']}
                aria-label="Collapse section"
                onClick={() => toggleCollapse('cleanup')}
              >
                {collapsed['cleanup'] ? '∨' : '∧'}
              </button>
            </div>

            {!collapsed['cleanup'] && (
              <>
                <div className={s('prose')}>
                  <p>Decide whether to keep your resources running, pause them to come back later, or delete them entirely. This project runs entirely locally and uses the Groq free tier, so there are no ongoing costs.</p>
                </div>
                <div className={s('cleanup')} role="group" aria-label="Resource management options">
                  <button className={cx(s('cu-opt'), s('green'))}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                    Keep everything running
                  </button>
                  <button className={cx(s('cu-opt'), s('amber'))}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                    Pause — I&apos;ll come back later
                  </button>
                  <button className={cx(s('cu-opt'), s('red'))}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                    Delete — I&apos;m done with this
                  </button>
                </div>
              </>
            )}
          </section>

          {/* ═══ MISSION ACCOMPLISHED ═══ */}
          <section className={s('mission')} id="mission" aria-labelledby="mission-title">
            <div className={s('mission-sep')}>
              <div className={s('sep-line')} />
              <span className={s('mission-lbl')}>Mission Accomplished</span>
              <div className={s('sep-line')} />
            </div>
            <h2 className={s('mission-title')} id="mission-title">Nice Work!</h2>
            <div className={s('prose')}>
              <p>You just vibe coded a full AI-powered interview prep tool from scratch. From a blank terminal to a working product design coach, you built the entire thing through Cursor prompts and smart system prompt design.</p>
              <p><strong>You learned how to:</strong></p>
              <ul>
                <li>Built a Next.js app entirely through Cursor prompts, using vibe coding to ship a full-stack application without writing boilerplate by hand.</li>
                <li>Created three distinct <strong>system prompts</strong> (JD analyzer, question generator, answer evaluator) that chain together to produce tailored, actionable interview feedback.</li>
                <li>Integrated the Groq API for fast, free LLM inference using the OpenAI-compatible SDK pattern that transfers to any provider.</li>
                <li><strong>Secret Mission:</strong> Added session history with progress tracking to see yourself improve over time.</li>
              </ul>
              <p style={{ marginTop: '10px' }}>Ready to quiz yourself?</p>
            </div>

            <div className={s('quiz')} role="complementary" aria-label="Quiz">
              <div className={s('quiz-grid')} aria-hidden="true" />
              <div className={s('quiz-in')}>
                <div className={s('quiz-badge')}>PRO</div>
                <div className={s('quiz-title')}>AI Interview Coach Quiz</div>
                <div className={s('quiz-meta')}>
                  <div className={s('quiz-mi')}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                    6 questions
                  </div>
                  <div className={s('quiz-mi')}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                    3 minutes
                  </div>
                </div>
                <div className={s('quiz-desc')}>Test your knowledge of building an AI-powered product design interview coach.</div>
                <button className={s('quiz-btn')}>Take the quiz</button>
              </div>
            </div>

            <div className={cx(s('actions'), s('mt-16'))}>
              <button className={s('btn-tasks')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                Still tasks to complete
              </button>
            </div>
          </section>

        </main>

        {/* ═══════════ SIDEBAR ═══════════ */}
        <nav className={s('sidebar')} aria-label="Project steps">
          <a href="#step-0" className={cx(s('sb-step'), activeSection === 'step-0' && s('cur'))} aria-current={activeSection === 'step-0' ? 'step' : undefined}>
            <div className={cx(s('sb-icon'), s('done'))} aria-label="Completed">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <span className={s('sb-text')}>Step #0: Before We Start</span>
          </a>
          <div className={s('sb-sub')}>
            <div className={cx(s('sub-dot'), s('done'))} aria-label="Done">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            Task done!
          </div>

          <a href="#step-1" className={cx(s('sb-step'), activeSection === 'step-1' && s('cur'))} aria-current={activeSection === 'step-1' ? 'step' : undefined}>
            <div className={cx(s('sb-icon'), s('done'))} aria-label="Completed">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <span className={s('sb-text')}>Step #1: Scaffold the Project in Cursor</span>
          </a>
          <div className={s('sb-sub')}>
            <div className={cx(s('sub-dot'), s('done'))} aria-label="Done">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            Task done!
          </div>
          <div className={s('sb-sub')}>
            <div className={cx(s('sub-dot'), s('ring'))} aria-label="In review" />
            Task in-review
          </div>

          <a href="#step-2" className={cx(s('sb-step'), activeSection === 'step-2' && s('cur'))} aria-current={activeSection === 'step-2' ? 'step' : undefined}>
            <div className={cx(s('sb-icon'), s('todo'))} aria-label="Not started" />
            <span className={s('sb-text')}>Step #2: Build the Job Description Input Page</span>
          </a>
          <a href="#" className={s('sb-step')}>
            <div className={cx(s('sb-icon'), s('todo'))} aria-label="Not started" />
            <span className={s('sb-text')}>Step #3: Create the JD Analyzer API</span>
          </a>
          <a href="#" className={s('sb-step')}>
            <div className={cx(s('sb-icon'), s('todo'))} aria-label="Not started" />
            <span className={s('sb-text')}>Step #4: Build the Question Generator</span>
          </a>
          <a href="#" className={s('sb-step')}>
            <div className={cx(s('sb-icon'), s('todo'))} aria-label="Not started" />
            <span className={s('sb-text')}>Step #5: Build the Practice and Feedback Flow</span>
          </a>
          <a href="#secret" className={cx(s('sb-step'), activeSection === 'secret' && s('cur'))} aria-current={activeSection === 'secret' ? 'step' : undefined}>
            <div className={cx(s('sb-icon'), s('todo'))} aria-label="Not started" />
            <span className={s('sb-text')}>Secret Mission: Add Session History</span>
          </a>
          <a href="#cleanup" className={cx(s('sb-step'), activeSection === 'cleanup' && s('cur'))} aria-current={activeSection === 'cleanup' ? 'step' : undefined}>
            <div className={cx(s('sb-icon'), s('todo'))} aria-label="Not started" />
            <span className={s('sb-text')}>Before you go: Clean Up Your Resources</span>
          </a>
        </nav>
      </div>

      {/* ═══════════ BOTTOM NAV — floating pill ═══════════ */}
      <nav className={s('bottom-nav')} aria-label="Site navigation">
        <div className={s('bn-inner')}>
          {/* NextWork logo button */}
          <button className={s('bn-logo')} type="button" aria-label="NextWork home">
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <circle cx="16" cy="16" r="13.5" stroke="rgba(255,255,255,0.9)" strokeWidth="1.4" fill="none"/>
              <line x1="16" y1="16" x2="29.5" y2="16" stroke="rgba(255,255,255,0.9)" strokeWidth="1.15"/>
              <line x1="16" y1="16" x2="28"   y2="9.5"  stroke="rgba(255,255,255,0.9)" strokeWidth="1.15"/>
              <line x1="16" y1="16" x2="24"   y2="4"    stroke="rgba(255,255,255,0.9)" strokeWidth="1.15"/>
              <line x1="16" y1="16" x2="28"   y2="22.5" stroke="rgba(255,255,255,0.9)" strokeWidth="1.15"/>
              <line x1="16" y1="16" x2="24"   y2="28"   stroke="rgba(255,255,255,0.9)" strokeWidth="1.15"/>
              <line x1="16" y1="16" x2="2.5"  y2="16"   stroke="rgba(255,255,255,0.9)" strokeWidth="1.15"/>
            </svg>
          </button>

          <div className={s('bn-sep')} aria-hidden="true" />

          <button className={s('bn-btn')} type="button">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Ask
          </button>
          <button className={s('bn-btn')} type="button" onClick={() => setDocOpen(true)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Documentation
          </button>
          <button className={s('bn-btn')} type="button">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            Your Library
          </button>
        </div>
      </nav>

      {/* Chat FAB — bottom-right corner */}
      <button className={s('chat-fab')} type="button" aria-label="Open chat">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      </button>

      {/* ═══ DOCUMENTATION PANEL ═══ */}
      {docOpen && (
        <>
          {!docExpanded && (
            <div
              className={s('dp-overlay')}
              onClick={() => { setDocOpen(false); setDocExpanded(false) }}
              aria-hidden="true"
            />
          )}
          <div className={cx(s('dp'), s(`dp-${docTheme}`), docExpanded && s('dp-full'))}>
            <div className={s('dp-grid-bg')} aria-hidden="true" />

            {/* controls */}
            <div className={s('dp-controls')}>
              <button
                className={s('dp-ctrl-btn')}
                onClick={() => setDocExpanded(p => !p)}
                aria-label={docExpanded ? 'Collapse' : 'Expand'}
                title={docExpanded ? 'Collapse' : 'Expand'}
              >
                {docExpanded
                  ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/></svg>
                  : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>
                }
              </button>
              <button
                className={s('dp-ctrl-btn')}
                onClick={() => { setDocOpen(false); setDocExpanded(false) }}
                aria-label="Close"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {/* scrollable content */}
            <div className={s('dp-scroll')}>
              {/* cover */}
              <div className={s('dp-cover')}>
                <div className={s('dp-logo-wrap')}>
                  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                    <circle cx="16" cy="16" r="13.5" stroke="currentColor" strokeWidth="1.4" fill="none"/>
                    <line x1="16" y1="16" x2="29.5" y2="16" stroke="currentColor" strokeWidth="1.15"/>
                    <line x1="16" y1="16" x2="28"   y2="9.5"  stroke="currentColor" strokeWidth="1.15"/>
                    <line x1="16" y1="16" x2="24"   y2="4"    stroke="currentColor" strokeWidth="1.15"/>
                    <line x1="16" y1="16" x2="28"   y2="22.5" stroke="currentColor" strokeWidth="1.15"/>
                    <line x1="16" y1="16" x2="24"   y2="28"   stroke="currentColor" strokeWidth="1.15"/>
                    <line x1="16" y1="16" x2="2.5"  y2="16"   stroke="currentColor" strokeWidth="1.15"/>
                  </svg>
                </div>
                <h1 className={s('dp-title')}>BUILD A PRODUCT DESIGN INTERVIEW COACH</h1>
                <p className={s('dp-meta')}>By <strong>sakshi 31 rane</strong> | May 2026</p>
                <button className={s('dp-share-btn')}>Share Work ↗</button>
              </div>

              {/* Section content — conditional by theme */}
              {docTheme !== 'bento' ? (
                <>
                  <div className={s('dp-divider')} />
                  <div className={s('dp-sections')}>
                    {[
                      { title: 'Building an AI-Powered Interview Coach', desc: 'In this project, I\'m building… so that I can…' },
                      { title: 'Project vision and goals', desc: 'In this project, I\'m building… so that I can…' },
                      { title: 'Setting up the development environment', desc: 'In this step, I\'m setting up… so that I can…' },
                      { title: 'Scaffolding the Next.js App', desc: '' },
                      { title: 'Engineering the JD Analyzer with Custom Prompts', desc: '' },
                      { title: 'Crafting a targeted system prompt', desc: 'The system prompt tells the LLM to…' },
                      { title: 'Generating Tailored Interview Questions', desc: '' },
                      { title: 'Building the question generator', desc: 'In this step, I\'m building… so that I can…' },
                    ].map((sec, i, arr) => (
                      <div key={i} className={s('dp-sec')}>
                        <h2 className={s('dp-sec-title')}>{sec.title}</h2>
                        {sec.desc && <p className={s('dp-sec-desc')}>{sec.desc}</p>}
                        {i < arr.length - 1 && <div className={s('dp-sec-divider')} />}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
              <div className={s('dp-bento-wrap')}>

                {/* Stats row */}
                <div className={s('dp-bst-row')}>
                  <div className={s('dp-bst')}>
                    <div className={s('dp-bst-num')}>3</div>
                    <div className={s('dp-bst-lbl')}>Steps Completed</div>
                  </div>
                  <div className={cx(s('dp-bst'), s('hl'))}>
                    <div className={s('dp-bst-num')}>3×</div>
                    <div className={s('dp-bst-lbl')}>Faster Prep Time</div>
                  </div>
                  <div className={s('dp-bst')}>
                    <div className={s('dp-bst-num')}>AI</div>
                    <div className={s('dp-bst-lbl')}>Powered Feedback</div>
                  </div>
                  <div className={s('dp-bst')}>
                    <div className={s('dp-bst-num')}>∞</div>
                    <div className={s('dp-bst-lbl')}>Questions Generated</div>
                  </div>
                </div>

                {/* Bento card grid */}
                <div className={s('dp-card-grid')}>

                  {/* 01 — project overview */}
                  <div className={s('dp-bc')}>
                    <div className={s('dp-bc-num')}>01 —</div>
                    <h2 className={s('dp-bc-title')}>Building an AI-Powered Interview Coach</h2>
                    {saved['t0'] && reflections['t0']
                      ? <p className={s('dp-bc-refl')}>{reflections['t0']}</p>
                      : <p className={s('dp-bc-empty')}>Your reflection will appear here once saved.</p>
                    }
                    <div className={s('dp-bc-tags')}>
                      <span className={s('dp-bc-tag')}>AI</span>
                      <span className={s('dp-bc-tag')}>Product Design</span>
                      <span className={s('dp-bc-tag')}>Interview Prep</span>
                    </div>
                  </div>

                  {/* 02 — vision (dark) */}
                  <div className={cx(s('dp-bc'), s('dp-bc-dark'))}>
                    <div className={s('dp-bc-num')}>02 —</div>
                    <h2 className={s('dp-bc-title')}>Project Vision and Goals</h2>
                    <p className={s('dp-bc-desc')}>Build a personalized, end-to-end interview coach that understands your target role, generates tailored questions, and helps you improve with confidence.</p>
                    <div className={s('dp-bc-tags')}>
                      <span className={s('dp-bc-tag')}>Personalization</span>
                      <span className={s('dp-bc-tag')}>Clarity</span>
                      <span className={s('dp-bc-tag')}>Feedback</span>
                      <span className={s('dp-bc-tag')}>Growth</span>
                    </div>
                  </div>

                  {/* 03 — scaffold step */}
                  <div className={s('dp-bc')}>
                    <div className={s('dp-bc-num')}>03 —</div>
                    <h2 className={s('dp-bc-title')}>Scaffold the Project in Cursor</h2>
                    {saved['t1'] && reflections['t1']
                      ? <p className={s('dp-bc-refl')}>{reflections['t1']}</p>
                      : <p className={s('dp-bc-empty')}>Your reflection will appear here once saved.</p>
                    }
                    {uploadedImages['ss1'] && (
                      <div className={s('dp-bc-img-wrap')}>
                        <Image width={1200} height={800} src={uploadedImages['ss1'].url} alt={uploadedImages['ss1'].name} className={s('dp-bc-img')} />
                      </div>
                    )}
                    <div className={s('dp-bc-tags')}>
                      <span className={s('dp-bc-tag')}>Next.js</span>
                      <span className={s('dp-bc-tag')}>TypeScript</span>
                      <span className={s('dp-bc-tag')}>Cursor</span>
                    </div>
                  </div>

                  {/* 04 — input page (dark) */}
                  <div className={cx(s('dp-bc'), s('dp-bc-dark'))}>
                    <div className={s('dp-bc-num')}>04 —</div>
                    <h2 className={s('dp-bc-title')}>Build the Job Description Input Page</h2>
                    {saved['t2'] && reflections['t2']
                      ? <p className={s('dp-bc-refl')}>{reflections['t2']}</p>
                      : <p className={s('dp-bc-empty')}>Your reflection will appear here once saved.</p>
                    }
                    {uploadedImages['ss2'] && (
                      <div className={s('dp-bc-img-wrap')}>
                        <Image width={1200} height={800} src={uploadedImages['ss2'].url} alt={uploadedImages['ss2'].name} className={s('dp-bc-img')} />
                      </div>
                    )}
                    <div className={s('dp-bc-tags')}>
                      <span className={s('dp-bc-tag')}>UI Design</span>
                      <span className={s('dp-bc-tag')}>Vibe Coding</span>
                      <span className={s('dp-bc-tag')}>React</span>
                    </div>
                  </div>

                  {/* Footer — full width dark */}
                  <div className={cx(s('dp-bc'), s('dp-bc-dark'), s('dp-bc-full'))}>
                    <div className={s('dp-bc-footer-inner')}>
                      <div>
                        <div className={s('dp-bc-tagline')}>A smarter way to prepare.</div>
                        <p className={s('dp-bc-footer-sub')}>Built with AI. Designed for designers. Focused on outcomes.</p>
                        <button className={s('dp-bc-footer-cta')} type="button">
                          Continue the journey
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><polyline points="12 5 19 12 12 19"/></svg>
                        </button>
                      </div>
                      <div className={s('dp-bc-meta')}>
                        <div className={s('dp-bc-meta-row')}>
                          <span className={s('dp-bc-meta-k')}>Author</span>
                          <span className={s('dp-bc-meta-v')}>Sakshi Rane</span>
                        </div>
                        <div className={s('dp-bc-meta-row')}>
                          <span className={s('dp-bc-meta-k')}>Date</span>
                          <span className={s('dp-bc-meta-v')}>May 2026</span>
                        </div>
                        <div className={s('dp-bc-meta-row')}>
                          <span className={s('dp-bc-meta-k')}>Stack</span>
                          <span className={s('dp-bc-meta-v')}>Next.js · TypeScript · Groq</span>
                        </div>
                        <div className={s('dp-bc-meta-row')}>
                          <span className={s('dp-bc-meta-k')}>Focus</span>
                          <span className={s('dp-bc-meta-v')}>AI · Product Design · Interview</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
              )}
            </div>

            {/* bottom nav */}
            <div className={s('dp-nav-wrap')}>
              {docThemeOpen && (
                <div className={s('dp-theme-popup')} ref={docThemeRef}>
                  <div className={s('dp-theme-label')}>DOCUMENTATION THEME</div>
                  {(['light', 'dark', 'fun', 'bento'] as const).map(t => (
                    <label key={t} className={cx(s('dp-theme-opt'), docTheme === t && s('dp-theme-opt-on'))}>
                      <span className={cx(s('dp-radio'), docTheme === t && s('dp-radio-on'))} />
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                      <input
                        type="radio" name="dp-theme" value={t}
                        checked={docTheme === t}
                        onChange={() => { setDocTheme(t); setDocThemeOpen(false) }}
                        style={{ display: 'none' }}
                      />
                    </label>
                  ))}
                </div>
              )}
              <div className={s('dp-nav-pill')}>
                <div className={s('dp-nav-logo')} aria-label="NextWork">
                  <svg width="18" height="18" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                    <circle cx="16" cy="16" r="13.5" stroke="currentColor" strokeWidth="1.4" fill="none"/>
                    <line x1="16" y1="16" x2="29.5" y2="16" stroke="currentColor" strokeWidth="1.15"/>
                    <line x1="16" y1="16" x2="28"   y2="9.5"  stroke="currentColor" strokeWidth="1.15"/>
                    <line x1="16" y1="16" x2="24"   y2="4"    stroke="currentColor" strokeWidth="1.15"/>
                    <line x1="16" y1="16" x2="28"   y2="22.5" stroke="currentColor" strokeWidth="1.15"/>
                    <line x1="16" y1="16" x2="24"   y2="28"   stroke="currentColor" strokeWidth="1.15"/>
                    <line x1="16" y1="16" x2="2.5"  y2="16"   stroke="currentColor" strokeWidth="1.15"/>
                  </svg>
                </div>
                <div className={s('dp-nav-sep')} />
                <button className={s('dp-nav-btn')} onClick={() => setDocThemeOpen(p => !p)} type="button">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 0-14.14 0"/><path d="M4.93 19.07a10 10 0 0 0 14.14 0"/></svg>
                  Theme
                </button>
                <div className={s('dp-nav-sep')} />
                <button className={s('dp-nav-btn')} type="button">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                  Share on LinkedIn
                </button>
                <div className={s('dp-nav-sep')} />
                <button className={s('dp-nav-btn')} type="button">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                  Share
                </button>
                <div className={s('dp-nav-sep')} />
                <button className={s('dp-nav-avatar')} aria-label="sakshi 31 rane" type="button">S</button>
              </div>
            </div>
          </div>
        </>
      )}

      <input
        type="file"
        accept="image/png,image/jpeg,image/gif,image/webp"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={onFileChange}
      />
    </div>
  )
}
