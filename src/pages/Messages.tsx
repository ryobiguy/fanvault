import { Search, Send, Image, Video, DollarSign, Lock, Unlock, Paperclip } from 'lucide-react'
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

  // Messages organized by conversation
  const allMessages: Record<string, Message[]> = {
    '1': [
      {
        id: '1',
        senderId: 'user1',
        senderName: 'Sarah Johnson',
        senderAvatar: 'SJ',
        content: 'Hey! Thanks so much for subscribing to my content! 💕',
        isPaid: false,
        isLocked: false,
        hasMedia: false,
        timestamp: '10:30 AM'
      },
      {
        id: '2',
        senderId: 'me',
        senderName: 'You',
        senderAvatar: 'ME',
        content: 'Love your content! Keep it up!',
        isPaid: false,
        isLocked: false,
        hasMedia: false,
        timestamp: '10:32 AM'
      },
      {
        id: '3',
        senderId: 'user1',
        senderName: 'Sarah Johnson',
        senderAvatar: 'SJ',
        content: 'I have some exclusive content just for you! 🔥',
        isPaid: true,
        price: 10.00,
        isLocked: true,
        hasMedia: true,
        mediaType: 'image',
        timestamp: '10:35 AM'
      },
      {
        id: '4',
        senderId: 'user1',
        senderName: 'Sarah Johnson',
        senderAvatar: 'SJ',
        content: 'Here\'s a preview of what I\'m working on today!',
        isPaid: false,
        isLocked: false,
        hasMedia: true,
        mediaType: 'image',
        timestamp: '11:20 AM'
      }
    ],
    '2': [
      {
        id: '5',
        senderId: 'user2',
        senderName: 'Mike Chen',
        senderAvatar: 'MC',
        content: 'Check out my new cooking video! 🍳',
        isPaid: false,
        isLocked: false,
        hasMedia: false,
        timestamp: '9:15 AM'
      },
      {
        id: '6',
        senderId: 'me',
        senderName: 'You',
        senderAvatar: 'ME',
        content: 'Looks amazing! Can\'t wait to try it',
        isPaid: false,
        isLocked: false,
        hasMedia: false,
        timestamp: '9:20 AM'
      }
    ],
    '3': [
      {
        id: '7',
        senderId: 'user3',
        senderName: 'Emma Davis',
        senderAvatar: 'ED',
        content: 'Exclusive photoshoot preview! ✨',
        isPaid: true,
        price: 15.00,
        isLocked: true,
        hasMedia: true,
        mediaType: 'image',
        timestamp: '8:45 AM'
      },
      {
        id: '8',
        senderId: 'me',
        senderName: 'You',
        senderAvatar: 'ME',
        content: 'Interested! How do I unlock?',
        isPaid: false,
        isLocked: false,
        hasMedia: false,
        timestamp: '8:50 AM'
      }
    ]
  }

  const messages = allMessages[selectedConversation] || []
  const selectedConv = conversations.find(c => c.id === selectedConversation)

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
              <div className="flex-1 overflow-y-auto">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`w-full p-4 flex items-center space-x-3 hover:bg-gray-50 transition ${
                      selectedConversation === conv.id ? 'bg-pink-50 border-l-4 border-pink-600' : ''
                    }`}
                  >
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                        {conv.userAvatar}
                      </div>
                      {conv.unread > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-pink-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {conv.unread}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-gray-900">{conv.userName}</span>
                        <span className="text-xs text-gray-500">{conv.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Message Thread */}
            <div className="col-span-8 flex flex-col">
              {/* Thread Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                    {selectedConv?.userAvatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedConv?.userName}</h3>
                    <p className="text-sm text-gray-500">Active now</p>
                  </div>
                </div>
                <button
                  className="text-pink-600 hover:text-pink-700 font-medium text-sm"
                >
                  View Profile
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
              </div>

              {/* Message Composer */}
              <div className="p-4 border-t border-gray-200">
                {/* Paid Message Toggle (for creators) */}
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsPaidMessage(!isPaidMessage)}
                      className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                        isPaidMessage
                          ? 'bg-pink-100 text-pink-700 border border-pink-300'
                          : 'bg-gray-100 text-gray-700 border border-gray-300'
                      }`}
                    >
                      {isPaidMessage ? (
                        <>
                          <Lock className="h-4 w-4" />
                          <span>Paid Message</span>
                        </>
                      ) : (
                        <>
                          <Unlock className="h-4 w-4" />
                          <span>Free Message</span>
                        </>
                      )}
                    </button>
                    {isPaidMessage && (
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <input
                          type="number"
                          value={messagePrice}
                          onChange={(e) => setMessagePrice(e.target.value)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                          step="0.50"
                          min="0.50"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-600 hover:text-pink-600 transition">
                      <Image className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-pink-600 transition">
                      <Video className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-pink-600 transition">
                      <Paperclip className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Message Input */}
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder={isPaidMessage ? 'Type a paid message...' : 'Type a message...'}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <button className="bg-gradient-to-r from-pink-500 to-orange-500 text-white p-3 rounded-lg hover:shadow-lg transition">
                    <Send className="h-5 w-5" />
                  </button>
                </div>
                {isPaidMessage && (
                  <p className="text-xs text-gray-500 mt-2">
                    This message will be locked until the recipient pays £{messagePrice}
                  </p>
                )}
              </div>
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
