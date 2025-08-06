import React, { useState } from 'react';
import { useGetCurrentUser } from '../hooks/users/useGetCurrentUser';
import '../styles/ResidenceCertificate.css';
import SidebarUsuario from '../components/SidebarUsuario';
import Navbar from '../components/Navbar';
import ModalDocument from '../components/ModalDocument';

const ResidenceCertificate = () => {
  const { user, loading, error } = useGetCurrentUser();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      setPdfUrl(url + '#filename=certificado.pdf');

      setIsModalOpen(true);
    } catch (err) {
      console.error('Error al generar certificado:', err);
      alert('No se pudo generar el certificado.');
    }
  };

  if (loading) return <p>Cargando datos del usuario...</p>;
  if (error) return <p>Error al cargar datos del usuario.</p>;

  return (
    <div className='residence-page'>
      <SidebarUsuario />

      <div className='residence-main'>
        <Navbar />

        <div className='residence-container'>
          <h1>Solicitar Certificado de Residencia</h1>
          <p>
            Desde esta sección puedes generar de manera automática tu
            certificado de residencia, un documento oficial que acredita tu
            domicilio registrado en la Junta Vecinal y que puede ser utilizado
            para diversos trámites administrativos, escolares o de servicios
            públicos.
          </p>

          {user ? (
            <p className='residence-info'>
              <strong>Nombre:</strong> {user.fullName}
              <br />
              <strong>RUT:</strong> {user.rut}
              <br />
              <strong>Dirección:</strong> {user.homeAddress}
            </p>
          ) : (
            <p>No se pudo cargar la información del usuario.</p>
          )}

          <button onClick={handleGenerateCertificate}>
            Generar Certificado
          </button>
        </div>
      </div>

      {pdfUrl && isModalOpen && (
        <ModalDocument
          visible={true}
          onClose={() => {
            setIsModalOpen(false);
            setPdfUrl(null);
          }}
          url={pdfUrl}
        />
      )}
    </div>
  );
};

export default ResidenceCertificate;
