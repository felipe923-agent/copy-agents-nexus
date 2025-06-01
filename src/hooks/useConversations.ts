
import { useState, useCallback } from 'react'
import { Conversation, ChatMessage } from '@/types/agents'

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)

  const createConversation = useCallback((agentId: string): string => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'Nova conversa',
      agentId,
      messages: [{
        id: Date.now().toString(),
        content: 'Olá! Sou seu agente especializado. Como posso ajudá-lo hoje?',
        role: 'assistant',
        timestamp: new Date()
      }],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    setConversations(prev => [newConversation, ...prev])
    setCurrentConversationId(newConversation.id)
    return newConversation.id
  }, [])

  const addMessage = useCallback((conversationId: string, message: ChatMessage) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        const updatedConv = {
          ...conv,
          messages: [...conv.messages, message],
          updatedAt: new Date()
        }
        
        // Update title based on first user message
        if (message.role === 'user' && conv.messages.length === 1) {
          updatedConv.title = message.content.length > 30 
            ? message.content.substring(0, 30) + '...'
            : message.content
        }
        
        return updatedConv
      }
      return conv
    }))
  }, [])

  const getCurrentConversation = useCallback((): Conversation | null => {
    return conversations.find(conv => conv.id === currentConversationId) || null
  }, [conversations, currentConversationId])

  const getConversationsByAgent = useCallback((agentId: string): Conversation[] => {
    return conversations.filter(conv => conv.agentId === agentId)
  }, [conversations])

  const deleteConversation = useCallback((conversationId: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== conversationId))
    if (currentConversationId === conversationId) {
      setCurrentConversationId(null)
    }
  }, [currentConversationId])

  return {
    conversations,
    currentConversationId,
    setCurrentConversationId,
    createConversation,
    addMessage,
    getCurrentConversation,
    getConversationsByAgent,
    deleteConversation
  }
}
