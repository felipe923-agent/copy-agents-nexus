
import React from 'react'
import { Button } from '@/components/ui/button'

interface ResultPanelProps {
  result: string
  onBack: () => void
  loading?: boolean
}

export const ResultPanel: React.FC<ResultPanelProps> = ({ result, onBack, loading }) => {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result)
      // Could add a toast here for copy confirmation
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full bg-neutral-900/90 backdrop-blur flex flex-col items-center justify-center px-4 z-50">
        <div className="bg-bg-card border border-border-card rounded-xl p-8 max-w-2xl w-full text-center">
          <div className="spinner mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-text-light mb-2">Gerando...</h2>
          <p className="text-text-muted">Aguarde enquanto criamos seu copy personalizado</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-neutral-900/90 backdrop-blur flex flex-col items-center justify-center px-4 z-50 animate-fade-in">
      <div className="bg-bg-card border border-border-card rounded-xl p-6 max-w-4xl w-full max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-text-light">Resultado Gerado</h2>
          <Button
            onClick={onBack}
            variant="outline"
            className="border-border-card text-text-light hover:bg-accent-gold hover:text-bg-primary"
          >
            Voltar
          </Button>
        </div>
        
        <div className="flex-1 overflow-auto bg-bg-primary rounded-lg p-4 mb-4">
          <pre className="text-sm text-text-light font-mono whitespace-pre-wrap leading-relaxed">
            {result}
          </pre>
        </div>
        
        <Button
          onClick={copyToClipboard}
          className="bg-accent-gold hover:bg-accent-gold/90 text-bg-primary font-semibold"
        >
          📋 Copiar Texto
        </Button>
      </div>
    </div>
  )
}
