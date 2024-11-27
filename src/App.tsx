import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SalesTransactionPage from './pages/SalesTransactionPage';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/view/sales-transaction" element={<SalesTransactionPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
