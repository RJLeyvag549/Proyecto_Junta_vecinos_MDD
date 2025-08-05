import { useState } from 'react';
import useGetTransactions from '../hooks/transactions/useGetTransactions.jsx';
import useCreateTransaction from '../hooks/transactions/useCreateTransaction.jsx';
import useEditTransaction from '../hooks/transactions/useEditTransaction.jsx';
import useDeleteTransaction from '../hooks/transactions/useDeleteTransaction.jsx';
import Navbar from '../components/Navbar.jsx';
import SidebarAdmin from '../components/SidebarAdmin.jsx';
import searchIcon from '../assets/searchIcon.svg';
import '../styles/transactions.css';
import '../styles/HomeAdmin.css';
import '../styles/SidebarAdmin.css';
import '../styles/Navbar.css';

const Transactions = () => {
  const { transactions, loading, error, fetchTransactions } = useGetTransactions();
  const { handleCreateTransaction, loading: createLoading } = useCreateTransaction();
  const { handleEditTransaction, loading: editLoading } = useEditTransaction();
  const { handleDeleteTransaction, loading: deleteLoading } = useDeleteTransaction();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    status: 'pending'
  });
  const [validationErrors, setValidationErrors] = useState({
    description: '',
    amount: ''
  });

  const resetForm = () => {
    setFormData({ amount: '', description: '', status: 'pending' });
    setValidationErrors({ description: '', amount: '' });
    setEditingTransaction(null);
    setShowModal(false);
  };

  // Funciones de hover para el sidebar
  const handleSidebarHover = () => setSidebarOpen(true);
  const handleSidebarLeave = () => setSidebarOpen(false);

  // validar descripcion
  const validateDescription = (value) => {
    if (value.length === 0) {
      return '';
    } else if (value.length < 5) {
      return 'La descripción debe tener al menos 5 caracteres.';
    } else if (value.length > 255) {
      return 'La descripción no puede exceder los 255 caracteres.';
    }
    return '';
  };

  // validar monto
  const validateAmount = (value) => {
    if (value === '') {
      return '';
    }
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return 'El monto debe ser un número válido.';
    } else if (numValue < 0) {
      return 'El monto no puede ser negativo.';
    }
    return '';
  };

  // manejar cambios en los campos del formulario
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    
    // validar el campo especifico
    if (field === 'description') {
      const error = validateDescription(value);
      setValidationErrors(prev => ({ ...prev, description: error }));
    } else if (field === 'amount') {
      const error = validateAmount(value);
      setValidationErrors(prev => ({ ...prev, amount: error }));
    }
  };

  // funcion para manejar la busqueda
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // funcion para manejar el filtro de estado
  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
  };

  // filtrar transacciones por busqueda y estado
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.amount.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    let success = false;

    if (editingTransaction) {
      // Para edicion, enviar todos los campos incluyendo status
      const dataToSend = {
        ...formData,
        amount: parseFloat(formData.amount)
      };
      const response = await handleEditTransaction(editingTransaction.id, dataToSend);
      success = !!response;
    } else {
      // para creacion, NO enviar status (solo amount y description)
      const dataToSend = {
        amount: parseFloat(formData.amount),
        description: formData.description
      };
      const response = await handleCreateTransaction(dataToSend);
      success = !!response;
    }

    if (success) {
      resetForm();
      fetchTransactions();
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      amount: transaction.amount,
      description: transaction.description,
      status: transaction.status
    });
    // limpiar errores de validacion al editar
    setValidationErrors({ description: '', amount: '' });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta transacción?')) {
      const success = await handleDeleteTransaction(id);
      if (success) {
        fetchTransactions();
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'rejected': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completada';
      case 'pending': return 'Pendiente';
      case 'rejected': return 'Rechazada';
      default: return status;
    }
  };

  if (loading) return <div className="loading">Cargando transacciones...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="home-container-admin">
      <Navbar />

      <div
        className="sidebar-wrapper-admin"
        onMouseEnter={handleSidebarHover}
        onMouseLeave={handleSidebarLeave}
      >
        <SidebarAdmin isOpen={sidebarOpen} />
      </div>

      <main className={`main-content-admin ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="transactions-container">
      {handleCreateTransaction.error && (
        <div className="error">Error al crear: {handleCreateTransaction.error}</div>
      )}
      {handleEditTransaction.error && (
        <div className="error">Error al editar: {handleEditTransaction.error}</div>
      )}
      {handleDeleteTransaction.error && (
        <div className="error">Error al eliminar: {handleDeleteTransaction.error}</div>
      )}
      <div className="transactions-header">
        <h1>Gestión de Transacciones</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
          disabled={createLoading}
        >
          Nueva Transacción
        </button>
      </div>

      <div className="transactions-stats">
        <div className="stat-card">
          <h3>Total</h3>
          <p>{filteredTransactions.length}</p>
        </div>
        <div className="stat-card">
          <h3>Pendientes</h3>
          <p>{filteredTransactions.filter(t => t.status === 'pending').length}</p>
        </div>
        <div className="stat-card">
          <h3>Completadas</h3>
          <p>{filteredTransactions.filter(t => t.status === 'completed').length}</p>
        </div>
        <div className="stat-card">
          <h3>Rechazadas</h3>
          <p>{filteredTransactions.filter(t => t.status === 'rejected').length}</p>
        </div>
      </div>

      <div className="transactions-search">
        <div className="search-input-wrapper">
          <img src={searchIcon} alt="Buscar" className="search-icon" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        <div className="filter-wrapper">
          <select
            value={statusFilter}
            onChange={handleStatusFilter}
            className="status-filter"
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="completed">Completadas</option>
            <option value="rejected">Rechazadas</option>
          </select>
        </div>
      </div>

      <div className="transactions-table-container">
        {filteredTransactions.length === 0 ? (
          <div className="no-transactions">
            <p>No hay transacciones que coincidan con la búsqueda</p>
          </div>
        ) : (
          <table className="transactions-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Monto</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Fecha Creación</th>
                <th>Última Actualización</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.id}</td>
                  <td>{transaction.user?.fullName || 'N/A'}</td>
                  <td className="amount">{formatAmount(transaction.amount)}</td>
                  <td className="description">{transaction.description}</td>
                  <td>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(transaction.status) }}
                    >
                      {getStatusText(transaction.status)}
                    </span>
                  </td>
                  <td>{formatDate(transaction.createdAt)}</td>
                  <td>{formatDate(transaction.updatedAt)}</td>
                  <td className="actions">
                    <button
                      className="btn btn-edit"
                      onClick={() => handleEdit(transaction)}
                      disabled={editLoading}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDelete(transaction.id)}
                      disabled={deleteLoading}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingTransaction ? 'Editar Transacción' : 'Nueva Transacción'}</h2>
              <button className="modal-close" onClick={resetForm}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-group">
                <label htmlFor="amount">Monto:</label>
                <input
                  type="number"
                  id="amount"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  required
                />
                {validationErrors.amount && (
                  <div className="validation-error">{validationErrors.amount}</div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="description">Descripción:</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                  rows="3"
                />
                {validationErrors.description && (
                  <div className="validation-error">{validationErrors.description}</div>
                )}
                <div className="char-count">
                  {formData.description.length}/255 caracteres
                  {formData.description.length > 0 && formData.description.length < 5 && (
                    <span className="min-chars"> (mínimo 5)</span>
                  )}
                </div>
              </div>
              {editingTransaction && (
                <div className="form-group">
                  <label htmlFor="status">Estado:</label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="pending">Pendiente</option>
                    <option value="completed">Completada</option>
                    <option value="rejected">Rechazada</option>
                  </select>
                </div>
              )}
              
              {(createLoading || editLoading) && (
                <div className="loading-message">Procesando...</div>
              )}
              
              <div className="modal-actions">
                <button type="button" onClick={resetForm} className="btn btn-secondary">
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={
                    createLoading || 
                    editLoading || 
                    validationErrors.description || 
                    validationErrors.amount ||
                    formData.description.length < 5 ||
                    formData.amount === ''
                  }
                >
                  {editingTransaction ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
        </div>
      </main>
    </div>
  );
};

export default Transactions;
