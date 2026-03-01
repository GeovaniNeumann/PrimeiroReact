import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { FaChartPie, FaChartBar, FaMapPin } from 'react-icons/fa';
import './Charts.css';

Chart.register(...registerables);

const Charts = ({ clients = [] }) => {
  const porteChartRef = useRef(null);
  const revenueChartRef = useRef(null);
  const regiaoChartRef = useRef(null);
  
  const porteChartInstance = useRef(null);
  const revenueChartInstance = useRef(null);
  const regiaoChartInstance = useRef(null);

  useEffect(() => {
    if (clients.length > 0) {
      createCharts();
    }
    return () => {
      // Destroy charts on unmount
      if (porteChartInstance.current) porteChartInstance.current.destroy();
      if (revenueChartInstance.current) revenueChartInstance.current.destroy();
      if (regiaoChartInstance.current) regiaoChartInstance.current.destroy();
    };
  }, [clients]);

  const createCharts = () => {
    // Dados por porte
    const porteCount = { Pequeno: 0, Médio: 0, Grande: 0 };
    const porteRevenue = { Pequeno: 0, Médio: 0, Grande: 0 };
    const regiaoCount = { Centro: 0, Sul: 0, Norte: 0, Leste: 0, Oeste: 0 };
    
    clients.forEach(client => {
      if (client.porte) {
        porteCount[client.porte] = (porteCount[client.porte] || 0) + 1;
        porteRevenue[client.porte] = (porteRevenue[client.porte] || 0) + (client.revenue_ytd || 0);
      }
      if (client.regiao) {
        regiaoCount[client.regiao] = (regiaoCount[client.regiao] || 0) + 1;
      }
    });

    // Gráfico de Porte (Pizza)
    if (porteChartRef.current) {
      if (porteChartInstance.current) porteChartInstance.current.destroy();
      
      porteChartInstance.current = new Chart(porteChartRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Pequeno', 'Médio', 'Grande'],
          datasets: [{
            data: [porteCount.Pequeno, porteCount.Médio, porteCount.Grande],
            backgroundColor: ['#17a2b8', '#ffc107', '#dc3545'],
            borderWidth: 0,
            hoverOffset: 10
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { 
              position: 'bottom',
              labels: { font: { size: 11 } }
            }
          },
          cutout: '60%'
        }
      });
    }

    // Gráfico de Faturamento (Barra)
    if (revenueChartRef.current) {
      if (revenueChartInstance.current) revenueChartInstance.current.destroy();
      
      revenueChartInstance.current = new Chart(revenueChartRef.current, {
        type: 'bar',
        data: {
          labels: ['Pequeno', 'Médio', 'Grande'],
          datasets: [{
            label: 'Faturamento YTD',
            data: [porteRevenue.Pequeno, porteRevenue.Médio, porteRevenue.Grande],
            backgroundColor: ['#17a2b8', '#ffc107', '#dc3545'],
            borderRadius: 8,
            hoverBackgroundColor: ['#138496', '#d39e00', '#bd2130']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => 'R$ ' + (value / 1000) + 'k',
                font: { size: 10 }
              }
            },
            x: {
              ticks: { font: { size: 11 } }
            }
          },
          plugins: {
            legend: { display: false }
          }
        }
      });
    }

    // Gráfico de Região (Pizza)
    if (regiaoChartRef.current) {
      if (regiaoChartInstance.current) regiaoChartInstance.current.destroy();
      
      const hasData = Object.values(regiaoCount).some(v => v > 0);
      const labels = hasData 
        ? Object.keys(regiaoCount).filter(regiao => regiaoCount[regiao] > 0)
        : ['Centro', 'Sul', 'Norte', 'Leste', 'Oeste'];
      
      const data = hasData
        ? labels.map(l => regiaoCount[l])
        : [0, 0, 0, 0, 0];

      regiaoChartInstance.current = new Chart(regiaoChartRef.current, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: ['#1e3c72', '#2a4d8f', '#00b4d8', '#2ecc71', '#f39c12'],
            borderWidth: 0,
            hoverOffset: 10
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { 
              position: 'bottom',
              labels: { font: { size: 11 } }
            }
          }
        }
      });
    }
  };

  return (
    <div className="charts-grid">
      <div className="chart-card">
        <h3><FaChartPie /> Distribuição por Porte</h3>
        <div className="chart-container">
          <canvas ref={porteChartRef}></canvas>
        </div>
      </div>
      <div className="chart-card">
        <h3><FaChartBar /> Faturamento por Porte</h3>
        <div className="chart-container">
          <canvas ref={revenueChartRef}></canvas>
        </div>
      </div>
      <div className="chart-card">
        <h3><FaMapPin /> Visitas por Região</h3>
        <div className="chart-container">
          <canvas ref={regiaoChartRef}></canvas>
        </div>
      </div>
    </div>
  );
};

export default Charts;