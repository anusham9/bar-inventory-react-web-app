import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/DistributorManagement.css";

interface Distributor {
  distributor_id: number;
  name: string;
  address: string;
  location: string;
  payment_terms: string;
  person_of_contact: string;
  delivery_terms: string;
  phone_number: string;
}

export default function DistributorManagement(){
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingDistributorId, setEditingDistributorId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Distributor>>({});
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isManager, setIsManager] = useState<boolean>(true); // Simulating role-based access

  const fetchDistributors = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/inventory/distributors");
      setDistributors(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching distributors:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDistributors();
  }, []);

  const handleAddDistributor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/inventory/distributors", formData);
      alert("Distributor added successfully!");
      setShowAddForm(false);
      setFormData({});
      fetchDistributors();
    } catch (error) {
      console.error("Error adding distributor:", error);
      alert("Failed to add distributor. Please try again.");
    }
  };

  const handleSave = async (distributorId: number) => {
    try {
      await axios.put("/inventory/distributors", { distributor_id: distributorId, ...formData });
      alert("Distributor updated successfully!");
      setEditingDistributorId(null);
      fetchDistributors();
    } catch (error) {
      console.error("Error updating distributor:", error);
      alert("Failed to update distributor. Please try again.");
    }
  };

  const handleDelete = async (distributorId: number) => {
    if (window.confirm("Are you sure you want to delete this distributor?")) {
      try {
        await axios.delete("/inventory/distributors", {
          data: { distributor_id: distributorId },
        });
        alert("Distributor deleted successfully!");
        fetchDistributors();
      } catch (error) {
        console.error("Error deleting distributor:", error);
        alert("Failed to delete distributor. Please try again.");
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = (distributor: Distributor) => {
    setEditingDistributorId(distributor.distributor_id);
    setFormData(distributor);
  };

  const filteredDistributors = distributors.filter((distributor) =>
    `${distributor.name} ${distributor.address} ${distributor.location}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="distributor-container">
      <h1 className="distributor-title">Distributor Management</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by name, address, or location"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {/* Add Distributor Button */}
      {isManager && (
        <button className="add-button" onClick={() => setShowAddForm((prev) => !prev)}>
          {showAddForm ? "Cancel" : "Add Equipment"}
        </button>
      )}

      {/* Add Distributor Form */}
      {showAddForm && (
        <form onSubmit={handleAddDistributor} className="distributor-form">
          <h2>Add New Distributor</h2>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name || ""}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address || ""}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location || ""}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="payment_terms"
            placeholder="Payment Terms"
            value={formData.payment_terms || ""}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="person_of_contact"
            placeholder="Person of Contact"
            value={formData.person_of_contact || ""}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="delivery_terms"
            placeholder="Delivery Terms"
            value={formData.delivery_terms || ""}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="phone_number"
            placeholder="Phone Number"
            value={formData.phone_number || ""}
            onChange={handleInputChange}
            required
          />
          <button className="action-button save-button" type="submit">
            Add Distributor
          </button>
        </form>
      )}

      {/* Distributor Table */}
      <table className="distributor-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Address</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDistributors.map((distributor) => (
            <tr key={distributor.distributor_id}>
              <td>{distributor.distributor_id}</td>
              <td>
                {editingDistributorId === distributor.distributor_id ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  distributor.name
                )}
              </td>
              <td>
                {editingDistributorId === distributor.distributor_id ? (
                  <input
                    type="text"
                    name="address"
                    value={formData.address || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  distributor.address
                )}
              </td>
              <td>
                {editingDistributorId === distributor.distributor_id ? (
                  <input
                    type="text"
                    name="location"
                    value={formData.location || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  distributor.location
                )}
              </td>
              <td>
                {isManager ? (
                    editingDistributorId === distributor.distributor_id ? (
                        <>
                            <button
                                className="action-button save-button"
                                onClick={() => handleSave(distributor.distributor_id)}
                            >
                                Save
                            </button>
                            <button
                                className="action-button cancel-button"
                                onClick={() => setEditingDistributorId(null)}
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className="action-button edit-button"
                                onClick={() => handleEdit(distributor)}
                            >
                                Edit
                            </button>
                            <button
                                className="action-button delete-button"
                                onClick={() => handleDelete(distributor.distributor_id)}
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
};
