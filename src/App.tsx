import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SalesTransactionPage from './pages/SalesTransactionPage';
import ProductInventory from './pages/ProductInventoryPage';
import EquipmentManagement from './pages/EquipmentPage';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/view/sales-transaction" element={<SalesTransactionPage />} />
          <Route path="/view/product-inventory" element={<ProductInventory />} />
          <Route path="/view/equipment" element={<EquipmentManagement />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
