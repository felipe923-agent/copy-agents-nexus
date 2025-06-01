
import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChatMessage, Agent } from '@/types/agents'
import { Send, ArrowLeft } from 'lucide-react'
import { ConversationSidebar } from '@/components/ConversationSidebar'
import { useConversations } from '@/hooks/useConversations'
import { useChatAgent } from '@/hooks/useChatAgent'

interface ChatInterfaceProps {
  agent: Agent
  onBack: () => void
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  agent,
  onBack
}) => {
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const {
    conversations,
    currentConversationId,
    setCurrentConversationId,
    createConversation,
    addMessage,
    getCurrentConversation,
    getConversationsByAgent,
    deleteConversation
  } = useConversations()
  
  const { loading, sendMessage } = useChatAgent()

  const currentConversation = getCurrentConversation()
  const agentConversations = getConversationsByAgent(agent.id)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentConversation?.messages])

  const handleNewConversation = () => {
    createConversation(agent.id)
  }

  const handleConversationSelect = (conversationId: string) => {
    setCurrentConversationId(conversationId)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() && !loading && currentConversationId) {
      const messageContent = inputValue.trim()
      setInputValue('')
      
      sendMessage(
        agent.id,
        messageContent,
        currentConversation?.messages || [],
        (message: ChatMessage) => addMessage(currentConversationId, message)
      )
    }
  }

  // Create first conversation if none exists
  useEffect(() => {
    if (agentConversations.length === 0) {
      createConversation(agent.id)
    }
  }, [agent.id, agentConversations.length, createConversation])

  if (!currentConversation) {
    return (
      <div className="fixed top-0 left-0 w-full h-full bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mb-4"></div>
          <p className="text-slate-400">Carregando conversa...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-slate-950 flex z-50">
      {/* Sidebar */}
      <ConversationSidebar
        agent={agent}
        conversations={agentConversations}
        currentConversationId={currentConversationId}
        onConversationSelect={handleConversationSelect}
        onNewConversation={handleNewConversation}
        onDeleteConversation={deleteConversation}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
          <div className="px-6 py-4 flex items-center gap-4">
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-slate-200"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-accent-gold/15 to-accent-gold/5 rounded-lg flex items-center justify-center border border-accent-gold/20">
                <span className="text-accent-gold text-sm">🤖</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-slate-100">{agent.title}</h1>
                <p className="text-sm text-slate-400">{currentConversation.title}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto px-6 py-6">
            <div className="space-y-6">
              {currentConversation.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] p-4 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-accent-gold text-slate-900'
                        : 'bg-slate-800/50 border border-slate-700/50 text-slate-100'
                    }`}
                  >
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </div>
                    <div className={`text-xs mt-2 opacity-70 ${
                      message.role === 'user' ? 'text-slate-700' : 'text-slate-400'
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
                  <div className="bg-slate-800/50 border border-slate-700/50 text-slate-100 p-4 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <div className="spinner"></div>
                      <span className="text-sm text-slate-400">Digitando...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto p-6">
            <form onSubmit={handleSubmit} className="flex gap-4">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-accent-gold/50 focus:ring-1 focus:ring-accent-gold/50"
                disabled={loading}
              />
              <Button
                type="submit"
                disabled={!inputValue.trim() || loading}
                className="bg-accent-gold hover:bg-accent-gold/90 text-slate-900 px-6"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
