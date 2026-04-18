import React, { useRef } from 'react'

export default function UploadScreen({ onFileSelect, onDemo }) {
  const inputRef = useRef(null)

  function handleDrop(e) {
    e.preventDefault()
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
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Voice Data Redaction Service</h1>
          <p className="text-gray-500 text-sm">Автоматическая детекция и редакция персональных данных в голосовых записях</p>
        </div>

        {/* Drop zone */}
        <div
          className="border-2 border-dashed border-gray-200 rounded-xl p-12 flex flex-col items-center gap-4 cursor-pointer hover:border-blue-300 transition-colors"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
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
            <button
              onClick={onDemo}
              className="px-5 py-2.5 text-white text-sm font-medium rounded-lg transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
            >
              Загрузить демо
            </button>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".mp3,.wav,.ogg,.m4a"
            className="hidden"
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Help button */}
      <button className="fixed bottom-6 right-6 w-10 h-10 rounded-full bg-gray-800 text-white text-sm font-bold flex items-center justify-center shadow-lg hover:bg-gray-700 transition-colors">
        ?
      </button>
    </div>
  )
}
