import { Search, Send, Image, Video, DollarSign, Lock, Unlock, Paperclip, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import DashboardLayout from '../components/DashboardLayout'

interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar: string
  content: string
  isPaid: boolean
  price?: number
  isLocked: boolean
  hasMedia: boolean
  mediaType?: 'image' | 'video'
  timestamp: string
}

interface Conversation {
  id: string
  userId: string
  userName: string
  userAvatar: string
  lastMessage: string
  timestamp: string
  unread: number
  isCreator: boolean
}

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messageText, setMessageText] = useState('')
  const [isPaidMessage, setIsPaidMessage] = useState(false)
  const [messagePrice, setMessagePrice] = useState('5.00')

  const conversations: Conversation[] = []
  const allMessages: Record<string, Message[]> = {}
  const messages: Message[] = []
  const selectedConv = null

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

interface MessageBubbleProps {
  message: Message
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isMe = message.senderId === 'me'

  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-md ${isMe ? 'order-2' : 'order-1'}`}>
        {!isMe && (
          <p className="text-xs text-gray-500 mb-1 ml-1">{message.senderName}</p>
        )}
        <div
          className={`rounded-2xl px-4 py-3 ${
            isMe
              ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white'
              : 'bg-gray-100 text-gray-900'
          }`}
        >
          {message.isPaid && message.isLocked ? (
            <div className="text-center py-4">
              <Lock className="h-8 w-8 mx-auto mb-2 opacity-70" />
              <p className="font-semibold mb-1">Locked Content</p>
              <p className="text-sm opacity-90 mb-3">
                {message.hasMedia && `${message.mediaType === 'image' ? 'Photo' : 'Video'} + Message`}
              </p>
              <button className="bg-white text-pink-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-50 transition">
                Unlock for £{message.price?.toFixed(2)}
              </button>
            </div>
          ) : (
            <>
              {message.hasMedia && !message.isLocked && (
                <div className="mb-2 rounded-lg overflow-hidden bg-gradient-to-br from-pink-100 to-orange-100 aspect-video flex items-center justify-center">
                  {message.mediaType === 'image' ? (
                    <Image className="h-12 w-12 text-pink-600" />
                  ) : (
                    <Video className="h-12 w-12 text-purple-600" />
                  )}
                </div>
              )}
              <p>{message.content}</p>
              {message.isPaid && !message.isLocked && (
                <div className="flex items-center space-x-1 mt-2 text-xs opacity-75">
                  <DollarSign className="h-3 w-3" />
                  <span>Paid content</span>
                </div>
              )}
            </>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1 ml-1">{message.timestamp}</p>
      </div>
    </div>
  )
}
