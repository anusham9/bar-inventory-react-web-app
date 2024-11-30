import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/EquipmentManagement.css";

interface Equipment {
  equipment_id: number;
  equipment_name: string;
  model_number: string;
  manufacturer: string;
  date_acquired: string;
  distributor: string;
  distributor_id: number;
  warranty_status: string;
  warranty_expiration_date: string | null;
  last_maintenance_date: string | null;
  next_maintenance_date: string | null;
  incidents_reports: string | null;
  notes: string | null;
}

interface Distributor {
  distributor_id: number;
  name: string;
}

export default function EquipmentManagement() {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingEquipmentId, setEditingEquipmentId] = useState<number | null>(
    null
  );
  const [formData, setFormData] = useState<Partial<Equipment>>({});
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>(""); // Search term state
  const [isManager, setIsManager] = useState<boolean>(true); // Simulating role-based access

  // Fetch equipment and distributors
  const fetchData = async () => {
    setLoading(true);
    try {
      const [equipmentResponse, distributorResponse] = await Promise.all([
        axios.get("/inventory/equipment"),
        axios.get("/inventory/distributors"),
      ]);
      setEquipmentList(equipmentResponse.data);
      setDistributors(distributorResponse.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Add new equipment
  const handleAddEquipment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/inventory/equipment", formData);
      alert("Equipment added successfully!");
      setShowAddForm(false);
      setFormData({});
      fetchData();
    } catch (error) {
      console.error("Error adding equipment:", error);
      alert("Failed to add equipment. Please try again.");
    }
  };

  // Update existing equipment
  const handleSave = async (equipmentId: number) => {
    try {
      await axios.put("/inventory/equipment", { equipment_id: equipmentId, ...formData });
      alert("Equipment updated successfully!");
      setEditingEquipmentId(null);
      fetchData();
    } catch (error) {
      console.error("Error updating equipment:", error);
      alert("Failed to update equipment. Please try again.");
    }
  };

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Set equipment for editing
  const handleEdit = (equipment: Equipment) => {
    setEditingEquipmentId(equipment.equipment_id);
    setFormData(equipment);
  };

  // Delete equipment
    const handleDelete = async (equipmentId: number) => {
        if (window.confirm("Are you sure you want to delete this equipment?")) {
        try {
            await axios.delete("/inventory/equipment", {
            data: { equipment_id: equipmentId },
            });
            alert("Equipment deleted successfully!");
            fetchData(); // Refresh data
        } catch (error) {
            console.error("Error deleting equipment:", error);
            alert("Failed to delete equipment. Please try again.");
        }
        }
    };
  

  // Filtered equipment based on search term
  const filteredEquipment = equipmentList.filter((equipment) =>
    `${equipment.equipment_name} ${equipment.manufacturer} ${equipment.distributor}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="equipment-container">
      <h1 className="equipment-title">Equipment Management</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by name, manufacturer, or distributor"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {/* Add Equipment Button */}
      {isManager && (
        <button className="add-button" onClick={() => setShowAddForm((prev) => !prev)}>
          {showAddForm ? "Cancel" : "Add Equipment"}
        </button>
      )}

      {/* Add Equipment Form */}
      {showAddForm && (
  <form onSubmit={handleAddEquipment} className="equipment-form">
    <h2>Add New Equipment</h2>
    <label>
      Equipment Name
      <input
        type="text"
        name="equipment_name"
        placeholder="Enter equipment name"
        value={formData.equipment_name || ""}
        onChange={handleInputChange}
        required
      />
    </label>
    <label>
      Model Number
      <input
        type="text"
        name="model_number"
        placeholder="Enter model number"
        value={formData.model_number || ""}
        onChange={handleInputChange}
        required
      />
    </label>
    <label>
      Manufacturer
      <input
        type="text"
        name="manufacturer"
        placeholder="Enter manufacturer name"
        value={formData.manufacturer || ""}
        onChange={handleInputChange}
        required
      />
    </label>
    <label>
      Date Acquired
      <input
        type="date"
        name="date_acquired"
        value={formData.date_acquired || ""}
        onChange={handleInputChange}
        required
      />
    </label>
    <label>
      Distributor
      <select
        name="distributor_id"
        value={formData.distributor_id || ""}
        onChange={handleInputChange}
        required
      >
        <option value="">Select Distributor</option>
        {distributors.map((dist) => (
          <option key={dist.distributor_id} value={dist.distributor_id}>
            {dist.name}
          </option>
        ))}
      </select>
    </label>
    <label>
      Warranty Status
      <select
        name="warranty_status"
        value={formData.warranty_status || ""}
        onChange={handleInputChange}
        required
      >
        <option value="">Select Warranty Status</option>
        <option value="Under Warranty">Under Warranty</option>
        <option value="Out of Warranty">Out of Warranty</option>
        <option value="No Warranty">No Warranty</option>
      </select>
    </label>
    <label>
      Warranty Expiration Date
      <input
        type="date"
        name="warranty_expiration_date"
        value={formData.warranty_expiration_date || ""}
        onChange={handleInputChange}
      />
    </label>
    <label>
      Last Maintenance Date
      <input
        type="date"
        name="last_maintenance_date"
        value={formData.last_maintenance_date || ""}
        onChange={handleInputChange}
      />
    </label>
    <label>
      Next Maintenance Date
      <input
        type="date"
        name="next_maintenance_date"
        value={formData.next_maintenance_date || ""}
        onChange={handleInputChange}
      />
    </label>
    <label>
      Incident Reports
      <textarea
        name="incidents_reports"
        placeholder="Enter incident reports (if any)"
        value={formData.incidents_reports || ""}
        onChange={handleInputChange}
      />
    </label>
    <label>
      Notes
      <textarea
        name="notes"
        placeholder="Enter any additional notes"
        value={formData.notes || ""}
        onChange={handleInputChange}
      />
    </label>
    <button type="submit" className="action-button save-button">
      Add Equipment
    </button>
  </form>
)}


      {/* Equipment Table */}
      <table className="equipment-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Model</th>
            <th>Manufacturer</th>
            <th>Distributor</th>
            <th>Warranty Status</th>
            <th>Next Maintenance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEquipment.map((equipment) => (
            <tr key={equipment.equipment_id}>
              <td>{equipment.equipment_id}</td>
              <td>
                {editingEquipmentId === equipment.equipment_id ? (
                  <input
                    type="text"
                    name="equipment_name"
                    value={formData.equipment_name || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  equipment.equipment_name
                )}
              </td>
              <td>
                {editingEquipmentId === equipment.equipment_id ? (
                  <input
                    type="text"
                    name="model_number"
                    value={formData.model_number || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  equipment.model_number
                )}
              </td>
              <td>
                {editingEquipmentId === equipment.equipment_id ? (
                  <input
                    type="text"
                    name="manufacturer"
                    value={formData.manufacturer || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  equipment.manufacturer
                )}
              </td>
              <td>
                {editingEquipmentId === equipment.equipment_id ? (
                  <select
                    name="distributor_id"
                    value={formData.distributor_id || equipment.distributor_id || ""}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Distributor</option>
                    {distributors.map((dist) => (
                      <option key={dist.distributor_id} value={dist.distributor_id}>
                        {dist.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  equipment.distributor
                )}
              </td>
              <td>
                {editingEquipmentId === equipment.equipment_id ? (
                  <select
                    name="warranty_status"
                    value={formData.warranty_status || ""}
                    onChange={handleInputChange}
                  >
                    <option value="Under Warranty">Under Warranty</option>
                    <option value="Out of Warranty">Out of Warranty</option>
                    <option value="No Warranty">No Warranty</option>
                  </select>
                ) : (
                  equipment.warranty_status
                )}
              </td>
              <td>
                {editingEquipmentId === equipment.equipment_id ? (
                  <input
                    type="date"
                    name="next_maintenance_date"
                    value={formData.next_maintenance_date || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  equipment.next_maintenance_date || "N/A"
                )}
              </td>
              <td>
                {isManager ? (
                    editingEquipmentId === equipment.equipment_id ? (
                        <>
                            <button className="action-button save-button" onClick={() => handleSave(equipment.equipment_id)}>
                                Save
                            </button>
                            <button className="action-button cancel-button" onClick={() => setEditingEquipmentId(null)}>
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="action-button edit-button" onClick={() => handleEdit(equipment)}>
                                Edit
                            </button>
                            <button className="action-button delete-button" onClick={() => handleDelete(equipment.equipment_id)}>
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


