import React, { createContext, useContext, useState, useEffect } from 'react';
import { productAPI, orderAPI, paymentAPI } from '../services/apiService';

const CartContext = createContext();

export const CartProvider = ({ children, value }) => {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load products from backend on mount
  useEffect(() => {
    loadProducts();
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAllProducts();
      if (response.status === 'success') {
        setProducts(response.data);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    // Ensure product has required fields
    if (!product.id && !product._id) {
      console.error('Product must have an id');
      return;
    }
    
    const productId = product.id || product._id;
    const weight = product.weight || '100g';
    const quantity = product.quantity || 1;
    const price = product.price || 0;
    
    // Ensure price is a valid number
    if (isNaN(price) || price <= 0) {
      console.error('Product must have a valid price');
      return;
    }

    const existingItem = cart.find(
      (item) => (item.id === productId || item._id === productId) && item.weight === weight
    );

    if (existingItem) {
      updateQuantity(productId, weight, (existingItem.quantity || 1) + quantity);
    } else {
      const cartItem = {
        id: productId,
        _id: product._id || productId,
        name: product.name,
        price: parseFloat(price),
        image: product.image,
        category: product.category,
        weight: weight,
        quantity: quantity
      };
      setCart([...cart, cartItem]);
    }
  };

  const removeFromCart = (id, weight) => {
    setCart(cart.filter((item) => {
      const itemId = item.id || item._id;
      return !(itemId === id && item.weight === weight);
    }));
  };

  const updateQuantity = (id, weight, quantity) => {
    const qty = parseInt(quantity) || 1;
    if (qty <= 0) {
      removeFromCart(id, weight);
    } else {
      setCart(
        cart.map((item) => {
          const itemId = item.id || item._id;
          if (itemId === id && item.weight === weight) {
            return { ...item, quantity: qty };
          }
          return item;
        })
      );
    }
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const cartTotal = cart.reduce((total, item) => {
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity) || 0;
    return total + (price * quantity);
  }, 0);
  const cartCount = cart.reduce((count, item) => {
    const quantity = parseInt(item.quantity) || 0;
    return count + quantity;
  }, 0);

  // Create order in backend
  const createOrder = async (orderData) => {
    try {
      setLoading(true);
      const response = await orderAPI.createOrder(orderData);
      if (response.status === 'success') {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to create order');
      }
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Process payment
  const processPayment = async (paymentData) => {
    try {
      setLoading(true);
      const response = await paymentAPI.createPayment(paymentData);
      if (response.status === 'success') {
        // Process the payment
        const processResponse = await paymentAPI.processPayment(response.data._id);
        if (processResponse.status === 'success') {
          return processResponse.data;
        } else {
          throw new Error(processResponse.message || 'Payment processing failed');
        }
      } else {
        throw new Error(response.message || 'Failed to create payment');
      }
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Track order
  const trackOrder = async (trackingId) => {
    try {
      setLoading(true);
      const response = await orderAPI.trackOrder(trackingId);
      if (response.status === 'success') {
        return response.data;
      } else {
        throw new Error(response.message || 'Order not found');
      }
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get user orders
  const getUserOrders = async (userId) => {
    try {
      setLoading(true);
      const response = await orderAPI.getUserOrders(userId);
      if (response.status === 'success') {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch orders');
      }
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const valueToPass = {
    cart,
    products,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount,
    createOrder,
    processPayment,
    trackOrder,
    getUserOrders,
    isCartOpen: value?.isCartOpen || false,
    setIsCartOpen: value?.setIsCartOpen || (() => {})
  };

  return (
    <CartContext.Provider value={valueToPass}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
