import React from "react";
import { FiSearch, FiUser, FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";
import logo from "../assets1/images/kasmalogo.jpeg"

function Navbar() {
  return (
    <div>
      <div className="banner">
        🌿 Free Shipping on Orders Above $50 | 100% Organic Certified Products
      </div>
      <nav className="navbar">
        <div className="logo">
          <img src={logo} alt="logo" />
          <span>Kasma Organics</span>
        </div>

        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/shop">Shop</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/benefits">Benefits</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>

        <div className="nav-icons">
          <FiSearch />
          <FiUser />
          <FiShoppingCart />
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
