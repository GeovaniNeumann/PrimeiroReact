import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FaUser, FaLock } from 'react-icons/fa'
import './Login.css'

const Login = () => {
  const [email, setEmail] = useState('admin@admin.com')
  const [password, setPassword] = useState('admin123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Se já estiver autenticado, redireciona
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await login(email, password)
    
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error || 'Erro ao fazer login')
    }
    
    setLoading(false)
  }

  const fillAdmin = () => {
    setEmail('admin@admin.com')
    setPassword('admin123')
  }

  const fillUser = () => {
    setEmail('usuario@teste.com')
    setPassword('123456')
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo">
          <img src="/logo.png" alt="Logo" />
        </div>

        <h1>Bem-vindo de volta</h1>
        <p>Faça login para acessar sua carteira de clientes</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <FaUser /> E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
            />
          </div>

          <div className="form-group">
            <label>
              <FaLock /> Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar no Dashboard'}
          </button>
        </form>

        <div className="demo-credentials">
          <p>🔐 Credenciais de teste:</p>
          <code onClick={fillAdmin} style={{ cursor: 'pointer' }}>
            Admin: admin@admin.com / admin123
          </code>
          <code onClick={fillUser} style={{ cursor: 'pointer' }}>
            Usuário: usuario@teste.com / 123456
          </code>
        </div>
      </div>
    </div>
  )
}

export default Login