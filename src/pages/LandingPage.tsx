import { Link } from 'react-router-dom'
import { Heart, DollarSign, Lock, TrendingUp, Users, Zap } from 'lucide-react'

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-pink-600" />
              <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                DirectFans
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/explore"
                className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg font-medium transition"
              >
                Explore
              </Link>
              <Link
                to="/login"
                className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg font-medium transition"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition transform hover:scale-105"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Keep 100% of Your Earnings.
            <br />
            <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Only £10/Month to Start.
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The creator-first platform where you keep every penny you earn. No commissions, no hidden fees.
            Just a simple £10 monthly subscription to access the platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup?type=creator"
              className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition transform hover:scale-105"
            >
              Start Creating
            </Link>
            <Link
              to="/signup?type=fan"
              className="bg-white text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-gray-300 hover:border-pink-600 transition"
            >
              Explore Creators
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">Why Choose DirectFans?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<DollarSign className="h-12 w-12 text-pink-600" />}
            title="Keep 100% of Earnings"
            description="Unlike OnlyFans, we don't take a cut. Pay £10/month and keep every penny you earn from your fans."
          />
          <FeatureCard
            icon={<Lock className="h-12 w-12 text-purple-600" />}
            title="Secure & Private"
            description="Bank-level encryption and privacy controls. Your content is protected and secure."
          />
          <FeatureCard
            icon={<TrendingUp className="h-12 w-12 text-pink-600" />}
            title="Multiple Revenue Streams"
            description="Subscriptions, pay-per-view content, paid messages, tips, and custom requests. You set the prices."
          />
          <FeatureCard
            icon={<Users className="h-12 w-12 text-purple-600" />}
            title="Direct Messaging"
            description="Send free or paid content directly to fans. Build real relationships and monetize private messages."
          />
          <FeatureCard
            icon={<Zap className="h-12 w-12 text-pink-600" />}
            title="Instant Payouts"
            description="Get paid quickly with weekly payouts. No waiting months for your hard-earned money."
          />
          <FeatureCard
            icon={<Heart className="h-12 w-12 text-purple-600" />}
            title="Creator-First"
            description="Built by creators, for creators. We listen to your feedback and continuously improve."
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-pink-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-5xl font-bold mb-2">50K+</div>
              <div className="text-xl opacity-90">Active Creators</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">100%</div>
              <div className="text-xl opacity-90">Earnings Kept by Creators</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">2M+</div>
              <div className="text-xl opacity-90">Subscribers</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Keep 100% of Your Earnings?</h2>
          <p className="text-xl text-gray-700 mb-8">
            Join DirectFans for just £10/month. No commissions. No hidden fees. Just you and your fans.
          </p>
          <Link
            to="/signup"
            className="inline-block bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition transform hover:scale-105"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Heart className="h-6 w-6 text-pink-500" />
                <span className="ml-2 text-xl font-bold">DirectFans</span>
              </div>
              <p className="text-gray-400">
                The only platform where creators keep 100% of their earnings. Just £10/month.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Creators</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">How it Works</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Resources</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Safety</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 DirectFans. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
