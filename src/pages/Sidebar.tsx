import { NavLink } from "react-router-dom";
import "../css/Sidebar.css";

export default function Sidebar(){
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Bar Inventory</h2>
      <ul className="sidebar-menu"> 
        <li>
          <NavLink
            to="/view/product-inventory"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Product Inventory
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/view/equipment"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Equipment Management
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/view/distributors"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Distributor Management
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/view/menu-item"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Menu Item
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/view/sales-transaction"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Sales Transaction
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/view/reservations"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Reservations
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/view/waste-log"
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Waste Log
          </NavLink>
        </li>
        {/* Add more links as needed */}
      </ul>
    </div>
  );
};


