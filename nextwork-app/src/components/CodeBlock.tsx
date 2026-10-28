'use client'

import { useEffect, useRef, useState } from 'react'
import styles from '../app/page.module.css'
const s = (cls: string) => styles[cls] || ''
const cx = (...args: (string | false | undefined | null)[]) => args.filter(Boolean).join(' ')

export function CodeBlock({
    lang, file, copyKey, copyText, html,
    showExpand = true, showNewTab = false,
    explanation, showHint = false,
    lineAnnotations, copied, onCopy,
  }: {
    lang?: string; file?: string; copyKey: string; copyText: string; html: string;
    showExpand?: boolean; showNewTab?: boolean;
    explanation?: React.ReactNode; showHint?: boolean;
    lineAnnotations?: string[];
    copied: boolean; onCopy: (key: string, text: string) => void;
  }) {
    const [explOpen, setExplOpen] = useState(false)
    const [selLine, setSelLine] = useState<number | null>(null)
    const blockRef = useRef<HTMLDivElement>(null)

    const lines = lineAnnotations ? html.split('\n') : null
    const panelOpen = selLine !== null
    const annotText = selLine !== null && lineAnnotations ? lineAnnotations[selLine] : ''

    useEffect(() => {
      if (selLine === null) return
      function onDown(e: MouseEvent) {
        if (blockRef.current && !blockRef.current.contains(e.target as Node)) {
          setSelLine(null)
        }
      }
      document.addEventListener('mousedown', onDown)
      return () => document.removeEventListener('mousedown', onDown)
    }, [selLine])

    function onContainerKey(e: React.KeyboardEvent) {
      if (!lines) return
      if (e.key === 'Escape') { setSelLine(null); return }
      if (selLine === null) return
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelLine(p => Math.min((p ?? 0) + 1, lines.length - 1)) }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setSelLine(p => Math.max((p ?? 0) - 1, 0)) }
    }

    return (
      <div className={s('code')} role="region" ref={blockRef} onKeyDown={onContainerKey}>
        <div className={s('code-hd')}>
          <div className={s('code-hd-l')}>
            {file && <span className={s('code-file')}>{file}</span>}
            {lang && <span className={s('code-lang')}>{lang}</span>}
          </div>
          <div className={s('code-acts')}>
            {explanation && (
              <button
                className={cx(s('code-btn'), s('code-expl-toggle'))}
                onClick={() => setExplOpen(p => !p)}
                aria-expanded={explOpen}
                type="button"
              >
                What does this do?
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ transform: explOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}><polyline points="6 9 12 15 18 9"/></svg>
              </button>
            )}
            {showExpand && (
              <button className={s('code-btn')} aria-label="Expand">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>
              </button>
            )}
            {showNewTab && (
              <button className={s('code-btn')} aria-label="Open in new tab">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </button>
            )}
            <button
              className={s('code-btn')}
              aria-label="Copy"
              onClick={() => onCopy(copyKey, copyText)}
            >
              {copied
                ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              }
            </button>
          </div>
        </div>
        {explanation && explOpen && (
          <div className={s('code-expl-strip')}>{explanation}</div>
        )}
        {showHint && !panelOpen && (
          <div className={s('code-hint')}>Click any line to see what it does.</div>
        )}
        {lines ? (
          <div className={cx(s('code-body'), panelOpen && s('code-body-open'))}>
            <div className={s('code-lines')}>
              {lines.map((lineHtml, i) => (
                <div
                  key={i}
                  className={cx(
                    s('code-line'),
                    selLine === i && s('code-line-sel'),
                    panelOpen && selLine !== i && s('code-line-dim'),
                  )}
                  onClick={() => setSelLine(prev => prev === i ? null : i)}
                  role="button"
                  tabIndex={0}
                  aria-pressed={selLine === i}
                  aria-label={`Line ${i + 1}${lineAnnotations?.[i] ? ': ' + lineAnnotations[i] : ''}`}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setSelLine(prev => prev === i ? null : i)
                    }
                  }}
                  dangerouslySetInnerHTML={{ __html: lineHtml || ' ' }}
                />
              ))}
            </div>
            <div
              className={cx(s('code-annot'), panelOpen && s('code-annot-open'))}
              aria-live="polite"
              aria-label="Line explanation"
            >
              <div className={s('code-annot-in')}>
                {panelOpen && (
                  <>
                    <div className={s('code-annot-lbl')}>line {(selLine ?? 0) + 1}</div>
                    <div className={s('code-annot-txt')}>
                      {annotText || <span className={s('code-annot-empty')}>No annotation for this line.</span>}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className={s('code-bd')} dangerouslySetInnerHTML={{ __html: html }} />
        )}
      </div>
    )
  }

