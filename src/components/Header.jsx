import React from 'react'
import { FaBell, FaSignOutAlt, FaUserCircle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Header.css'

const Header = ({ user }) => {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/login') // <-- ISSO É CRÍTICO
  }

  return (
    <header className="header">
      <div className="header-brand">
        <img src="/logo.png" alt="Logo" className="logo" />
        <div className="gerente-info">
          <h1>Minha Carteira de Clientes</h1>
          <span className="gerente-nome">
            <FaUserCircle />
            <span>{user?.email?.split('@')[0] || 'Usuário'}</span>
          </span>
        </div>
      </div>
      <div className="header-actions">
        <div className="notificacoes">
          <FaBell />
          <span className="badge">0</span>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          <FaSignOutAlt />
          <span>Sair</span>
        </button>
      </div>
    </header>
  )
}

export default Header