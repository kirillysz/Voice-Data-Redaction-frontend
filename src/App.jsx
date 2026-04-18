import React, { useState } from 'react'
import UploadScreen from './components/UploadScreen.jsx'
import ResultsScreen from './components/ResultsScreen.jsx'

export default function App() {
  const [screen, setScreen] = useState('upload')
  const [fileName, setFileName] = useState('demo_recording.mp3')

  function handleFileSelect(file) {
    setFileName(file.name)
    setScreen('results')
  }

  function handleDemo() {
    setFileName('demo_recording.mp3')
    setScreen('results')
  }

  function handleNewRecording() {
    setScreen('upload')
  }

  if (screen === 'results') {
    return <ResultsScreen fileName={fileName} onNewRecording={handleNewRecording} />
  }

  return <UploadScreen onFileSelect={handleFileSelect} onDemo={handleDemo} />
}
