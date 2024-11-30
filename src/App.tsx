import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SalesTransactionPage from './pages/SalesTransactionPage';
import ProductInventory from './pages/ProductInventoryPage';
import EquipmentManagement from './pages/EquipmentPage';
import Sidebar from './pages/Sidebar'; // Import the Sidebar component
import './App.css';

function App() {
  return (
    <div className="App" style={{ display: 'flex' }}>
      <Router>
        <Sidebar />
        {/* Main content area */} 
        <div style={{ marginLeft: '150px', padding: '20px', width: '100%' }}>
          <Routes>
            <Route path="/view/sales-transaction" element={<SalesTransactionPage />} />
            <Route path="/view/product-inventory" element={<ProductInventory />} />
            <Route path="/view/equipment" element={<EquipmentManagement />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
