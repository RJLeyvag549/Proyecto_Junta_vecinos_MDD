import { useState } from 'react';
import Navbar from '../components/Navbar';
import SidebarAdmin from '../components/SidebarAdmin';
import useGetTransactions from '../hooks/transactions/useGetTransactions';
import useGetInventories from '../hooks/inventory/useGetInventories';
import '../styles/FinancialCharts.css';
import '../styles/HomeAdmin.css';
import '../styles/SidebarAdmin.css';
import '../styles/Navbar.css';

const FinancialCharts = () => {
  const { transactions, loading: transactionsLoading, error: transactionsError } = useGetTransactions();
  const { inventories, loading: inventoriesLoading, error: inventoriesError } = useGetInventories();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chartType, setChartType] = useState('transactions'); // 'transactions' o 'inventory'

  // Funciones de hover para el sidebar
  const handleSidebarHover = () => setSidebarOpen(true);
  const handleSidebarLeave = () => setSidebarOpen(false);

  // Determinar estado de carga y error actual
  const currentLoading = chartType === 'transactions' ? transactionsLoading : inventoriesLoading;
  const currentError = chartType === 'transactions' ? transactionsError : inventoriesError;

  // Cálculos para los gráficos de transacciones
  const calculateFinancialData = () => {
    if (!transactions || transactions.length === 0) {
      return {
        totalAmount: 0,
        totalByStatus: { pending: 0, completed: 0, rejected: 0 },
        monthlyData: [],
        averageAmount: 0,
        transactionCount: 0
      };
    }

    const totalAmount = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    const transactionCount = transactions.length;
    const averageAmount = totalAmount / transactionCount;

    // Agrupar por estado
    const totalByStatus = transactions.reduce((acc, transaction) => {
      acc[transaction.status] = (acc[transaction.status] || 0) + transaction.amount;
      return acc;
    }, { pending: 0, completed: 0, rejected: 0 });

    // Agrupar por mes
    const monthlyData = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[monthKey]) {
        acc[monthKey] = { month: monthKey, amount: 0, count: 0 };
      }
      acc[monthKey].amount += transaction.amount;
      acc[monthKey].count += 1;
      
      return acc;
    }, {});

    return {
      totalAmount,
      totalByStatus,
      monthlyData: Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month)),
      averageAmount,
      transactionCount
    };
  };

  // Cálculos para los gráficos de inventario
  const calculateInventoryData = () => {
    if (!inventories || inventories.length === 0) {
      return {
        totalItems: 0,
        totalByStatus: { disponible: 0, 'stock_bajo': 0, agotado: 0 },
        totalValue: 0,
        averageValue: 0
      };
    }

    const totalItems = inventories.length;
    
    // Calcular valor total usando unitPrice y quantity
    const totalValue = inventories.reduce((sum, item) => {
      const price = parseFloat(item.unitPrice) || 0;
      const quantity = parseInt(item.quantity) || 0;
      return sum + (price * quantity);
    }, 0);
    
    const averageValue = totalItems > 0 ? totalValue / totalItems : 0;

    // Agrupar por estado calculado (como en Inventory.jsx)
    const totalByStatus = inventories.reduce((acc, item) => {
      const quantity = parseInt(item.quantity) || 0;
      let status;
      
      if (quantity === 0) {
        status = 'agotado';
      } else if (quantity < 5) {
        status = 'stock_bajo';
      } else {
        status = 'disponible';
      }
      
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, { disponible: 0, stock_bajo: 0, agotado: 0 });

    return {
      totalItems,
      totalByStatus,
      totalValue,
      averageValue
    };
  };

  const financialData = calculateFinancialData();
  const inventoryData = calculateInventoryData();

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
      case 'completed': return 'Completadas';
      case 'pending': return 'Pendientes';
      case 'rejected': return 'Rechazadas';
      default: return status;
    }
  };

  const getInventoryStatusColor = (status) => {
    switch (status) {
      case 'disponible': return '#4CAF50';
      case 'stock_bajo': return '#FF9800';
      case 'agotado': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getInventoryStatusText = (status) => {
    switch (status) {
      case 'disponible': return 'Disponible';
      case 'stock_bajo': return 'Stock Bajo';
      case 'agotado': return 'Agotado';
      default: return status;
    }
  };

  const renderSummaryCards = () => {
    if (chartType === 'transactions') {
      return (
        <div className="summary-cards">
          <div className="summary-card">
            <h3>Total Transacciones</h3>
            <p className="summary-value">{financialData.transactionCount}</p>
          </div>
          <div className="summary-card">
            <h3>Monto Total</h3>
            <p className="summary-value">{formatAmount(financialData.totalAmount)}</p>
          </div>
          <div className="summary-card">
            <h3>Promedio por Transacción</h3>
            <p className="summary-value">{formatAmount(financialData.averageAmount)}</p>
          </div>
        </div>
      );
    } else {
      return (
        <div className="summary-cards">
          <div className="summary-card">
            <h3>Total Items</h3>
            <p className="summary-value">{inventoryData.totalItems}</p>
          </div>
          <div className="summary-card">
            <h3>Valor Total del Inventario</h3>
            <p className="summary-value">{formatAmount(inventoryData.totalValue)}</p>
          </div>
          <div className="summary-card">
            <h3>Valor Promedio por Item</h3>
            <p className="summary-value">{formatAmount(inventoryData.averageValue)}</p>
          </div>
        </div>
      );
    }
  };

  const renderBarChart = (data, title) => {
    const maxValue = Math.max(...Object.values(data));
    const isInventory = chartType === 'inventory';
    
    return (
      <div className="chart-container">
        <h3>{title}</h3>
        <div className="bar-chart">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="bar-item">
              <div className="bar-label">
                {isInventory ? getInventoryStatusText(key) : getStatusText(key)}
              </div>
              <div className="bar-wrapper">
                <div 
                  className="bar"
                  style={{
                    height: `${(value / maxValue) * 200}px`,
                    backgroundColor: isInventory ? getInventoryStatusColor(key) : getStatusColor(key)
                  }}
                />
                <div className="bar-value">
                  {isInventory ? value : formatAmount(value)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPieChart = (data, title) => {
    const total = Object.values(data).reduce((sum, value) => sum + value, 0);
    const isInventory = chartType === 'inventory';
    
    return (
      <div className="chart-container">
        <h3>{title}</h3>
        <div className="pie-chart">
          {Object.entries(data).map(([key, value]) => {
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return (
              <div key={key} className="pie-item">
                <div 
                  className="pie-color"
                  style={{ backgroundColor: isInventory ? getInventoryStatusColor(key) : getStatusColor(key) }}
                />
                <span className="pie-label">
                  {isInventory ? getInventoryStatusText(key) : getStatusText(key)}: {percentage}% 
                  {isInventory ? ` (${value} items)` : ` (${formatAmount(value)})`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderCharts = () => {
    if (chartType === 'transactions') {
      return (
        <div className="charts-grid">
          {renderBarChart(financialData.totalByStatus, "Montos por Estado")}
          {renderPieChart(financialData.totalByStatus, "Distribución por Estado")}
          
          {/* Gráfico de tendencia mensual */}
          <div className="chart-container full-width">
            <h3>Tendencia Mensual</h3>
            {financialData.monthlyData.length > 0 ? (
              <div className="line-chart">
                {financialData.monthlyData.map((item, index) => (
                  <div key={index} className="month-item">
                    <div className="month-label">{item.month}</div>
                    <div className="month-data">
                      <div>Cantidad: {item.count}</div>
                      <div>Monto: {formatAmount(item.amount)}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No hay datos de transacciones disponibles</p>
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div className="charts-grid">
          {renderBarChart(inventoryData.totalByStatus, "Items por Estado")}
          {renderPieChart(inventoryData.totalByStatus, "Distribución por Estado")}
        </div>
      );
    }
  };

  if (currentLoading) return <div className="loading">Cargando datos...</div>;
  if (currentError) return <div className="error">Error: {currentError}</div>;

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
        <div className="financial-charts-container">
          <div className="charts-header">
            <h1>Gráficos Financieros</h1>
            <p>Análisis visual de las transacciones financieras e inventario</p>
            
            {/* Selector de tipo de gráfico */}
            <div className="chart-type-selector">
              <button 
                className={`selector-btn ${chartType === 'transactions' ? 'active' : ''}`}
                onClick={() => setChartType('transactions')}
              >
                📊 Transacciones
              </button>
              <button 
                className={`selector-btn ${chartType === 'inventory' ? 'active' : ''}`}
                onClick={() => setChartType('inventory')}
              >
                📦 Inventario
              </button>
            </div>
          </div>

          {/* Tarjetas de resumen */}
          {renderSummaryCards()}

          {/* Gráficos */}
          {renderCharts()}
        </div>
      </main>
    </div>
  );
};

export default FinancialCharts;
