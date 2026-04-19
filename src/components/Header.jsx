import React from 'react'

export default function Header({ dark, onToggleDark, showBack, onBack, onHistory }) {
  return (
    <header style={{
      backgroundColor: 'var(--bg-card)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 10,
      transition: 'background-color 0.2s',
    }}>
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Left: back + logo */}
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={onBack}
              className="h-8 px-2 rounded-lg flex items-center gap-1.5"
              style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Назад
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#2563eb"/>
              <rect x="7" y="14" width="3" height="8" rx="1.5" fill="white" opacity="0.5"/>
              <rect x="12" y="10" width="3" height="12" rx="1.5" fill="white" opacity="0.75"/>
              <rect x="17" y="7" width="3" height="15" rx="1.5" fill="white"/>
              <rect x="22" y="12" width="3" height="7" rx="1.5" fill="white" opacity="0.6"/>
              <path d="M6 26 Q16 20 26 26" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
            </svg>
            <div>
              <p className="text-sm font-bold leading-tight" style={{ color: 'var(--text)' }}>Voice Redaction</p>
              <p className="text-xs leading-tight" style={{ color: 'var(--text-faint)' }}>by detaflow</p>
            </div>
          </div>
        </div>

        {/* Right: history + theme */}
        <div className="flex items-center gap-1">
          <button
            onClick={onHistory}
            className="h-9 px-3 rounded-lg flex items-center gap-2 text-sm"
            style={{ color: 'var(--text-muted)', background: 'var(--bg-btn)', border: 'none', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--bg-btn)'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>История</span>
          </button>

          <button
            onClick={onToggleDark}
            title={dark ? 'Светлая тема' : 'Тёмная тема'}
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ color: 'var(--text-muted)', background: 'var(--bg-btn)', border: 'none', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--bg-btn)'}
          >
            {dark ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>

      </div>
    </header>
  )
}
