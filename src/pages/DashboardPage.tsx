
import React from 'react'
import { agents } from '@/data/agents'
import { AgentCard } from '@/components/AgentCard'
import { ChatInterface } from '@/components/ChatInterface'
import { useChatAgent } from '@/hooks/useChatAgent'

export const DashboardPage = () => {
  const { messages, loading, currentAgent, startChat, sendMessage, clearChat } = useChatAgent()

  const handleAgentClick = (agentId: string) => {
    startChat(agentId)
  }

  const getCurrentAgentData = () => {
    return agents.find(agent => agent.id === currentAgent)
  }

  const currentAgentData = getCurrentAgentData()

  if (currentAgent && currentAgentData) {
    return (
      <ChatInterface
        messages={messages}
        loading={loading}
        onSendMessage={sendMessage}
        onBack={clearChat}
        agentTitle={currentAgentData.title}
        agentEmoji={currentAgentData.emoji}
      />
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="border-b border-border-card bg-bg-card">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center">
          <h1 className="text-3xl font-bold text-text-light mb-2">
            Copy Agents Hub
          </h1>
          <p className="text-lg text-text-muted">
            Escolha um agente especializado para começar a conversar
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-text-light mb-4">
            Bem-vindo 👋
          </h2>
          <p className="text-xl text-text-muted max-w-2xl mx-auto leading-relaxed">
            Converse com nossos agentes especializados em copywriting. 
            Cada um tem expertise específica para ajudar você a criar conteúdos incríveis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onClick={() => handleAgentClick(agent.id)}
              disabled={loading}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
