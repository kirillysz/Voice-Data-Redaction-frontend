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
  return res.json()
}

export async function pollJob(jobId) {
  const res = await fetch(`${BASE}/transcriptions/redact/${jobId}`)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || `Poll failed: ${res.status}`)
  }
  return res.json()
}

export function getAudioUrl(jobId) {
  return `${BASE}/transcriptions/redact/${jobId}/audio`
}

export async function fetchHistory({ page = 1, pageSize = 20, entityType } = {}) {
  const params = new URLSearchParams({ page, page_size: pageSize })
  if (entityType) params.set('entity_type', entityType)
  const res = await fetch(`${BASE}/transcriptions/history?${params}`)
  if (!res.ok) throw new Error(`History fetch failed: ${res.status}`)
  return res.json()
}

export async function deleteHistoryEntry(jobId) {
  const res = await fetch(`${BASE}/transcriptions/history/${jobId}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`Delete failed: ${res.status}`)
}
