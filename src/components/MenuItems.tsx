import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import './MenuItems.css';

// Define types for menu item
interface MenuItem {
  bar_item_id: number;
  bar_item_name: string;
  category: string;
  description: string;
  price: number;
}

const MenuItems: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [form, setForm] = useState<Omit<MenuItem, 'bar_item_id'>>({
    bar_item_name: '',
    category: '',
    description: '',
    price: 0,
  });
  const [editId, setEditId] = useState<number | null>(null);

  const API_BASE_URL = 'http://127.0.0.1:8000/menu-items/';

  const fetchMenuItems = async (): Promise<void> => {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch menu items');
      }
      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const createMenuItem = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!response.ok) {
        throw new Error('Failed to create menu item');
      }
      const newItem: MenuItem = await response.json();
      setMenuItems([...menuItems, newItem]);
      setForm({ bar_item_name: '', category: '', description: '', price: 0 });
    } catch (error) {
      console.error('Error creating menu item:', error);
    }
  };

  const updateMenuItem = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (editId === null) return;
    try {
      const response = await fetch(`${API_BASE_URL}${editId}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!response.ok) {
        throw new Error('Failed to update menu item');
      }
      const updatedItem: MenuItem = await response.json();
      setMenuItems(
        menuItems.map((item) =>
          item.bar_item_id === editId ? updatedItem : item
        )
      );
      setEditId(null);
      setForm({ bar_item_name: '', category: '', description: '', price: 0 });
    } catch (error) {
      console.error('Error updating menu item:', error);
    }
  };

  const deleteMenuItem = async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}${id}/`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete menu item');
      }
      setMenuItems(menuItems.filter((item) => item.bar_item_id !== id));
    } catch (error) {
      console.error('Error deleting menu item:', error);
    }
  };

  const editMenuItem = (item: MenuItem): void => {
    setEditId(item.bar_item_id);
    setForm({
      bar_item_name: item.bar_item_name,
      category: item.category,
      description: item.description,
      price: item.price,
    });
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  return (
    <div className="menu-container">
      <h1 className="menu-header">Menu Items</h1>

      <form
        className="menu-form"
        onSubmit={editId ? updateMenuItem : createMenuItem}
      >
        <input
          type="text"
          name="bar_item_name"
          value={form.bar_item_name}
          onChange={handleChange}
          placeholder="Item Name"
          className="menu-input"
          required
        />
        <input
          type="text"
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          className="menu-input"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="menu-input"
          required
        />
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          step="0.01"
          className="menu-input"
          required
        />
        <button type="submit" className="menu-button">
          {editId ? 'Update' : 'Create'}
        </button>
      </form>

      <ul className="menu-list">
        {menuItems.map((item) => (
          <li className="menu-item" key={item.bar_item_id}>
            <h2>{item.bar_item_name}</h2>
            <p>Category: {item.category}</p>
            <p>Description: {item.description}</p>
            <p>Price: ${item.price.toFixed(2)}</p>
            <button className="menu-button" onClick={() => editMenuItem(item)}>
              Edit
            </button>
            <button
              className="menu-button"
              onClick={() => deleteMenuItem(item.bar_item_id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuItems;