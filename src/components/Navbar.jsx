import React from "react";
import { FiSearch, FiUser, FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";
import logo from "../assets/images/kasmalogo.jpeg"
import Cart from "./Cart";
import { useState } from "react";
import { useContext } from "react";
import { CartContext } from "../features/ContextProvider";

function Navbar() {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { cart } = useContext(CartContext);
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

        <div className="nav-icons">
          <FiSearch />
          <FiUser />
          {/* CART ICON CLICKABLE */}
          <FiShoppingCart
            style={{ cursor: "pointer" }}
            onClick={() => setIsCartOpen(true)}
          />
           {cart.length}
        </div>
      </nav>
       {/* Cart Drawer */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

export default Navbar;
