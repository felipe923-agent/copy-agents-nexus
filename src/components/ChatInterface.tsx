
import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChatMessage } from '@/types/agents'
import { Send, ArrowLeft } from 'lucide-react'

interface ChatInterfaceProps {
  messages: ChatMessage[]
  loading: boolean
  onSendMessage: (message: string) => void
  onBack: () => void
  agentTitle: string
  agentEmoji: string
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  loading,
  onSendMessage,
  onBack,
  agentTitle,
  agentEmoji,
}) => {
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() && !loading) {
      onSendMessage(inputValue.trim())
      setInputValue('')
    }
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-bg-primary flex flex-col z-50">
      {/* Header */}
      <header className="border-b border-border-card bg-bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="text-text-muted hover:text-text-light"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{agentEmoji}</span>
            <div>
              <h1 className="text-lg font-semibold text-text-light">{agentTitle}</h1>
              <p className="text-sm text-text-muted">Agente Especializado</p>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] p-4 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-accent-gold text-bg-primary'
                      : 'bg-bg-card border border-border-card text-text-light'
                  }`}
                >
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </div>
                  <div className={`text-xs mt-2 opacity-70 ${
                    message.role === 'user' ? 'text-bg-primary' : 'text-text-muted'
                  }`}>
                    {message.timestamp.toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-bg-card border border-border-card text-text-light p-4 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <div className="spinner"></div>
                    <span className="text-sm text-text-muted">Digitando...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border-card bg-bg-card">
        <div className="max-w-4xl mx-auto p-4">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-1 bg-bg-primary border border-border-card rounded-xl px-4 py-3 text-text-light placeholder-text-muted focus:outline-none focus:border-accent-gold"
              disabled={loading}
            />
            <Button
              type="submit"
              disabled={!inputValue.trim() || loading}
              className="bg-accent-gold hover:bg-accent-gold/90 text-bg-primary px-6"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
