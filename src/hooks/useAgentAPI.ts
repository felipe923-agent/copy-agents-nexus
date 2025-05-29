
import { useState } from 'react'
import axios from 'axios'
import { WebhookResponse } from '@/types/agents'
import { useToast } from '@/hooks/use-toast'

const WEBHOOK_URL = 'https://REPLACE-WITH-MY-DOMAIN/webhook/agents-copy'

export const useAgentAPI = () => {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const { toast } = useToast()

  const callAgent = async (agentId: string) => {
    setLoading(true)
    setResult(null)

    try {
      console.log(`Calling agent: ${agentId}`)
      
      const response = await axios.post<WebhookResponse>(
        WEBHOOK_URL,
        { agent: agentId },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000, // 30 seconds timeout
        }
      )

      if (response.data && response.data.copy) {
        setResult(response.data.copy)
        toast({
          title: 'Sucesso!',
          description: 'Copy gerado com sucesso.',
        })
      } else {
        throw new Error('Resposta inválida da API')
      }
    } catch (error) {
      console.error('Error calling agent API:', error)
      toast({
        title: 'Erro',
        description: 'Falha ao gerar o copy. Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const clearResult = () => {
    setResult(null)
  }

  return {
    loading,
    result,
    callAgent,
    clearResult,
  }
}
