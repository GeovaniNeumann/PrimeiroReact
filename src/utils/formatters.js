// src/utils/formatters.js
export const formatCurrency = (value) => {
  if (value === undefined || value === null) return 'R$ 0,00'
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

export const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('pt-BR')
}

export const getStatusClass = (status) => {
  return status === 'Ativo' ? 'status-ativo' : 'status-inativo'
}

export const getColorByPorte = (porte) => {
  switch(porte) {
    case 'Grande': return '#dc3545'
    case 'Médio': return '#ffc107'
    case 'Pequeno': return '#17a2b8'
    default: return '#6c757d'
  }
}