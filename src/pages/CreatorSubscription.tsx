import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, Check, AlertCircle, Loader } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { stripeService } from '../services/stripeService'
import { useAuth } from '../context/AuthContext'

export default function CreatorSubscription() {
  const [loading, setLoading] = useState(true)
  const [subscribing, setSubscribing] = useState(false)
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user?.type !== 'creator') {
      navigate('/fan/dashboard')
      return
    }

    loadSubscriptionStatus()
  }, [user, navigate])

  const loadSubscriptionStatus = async () => {
    try {
      setLoading(true)
      const status = await stripeService.getSubscriptionStatus()
      setSubscriptionStatus(status)
    } catch (err: any) {
      setError(err.message || 'Failed to load subscription status')
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async () => {
    try {
      setSubscribing(true)
      setError('')
      await stripeService.createCreatorSubscription()
    } catch (err: any) {
      setError(err.message || 'Failed to start subscription')
      setSubscribing(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader className="h-8 w-8 animate-spin text-pink-600" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Creator Subscription</h1>
        <p className="text-gray-600 mb-8">Manage your DirectFans creator subscription</p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3 mb-6">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {subscriptionStatus?.subscribed ? (
          // Active Subscription
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-pink-500 to-orange-500 px-6 py-8 text-white">
              <div className="flex items-center space-x-3 mb-2">
                <Check className="h-6 w-6" />
                <h2 className="text-2xl font-bold">Active Subscription</h2>
              </div>
              <p className="text-pink-100">You're all set! Start creating amazing content.</p>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600">Plan</span>
                <span className="font-semibold text-gray-900">Creator Monthly</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600">Price</span>
                <span className="font-semibold text-gray-900">£10.00 / month</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600">Status</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>

              {subscriptionStatus.currentPeriodEnd && (
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">Next billing date</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(subscriptionStatus.currentPeriodEnd).toLocaleDateString()}
                  </span>
                </div>
              )}

              <div className="bg-pink-50 rounded-lg p-4 mt-6">
                <h3 className="font-semibold text-gray-900 mb-2">What you get:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-700">
                    <Check className="h-4 w-4 text-pink-600 mr-2" />
                    Keep 100% of your earnings
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <Check className="h-4 w-4 text-pink-600 mr-2" />
                    Unlimited content uploads
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <Check className="h-4 w-4 text-pink-600 mr-2" />
                    Direct messaging with fans
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <Check className="h-4 w-4 text-pink-600 mr-2" />
                    Pay-per-view content
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <Check className="h-4 w-4 text-pink-600 mr-2" />
                    Subscription tiers
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <Check className="h-4 w-4 text-pink-600 mr-2" />
                    Analytics & insights
                  </li>
                </ul>
              </div>

              <div className="pt-4">
                <p className="text-sm text-gray-500 text-center">
                  Need to update your payment method or cancel? Visit your{' '}
                  <a href="https://billing.stripe.com/p/login/test_00000000000000" className="text-pink-600 hover:text-pink-700 font-medium">
                    Stripe billing portal
                  </a>
                </p>
              </div>
            </div>
          </div>
        ) : (
          // No Subscription
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full mb-4">
                  <CreditCard className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Start Your Creator Journey</h2>
                <p className="text-gray-600">Subscribe to unlock all creator features</p>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-xl p-8 mb-8">
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-gray-900 mb-2">£10</div>
                  <div className="text-gray-600">per month</div>
                </div>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-700">
                    <Check className="h-5 w-5 text-pink-600 mr-3 flex-shrink-0" />
                    <span>Keep 100% of your earnings - we take 0% commission</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <Check className="h-5 w-5 text-pink-600 mr-3 flex-shrink-0" />
                    <span>Unlimited content uploads (photos, videos)</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <Check className="h-5 w-5 text-pink-600 mr-3 flex-shrink-0" />
                    <span>Direct messaging with your fans</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <Check className="h-5 w-5 text-pink-600 mr-3 flex-shrink-0" />
                    <span>Pay-per-view content & paid messages</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <Check className="h-5 w-5 text-pink-600 mr-3 flex-shrink-0" />
                    <span>Multiple subscription tiers for fans</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <Check className="h-5 w-5 text-pink-600 mr-3 flex-shrink-0" />
                    <span>Analytics & earnings dashboard</span>
                  </li>
                  <li className="flex items-center text-gray-700">
                    <Check className="h-5 w-5 text-pink-600 mr-3 flex-shrink-0" />
                    <span>Cancel anytime - no long-term commitment</span>
                  </li>
                </ul>

                <button
                  onClick={handleSubscribe}
                  disabled={subscribing}
                  className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {subscribing ? (
                    <span className="flex items-center justify-center">
                      <Loader className="animate-spin h-5 w-5 mr-2" />
                      Processing...
                    </span>
                  ) : (
                    'Subscribe Now'
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Secure payment powered by Stripe. Cancel anytime.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Why DirectFans?</h3>
                <p className="text-sm text-blue-800">
                  Unlike other platforms that take 20% commission, DirectFans only charges a flat £10/month fee. 
                  This means you keep 100% of what you earn from your fans. Perfect for creators who want to maximize their income!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
