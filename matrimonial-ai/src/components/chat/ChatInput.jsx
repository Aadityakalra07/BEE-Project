import { Send, Paperclip, Smile } from 'lucide-react'
import { useState } from 'react'

export default function ChatInput({ onSend }) {
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim()) {
      onSend(message)
      setMessage('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3 p-4 border-t border-neutral-100 bg-white">
      <button type="button" className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors">
        <Paperclip className="w-5 h-5" />
      </button>
      
      <div className="flex-1 relative">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="w-full px-4 py-3 bg-neutral-100 rounded-full outline-none focus:ring-2 focus:ring-primary-500 pr-10"
        />
        <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
          <Smile className="w-5 h-5" />
        </button>
      </div>
      
      <button 
        type="submit" 
        className="p-3 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  )
}
