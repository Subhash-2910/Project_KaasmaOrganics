import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children, value }) => {
  const [cart, setCart] = useState([]);
  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('kasma-cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('kasma-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1, weight = '100g') => {
    setCart(prevCart => {
      const existingItem = prevCart.find(
        item => item.id === product.id && item.weight === weight
      );

      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id && item.weight === weight
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prevCart, { ...product, quantity, weight }];
    });
  };

  const removeFromCart = (productId, weight) => {
    setCart(prevCart => 
      prevCart.filter(item => !(item.id === productId && item.weight === weight))
    );
  };

  const updateQuantity = (productId, weight, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId && item.weight === weight
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const cartTotal = cart.reduce(
    (total, item) => total + (item.price * item.quantity),
    0
  );

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartTotal: cart.reduce((total, item) => total + (item.price * item.quantity), 0),
        cartCount: cart.reduce((count, item) => count + item.quantity, 0),
        isCartOpen: value?.isCartOpen || false,
        setIsCartOpen: value?.setIsCartOpen || (() => {})
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
