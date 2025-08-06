import React, { useEffect, useState } from 'react';
import SidebarAdmin from '../components/SidebarAdmin';
import Navbar from '../components/Navbar';
import TableUserList from '../components/TableUserList';
import UserPopup from '../components/UserPopup';
import { getUsers } from '../services/user.service';
import { useGetUserById } from '../hooks/users/useGetUserById';
import '../styles/UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const { user, loading, error } = useGetUserById(selectedId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUsers();
        setUsers(response.data);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    };

    fetchData();
  }, []);

  const handleClosePopup = () => setSelectedId(null);

  return (
    <div className='user-list-page'>
      <SidebarAdmin />
      <div className='main-content'>
        <Navbar />
        <div className='content-container-UserList'>
          <h1 className='page-title'>PADRÓN DE VECINOS</h1>

          <TableUserList
            users={users}
            onViewProfile={setSelectedId}
          />

          {selectedId && (
            <UserPopup
              user={user}
              loading={loading}
              error={error}
              onClose={handleClosePopup}
            />
          )}
          {selectedId && loading && (
            <div className='popup-overlay'>
              <div className='popup-content'>
                <p>Cargando datos del usuario...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserList;
