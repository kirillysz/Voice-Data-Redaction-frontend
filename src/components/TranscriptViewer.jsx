import React from 'react'

const TYPE_STYLE = {
  PERSON:   { label: 'ИМЯ',      color: '#f87171', bg: '#fee2e2' },
  PHONE:    { label: 'ТЕЛЕФОН',  color: '#fb923c', bg: '#ffedd5' },
  EMAIL:    { label: 'EMAIL',    color: '#4ade80', bg: '#dcfce7' },
  ADDRESS:  { label: 'АДРЕС',    color: '#60a5fa', bg: '#dbeafe' },
  SNILS:    { label: 'СНИЛС',    color: '#2dd4bf', bg: '#ccfbf1' },
  PASSPORT: { label: 'ПАСПОРТ',  color: '#a78bfa', bg: '#ede9fe' },
  INN:      { label: 'ИНН',      color: '#facc15', bg: '#fef9c3' },
}

function buildSegments(redactedTranscript, entities) {
  if (!redactedTranscript) return []

  // Сортируем entities по start_char
  const sorted = [...entities].sort((a, b) => a.start_char - b.start_char)
  const segments = []
  let cursor = 0

  for (const entity of sorted) {
    if (entity.start_char > cursor) {
      segments.push({ text: redactedTranscript.slice(cursor, entity.start_char), type: null })
    }
    segments.push({ text: redactedTranscript.slice(entity.start_char, entity.end_char), type: entity.type })
    cursor = entity.end_char
  }

  if (cursor < redactedTranscript.length) {
    segments.push({ text: redactedTranscript.slice(cursor), type: null })
  }

  return segments
}

export default function TranscriptViewer({ originalTranscript, redactedTranscript, entities = [] }) {
  const segments = buildSegments(redactedTranscript, entities)
  const usedTypes = [...new Set(entities.map((e) => e.type))].filter((t) => TYPE_STYLE[t])

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Транскрипт с подсветкой редакций
      </h2>

      {usedTypes.length > 0 && (
        <div className="flex flex-wrap gap-4 mb-5">
          {usedTypes.map((type) => {
            const s = TYPE_STYLE[type]
            return (
              <div key={type} className="flex items-center gap-1.5 text-xs text-gray-600">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: s.bg, border: `1px solid ${s.color}` }} />
                {s.label}
              </div>
            )
          })}
        </div>
      )}

      <div className="text-sm text-gray-700 rounded-lg border border-gray-100 p-4" style={{ lineHeight: '2.2' }}>
        {segments.map((seg, i) => {
          const style = TYPE_STYLE[seg.type]
          if (style) {
            return (
              <span
                key={i}
                className="mx-0.5"
                style={{
                  backgroundColor: style.bg,
                  color: style.color,
                  borderRadius: '4px',
                  padding: '1px 4px',
                  fontWeight: 500,
                  border: `1px solid ${style.color}33`,
                }}
              >
                {seg.text}
              </span>
            )
          }
          return <span key={i}>{seg.text}</span>
        })}
      </div>

      <div className="flex gap-4 mt-4 text-sm">
        <span className="text-gray-500">
          <span className="font-semibold text-gray-800">{originalTranscript.split(/\s+/).filter(Boolean).length}</span> слов всего
        </span>
        <span className="text-red-500 font-medium">
          <span className="font-semibold">{entities.length}</span> сущностей редактировано
        </span>
      </div>
    </div>
  )
}
