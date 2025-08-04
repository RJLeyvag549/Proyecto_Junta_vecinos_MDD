import React from 'react';
import '../styles/UserList.css';

const TableUserList = ({ users }) => {
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
          {users.map((user, idx) => (
            <tr key={idx}>
              <td>{user.role}</td>
              <td>{user.fullName}</td>
              <td>{user.rut}</td>
              <td>
                <button className='btn-view-profile'>Ver perfil</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableUserList;
