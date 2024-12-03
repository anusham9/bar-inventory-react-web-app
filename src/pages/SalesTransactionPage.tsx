import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/SalesTransaction.css";

interface SalesTransaction {
  sales_transaction_id: number;
  menu_item_id: number;
  menu_item_name: string;
  quantity_purchased: number;
  transaction_date: string; // YYYY-MM-DD
}

interface MenuItem {
  menu_item_id: number;
  menu_item_name: string;
  category: string | null;
  description: string | null;
  price: number;
}

export default function SalesTransactionPage() {

  const [ salesTransactionList, setSalesTransactionList ] = useState<SalesTransaction[]>([]);
  const [ sortedSalesTransactionList, setSortedSalesTransactionList ] = useState<SalesTransaction[]>([]);
  const [ sortField, setSortField ] = useState<string>('transaction_date');
  const [ sortOrder, setSortOrder ] = useState<string>('asc');

  const [ menuItems, setMenuItems ] = useState<MenuItem[]>([]);
  const [ menuItemId, setMenuItemId ] = useState<string>('');
  const [ quantity, setQuantity ] = useState<string>('');
  const [ transactionDate, setTransactionDate ] = useState<string>('');
  const [ isLoading, setIsLoading ] = useState<Boolean>(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [ salesTransactionResponse, menuItemsResponse ] = await Promise.all([
        axios.get("/inventory/sales-transaction"),
        axios.get("/inventory/items"),
      ]);
      setSalesTransactionList(salesTransactionResponse.data);
      setMenuItems(menuItemsResponse.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // sort all transactions
  useEffect(() => {
    const sortedList = [...salesTransactionList].sort((a, b) => {
      let fieldA: any;
      let fieldB: any;

      switch (sortField) {
        case 'menu_item_name':
          fieldA = a.menu_item_name.toLowerCase();
          fieldB = b.menu_item_name.toLowerCase();
          break;
        case 'quantity_purchased':
          fieldA = Number(a.quantity_purchased);
          fieldB = Number(b.quantity_purchased);
          break;
        case 'transaction_date':
          fieldA = new Date(a.transaction_date).getTime();
          fieldB = new Date(b.transaction_date).getTime();
          break;
        default:
          fieldA = new Date(a.transaction_date).getTime();
          fieldB = new Date(b.transaction_date).getTime();
      }

      if (fieldA < fieldB) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (fieldA > fieldB) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setSortedSalesTransactionList(sortedList);
  }, [salesTransactionList, sortField, sortOrder]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData();
    data.append('menu_item_id', menuItemId);
    data.append('quantity', quantity);
    data.append('transaction_date', transactionDate);
    if (window.confirm("Are you sure you want to add this sales transaction?")) {
      try {
        const response = await axios.post('/inventory/sales-transaction', data);
        setMenuItemId('');
        setQuantity('');
        setTransactionDate('');
        alert(response.data.message);
        fetchData();
      } catch (error) {
        console.error('Cannot create sales transaction:', error);
        alert("Failed to add sales transaction. Please try again.");
      }
    }
  }

  const handleSortFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortField(e.target.value);
  };

  const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="sales-transaction-container">
      <h2 className="sales-transaction-title">Sales Transaction</h2>
      <form onSubmit={handleSubmit} className="sales-transaction-form">
        <div>
          <label htmlFor="menuItem">Menu Item: </label>
          <select
            id="menuItem"
            value={menuItemId}
            onChange={(e) => setMenuItemId(e.target.value.toString())}
          >
            {menuItems.map(
              item => (
                <option key={item.menu_item_name} value={item.menu_item_id}>
                  {item.menu_item_name}
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
        <button className="add-button" type="submit">Submit</button>
      </form>
      <div className="sales-transaction-sorter-container">
        <label htmlFor="sortField">Sort By:</label>
        <select id="sortField" value={sortField} onChange={handleSortFieldChange}>
          <option value="menu_item_name">Menu Item Name</option>
          <option value="quantity_purchased">Quantity</option>
          <option value="transaction_date">Date</option>
        </select>

        <label htmlFor="sortOrder">Order:</label>
        <select id="sortOrder" value={sortOrder} onChange={handleSortOrderChange}>
          <option value="asc">Ascending(small to large)</option>
          <option value="desc">Descending(large to small)</option>
        </select>
      </div>
      <table className="sales-transaction-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Item</th>
            <th>Quantity</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {
            sortedSalesTransactionList.map((transaction) => (
              <tr key={"tsx_"+transaction.sales_transaction_id}>
                <td>{transaction.sales_transaction_id}</td>
                <td>{transaction.menu_item_name}</td>
                <td>{transaction.quantity_purchased}</td>
                <td>{transaction.transaction_date}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
}