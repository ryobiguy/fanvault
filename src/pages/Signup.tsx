import { Link } from 'react-router-dom'
import { Mail, Lock, User, Briefcase, Users } from 'lucide-react'
import { useState } from 'react'

export default function Signup() {
  const [accountType, setAccountType] = useState<'creator' | 'fan'>('fan')

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center mb-8">
          <img src="/logo.png" alt="DirectFans" className="h-12" />
        </Link>

        {/* Signup Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Create Account</h1>
          <p className="text-gray-600 text-center mb-8">Join thousands of creators and fans</p>
          {accountType === 'creator' && (
            <div className="bg-gradient-to-r from-pink-50 to-orange-50 border border-pink-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700 text-center">
                <span className="font-semibold text-pink-600">Creator Subscription:</span> £10/month • Keep 100% of your earnings
              </p>
            </div>
          )}

          {/* Account Type Selection */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => setAccountType('fan')}
              className={`p-4 rounded-lg border-2 transition ${
                accountType === 'fan'
                  ? 'border-pink-600 bg-pink-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <Users className={`h-8 w-8 mx-auto mb-2 ${
                accountType === 'fan' ? 'text-pink-600' : 'text-gray-400'
              }`} />
              <p className={`font-semibold ${
                accountType === 'fan' ? 'text-pink-600' : 'text-gray-700'
              }`}>
                I'm a Fan
              </p>
              <p className="text-xs text-gray-500 mt-1">Support creators</p>
            </button>
            <button
              onClick={() => setAccountType('creator')}
              className={`p-4 rounded-lg border-2 transition ${
                accountType === 'creator'
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <Briefcase className={`h-8 w-8 mx-auto mb-2 ${
                accountType === 'creator' ? 'text-purple-600' : 'text-gray-400'
              }`} />
              <p className={`font-semibold ${
                accountType === 'creator' ? 'text-purple-600' : 'text-gray-700'
              }`}>
                I'm a Creator
              </p>
              <p className="text-xs text-gray-500 mt-1">Monetize content</p>
            </button>
          </div>

          <form className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Username (for creators) */}
            {accountType === 'creator' && (
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">@</span>
                  <input
                    id="username"
                    type="text"
                    placeholder="username"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start">
              <input
                type="checkbox"
                className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500 mt-1"
              />
              <label className="ml-2 text-sm text-gray-700">
                I agree to the{' '}
                <a href="#" className="text-pink-600 hover:text-pink-700 font-medium">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-pink-600 hover:text-pink-700 font-medium">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-105"
            >
              Create Account
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Social Signup */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm font-medium text-gray-700">Google</span>
            </button>
            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              <svg className="h-5 w-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="text-sm font-medium text-gray-700">Facebook</span>
            </button>
          </div>

          {/* Login Link */}
          <p className="mt-6 text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-pink-600 hover:text-pink-700 font-semibold">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
