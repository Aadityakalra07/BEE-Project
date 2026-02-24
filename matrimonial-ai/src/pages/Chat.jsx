import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Phone, Video, MoreVertical, Info } from 'lucide-react'
import ChatBubble from '../components/chat/ChatBubble'
import ChatInput from '../components/chat/ChatInput'
import messages from '../data/messages.json'
import users from '../data/users.json'

export default function Chat() {
  const { id } = useParams()
  const user = users.find(u => u.id === id) || users[0]
  const [chatMessages, setChatMessages] = useState(messages)

  const handleSend = (text) => {
    const newMessage = {
      id: `msg${chatMessages.length + 1}`,
      chatId: 'c1',
      from: 'me',
      to: user.id,
      text,
      timestamp: new Date().toISOString(),
      status: 'sent'
    }
    setChatMessages([...chatMessages, newMessage])
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-neutral-50">
      {/* Chat Header */}
      <div className="bg-white border-b border-neutral-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/matches" className="p-2 -ml-2 text-neutral-500 hover:text-neutral-700">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <img
            src={user.photo}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h2 className="font-semibold text-neutral-900">{user.name}</h2>
            <p className="text-xs text-green-500 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Online
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-full">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-full">
            <Video className="w-5 h-5" />
          </button>
          <Link to={`/profile/${user.id}`} className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-full">
            <Info className="w-5 h-5" />
          </Link>
          <button className="p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-full">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Date Divider */}
        <div className="text-center">
          <span className="text-xs text-neutral-400 bg-neutral-200 px-3 py-1 rounded-full">
            Today
          </span>
        </div>

        {chatMessages.map((message) => (
          <ChatBubble
            key={message.id}
            message={message}
            isOwn={message.from === 'me'}
          />
        ))}
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} />
    </div>
  )
}
