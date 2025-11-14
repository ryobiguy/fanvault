import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authService } from '../services/authService'

export interface User {
  id: string
  name: string
  email: string
  username: string
  avatar?: string
  type: 'creator' | 'fan'
  bio?: string
  subscriptionPrice?: number
  subscribers?: number
  earnings?: number
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = authService.getStoredUser()
    const token = authService.getToken()
    
    if (storedUser && token) {
      // Verify token is still valid by fetching current user
      authService.getCurrentUser()
        .then(user => setUser(user))
        .catch(() => {
          // Token invalid, clear storage
          authService.logout()
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Try real API login first
      const { user: loggedInUser } = await authService.login({ email, password })
      setUser(loggedInUser)
      return true
    } catch (error) {
      return false
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
