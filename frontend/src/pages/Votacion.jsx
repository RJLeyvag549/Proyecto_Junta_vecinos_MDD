import React from 'react';
import '../styles/votacion.css';
function Votacion() {
  const votaciones = [
    {
      titulo: 'Título Votación',
      descripcion: 'Lorem ipsum ... blandit.',
      inicio: '30-07-2025 a las 22:30',
      fin: '31-07-2025 a las 12:30'
    },
  ];

  return (
    <div className="votaciones-container">
      <header className="votaciones-banner">
        <strong>VOTACIONES</strong>
      </header>
      <main className="votaciones-cards-grid">
        {votaciones.map((v, i) => (
          <div className="votaciones-card" key={i}>
            <h2>{v.titulo}</h2>
            <p>{v.descripcion}</p>
            <p><strong>Fecha Inicio:</strong> {v.inicio}</p>
            <p><strong>Fecha Fin:</strong> {v.fin}</p>
            <button><strong>VOTA AQUÍ</strong></button>
          </div>
        ))}
      </main>
    </div>
  );
}

export default Votacion;
