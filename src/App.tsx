import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SalesTransactionPage from './pages/SalesTransactionPage';
import ProductInventory from './pages/ProductInventoryPage';
import logo from './logo.svg';
import './App.css';
import NotificationsPage from './pages/NotificationsPage';
import Reservations from './pages/Reservations';
import LoginPage from './components/LoginPage';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/view/notifications" element={<NotificationsPage />} />
          <Route
            path="/view/sales-transaction"
            element={<SalesTransactionPage />}
          />
          <Route
            path="/view/product-inventory"
            element={<ProductInventory />}
          />
          <Route path="/view/reservations" element={<Reservations />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
