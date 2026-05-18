'use client'

import { useState, useEffect, useRef } from 'react'
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
  <span class="${s('tv')}">title</span><span class="${s('tp')}">:</span> <span class="${s('ts')}">"Product Design Interview Coach"</span><span class="${s('tp')}">;</span>
  <span class="${s('tv')}">description</span><span class="${s('tp')}">:</span> <span class="${s('ts')}">"AI-powered interview prep tailored to specific job descriptions"</span><span class="${s('tp')}">;</span>
<span class="${s('tp')}">};</span>

<span class="${s('tk')}">export</span> <span class="${s('tk')}">default</span> <span class="${s('tk')}">function</span> <span class="${s('tf')}">RootLayout</span><span class="${s('tp')}">({</span>
  <span class="${s('tv')}">children</span><span class="${s('tp')}">;</span>
<span class="${s('tp')}">}:</span> <span class="${s('tt')}">Readonly</span><span class="${s('tp')}">&lt;{</span>
  <span class="${s('tv')}">children</span><span class="${s('tp')}">:</span> <span class="${s('tt')}">React.ReactNode</span><span class="${s('tp')}">;</span>
<span class="${s('tp')}">&gt;)</span> <span class="${s('tp')}">&#123;</span>
  <span class="${s('tk')}">return</span> <span class="${s('tp')}">&#40;</span>
    <span class="${s('tp')}">&lt;</span><span class="${s('tf')}">html</span> <span class="${s('tv')}">lang</span><span class="${s('tp')}">=</span><span class="${s('ts')}">"en"</span><span class="${s('tp')}">&gt;</span>
      <span class="${s('tp')}">&lt;</span><span class="${s('tf')}">body</span> <span class="${s('tv')}">className</span><span class="${s('tp')}">=</span><span class="${s('ts')}">"antialiased"</span><span class="${s('tp')}">&gt;&#123;</span><span class="${s('tv')}">children</span><span class="${s('tp')}">&#125;&lt;/</span><span class="${s('tf')}">body</span><span class="${s('tp')}">&gt;</span>
    <span class="${s('tp')}">&lt;/</span><span class="${s('tf')}">html</span><span class="${s('tp')}">&gt;</span>
  <span class="${s('tp')}">&#41;;</span>
<span class="${s('tp')}">}</span>`

function TaskBlock({
  id, labelId, question, placeholder,
  reflection, onReflectionChange,
  recording, processing, onStartVoice,
  saved, onSave, className,
}: {
  id: string; labelId: string; question: string; placeholder: string
  reflection: string; onReflectionChange: (val: string) => void
  recording: string | null; processing: string | null; onStartVoice: (id: string) => void
  saved: boolean; onSave: () => void; className?: string
}) {
  return (
    <div className={cx(s('task-block'), className)} role="group" aria-labelledby={labelId}>
      <div className={s('task-head')}>
        <div className={s('task-t')} id={labelId}>{question}</div>
        <VoiceMicButton id={id} recording={recording} processing={processing} onStart={onStartVoice} />
      </div>
      <textarea
        className={s('task-ta')}
        placeholder={placeholder}
        aria-label="Reflection"
        rows={4}
        value={reflection}
        onChange={e => onReflectionChange(e.target.value)}
      />
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

  // Active tab index per tab-row (keyed by row id)
  const [activeTab, setActiveTab] = useState<Record<string, number>>({ tr1: 0 })

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
  const recognitionRef = useRef<any>(null)

  // Reflection save state and work panel
  const [saved, setSaved] = useState<Record<string, boolean>>({})
  const [doLater, setDoLater] = useState<Record<string, boolean>>({})
  const [workPanelOpen, setWorkPanelOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark' | 'fun'>('light')
  const [themeOpen, setThemeOpen] = useState(false)
  const [actExpanded, setActExpanded] = useState<Record<string, boolean>>({})

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

  async function startVoice(id: string) {
    if (recording === id) {
      recognitionRef.current?.stop()
      setRecording(null)
      return
    }

    const SR = (typeof window !== 'undefined') &&
      ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
    if (!SR) {
      alert('Voice input requires Chrome or Edge.')
      return
    }

    const rec = new SR()
    rec.lang = 'en-US'
    rec.interimResults = false
    rec.maxAlternatives = 1

    rec.onresult = async (event: any) => {
      const transcript: string = event.results[0][0].transcript
      setRecording(null)
      setProcessing(id)
      try {
        const res = await fetch('/api/rewrite', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transcript }),
        })
        const data = await res.json()
        setReflections(prev => ({ ...prev, [id]: data.text ?? transcript }))
      } catch {
        setReflections(prev => ({ ...prev, [id]: transcript }))
      } finally {
        setProcessing(null)
      }
    }

    rec.onerror = () => setRecording(null)
    rec.onend = () => setRecording(null)

    recognitionRef.current = rec
    rec.start()
    setRecording(id)
  }

  // Reusable checkbox item
  function CheckItem({ id, children }: { id: string; children: React.ReactNode }) {
    const checked = checks[id] ?? false
    return (
      <div
        className={cx(s('cl-item'), checked && s('done'))}
        role="checkbox"
        aria-checked={checked}
        tabIndex={0}
        onClick={() => toggleCheck(id)}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleCheck(id) } }}
      >
        <div className={cx(s('cl-box'), checked && s('on'))}>{checked ? '✓' : ''}</div>
        {children}
      </div>
    )
  }

  // Reusable code block
  function CodeBlock({
    lang, file, copyKey, copyText, html,
    showExpand = true, showNewTab = false,
  }: {
    lang?: string; file?: string; copyKey: string; copyText: string; html: string;
    showExpand?: boolean; showNewTab?: boolean;
  }) {
    return (
      <div className={s('code')} role="region">
        <div className={s('code-hd')}>
          <div className={s('code-hd-l')}>
            {file && <span className={s('code-file')}>{file}</span>}
            {lang && <span className={s('code-lang')}>{lang}</span>}
          </div>
          <div className={s('code-acts')}>
            {showExpand && <button className={s('code-btn')} aria-label="Expand">⛶</button>}
            {showNewTab && <button className={s('code-btn')} aria-label="Copy in new tab">⧉</button>}
            <button
              className={s('code-btn')}
              aria-label="Copy"
              onClick={() => copyCode(copyKey, copyText)}
            >
              {copied[copyKey] ? '✓' : '⎘'}
            </button>
          </div>
        </div>
        <div className={s('code-bd')} dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    )
  }

  return (
    <div className={cx(styles.root, baskerville.variable, dmMono.variable)}>
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
            <div className={s('beta-t')}>🏗️ Whoa! Welcome to our new beta feature!</div>
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
              <div className={s('prereq-t')}>💡 Are there any prerequisites?</div>
              <p className={s('prereq-b')}>You should be comfortable using an IDE and familiar with web development concepts like HTML, CSS, and JavaScript. No prior experience with AI APIs or Next.js is required.</p>
            </div>
          </section>

          <div className={s('divider')} />

          {/* ═══ STEP 0 ═══ */}
          <div className={s('step-sep')} aria-hidden="true">
            <div className={s('sep-line')} /><span className={s('sep-lbl')}>·· Step #0</span><div className={s('sep-line')} />
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
                  question="✏️ What are we doing in this project?"
                  placeholder="In this project, I'm building… so that I can…"
                  reflection={reflections['t0']}
                  onReflectionChange={val => setReflections(prev => ({ ...prev, t0: val }))}
                  recording={recording} processing={processing} onStartVoice={startVoice}
                  saved={!!saved['t0']}
                  onSave={() => setSaved(prev => ({ ...prev, t0: true }))}
                />
                <div className={s('refl-actions')}>
                  <button className={s('btn-view-work')} onClick={() => setWorkPanelOpen(true)} type="button">✓ View My Work</button>
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
            <div className={s('sep-line')} /><span className={s('sep-lbl')}>🔨 Step #1</span><div className={s('sep-line')} />
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
                  <CheckItem id="s1-0">Scaffold a Next.js project with TypeScript and Tailwind.</CheckItem>
                  <CheckItem id="s1-1">Install the Groq-compatible SDK and configure your API key.</CheckItem>
                  <CheckItem id="s1-2">Start the development server and confirm everything works.</CheckItem>
                </div>

                <TaskBlock
                  id="t1" labelId="t1-lbl"
                  question="✏️ What are we doing in this step?"
                  placeholder="In this step, I'm building… so that I can…"
                  reflection={reflections['t1']}
                  onReflectionChange={val => setReflections(prev => ({ ...prev, t1: val }))}
                  recording={recording} processing={processing} onStartVoice={startVoice}
                  saved={!!saved['t1']}
                  onSave={() => setSaved(prev => ({ ...prev, t1: true }))}
                  className={s('mt-24')}
                />
                <div className={s('refl-actions')}>
                  <button className={s('btn-view-work')} onClick={() => setWorkPanelOpen(true)} type="button">✓ View My Work</button>
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

                <CodeBlock lang="bash" copyKey="cd" copyText="cd ~/Desktop" html={CODE_CD} />

                <div className={cx(s('prose'), s('mt-16'))}>
                  <ul><li>Create your project by running this command:</li></ul>
                </div>

                <CodeBlock
                  lang="bash"
                  copyKey="npx"
                  copyText="npx create-next-app@latest design-interview-coach --yes"
                  html={CODE_NPX}
                />

                <div className={cx(s('callout'), s('y'), s('mt-16'))} role="note">
                  <span className={s('co-icon')} aria-hidden="true">💡</span>
                  <div>
                    <div className={s('co-t')}>What does this command do?</div>
                    <div className={s('co-b')}><span className={s('ic')}>npx create-next-app@latest</span> downloads and runs the latest version of the Next.js scaffolding tool. <span className={s('ic')}>design-interview-coach</span> is the name of the folder it creates. The <span className={s('ic')}>--yes</span> flag accepts all defaults: TypeScript, ESLint, Tailwind CSS, App Router, and Turbopack.</div>
                  </div>
                </div>

                <div className={cx(s('callout'), s('r'))} role="alert">
                  <span className={s('co-icon')} aria-hidden="true">🤖</span>
                  <div>
                    <div className={s('co-t')}>Command not found?</div>
                    <div className={s('co-b')}>If you see an error when running <span className={s('ic')}>npx</span>, confirm Node.js is installed by running <span className={s('ic')}>node --version</span>. You need Node.js 20.9 or higher for Next.js.</div>
                    <div className={s('co-lnk')}>↩ help me fix a Node.js or npx error when scaffolding a Next.js project</div>
                  </div>
                </div>

                <div className={s('sub-h')}>Configure your layout file</div>

                <CodeBlock
                  file="app/layout.tsx"
                  lang="typescript"
                  copyKey="layout"
                  copyText={`import type { Metadata } from "next";\nimport "./globals.css";\n\nexport const metadata: Metadata = {\n  title: "Product Design Interview Coach",\n  description: "AI-powered interview prep tailored to specific job descriptions",\n};\n\nexport default function RootLayout({\n  children,\n}: Readonly<{\n  children: React.ReactNode;\n}>) {\n  return (\n    <html lang="en">\n      <body className="antialiased">{children}</body>\n    </html>\n  );\n}`}
                  html={CODE_LAYOUT}
                  showExpand
                  showNewTab
                />

                <div className={s('tab-row')} role="tablist" aria-label="Code verification options">
                  {['✓ Awesome, I\'ve got everything!', '⊗ I\'d like to double check the full code'].map((label, i) => (
                    <button
                      key={i}
                      className={cx(s('tab-btn'), activeTab['tr1'] === i && s('on'))}
                      role="tab"
                      aria-selected={activeTab['tr1'] === i}
                      onClick={() => setActiveTab(prev => ({ ...prev, tr1: i }))}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className={cx(s('ss-block'), s('mt-24'))} role="group" aria-labelledby="ss1-title">
                  <div className={s('ss-head')}>
                    <div className={s('ss-title')} id="ss1-title">📸 Take a screenshot of your browser showing the default Next.js welcome page at localhost:3000.</div>
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
                      <div className={s('uz-icon')} aria-hidden="true">⬆</div>
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
                  <button className={s('btn-tasks')}>✓ Tasks still to complete</button>
                  <div className={s('review-note')} role="status">↩ Marked for review! Remember to mark this as complete once you revisit it.</div>
                </div>
              </>
            )}
          </section>

          <div className={s('divider')} />

          {/* ═══ STEP 2 ═══ */}
          <div className={s('step-sep')} aria-hidden="true">
            <div className={s('sep-line')} /><span className={s('sep-lbl')}>🔍 Step #2</span><div className={s('sep-line')} />
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
                  <CheckItem id="s2-0">Prompt Cursor to replace the default page with a JD input form.</CheckItem>
                  <CheckItem id="s2-1">Review the generated code for correct state management.</CheckItem>
                  <CheckItem id="s2-2">Add a loading spinner for processing feedback.</CheckItem>
                </div>

                <TaskBlock
                  id="t2" labelId="t2-lbl"
                  question="✏️ What are we doing in this step?"
                  placeholder="In this step, I'm building… so that I can…"
                  reflection={reflections['t2']}
                  onReflectionChange={val => setReflections(prev => ({ ...prev, t2: val }))}
                  recording={recording} processing={processing} onStartVoice={startVoice}
                  saved={!!saved['t2']}
                  onSave={() => setSaved(prev => ({ ...prev, t2: true }))}
                  className={s('mt-24')}
                />
                <div className={s('refl-actions')}>
                  <button className={s('btn-view-work')} onClick={() => setWorkPanelOpen(true)} type="button">✓ View My Work</button>
                  {doLater['t2'] ? (
                    <span className={s('later-note')}>↩ Marked to revisit later.</span>
                  ) : (
                    <button className={s('btn-later')} onClick={() => setDoLater(prev => ({ ...prev, t2: true }))} type="button">Do it later →</button>
                  )}
                </div>

                <div className={s('actions')}>
                  <button className={s('btn-tasks')}>✓ Tasks still to complete</button>
                  <button className={s('btn-ret')}>↩ Return to later</button>
                </div>
              </>
            )}
          </section>

          <div className={s('divider')} />

          {/* ═══ SECRET MISSION ═══ */}
          <div className={s('step-sep')} aria-hidden="true">
            <div className={s('sep-line')} /><span className={s('sep-lbl')}>🔐 Secret Mission</span><div className={s('sep-line')} />
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
                  <div className={s('s-lock')} aria-hidden="true">🔒</div>
                  <div className={s('s-title')}>🤫 Secret Mission</div>
                  <p className={s('s-text')}>Ready for a challenge? Secret Missions are for students looking to showcase more advanced skills.</p>
                  <button className={s('s-btn')}>Jump in!</button>
                </div>
              </>
            )}
          </section>

          <div className={s('divider')} />

          {/* ═══ BEFORE YOU GO ═══ */}
          <div className={s('step-sep')} aria-hidden="true">
            <div className={s('sep-line')} /><span className={s('sep-lbl')}>🗑 Before You Go</span><div className={s('sep-line')} />
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
                  <button className={cx(s('cu-opt'), s('green'))}>✓ Keep everything running</button>
                  <button className={cx(s('cu-opt'), s('amber'))}>⏸ Pause — I&apos;ll come back to this later</button>
                  <button className={cx(s('cu-opt'), s('red'))}>⊗ Delete — I don&apos;t want to use this again</button>
                </div>
              </>
            )}
          </section>

          {/* ═══ MISSION ACCOMPLISHED ═══ */}
          <section className={s('mission')} id="mission" aria-labelledby="mission-title">
            <div className={s('mission-sep')}>
              <div className={s('sep-line')} />
              <span className={s('mission-lbl')}>🚀 Mission Accomplished</span>
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
              <button className={s('btn-tasks')}>Still tasks to complete!</button>
            </div>
          </section>

        </main>

        {/* ═══════════ SIDEBAR ═══════════ */}
        <nav className={s('sidebar')} aria-label="Project steps">
          <a href="#step-0" className={cx(s('sb-step'), activeSection === 'step-0' && s('cur'))} aria-current={activeSection === 'step-0' ? 'step' : undefined}>
            <div className={cx(s('sb-icon'), s('done'))} aria-label="Completed">✓</div>
            <span className={s('sb-text')}>·· Step #0: Before We Start</span>
          </a>
          <div className={s('sb-sub')}><div className={cx(s('sub-dot'), s('done'))} aria-label="Done">✓</div>Task done!</div>

          <a href="#step-1" className={cx(s('sb-step'), activeSection === 'step-1' && s('cur'))}>
            <div className={cx(s('sb-icon'), s('done'))} aria-label="Completed">✓</div>
            <span className={s('sb-text')}>🔨 Step #1: Scaffold the Project in Curs…</span>
          </a>
          <div className={s('sb-sub')}><div className={cx(s('sub-dot'), s('done'))} aria-label="Done">✓</div>Task done!</div>
          <div className={s('sb-sub')}><div className={cx(s('sub-dot'), s('ring'))} aria-label="In review" />Task in-review</div>

          <a href="#step-2" className={cx(s('sb-step'), activeSection === 'step-2' && s('cur'))}>
            <div className={cx(s('sb-icon'), s('todo'))} aria-label="Not started" />
            <span className={s('sb-text')}>🔍 Step #2: Build the Job Description I…</span>
          </a>
          <a href="#" className={s('sb-step')}>
            <div className={cx(s('sb-icon'), s('todo'))} aria-label="Not started" />
            <span className={s('sb-text')}>✨ Step #3: Create the JD Analyzer API…</span>
          </a>
          <a href="#" className={s('sb-step')}>
            <div className={cx(s('sb-icon'), s('todo'))} aria-label="Not started" />
            <span className={s('sb-text')}>🎯 Step #4: Build the Question Generat…</span>
          </a>
          <a href="#" className={s('sb-step')}>
            <div className={cx(s('sb-icon'), s('todo'))} aria-label="Not started" />
            <span className={s('sb-text')}>🚀 Step #5: Build the Practice and Fee…</span>
          </a>
          <a href="#secret" className={cx(s('sb-step'), activeSection === 'secret' && s('cur'))}>
            <div className={cx(s('sb-icon'), s('todo'))} aria-label="Not started" />
            <span className={s('sb-text')}>🔐 Secret Mission: Add Session History</span>
          </a>
          <a href="#cleanup" className={cx(s('sb-step'), activeSection === 'cleanup' && s('cur'))}>
            <div className={cx(s('sb-icon'), s('todo'))} aria-label="Not started" />
            <span className={s('sb-text')}>🗑 Before you go: Clean Up Your Resou…</span>
          </a>
        </nav>
      </div>

      {/* ═══════════ BOTTOM NAV ═══════════ */}
      <nav className={s('bottom-nav')} aria-label="Site navigation">
        <div className={s('bn-inner')}>
          <div className={s('bn-left')}>
            <div className={s('bn-logo')} aria-label="NextWork">
              <svg width="26" height="26" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="NextWork logo">
                <circle cx="16" cy="16" r="13.5" stroke="#1B1918" strokeWidth="1.4" fill="none"/>
                <line x1="16" y1="16" x2="29.5" y2="16" stroke="#1B1918" strokeWidth="1.15"/>
                <line x1="16" y1="16" x2="28"   y2="9.5"  stroke="#1B1918" strokeWidth="1.15"/>
                <line x1="16" y1="16" x2="24"   y2="4"    stroke="#1B1918" strokeWidth="1.15"/>
                <line x1="16" y1="16" x2="28"   y2="22.5" stroke="#1B1918" strokeWidth="1.15"/>
                <line x1="16" y1="16" x2="24"   y2="28"   stroke="#1B1918" strokeWidth="1.15"/>
                <line x1="16" y1="16" x2="2.5"  y2="16"   stroke="#1B1918" strokeWidth="1.15"/>
              </svg>
            </div>
            <button className={s('bn-btn')}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              Ask
            </button>
            <button className={s('bn-btn')}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              Projects
            </button>
            <button className={s('bn-btn')}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              Documentation
            </button>
          </div>
          <div className={s('bn-right')}>
            <button className={s('bn-avatar')} aria-label="User profile — sakshi 31 rane">
              S
              <div className={s('bn-online')} aria-hidden="true" />
            </button>
          </div>
        </div>
      </nav>
    </div>
  )
}
