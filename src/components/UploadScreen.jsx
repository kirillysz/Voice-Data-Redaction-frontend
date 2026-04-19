import React, { useRef } from 'react'

const STATUS_LABELS = {
  uploading: 'Загрузка файла...',
  queued: 'В очереди обработки...',
  started: 'Обрабатывается...',
}

const PD_TYPES = [
  { label: 'Имена и фамилии', icon: '👤' },
  { label: 'Номера телефонов', icon: '📞' },
  { label: 'Email адреса', icon: '✉️' },
  { label: 'Почтовые адреса', icon: '🏠' },
  { label: 'Паспортные данные', icon: '🪪' },
  { label: 'СНИЛС и ИНН', icon: '📄' },
]

const card = {
  backgroundColor: 'var(--bg-card)',
  borderRadius: '1rem',
  boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
  transition: 'background-color 0.2s',
}

export default function UploadScreen({ onFileSelect, processing, processingStatus, error }) {
  const inputRef = useRef(null)

  function handleDrop(e) {
    e.preventDefault()
    if (processing) return
    const file = e.dataTransfer.files[0]
    if (file) onFileSelect(file)
  }

  function handleChange(e) {
    const file = e.target.files[0]
    if (file) onFileSelect(file)
  }

  return (
    <div className="flex flex-col items-center px-6 py-12">
      <div className="w-full max-w-2xl flex flex-col gap-6">

        <div className="text-center">
          <h2 className="text-4xl font-bold mb-3" style={{ color: 'var(--text)' }}>
            Защитите персональные данные<br />в голосовых записях
          </h2>
          <p className="text-base max-w-lg mx-auto" style={{ color: 'var(--text-muted)' }}>
            Загрузите аудиофайл — сервис автоматически найдёт и заглушит все персональные данные с помощью AI
          </p>
        </div>

        <div style={card} className="p-8">
          <div
            style={{
              border: `2px dashed ${processing ? '#93c5fd' : 'var(--border)'}`,
              borderRadius: '0.75rem',
              padding: '3rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              cursor: processing ? 'default' : 'pointer',
              backgroundColor: processing ? 'rgba(59,130,246,0.05)' : 'transparent',
              transition: 'border-color 0.2s',
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => !processing && inputRef.current?.click()}
          >
            {processing ? (
              <>
                <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
                <p className="font-semibold text-blue-600 text-base">
                  {STATUS_LABELS[processingStatus] || 'Обработка...'}
                </p>
                <p className="text-sm" style={{ color: 'var(--text-faint)' }}>Пожалуйста, подождите</p>
              </>
            ) : (
              <>
                <div style={{ color: 'var(--text-faint)' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-base" style={{ color: 'var(--text)' }}>Перетащите файл или нажмите для выбора</p>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-faint)' }}>MP3, WAV, OGG, M4A, FLAC, WEBM</p>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => inputRef.current?.click()}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Выбрать файл
                  </button>
                </div>
              </>
            )}
            <input ref={inputRef} type="file" accept=".mp3,.wav,.ogg,.m4a,.flac,.webm" className="hidden" onChange={handleChange} />
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-lg text-sm text-red-600" style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)' }}>
              {error}
            </div>
          )}
        </div>

        <div style={card} className="p-6">
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--text)' }}>Какие данные мы редактируем</p>
          <div className="grid grid-cols-2 gap-3">
            {PD_TYPES.map((item) => (
              <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-subtle)' }}>
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
