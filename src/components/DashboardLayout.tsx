import { useState, ReactNode } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { 
  Heart, 
  Home, 
  Upload, 
  MessageCircle, 
  User, 
  Settings, 
  LogOut, 
  Search,
  Bell,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Users
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

interface DashboardLayoutProps {
  children: ReactNode
}

interface NavItem {
  icon: typeof Home
  label: string
  path: string
  badge?: number
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Navigation items based on user type
  const navItems: NavItem[] = user?.type === 'creator' 
    ? [
        { icon: Home, label: 'Dashboard', path: '/creator/dashboard' },
        { icon: Upload, label: 'Upload', path: '/upload' },
        { icon: MessageCircle, label: 'Messages', path: '/messages', badge: 3 },
        { icon: Users, label: 'Subscribers', path: '/subscribers' },
        { icon: DollarSign, label: 'Earnings', path: '/earnings' },
        { icon: User, label: 'Profile', path: '/profile/edit' },
      ]
    : [
        { icon: Home, label: 'Feed', path: '/fan/dashboard' },
        { icon: Search, label: 'Explore', path: '/explore' },
        { icon: MessageCircle, label: 'Messages', path: '/messages', badge: 2 },
        { icon: Heart, label: 'Subscriptions', path: '/subscriptions' },
        { icon: User, label: 'Profile', path: '/profile/edit' },
      ]

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar - Fixed */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
        <div className="h-full px-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-pink-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              DirectFans
            </span>
          </Link>

          {/* Account Info */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-pink-600 rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                {user?.avatar || user?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-gray-900">{user?.username}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.type}</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar - Fixed */}
      <aside 
        className={`fixed left-0 top-16 bottom-0 bg-white border-r border-gray-200 transition-all duration-300 z-40 ${
          sidebarExpanded ? 'w-64' : 'w-16'
        }`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setSidebarExpanded(!sidebarExpanded)}
          className="absolute -right-3 top-6 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
        >
          {sidebarExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>

        {/* Navigation Items */}
        <nav className="mt-8 px-2">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all ${
                      active
                        ? 'bg-pink-50 text-pink-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    title={!sidebarExpanded ? item.label : undefined}
                  >
                    <div className="relative">
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      {item.badge && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-600 text-white text-xs rounded-full flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {sidebarExpanded && (
                      <span className="font-medium">{item.label}</span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Bottom Actions */}
          <div className="mt-8 pt-8 border-t border-gray-200 space-y-1">
            <Link
              to="/settings"
              className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all ${
                isActive('/settings')
                  ? 'bg-pink-50 text-pink-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              title={!sidebarExpanded ? 'Settings' : undefined}
            >
              <Settings className="h-5 w-5 flex-shrink-0" />
              {sidebarExpanded && <span className="font-medium">Settings</span>}
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all"
              title={!sidebarExpanded ? 'Logout' : undefined}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {sidebarExpanded && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main 
        className={`pt-16 transition-all duration-300 ${
          sidebarExpanded ? 'ml-64' : 'ml-16'
        }`}
      >
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
