const BASE = '/api'

export async function uploadAudio(file) {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(`${BASE}/transcriptions/redact`, {
    method: 'POST',
    body: form,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || `Upload failed: ${res.status}`)
  }
  return res.json() // { job_id, status }
}

export async function pollJob(jobId) {
  const res = await fetch(`${BASE}/transcriptions/redact/${jobId}`)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || `Poll failed: ${res.status}`)
  }
  return res.json() // RedactionResponse
}

export function getAudioUrl(jobId) {
  return `${BASE}/transcriptions/redact/${jobId}/audio`
}
