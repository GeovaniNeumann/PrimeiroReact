import React, { useState } from 'react'
import { 
  FaUserCircle, FaBuilding, FaCalendarCheck, FaChartLine,
  FaSearch, FaFilter, FaEraser, FaPlusCircle, FaCalendarPlus,
  FaRoute, FaClock
} from 'react-icons/fa'
import './Sidebar.css'

const Sidebar = ({ 
  clients = [], 
  onFilter, 
  selectedCount = 0,
  onAddClient,  // <-- ADICIONAR ESTA LINHA
  onAddVisita   // <-- ADICIONAR ESTA LINHA
}) => {
  const [filters, setFilters] = useState({
    search: '',
    porte: 'todos',
    status: 'todos'
  })

  const totalClients = clients.length
  const activeClients = clients.filter(c => c.status === 'Ativo').length
  const totalRevenue = clients.reduce((sum, c) => sum + (c.revenue_ytd || 0), 0)

  const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilter(newFilters)
  }

  const clearFilters = () => {
    const newFilters = { search: '', porte: 'todos', status: 'todos' }
    setFilters(newFilters)
    onFilter(newFilters)
  }

  // Próximas visitas
  const hoje = new Date()
  const proximasVisitas = clients
    .filter(c => c.next_contact && new Date(c.next_contact) >= hoje)
    .sort((a, b) => new Date(a.next_contact) - new Date(b.next_contact))
    .slice(0, 5)

  return (
    <aside className="sidebar">
      <div className="perfil-gerente">
        <div className="avatar">
          <FaUserCircle />
        </div>
        <div className="info">
          <h3>Gerente Comercial</h3>
          <p>Curitiba/PR</p>
        </div>
      </div>

      <div className="metricas-rapidas">
        <div className="metrica-card">
          <FaBuilding />
          <div>
            <span className="rotulo">Clientes</span>
            <span className="valor">{totalClients}</span>
          </div>
        </div>
        <div className="metrica-card">
          <FaCalendarCheck />
          <div>
            <span className="rotulo">Visitas/Hoje</span>
            <span className="valor">{proximasVisitas.length}</span>
          </div>
        </div>
        <div className="metrica-card">
          <FaChartLine />
          <div>
            <span className="rotulo">Faturamento</span>
            <span className="valor">{formatCurrency(totalRevenue)}</span>
          </div>
        </div>
      </div>

      <div className="filters-section">
        <h3><FaFilter /> Filtros</h3>
        
        <div className="filter-group">
          <label><FaSearch /> Buscar</label>
          <input
            type="text"
            placeholder="Nome, CNPJ ou cidade..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label><FaBuilding /> Porte</label>
          <select
            value={filters.porte}
            onChange={(e) => handleFilterChange('porte', e.target.value)}
          >
            <option value="todos">Todos os Portes</option>
            <option value="Grande">Grande</option>
            <option value="Médio">Médio</option>
            <option value="Pequeno">Pequeno</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Status</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
          </select>
        </div>

        <div className="filter-actions">
          <button className="btn-filter primary" onClick={clearFilters}>
            <FaEraser /> Limpar
          </button>
        </div>
      </div>

      <div className="quick-actions">
        <h3><FaChartLine /> Ações Rápidas</h3>
        <button className="btn-quick" onClick={onAddClient}>
          <FaPlusCircle /> Novo Cliente
        </button>
        <button className="btn-quick" onClick={onAddVisita}>
          <FaCalendarPlus /> Agendar Visita
        </button>
        <button className="btn-quick">
          <FaRoute /> Otimizar Rota ({selectedCount})
        </button>
      </div>

      <div className="next-visits">
        <h3><FaClock /> Próximas Visitas</h3>
        <div className="visitas-lista">
          {proximasVisitas.length > 0 ? (
            proximasVisitas.map(client => (
              <div key={client.id} className="visita-item">
                <div className="visita-cliente">{client.name}</div>
                <div className="visita-data">
                  <FaCalendarCheck />
                  {new Date(client.next_contact).toLocaleDateString('pt-BR')}
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', color: '#95a5a6' }}>
              Nenhuma visita agendada
            </p>
          )}
        </div>
      </div>
    </aside>
  )
}

export default Sidebar