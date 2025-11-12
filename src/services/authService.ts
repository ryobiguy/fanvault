import { apiRequest } from '../config/api'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  displayName: string
  username: string
  userType: 'creator' | 'fan'
}

export interface User {
  id: string
  email: string
  name: string
  username: string
  type: 'creator' | 'fan'
  avatar?: string
  bio?: string
  subscriptionPrice?: number
  subscribers?: number
  earnings?: number
}

export interface AuthResponse {
  token: string
  user: User
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    
    // Store token
    localStorage.setItem('directfans_token', data.token)
    localStorage.setItem('directfans_user', JSON.stringify(data.user))
    
    return data
  },

  async register(userData: RegisterData): Promise<AuthResponse> {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
    
    // Map backend response to frontend format
    const user = {
      ...data.user,
      type: data.user.userType || data.user.type,
      name: data.user.displayName || data.user.name,
    }
    
    // Store token
    localStorage.setItem('directfans_token', data.token)
    localStorage.setItem('directfans_user', JSON.stringify(user))
    
    return { token: data.token, user }
  },

  async getCurrentUser(): Promise<User> {
    const data = await apiRequest('/auth/me')
    return data.user
  },

  logout() {
    localStorage.removeItem('directfans_token')
    localStorage.removeItem('directfans_user')
  },

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('directfans_user')
    return userStr ? JSON.parse(userStr) : null
  },

  getToken(): string | null {
    return localStorage.getItem('directfans_token')
  }
}
