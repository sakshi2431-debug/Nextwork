'use client'

import styles from '../app/page.module.css'
const s = (cls: string) => styles[cls] || ''
const cx = (...args: (string | false | undefined | null)[]) => args.filter(Boolean).join(' ')

export function CheckItem({ id, children, checked, onToggle }: { id: string; children: React.ReactNode; checked: boolean; onToggle: (id: string) => void }) {
    return (
      <div
        className={cx(s('cl-item'), checked && s('done'))}
        role="checkbox"
        aria-checked={checked}
        tabIndex={0}
        onClick={() => onToggle(id)}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(id) } }}
      >
        <div className={cx(s('cl-box'), checked && s('on'))}>
          {checked && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>}
        </div>
        {children}
      </div>
    )
  }

