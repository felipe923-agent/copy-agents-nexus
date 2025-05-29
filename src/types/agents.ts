
export interface Agent {
  id: string
  title: string
  emoji: string
  description: string
}

export interface WebhookResponse {
  copy: string
  success?: boolean
  error?: string
}
