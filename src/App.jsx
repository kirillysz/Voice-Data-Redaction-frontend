import React, { useState, useRef, useEffect } from 'react'
import UploadScreen from './components/UploadScreen.jsx'
import ResultsScreen from './components/ResultsScreen.jsx'
import HistoryScreen from './components/HistoryScreen.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import { uploadAudio, pollJob } from './api.js'

const POLL_INTERVAL = 2000

export default function App() {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')
  const [screen, setScreen] = useState('upload')
  const [prevScreen, setPrevScreen] = useState(null)
  const [fileName, setFileName] = useState('')
  const [jobId, setJobId] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [processingStatus, setProcessingStatus] = useState('')
  const pollRef = useRef(null)

  useEffect(() => {
    const html = document.documentElement
    if (dark) {
      html.setAttribute('data-theme', 'dark')
    } else {
      html.removeAttribute('data-theme')
    }
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  function navigate(to) {
    setPrevScreen(screen)
    setScreen(to)
  }

  function goBack() {
    setScreen(prevScreen || 'upload')
    setPrevScreen(null)
  }

  function stopPolling() {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
  }

  async function startPolling(id) {
    pollRef.current = setInterval(async () => {
      try {
        const data = await pollJob(id)
        setProcessingStatus(data.status)
        if (data.status === 'done') {
          stopPolling()
          setResult(data)
          setProcessing(false)
          setScreen('results')
        } else if (data.status === 'failed') {
          stopPolling()
          setError(data.error || 'Ошибка обработки')
          setProcessing(false)
        }
      } catch (e) {
        stopPolling()
        setError(e.message)
        setProcessing(false)
      }
    }, POLL_INTERVAL)
  }

  async function handleFileSelect(file) {
    setFileName(file.name)
    setError(null)
    setProcessing(true)
    setProcessingStatus('uploading')
    try {
      const { job_id } = await uploadAudio(file)
      setJobId(job_id)
      setProcessingStatus('queued')
      startPolling(job_id)
    } catch (e) {
      setError(e.message)
      setProcessing(false)
    }
  }

  function handleNewRecording() {
    stopPolling()
    setScreen('upload')
    setPrevScreen(null)
    setResult(null)
    setJobId(null)
    setError(null)
    setProcessing(false)
    setProcessingStatus('')
  }

  function renderScreen() {
    if (screen === 'results') {
      return (
        <ResultsScreen
          fileName={fileName}
          jobId={jobId}
          result={result}
          onNewRecording={handleNewRecording}
        />
      )
    }
    if (screen === 'history') {
      return <HistoryScreen />
    }
    return (
      <UploadScreen
        onFileSelect={handleFileSelect}
        processing={processing}
        processingStatus={processingStatus}
        error={error}
      />
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-page)' }}>
      <Header
        dark={dark}
        onToggleDark={() => setDark(d => !d)}
        showBack={screen !== 'upload'}
        onBack={screen === 'results' ? handleNewRecording : () => setScreen('upload')}
        onHistory={() => navigate('history')}
      />
      <main key={screen} className="page-enter" style={{ flex: 1 }}>
        {renderScreen()}
      </main>
      <Footer />
    </div>
  )
}
