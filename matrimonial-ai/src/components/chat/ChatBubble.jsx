export default function ChatBubble({ message, isOwn }) {
  const { text, timestamp, status } = message

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl ${
          isOwn
            ? 'bg-primary-500 text-white rounded-br-md'
            : 'bg-neutral-100 text-neutral-900 rounded-bl-md'
        }`}
      >
        <p className="text-sm">{text}</p>
        <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : ''}`}>
          <span className={`text-xs ${isOwn ? 'text-primary-100' : 'text-neutral-400'}`}>
            {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isOwn && status && (
            <span className="text-xs text-primary-100">
              {status === 'sent' && '✓'}
              {status === 'delivered' && '✓✓'}
              {status === 'read' && '✓✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
