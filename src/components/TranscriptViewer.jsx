import React from 'react'

const LEGEND = [
  { key: 'name', label: 'ИМЯ', color: '#f87171', bg: '#fee2e2' },
  { key: 'phone', label: 'ТЕЛЕФОН', color: '#fb923c', bg: '#ffedd5' },
  { key: 'email', label: 'EMAIL', color: '#4ade80', bg: '#dcfce7' },
  { key: 'address', label: 'АДРЕС', color: '#60a5fa', bg: '#dbeafe' },
  { key: 'snils', label: 'СНС', color: '#2dd4bf', bg: '#ccfbf1' },
  { key: 'card', label: 'КАРТА', color: '#facc15', bg: '#fef9c3' },
]

const TRANSCRIPT = [
  { text: 'Здравствуйте,', type: null },
  { text: 'меня', type: null },
  { text: 'зовут', type: null },
  { text: '[REDACTED]', type: 'name' },
  { text: '[REDACTED]', type: 'name' },
  { text: 'Мой', type: null },
  { text: 'номер', type: null },
  { text: 'телефона', type: null },
  { text: '[REDACTED]', type: 'phone' },
  { text: '[REDACTED]', type: 'phone' },
  { text: '[REDACTED]', type: 'phone' },
  { text: '[REDACTED]', type: 'phone' },
  { text: 'Я', type: null },
  { text: 'живу', type: null },
  { text: 'по', type: null },
  { text: 'адресу', type: null },
  { text: '[REDACTED]', type: 'address' },
  { text: '[REDACTED]', type: 'address' },
  { text: '[REDACTED]', type: 'address' },
  { text: '[REDACTED]', type: 'address' },
  { text: '[REDACTED]', type: 'address' },
  { text: 'Моя', type: null },
  { text: 'почта', type: null },
  { text: '[REDACTED]', type: 'email' },
  { text: 'Спасибо.', type: null },
]

const TOTAL_WORDS = TRANSCRIPT.length
const REDACTED_WORDS = TRANSCRIPT.filter((w) => w.type !== null).length

function getStyle(type) {
  const legend = LEGEND.find((l) => l.key === type)
  if (!legend) return {}
  return {
    backgroundColor: legend.bg,
    color: legend.color,
    borderRadius: '4px',
    padding: '1px 4px',
    fontWeight: 500,
    border: `1px solid ${legend.color}33`,
  }
}

export default function TranscriptViewer() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Транскрипт с подсветкой редакций
      </h2>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-5">
        {LEGEND.map((item) => (
          <div key={item.key} className="flex items-center gap-1.5 text-xs text-gray-600">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: item.bg, border: `1px solid ${item.color}` }}
            />
            {item.label}
          </div>
        ))}
      </div>

      {/* Transcript text */}
      <div
        className="text-sm text-gray-700 leading-8 rounded-lg border border-gray-100 p-4"
        style={{ lineHeight: '2.2' }}
      >
        {TRANSCRIPT.map((word, i) => (
          <React.Fragment key={i}>
            {i === 12 && <br />}
            <span style={getStyle(word.type)} className={word.type ? 'mx-0.5' : ''}>
              {word.text}
            </span>
            {word.type === null && i < TRANSCRIPT.length - 1 && ' '}
            {word.type !== null && ' '}
          </React.Fragment>
        ))}
      </div>

      {/* Stats */}
      <div className="flex gap-4 mt-4 text-sm">
        <span className="text-gray-500">
          <span className="font-semibold text-gray-800">{TOTAL_WORDS}</span> слов всего
        </span>
        <span className="text-red-500 font-medium">
          <span className="font-semibold">{REDACTED_WORDS}</span> слов редактировано
        </span>
      </div>
    </div>
  )
}
