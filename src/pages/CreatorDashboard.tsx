import { Link } from 'react-router-dom'
import { DollarSign, Users, Eye, TrendingUp, Upload, FileText, MessageCircle } from 'lucide-react'
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
            value="£0"
            change=""
          />
          <StatCard
            icon={<Users className="h-8 w-8 text-blue-600" />}
            title="Subscribers"
            value="0"
            change=""
          />
          <StatCard
            icon={<Eye className="h-8 w-8 text-purple-600" />}
            title="Total Views"
            value="0"
            change=""
          />
          <StatCard
            icon={<TrendingUp className="h-8 w-8 text-pink-600" />}
            title="Engagement"
            value="0%"
            change=""
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
          </div>
          <div className="text-center py-12">
            <Upload className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No content yet</h3>
            <p className="text-gray-600 mb-6">Start uploading content to share with your fans</p>
            <Link
              to="/upload"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition"
            >
              <Upload className="h-5 w-5" />
              <span>Upload Your First Content</span>
            </Link>
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
  positive?: boolean
}

function StatCard({ icon, title, value, change, positive }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        {icon}
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm text-gray-600 mb-2">{title}</div>
      {change && (
        <div className={`text-sm font-medium ${positive ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </div>
      )}
    </div>
  )
}

