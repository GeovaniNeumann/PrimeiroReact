import { supabase } from './supabase'
import auth from './auth'

class API {
  async getClients(filters = {}) {
    try {
      const user = auth.getUser()
      if (!user) return []

      let query = supabase
        .from('clientes')
        .select('*')
        .order('created_at', { ascending: false })

      // Filtrar por usuário (se não for admin)
      if (user.role !== 'admin') {
        query = query.eq('user_id', user.id)
      }

      // Aplicar filtros de busca
      if (filters.search?.trim()) {
        const term = filters.search.toLowerCase().trim()
        query = query.or(`name.ilike.%${term}%,cnpj.ilike.%${term}%,email.ilike.%${term}%`)
      }

      if (filters.porte && filters.porte !== 'todos') {
        query = query.eq('porte', filters.porte)
      }

      if (filters.status && filters.status !== 'todos') {
        query = query.eq('status', filters.status)
      }

      const { data, error } = await query

      if (error) {
        console.error('Erro ao buscar clientes:', error)
        return this.getMockClients()
      }

      return data || []
    } catch (error) {
      console.error('Erro ao buscar clientes:', error)
      return this.getMockClients()
    }
  }

  getMockClients() {
    const mockClients = []
    const centerLat = -25.4284
    const centerLng = -49.2733

    for (let i = 1; i <= 10; i++) {
      mockClients.push({
        id: `mock-${i}`,
        name: `Cliente Mock ${i}`,
        cnpj: `00.000.000/0001-${String(i).padStart(2, '0')}`,
        porte: i % 3 === 0 ? 'Grande' : i % 3 === 1 ? 'Médio' : 'Pequeno',
        regiao: ['Centro', 'Sul', 'Norte', 'Leste', 'Oeste'][i % 5],
        status: i % 4 === 0 ? 'Inativo' : 'Ativo',
        revenue_ytd: Math.floor(Math.random() * 100000) + 10000,
        frequency_days: 30,
        last_service: new Date().toISOString().split('T')[0],
        next_contact: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        address: `Rua Exemplo, ${i}00 - Curitiba/PR`,
        email: `contato${i}@exemplo.com`,
        phone: `(41) 9${String(i).padStart(4, '0')}-${String(i).padStart(4, '0')}`,
        lat: centerLat + (Math.random() - 0.5) * 0.1,
        lng: centerLng + (Math.random() - 0.5) * 0.1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    }
    return mockClients
  }

  async createClient(clientData) {
    try {
      const user = auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      const next_contact = new Date()
      next_contact.setDate(next_contact.getDate() + (clientData.frequency_days || 30))

      const newClient = {
        ...clientData,
        user_id: user.id,
        last_service: new Date().toISOString().split('T')[0],
        next_contact: next_contact.toISOString().split('T')[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('clientes')
        .insert([newClient])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao criar cliente:', error)
      throw error
    }
  }

  async updateClient(id, updates) {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error)
      throw error
    }
  }

  async deleteClient(id) {
    try {
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Erro ao excluir cliente:', error)
      throw error
    }
  }

  async geocodeAddress(address) {
    if (!address) return null

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address + ', Curitiba, PR')}&limit=1&countrycodes=br`
      )
      const data = await response.json()

      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          formatted_address: data[0].display_name
        }
      }
      return null
    } catch (error) {
      console.error('Erro na geocodificação:', error)
      return null
    }
  }

  async getVisits(startDate, endDate) {
    try {
      const user = auth.getUser()
      if (!user) return []

      let query = supabase
        .from('clientes')
        .select('id, name, next_contact, porte, status')
        .not('next_contact', 'is', null)

      if (user.role !== 'admin') {
        query = query.eq('user_id', user.id)
      }

      if (startDate) {
        query = query.gte('next_contact', startDate)
      }
      if (endDate) {
        query = query.lte('next_contact', endDate)
      }

      const { data, error } = await query

      if (error) {
        console.error('Erro ao buscar visitas:', error)
        return []
      }

      return (data || []).map(c => ({
        id: `event-${c.id}`,
        title: c.name || 'Sem nome',
        start: c.next_contact,
        allDay: true,
        backgroundColor: this.getColorByPorte(c.porte),
        borderColor: this.getColorByPorte(c.porte),
        textColor: '#ffffff',
        extendedProps: {
          clientId: c.id,
          porte: c.porte,
          status: c.status
        }
      }))
    } catch (error) {
      console.error('Erro ao buscar visitas:', error)
      return []
    }
  }

  getColorByPorte(porte) {
    switch(porte) {
      case 'Grande': return '#dc3545'
      case 'Médio': return '#ffc107'
      case 'Pequeno': return '#17a2b8'
      default: return '#6c757d'
    }
  }
}

export default new API()