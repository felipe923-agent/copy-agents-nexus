
import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

export const AuthForm: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = isSignUp 
        ? await signUp(email, password)
        : await signIn(email, password)

      if (error) {
        toast({
          title: 'Erro',
          description: error.message,
          variant: 'destructive',
        })
      } else {
        if (isSignUp) {
          toast({
            title: 'Sucesso',
            description: 'Conta criada! Verifique seu email para confirmar.',
          })
        } else {
          navigate('/dashboard')
        }
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Algo deu errado. Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-bg-card border-border-card">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold text-text-light">
            Copy Agents Hub
          </CardTitle>
          <CardDescription className="text-text-muted">
            {isSignUp ? 'Crie sua conta' : 'Entre na sua conta'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-text-light">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-bg-primary border-border-card text-text-light"
                placeholder="seu@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-text-light">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-bg-primary border-border-card text-text-light"
                placeholder="••••••••"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-accent-gold hover:bg-accent-gold/90 text-bg-primary font-semibold"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="spinner border-bg-primary"></div>
                  Carregando...
                </div>
              ) : (
                isSignUp ? 'Criar Conta' : 'Entrar'
              )}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-accent-gold hover:underline text-sm"
            >
              {isSignUp 
                ? 'Já tem uma conta? Entre aqui' 
                : 'Não tem conta? Crie uma aqui'
              }
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
