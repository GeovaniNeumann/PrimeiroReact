import React from 'react';
import { FaUsers, FaUserCheck, FaChartLine, FaCalendarCheck } from 'react-icons/fa';
import './KPIs.css';

const KPIs = ({ clients = [] }) => {
  const total = clients.length;
  const ativos = clients.filter(c => c.status === 'Ativo').length;
  const faturamento = clients.reduce((sum, c) => sum + (c.revenue_ytd || 0), 0);
  
  const hoje = new Date();
  const visitasMes = clients.filter(c => {
    if (!c.next_contact) return false;
    const data = new Date(c.next_contact);
    return data.getMonth() === hoje.getMonth() && data.getFullYear() === hoje.getFullYear();
  }).length;

  const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  const kpiData = [
    {
      id: 1,
      title: 'Total na Carteira',
      value: total,
      icon: <FaUsers />,
      color: 'primary',
    },
    {
      id: 2,
      title: 'Clientes Ativos',
      value: ativos,
      icon: <FaUserCheck />,
      color: 'success',
    },
    {
      id: 3,
      title: 'Faturamento YTD',
      value: formatCurrency(faturamento),
      icon: <FaChartLine />,
      color: 'warning',
    },
    {
      id: 4,
      title: 'Visitas este Mês',
      value: visitasMes,
      icon: <FaCalendarCheck />,
      color: 'info',
    }
  ];

  return (
    <div className="kpi-grid">
      {kpiData.map(kpi => (
        <div key={kpi.id} className={`kpi-card ${kpi.color}`}>
          <div className="kpi-icon">
            {kpi.icon}
          </div>
          <div className="kpi-info">
            <h3>{kpi.title}</h3>
            <p className="kpi-value">{kpi.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPIs;