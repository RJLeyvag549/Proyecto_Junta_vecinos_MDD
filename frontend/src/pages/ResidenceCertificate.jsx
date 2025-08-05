import React, { useState } from 'react';
import { useGetCurrentUser } from '../hooks/users/useGetCurrentUser';
import '../styles/ResidenceCertificate.css';
import SidebarUsuario from '../components/SidebarUsuario';
import Navbar from '../components/Navbar';

const ResidenceCertificate = () => {
  const { user, loading, error } = useGetCurrentUser();
  const [pdfUrl, setPdfUrl] = useState(null);

  const handleGenerateCertificate = async () => {
    try {

const session = JSON.parse(sessionStorage.getItem('user'));
const token = session?.token;

const response = await fetch(
  'http://localhost:3000/api/certificate/residence',
  {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/pdf',
    },
  }
);

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error HTTP ${response.status}: ${text}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err) {
      console.error('Error al generar certificado:', err);
      alert('No se pudo generar el certificado.');
    }
  };

  if (loading) return <p>Cargando datos del usuario...</p>;
  if (error) return <p>Error al cargar datos del usuario.</p>;

  return (
    <div className='residence-layout'>
      <SidebarUsuario />

      <div className='residence-main'>
        <Navbar />

        <div className='residence-container'>
          <h1>Solicitar Certificado de Residencia</h1>
          <p>
            Desde esta sección puedes generar tu certificado de residencia de
            forma automática.
          </p>

          {user ? (
            <ul>
              <li>
                <strong>Nombre:</strong> {user.fullName}
              </li>
              <li>
                <strong>RUT:</strong> {user.rut}
              </li>
              <li>
                <strong>Dirección:</strong> {user.homeAddress}
              </li>
            </ul>
          ) : (
            <p>No se pudo cargar la información del usuario.</p>
          )}

          <button onClick={handleGenerateCertificate}>
            Generar Certificado
          </button>

          {pdfUrl && (
            <div className='pdf-preview'>
              <iframe
                src={pdfUrl}
                width='100%'
                height='600px'
                title='Certificado de Residencia'
              />
              <a
                href={pdfUrl}
                download='certificado_residencia.pdf'
              >
                Descargar PDF
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResidenceCertificate;
