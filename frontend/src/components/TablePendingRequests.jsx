import React, { useState } from 'react';
import ModalDocument from './ModalDocument';
import '../styles/Requests.css';

const TablePendingRequests = ({
  users,
  onStatusChange,
  onAccept,
  onReject,
}) => {

  const [docUrl, setDocUrl] = useState('');
  const [showModal, setShowModal] = useState(false);

  const openModal = (url) => {
    setDocUrl(url);
    setShowModal(true);
  };

  const handleAccept = (userId) => {
    onAccept(userId);
  };

  const handleReject = (userId) => {
    onReject(userId);
  };

  return (
    <div className='table-container'>
      <table className='requests-table'>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>RUT</th>
            <th>Correo electrónico</th>
            <th>Número de contacto</th>
            <th>Dirección</th>
            <th>Cédula</th>
            <th>Residencia</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user, idx) => (
              <tr key={idx}>
                <td>{user.fullName}</td>
                <td>{user.rut}</td>
                <td>{user.email}</td>
                <td>{user.contact}</td>
                <td>{user.homeAddress}</td>
                <td>
                  <button onClick={() => openModal(user.docIdentity)}>
                    Ver
                  </button>
                </td>
                <td>
                  <button onClick={() => openModal(user.docResidence)}>
                    Ver
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleAccept(user.id)}
                    className='btn-accept'
                  >
                    Aceptar
                  </button>
                  <button
                    onClick={() => handleReject(user.id)}
                    className='btn-reject'
                  >
                    Rechazar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='8'>No hay solicitudes pendientes.</td>
            </tr>
          )}
        </tbody>
      </table>

      <ModalDocument
        visible={showModal}
        url={docUrl}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default TablePendingRequests;
