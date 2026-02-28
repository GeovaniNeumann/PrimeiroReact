import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { getColorByPorte } from '../utils'
import './CalendarView.css'

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
    }))

  const handleEventClick = (info) => {
    if (onEventClick) {
      onEventClick(info.event.extendedProps.clientId)
    }
  }

  return (
    <div className="calendar-wrapper">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale="pt-br"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
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
      />
    </div>
  )
}

export default CalendarView