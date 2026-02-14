import React from "react";

function Cart({ isOpen, onClose }) {
  return (
    <>
      {isOpen && <div className="cart-overlay" onClick={onClose}></div>}

      <div className={`cart-drawer ${isOpen ? "open" : ""}`}>
        <div className="cart-header">
          <h2>Shopping Cart</h2>
          <button className="cart-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="cart-body">
          <p>Your cart is empty</p>
          <span>Add some organic products to get started!</span>
        </div>
      </div>
    </>
  );
}

export default Cart;
