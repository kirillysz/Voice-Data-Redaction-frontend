import React, { useState, useRef } from 'react'
import UploadScreen from './components/UploadScreen.jsx'
import ResultsScreen from './components/ResultsScreen.jsx'
import { uploadAudio, pollJob } from './api.js'

const POLL_INTERVAL = 2000

export default function App() {
  const [screen, setScreen] = useState('upload')
  const [fileName, setFileName] = useState('')
  const [jobId, setJobId] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [processingStatus, setProcessingStatus] = useState('')
  const pollRef = useRef(null)

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
    setResult(null)
    setJobId(null)
    setError(null)
    setProcessing(false)
    setProcessingStatus('')
  }

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

  return (
    <UploadScreen
      onFileSelect={handleFileSelect}
      processing={processing}
      processingStatus={processingStatus}
      error={error}
    />
  )
}
