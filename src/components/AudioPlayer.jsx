import React, { useState, useEffect, useRef, useCallback } from 'react'

const BAR_COUNT = 80

function generateWaveform() {
  const bars = []
  for (let i = 0; i < BAR_COUNT; i++) {
    const t = i / BAR_COUNT
    const wave = Math.sin(t * Math.PI * 8) * 0.2 + Math.sin(t * Math.PI * 3) * 0.25
    bars.push(Math.max(0.08, Math.min(1, 0.3 + wave + Math.random() * 0.25)))
  }
  return bars
}

const WAVEFORM = generateWaveform()

function formatTime(sec) {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

function isRedacted(barIndex, totalDuration, entities) {
  if (!totalDuration) return false
  const t = (barIndex / BAR_COUNT) * totalDuration
  return entities.some((e) => t >= e.start_sec && t <= e.end_sec)
}

export default function AudioPlayer({ audioUrl, entities = [] }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(100)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onDurationChange = () => setDuration(audio.duration || 0)
    const onEnded = () => setPlaying(false)
    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('durationchange', onDurationChange)
    audio.addEventListener('loadedmetadata', onDurationChange)
    audio.addEventListener('ended', onEnded)
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('durationchange', onDurationChange)
      audio.removeEventListener('loadedmetadata', onDurationChange)
      audio.removeEventListener('ended', onEnded)
    }
  }, [audioUrl])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100
  }, [volume])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) { audio.pause() } else { audio.play() }
    setPlaying(p => !p)
  }, [playing])

  function seek(delta) {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.max(0, Math.min(duration, audio.currentTime + delta))
  }

  function handleWaveformClick(e) {
    const audio = audioRef.current
    if (!audio || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * duration
  }

  const progress = duration ? currentTime / duration : 0

  return (
    <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.07)', padding: '1.5rem', transition: 'background-color 0.2s' }}>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <h2 className="text-lg font-semibold mb-5" style={{ color: 'var(--text)' }}>
        Аудио проигрыватель с визуализацией редакций
      </h2>

      <div className="relative h-24 flex items-center gap-px cursor-pointer mb-3 rounded-lg overflow-hidden" onClick={handleWaveformClick}>
        {WAVEFORM.map((height, i) => {
          const redacted = isRedacted(i, duration, entities)
          const isPast = (i / BAR_COUNT) <= progress
          let color
          if (redacted) { color = isPast ? '#ef4444' : '#fca5a5' }
          else { color = isPast ? '#3b82f6' : '#bfdbfe' }
          return (
            <div key={i} style={{ height: `${height * 100}%`, flex: 1, backgroundColor: color, borderRadius: '2px', minWidth: '2px', transition: 'background-color 0.1s' }} />
          )
        })}
        <div className="absolute top-0 bottom-0 w-0.5 bg-blue-600 pointer-events-none" style={{ left: `${progress * 100}%` }} />
      </div>

      <div className="flex justify-between text-xs mb-4" style={{ color: 'var(--text-faint)' }}>
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      <div className="flex items-center justify-center gap-6 mb-4">
        <button onClick={() => seek(-5)} style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm.5 6 8.5 6V6z" /></svg>
        </button>
        <button onClick={togglePlay} className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors shadow-md">
          {playing
            ? <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
            : <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
          }
        </button>
        <button onClick={() => seek(5)} style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z" /></svg>
        </button>
      </div>

      <div className="flex items-center gap-3">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-faint)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          {volume > 0 && <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />}
          {volume > 50 && <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />}
        </svg>
        <input type="range" min="0" max="100" value={volume} onChange={e => setVolume(Number(e.target.value))} className="flex-1 h-1 accent-blue-600 cursor-pointer" />
        <span className="text-xs w-8 text-right" style={{ color: 'var(--text-faint)' }}>{volume}%</span>
      </div>
    </div>
  )
}
