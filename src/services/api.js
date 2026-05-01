import { getToken } from '../utils/auth'

const endpoints = {
  requests: 'https://automation.tharrosai.com/webhook/notary-requests',
  requestDetail: 'https://automation.tharrosai.com/webhook/notary-request-detail',
  requestStatus: 'https://automation.tharrosai.com/webhook/notary-request-status',
  metrics: 'https://automation.tharrosai.com/webhook/notary-metrics',
}

function unwrapN8nResponse(data) {
  if (Array.isArray(data)) return data[0] || null
  return data
}

function normalizeBoolean(value) {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') return ['true', 'yes', '1'].includes(value.toLowerCase())
  return Boolean(value)
}

function normalizeRequest(request) {
  const callbackValue = request.needs_michael_callback ?? request.needs_micheal_callback
  return {
    call_id: String(request.call_id || ''),
    timestamp: request.timestamp || '',
    caller_phone: request.caller_phone || '',
    caller_name: request.caller_name || 'Unknown Caller',
    call_type: request.call_type || '',
    service_type: request.service_type || '',
    document_type: request.document_type || '',
    location_address: request.location_address || '',
    preferred_date: request.preferred_date || '',
    preferred_time: request.preferred_time || '',
    urgency: request.urgency || 'normal',
    needs_michael_callback: normalizeBoolean(callbackValue),
    call_summary: request.call_summary || '',
    price_mentioned: normalizeBoolean(request.price_mentioned),
    quoted_price: Number(request.quoted_price || 0),
    confidence_score: Number(request.confidence_score || 0),
    call_status: (request.call_status || 'new').toLowerCase(),
  }
}

async function fetchJson(url, options = {}) {
  const token = getToken()
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
      ...(options.headers || {}),
    },
  })

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`)
  }

  return response.json()
}

export async function login(credentials) {
  if (credentials.username && credentials.password) {
    return { token: 'mock-notary-token', user: { name: 'MKR Notary' } }
  }
  throw new Error('Please enter username and password.')
}

export async function getRequests() {
  try {
    const data = await fetchJson(endpoints.requests)
    const records = Array.isArray(data) ? data : data?.requests
    if (!Array.isArray(records)) throw new Error('Invalid requests payload')
    return { requests: records.map(normalizeRequest), source: 'api', error: '' }
  } catch (error) {
    return { requests: [], source: 'unavailable', error: error.message }
  }
}

export async function getRequestDetail(callId) {
  try {
    const url = `${endpoints.requestDetail}?call_id=${encodeURIComponent(callId)}`
    const rawData = await fetchJson(url)
    console.log('notary-request-detail raw response:', rawData)
    const data = unwrapN8nResponse(rawData)
    if (!data || !data.success || !data.call) throw new Error('Invalid detail payload')

    return {
      success: true,
      call_id: data.call_id || callId,
      call: normalizeRequest(data.call),
      transcript: data.transcript || '',
      recording_url: data.recording_url || '',
      source: 'api',
      error: '',
    }
  } catch (error) {
    return {
      call_id: callId,
      call: null,
      transcript: '',
      recording_url: '',
      source: 'unavailable',
      error: error.message,
      success: false,
    }
  }
}

export async function updateRequestStatus(call_id, status, michael_notes = '') {
  const payload = { call_id, status, michael_notes }
  const token = getToken()

  try {
    const response = await fetch(endpoints.requestStatus, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`Request failed (${response.status})`)
    }

    const text = await response.text()
    let data = { success: true }

    if (text) {
      try {
        data = JSON.parse(text)
      } catch {
        data = { success: true }
      }
    }

    const unwrapped = unwrapN8nResponse(data) || { success: true }
    return { success: true, source: 'api', data: unwrapped }
  } catch {
    return { success: false, source: 'mock', data: payload, error: 'Unable to update status.' }
  }
}

export async function getMetrics() {
  try {
    const rawData = await fetchJson(endpoints.metrics)
    console.log('notary-metrics raw response:', rawData)
    const data = unwrapN8nResponse(rawData)
    if (!data || typeof data !== 'object') throw new Error('Invalid metrics payload')
    return { metrics: data, source: 'api', error: '' }
  } catch (error) {
    return { metrics: null, source: 'unavailable', error: error.message }
  }
}

export { endpoints }
