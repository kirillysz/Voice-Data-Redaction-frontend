import React, { useState, useEffect, useCallback } from 'react'
import { fetchHistory, deleteHistoryEntry, getAudioUrl } from '../api.js'

const TYPE_COLORS = {
  PERSON:   { label: 'Имя',     color: '#ffffff', bg: '#c06060' },
  PHONE:    { label: 'Телефон', color: '#ffffff', bg: '#b87848' },
  EMAIL:    { label: 'Email',   color: '#ffffff', bg: '#7c6aaa' },
  ADDRESS:  { label: 'Адрес',   color: '#ffffff', bg: '#5080a0' },
  SNILS:    { label: 'СНИЛС',   color: '#ffffff', bg: '#4a9080' },
  PASSPORT: { label: 'Паспорт', color: '#ffffff', bg: '#7a6850' },
  INN:      { label: 'ИНН',     color: '#ffffff', bg: '#707858' },
}

const FILTER_TYPES = ['PERSON', 'PHONE', 'EMAIL', 'ADDRESS', 'SNILS', 'PASSPORT', 'INN']

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

function formatDuration(sec) {
  if (!sec) return '—'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function HistoryScreen() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [entityType, setEntityType] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchHistory({ page, entityType: entityType || undefined })
      setItems(data.items)
      setPages(data.pages)
      setTotal(data.total)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [page, entityType])

  useEffect(() => { load() }, [load])

  async function handleDelete(e, jobId) {
    e.stopPropagation()
    setDeletingId(jobId)
    try {
      await deleteHistoryEntry(jobId)
      setItems(prev => prev.filter(i => i.job_id !== jobId))
      setTotal(prev => prev - 1)
    } catch (e) {
      setError(e.message)
    } finally {
      setDeletingId(null)
    }
  }

  function handleFilterChange(type) {
    setEntityType(prev => prev === type ? '' : type)
    setPage(1)
  }

  return (
    <div className="flex flex-col items-center px-6 py-10">
      <div className="w-full max-w-3xl">

        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>История обработки</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {loading ? 'Загрузка...' : `${total} записей`}
          </p>
        </div>

        {/* Фильтр по типу */}
        <div className="flex gap-2 flex-wrap mb-6">
          {FILTER_TYPES.map(type => {
            const t = TYPE_COLORS[type]
            const active = entityType === type
            return (
              <button
                key={type}
                onClick={() => handleFilterChange(type)}
                className="text-xs px-3 py-1.5 rounded-full font-medium transition-opacity"
                style={{
                  backgroundColor: active ? t.bg : 'var(--bg-subtle)',
                  color: active ? '#ffffff' : 'var(--text-muted)',
                  border: 'none',
                  cursor: 'pointer',
                  opacity: 1,
                }}
              >
                {t.label}
              </button>
            )
          })}
        </div>

        {/* Ошибка */}
        {error && (
          <div className="mb-4 p-3 rounded-lg text-sm text-red-600" style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)' }}>
            {error}
          </div>
        )}

        {/* Список */}
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1,2,3].map(i => (
              <div key={i} style={{ backgroundColor: 'var(--bg-card)', borderRadius: '1rem', border: '1px solid var(--border)', padding: '1rem 1.25rem', height: '80px', opacity: 0.5 }} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16" style={{ color: 'var(--text-faint)' }}>
            <p className="text-4xl mb-3">🎙️</p>
            <p className="text-sm">Записей пока нет</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {items.map(item => (
              <div
                key={item.job_id}
                style={{ backgroundColor: 'var(--bg-card)', borderRadius: '1rem', border: '1px solid var(--border)', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'background-color 0.15s', cursor: 'default' }}
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
                  <p className="text-sm font-semibold truncate mb-1" style={{ color: 'var(--text)' }}>{item.filename}</p>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-xs" style={{ color: 'var(--text-faint)' }}>{formatDate(item.created_at)}</span>
                    <span className="text-xs" style={{ color: 'var(--text-faint)' }}>·</span>
                    <span className="text-xs" style={{ color: 'var(--text-faint)' }}>{formatDuration(item.duration_sec)}</span>
                    <span className="text-xs" style={{ color: 'var(--text-faint)' }}>·</span>
                    <span className="text-xs font-medium text-red-500">{item.total_redacted} редакций</span>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {item.entity_types.map(type => {
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

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={getAudioUrl(item.job_id)}
                    download
                    onClick={e => e.stopPropagation()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                    style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: '#16a34a', textDecoration: 'none' }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Скачать
                  </a>
                  <button
                    onClick={e => handleDelete(e, item.job_id)}
                    disabled={deletingId === item.job_id}
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-faint)' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-faint)'}
                  >
                    {deletingId === item.job_id ? (
                      <div style={{ width: 12, height: 12, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4h6v2" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Пагинация */}
        {pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg text-sm"
              style={{ backgroundColor: 'var(--bg-subtle)', color: page === 1 ? 'var(--text-faint)' : 'var(--text)', border: 'none', cursor: page === 1 ? 'default' : 'pointer' }}
            >
              ←
            </button>
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{page} / {pages}</span>
            <button
              onClick={() => setPage(p => Math.min(pages, p + 1))}
              disabled={page === pages}
              className="px-3 py-1.5 rounded-lg text-sm"
              style={{ backgroundColor: 'var(--bg-subtle)', color: page === pages ? 'var(--text-faint)' : 'var(--text)', border: 'none', cursor: page === pages ? 'default' : 'pointer' }}
            >
              →
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
