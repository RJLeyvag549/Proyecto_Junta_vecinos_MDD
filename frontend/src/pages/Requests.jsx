import React from 'react';
import { useGetPendingUsers } from '../hooks/users/useGetPendingUsers';
import TablePendingRequests from '../components/TablePendingRequests';
import SidebarAdmin from '../components/SidebarAdmin';
import Navbar from '../components/Navbar';
import { updateRequestStatus } from '../services/user.service';
import Swal from 'sweetalert2';

const Requests = () => {
  const { pendingUsers, loading, error, refetch } = useGetPendingUsers();

  const handleAccept = async (id) => {
    try {
      await updateRequestStatus(id, 'aprobado');
      await Swal.fire('Listo', 'Usuario aprobado exitosamente.', 'success');
      refetch(); 
    } catch (err) {
      Swal.fire('Error', err.toString(), 'error');
    }
  };

const handleReject = async (id) => {
  try {
    await updateRequestStatus(id, 'rechazado'); 
    await Swal.fire('Rechazado', 'Usuario eliminado correctamente.', 'success');
    refetch(); 
  } catch (err) {
    const errorMsg =
      err?.response?.data?.message ||
      err?.message ||
      'Error al rechazar usuario.';
    Swal.fire('Error', errorMsg, 'error');
  }
};

  return (
    <div className='requests-page'>
      <SidebarAdmin />
      <div className='main-content'>
        <Navbar />
        <div className='content-container'>
          <h1 className='page-title'>Solicitudes Pendientes</h1>

          {loading ? (
            <p>Cargando solicitudes...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            <TablePendingRequests
              users={pendingUsers}
              onAccept={handleAccept}
              onReject={handleReject}
              onStatusChange={refetch}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Requests;
