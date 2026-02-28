import React, { useState, useEffect } from 'react'
import { FaTimes, FaUser, FaIdCard, FaBuilding, FaDollarSign, FaMapPin, FaEnvelope, FaPhone, FaCircle, FaCalendar } from 'react-icons/fa'
import './Modal.css'

const ClientModal = ({ isOpen, onClose, onSave, client = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    cnpj: '',
    porte: '',
    revenue_ytd: '',
    address: '',
    email: '',
    phone: '',
    status: 'Ativo',
    frequency_days: 30
  })

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || '',
        cnpj: client.cnpj || '',
        porte: client.porte || '',
        revenue_ytd: client.revenue_ytd || '',
        address: client.address || '',
        email: client.email || '',
        phone: client.phone || '',
        status: client.status || 'Ativo',
        frequency_days: client.frequency_days || 30
      })
    } else {
      setFormData({
        name: '',
        cnpj: '',
        porte: '',
        revenue_ytd: '',
        address: '',
        email: '',
        phone: '',
        status: 'Ativo',
        frequency_days: 30
      })
    }
  }, [client])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>
            {client ? <><FaUser /> Editar Cliente</> : <><FaUser /> Novo Cliente</>}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label><FaUser /> Nome*</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Nome do cliente"
              />
            </div>
            <div className="form-group">
              <label><FaIdCard /> CNPJ</label>
              <input
                type="text"
                name="cnpj"
                value={formData.cnpj}
                onChange={handleChange}
                placeholder="00.000.000/0001-00"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label><FaBuilding /> Porte*</label>
              <select
                name="porte"
                value={formData.porte}
                onChange={handleChange}
                required
              >
                <option value="">Selecione...</option>
                <option value="Pequeno">Pequeno</option>
                <option value="Médio">Médio</option>
                <option value="Grande">Grande</option>
              </select>
            </div>
            <div className="form-group">
              <label><FaDollarSign /> Faturamento YTD</label>
              <input
                type="number"
                name="revenue_ytd"
                value={formData.revenue_ytd}
                onChange={handleChange}
                placeholder="0,00"
                step="0.01"
              />
            </div>
          </div>

          <div className="form-group">
            <label><FaMapPin /> Endereço*</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Rua, número, bairro - Cidade"
            />
            <small>O sistema buscará as coordenadas automaticamente</small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label><FaEnvelope /> E-mail</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contato@empresa.com"
              />
            </div>
            <div className="form-group">
              <label><FaPhone /> Telefone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(41) 99999-9999"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label><FaCircle /> Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>
            <div className="form-group">
              <label><FaCalendar /> Frequência (dias)</label>
              <input
                type="number"
                name="frequency_days"
                value={formData.frequency_days}
                onChange={handleChange}
                min="1"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              {client ? 'Atualizar' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ClientModal // <--- IMPORTANTE: esta linha precisa estar aqui!