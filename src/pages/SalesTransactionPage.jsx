import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SalesTransactionPage = () => {

  const [ menuItems, setMenuItems ] = useState([]);
  const [ menuItemId, setMenuItemId ] = useState('');
  const [ quantity, setQuantity ] = useState('');
  const [ transactionDate, setTransactionDate ] = useState('');

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/inventory/items')
      .then(response => {
        console.log(response.data);
        setMenuItems(response.data);
      })
      .catch(error => {
        console.error('Cannot get menu-items: ', error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      'menu-item-id': menuItemId,
      'quantity': quantity,
      'transaction-date': transactionDate,
    };
    axios
      .post('http://127.0.0.1:8000/inventory/sales-transaction/', data)
      .then(response => {
        setMenuItemId('');
        setQuantity('');
        setTransactionDate('');
      });
  }

  return (
    <div>
      <h2>New Sales Transaction</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="menuItem">Menu Item: </label>
          <select
            id="menuItem"
            value={menuItemId}
            onChange={(e) => setMenuItemId(e.target.value)}
          >
            {menuItems.map(
              item => (
                <option key={item["menu-item-id"]} value={item["menu-item-id"]}>
                  {item["menu-item-name"]}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label htmlFor="quantity">Quantity: </label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="1"
          />
        </div>
        <div>
          <label htmlFor="transactionDate">Transaction Date: </label>
          <input
            type="date"
            id="transactionDate"
            value={transactionDate}
            onChange={(e) => setTransactionDate(e.target.value)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default SalesTransactionPage;