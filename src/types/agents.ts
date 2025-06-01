
export interface Agent {
  id: string
  title: string
  icon: string
  description: string
}

export interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

export interface Conversation {
  id: string
  title: string
  agentId: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
}

export interface WebhookResponse {
  copy: string
  success?: boolean
  error?: string
}
