import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getColorByPorte, formatCurrency } from '../utils'
import './MapView.css'

// Fix para ícones do Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const MapView = ({ clients = [], selectedClients = new Set(), onSelectClient }) => {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])

  useEffect(() => {
    if (!mapInstanceRef.current) {
      // Inicializar mapa
      mapInstanceRef.current = L.map(mapRef.current).setView([-25.4284, -49.2733], 12)
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current)
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current) return

    // Remover marcadores antigos
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []

    // Adicionar novos marcadores
    const bounds = L.latLngBounds()
    
    clients.forEach(client => {
      if (!client.lat || !client.lng) return

      let color = getColorByPorte(client.porte)
      if (selectedClients.has(client.id)) {
        color = '#2ecc71'
      }

      const marker = L.circleMarker([client.lat, client.lng], {
        radius: 8,
        fillColor: color,
        color: '#fff',
        weight: 2,
        fillOpacity: 0.8
      }).addTo(mapInstanceRef.current)

      marker.bindPopup(`
        <div style="min-width: 200px;">
          <strong>${client.name || 'Sem nome'}</strong><br>
          <small>${client.address || ''}</small><br>
          <b>Porte:</b> ${client.porte || 'N/A'}<br>
          <b>Faturamento:</b> ${formatCurrency(client.revenue_ytd || 0)}<br>
          <b>Status:</b> 
          <span class="status-${client.status === 'Ativo' ? 'ativo' : 'inativo'}">
            ${client.status || 'N/A'}
          </span><br>
          <button 
            onclick="window.selectClient && window.selectClient(${client.id})"
            style="margin-top: 8px; padding: 5px 10px; background: ${selectedClients.has(client.id) ? '#2ecc71' : '#00b4d8'}; color: white; border: none; border-radius: 4px; cursor: pointer;">
            ${selectedClients.has(client.id) ? '✓ Selecionado' : 'Selecionar'}
          </button>
        </div>
      `)

      bounds.extend([client.lat, client.lng])
      markersRef.current.push(marker)
    })

    // Ajustar zoom
    if (markersRef.current.length > 0) {
      mapInstanceRef.current.fitBounds(bounds.pad(0.1))
    }

    // Função global para selecionar clientes
    window.selectClient = (id) => {
      if (onSelectClient) {
        onSelectClient(id)
      }
    }

  }, [clients, selectedClients, onSelectClient])

  return <div ref={mapRef} className="map-container" />
}

export default MapView