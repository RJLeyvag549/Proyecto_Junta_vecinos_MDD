import React, { useState, useEffect } from 'react';
import '../styles/UserPopup.css';
import { useUpdateUserById } from '../hooks/users/useUpdateUserById';
import { useDeleteUserById } from '../hooks/users/useDeleteUserById';
import { updateUserByIdValidation } from '../validations/user.validation.js';

const UserPopup = ({ user, loading, error, onClose }) => {
  const [editMode, setEditMode] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    contact: '',
    homeAddress: '',
  });

  const {
    updateUser,
    loading: updating,
    error: updateError,
  } = useUpdateUserById();

  const {
    deleteUser,
    loading: deleting,
    error: deleteError,
  } = useDeleteUserById();

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        contact: user.contact || '',
        homeAddress: user.homeAddress || '',
      });
    }
  }, [user]);

  const handleClose = () => {
    setEditMode(false);
    setValidationError('');
    setFormData({
      fullName: '',
      email: '',
      contact: '',
      homeAddress: '',
    });
    onClose();
  };

  const handleUpdate = async () => {
    if (!editMode) {
      setEditMode(true);
      return;
    }

    const { error } = updateUserByIdValidation.validate(formData);
    if (error) {
      alert(`${error.details[0].message}`);
      return;
    }

    try {
      await updateUser(user.id, formData);
      alert('Usuario actualizado correctamente');
      setEditMode(false);
      handleClose();
    } catch (err) {
      const mensaje =
        err?.response?.data?.details ||
        err?.response?.data?.message ||
        'Ocurrió un error al actualizar.';
      alert(`${mensaje}`);
    }
  };

  const handleDelete = async () => {
    if (!user?.id) {
      alert('ID de usuario no válido.');
      return;
    }

    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      const result = await deleteUser(user.id);
      if (result) {
        alert('Usuario eliminado correctamente');
        handleClose();
      }
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (!user && !loading) return null;

  return (
    <div className='popup-overlay'>
      <div className='popup-content'>
        <button
          className='close-button'
          onClick={handleClose}
        >
          ×
        </button>

        {loading ? (
          <p>Cargando usuario...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <>
            <h2>Perfil de Usuario</h2>
            <p>
              <strong>Nombre:</strong>{' '}
              {editMode ? (
                <input
                  name='fullName'
                  value={formData.fullName}
                  onChange={handleChange}
                />
              ) : (
                user.fullName
              )}
            </p>

            <p>
              <strong>RUT:</strong> {user.rut}
            </p>
            <p>
              <strong>Rol:</strong> {user.role}
            </p>

            <p>
              <strong>Email:</strong>{' '}
              {editMode ? (
                <input
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                />
              ) : (
                user.email
              )}
            </p>

            <p>
              <strong>Contacto:</strong>{' '}
              {editMode ? (
                <input
                  name='contact'
                  value={formData.contact}
                  onChange={handleChange}
                />
              ) : (
                user.contact
              )}
            </p>

            <p>
              <strong>Dirección:</strong>{' '}
              {editMode ? (
                <input
                  name='homeAddress'
                  value={formData.homeAddress}
                  onChange={handleChange}
                />
              ) : (
                user.homeAddress
              )}
            </p>

            {user?.docIdentity && (
              <div className='doc-link'>
                <strong>Cédula de Identidad: </strong>
                <a
                  href={user.docIdentity}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Ver documento
                </a>
              </div>
            )}

            {user?.docResidence && (
              <div className='doc-link'>
                <strong>Comprobante de Domicilio: </strong>
                <a
                  href={user.docResidence}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Ver documento
                </a>
              </div>
            )}

            {validationError && (
              <p style={{ color: 'red' }}>
                Error de validación: {validationError}
              </p>
            )}

            {updateError && (
              <p style={{ color: 'red' }}>Error al actualizar: {updateError}</p>
            )}
            {deleteError && (
              <p style={{ color: 'red' }}>Error al eliminar: {deleteError}</p>
            )}

            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
              <button
                onClick={handleUpdate}
                disabled={updating}
              >
                {editMode ? 'Guardar' : 'Actualizar'}
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{ background: 'red', color: 'white' }}
              >
                Eliminar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserPopup;
