import { Link, useNavigate } from 'react-router-dom'
import { Heart, Search, Bell, Settings, LogOut, Star, TrendingUp, Users, Filter } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import AccountSwitcher from '../components/AccountSwitcher'

type Category = 'all' | 'fitness' | 'lifestyle' | 'art' | 'music' | 'cooking' | 'gaming' | 'education'
type SortBy = 'trending' | 'new' | 'subscribers' | 'price'

interface Creator {
  id: string
  name: string
  username: string
  avatar: string
  category: Category
  bio: string
  subscribers: string
  price: number
  isVerified: boolean
  coverImage: string
  previewImages: string[]
}

export default function Explore() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<Category>('all')
  const [sortBy, setSortBy] = useState<SortBy>('trending')
  const [showFilters, setShowFilters] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const categories = [
    { id: 'all' as Category, name: 'All', icon: '🌟' },
    { id: 'fitness' as Category, name: 'Fitness', icon: '💪' },
    { id: 'lifestyle' as Category, name: 'Lifestyle', icon: '✨' },
    { id: 'art' as Category, name: 'Art', icon: '🎨' },
    { id: 'music' as Category, name: 'Music', icon: '🎵' },
    { id: 'cooking' as Category, name: 'Cooking', icon: '👨‍🍳' },
    { id: 'gaming' as Category, name: 'Gaming', icon: '🎮' },
    { id: 'education' as Category, name: 'Education', icon: '📚' }
  ]

  const creators: Creator[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      username: '@sarahjfit',
      avatar: 'SJ',
      category: 'fitness',
      bio: 'Fitness coach & lifestyle creator 💪 Helping you achieve your fitness goals',
      subscribers: '12.4K',
      price: 9.99,
      isVerified: true,
      coverImage: 'fitness-cover',
      previewImages: ['img1', 'img2', 'img3']
    },
    {
      id: '2',
      name: 'Alex Martinez',
      username: '@alexcooks',
      avatar: 'AM',
      category: 'cooking',
      bio: 'Professional chef sharing recipes and cooking tips 👨‍🍳',
      subscribers: '8.7K',
      price: 7.99,
      isVerified: true,
      coverImage: 'cooking-cover',
      previewImages: ['img1', 'img2', 'img3']
    },
    {
      id: '3',
      name: 'Emma Davis',
      username: '@emmaart',
      avatar: 'ED',
      category: 'art',
      bio: 'Digital artist & illustrator 🎨 Tutorials and behind-the-scenes',
      subscribers: '15.2K',
      price: 12.99,
      isVerified: true,
      coverImage: 'art-cover',
      previewImages: ['img1', 'img2', 'img3']
    },
    {
      id: '4',
      name: 'Mike Chen',
      username: '@mikemusic',
      avatar: 'MC',
      category: 'music',
      bio: 'Music producer & DJ 🎵 Exclusive tracks and production tips',
      subscribers: '20.1K',
      price: 14.99,
      isVerified: true,
      coverImage: 'music-cover',
      previewImages: ['img1', 'img2', 'img3']
    },
    {
      id: '5',
      name: 'Lisa Park',
      username: '@lisayoga',
      avatar: 'LP',
      category: 'fitness',
      bio: 'Yoga instructor & wellness coach 🧘‍♀️ Daily yoga flows',
      subscribers: '9.3K',
      price: 8.99,
      isVerified: false,
      coverImage: 'yoga-cover',
      previewImages: ['img1', 'img2', 'img3']
    },
    {
      id: '6',
      name: 'Tom Wilson',
      username: '@tomtech',
      avatar: 'TW',
      category: 'education',
      bio: 'Tech educator 📚 Programming tutorials and career advice',
      subscribers: '18.5K',
      price: 11.99,
      isVerified: true,
      coverImage: 'tech-cover',
      previewImages: ['img1', 'img2', 'img3']
    },
    {
      id: '7',
      name: 'Sophie Laurent',
      username: '@sophiestyle',
      avatar: 'SL',
      category: 'lifestyle',
      bio: 'Fashion & lifestyle content ✨ Style tips and daily vlogs',
      subscribers: '25.8K',
      price: 15.99,
      isVerified: true,
      coverImage: 'lifestyle-cover',
      previewImages: ['img1', 'img2', 'img3']
    },
    {
      id: '8',
      name: 'Jake Rivers',
      username: '@jakegames',
      avatar: 'JR',
      category: 'gaming',
      bio: 'Pro gamer 🎮 Gameplay, tips, and exclusive streams',
      subscribers: '32.4K',
      price: 6.99,
      isVerified: true,
      coverImage: 'gaming-cover',
      previewImages: ['img1', 'img2', 'img3']
    }
  ]

  const filteredCreators = creators.filter(creator => {
    const matchesCategory = selectedCategory === 'all' || creator.category === selectedCategory
    const matchesSearch = creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         creator.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         creator.bio.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const sortedCreators = [...filteredCreators].sort((a, b) => {
    switch (sortBy) {
      case 'subscribers':
        return parseFloat(b.subscribers) - parseFloat(a.subscribers)
      case 'price':
        return a.price - b.price
      case 'new':
        return b.id.localeCompare(a.id)
      default: // trending
        return parseFloat(b.subscribers) - parseFloat(a.subscribers)
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <Heart className="h-8 w-8 text-pink-600" />
              <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
                DirectFans
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link to={user.type === 'creator' ? '/creator/dashboard' : '/fan/dashboard'} className="text-gray-700 hover:text-gray-900 font-medium">
                    Dashboard
                  </Link>
                  <button className="text-gray-700 hover:text-gray-900 p-2 relative">
                    <Bell className="h-6 w-6" />
                  </button>
                  <button className="text-gray-700 hover:text-gray-900 p-2">
                    <Settings className="h-6 w-6" />
                  </button>
                  <button onClick={handleLogout} className="text-gray-700 hover:text-gray-900 p-2">
                    <LogOut className="h-6 w-6" />
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-gray-900 font-medium">
                    Log In
                  </Link>
                  <Link to="/signup" className="bg-gradient-to-r from-pink-600 to-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Creators</h1>
          <p className="text-gray-600">Discover amazing creators and exclusive content</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search creators by name, username, or interests..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:border-pink-600 transition"
            >
              <Filter className="h-5 w-5" />
              <span className="font-medium">Filters</span>
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-700">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortBy)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="trending">Trending</option>
                  <option value="new">Newest</option>
                  <option value="subscribers">Most Subscribers</option>
                  <option value="price">Lowest Price</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Category Tabs */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex space-x-2 min-w-max pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-pink-600 to-orange-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{sortedCreators.length}</span> creators
          </p>
        </div>

        {/* Creators Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCreators.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>

        {sortedCreators.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No creators found matching your search</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
              className="mt-4 text-pink-600 hover:text-pink-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
      <AccountSwitcher />
    </div>
  )
}

interface CreatorCardProps {
  creator: Creator
}

function CreatorCard({ creator }: CreatorCardProps) {
  return (
    <Link
      to={`/creator/${creator.username.replace('@', '')}`}
      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition group"
    >
      {/* Cover Image */}
      <div className="h-32 bg-gradient-to-br from-pink-400 to-orange-500 relative">
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition"></div>
      </div>

      {/* Avatar */}
      <div className="px-4 -mt-12 relative z-10">
        <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-white">
          {creator.avatar}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pt-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-gray-900">{creator.name}</h3>
            {creator.isVerified && (
              <Star className="h-4 w-4 text-pink-600 fill-pink-600" />
            )}
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-3">{creator.username}</p>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{creator.bio}</p>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1 text-gray-600">
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">{creator.subscribers}</span>
          </div>
          <div className="flex items-center space-x-1 text-pink-600">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-semibold">£{creator.price.toFixed(2)}/mo</span>
          </div>
        </div>

        {/* Preview Images */}
        <div className="grid grid-cols-3 gap-1 mb-4">
          {creator.previewImages.map((_, index) => (
            <div
              key={index}
              className="aspect-square bg-gradient-to-br from-pink-100 to-orange-100 rounded"
            ></div>
          ))}
        </div>

        {/* Subscribe Button */}
        <button className="w-full bg-gradient-to-r from-pink-600 to-orange-600 text-white py-2 rounded-lg font-medium hover:shadow-lg transition">
          Subscribe
        </button>
      </div>
    </Link>
  )
}
