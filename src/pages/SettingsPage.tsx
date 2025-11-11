import { User, Lock, Bell, CreditCard, Shield, Eye, Mail, Smartphone, Globe, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import DashboardLayout from '../components/DashboardLayout'

type SettingsTab = 'account' | 'privacy' | 'notifications' | 'billing' | 'security'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('account')

  const tabs = [
    { id: 'account' as SettingsTab, name: 'Account', icon: User },
    { id: 'privacy' as SettingsTab, name: 'Privacy', icon: Eye },
    { id: 'notifications' as SettingsTab, name: 'Notifications', icon: Bell },
    { id: 'billing' as SettingsTab, name: 'Billing', icon: CreditCard },
    { id: 'security' as SettingsTab, name: 'Security', icon: Shield }
  ]

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === 'account' && <AccountSettings />}
            {activeTab === 'privacy' && <PrivacySettings />}
            {activeTab === 'notifications' && <NotificationSettings />}
            {activeTab === 'billing' && <BillingSettings />}
            {activeTab === 'security' && <SecuritySettings />}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function AccountSettings() {
  const { user } = useAuth()
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState('')
  const [language, setLanguage] = useState('en')

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4">Account Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Smartphone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+44 7700 900000"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>

          <button className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition">
            Save Changes
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-red-200">
        <h2 className="text-xl font-bold text-red-600 mb-4">Danger Zone</h2>
        <p className="text-gray-600 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition">
          <Trash2 className="h-5 w-5" />
          <span>Delete Account</span>
        </button>
      </div>
    </div>
  )
}

function PrivacySettings() {
  const [profileVisibility, setProfileVisibility] = useState('public')
  const [showOnlineStatus, setShowOnlineStatus] = useState(true)
  const [allowMessages, setAllowMessages] = useState('subscribers')
  const [showSubscriberCount, setShowSubscriberCount] = useState(true)

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold mb-4">Privacy Settings</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Visibility
          </label>
          <select
            value={profileVisibility}
            onChange={(e) => setProfileVisibility(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="public">Public - Anyone can view</option>
            <option value="subscribers">Subscribers Only</option>
            <option value="private">Private - Hidden from search</option>
          </select>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-200">
          <div>
            <p className="font-medium text-gray-900">Show Online Status</p>
            <p className="text-sm text-gray-500">Let others see when you're active</p>
          </div>
          <button
            onClick={() => setShowOnlineStatus(!showOnlineStatus)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
              showOnlineStatus ? 'bg-pink-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                showOnlineStatus ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Who Can Message You
          </label>
          <select
            value={allowMessages}
            onChange={(e) => setAllowMessages(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="everyone">Everyone</option>
            <option value="subscribers">Subscribers Only</option>
            <option value="none">No One</option>
          </select>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-200">
          <div>
            <p className="font-medium text-gray-900">Show Subscriber Count</p>
            <p className="text-sm text-gray-500">Display your subscriber count publicly</p>
          </div>
          <button
            onClick={() => setShowSubscriberCount(!showSubscriberCount)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
              showSubscriberCount ? 'bg-pink-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                showSubscriberCount ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <button className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition">
          Save Privacy Settings
        </button>
      </div>
    </div>
  )
}

function NotificationSettings() {
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [pushNotifs, setPushNotifs] = useState(true)
  const [newSubscribers, setNewSubscribers] = useState(true)
  const [newMessages, setNewMessages] = useState(true)
  const [newComments, setNewComments] = useState(true)
  const [tips, setTips] = useState(true)

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold mb-4">Notification Preferences</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between py-3 border-b border-gray-200">
          <div>
            <p className="font-medium text-gray-900">Email Notifications</p>
            <p className="text-sm text-gray-500">Receive notifications via email</p>
          </div>
          <button
            onClick={() => setEmailNotifs(!emailNotifs)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
              emailNotifs ? 'bg-pink-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                emailNotifs ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-200">
          <div>
            <p className="font-medium text-gray-900">Push Notifications</p>
            <p className="text-sm text-gray-500">Receive push notifications on your device</p>
          </div>
          <button
            onClick={() => setPushNotifs(!pushNotifs)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
              pushNotifs ? 'bg-pink-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                pushNotifs ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <h3 className="font-semibold text-gray-900 mt-6 mb-3">Notify me about:</h3>

        <div className="flex items-center justify-between py-3 border-b border-gray-200">
          <p className="font-medium text-gray-900">New Subscribers</p>
          <button
            onClick={() => setNewSubscribers(!newSubscribers)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
              newSubscribers ? 'bg-pink-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                newSubscribers ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-200">
          <p className="font-medium text-gray-900">New Messages</p>
          <button
            onClick={() => setNewMessages(!newMessages)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
              newMessages ? 'bg-pink-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                newMessages ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-200">
          <p className="font-medium text-gray-900">Comments & Likes</p>
          <button
            onClick={() => setNewComments(!newComments)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
              newComments ? 'bg-pink-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                newComments ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-gray-200">
          <p className="font-medium text-gray-900">Tips & Purchases</p>
          <button
            onClick={() => setTips(!tips)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
              tips ? 'bg-pink-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                tips ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <button className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition mt-6">
          Save Notification Settings
        </button>
      </div>
    </div>
  )
}

function BillingSettings() {
  const { user } = useAuth()
  
  return (
    <div className="space-y-6">
      {user?.type === 'creator' && (
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-200 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-2">Creator Subscription</h2>
          <p className="text-gray-600 mb-4">
            Your monthly platform fee: <span className="font-bold text-pink-600">£10.00</span>
          </p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Next billing date: Dec 10, 2025</p>
              <p className="text-sm text-gray-600">Payment method: •••• 4242</p>
            </div>
            <button className="text-pink-600 hover:text-pink-700 font-medium">
              Update Payment Method
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4">Payment Methods</h2>
        <div className="space-y-4">
          <div className="border-2 border-gray-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <CreditCard className="h-8 w-8 text-gray-400" />
              <div>
                <p className="font-medium">•••• •••• •••• 4242</p>
                <p className="text-sm text-gray-500">Expires 12/25</p>
              </div>
            </div>
            <button className="text-red-600 hover:text-red-700 font-medium">Remove</button>
          </div>

          <button className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-pink-600 hover:text-pink-600 transition font-medium">
            + Add Payment Method
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4">Payout Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bank Account
            </label>
            <input
              type="text"
              placeholder="Not connected"
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          <button className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition">
            Connect Bank Account
          </button>
        </div>
      </div>
    </div>
  )
}

function SecuritySettings() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4">Change Password</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          <button className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition">
            Update Password
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4">Two-Factor Authentication</h2>
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="font-medium text-gray-900">Enable 2FA</p>
            <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
          </div>
          <button
            onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
              twoFactorEnabled ? 'bg-pink-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4">Active Sessions</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <p className="font-medium">Windows PC - Chrome</p>
              <p className="text-sm text-gray-500">London, UK • Active now</p>
            </div>
            <span className="text-green-600 text-sm font-medium">Current</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-200">
            <div>
              <p className="font-medium">iPhone - Safari</p>
              <p className="text-sm text-gray-500">London, UK • 2 hours ago</p>
            </div>
            <button className="text-red-600 hover:text-red-700 text-sm font-medium">
              Revoke
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
