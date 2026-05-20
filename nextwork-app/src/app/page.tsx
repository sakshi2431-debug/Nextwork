'use client'

import { useState, useRef } from 'react'
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

const s = (cls: string) => styles[cls] || ''
function cx(...args: (string | false | undefined | null)[]) {
  return args.filter(Boolean).join(' ')
}

function NWLogo({ size = 26, stroke = '#1B1918' }: { size?: number; stroke?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="13.5" stroke={stroke} strokeWidth="1.4" fill="none"/>
      <line x1="16" y1="16" x2="29.5" y2="16" stroke={stroke} strokeWidth="1.15"/>
      <line x1="16" y1="16" x2="28"   y2="9.5"  stroke={stroke} strokeWidth="1.15"/>
      <line x1="16" y1="16" x2="24"   y2="4"    stroke={stroke} strokeWidth="1.15"/>
      <line x1="16" y1="16" x2="28"   y2="22.5" stroke={stroke} strokeWidth="1.15"/>
      <line x1="16" y1="16" x2="24"   y2="28"   stroke={stroke} strokeWidth="1.15"/>
      <line x1="16" y1="16" x2="2.5"  y2="16"   stroke={stroke} strokeWidth="1.15"/>
    </svg>
  )
}

function BcTags({ list }: { list: string[] }) {
  return (
    <div className={s('bc-tags')}>
      {list.map(t => <span key={t} className={s('bc-tag')}>{t}</span>)}
    </div>
  )
}

export default function ProjectPage() {
  const [docOpen, setDocOpen] = useState(false)
  const [docExpanded, setDocExpanded] = useState(false)
  const [docTheme, setDocTheme] = useState<'light' | 'dark' | 'fun' | 'bento'>('dark')
  const [docThemeOpen, setDocThemeOpen] = useState(false)
  const docThemeRef = useRef<HTMLDivElement>(null)

  return (
    <div className={cx(styles.root, baskerville.variable, dmMono.variable)}>
      <a href="#main" className={s('skip')}>Skip to main content</a>

      {/* ═══ BENTO MAIN ═══ */}
      <main className={s('bento-page')} id="main">

        {/* Stats row */}
        <div className={s('stats-row')}>
          <div className={cx(s('stat-tile'), s('st-l'))}>
            <span className={s('st-num')}>8</span>
            <span className={s('st-lbl')}>CORE MODULES BUILT</span>
          </div>
          <div className={cx(s('stat-tile'), s('st-d'))}>
            <span className={s('st-num')}>3×</span>
            <span className={s('st-lbl')}>FASTER PREP TIME</span>
          </div>
          <div className={cx(s('stat-tile'), s('st-l'))}>
            <span className={s('st-num')}>AI</span>
            <span className={s('st-lbl')}>POWERED FEEDBACK</span>
          </div>
          <div className={cx(s('stat-tile'), s('st-l'))}>
            <span className={s('st-num')}>∞</span>
            <span className={s('st-lbl')}>QUESTIONS GENERATED</span>
          </div>
        </div>

        {/* Bento grid */}
        <div className={s('bento-grid')}>

          {/* 01 — light */}
          <div className={cx(s('bc'), s('bc-l'))}>
            <div className={s('bc-hd')}>
              <span className={s('bc-n')}>01 –</span>
              <span className={s('bc-cnt')}>01 / 08</span>
            </div>
            <h2 className={s('bc-title')}>Building an AI-Powered <em>Interview Coach</em></h2>
            <p className={s('bc-desc')}>I set out to create a coach that helps product designers prepare smarter — not just with questions, but with guidance, feedback, and clarity at every step.</p>
            <div className={s('bc-mock')}>
              <div className={s('bm-lbl')}>YOUR AI COACH FOR PRODUCT DESIGN INTERVIEWS</div>
              <div className={s('bm-tag')}><em>Practice. Receive feedback. Get hired.</em></div>
              <div className={s('bm-cta')}>START YOUR JOURNEY →</div>
            </div>
            <BcTags list={['AI', 'PRODUCT DESIGN', 'INTERVIEW PREP', 'PERSONALIZED']} />
          </div>

          {/* 02 — dark */}
          <div className={cx(s('bc'), s('bc-d'))}>
            <div className={s('bc-hd')}>
              <span className={s('bc-n')}>02 –</span>
              <span className={s('bc-cnt')}>02 / 08</span>
            </div>
            <h2 className={s('bc-title')}>Project vision and goals</h2>
            <p className={s('bc-desc')}>Build a personalized, end-to-end interview coach that understands your target role, generates tailored content, and helps you improve with confidence.</p>
            <ul className={s('bc-list')}>
              <li>Understand the job description deeply</li>
              <li>Generate tailored interview questions</li>
              <li>Provide structured feedback</li>
              <li>Track progress over time</li>
            </ul>
            <BcTags list={['PERSONALIZATION', 'CLARITY', 'FEEDBACK', 'GROWTH']} />
          </div>

          {/* 03 — light */}
          <div className={cx(s('bc'), s('bc-l'))}>
            <div className={s('bc-hd')}>
              <span className={s('bc-n')}>03 –</span>
              <span className={s('bc-cnt')}>03 / 08</span>
            </div>
            <h2 className={s('bc-title')}>Setting up the development environment</h2>
            <p className={s('bc-desc')}>I started by setting up a modern stack with Next.js, TypeScript, Tailwind CSS, and the tools needed to build fast and ship confidently.</p>
            <div className={s('bc-term')}>
              <div className={s('bt-dots')}><span /><span /><span /></div>
              <span className={s('bt-ok')}>• Environment ready</span>
              <pre className={s('bt-code')}>{`npx create-next-app@latest pd-interview-coach\ncd pd-interview-coach\nnpm install\nnpm run dev\n✓ Local: http://localhost:3000`}</pre>
            </div>
            <BcTags list={['NEXT.JS', 'TYPESCRIPT', 'TAILWIND CSS', 'VERCEL']} />
          </div>

          {/* 04 — dark */}
          <div className={cx(s('bc'), s('bc-d'))}>
            <div className={s('bc-hd')}>
              <span className={s('bc-n')}>04 –</span>
              <span className={s('bc-cnt')}>04 / 08</span>
            </div>
            <h2 className={s('bc-title')}>{'Scaffolding\nthe Next.js App'}</h2>
            <p className={s('bc-desc')}>A clean, scalable foundation makes everything that follows smoother. Scaffolded with a focus on modularity and developer experience.</p>
            <div className={s('bc-tree')}>
              <div className={s('btr-r')}><span className={s('btr-a')}>▾</span> app</div>
              <div className={cx(s('btr-r'), s('btr-i1'))}>route.ts</div>
              <div className={cx(s('btr-r'), s('btr-i1'))}><span className={s('btr-a')}>▾</span> api</div>
              <div className={cx(s('btr-r'), s('btr-i2'))}>analyze/route.ts</div>
              <div className={cx(s('btr-r'), s('btr-i1'))}><span className={s('btr-a')}>▾</span> components</div>
              <div className={cx(s('btr-r'), s('btr-i2'))}>Coach.tsx</div>
              <div className={cx(s('btr-r'), s('btr-i1'))}><span className={s('btr-a')}>▾</span> lib</div>
              <div className={cx(s('btr-r'), s('btr-i2'))}>prompts.ts</div>
              <div className={cx(s('btr-r'), s('btr-i2'), s('btr-m'))}>hooks/ · types/ · utils/</div>
              <div className={cx(s('btr-r'), s('btr-m'))}>.env.local · README.md</div>
            </div>
            <BcTags list={['SCALABILITY', 'MODULARITY', 'BEST PRACTICES', 'DX']} />
          </div>

          {/* 05 — light */}
          <div className={cx(s('bc'), s('bc-l'))}>
            <div className={s('bc-hd')}>
              <span className={s('bc-n')}>05 –</span>
              <span className={s('bc-cnt')}>05 / 08</span>
            </div>
            <h2 className={s('bc-title')}>Engineering the JD Analyzer <em>with Custom Prompts</em></h2>
            <p className={s('bc-desc')}>Prompting is an art. I designed a structured prompt that extracts the specific skills, values, and expectations a hiring team cares about.</p>
            <div className={s('bc-prompt')}>
              <div className={s('bpr-lbl')}>SYSTEM PROMPT</div>
              <p className={s('bpr-txt')}>You are an expert at analyzing product design job descriptions. Extract: key design skills required, team values, seniority signals, and portfolio expectations...</p>
            </div>
            <BcTags list={['PROMPT ENGINEERING', 'LLM', 'AI', 'GROQ']} />
          </div>

          {/* 06 — dark */}
          <div className={cx(s('bc'), s('bc-d'))}>
            <div className={s('bc-hd')}>
              <span className={s('bc-n')}>06 –</span>
              <span className={s('bc-cnt')}>06 / 08</span>
            </div>
            <h2 className={s('bc-title')}>Crafting a targeted <em>system prompt</em></h2>
            <p className={s('bc-desc')}>The system prompt tells the LLM to act as a senior product design interviewer — calibrated for the specific company, role level, and design discipline.</p>
            <div className={s('bc-spacer')} />
            <BcTags list={['SYSTEMS DESIGN', 'CONTEXT WINDOW', 'FEW-SHOT', 'CHAIN-OF-THOUGHT']} />
          </div>

          {/* 07 — light */}
          <div className={cx(s('bc'), s('bc-l'))}>
            <div className={s('bc-hd')}>
              <span className={s('bc-n')}>07 –</span>
              <span className={s('bc-cnt')}>07 / 08</span>
            </div>
            <h2 className={s('bc-title')}>Generating Tailored <em>Interview Questions</em></h2>
            <p className={s('bc-desc')}>Using the analyzed job description, the coach generates categorized questions — behavioral, portfolio, technical, and role-specific — tailored to the company.</p>
            <div className={s('bc-spacer')} />
            <BcTags list={['QUESTION GEN', 'PERSONALIZATION', 'CATEGORIES', 'AI']} />
          </div>

          {/* 08 — dark */}
          <div className={cx(s('bc'), s('bc-d'))}>
            <div className={s('bc-hd')}>
              <span className={s('bc-n')}>08 –</span>
              <span className={s('bc-cnt')}>08 / 08</span>
            </div>
            <h2 className={s('bc-title')}>Building the <em>question generator</em></h2>
            <p className={s('bc-desc')}>In this step, I&apos;m building… so that I can design a product that adapts to real hiring contexts and helps designers practice with purpose.</p>
            <div className={s('bc-spacer')} />
            <BcTags list={['API INTEGRATION', 'REACT', 'NEXT.JS', 'FULL-STACK']} />
          </div>

        </div>
      </main>

      {/* ═══ BOTTOM NAV ═══ */}
      <nav className={s('bottom-nav')} aria-label="Site navigation">
        <div className={s('bn-inner-b')}>
          <div className={s('bn-left')}>
            <div className={s('bn-logo')} aria-label="NextWork">
              <NWLogo size={26} />
            </div>
            <button className={s('bn-btn')}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              Ask
            </button>
            <button className={s('bn-btn')}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              Projects
            </button>
            <button className={s('bn-btn')} onClick={() => setDocOpen(true)}>
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

            <div className={s('dp-controls')}>
              <button className={s('dp-ctrl-btn')} onClick={() => setDocExpanded(p => !p)} aria-label={docExpanded ? 'Collapse' : 'Expand'}>
                {docExpanded
                  ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/></svg>
                  : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>
                }
              </button>
              <button className={s('dp-ctrl-btn')} onClick={() => { setDocOpen(false); setDocExpanded(false) }} aria-label="Close">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div className={s('dp-scroll')}>
              <div className={s('dp-cover')}>
                <div className={s('dp-logo-wrap')}>
                  <NWLogo size={28} stroke="currentColor" />
                </div>
                <h1 className={s('dp-title')}>BUILD A PRODUCT DESIGN INTERVIEW COACH</h1>
                <p className={s('dp-meta')}>By <strong>sakshi 31 rane</strong> | May 2026</p>
                <button className={s('dp-share-btn')}>Share Work ↗</button>
              </div>

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
            </div>

            <div className={s('dp-nav-wrap')}>
              {docThemeOpen && (
                <div className={s('dp-theme-popup')} ref={docThemeRef}>
                  <div className={s('dp-theme-label')}>DOCUMENTATION THEME</div>
                  {(['light', 'dark', 'fun', 'bento'] as const).map(t => (
                    <label key={t} className={cx(s('dp-theme-opt'), docTheme === t && s('dp-theme-opt-on'))}>
                      <span className={cx(s('dp-radio'), docTheme === t && s('dp-radio-on'))} />
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                      <input type="radio" name="dp-theme" value={t} checked={docTheme === t}
                        onChange={() => { setDocTheme(t); setDocThemeOpen(false) }}
                        style={{ display: 'none' }}
                      />
                    </label>
                  ))}
                </div>
              )}
              <div className={s('dp-nav-pill')}>
                <div className={s('dp-nav-logo')} aria-label="NextWork">
                  <NWLogo size={18} stroke="currentColor" />
                </div>
                <div className={s('dp-nav-sep')} />
                <button className={s('dp-nav-btn')} onClick={() => setDocThemeOpen(p => !p)} type="button">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 0-14.14 0"/><path d="M4.93 19.07a10 10 0 0 0 14.14 0"/></svg>
                  Theme
                </button>
                <div className={s('dp-nav-sep')} />
                <button className={s('dp-nav-btn')} type="button">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                  Share on LinkedIn
                </button>
                <div className={s('dp-nav-sep')} />
                <button className={s('dp-nav-btn')} type="button">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                  Share
                </button>
                <div className={s('dp-nav-sep')} />
                <button className={s('dp-nav-avatar')} type="button">S</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
