import React, { useEffect, useState } from 'react';
import SidebarAdmin from '../components/SidebarAdmin';
import Navbar from '../components/Navbar';
import TableUserList from '../components/TableUserList';
import '../styles/UserList.css';
import { getUsers } from '../services/user.service'; // asegúrate de que esta ruta esté bien

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUsers();
        setUsers(response.data); // debe ser data si tu backend responde como: { message, data }
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='user-list-page'>
      <SidebarAdmin />
      <div className='main-content'>
        <Navbar />
        <div className='content-container'>
          <h1 className='page-title'>PADRÓN DE VECINOS</h1>
          <TableUserList users={users} />
        </div>
      </div>
    </div>
  );
};

export default UserList;
