import React, { useState, useEffect } from 'react';
import { FaTimes, FaBuilding, FaCalendarDay, FaClock, FaTag, FaAlignLeft, FaBell } from 'react-icons/fa';
import './Modal.css';

const VisitaModal = ({ isOpen, onClose, onSave, clients = [], clientId = null }) => {
  const [formData, setFormData] = useState({
    clienteId: clientId || '',
    data: new Date().toISOString().split('T')[0],
    horario: '09:00',
    tipo: 'Visita Comercial',
    obs: '',
    lembrete: '30'
  });

  useEffect(() => {
    if (clientId) {
      setFormData(prev => ({ ...prev, clienteId: clientId }));
    }
  }, [clientId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2><FaCalendarDay /> Agendar Visita</h2>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label><FaBuilding /> Cliente*</label>
            <select
              name="clienteId"
              value={formData.clienteId}
              onChange={handleChange}
              required
            >
              <option value="">Selecione um cliente...</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label><FaCalendarDay /> Data*</label>
              <input
                type="date"
                name="data"
                value={formData.data}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label><FaClock /> Horário*</label>
              <input
                type="time"
                name="horario"
                value={formData.horario}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label><FaTag /> Tipo*</label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              required
            >
              <option value="Visita Comercial">Visita Comercial</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Negociação">Negociação</option>
              <option value="Pós-venda">Pós-venda</option>
            </select>
          </div>

          <div className="form-group">
            <label><FaAlignLeft /> Observações</label>
            <textarea
              name="obs"
              value={formData.obs}
              onChange={handleChange}
              rows="3"
              placeholder="Anotações sobre a visita..."
            />
          </div>

          <div className="form-group">
            <label><FaBell /> Lembrete</label>
            <select
              name="lembrete"
              value={formData.lembrete}
              onChange={handleChange}
            >
              <option value="15">15 minutos antes</option>
              <option value="30">30 minutos antes</option>
              <option value="60">1 hora antes</option>
              <option value="120">2 horas antes</option>
              <option value="1440">1 dia antes</option>
            </select>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              Agendar Visita
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VisitaModal;