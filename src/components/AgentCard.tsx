
import React from 'react'
import { Agent } from '@/types/agents'

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
        bg-bg-card border border-border-card rounded-xl p-6 
        cursor-pointer card-hover flex flex-col items-center text-center
        min-h-[180px] justify-center space-y-4
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-accent-gold/50'}
      `}
    >
      <div className="text-4xl mb-2">{agent.emoji}</div>
      <h3 className="text-sm font-medium uppercase tracking-wide text-text-light">
        {agent.title}
      </h3>
      <p className="text-xs text-text-muted leading-relaxed">
        {agent.description}
      </p>
    </div>
  )
}
