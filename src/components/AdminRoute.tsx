
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

interface AdminRouteProps {
  children: React.ReactNode
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, loading, isAdmin } = useAuth()

  console.log('AdminRoute - user:', user?.email, 'loading:', loading, 'isAdmin:', isAdmin)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent-gold"></div>
          <p className="text-slate-400 mt-4">Verificando permissões...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    console.log('AdminRoute - No user, redirecting to login')
    return <Navigate to="/login" replace />
  }

  if (!isAdmin) {
    console.log('AdminRoute - User is not admin, redirecting to dashboard')
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
