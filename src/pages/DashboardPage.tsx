
import React from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { agents } from '@/data/agents'
import { AgentCard } from '@/components/AgentCard'
import { ResultPanel } from '@/components/ResultPanel'
import { useAgentAPI } from '@/hooks/useAgentAPI'
import { Button } from '@/components/ui/button'

export const DashboardPage = () => {
  const { user, signOut } = useAuth()
  const { loading, result, callAgent, clearResult } = useAgentAPI()

  const handleAgentClick = (agentId: string) => {
    callAgent(agentId)
  }

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="border-b border-border-card bg-bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-text-light">Copy Agents Hub</h1>
          <div className="flex items-center gap-4">
            <span className="text-text-muted text-sm">{user?.email}</span>
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="border-border-card text-text-muted hover:bg-accent-gold hover:text-bg-primary"
            >
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-text-light mb-2">
            Bem-vindo 👋
          </h2>
          <p className="text-text-muted">
            Escolha um agente para gerar seu copy personalizado
          </p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
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

      {/* Result Panel */}
      {(loading || result) && (
        <ResultPanel
          result={result || ''}
          onBack={clearResult}
          loading={loading}
        />
      )}
    </div>
  )
}
