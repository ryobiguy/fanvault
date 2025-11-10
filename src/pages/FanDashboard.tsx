import { Link, useNavigate } from 'react-router-dom'
import { Heart, Search, Bell, Settings, LogOut, Star, Image, Video, MessageCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import AccountSwitcher from '../components/AccountSwitcher'

export default function FanDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <Heart className="h-8 w-8 text-pink-600" />
              <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                FanVault
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/explore" className="text-gray-700 hover:text-gray-900 font-medium hidden md:block">
                Explore
              </Link>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search creators..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 w-64"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <Link to="/messages" className="text-gray-700 hover:text-gray-900 p-2 relative">
                <MessageCircle className="h-6 w-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-pink-600 rounded-full"></span>
              </Link>
              <button className="text-gray-700 hover:text-gray-900 p-2 relative">
                <Bell className="h-6 w-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-pink-600 rounded-full"></span>
              </button>
              <Link to="/settings" className="text-gray-700 hover:text-gray-900 p-2">
                <Settings className="h-6 w-6" />
              </Link>
              <button onClick={handleLogout} className="text-gray-700 hover:text-gray-900 p-2">
                <LogOut className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name || 'Fan'}!</h1>
          <p className="text-gray-600">Latest content from creators you follow</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            <ContentPost
              creatorName="Sarah Johnson"
              creatorUsername="@sarahjfit"
              creatorAvatar="SJ"
              timeAgo="2 hours ago"
              type="image"
              caption="New workout routine! 💪 Exclusive for my subscribers"
              likes={234}
              comments={45}
              isSubscribed
            />
            <ContentPost
              creatorName="Mike Chen"
              creatorUsername="@mikecooks"
              creatorAvatar="MC"
              timeAgo="5 hours ago"
              type="video"
              caption="Behind the scenes of today's cooking session 🍳"
              likes={567}
              comments={89}
              isSubscribed
            />
            <ContentPost
              creatorName="Emma Davis"
              creatorUsername="@emmastyle"
              creatorAvatar="ED"
              timeAgo="1 day ago"
              type="image"
              caption="Exclusive photoshoot preview! ✨"
              likes={892}
              comments={156}
              isSubscribed
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Subscriptions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold mb-4">Your Subscriptions</h2>
              <div className="space-y-4">
                <SubscriptionItem
                  name="Sarah Johnson"
                  username="@sarahjfit"
                  avatar="SJ"
                  price="$9.99/mo"
                />
                <SubscriptionItem
                  name="Mike Chen"
                  username="@mikecooks"
                  avatar="MC"
                  price="$14.99/mo"
                />
                <SubscriptionItem
                  name="Emma Davis"
                  username="@emmastyle"
                  avatar="ED"
                  price="$19.99/mo"
                />
              </div>
              <button className="w-full mt-4 text-pink-600 hover:text-pink-700 font-medium text-sm">
                View All Subscriptions
              </button>
            </div>

            {/* Suggested Creators */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold mb-4">Suggested Creators</h2>
              <div className="space-y-4">
                <SuggestedCreator
                  name="Alex Rivera"
                  username="@alexart"
                  avatar="AR"
                  subscribers="12.5K"
                />
                <SuggestedCreator
                  name="Lisa Park"
                  username="@lisayoga"
                  avatar="LP"
                  subscribers="8.3K"
                />
                <SuggestedCreator
                  name="Tom Wilson"
                  username="@tomtech"
                  avatar="TW"
                  subscribers="15.2K"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <AccountSwitcher />
    </div>
  )
}

interface ContentPostProps {
  creatorName: string
  creatorUsername: string
  creatorAvatar: string
  timeAgo: string
  type: 'image' | 'video'
  caption: string
  likes: number
  comments: number
  isSubscribed: boolean
}

function ContentPost({
  creatorName,
  creatorUsername,
  creatorAvatar,
  timeAgo,
  type,
  caption,
  likes,
  comments,
  isSubscribed
}: ContentPostProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
            {creatorAvatar}
          </div>
          <div>
            <Link to={`/creator/${creatorUsername.slice(1)}`} className="font-semibold text-gray-900 hover:text-pink-600">
              {creatorName}
            </Link>
            <p className="text-sm text-gray-500">{creatorUsername} • {timeAgo}</p>
          </div>
        </div>
        {isSubscribed && (
          <span className="flex items-center space-x-1 text-sm text-pink-600 font-medium">
            <Star className="h-4 w-4 fill-current" />
            <span>Subscribed</span>
          </span>
        )}
      </div>

      {/* Content */}
      <div className="relative bg-gradient-to-br from-pink-100 to-purple-100 aspect-video flex items-center justify-center">
        {type === 'image' ? (
          <Image className="h-16 w-16 text-pink-600" />
        ) : (
          <Video className="h-16 w-16 text-purple-600" />
        )}
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Footer */}
      <div className="p-4">
        <p className="text-gray-900 mb-4">{caption}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button className="flex items-center space-x-2 text-gray-600 hover:text-pink-600 transition">
              <Heart className="h-5 w-5" />
              <span className="text-sm font-medium">{likes}</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-pink-600 transition">
              <span className="text-sm font-medium">{comments} Comments</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface SubscriptionItemProps {
  name: string
  username: string
  avatar: string
  price: string
}

function SubscriptionItem({ name, username, avatar, price }: SubscriptionItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
          {avatar}
        </div>
        <div>
          <p className="font-semibold text-sm text-gray-900">{name}</p>
          <p className="text-xs text-gray-500">{username}</p>
        </div>
      </div>
      <p className="text-xs text-gray-600 font-medium">{price}</p>
    </div>
  )
}

interface SuggestedCreatorProps {
  name: string
  username: string
  avatar: string
  subscribers: string
}

function SuggestedCreator({ name, username, avatar, subscribers }: SuggestedCreatorProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
          {avatar}
        </div>
        <div>
          <p className="font-semibold text-sm text-gray-900">{name}</p>
          <p className="text-xs text-gray-500">{subscribers} subscribers</p>
        </div>
      </div>
      <button className="px-3 py-1 bg-pink-600 text-white text-xs font-medium rounded-lg hover:bg-pink-700 transition">
        Follow
      </button>
    </div>
  )
}
