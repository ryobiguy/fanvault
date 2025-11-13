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
  // Helper to map backend user to frontend format
  mapUser(backendUser: any): User {
    return {
      id: backendUser.id,
      email: backendUser.email,
      name: backendUser.displayName || backendUser.name,
      username: backendUser.username,
      type: backendUser.userType || backendUser.type,
      avatar: backendUser.avatar,
      bio: backendUser.bio,
      subscriptionPrice: backendUser.subscriptionPrice,
      subscribers: backendUser.subscribers,
      earnings: backendUser.earnings,
    }
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    
    // Map backend response to frontend format
    const user = this.mapUser(data.user)
    
    // Store token
    localStorage.setItem('directfans_token', data.token)
    localStorage.setItem('directfans_user', JSON.stringify(user))
    
    return { token: data.token, user }
  },

  async register(userData: RegisterData): Promise<AuthResponse> {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
    
    // Map backend response to frontend format
    const user = this.mapUser(data.user)
    
    // Store token
    localStorage.setItem('directfans_token', data.token)
    localStorage.setItem('directfans_user', JSON.stringify(user))
    
    return { token: data.token, user }
  },

  async getCurrentUser(): Promise<User> {
    const data = await apiRequest('/auth/me')
    return this.mapUser(data.user)
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
