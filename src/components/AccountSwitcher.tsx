import { useAuth } from '../context/AuthContext'
import { User, Briefcase } from 'lucide-react'

export default function AccountSwitcher() {
  const { user, switchAccount } = useAuth()

  if (!user) return null

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200 z-50">
      <p className="text-xs font-semibold text-gray-700 mb-2">Demo Mode - Switch Account:</p>
      <div className="flex space-x-2">
        <button
          onClick={() => switchAccount('creator')}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
            user.type === 'creator'
              ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Briefcase className="h-4 w-4" />
          <span>Creator</span>
        </button>
        <button
          onClick={() => switchAccount('fan')}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
            user.type === 'fan'
              ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <User className="h-4 w-4" />
          <span>Fan</span>
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Current: <span className="font-semibold">{user.name}</span>
      </p>
    </div>
  )
}
