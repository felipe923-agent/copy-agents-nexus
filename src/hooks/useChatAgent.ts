
import { useState } from 'react'
import axios from 'axios'
import { ChatMessage, WebhookResponse } from '@/types/agents'
import { useToast } from '@/hooks/use-toast'

const WEBHOOK_URL = 'https://REPLACE-WITH-MY-DOMAIN/webhook/agents-copy'

export const useChatAgent = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [currentAgent, setCurrentAgent] = useState<string | null>(null)
  const { toast } = useToast()

  const startChat = (agentId: string) => {
    setCurrentAgent(agentId)
    setMessages([{
      id: Date.now().toString(),
      content: 'Olá! Sou seu agente especializado. Como posso ajudá-lo hoje?',
      role: 'assistant',
      timestamp: new Date()
    }])
  }

  const sendMessage = async (content: string) => {
    if (!currentAgent) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setLoading(true)

    try {
      console.log(`Sending message to agent: ${currentAgent}`)
      
      const response = await axios.post<WebhookResponse>(
        WEBHOOK_URL,
        { 
          agent: currentAgent,
          message: content,
          conversation: messages 
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        }
      )

      if (response.data && response.data.copy) {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: response.data.copy,
          role: 'assistant',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        throw new Error('Resposta inválida da API')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast({
        title: 'Erro',
        description: 'Falha ao enviar mensagem. Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([])
    setCurrentAgent(null)
  }

  return {
    messages,
    loading,
    currentAgent,
    startChat,
    sendMessage,
    clearChat,
  }
}
