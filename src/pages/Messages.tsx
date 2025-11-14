import { useEffect, useState } from 'react'
import { Search, MessageCircle, Send } from 'lucide-react'
import DashboardLayout from '../components/DashboardLayout'
import { apiRequest } from '../config/api'

interface Conversation {
  other_user_id: string
  display_name: string | null
  username: string | null
  avatar_url: string | null
  last_message: string | null
  last_message_time: string
  unread_count: number
}

interface Message {
  id: string
  sender_id: string
  recipient_id: string
  content: string
  created_at: string
  is_paid: boolean
  is_unlocked: boolean
  isLocked?: boolean
}

export default function Messages() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [search, setSearch] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [loadingConversations, setLoadingConversations] = useState(true)
  const [loadingThread, setLoadingThread] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load conversations
  useEffect(() => {
    let isMounted = true

    async function loadConversations() {
      try {
        setLoadingConversations(true)
        const data = await apiRequest('/messages/conversations')
        if (!isMounted) return
        setConversations(data.conversations || [])
        setFilteredConversations(data.conversations || [])
      } catch (err: any) {
        if (!isMounted) return
        setError(err.message || 'Failed to load conversations')
      } finally {
        if (isMounted) setLoadingConversations(false)
      }
    }

    loadConversations()

    return () => {
      isMounted = false
    }
  }, [])

  // Filter conversations by search
  useEffect(() => {
    const term = search.toLowerCase()
    if (!term) {
      setFilteredConversations(conversations)
      return
    }
    setFilteredConversations(
      conversations.filter((c) => {
        const name = (c.display_name || '').toLowerCase()
        const username = (c.username || '').toLowerCase()
        return name.includes(term) || username.includes(term)
      })
    )
  }, [search, conversations])

  // Load thread when a conversation is selected
  useEffect(() => {
    if (!selectedUserId) {
      setMessages([])
      return
    }

    let isMounted = true

    async function loadThread() {
      try {
        setLoadingThread(true)
        const data = await apiRequest(`/messages/thread/${selectedUserId}`)
        if (!isMounted) return
        setMessages(data.messages || [])
      } catch (err: any) {
        if (!isMounted) return
        setError(err.message || 'Failed to load messages')
      } finally {
        if (isMounted) setLoadingThread(false)
      }
    }

    loadThread()

    return () => {
      isMounted = false
    }
  }, [selectedUserId])

  const handleSelectConversation = (userId: string) => {
    setSelectedUserId(userId)
    setError(null)
  }

  const handleSend = async () => {
    if (!selectedUserId || !newMessage.trim() || sending) return

    try {
      setSending(true)
      setError(null)

      const payload = {
        recipientId: selectedUserId,
        content: newMessage.trim(),
        isPaid: false,
        price: null,
        mediaUrls: [] as string[],
      }

      const data = await apiRequest('/messages', {
        method: 'POST',
        body: JSON.stringify(payload),
      })

      const sent = data.data as Message
      // Prepend sent message (backend returns newest first in thread API)
      setMessages((prev) => [sent, ...prev])
      setNewMessage('')
    } catch (err: any) {
      setError(err.message || 'Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const activeConversation = selectedUserId
    ? conversations.find((c) => c.other_user_id === selectedUserId)
    : null

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div
          className="bg-white rounded-xl shadow-sm overflow-hidden"
          style={{ height: 'calc(100vh - 200px)' }}
        >
          <div className="grid grid-cols-12 h-full">
            {/* Conversations List */}
            <div className="col-span-4 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-bold mb-4">Messages</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search conversations..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {loadingConversations ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-sm text-gray-500">Loading conversations...</p>
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center p-8">
                      <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations yet</h3>
                      <p className="text-sm text-gray-500">Start messaging with creators or fans</p>
                    </div>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {filteredConversations.map((conv) => (
                      <li
                        key={conv.other_user_id}
                        className={`p-4 cursor-pointer hover:bg-gray-50 ${
                          selectedUserId === conv.other_user_id ? 'bg-gray-50' : ''
                        }`}
                        onClick={() => handleSelectConversation(conv.other_user_id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {conv.display_name || conv.username || 'Unknown user'}
                            </p>
                            {conv.last_message && (
                              <p className="text-sm text-gray-500 truncate mt-1">
                                {conv.last_message}
                              </p>
                            )}
                          </div>
                          {conv.unread_count > 0 && (
                            <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-semibold leading-none text-white bg-pink-600 rounded-full">
                              {conv.unread_count}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Message Thread */}
            <div className="col-span-8 flex flex-col bg-gray-50">
              {error && (
                <div className="px-4 py-2 bg-red-50 text-red-700 text-sm border-b border-red-100">
                  {error}
                </div>
              )}

              {!activeConversation ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <MessageCircle className="h-20 w-20 text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-gray-500">Choose a conversation from the left to start messaging.</p>
                </div>
              ) : (
                <>
                  {/* Thread header */}
                  <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {activeConversation.display_name || activeConversation.username || 'Conversation'}
                      </p>
                    </div>
                  </div>

                  {/* Messages list */}
                  <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col-reverse">
                    {loadingThread ? (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-sm text-gray-500">Loading messages...</p>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-sm text-gray-500">No messages in this conversation yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-3 flex flex-col-reverse">
                        {messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`max-w-md rounded-2xl px-4 py-2 text-sm shadow-sm ${
                              msg.sender_id === activeConversation.other_user_id
                                ? 'self-start bg-white text-gray-900'
                                : 'self-end bg-pink-600 text-white'
                            }`}
                          >
                            <p>{msg.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Composer */}
                  <div className="border-t border-gray-200 bg-white px-4 py-3">
                    <div className="flex items-end space-x-2">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        rows={1}
                        placeholder="Type a message..."
                        className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                      />
                      <button
                        onClick={handleSend}
                        disabled={!newMessage.trim() || sending}
                        className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-pink-600 text-white text-sm font-medium hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="h-4 w-4 mr-1" />
                        Send
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
