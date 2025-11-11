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
  switchAccount: (accountType: 'creator' | 'fan') => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo accounts
const DEMO_ACCOUNTS = {
  creator: {
    id: 'creator-1',
    name: 'Sarah Johnson',
    email: 'sarah@directfans.com',
    username: 'sarahjfit',
    avatar: 'SJ',
    type: 'creator' as const,
    bio: 'Fitness coach & lifestyle creator 💪 Helping you achieve your fitness goals',
    subscriptionPrice: 9.99,
    subscribers: 1234,
    earnings: 12450
  },
  fan: {
    id: 'fan-1',
    name: 'John Smith',
    email: 'john@example.com',
    username: 'johnsmith',
    avatar: 'JS',
    type: 'fan' as const
  }
}

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
      // Fallback to demo accounts for development
      if (email === 'sarah@directfans.com' || email === 'creator') {
        setUser(DEMO_ACCOUNTS.creator)
        localStorage.setItem('directfans_user', JSON.stringify(DEMO_ACCOUNTS.creator))
        return true
      } else if (email === 'john@example.com' || email === 'fan') {
        setUser(DEMO_ACCOUNTS.fan)
        localStorage.setItem('directfans_user', JSON.stringify(DEMO_ACCOUNTS.fan))
        return true
      }
      return false
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const switchAccount = (accountType: 'creator' | 'fan') => {
    const account = DEMO_ACCOUNTS[accountType]
    setUser(account)
    localStorage.setItem('directfans_user', JSON.stringify(account))
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
    <AuthContext.Provider value={{ user, login, logout, switchAccount }}>
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
