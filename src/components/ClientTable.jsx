import React from 'react'
import { FaDownload, FaSyncAlt, FaEdit, FaTrash, FaCalendarPlus, FaMapMarkerAlt, FaExclamationTriangle } from 'react-icons/fa'
import { formatCurrency, formatDate, getStatusClass } from '../utils'
import './ClientTable.css'

const ClientTable = ({ 
  clients = [], 
  selectedClients = new Set(),
  onSelectClient,
  onSelectAll,
  onRefresh,
  onEdit,
  onDelete
}) => {
  const handleSelectAll = (e) => {
    onSelectAll(e.target.checked)
  }

  const exportData = () => {
    const dataStr = JSON.stringify(clients, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportName = `clientes_${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportName)
    linkElement.click()
  }

  return (
    <div className="table-card">
      <div className="card-header">
        <h3><i className="fas fa-list"></i> Detalhamento da Carteira</h3>
        <div className="table-actions">
          <button className="btn-small" onClick={exportData}>
            <FaDownload /> Exportar
          </button>
          <button className="btn-small" onClick={onRefresh}>
            <FaSyncAlt />
          </button>
        </div>
      </div>
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th style={{ width: '40px' }}>
                <input 
                  type="checkbox" 
                  onChange={handleSelectAll}
                  checked={clients.length > 0 && selectedClients.size === clients.length}
                />
              </th>
              <th>Cliente</th>
              <th>Porte</th>
              <th>Status</th>
              <th>Faturamento</th>
              <th>Localização</th>
              <th>Última Visita</th>
              <th>Próx. Visita</th>
              <th style={{ width: '150px' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '2rem' }}>
                  Nenhum cliente encontrado
                </td>
              </tr>
            ) : (
              clients.map(client => (
                <tr key={client.id}>
                  <td>
                    <input 
                      type="checkbox"
                      checked={selectedClients.has(client.id)}
                      onChange={() => onSelectClient(client.id)}
                    />
                  </td>
                  <td>
                    <strong>{client.name || 'Sem nome'}</strong>
                    <br />
                    <small>{client.cnpj || ''}</small>
                  </td>
                  <td>{client.porte || 'N/A'}</td>
                  <td>
                    <span className={getStatusClass(client.status)}>
                      {client.status || 'N/A'}
                    </span>
                  </td>
                  <td>{formatCurrency(client.revenue_ytd || 0)}</td>
                  <td>
                    {client.lat && client.lng ? (
                      <FaMapMarkerAlt style={{ color: '#2ecc71' }} />
                    ) : (
                      <FaExclamationTriangle style={{ color: '#f39c12' }} />
                    )}
                  </td>
                  <td>{formatDate(client.last_service)}</td>
                  <td>{formatDate(client.next_contact)}</td>
                  <td>
                    <button 
                      className="btn-edit" 
                      onClick={() => onEdit(client)}
                      title="Editar"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="btn-visita" 
                      onClick={() => console.log('Agendar visita', client.id)}
                      title="Agendar Visita"
                    >
                      <FaCalendarPlus />
                    </button>
                    <button 
                      className="btn-delete" 
                      onClick={() => onDelete(client.id)}
                      title="Excluir"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ClientTable