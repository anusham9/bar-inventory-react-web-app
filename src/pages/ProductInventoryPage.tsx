import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/ProductInventory.css";

interface Product {
  product_id: number;
  name: string;
  distributor: string;
  stock_quantity: number;
  price: number;
  minimum_threshold: number;
  cost_per_unit: number;
  expiration_date: string | null;
  unit_of_measurement: string | null;
  category: string | null;
  brand: string | null;
}

const ProductInventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  // Simulate role-based access (true for manager, false for user)
  const [isManager, setIsManager] = useState<boolean>(true); // Set to `false` for view-only users

  // Fetch product data
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/inventory/product-inventory");
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add a new product
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/inventory/product-inventory", formData);
      alert("Product added successfully!");
      setShowAddForm(false);
      setFormData({});
      fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
    }
  };

  // Update product
  const handleSave = async (productId: number) => {
    try {
      await axios.put("/inventory/product-inventory", {
        product_id: productId,
        ...formData,
      });
      alert("Product updated successfully!");
      setEditingProductId(null);
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product. Please try again.");
    }
  };

  // Delete product
  const handleDelete = async (productId: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete("/inventory/product-inventory", {
          data: { product_id: productId },
        });
        alert("Product deleted successfully!");
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product. Please try again.");
      }
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Set product for editing
  const handleEdit = (product: Product) => {
    setEditingProductId(product.product_id);
    setFormData(product);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="inventory-container">
      <h1 className="inventory-title">Product Inventory</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search products by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {/* Add Product Button (Manager Only) */}
      {isManager && (
        <button
          className="add-button"
          onClick={() => setShowAddForm((prev) => !prev)}
        >
          {showAddForm ? "Cancel" : "Add Product"}
        </button>
      )}

      {/* Add Product Form */}
      {isManager && showAddForm && (
        <form onSubmit={handleAddProduct} className="product-form">
          <h2>Add New Product</h2>
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
            name="distributor"
            placeholder="Distributor"
            value={formData.distributor || ""}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="stock_quantity"
            placeholder="Stock Quantity"
            value={formData.stock_quantity || ""}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price || ""}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="minimum_threshold"
            placeholder="Minimum Threshold"
            value={formData.minimum_threshold || ""}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="cost_per_unit"
            placeholder="Cost per Unit"
            value={formData.cost_per_unit || ""}
            onChange={handleInputChange}
            required
          />
          <input
            type="date"
            name="expiration_date"
            placeholder="Expiration Date"
            value={formData.expiration_date || ""}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="unit_of_measurement"
            placeholder="Unit of Measurement"
            value={formData.unit_of_measurement || ""}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category || ""}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="brand"
            placeholder="Brand"
            value={formData.brand || ""}
            onChange={handleInputChange}
          />
          <button type="submit">Add Product</button>
        </form>
      )}

      {/* Product Table */}
      <div className="table-container">
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
            {products
              .filter((product) =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((product) => (
                <tr key={product.product_id}>
                  {editingProductId === product.product_id ? (
                    <>
                      <td>{product.product_id}</td>
                      <td>
                        <input
                          type="text"
                          name="name"
                          value={formData.name || ""}
                          onChange={handleInputChange}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="distributor"
                          value={formData.distributor || ""}
                          onChange={handleInputChange}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="stock_quantity"
                          value={formData.stock_quantity || ""}
                          onChange={handleInputChange}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="price"
                          value={formData.price || ""}
                          onChange={handleInputChange}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="minimum_threshold"
                          value={formData.minimum_threshold || ""}
                          onChange={handleInputChange}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="cost_per_unit"
                          value={formData.cost_per_unit || ""}
                          onChange={handleInputChange}
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          name="expiration_date"
                          value={formData.expiration_date || ""}
                          onChange={handleInputChange}
                        />
                      </td>
                      <td>
                        <button onClick={() => handleSave(product.product_id)}>
                          Save
                        </button>
                        <button onClick={() => setEditingProductId(null)}>
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{product.product_id}</td>
                      <td>{product.name}</td>
                      <td>{product.distributor}</td>
                      <td>{product.stock_quantity}</td>
                      <td>${product.price.toFixed(2)}</td>
                      <td>{product.minimum_threshold}</td>
                      <td>${product.cost_per_unit.toFixed(2)}</td>
                      <td>{product.expiration_date || "N/A"}</td>
                      <td>
                        {isManager && (
                          <>
                            <button onClick={() => handleEdit(product)}>
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(product.product_id)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductInventory;
