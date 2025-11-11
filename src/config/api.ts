// API Configuration
export const API_URL = (import.meta as any).env?.VITE_API_URL || 'https://fanvault-production.up.railway.app/api'

// API helper function with auth token
export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const token = localStorage.getItem('directfans_token')
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (options.headers) {
    Object.assign(headers, options.headers)
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error?.message || 'API request failed')
  }

  return data
}
