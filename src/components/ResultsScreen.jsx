import React from 'react'
import AudioPlayer from './AudioPlayer.jsx'
import TranscriptViewer from './TranscriptViewer.jsx'
import RedactionReport from './RedactionReport.jsx'
import { getAudioUrl } from '../api.js'

export default function ResultsScreen({ fileName, jobId, result, onNewRecording }) {
  const entities = result?.entities ?? []
  const redactedCount = entities.length

  return (
    <div className="min-h-screen bg-[#eef2f7] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Voice Data Redaction Service</h1>
          <p className="text-gray-500 text-sm">Автоматическая детекция и редакция персональных данных в голосовых записях</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm px-5 py-4 flex items-center gap-4 mb-4">
          <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{fileName}</p>
            <p className="text-xs text-gray-400">{redactedCount} сегментов редактировано</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <a
              href={getAudioUrl(jobId)}
              download
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Скачать редактированную запись
            </a>
            <button
              onClick={onNewRecording}
              className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Новая запись
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <AudioPlayer audioUrl={getAudioUrl(jobId)} entities={entities} />
          <TranscriptViewer
            originalTranscript={result?.original_transcript ?? ''}
            redactedTranscript={result?.redacted_transcript ?? ''}
            entities={entities}
            log={result?.log ?? []}
          />
          <RedactionReport entities={entities} log={result?.log ?? []} />
        </div>
      </div>


    </div>
  )
}
