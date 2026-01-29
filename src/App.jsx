import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext.jsx";
import Home from "./pages/Home";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <Router>
      <CartProvider value={{ isCartOpen, setIsCartOpen }}>
        <div className="app">
          <Home />
          <Cart 
            isOpen={isCartOpen} 
            onClose={() => {
              setIsCartOpen(false);
              if (window.location.pathname !== '/') {
                window.history.back();
              }
            }} 
          />
          
          <Routes>
            <Route path="/" element={<div />} />
            <Route 
              path="/checkout" 
              element={
                <Checkout 
                  onBack={() => {
                    window.history.back();
                    setIsCartOpen(true);
                  }} 
                />
              } 
            />
          </Routes>
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
