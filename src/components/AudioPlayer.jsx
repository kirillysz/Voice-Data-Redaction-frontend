import React, { useState, useEffect, useRef } from 'react'

const REDACTION_SEGMENTS = [
  { start: 1.7, end: 3.0 },
  { start: 5.1, end: 6.8 },
  { start: 8.9, end: 11.8 },
  { start: 13.2, end: 14.8 },
]

const TOTAL_DURATION = 18

function generateWaveform(count = 80) {
  const bars = []
  for (let i = 0; i < count; i++) {
    const t = i / count
    const base = 0.3
    const wave = Math.sin(t * Math.PI * 8) * 0.2 + Math.sin(t * Math.PI * 3) * 0.25
    const noise = Math.random() * 0.25
    bars.push(Math.max(0.08, Math.min(1, base + wave + noise)))
  }
  return bars
}

const WAVEFORM = generateWaveform()

function formatTime(sec) {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function isRedacted(barIndex, totalBars, totalDuration) {
  const t = (barIndex / totalBars) * totalDuration
  return REDACTION_SEGMENTS.some((seg) => t >= seg.start && t <= seg.end)
}

export default function AudioPlayer() {
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(100)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= TOTAL_DURATION) {
            setPlaying(false)
            return 0
          }
          return prev + 0.1
        })
      }, 100)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [playing])

  function handleWaveformClick(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    setCurrentTime(ratio * TOTAL_DURATION)
  }

  const progress = currentTime / TOTAL_DURATION

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-5">
        Аудио проигрыватель с визуализацией редакций
      </h2>

      {/* Waveform */}
      <div
        className="relative h-24 flex items-center gap-px cursor-pointer mb-3 rounded-lg overflow-hidden"
        onClick={handleWaveformClick}
      >
        {WAVEFORM.map((height, i) => {
          const barProgress = i / WAVEFORM.length
          const redacted = isRedacted(i, WAVEFORM.length, TOTAL_DURATION)
          const isPast = barProgress <= progress

          let color
          if (redacted) {
            color = isPast ? '#ef4444' : '#fca5a5'
          } else {
            color = isPast ? '#3b82f6' : '#bfdbfe'
          }

          return (
            <div
              key={i}
              style={{
                height: `${height * 100}%`,
                flex: 1,
                backgroundColor: color,
                borderRadius: '2px',
                minWidth: '2px',
                transition: 'background-color 0.1s',
              }}
            />
          )
        })}

        {/* Playhead */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-blue-600 pointer-events-none"
          style={{ left: `${progress * 100}%` }}
        />
      </div>

      {/* Time row */}
      <div className="flex justify-between text-xs text-gray-400 mb-4">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(TOTAL_DURATION)}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 mb-4">
        <button
          onClick={() => setCurrentTime(Math.max(0, currentTime - 5))}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 6h2v12H6zm.5 6 8.5 6V6z" />
          </svg>
        </button>

        <button
          onClick={() => setPlaying((p) => !p)}
          className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors shadow-md"
        >
          {playing ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>

        <button
          onClick={() => setCurrentTime(Math.min(TOTAL_DURATION, currentTime + 5))}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z" />
          </svg>
        </button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-3">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          {volume > 0 && <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />}
          {volume > 50 && <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />}
        </svg>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="flex-1 h-1 accent-blue-600 cursor-pointer"
        />
        <span className="text-xs text-gray-500 w-8 text-right">{volume}%</span>
      </div>
    </div>
  )
}
