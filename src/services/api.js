import { getToken } from '../utils/auth'
import { mockAvailability, mockRequests } from './mockData'

const API_BASE = 'https://YOUR-N8N-HOST/webhook'

const endpoints = {
  login: `${API_BASE}/notary-login`,
  requests: `${API_BASE}/notary-requests`,
  requestAction: `${API_BASE}/notary-request-action`,
  saveAvailability: `${API_BASE}/notary-availability`,
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
  try {
    return await fetchJson(endpoints.login, {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  } catch {
    if (credentials.username && credentials.password) {
      return { token: 'mock-notary-token', user: { name: 'MKR Notary' } }
    }
    throw new Error('Please enter username and password.')
  }
}

export async function getRequests() {
  try {
    const data = await fetchJson(endpoints.requests)
    return Array.isArray(data) ? data : mockRequests
  } catch {
    return mockRequests
  }
}

export async function getRequestById(id) {
  const requests = await getRequests()
  return requests.find((request) => request.id === id)
}

export async function postRequestAction(id, action, note) {
  try {
    await fetchJson(endpoints.requestAction, {
      method: 'POST',
      body: JSON.stringify({ id, action, note }),
    })
  } catch {
    return { success: true, source: 'mock' }
  }

  return { success: true, source: 'api' }
}

export async function saveAvailability(availability) {
  try {
    await fetchJson(endpoints.saveAvailability, {
      method: 'POST',
      body: JSON.stringify(availability),
    })
    return { success: true, source: 'api' }
  } catch {
    return { success: true, source: 'mock' }
  }
}

export function getDefaultAvailability() {
  return mockAvailability
}

export { endpoints }
