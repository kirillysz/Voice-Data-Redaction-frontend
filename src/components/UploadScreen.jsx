import React, { useRef } from 'react'

const STATUS_LABELS = {
  uploading: 'Загрузка файла...',
  queued: 'В очереди обработки...',
  started: 'Обрабатывается...',
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
    <div className="min-h-screen bg-[#eef2f7] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm p-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Voice Data Redaction Service</h1>
          <p className="text-gray-500 text-sm">Автоматическая детекция и редакция персональных данных в голосовых записях</p>
        </div>

        <div
          className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center gap-4 transition-colors ${
            processing
              ? 'border-blue-300 bg-blue-50 cursor-default'
              : 'border-gray-200 cursor-pointer hover:border-blue-300'
          }`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => !processing && inputRef.current?.click()}
        >
          {processing ? (
            <>
              <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
              <p className="font-semibold text-blue-700 text-base">
                {STATUS_LABELS[processingStatus] || 'Обработка...'}
              </p>
              <p className="text-gray-400 text-sm">Пожалуйста, подождите</p>
            </>
          ) : (
            <>
              <div className="text-gray-400">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-800 text-base">Загрузите аудиозапись</p>
                <p className="text-gray-400 text-sm mt-1">Поддерживаются форматы: MP3, WAV, OGG, M4A</p>
              </div>
              <div className="flex gap-3 mt-2" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => inputRef.current?.click()}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Выбрать файл
                </button>
              </div>
            </>
          )}

          <input
            ref={inputRef}
            type="file"
            accept=".mp3,.wav,.ogg,.m4a,.flac,.webm"
            className="hidden"
            onChange={handleChange}
          />
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}
      </div>

      <button className="fixed bottom-6 right-6 w-10 h-10 rounded-full bg-gray-800 text-white text-sm font-bold flex items-center justify-center shadow-lg hover:bg-gray-700 transition-colors">
        ?
      </button>
    </div>
  )
}
