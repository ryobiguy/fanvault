import { Camera, Save, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import DashboardLayout from '../components/DashboardLayout'

export default function EditProfile() {
  const { user } = useAuth()

  const [name, setName] = useState(user?.name || '')
  const [username, setUsername] = useState(user?.username || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [location, setLocation] = useState('')
  const [website, setWebsite] = useState('')
  
  // Subscription tiers
  const [basicPrice, setBasicPrice] = useState('9.99')
  const [premiumPrice, setPremiumPrice] = useState('19.99')
  const [vipPrice, setVipPrice] = useState('49.99')
  
  const [basicDescription, setBasicDescription] = useState('Access to all my content')
  const [premiumDescription, setPremiumDescription] = useState('Everything in Basic + exclusive content')
  const [vipDescription, setVipDescription] = useState('Everything + 1-on-1 messaging')

  const handleSave = () => {
    // This would save to backend
    console.log({
      name,
      username,
      bio,
      location,
      website,
      tiers: {
        basic: { price: basicPrice, description: basicDescription },
        premium: { price: premiumPrice, description: premiumDescription },
        vip: { price: vipPrice, description: vipDescription }
      }
    })
    alert('Profile updated successfully! (Demo)')
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Profile</h1>
          <p className="text-gray-600">Customize your creator profile and subscription tiers</p>
        </div>

        <div className="space-y-6">
          {/* Cover & Avatar */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Cover Photo */}
            <div className="h-48 bg-gradient-to-br from-pink-400 to-purple-500 relative group">
              <button className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition">
                  <Camera className="h-12 w-12 text-white mb-2" />
                  <p className="text-white font-medium">Change Cover Photo</p>
                </div>
              </button>
            </div>

            {/* Avatar */}
            <div className="px-6 -mt-16 relative z-10 pb-6">
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-white">
                  {user?.avatar || 'U'}
                </div>
                <button className="absolute bottom-0 right-0 bg-pink-600 text-white p-3 rounded-full hover:bg-pink-700 transition">
                  <Camera className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-500">@</span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  placeholder="Tell your fans about yourself..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <p className="text-sm text-gray-500 mt-1">{bio.length}/500 characters</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, Country"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Tiers */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Subscription Tiers</h2>
            <p className="text-gray-600 mb-6">Set up your subscription options for fans</p>

            <div className="space-y-6">
              {/* Basic Tier */}
              <div className="border-2 border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">Basic Tier</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-700">£</span>
                    <input
                      type="number"
                      value={basicPrice}
                      onChange={(e) => setBasicPrice(e.target.value)}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      step="0.50"
                    />
                    <span className="text-gray-500">/month</span>
                  </div>
                </div>
                <textarea
                  value={basicDescription}
                  onChange={(e) => setBasicDescription(e.target.value)}
                  rows={2}
                  placeholder="What's included in this tier?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              {/* Premium Tier */}
              <div className="border-2 border-pink-200 rounded-lg p-4 bg-pink-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-pink-600">Premium Tier</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-700">£</span>
                    <input
                      type="number"
                      value={premiumPrice}
                      onChange={(e) => setPremiumPrice(e.target.value)}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      step="0.50"
                    />
                    <span className="text-gray-500">/month</span>
                  </div>
                </div>
                <textarea
                  value={premiumDescription}
                  onChange={(e) => setPremiumDescription(e.target.value)}
                  rows={2}
                  placeholder="What's included in this tier?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              {/* VIP Tier */}
              <div className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-purple-600">VIP Tier</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-700">£</span>
                    <input
                      type="number"
                      value={vipPrice}
                      onChange={(e) => setVipPrice(e.target.value)}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                      step="0.50"
                    />
                    <span className="text-gray-500">/month</span>
                  </div>
                </div>
                <textarea
                  value={vipDescription}
                  onChange={(e) => setVipDescription(e.target.value)}
                  rows={2}
                  placeholder="What's included in this tier?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between bg-white rounded-xl shadow-sm p-6">
            <button
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              <X className="h-5 w-5" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition"
            >
              <Save className="h-5 w-5" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
