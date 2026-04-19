import React from 'react'

const MOCK_HISTORY = [
  { id: '1', name: 'call_center_01.mp3',  date: '15 июл 2025, 14:32', duration: '3:42', entities: 4, types: ['PERSON', 'PHONE'] },
  { id: '2', name: 'interview_2024.wav',  date: '14 июл 2025, 09:11', duration: '12:05', entities: 7, types: ['PERSON', 'ADDRESS', 'EMAIL'] },
  { id: '3', name: 'support_record.m4a',  date: '13 июл 2025, 18:55', duration: '1:18', entities: 2, types: ['PHONE'] },
  { id: '4', name: 'meeting_notes.ogg',   date: '12 июл 2025, 11:20', duration: '28:33', entities: 9, types: ['PERSON', 'PHONE', 'EMAIL', 'ADDRESS'] },
  { id: '5', name: 'voice_message.mp3',   date: '10 июл 2025, 16:44', duration: '0:47', entities: 1, types: ['PERSON'] },
]

const TYPE_COLORS = {
  PERSON:   { label: 'Имя',     color: '#ef4444', bg: '#fee2e2' },
  PHONE:    { label: 'Телефон', color: '#f97316', bg: '#ffedd5' },
  EMAIL:    { label: 'Email',   color: '#a855f7', bg: '#faf5ff' },
  ADDRESS:  { label: 'Адрес',   color: '#3b82f6', bg: '#dbeafe' },
}

export default function HistoryScreen() {
  return (
    <div className="flex flex-col items-center px-6 py-10">
      <div className="w-full max-w-3xl">

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>История обработки</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Ранее обработанные аудиозаписи</p>
        </div>

        <div className="flex flex-col gap-3">
          {MOCK_HISTORY.map(item => (
            <div
              key={item.id}
              style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: '1rem',
                border: '1px solid var(--border)',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                transition: 'background-color 0.15s',
                cursor: 'pointer',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--bg-card)'}
            >
              {/* Icon */}
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(59,130,246,0.1)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate mb-1" style={{ color: 'var(--text)' }}>{item.name}</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs" style={{ color: 'var(--text-faint)' }}>{item.date}</span>
                  <span className="text-xs" style={{ color: 'var(--text-faint)' }}>·</span>
                  <span className="text-xs" style={{ color: 'var(--text-faint)' }}>{item.duration}</span>
                  <span className="text-xs" style={{ color: 'var(--text-faint)' }}>·</span>
                  <span className="text-xs font-medium text-red-500">{item.entities} редакций</span>
                </div>
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {item.types.map(type => {
                    const t = TYPE_COLORS[type]
                    if (!t) return null
                    return (
                      <span key={type} className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: t.bg, color: t.color }}>
                        {t.label}
                      </span>
                    )
                  })}
                </div>
              </div>

              {/* Download */}
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium flex-shrink-0"
                style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: '#16a34a', border: 'none', cursor: 'pointer' }}
                onClick={e => e.stopPropagation()}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Скачать
              </button>
            </div>
          ))}
        </div>

        <p className="text-xs text-center mt-8" style={{ color: 'var(--text-faint)' }}>
          Моковые данные — реальная история появится после подключения бэкенда
        </p>

      </div>
    </div>
  )
}
