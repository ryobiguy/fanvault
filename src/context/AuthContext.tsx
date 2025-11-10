import { createContext, useContext, useState, ReactNode } from 'react'

export interface User {
  id: string
  name: string
  email: string
  username: string
  avatar: string
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
    email: 'sarah@fanvault.com',
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

  const login = async (email: string, _password: string): Promise<boolean> => {
    // Demo login - accept any password
    if (email === 'sarah@fanvault.com' || email === 'creator') {
      setUser(DEMO_ACCOUNTS.creator)
      localStorage.setItem('fanvault_user', JSON.stringify(DEMO_ACCOUNTS.creator))
      return true
    } else if (email === 'john@example.com' || email === 'fan') {
      setUser(DEMO_ACCOUNTS.fan)
      localStorage.setItem('fanvault_user', JSON.stringify(DEMO_ACCOUNTS.fan))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('fanvault_user')
  }

  const switchAccount = (accountType: 'creator' | 'fan') => {
    const account = DEMO_ACCOUNTS[accountType]
    setUser(account)
    localStorage.setItem('fanvault_user', JSON.stringify(account))
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
