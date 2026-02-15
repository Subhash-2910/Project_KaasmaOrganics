import React, { useContext } from "react";
import { CartContext } from "../features/ContextProvider";

function CartProduct({ product }) {
  const { cart, dispatch } = useContext(CartContext);

  const Increase = (id) => {
    const item = cart.find((p) => p.id === id);
    if (item && item.quantity < 10) {
      dispatch({ type: "Increment", id });
    }
  };

  const Decrease = (id) => {
    const item = cart.find((p) => p.id === id);
    if (item && item.quantity > 1) {
      dispatch({ type: "Decrement", id });
    }
  };

  return (
    <div className="cart-item">
      <img src={product.image} alt={product.name} />

      <div className="cart-item-info">
        <h4>{product.name}</h4>
        <p>${product.price}</p>

        <div className="quantity-controls">
          <button onClick={() => Decrease(product.id)}>-</button>

          <span>{product.quantity}</span>

          <button onClick={() => Increase(product.id)}>+</button>
        </div>

        <button
          className="remove-btn"
          onClick={() => dispatch({ type: "REMOVE", id: product.id })}
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default CartProduct;
