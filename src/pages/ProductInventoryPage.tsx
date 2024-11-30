import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/ProductInventory.css";

interface Product {
  product_id: number;
  name: string;
  distributor: string;
  distributor_id: number;
  stock_quantity: number;
  price: number;
  minimum_threshold: number;
  cost_per_unit: number;
  expiration_date: string | null;
  unit_of_measurement: string | null;
  category: string | null;
  brand: string | null;
}

interface Distributor {
  distributor_id: number;
  name: string;
}

export default function ProductInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [isManager, setIsManager] = useState<boolean>(true); // Simulating role-based access

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productResponse, distributorResponse] = await Promise.all([
        axios.get("/inventory/product-inventory"),
        axios.get("/inventory/distributors"),
      ]);
      setProducts(productResponse.data);
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

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/inventory/product-inventory", formData);
      alert("Product added successfully!");
      setShowAddForm(false);
      setFormData({});
      fetchData();
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
    }
  };

  const handleSave = async (productId: number) => {
    try {
      await axios.put("/inventory/product-inventory", { product_id: productId, ...formData });
      alert("Product updated successfully!");
      setEditingProductId(null);
      fetchData();
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product. Please try again.");
    }
  };

  const handleDelete = async (productId: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete("/inventory/product-inventory", {
          data: { product_id: productId },
        });
        alert("Product deleted successfully!");
        fetchData();
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product. Please try again.");
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = (product: Product) => {
    setEditingProductId(product.product_id);
    setFormData(product);
  };

  const filteredProducts = products.filter((product) =>
    `${product.name} ${product.distributor} ${product.category}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="inventory-container">
      <h1 className="inventory-title">Product Inventory</h1>

      <input
        type="text"
        placeholder="Search products by name, distributor, or category"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {isManager && (
        <button className="add-button" onClick={() => setShowAddForm((prev) => !prev)}>
          {showAddForm ? "Cancel" : "Add Product"}
        </button>
      )}

      {showAddForm && isManager && (
        <form onSubmit={handleAddProduct} className="product-form">
          <h2>Add New Product</h2>
          <label>
            Product Name
            <input
              type="text"
              name="name"
              placeholder="Enter product name"
              value={formData.name || ""}
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
            Stock Quantity
            <input
              type="number"
              name="stock_quantity"
              placeholder="Enter stock quantity"
              value={formData.stock_quantity || ""}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Price
            <input
              type="number"
              name="price"
              placeholder="Enter price"
              value={formData.price || ""}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Minimum Threshold
            <input
              type="number"
              name="minimum_threshold"
              placeholder="Enter minimum threshold"
              value={formData.minimum_threshold || ""}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Cost per Unit
            <input
              type="number"
              name="cost_per_unit"
              placeholder="Enter cost per unit"
              value={formData.cost_per_unit || ""}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Expiration Date
            <input
              type="date"
              name="expiration_date"
              value={formData.expiration_date || ""}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Unit of Measurement
            <input
              type="text"
              name="unit_of_measurement"
              placeholder="Enter unit of measurement"
              value={formData.unit_of_measurement || ""}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Category
            <input
              type="text"
              name="category"
              placeholder="Enter category"
              value={formData.category || ""}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Brand
            <input
              type="text"
              name="brand"
              placeholder="Enter brand"
              value={formData.brand || ""}
              onChange={handleInputChange}
            />
          </label>
          <button type="submit" className="action-button save-button">
            Add Product
          </button>
        </form>
      )}

      <table className="inventory-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Distributor</th>
            <th>Stock</th>
            <th>Price</th>
            <th>Min Threshold</th>
            <th>Cost/Unit</th>
            <th>Expiration Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.product_id}>
              <td>{product.product_id}</td>
              <td>
                {editingProductId === product.product_id ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  product.name
                )}
              </td>
              <td>
                {editingProductId === product.product_id ? (
                  <select
                    name="distributor_id"
                    value={formData.distributor_id || ""}
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
                  product.distributor
                )}
              </td>
              <td>
                {editingProductId === product.product_id ? (
                  <input
                    type="number"
                    name="stock_quantity"
                    value={formData.stock_quantity || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  product.stock_quantity
                )}
              </td>
              <td>
                {editingProductId === product.product_id ? (
                  <input
                    type="number"
                    name="price"
                    value={formData.price || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  `$${product.price.toFixed(2)}`
                )}
              </td>
              <td>
                {editingProductId === product.product_id ? (
                  <input
                    type="number"
                    name="minimum_threshold"
                    value={formData.minimum_threshold || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  product.minimum_threshold
                )}
              </td>
              <td>
                {editingProductId === product.product_id ? (
                  <input
                    type="number"
                    name="cost_per_unit"
                    value={formData.cost_per_unit || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  `$${product.cost_per_unit.toFixed(2)}`
                )}
              </td>
              <td>
                {editingProductId === product.product_id ? (
                  <input
                    type="date"
                    name="expiration_date"
                    value={formData.expiration_date || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  product.expiration_date || "N/A"
                )}
              </td>
              <td>
              {isManager ? (
                editingProductId === product.product_id ? (
                  <>
                    <button className="action-button save-button" onClick={() => handleSave(product.product_id)}>
                      Save
                    </button>
                    <button className="action-button cancel-button" onClick={() => setEditingProductId(null)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button className="action-button edit-button" onClick={() => handleEdit(product)}>
                      Edit
                    </button>
                    <button className="action-button delete-button" onClick={() => handleDelete(product.product_id)}>
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
