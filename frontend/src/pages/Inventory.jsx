import { useState } from 'react';
import useGetInventories from '../hooks/inventory/useGetInventories';
import useCreateInventory from '../hooks/inventory/useCreateInventory';
import useEditInventory from '../hooks/inventory/useEditInventory';
import useDeleteInventory from '../hooks/inventory/useDeleteInventory';
import Navbar from '../components/Navbar';
import SidebarAdmin from '../components/SidebarAdmin';
import searchIcon from '../assets/searchIcon.svg';
import '../styles/inventory.css';
import '../styles/HomeAdmin.css';
import '../styles/SidebarAdmin.css';
import '../styles/Navbar.css';

const Inventory = () => {
  const { inventories, loading, error, refetch } = useGetInventories();
  const { handleCreateInventory, loading: createLoading, error: createError, clearError: clearCreateError } = useCreateInventory();
  const { handleEditInventory, loading: editLoading, error: editError, clearError: clearEditError } = useEditInventory();
  const { handleDeleteInventory, loading: deleteLoading } = useDeleteInventory();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingInventory, setEditingInventory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({
    itemName: '',
    quantity: '',
    description: '',
    unitPrice: ''
  });
  const [validationErrors, setValidationErrors] = useState({
    itemName: '',
    quantity: '',
    unitPrice: ''
  });

  const resetForm = () => {
    setFormData({ itemName: '', quantity: '', description: '', unitPrice: '' });
    setValidationErrors({ itemName: '', quantity: '', unitPrice: '' });
    setEditingInventory(null);
    setShowModal(false);
    clearCreateError();
    clearEditError();
  };

  // Funciones de hover para el sidebar
  const handleSidebarHover = () => setSidebarOpen(true);
  const handleSidebarLeave = () => setSidebarOpen(false);

  // validaciones en tiempo real
  const validateItemName = (value) => {
    if (value.length === 0) {
      return '';
    } else if (value.length < 2) {
      return 'El nombre debe tener al menos 2 caracteres.';
    } else if (value.length > 100) {
      return 'El nombre no puede exceder los 100 caracteres.';
    }
    return '';
  };

  const validateQuantity = (value) => {
    if (value === '') {
      return '';
    }
    
    const numValue = parseInt(value);
    
    // Verificar si es un número válido
    if (isNaN(numValue)) {
      return 'La cantidad debe ser un número válido.';
    }
    
    // Verificar que no sea negativo
    if (numValue < 0) {
      return 'La cantidad no puede ser negativa.';
    }
    
    // Verificar cantidad mínima para crear (solo en creación, no en edición)
    if (value !== '' && numValue === 0) {
      return 'La cantidad mínima es 1 para crear un item.';
    }
    
    // Verificar cantidad máxima
    if (numValue > 1000000) {
      return 'La cantidad máxima permitida es 1.000.000.';
    }
    
    // Verificar que sea un número entero
    if (!Number.isInteger(numValue)) {
      return 'La cantidad debe ser un número entero.';
    }
    
    return '';
  };

  const validateUnitPrice = (value) => {
    if (value === '') {
      return '';
    }
    
    const numValue = parseFloat(value);
    
    // Verificar si es un número válido
    if (isNaN(numValue)) {
      return 'El precio debe ser un número válido.';
    }
    
    // Verificar precio mínimo
    if (numValue < 1) {
      return 'El precio mínimo es $1.';
    }
    
    // Verificar precio máximo
    if (numValue > 100000000) {
      return 'El precio máximo permitido es $100.000.000.';
    }
    
    // Verificar que no tenga más de 2 decimales
    const decimalCount = (value.split('.')[1] || '').length;
    if (decimalCount > 2) {
      return 'El precio no puede tener más de 2 decimales.';
    }
    
    return '';
  };

  // manejar cambios en los campos del formulario
  const handleInputChange = (field, value) => {
    // Para el campo quantity, filtrar y validar
    if (field === 'quantity') {
      // Remover caracteres no numéricos
      const cleanValue = value.replace(/[^0-9]/g, '');
      
      // Limitar longitud (evitar números demasiado largos)
      if (cleanValue.length > 7) {
        return;
      }
      
      setFormData({ ...formData, [field]: cleanValue });
      
      // Validar el campo específico
      const error = validateQuantity(cleanValue);
      setValidationErrors(prev => ({ ...prev, quantity: error }));
    } 
    // Para el campo unitPrice, filtrar y validar
    else if (field === 'unitPrice') {
      // Remover caracteres no numéricos excepto punto decimal
      const cleanValue = value.replace(/[^0-9.]/g, '');
      
      // Limitar a un solo punto decimal
      const parts = cleanValue.split('.');
      if (parts.length > 2) {
        return; // No permitir múltiples puntos decimales
      }
      
      // Limitar decimales a 2 dígitos
      if (parts[1] && parts[1].length > 2) {
        parts[1] = parts[1].substring(0, 2);
      }
      
      const finalValue = parts.join('.');
      
      // Limitar longitud total
      if (finalValue.length > 12) {
        return;
      }
      
      setFormData({ ...formData, [field]: finalValue });
      
      // Validar el campo específico
      const error = validateUnitPrice(finalValue);
      setValidationErrors(prev => ({ ...prev, unitPrice: error }));
    } 
    // Para otros campos (itemName, description)
    else {
      setFormData({ ...formData, [field]: value });
      
      // Validar el campo específico
      if (field === 'itemName') {
        const error = validateItemName(value);
        setValidationErrors(prev => ({ ...prev, itemName: error }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let success = false;

    if (editingInventory) {
      // Para edición
      const dataToSend = {
        ...formData,
        quantity: parseInt(formData.quantity),
        unitPrice: parseFloat(formData.unitPrice)
      };
      const response = await handleEditInventory(editingInventory.id, dataToSend);
      success = !!response;
    } else {
      // Para creación
      const dataToSend = {
        itemName: formData.itemName.trim(),
        quantity: parseInt(formData.quantity),
        description: formData.description.trim(),
        unitPrice: parseFloat(formData.unitPrice)
      };
      const response = await handleCreateInventory(dataToSend);
      success = !!response;
    }

    if (success) {
      resetForm();
      refetch();
    }
  };

  const handleNewItem = () => {
    clearCreateError();
    clearEditError();
    setShowModal(true);
  };

  const handleEdit = (inventory) => {
    setEditingInventory(inventory);
    setFormData({
      itemName: inventory.itemName,
      quantity: inventory.quantity.toString(),
      description: inventory.description || '',
      unitPrice: inventory.unitPrice.toString()
    });
    // limpiar errores de validacion al editar
    setValidationErrors({ itemName: '', quantity: '', unitPrice: '' });
    clearCreateError();
    clearEditError();
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este item?')) {
      const success = await handleDeleteInventory(id);
      if (success) {
        refetch();
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // función para manejar el filtro de estado
  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
  };

  const filteredInventories = inventories.filter(inventory => {
    const matchesSearch = 
      inventory.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inventory.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter !== 'all') {
      if (statusFilter === 'agotado') {
        matchesStatus = inventory.quantity === 0;
      } else if (statusFilter === 'stock_bajo') {
        matchesStatus = inventory.quantity > 0 && inventory.quantity < 5;
      } else if (statusFilter === 'disponible') {
        matchesStatus = inventory.quantity >= 5;
      }
    }
    
    return matchesSearch && matchesStatus;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  const getStatusInfo = (inventory) => {
    if (inventory.quantity === 0) {
      return { text: 'Agotado', class: 'status-out-of-stock' };
    } else if (inventory.quantity < 5) {
      return { text: 'Stock Bajo', class: 'status-low-stock' };
    } else {
      return { text: 'Disponible', class: 'status-available' };
    }
  };

  const totalItems = inventories.length;
  const availableItems = inventories.filter(inv => inv.quantity > 0).length;
  const outOfStockItems = inventories.filter(inv => inv.quantity === 0).length;
  const lowStockItems = inventories.filter(inv => inv.quantity > 0 && inv.quantity < 5).length;

  if (loading) return <div className="loading">Cargando inventario...</div>;
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
        <div className="inventory-container">
        <div className="inventory-header">
          <h1>Gestión de Inventario</h1>
          <button 
            className="btn btn-primary"
            onClick={handleNewItem}
            disabled={createLoading}
          >
            Nuevo Item
          </button>
        </div>

        <div className="inventory-stats">
          <div className="stat-card">
            <h3>Total Items</h3>
            <p>{totalItems}</p>
          </div>
          <div className="stat-card">
            <h3>Disponibles</h3>
            <p>{availableItems}</p>
          </div>
          <div className="stat-card">
            <h3>Stock Bajo</h3>
            <p>{lowStockItems}</p>
          </div>
          <div className="stat-card">
            <h3>Agotados</h3>
            <p>{outOfStockItems}</p>
          </div>
        </div>

        <div className="inventory-search">
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
              <option value="disponible">Disponibles</option>
              <option value="agotado">Agotados</option>
              <option value="stock_bajo">Stock Bajo</option>
            </select>
          </div>
        </div>

        <div className="inventory-table-container">
          {filteredInventories.length === 0 ? (
            <div className="no-inventory">
              <p>No hay items en el inventario</p>
            </div>
          ) : (
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre del Item</th>
                  <th>Cantidad</th>
                  <th>Descripción</th>
                  <th>Precio Unitario</th>
                  <th>Estado</th>
                  <th>Usuario</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventories.map((inventory) => {
                  const status = getStatusInfo(inventory);
                  return (
                    <tr key={inventory.id}>
                      <td>{inventory.id}</td>
                      <td>{inventory.itemName}</td>
                      <td className="quantity">{inventory.quantity}</td>
                      <td className="description">{inventory.description || 'Sin descripción'}</td>
                      <td className="price">{formatPrice(inventory.unitPrice)}</td>
                      <td>
                        <span className={`status-badge ${status.class}`}>
                          {status.text}
                        </span>
                      </td>
                      <td>{inventory.user?.fullName || 'N/A'}</td>
                      <td className="actions">
                        <button
                          className="btn btn-edit"
                          onClick={() => handleEdit(inventory)}
                          disabled={editLoading}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-delete"
                          onClick={() => handleDelete(inventory.id)}
                          disabled={deleteLoading}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>{editingInventory ? 'Editar Item' : 'Nuevo Item'}</h2>
                <button className="modal-close" onClick={resetForm}>×</button>
              </div>
              <form onSubmit={handleSubmit} className="modal-body">
                <div className="form-group">
                  <label htmlFor="itemName">Nombre del Item:</label>
                  <input
                    type="text"
                    id="itemName"
                    value={formData.itemName}
                    onChange={(e) => handleInputChange('itemName', e.target.value)}
                    required
                    placeholder="Ej: Sillas plásticas"
                  />
                  {validationErrors.itemName && (
                    <div className="validation-error">{validationErrors.itemName}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="quantity">Cantidad:</label>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    max="1000000"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                    required
                    placeholder="Ej: 10"
                  />
                  <small className="input-hint">
                    Cantidad mínima: 1 - Máxima: 1.000.000 (números enteros)
                  </small>
                  {validationErrors.quantity && (
                    <div className="validation-error">{validationErrors.quantity}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="description">Descripción:</label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows="3"
                    placeholder="Descripción del item (opcional)"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="unitPrice">Precio Unitario:</label>
                  <input
                    type="number"
                    id="unitPrice"
                    step="0.01"
                    min="1"
                    max="100000000"
                    value={formData.unitPrice}
                    onChange={(e) => handleInputChange('unitPrice', e.target.value)}
                    required
                    placeholder="Ej: 5000.00"
                  />
                  <small className="input-hint">
                    Precio mínimo: $1 - Máximo: $100.000.000
                  </small>
                  {validationErrors.unitPrice && (
                    <div className="validation-error">{validationErrors.unitPrice}</div>
                  )}
                </div>
                {(createLoading || editLoading) && (
                  <div className="loading-message">Procesando...</div>
                )}
                
                {!editingInventory && createError && (
                  <div className="validation-error" style={{ 
                    marginBottom: '1rem',
                    padding: '0.75rem',
                    backgroundColor: '#ffebee',
                    border: '1px solid #f44336',
                    borderRadius: '5px',
                    textAlign: 'center'
                  }}>
                    {createError}
                  </div>
                )}
                
                {editingInventory && editError && (
                  <div className="validation-error" style={{ 
                    marginBottom: '1rem',
                    padding: '0.75rem',
                    backgroundColor: '#ffebee',
                    border: '1px solid #f44336',
                    borderRadius: '5px',
                    textAlign: 'center'
                  }}>
                    {editError}
                  </div>
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
                      validationErrors.itemName || 
                      validationErrors.quantity ||
                      validationErrors.unitPrice ||
                      formData.itemName.length < 2 ||
                      formData.quantity === '' ||
                      formData.unitPrice === ''
                    }
                  >
                    {editingInventory ? 'Actualizar' : 'Crear'}
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

export default Inventory;
