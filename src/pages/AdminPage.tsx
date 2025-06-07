
import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { Navigate } from 'react-router-dom'
import { UserPlus, Users, Shield, Trash2 } from 'lucide-react'

interface UserProfile {
  id: string
  email: string | null
  role: string
  created_at: string
}

export const AdminPage = () => {
  const { isAdmin, loading: authLoading } = useAuth()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'admin' | 'user'>('user')
  const { toast } = useToast()

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching users:', error)
        toast({
          title: 'Erro',
          description: 'Falha ao carregar usuários',
          variant: 'destructive',
        })
        return
      }

      setUsers(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast({
        title: 'Erro',
        description: 'Email e senha são obrigatórios',
        variant: 'destructive',
      })
      return
    }

    try {
      setLoading(true)

      // Criar usuário no Supabase Auth
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      })

      if (error) {
        toast({
          title: 'Erro',
          description: error.message,
          variant: 'destructive',
        })
        return
      }

      // Atualizar o role do usuário se necessário
      if (data.user && role === 'admin') {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', data.user.id)

        if (updateError) {
          console.error('Error updating role:', updateError)
        }
      }

      toast({
        title: 'Sucesso',
        description: 'Usuário criado com sucesso',
      })

      setEmail('')
      setPassword('')
      setRole('user')
      await fetchUsers()
    } catch (error) {
      console.error('Error creating user:', error)
      toast({
        title: 'Erro',
        description: 'Falha ao criar usuário',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)

      if (error) {
        toast({
          title: 'Erro',
          description: 'Falha ao atualizar papel do usuário',
          variant: 'destructive',
        })
        return
      }

      toast({
        title: 'Sucesso',
        description: 'Papel do usuário atualizado com sucesso',
      })

      await fetchUsers()
    } catch (error) {
      console.error('Error updating user role:', error)
    }
  }

  const deleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) {
      return
    }

    try {
      const { error } = await supabase.auth.admin.deleteUser(userId)

      if (error) {
        toast({
          title: 'Erro',
          description: 'Falha ao excluir usuário',
          variant: 'destructive',
        })
        return
      }

      toast({
        title: 'Sucesso',
        description: 'Usuário excluído com sucesso',
      })

      await fetchUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  useEffect(() => {
    if (!authLoading && isAdmin) {
      fetchUsers()
    }
  }, [authLoading, isAdmin])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen bg-bg-primary p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-accent-gold" />
          <h1 className="text-3xl font-bold text-text-light">Painel Administrativo</h1>
        </div>

        {/* Create User Form */}
        <Card className="bg-bg-card border-border-card">
          <CardHeader>
            <CardTitle className="text-text-light flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-accent-gold" />
              Criar Novo Usuário
            </CardTitle>
            <CardDescription className="text-text-muted">
              Adicione novos usuários ao sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={createUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-text-light">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-bg-primary border-border-card text-text-light"
                    placeholder="usuario@exemplo.com"
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
                    minLength={6}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="text-text-light">Papel</Label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'admin' | 'user')}
                  className="w-full h-10 px-3 py-2 rounded-md border border-border-card bg-bg-primary text-text-light"
                >
                  <option value="user">Usuário</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="bg-accent-gold hover:bg-accent-gold/90 text-bg-primary font-semibold"
              >
                {loading ? 'Criando...' : 'Criar Usuário'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="bg-bg-card border-border-card">
          <CardHeader>
            <CardTitle className="text-text-light flex items-center gap-2">
              <Users className="w-5 h-5 text-accent-gold" />
              Usuários do Sistema
            </CardTitle>
            <CardDescription className="text-text-muted">
              Gerencie todos os usuários cadastrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="spinner"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-border-card hover:bg-bg-primary/50">
                    <TableHead className="text-text-light">Email</TableHead>
                    <TableHead className="text-text-light">Papel</TableHead>
                    <TableHead className="text-text-light">Criado em</TableHead>
                    <TableHead className="text-text-light">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow 
                      key={user.id}
                      className="border-border-card hover:bg-bg-primary/50"
                    >
                      <TableCell className="text-text-light">{user.email}</TableCell>
                      <TableCell>
                        <select
                          value={user.role}
                          onChange={(e) => updateUserRole(user.id, e.target.value)}
                          className="px-2 py-1 rounded border border-border-card bg-bg-primary text-text-light text-sm"
                        >
                          <option value="user">Usuário</option>
                          <option value="admin">Admin</option>
                        </select>
                      </TableCell>
                      <TableCell className="text-text-muted">
                        {new Date(user.created_at).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteUser(user.id)}
                          className="text-red-400 border-red-400 hover:bg-red-400/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
