import React from 'react';
import '../styles/UserList.css';

const TableUserList = ({ users, onViewProfile }) => {
  return (
    <div className='table-container'>
      <table className='user-table'>
        <thead>
          <tr>
            <th>Rol</th>
            <th>Nombre</th>
            <th>RUT</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) && users.length > 0 ? (
            users.map((user, idx) => {
              return (
                <tr key={idx}>
                  <td>{user.role || 'Sin rol'}</td>
                  <td>{user.fullName || 'Sin nombre'}</td>
                  <td>{user.rut || 'Sin RUT'}</td>
                  <td>
                    <button
                      className='btn-view-profile'
                      onClick={() => {
                        onViewProfile(user.id);
                      }}
                    >
                      Ver perfil
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan='4'>No hay usuarios aprobados para mostrar.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableUserList;
