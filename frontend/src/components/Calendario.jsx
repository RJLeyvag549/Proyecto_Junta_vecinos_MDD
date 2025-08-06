import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';


const Calendario = () => {
  const [date, setDate] = useState(new Date());
  const [eventos, setEventos] = useState({});

  useEffect(() => {
    const token = JSON.parse(sessionStorage.getItem('user'))?.token || '';

    fetch('/api/meetings', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        const reuniones = data.data;

        const agrupadas = {};
        reuniones.forEach((r) => {
          const fecha = r.fecha; // formato YYYY-MM-DD
          if (!agrupadas[fecha]) agrupadas[fecha] = [];
          agrupadas[fecha].push({
            title: `Reunión en ${r.lugar} a las ${r.hora} (${r.modalidad})`
          });
        });

        setEventos(agrupadas);
      })
      .catch((err) => console.error('Error al cargar reuniones:', err));
  }, []);

  const onChange = (newDate) => setDate(newDate);

  const fechaSeleccionada = date.toISOString().split('T')[0];
  const eventosDelDia = eventos[fechaSeleccionada] || [];

  return (
    <div className="calendario-container">
      <h3>Calendario</h3>
      <Calendar
        onChange={onChange}
        value={date}
        locale="es-CL"
      />

      <div className="eventos-dia">
        <h4>Eventos del día</h4>
        {eventosDelDia.length === 0 ? (
          <p>No hay reuniones para este día.</p>
        ) : (
          eventosDelDia.map((evento, index) => (
            <div key={index} className="evento">
              <strong>{evento.title}</strong>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Calendario;
