import React from "react";
import { FiSearch, FiUser, FiShoppingCart } from "react-icons/fi";

function Navbar() {
  return (
    <div>
      <div className="banner">
        🌿 Free Shipping on Orders Above $50 | 100% Organic Certified Products
      </div>
      <nav className="navbar">
        <div>
          <img src="/logo.svg" alt="logo" />
          <span>Kaasma</span>
        </div>

        <ul className="nav-links">
          <li>Home</li>
          <li>Shop</li>
          <li>About</li>
          <li>Benefits</li>
          <li>Contact</li>
        </ul>

        <div className="nav-icons">
          <FiSearch />
          <FiUser />
          <FiShoppingCart />
        </div>
      </nav>
      ;
    </div>
  );
}

export default Navbar;
