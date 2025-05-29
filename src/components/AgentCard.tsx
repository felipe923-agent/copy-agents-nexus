
import React from 'react'
import { Agent } from '@/types/agents'
import { MessageCircle } from 'lucide-react'

interface AgentCardProps {
  agent: Agent
  onClick: () => void
  disabled?: boolean
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, onClick, disabled }) => {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`
        bg-bg-card border border-border-card rounded-2xl p-8 
        cursor-pointer card-hover flex flex-col items-center text-center
        min-h-[280px] justify-between space-y-6 group
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-accent-gold/50 hover:shadow-xl'}
      `}
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="text-6xl mb-2 group-hover:scale-110 transition-transform duration-300">
          {agent.emoji}
        </div>
        <h3 className="text-lg font-bold text-text-light group-hover:text-accent-gold transition-colors">
          {agent.title}
        </h3>
        <p className="text-sm text-text-muted leading-relaxed">
          {agent.description}
        </p>
      </div>
      
      <div className="flex items-center gap-2 text-accent-gold font-medium">
        <MessageCircle className="w-4 h-4" />
        <span className="text-sm">Iniciar conversa</span>
      </div>
    </div>
  )
}
