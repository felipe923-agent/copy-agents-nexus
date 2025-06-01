
import { useState } from 'react'
import axios from 'axios'
import { ChatMessage, WebhookResponse } from '@/types/agents'
import { useToast } from '@/hooks/use-toast'

const WEBHOOK_URL = 'https://REPLACE-WITH-MY-DOMAIN/webhook/agents-copy'

export const useChatAgent = () => {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const sendMessage = async (
    agentId: string, 
    content: string, 
    conversationMessages: ChatMessage[],
    onMessageAdded: (message: ChatMessage) => void
  ) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date()
    }

    onMessageAdded(userMessage)
    setLoading(true)

    try {
      console.log(`Sending message to agent: ${agentId}`)
      
      const response = await axios.post<WebhookResponse>(
        WEBHOOK_URL,
        { 
          agent: agentId,
          message: content,
          conversation: conversationMessages 
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
        onMessageAdded(assistantMessage)
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

  return {
    loading,
    sendMessage
  }
}
