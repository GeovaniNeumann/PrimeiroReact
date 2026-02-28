import { supabase } from './supabase'

class Auth {
  async login(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      })

      if (error) throw error

      if (data.user) {
        const user = {
          id: data.user.id,
          email: data.user.email,
          role: data.user.user_metadata?.role || 'user'
        }

        // Salvar no localStorage
        localStorage.setItem('supabase_auth', JSON.stringify({
          user,
          session: data.session
        }))

        return { success: true, user }
      }
      
      throw new Error('Resposta inválida do servidor')
    } catch (error) {
      console.error('Erro no login:', error)
      return { success: false, error: error.message }
    }
  }

  async logout() {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Erro no logout:', error)
    } finally {
      localStorage.removeItem('supabase_auth')
      window.location.href = '/login'
    }
  }

  async getCurrentUser() {
    try {
      // Primeiro tenta pegar da sessão atual
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) throw sessionError
      
      if (session?.user) {
        return {
          id: session.user.id,
          email: session.user.email,
          role: session.user.user_metadata?.role || 'user'
        }
      }

      // Se não tiver sessão, tenta do localStorage
      const stored = localStorage.getItem('supabase_auth')
      if (stored) {
        const { user } = JSON.parse(stored)
        return user
      }

      return null
    } catch (error) {
      console.error('Erro ao buscar usuário:', error)
      
      // Fallback para localStorage
      const stored = localStorage.getItem('supabase_auth')
      if (stored) {
        const { user } = JSON.parse(stored)
        return user
      }
      
      return null
    }
  }

  async checkSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      return !!session
    } catch {
      // Fallback para localStorage
      return !!localStorage.getItem('supabase_auth')
    }
  }

  getUser() {
    // Versão síncrona para componentes
    const stored = localStorage.getItem('supabase_auth')
    if (stored) {
      const { user } = JSON.parse(stored)
      return user
    }
    return null
  }

  isAuthenticated() {
    return !!this.getUser()
  }

  isAdmin() {
    const user = this.getUser()
    return user?.role === 'admin'
  }
}

export default new Auth()