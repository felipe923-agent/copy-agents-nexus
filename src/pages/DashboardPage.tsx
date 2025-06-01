import React from 'react'
import { agents } from '@/data/agents'
import { AgentCard } from '@/components/AgentCard'
import { ChatInterface } from '@/components/ChatInterface'
import { useChatAgent } from '@/hooks/useChatAgent'
import { useAuth } from '@/contexts/AuthContext'
import { Crown, Users, Target, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const DashboardPage = () => {
  const { messages, loading, currentAgent, startChat, sendMessage, clearChat } = useChatAgent()
  const { user, signOut } = useAuth()

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
        agentEmoji="🤖"
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-gold/3 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent-gold/2 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-accent-gold/3 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative border-b border-slate-800/50 bg-slate-900/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div className="text-center flex-1">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Crown className="w-8 h-8 text-accent-gold" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
                  Elite Copy Mentors
                </h1>
              </div>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Acesso exclusivo aos melhores especialistas em copywriting do mercado
              </p>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <div className="text-sm text-slate-400">
                  Olá, {user.email}
                </div>
              )}
              <Button
                onClick={signOut}
                variant="outline"
                size="sm"
                className="text-slate-300 border-slate-700 hover:bg-slate-800"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto py-16 px-6">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-accent-gold/10 border border-accent-gold/20 rounded-full px-6 py-2 mb-6">
            <Target className="w-4 h-4 text-accent-gold" />
            <span className="text-sm font-medium text-accent-gold">Mentoria Premium</span>
          </div>
          
          <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-clip-text text-transparent mb-6 leading-tight">
            Transforme Seu Copy em<br />
            <span className="bg-gradient-to-r from-accent-gold to-yellow-400 bg-clip-text text-transparent">
              Máquina de Vendas
            </span>
          </h2>
          
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-8">
            Converse diretamente com nossos mentores especializados. Cada um domina uma área específica 
            do copywriting para acelerar seus resultados de forma exponencial.
          </p>

          <div className="flex items-center justify-center gap-8 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-accent-gold" />
              <span>6 Especialistas</span>
            </div>
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-accent-gold" />
              <span>Acesso Vitalício</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-accent-gold" />
              <span>Resultados Garantidos</span>
            </div>
          </div>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agents.map((agent, index) => (
            <div
              key={agent.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <AgentCard
                agent={agent}
                onClick={() => handleAgentClick(agent.id)}
                disabled={loading}
              />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-block bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-slate-100 mb-3">
              Pronto para Acelerar Seus Resultados?
            </h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Escolha um mentor acima e comece sua jornada rumo ao copy que converte.
            </p>
            <div className="text-sm text-accent-gold font-medium">
              ↑ Clique em qualquer mentor para começar
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
