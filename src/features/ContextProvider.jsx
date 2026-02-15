import React, { createContext, useReducer } from "react";
import CartReducer from "./CartReducer";

export const CartContext = createContext();

function ContextProvider({ children }) {
  const [cart, dispatch] = useReducer(CartReducer, []);
  //   console.log(cart);

  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export default ContextProvider;
