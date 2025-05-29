
export interface Agent {
  id: string
  title: string
  emoji: string
  description: string
}

export interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

export interface WebhookResponse {
  copy: string
  success?: boolean
  error?: string
}
