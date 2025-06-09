
import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'

interface UserProfile {
  id: string
  email: string | null
  role: string
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        // Se não encontrar o perfil, criar um básico
        if (error.code === 'PGRST116') {
          console.log('Profile not found, creating basic profile')
          setProfile({
            id: userId,
            email: user?.email || null,
            role: 'user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
        }
        return
      }

      console.log('Profile fetched successfully:', data)
      setProfile(data)
    } catch (error) {
      console.error('Error in fetchProfile:', error)
    }
  }

  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...')
        
        // Primeiro, configurar o listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state changed:', event, session?.user?.email)
            
            if (!mounted) return
            
            setSession(session)
            setUser(session?.user ?? null)
            
            if (session?.user) {
              // Usar setTimeout para evitar problemas de sincronia
              setTimeout(() => {
                if (mounted) {
                  fetchProfile(session.user.id)
                }
              }, 100)
            } else {
              setProfile(null)
            }
            
            setLoading(false)
          }
        )

        // Depois, verificar sessão existente
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          setLoading(false)
          return
        }

        console.log('Current session:', session?.user?.email)
        
        if (mounted) {
          setSession(session)
          setUser(session?.user ?? null)
          
          if (session?.user) {
            await fetchProfile(session.user.id)
          }
          
          setLoading(false)
        }

        return () => {
          mounted = false
          subscription.unsubscribe()
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initializeAuth()

    return () => {
      mounted = false
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    console.log('Attempting to sign in with:', email)
    setLoading(true)
    
    try {
      const result = await supabase.auth.signInWithPassword({ email, password })
      console.log('Sign in result:', result)
      return result
    } catch (error) {
      console.error('Sign in error:', error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string) => {
    console.log('Attempting to sign up with:', email)
    setLoading(true)
    
    try {
      const redirectUrl = `${window.location.origin}/`
      const result = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      })
      console.log('Sign up result:', result)
      return result
    } catch (error) {
      console.error('Sign up error:', error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    console.log('Signing out...')
    setLoading(true)
    
    try {
      await supabase.auth.signOut()
      setUser(null)
      setSession(null)
      setProfile(null)
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin: profile?.role === 'admin'
  }

  console.log('Auth context value:', { 
    user: user?.email, 
    loading, 
    profile: profile?.role 
  })

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
