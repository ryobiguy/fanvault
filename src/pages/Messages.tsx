import { Search, MessageCircle } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'

export default function Messages() {

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
          <div className="grid grid-cols-12 h-full">
            {/* Conversations List */}
            <div className="col-span-4 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-bold mb-4">Messages</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto flex items-center justify-center">
                <div className="text-center p-8">
                  <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations yet</h3>
                  <p className="text-sm text-gray-500">Start messaging with creators or fans</p>
                </div>
              </div>
            </div>

            {/* Message Thread */}
            <div className="col-span-8 flex flex-col items-center justify-center bg-gray-50">
              <MessageCircle className="h-20 w-20 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose a conversation from the left to start messaging</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
