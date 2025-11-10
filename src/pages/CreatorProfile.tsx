import { Link } from 'react-router-dom'
import { Heart, ArrowLeft, Star, Image, Video, Lock, MessageCircle } from 'lucide-react'

export default function CreatorProfile() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/fan/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span>Back</span>
              </Link>
              <Link to="/explore" className="text-gray-600 hover:text-gray-900 font-medium">
                Explore
              </Link>
            </div>
            <Link to="/" className="flex items-center">
              <Heart className="h-8 w-8 text-pink-600" />
              <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                FanVault
              </span>
            </Link>
            <div className="w-24"></div>
          </div>
        </div>
      </nav>

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 h-48"></div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-20 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between">
              <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-6">
                <div className="w-32 h-32 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg">
                  SJ
                </div>
                <div className="pb-2">
                  <h1 className="text-3xl font-bold text-gray-900 mb-1">Sarah Johnson</h1>
                  <p className="text-gray-600 mb-2">@sarahjfit</p>
                  <p className="text-gray-700 max-w-2xl">
                    Fitness coach & lifestyle creator 💪 Helping you achieve your fitness goals
                  </p>
                  <div className="flex items-center space-x-6 mt-4 text-sm">
                    <div>
                      <span className="font-bold text-gray-900">1.2K</span>
                      <span className="text-gray-600 ml-1">Subscribers</span>
                    </div>
                    <div>
                      <span className="font-bold text-gray-900">234</span>
                      <span className="text-gray-600 ml-1">Posts</span>
                    </div>
                    <div>
                      <span className="font-bold text-gray-900">45K</span>
                      <span className="text-gray-600 ml-1">Likes</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-3 mt-4 md:mt-0">
                <button className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition flex items-center justify-center space-x-2">
                  <Star className="h-5 w-5" />
                  <span>Subscribe - $9.99/mo</span>
                </button>
                <button className="bg-white border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:border-pink-600 transition flex items-center justify-center space-x-2">
                  <MessageCircle className="h-5 w-5" />
                  <span>Message</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Tiers */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Subscription Tiers</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <SubscriptionTier
              name="Basic"
              price="$9.99"
              features={[
                'Access to all posts',
                'Exclusive photos',
                'Weekly updates',
                'Community access'
              ]}
              popular={false}
            />
            <SubscriptionTier
              name="Premium"
              price="$19.99"
              features={[
                'Everything in Basic',
                'Exclusive videos',
                'Direct messaging',
                'Custom content requests',
                'Early access to content'
              ]}
              popular={true}
            />
            <SubscriptionTier
              name="VIP"
              price="$49.99"
              features={[
                'Everything in Premium',
                'Video calls (monthly)',
                'Personalized content',
                'Priority support',
                'Behind the scenes access'
              ]}
              popular={false}
            />
          </div>
        </div>

        {/* Content Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Recent Content</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <ContentPreview type="image" locked={false} />
            <ContentPreview type="video" locked={false} />
            <ContentPreview type="image" locked={false} />
            <ContentPreview type="image" locked={true} />
            <ContentPreview type="video" locked={true} />
            <ContentPreview type="image" locked={true} />
          </div>
        </div>
      </div>
    </div>
  )
}

interface SubscriptionTierProps {
  name: string
  price: string
  features: string[]
  popular: boolean
}

function SubscriptionTier({ name, price, features, popular }: SubscriptionTierProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${popular ? 'ring-2 ring-pink-600' : ''} relative`}>
      {popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
            Most Popular
          </span>
        </div>
      )}
      <h3 className="text-xl font-bold mb-2">{name}</h3>
      <div className="mb-4">
        <span className="text-3xl font-bold">{price}</span>
        <span className="text-gray-600">/month</span>
      </div>
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Star className="h-5 w-5 text-pink-600 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      <button className={`w-full py-3 rounded-lg font-semibold transition ${
        popular
          ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:shadow-lg'
          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
      }`}>
        Subscribe
      </button>
    </div>
  )
}

interface ContentPreviewProps {
  type: 'image' | 'video'
  locked: boolean
}

function ContentPreview({ type, locked }: ContentPreviewProps) {
  return (
    <div className="relative aspect-square bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition">
      <div className="absolute inset-0 flex items-center justify-center">
        {locked ? (
          <Lock className="h-12 w-12 text-gray-400" />
        ) : type === 'image' ? (
          <Image className="h-12 w-12 text-pink-600" />
        ) : (
          <Video className="h-12 w-12 text-purple-600" />
        )}
      </div>
      {locked && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="text-center text-white">
            <Lock className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm font-semibold">Subscribe to unlock</p>
          </div>
        </div>
      )}
    </div>
  )
}
