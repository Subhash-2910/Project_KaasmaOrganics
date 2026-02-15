import React, { useContext } from "react";
import { CartContext } from "../features/ContextProvider";
import CartProduct from "./CartProduct";

function Cart({ isOpen, onClose }) {
  const { cart } = useContext(CartContext);

  // Calculate subtotal
  const subtotal = cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  // Calculate number of items
  const totalItems = cart.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

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
        {cart.length == 0 ? (
          <div className="cart-body">
            <p>Your cart is empty</p>
            <span>Add some organic products to get started!</span>
          </div>
        ) : (
          cart.map((item) => <CartProduct key={item.id} product={item} />)
        )}
        <div>
          <h4>Subtotal: ${subtotal.toFixed(2)}</h4>
          <h4>No. of items: {totalItems}</h4>
          <button>
            <h5>Checkout</h5>
          </button>
        </div>
      </div>
    </>
  );
}

export default Cart;
