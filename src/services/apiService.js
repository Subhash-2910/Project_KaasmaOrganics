const API_BASE_URL = 'http://localhost:8001/api/v1';

// Product API calls
export const productAPI = {
  // Get all products
  getAllProducts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/products?${queryString}`);
    return response.json();
  },

  // Get single product
  getProduct: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    return response.json();
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    const response = await fetch(`${API_BASE_URL}/products/category/${category}`);
    return response.json();
  },

  // Search products
  searchProducts: async (query) => {
    const response = await fetch(`${API_BASE_URL}/products/search/${query}`);
    return response.json();
  }
};

// Order API calls
export const orderAPI = {
  // Create new order
  createOrder: async (orderData) => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    return response.json();
  },

  // Get order by ID
  getOrder: async (id) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`);
    return response.json();
  },

  // Get order by Order ID
  getOrderByOrderId: async (orderId) => {
    const response = await fetch(`${API_BASE_URL}/orders/order/${orderId}`);
    return response.json();
  },

  // Track order by Tracking ID
  trackOrder: async (trackingId) => {
    const response = await fetch(`${API_BASE_URL}/orders/track/${trackingId}`);
    return response.json();
  },

  // Get user's orders
  getUserOrders: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/orders/user/${userId}`);
    return response.json();
  },

  // Update order status
  updateOrderStatus: async (id, status) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderStatus: status }),
    });
    return response.json();
  },

  // Cancel order
  cancelOrder: async (id) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/cancel`, {
      method: 'PATCH',
    });
    return response.json();
  }
};

// Payment API calls
export const paymentAPI = {
  // Create new payment
  createPayment: async (paymentData) => {
    const response = await fetch(`${API_BASE_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });
    return response.json();
  },

  // Process payment
  processPayment: async (paymentId) => {
    const response = await fetch(`${API_BASE_URL}/payments/${paymentId}/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  // Get payment by ID
  getPayment: async (id) => {
    const response = await fetch(`${API_BASE_URL}/payments/${id}`);
    return response.json();
  },

  // Get payments by order ID
  getPaymentsByOrder: async (orderId) => {
    const response = await fetch(`${API_BASE_URL}/payments/order/${orderId}`);
    return response.json();
  }
};

// User API calls
export const userAPI = {
  // Register new user
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  // Login user
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  // Get user profile
  getProfile: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/users/profile?userId=${userId}`);
    return response.json();
  },

  // Update user profile
  updateProfile: async (userId, userData) => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...userData, userId }),
    });
    return response.json();
  },

  // Add address
  addAddress: async (userId, address) => {
    const response = await fetch(`${API_BASE_URL}/users/address`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, address }),
    });
    return response.json();
  },

  // Update address
  updateAddress: async (userId, addressId, address) => {
    const response = await fetch(`${API_BASE_URL}/users/address/${addressId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, ...address }),
    });
    return response.json();
  },

  // Delete address
  deleteAddress: async (userId, addressId) => {
    const response = await fetch(`${API_BASE_URL}/users/address/${addressId}?userId=${userId}`, {
      method: 'DELETE',
    });
    return response.json();
  }
};

// Error handling wrapper
export const apiCall = async (apiFunction, ...args) => {
  try {
    const response = await apiFunction(...args);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status === 'error') {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
