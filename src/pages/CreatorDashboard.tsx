import { Link } from 'react-router-dom'
import { DollarSign, Users, Eye, TrendingUp, Upload, Image, Video, FileText, MessageCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import DashboardLayout from '../components/DashboardLayout'

export default function CreatorDashboard() {
  const { user } = useAuth()

  return (
    <DashboardLayout>
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name || 'Creator'}!</h1>
          <p className="text-gray-600">You keep 100% of your earnings • £10/month subscription</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<DollarSign className="h-8 w-8 text-green-600" />}
            title="Total Earnings"
            value={`£${user?.earnings?.toLocaleString() || '0'}`}
            change="+15% this month"
            positive
          />
          <StatCard
            icon={<Users className="h-8 w-8 text-blue-600" />}
            title="Subscribers"
            value={user?.subscribers?.toLocaleString() || '0'}
            change="+42 this week"
            positive
          />
          <StatCard
            icon={<Eye className="h-8 w-8 text-purple-600" />}
            title="Total Views"
            value="45.2K"
            change="+8% this week"
            positive
          />
          <StatCard
            icon={<TrendingUp className="h-8 w-8 text-pink-600" />}
            title="Engagement"
            value="92%"
            change="+5% this month"
            positive
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link to="/upload" className="flex items-center justify-center space-x-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-4 rounded-lg font-medium hover:shadow-lg transition">
              <Upload className="h-5 w-5" />
              <span>Upload Content</span>
            </Link>
            <Link to="/upload" className="flex items-center justify-center space-x-2 bg-white border-2 border-gray-300 text-gray-700 px-6 py-4 rounded-lg font-medium hover:border-pink-600 transition">
              <FileText className="h-5 w-5" />
              <span>Create Post</span>
            </Link>
            <Link to="/messages" className="flex items-center justify-center space-x-2 bg-white border-2 border-gray-300 text-gray-700 px-6 py-4 rounded-lg font-medium hover:border-pink-600 transition">
              <MessageCircle className="h-5 w-5" />
              <span>Message Fans</span>
            </Link>
          </div>
        </div>

        {/* Recent Content */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Recent Content</h2>
            <button className="text-pink-600 hover:text-pink-700 font-medium">View All</button>
          </div>
          <div className="space-y-4">
            <ContentItem
              type="image"
              title="Beach Photoshoot 2024"
              date="2 hours ago"
              views={1234}
              likes={456}
              earnings="$234"
            />
            <ContentItem
              type="video"
              title="Behind the Scenes Vlog"
              date="1 day ago"
              views={3421}
              likes={892}
              earnings="$567"
            />
            <ContentItem
              type="image"
              title="Exclusive Q&A Session"
              date="3 days ago"
              views={2156}
              likes={678}
              earnings="$345"
            />
          </div>
        </div>

        {/* Earnings Chart Placeholder */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Earnings Overview</h2>
          <div className="h-64 bg-gradient-to-br from-pink-50 to-orange-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Chart visualization would go here</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

interface StatCardProps {
  icon: React.ReactNode
  title: string
  value: string
  change: string
  positive: boolean
}

function StatCard({ icon, title, value, change, positive }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        {icon}
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm text-gray-600 mb-2">{title}</div>
      <div className={`text-sm font-medium ${positive ? 'text-green-600' : 'text-red-600'}`}>
        {change}
      </div>
    </div>
  )
}

interface ContentItemProps {
  type: 'image' | 'video'
  title: string
  date: string
  views: number
  likes: number
  earnings: string
}

function ContentItem({ type, title, date, views, likes, earnings }: ContentItemProps) {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-pink-300 transition">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-orange-100 rounded-lg flex items-center justify-center">
          {type === 'image' ? (
            <Image className="h-8 w-8 text-pink-600" />
          ) : (
            <Video className="h-8 w-8 text-purple-600" />
          )}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{date}</p>
        </div>
      </div>
      <div className="flex items-center space-x-6 text-sm">
        <div className="text-center">
          <div className="font-semibold text-gray-900">{views.toLocaleString()}</div>
          <div className="text-gray-500">Views</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-gray-900">{likes}</div>
          <div className="text-gray-500">Likes</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-green-600">{earnings}</div>
          <div className="text-gray-500">Earned</div>
        </div>
      </div>
    </div>
  )
}
