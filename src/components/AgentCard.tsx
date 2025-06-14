
import React from 'react'
import { Agent } from '@/types/agents'
import { MessageCircle, Sparkles, FilePen, User, Layers, Clapperboard, PhoneCall, Mail } from 'lucide-react'

const iconMap = {
  'file-pen': FilePen,
  'user': User,
  'layers': Layers,
  'clapperboard': Clapperboard,
  'phone-call': PhoneCall,
  'mail': Mail,
}

interface AgentCardProps {
  agent: Agent
  onClick: () => void
  disabled?: boolean
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, onClick, disabled }) => {
  const IconComponent = iconMap[agent.icon as keyof typeof iconMap]

  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`
        relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 
        border border-slate-700/50 rounded-3xl p-8 backdrop-blur-sm
        cursor-pointer transition-all duration-500 flex flex-col items-center text-center
        min-h-[320px] justify-between space-y-6 group overflow-hidden
        shadow-2xl hover:shadow-slate-900/50
        ${disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:border-accent-gold/60 hover:-translate-y-2'
        }
      `}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-gold/10 rounded-full blur-3xl transform translate-x-16 -translate-y-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent-gold/5 rounded-full blur-2xl transform -translate-x-12 translate-y-12" />
      </div>

      <div className="relative flex flex-col items-center space-y-6 z-10">
        {/* Icon container */}
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-accent-gold/15 to-accent-gold/5 rounded-2xl flex items-center justify-center border border-accent-gold/20 group-hover:border-accent-gold/40 transition-all duration-500 group-hover:scale-105">
            {IconComponent && (
              <IconComponent 
                className="w-10 h-10 text-accent-gold group-hover:scale-110 transition-transform duration-300" 
                strokeWidth={1.5}
              />
            )}
            <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-accent-gold opacity-0 group-hover:opacity-100 transition-all duration-500" />
          </div>
        </div>

        <div className="space-y-3 text-center">
          <h3 className="text-xl font-bold text-slate-100 group-hover:text-accent-gold transition-colors duration-300 leading-tight">
            {agent.title}
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed max-w-xs group-hover:text-slate-300 transition-colors duration-300">
            {agent.description}
          </p>
        </div>
      </div>
      
      {/* Call to action button */}
      <div className="relative z-10 flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-accent-gold/10 to-accent-gold/5 rounded-xl border border-accent-gold/20 group-hover:border-accent-gold/40 group-hover:bg-gradient-to-r group-hover:from-accent-gold/15 group-hover:to-accent-gold/8 transition-all duration-300">
        <MessageCircle className="w-4 h-4 text-accent-gold" />
        <span className="text-sm font-medium text-accent-gold">Iniciar Conversa</span>
      </div>
    </div>
  )
}
