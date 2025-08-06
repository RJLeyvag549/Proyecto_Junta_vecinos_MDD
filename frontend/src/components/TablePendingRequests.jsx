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
            <th>NOMBRE</th>
            <th>RUT</th>
            <th>CORREO ELECTRÓNICO</th>
            <th>CONTACTO</th>
            <th>DIRECCIÓN</th>
            <th>CÉDULA</th>
            <th>RESIDENCIA</th>
            <th>ACCIONES</th>
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
                  <button
                    onClick={() => openModal(user.docIdentity)}
                    className='btn-action btn-view'
                  >
                    Ver
                  </button>
                </td>

                <td>
                  <button
                    onClick={() => openModal(user.docResidence)}
                    className='btn-action btn-view'
                  >
                    Ver
                  </button>
                </td>

                <td>
                  <button
                    onClick={() => handleAccept(user.id)}
                    className='btn-action btn-accept'
                  >
                    Aceptar
                  </button>
                  <button
                    onClick={() => handleReject(user.id)}
                    className='btn-action btn-reject'
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
