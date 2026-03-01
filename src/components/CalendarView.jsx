import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import './CalendarView.css';

const getColorByPorte = (porte) => {
  switch(porte) {
    case 'Grande': return '#dc3545';
    case 'Médio': return '#ffc107';
    case 'Pequeno': return '#17a2b8';
    default: return '#1e3c72';
  }
};

const CalendarView = ({ clients = [], onEventClick }) => {
  const events = clients
    .filter(c => c.next_contact)
    .map(c => ({
      id: `event-${c.id}`,
      title: c.name,
      start: c.next_contact,
      allDay: true,
      backgroundColor: getColorByPorte(c.porte),
      borderColor: getColorByPorte(c.porte),
      textColor: '#ffffff',
      extendedProps: {
        clientId: c.id,
        porte: c.porte,
        status: c.status
      }
    }));

  const handleEventClick = (info) => {
    if (onEventClick) {
      onEventClick(info.event.extendedProps.clientId);
    }
  };

  return (
    <div className="calendar-wrapper">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale={ptBrLocale}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek'
        }}
        buttonText={{
          today: 'Hoje',
          month: 'Mês',
          week: 'Semana',
          day: 'Dia'
        }}
        events={events}
        eventClick={handleEventClick}
        height="auto"
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          meridiem: false
        }}
      />
    </div>
  );
};

export default CalendarView;