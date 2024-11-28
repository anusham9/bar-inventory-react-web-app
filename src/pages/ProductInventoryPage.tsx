import React, { useState, useEffect } from "react";
import axios from "axios";

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
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    // Fetch product data
    axios
      .get("/inventory/product-inventory")
      .then((response) => {
        setProducts(response.data);
        setFilteredProducts(response.data); // Initialize filtered products
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Filter products based on the search term
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Product Inventory</h1>
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search products by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          marginBottom: "20px",
          padding: "10px",
          fontSize: "16px",
          width: "100%",
        }}
      />
      <table>
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
            <th>Unit</th>
            <th>Category</th>
            <th>Brand</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.product_id}>
              <td>{product.product_id}</td>
              <td>{product.name}</td>
              <td>{product.distributor}</td>
              <td>{product.stock_quantity}</td>
              <td>{product.price}</td>
              <td>{product.minimum_threshold}</td>
              <td>{product.cost_per_unit}</td>
              <td>{product.expiration_date || "N/A"}</td>
              <td>{product.unit_of_measurement || "N/A"}</td>
              <td>{product.category || "N/A"}</td>
              <td>{product.brand || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredProducts.length === 0 && <div>No products match your search.</div>}
    </div>
  );
};

export default ProductInventory;
