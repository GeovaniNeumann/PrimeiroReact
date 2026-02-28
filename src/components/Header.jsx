import React from 'react'
import { FaBell, FaSignOutAlt, FaUserCircle } from 'react-icons/fa'
import './Header.css'

const Header = ({ user, onLogout }) => {
  return (
    <header className="header">
      <div className="header-brand">
        <img src="https://i.ibb.co/MdtYrsZ/Captura-de-tela-2025-10-14-173640-removebg-preview.png" alt="Logo" className="logo" />
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
        <button className="btn-logout" onClick={onLogout}>
          <FaSignOutAlt />
          <span>Sair</span>
        </button>
      </div>
    </header>
  )
}

export default Header