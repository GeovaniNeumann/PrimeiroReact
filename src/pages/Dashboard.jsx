import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import KPIs from '../components/KPIs'
import CalendarView from '../components/CalendarView'
import MapView from '../components/MapView'
import Charts from '../components/Charts'
import ClientTable from '../components/ClientTable'
import ClientModal from '../components/Modals/ClientModal'
import VisitaModal from '../components/Modals/VisitaModal'
import api from '../services/api'
import './Dashboard.css'

const Dashboard = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [clients, setClients] = useState([])
  const [filteredClients, setFilteredClients] = useState([])
  const [selectedClients, setSelectedClients] = useState(new Set())
  const [loading, setLoading] = useState(true)
  
  // Modais
  const [clientModalOpen, setClientModalOpen] = useState(false)
  const [visitaModalOpen, setVisitaModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState(null)
  const [selectedClientId, setSelectedClientId] = useState(null)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    loadClients()
  }, [isAuthenticated, navigate])

  const loadClients = async () => {
    setLoading(true)
    const data = await api.getClients()
    setClients(data)
    setFilteredClients(data)
    setLoading(false)
  }

  const handleFilter = (filters) => {
    let filtered = [...clients]
    
    if (filters.search) {
      filtered = filtered.filter(c => 
        c.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        c.cnpj?.includes(filters.search)
      )
    }
    
    if (filters.porte && filters.porte !== 'todos') {
      filtered = filtered.filter(c => c.porte === filters.porte)
    }
    
    if (filters.status && filters.status !== 'todos') {
      filtered = filtered.filter(c => c.status === filters.status)
    }
    
    setFilteredClients(filtered)
  }

  const handleSelectClient = (id) => {
    const newSelected = new Set(selectedClients)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedClients(newSelected)
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedClients(new Set(filteredClients.map(c => c.id)))
    } else {
      setSelectedClients(new Set())
    }
  }

  const handleEdit = (client) => {
    setEditingClient(client)
    setClientModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      await api.deleteClient(id)
      await loadClients()
    }
  }

  const handleSaveClient = async (clientData) => {
    if (editingClient) {
      await api.updateClient(editingClient.id, clientData)
    } else {
      await api.createClient(clientData)
    }
    await loadClients()
    setClientModalOpen(false)
    setEditingClient(null)
  }

  const handleAddVisita = (clientId = null) => {
    setSelectedClientId(clientId)
    setVisitaModalOpen(true)
  }

  const handleSaveVisita = async (visitaData) => {
    await api.updateClient(visitaData.clienteId, {
      next_contact: visitaData.data
    })
    await loadClients()
    setVisitaModalOpen(false)
    setSelectedClientId(null)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Carregando dashboard...</p>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <Header user={user} onLogout={handleLogout} />
      
      <div className="dashboard-grid">
        <Sidebar 
          clients={filteredClients}
          onFilter={handleFilter}
          selectedCount={selectedClients.size}
          onAddClient={() => {
            setEditingClient(null)
            setClientModalOpen(true)
          }}
          onAddVisita={() => handleAddVisita()}
        />
        
        <main className="main-content">
          <KPIs clients={filteredClients} />
          
          <div className="dual-view">
            <div className="calendar-card">
              <div className="card-header">
                <h3><i className="fas fa-calendar-alt"></i> Cronograma de Visitas</h3>
                <button className="btn-small">Hoje</button>
              </div>
              <CalendarView 
                clients={filteredClients}
                onEventClick={(clientId) => handleEdit(clients.find(c => c.id === clientId))}
              />
            </div>

            <div className="map-card">
              <div className="card-header">
                <h3><i className="fas fa-map-marked-alt"></i> Geolocalização</h3>
                <div className="map-legend">
                  <span><i className="fas fa-circle" style={{ color: '#dc3545' }}></i> Grande</span>
                  <span><i className="fas fa-circle" style={{ color: '#ffc107' }}></i> Médio</span>
                  <span><i className="fas fa-circle" style={{ color: '#17a2b8' }}></i> Pequeno</span>
                </div>
              </div>
              <MapView 
                clients={filteredClients}
                selectedClients={selectedClients}
                onSelectClient={handleSelectClient}
              />
            </div>
          </div>
          
          <Charts clients={filteredClients} />
          
          <ClientTable 
            clients={filteredClients}
            selectedClients={selectedClients}
            onSelectClient={handleSelectClient}
            onSelectAll={handleSelectAll}
            onRefresh={loadClients}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAddVisita={handleAddVisita}
          />
        </main>
      </div>

      <ClientModal
        isOpen={clientModalOpen}
        onClose={() => {
          setClientModalOpen(false)
          setEditingClient(null)
        }}
        onSave={handleSaveClient}
        client={editingClient}
      />

      <VisitaModal
        isOpen={visitaModalOpen}
        onClose={() => {
          setVisitaModalOpen(false)
          setSelectedClientId(null)
        }}
        onSave={handleSaveVisita}
        clients={clients}
        clientId={selectedClientId}
      />
    </div>
  )
}

export default Dashboard