
import React from 'react'
import { Button } from '@/components/ui/button'
import { Conversation, Agent } from '@/types/agents'
import { Plus, MessageSquare, Trash2 } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ConversationSidebarProps {
  agent: Agent
  conversations: Conversation[]
  currentConversationId: string | null
  onConversationSelect: (conversationId: string) => void
  onNewConversation: () => void
  onDeleteConversation: (conversationId: string) => void
}

export const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  agent,
  conversations,
  currentConversationId,
  onConversationSelect,
  onNewConversation,
  onDeleteConversation
}) => {
  return (
    <div className="w-80 bg-slate-900/95 border-r border-slate-700/50 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-accent-gold/15 to-accent-gold/5 rounded-lg flex items-center justify-center border border-accent-gold/20">
            <MessageSquare className="w-5 h-5 text-accent-gold" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-100">{agent.title}</h2>
            <p className="text-sm text-slate-400">Conversas</p>
          </div>
        </div>
        
        <Button 
          onClick={onNewConversation}
          className="w-full bg-accent-gold hover:bg-accent-gold/90 text-slate-900 font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Conversa
        </Button>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {conversations.length === 0 ? (
            <div className="text-center text-slate-500 py-8">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhuma conversa ainda</p>
            </div>
          ) : (
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`group relative p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    currentConversationId === conversation.id
                      ? 'bg-accent-gold/10 border border-accent-gold/20'
                      : 'hover:bg-slate-800/50'
                  }`}
                  onClick={() => onConversationSelect(conversation.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium text-sm truncate ${
                        currentConversationId === conversation.id
                          ? 'text-accent-gold'
                          : 'text-slate-200'
                      }`}>
                        {conversation.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {conversation.messages.length} mensagem{conversation.messages.length !== 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-slate-600 mt-1">
                        {conversation.updatedAt.toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400 p-1 h-auto"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteConversation(conversation.id)
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
