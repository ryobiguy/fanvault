import { loadStripe } from '@stripe/stripe-js'
import { apiRequest } from '../config/api'

const STRIPE_KEY = (import.meta as any).env?.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder'

export const stripeService = {
  async createCreatorSubscription() {
    const data = await apiRequest('/payments/create-creator-subscription', {
      method: 'POST',
    })
    
    const stripe = await loadStripe(STRIPE_KEY)
    if (stripe && data.url) {
      window.location.href = data.url
    }
    
    return data
  },

  async getSubscriptionStatus() {
    return await apiRequest('/payments/creator-subscription-status')
  },
}
