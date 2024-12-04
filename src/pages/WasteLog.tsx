import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/ProductInventory.css';

interface Waste {
  waste_log_id: number;
  waste_type: string;
  user: string;
  waste_date: string;
  reason: string;
  quantity_waste: number;
  product: string;
}

export default function WasteLog() {
  const [wasteLog, setWasteLog] = useState<Waste[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingWasteLog, setEditingWasteLog] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Waste>>({
    waste_date: new Date().toISOString(),
  });
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [isManager, setIsManager] = useState<boolean>(true); // Simulating role-based access

  const fetchData = async () => {
    setLoading(true);
    try {
      const wasteLogResponse = await axios.get('/inventory/view-waste-log/');
      setWasteLog(wasteLogResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = (log: Waste) => {
    setEditingWasteLog(log.waste_log_id);
    setFormData(log);
  };

  const handleDelete = async (logId: number) => {
    console.log(logId);
    await axios.delete(`/inventory/delete-waste-log-entry/${logId}`);
    setWasteLog((prevWasteLog) =>
      prevWasteLog.filter((log) => log.waste_log_id !== logId)
    );
  };

  const handleAddWasteLog = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowAddForm(true);
    try {
      const payload = {
        ...formData,
      };
      console.log(payload);
      const response = await axios.post(
        '/inventory/add-waste-log-entry/',
        payload
      );
      const newWasteLog = response.data;

      console.log('New waste log:', newWasteLog);

      // Update state
      fetchData();
      // setWasteLog([...wasteLog, newWasteLog]);
      setShowAddForm(false);
      setFormData({});
    } catch (error) {
      console.error('Error adding reservation:', error);
      alert('Failed to add reservation. Please try again.');
    }
  };

  const handleSave = async (logId: number) => {
    try {
      if (logId in wasteLog) {
        //update-waste-log-entry
        await axios.put(`/inventory/update-waste-log-entry/${logId}`, {
          ...formData,
        });
        alert('Waste Log updated successfully!');
        setEditingWasteLog(null);
        fetchData();
      }
      alert('Waste Log updated successfully!');
      setEditingWasteLog(null);
      fetchData();
    } catch (error) {
      console.error('Error updating waste log:', error);
      alert('Failed to update waste log. Please try again.');
    }
  };

  return (
    <div className="inventory-container">
      <h1 className="inventory-title">Waste Log</h1>

      {isManager && (
        <button
          className="add-button"
          onClick={() => setShowAddForm((prev) => !prev)}
        >
          {showAddForm ? 'Cancel' : 'Add Log'}
        </button>
      )}

      {showAddForm && isManager && (
        <form onSubmit={handleAddWasteLog} className="product-form">
          <h2>Add New Waste Log Entry</h2>
          <label>
            Waste Type
            <input
              type="text"
              name="waste_type"
              placeholder="Enter waste type"
              value={formData.waste_type || ''}
              onChange={handleInputChange}
            />
          </label>
          <label>
            User
            <input
              type="text"
              name="user"
              placeholder="Enter User"
              value={formData.user}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Waste Date
            <input
              type="date"
              name="waste_date"
              value={formData.waste_date}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Reason
            <input
              type="text"
              name="reason"
              value={formData.reason || ''}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Quantity Waste
            <input
              type="number"
              name="quantity_waste"
              value={formData.quantity_waste || ''}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Product
            <input
              type="input"
              name="product"
              value={formData.product}
              onChange={handleInputChange}
            />
          </label>
          <button type="submit" className="action-button save-button">
            Add Log Entry
          </button>
        </form>
      )}

      <table className="inventory-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Waste Type</th>
            <th>User</th>
            <th>Waste Date</th>
            <th>Reason</th>
            <th>Quantity Wasted</th>
            <th>Product</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {wasteLog.map((log) => (
            <tr key={log.waste_log_id}>
              <td>{log.waste_log_id}</td>
              <td>
                {editingWasteLog === log.waste_log_id ? (
                  <input
                    type="text"
                    name="waste_type"
                    value={formData.waste_type || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  log.waste_type
                )}
              </td>
              <td>
                {editingWasteLog === log.waste_log_id ? (
                  <input
                    name="user"
                    value={formData.user}
                    onChange={handleInputChange}
                  ></input>
                ) : (
                  log.user
                )}
              </td>
              <td>
                {editingWasteLog === log.waste_log_id ? (
                  <input
                    type="date"
                    name="waste_date"
                    value={formData.waste_date}
                    onChange={handleInputChange}
                  />
                ) : (
                  log.waste_date
                )}
              </td>
              <td>
                {editingWasteLog === log.waste_log_id ? (
                  <input
                    type="text"
                    name="reason"
                    value={formData.reason || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  log.reason
                )}
              </td>
              <td>
                {editingWasteLog === log.waste_log_id ? (
                  <input
                    type="number"
                    name="quantity_waste"
                    value={formData.quantity_waste}
                    onChange={handleInputChange}
                  />
                ) : (
                  log.quantity_waste
                )}
              </td>
              <td>
                {editingWasteLog === log.waste_log_id ? (
                  <input
                    type="text"
                    name="product"
                    value={formData.product}
                    onChange={handleInputChange}
                  />
                ) : (
                  log.product
                )}
              </td>
              <td>
                {isManager ? (
                  editingWasteLog === log.waste_log_id ? (
                    <>
                      <button
                        className="action-button save-button"
                        onClick={() => handleSave(log.waste_log_id)}
                      >
                        Save
                      </button>
                      <button
                        className="action-button cancel-button"
                        onClick={() => setEditingWasteLog(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="action-button edit-button"
                        onClick={() => handleEdit(log)}
                      >
                        Edit
                      </button>
                      <button
                        className="action-button delete-button"
                        onClick={() => handleDelete(log.waste_log_id)}
                      >
                        Delete
                      </button>
                    </>
                  )
                ) : (
                  <span>View Only</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
