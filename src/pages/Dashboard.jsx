import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import KPIs from '../components/KPIs';
import CalendarView from '../components/CalendarView';
// import MapView from '../components/MapView'; // REMOVIDO - Comentado ou apagado
import Charts from '../components/Charts';
import ClientTable from '../components/ClientTable';
import ClientModal from '../components/Modals/ClientModal';
import VisitaModal from '../components/Modals/VisitaModal';
import api from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [selectedClients, setSelectedClients] = useState(new Set());
  const [loading, setLoading] = useState(true);
  
  // Modais
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [visitaModalOpen, setVisitaModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [selectedClientId, setSelectedClientId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadClients();
  }, [isAuthenticated, navigate]);

  const loadClients = async () => {
    setLoading(true);
    try {
      // Dados simulados para exemplo
      const mockClients = [
        { 
          id: 1, 
          name: 'Hospital Santa Cruz', 
          porte: 'Grande', 
          regiao: 'Sul', 
          status: 'Ativo', 
          revenue_ytd: 850000,
          cnpj: '12.345.678/0001-90',
          address: 'Rua XV de Novembro, 500 - Curitiba',
          lat: -25.4284, 
          lng: -49.2733,
          last_service: '2026-02-15',
          next_contact: '2026-03-15',
          email: 'contato@santacruz.com.br',
          phone: '(41) 3333-4444'
        },
        { 
          id: 2, 
          name: 'Clínica São Lucas', 
          porte: 'Médio', 
          regiao: 'Norte', 
          status: 'Ativo', 
          revenue_ytd: 420000,
          cnpj: '23.456.789/0001-01',
          address: 'Av. Paraná, 1000 - Curitiba',
          lat: -25.4372, 
          lng: -49.2698,
          last_service: '2026-02-20',
          next_contact: '2026-03-20',
          email: 'contato@saolucas.com.br',
          phone: '(41) 3333-5555'
        },
        { 
          id: 3, 
          name: 'Laboratório Central', 
          porte: 'Pequeno', 
          regiao: 'Leste', 
          status: 'Ativo', 
          revenue_ytd: 150000,
          cnpj: '34.567.890/0001-12',
          address: 'Rua da Cidadania, 200 - Curitiba',
          lat: -25.4478, 
          lng: -49.2345,
          last_service: '2026-02-10',
          next_contact: '2026-03-10',
          email: 'contato@labcentral.com.br',
          phone: '(41) 3333-6666'
        }
      ];
      
      setClients(mockClients);
      setFilteredClients(mockClients);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (filters) => {
    let filtered = [...clients];
    
    if (filters.search) {
      filtered = filtered.filter(c => 
        c.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        c.cnpj?.includes(filters.search)
      );
    }
    
    if (filters.porte && filters.porte !== 'todos') {
      filtered = filtered.filter(c => c.porte === filters.porte);
    }
    
    if (filters.status && filters.status !== 'todos') {
      filtered = filtered.filter(c => c.status === filters.status);
    }
    
    setFilteredClients(filtered);
  };

  const handleSelectClient = (id) => {
    const newSelected = new Set(selectedClients);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedClients(newSelected);
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedClients(new Set(filteredClients.map(c => c.id)));
    } else {
      setSelectedClients(new Set());
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setClientModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      const newClients = clients.filter(c => c.id !== id);
      setClients(newClients);
      setFilteredClients(newClients);
    }
  };

  const handleSaveClient = async (clientData) => {
    if (editingClient) {
      const updatedClients = clients.map(c => 
        c.id === editingClient.id ? { ...c, ...clientData } : c
      );
      setClients(updatedClients);
      setFilteredClients(updatedClients);
    } else {
      const newClient = {
        ...clientData,
        id: clients.length + 1,
        lat: -25.4284 + (Math.random() - 0.5) * 0.1,
        lng: -49.2733 + (Math.random() - 0.5) * 0.1
      };
      setClients([...clients, newClient]);
      setFilteredClients([...clients, newClient]);
    }
    setClientModalOpen(false);
    setEditingClient(null);
  };

  const handleAddVisita = (clientId = null) => {
    setSelectedClientId(clientId);
    setVisitaModalOpen(true);
  };

  const handleSaveVisita = async (visitaData) => {
    const updatedClients = clients.map(c => 
      c.id === parseInt(visitaData.clienteId) 
        ? { ...c, next_contact: visitaData.data } 
        : c
    );
    setClients(updatedClients);
    setFilteredClients(updatedClients);
    setVisitaModalOpen(false);
    setSelectedClientId(null);
  };

  const handleOptimizeRoute = () => {
    alert(`Otimizando rota para ${selectedClients.size} clientes selecionados`);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Carregando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Header user={user} onLogout={handleLogout} />
      
      <div className="dashboard-container">
        <div className="dashboard-grid">
          <Sidebar 
            clients={filteredClients}
            onFilter={handleFilter}
            selectedCount={selectedClients.size}
            onAddClient={() => {
              setEditingClient(null);
              setClientModalOpen(true);
            }}
            onAddVisita={handleAddVisita}
            onOptimizeRoute={handleOptimizeRoute}
          />
          
          <main className="main-content">
            <KPIs clients={filteredClients} />
            
            {/* AGORA APENAS O CALENDÁRIO - MAPA REMOVIDO */}
            <div className="calendar-card">
              <div className="card-header">
                <h3>
                  <i className="fas fa-calendar-alt"></i> Cronograma de Visitas
                </h3>
                <button className="btn-small" onClick={() => {
                  // Lógica para ir para hoje (pode implementar depois)
                  console.log('Ir para hoje');
                }}>
                  Hoje
                </button>
              </div>
              <CalendarView 
                clients={filteredClients}
                onEventClick={(clientId) => handleEdit(clients.find(c => c.id === clientId))}
              />
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
      </div>

      <ClientModal
        isOpen={clientModalOpen}
        onClose={() => {
          setClientModalOpen(false);
          setEditingClient(null);
        }}
        onSave={handleSaveClient}
        client={editingClient}
      />

      <VisitaModal
        isOpen={visitaModalOpen}
        onClose={() => {
          setVisitaModalOpen(false);
          setSelectedClientId(null);
        }}
        onSave={handleSaveVisita}
        clients={clients}
        clientId={selectedClientId}
      />
    </div>
  );
};

export default Dashboard;