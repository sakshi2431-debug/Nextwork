'use client'

import { useState, useEffect, useRef } from 'react'
import { Instrument_Serif, DM_Sans } from 'next/font/google'
import {
  Palette, Sun, Moon, Sparkles, Share2, Check,
  ArrowRight, Zap, Link2,
} from 'lucide-react'
import styles from './page.module.css'

const serif = Instrument_Serif({
  subsets: ['latin'], weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-serif', display: 'swap',
})
const dmSans = DM_Sans({
  subsets: ['latin'], weight: ['300', '400', '500'],
  variable: '--font-sans', display: 'swap',
})

const s = (cls: string) => styles[cls] || ''
function cx(...args: (string | false | undefined | null)[]) {
  return args.filter(Boolean).join(' ')
}

// ── Card Components ────────────────────────────────────────────────────────────

function AppCard() {
  return (
    <div className={s('card-app')}>
      <div className={s('ca-icon')}>🎯</div>
      <h3 className={s('ca-title')}>Your AI Coach for<br/>Product Design Interviews</h3>
      <p className={s('ca-sub')}>Practice. Receive feedback. Get hired.</p>
      <button className={s('ca-btn')}>Start your journey <ArrowRight size={12}/></button>
    </div>
  )
}

function GoalsCard() {
  const goals = [
    'Understand the job description deeply',
    'Generate tailored interview questions',
    'Provide structured feedback',
    'Track progress over time',
  ]
  return (
    <div className={s('card-goals')}>
      <div className={s('cg-head')}>🎯 Project Goals</div>
      {goals.map(g => (
        <div key={g} className={s('cg-item')}>
          <Check size={14} className={s('cg-check')}/>{g}
        </div>
      ))}
    </div>
  )
}

function TerminalCard() {
  return (
    <div className={s('card-terminal')}>
      <div className={s('ct-bar')}>
        <div className={s('ct-dots')}>
          <span style={{ background: '#ff5f57' }}/>
          <span style={{ background: '#ffbc2e' }}/>
          <span style={{ background: '#28c840' }}/>
        </div>
        <span className={s('ct-status')}>Environment ready</span>
      </div>
      <div className={s('ct-body')}>
        {[['npx', ' create-next-app@latest pd-interview-coach'],
          ['cd', ' pd-interview-coach'],
          ['npm', ' install'],
          ['npm', ' run dev']].map(([cmd, arg], i) => (
          <div key={i} className={s('ct-line')}>
            <span className={s('ct-cmd')}>{cmd}</span>
            <span className={s('ct-arg')}>{arg}</span>
          </div>
        ))}
        <div className={s('ct-ok')}><Check size={11}/> Local: http://localhost:3000</div>
      </div>
    </div>
  )
}

function FileTreeCard() {
  return (
    <div className={s('card-filetree')}>
      <div className={s('cft-title')}>Project Explorer</div>
      <div className={s('cft-dir')}>▾ app</div>
      <div className={cx(s('cft-indent'), s('cft-dir'))}>▾ api</div>
      <div className={cx(s('cft-indent2'), s('cft-file'))}>analyze/route.ts</div>
      <div className={cx(s('cft-indent'), s('cft-dir'))}>▾ components</div>
      <div className={cx(s('cft-indent2'), s('cft-file'))}>Coach.tsx</div>
      <div className={cx(s('cft-indent'), s('cft-dir'))}>▾ lib</div>
      <div className={cx(s('cft-indent2'), s('cft-file'))}>prompts.ts</div>
      <div className={cx(s('cft-indent'), s('cft-file'))}>hooks/</div>
      <div className={cx(s('cft-indent'), s('cft-file'))}>types/</div>
      <div className={s('cft-file')}>.env.local</div>
      <div className={s('cft-file')}>README.md</div>
    </div>
  )
}

function AnalyzerCard() {
  return (
    <div className={s('card-analyzer')}>
      <div className={s('caz-header')}>
        <span className={s('caz-title')}>JD Analyzer <span className={s('caz-badge')}>AI</span></span>
        <span className={s('caz-complete')}><Check size={12}/> Analysis complete</span>
      </div>
      <div className={s('caz-grid')}>
        {[['⚡ Key Skills', 'Product Thinking, UX, Analytics…'],
          ['📋 Responsibilities', 'Define strategy, Ship features…'],
          ['🏢 Experience', '3+ years, B2B, SaaS…'],
          ['✨ Nice to have', 'Data-driven, AI tools…']].map(([label, val]) => (
          <div key={label} className={s('caz-item')}>
            <div className={s('caz-label')}>{label}</div>
            <div className={s('caz-val')}>{val}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PromptCard() {
  return (
    <div className={s('card-prompt')}>
      <div className={s('cp-label')}>⚙ System Prompt</div>
      <div className={s('cp-text')}>"You are an expert Product Design interviewer. Your goal is to generate thoughtful, relevant, and role-specific interview questions based on the provided job description, focusing on real-world problem solving and product thinking."</div>
      <div className={s('cp-tags')}>
        {['Role-aware', 'Structured', 'Context-rich'].map(t => (
          <span key={t} className={s('cp-tag')}>{t}</span>
        ))}
      </div>
    </div>
  )
}

function QuestionsCard() {
  return (
    <div className={s('card-questions')}>
      <div className={s('cq-label')}>✦ Sample Questions</div>
      {[['01', 'How would you improve the onboarding experience for a complex B2B SaaS product?'],
        ['02', 'Walk us through a design decision you made that had a significant impact.'],
        ['03', 'How do you balance user needs with business goals?']].map(([num, q]) => (
        <div key={num} className={s('cq-item')}>
          <span className={s('cq-num')}>{num}</span>
          <span>{q}</span>
        </div>
      ))}
    </div>
  )
}

function GeneratorCard() {
  return (
    <div className={s('card-gen')}>
      <div className={s('cgen-title')}>✦ Question Generator</div>
      <div className={s('cgen-row')}>
        <select className={s('cgen-select')}>
          <option>Difficulty: Medium</option>
          <option>Difficulty: Easy</option>
          <option>Difficulty: Hard</option>
        </select>
        <select className={s('cgen-select')}>
          <option>Category: Product Strategy</option>
          <option>Category: UX Design</option>
          <option>Category: Metrics</option>
        </select>
        <select className={s('cgen-select')} style={{ maxWidth: '90px' }}>
          <option>Count: 5</option>
          <option>Count: 3</option>
          <option>Count: 10</option>
        </select>
      </div>
      <button className={s('cgen-btn')}>Generate <Zap size={13}/></button>
    </div>
  )
}

// ── Section data ───────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: 's0', num: '01', title: 'Building an AI-Powered Interview Coach',
    desc: 'I set out to create a coach that helps product designers prepare smarter — not just with questions, but with guidance, feedback, and clarity at every step.',
    tags: ['AI', 'Product Design', 'Interview Prep', 'Personalized'], card: <AppCard/> },
  { id: 's1', num: '02', title: 'Project vision and goals', flip: true,
    desc: 'Build a personalized, end-to-end interview coach that understands your target role, generates tailored content, and helps you improve with confidence.',
    tags: ['Personalization', 'Clarity', 'Feedback', 'Growth'], card: <GoalsCard/> },
  { id: 's2', num: '03', title: 'Setting up the development environment',
    desc: 'I started by setting up a modern stack with Next.js, TypeScript, Tailwind CSS, and the tools needed to build fast and ship confidently.',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Vercel'], card: <TerminalCard/> },
  { id: 's3', num: '04', title: 'Scaffolding the Next.js App', flip: true,
    desc: 'A clean, scalable foundation makes everything that follows smoother. I scaffolded the app with a focus on modularity and developer experience.',
    tags: ['Scalability', 'Modularity', 'Best Practices', 'DX'], card: <FileTreeCard/> },
  { id: 's4', num: '05', title: 'Engineering the JD Analyzer with Custom Prompts',
    desc: 'I built an analyzer that extracts key skills, responsibilities, and expectations from a job description using LLMs and structured prompts.',
    tags: ['LLM', 'NLP', 'Prompt Engineering', 'Extraction'], card: <AnalyzerCard/> },
  { id: 's5', num: '06', title: 'Crafting a targeted system prompt', flip: true,
    desc: 'The right prompt sets the tone. I crafted a system prompt that guides the model to think like an interviewer and tailor questions to the role.',
    tags: ['Prompt Design', 'Instructions', 'Context', 'Quality'], card: <PromptCard/> },
  { id: 's6', num: '07', title: 'Generating Tailored Interview Questions',
    desc: 'With the JD insights and system prompt in place, the coach generates high-quality, relevant questions across a variety of product design scenarios.',
    tags: ['Question Generation', 'Coverage', 'Relevance', 'Diversity'], card: <QuestionsCard/> },
]

const STATS = [
  { num: '8', label: 'Core modules built' },
  { num: '3x', label: 'Faster prep time' },
  { num: 'AI', label: 'Powered feedback' },
  { num: '∞', label: 'Questions generated' },
]

const TOC_LABELS = ['Intro', 'Goals', 'Setup', 'Scaffold', 'JD Analyzer', 'Prompts', 'Questions', 'Generator']
const TOC_IDS = ['s0', 's1', 's2', 's3', 's4', 's5', 's6', 's7']

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ProjectPage() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'fun'>('light')
  const [themeOpen, setThemeOpen] = useState(false)
  const [activeSection, setActiveSection] = useState(0)
  const themeWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!themeOpen) return
    function onOutside(e: MouseEvent) {
      if (themeWrapRef.current && !themeWrapRef.current.contains(e.target as Node))
        setThemeOpen(false)
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [themeOpen])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add(styles.visible) }),
      { threshold: 0.1 }
    )
    document.querySelectorAll(`.${styles.animate}`).forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const idx = TOC_IDS.indexOf(e.target.id)
            if (idx > -1) setActiveSection(idx)
          }
        })
      },
      { threshold: 0.4 }
    )
    TOC_IDS.forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])

  const themeClass = theme === 'dark' ? styles['theme-dark'] : theme === 'fun' ? styles['theme-fun'] : ''

  return (
    <div className={cx(styles.root, serif.variable, dmSans.variable, themeClass)}>

      {/* Top nav */}
      <nav className={s('topnav')}>
        <div className={s('tn-left')}>
          <div className={s('tn-dot')}/>
          Case Study
        </div>
        <div className={s('tn-right')}>
          <span className={s('tn-badge')}>AI-Powered Learning</span>
        </div>
      </nav>

      {/* TOC sidebar */}
      <div className={s('toc')} aria-hidden="true">
        {TOC_LABELS.map((label, i) => (
          <div
            key={label}
            className={cx(s('toc-dot'), activeSection === i && s('toc-dot-on'))}
            title={label}
            onClick={() => document.getElementById(TOC_IDS[i])?.scrollIntoView({ behavior: 'smooth' })}
          />
        ))}
      </div>

      {/* Hero */}
      <header className={s('hero')}>
        <div className={s('hero-bg')} aria-hidden="true"/>
        <div className={s('hero-content')}>
          <div className={s('hero-eyebrow')}>
            <span className={s('hero-eyebrow-dot')}/>
            Product Design × AI × Interview Prep
          </div>
          <h1 className={s('hero-h1')}>
            Build a Product Design<br/>
            <em>Interview Coach</em>
          </h1>
          <p className={s('hero-sub')}>A personalized, end-to-end coach that helps designers prepare smarter — with guidance, feedback, and clarity at every step.</p>
          <div className={s('hero-meta')}>
            <div className={s('hero-avatar')}>SR</div>
            By <strong>Sakshi Rane</strong>
            <div className={s('hero-div')}/>
            May 2026
            <div className={s('hero-div')}/>
            8 min read
          </div>
          <div className={s('hero-actions')}>
            <button className={s('btn-primary')}>Start your journey <ArrowRight size={14}/></button>
            <button className={s('btn-ghost')}><Share2 size={14}/> Share</button>
          </div>
        </div>
        <div className={s('scroll-hint')} aria-hidden="true">
          <div className={s('scroll-line')}/>
          scroll
        </div>
      </header>

      <main className={s('main')}>

        {/* Stats row */}
        <div className={cx(s('stats-row'), s('animate'))}>
          {STATS.map(({ num, label }) => (
            <div key={label} className={s('stat-card')}>
              <div className={s('stat-num')}>{num}</div>
              <div className={s('stat-label')}>{label}</div>
            </div>
          ))}
        </div>

        {/* Case sections */}
        {SECTIONS.map((sec, i) => (
          <div
            key={sec.id}
            id={sec.id}
            className={cx(s('case-section'), s('animate'), sec.flip && s('case-flip'))}
            style={{ transitionDelay: `${i * 0.04}s` }}
          >
            <div className={s('cs-left')}>
              <span className={s('cs-num')}>{sec.num} —</span>
              <h2 className={s('cs-title')}>{sec.title}</h2>
              <p className={s('cs-desc')}>{sec.desc}</p>
              <div className={s('cs-tags')}>
                {sec.tags.map(t => <span key={t} className={s('cs-tag')}>{t}</span>)}
              </div>
            </div>
            <div className={s('cs-right')}>{sec.card}</div>
          </div>
        ))}

        {/* Divider */}
        <div className={cx(s('divider'), s('animate'))}>
          <span className={s('divider-label')}>Core intelligence layer</span>
        </div>

        {/* Section 08 — full-width generator */}
        <div id="s7" className={cx(s('full-card'), s('animate'))}>
          <div className={s('fc-inner')}>
            <div>
              <span className={s('cs-num')}>08 —</span>
              <h2 className={s('cs-title')}>Building the question generator</h2>
              <p className={s('cs-desc')}>I built a flexible generator that lets users customize by difficulty, category, and number — so practice is always focused and effective.</p>
              <div className={s('cs-tags')}>
                {['UX', 'Customisation', 'Control', 'Practice'].map(t => (
                  <span key={t} className={s('cs-tag')}>{t}</span>
                ))}
              </div>
            </div>
            <GeneratorCard/>
          </div>
        </div>

        {/* Footer CTA */}
        <footer className={s('footer-cta')}>
          <div className={s('fcta-bg')} aria-hidden="true"/>
          <div className={s('fcta-content')}>
            <h2 className={s('fcta-h2')}>A smarter way to prepare.</h2>
            <p className={s('fcta-p')}>Built with AI. Designed for designers. Focused on outcomes.</p>
            <button className={s('fcta-btn')}>Continue the journey <ArrowRight size={14}/></button>
          </div>
        </footer>

      </main>

      {/* Bottom Nav */}
      <nav className={s('bottom-nav')} aria-label="Site navigation">
        <div className={s('bn-pill')}>

          <div className={s('bn-theme-wrap')} ref={themeWrapRef}>
            <button
              className={cx(s('bn-btn'), themeOpen && s('bn-btn-on'))}
              onClick={() => setThemeOpen(p => !p)}
              aria-expanded={themeOpen}
              type="button"
            >
              <Palette size={14} strokeWidth={1.8} aria-hidden="true"/>
              Theme
            </button>
            {themeOpen && (
              <div className={s('theme-up')} role="listbox" aria-label="Choose theme">
                {([
                  { key: 'light', label: 'Light theme', Icon: Sun },
                  { key: 'dark',  label: 'Dark theme',  Icon: Moon },
                  { key: 'fun',   label: 'Fun theme',   Icon: Sparkles },
                ] as const).map(({ key, label, Icon }) => (
                  <button
                    key={key}
                    className={cx(s('t-opt'), theme === key && s('t-opt-on'))}
                    role="option" aria-selected={theme === key}
                    onClick={() => { setTheme(key); setThemeOpen(false) }}
                    type="button"
                  >
                    <Icon size={14} strokeWidth={1.8}/>
                    <span>{label}</span>
                    {theme === key && <span className={s('t-check')}>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={s('bn-sep')} aria-hidden="true"/>

          <button className={s('bn-btn')} type="button">
            <Link2 size={14} strokeWidth={1.8} aria-hidden="true"/>
            Share on LinkedIn
          </button>

          <div className={s('bn-sep')} aria-hidden="true"/>

          <button className={s('bn-btn')} type="button">
            <Share2 size={14} strokeWidth={1.8} aria-hidden="true"/>
            Share
          </button>

          <div className={s('bn-sep')} aria-hidden="true"/>

          <button className={s('bn-avatar')} aria-label="Sakshi Rane" type="button">
            S
            <div className={s('bn-online')} aria-hidden="true"/>
          </button>
        </div>
      </nav>

    </div>
  )
}
