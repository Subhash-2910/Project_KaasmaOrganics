import React, { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { FiArrowLeft, FiCheckCircle, FiLoader } from 'react-icons/fi';

const Checkout = ({ onBack }) => {
  const { cart, cartTotal, clearCart, createOrder, processPayment, loading, error } = useCart();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cod',
    upiId: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^\d{10}$/.test(phone);
  const validatePincode = (pincode) => /^\d{6}$/.test(pincode);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode) {
      newErrors.pincode = 'Pincode is required';
    } else if (!validatePincode(formData.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }
    if (formData.paymentMethod === 'upi' && !formData.upiId) {
      newErrors.upiId = 'UPI ID is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (step === 1) {
      setStep(2);
    } else {
      setIsSubmitting(true);
      try {
        // Validate cart has items
        if (!cart || cart.length === 0) {
          setErrors(prev => ({ 
            ...prev, 
            payment: 'Your cart is empty. Please add items to cart before placing an order.' 
          }));
          setIsSubmitting(false);
          return;
        }

        // Validate and prepare cart items
        const validItems = cart
          .filter(item => {
            // Filter out invalid items
            const hasId = item.id || item._id;
            const hasName = item.name;
            const hasWeight = item.weight;
            const hasQuantity = item.quantity && parseInt(item.quantity) > 0;
            const hasPrice = item.price && !isNaN(parseFloat(item.price)) && parseFloat(item.price) > 0;
            
            if (!hasId || !hasName || !hasWeight || !hasQuantity || !hasPrice) {
              console.warn('Invalid cart item filtered out:', item);
              return false;
            }
            return true;
          })
          .map(item => ({
            productId: item.id || item._id,
            name: item.name,
            weight: item.weight,
            quantity: parseInt(item.quantity) || 1,
            price: parseFloat(item.price) || 0
          }));

        if (validItems.length === 0) {
          setErrors(prev => ({ 
            ...prev, 
            payment: 'No valid items in cart. Please add items to cart before placing an order.' 
          }));
          setIsSubmitting(false);
          return;
        }

        // Create order in backend
        const orderData = {
          userId: 'guest', // You can update this with actual user ID when authentication is implemented
          items: validItems,
          shippingAddress: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode
          },
          paymentMethod: formData.paymentMethod,
          upiId: formData.paymentMethod === 'upi' ? formData.upiId : undefined
        };

        const order = await createOrder(orderData);
        setCreatedOrder(order);

        // Process payment
        await processPayment({
          orderId: order._id,
          paymentMethod: formData.paymentMethod,
          upiId: formData.paymentMethod === 'upi' ? formData.upiId : undefined
        });

        setOrderPlaced(true);
        clearCart();
      } catch (error) {
        console.error('Order/Payment failed:', error);
        setErrors(prev => ({ 
          ...prev, 
          payment: error.message || 'Order processing failed. Please try again.' 
        }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (orderPlaced) {
    return (
      <div className="order-confirmation">
        <FiCheckCircle size={64} className="success-icon" />
        <h2>Order Placed Successfully!</h2>
        <p>Your order ID is: <strong>{createdOrder?.orderId}</strong></p>
        <p>Tracking ID: <strong>{createdOrder?.trackingId}</strong></p>
        <p>We've sent a confirmation to {formData.email}</p>
        <div className="order-details">
          <h3>Order Summary</h3>
          {cart.map(item => (
            <div key={`${item.id}-${item.weight}`} className="order-item">
              <span>{item.name} ({item.quantity}x {item.weight})</span>
              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="order-total">
            <span>Total Amount:</span>
            <span>₹{cartTotal.toFixed(2)}</span>
          </div>
        </div>
        <button 
          className="back-to-shop"
          onClick={onBack}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <button className="back-button" onClick={onBack}>
        <FiArrowLeft /> Back to Cart
      </button>
      
      {error && (
        <div className="error-message global-error">
          {error}
        </div>
      )}
      
      <h2>{step === 1 ? 'Shipping Information' : 'Payment Method'}</h2>
      
      <form onSubmit={handleSubmit} className="checkout-form">
        {step === 1 ? (
          <>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
                required
                disabled={loading || isSubmitting}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                required
                disabled={loading || isSubmitting}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={errors.phone ? 'error' : ''}
                required
                disabled={loading || isSubmitting}
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>
            <div className="form-group">
              <label>Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={errors.address ? 'error' : ''}
                required
                disabled={loading || isSubmitting}
              />
              {errors.address && <span className="error-message">{errors.address}</span>}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={errors.city ? 'error' : ''}
                  required
                  disabled={loading || isSubmitting}
                />
                {errors.city && <span className="error-message">{errors.city}</span>}
              </div>
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={errors.state ? 'error' : ''}
                  required
                  disabled={loading || isSubmitting}
                />
                {errors.state && <span className="error-message">{errors.state}</span>}
              </div>
              <div className="form-group">
                <label>Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className={errors.pincode ? 'error' : ''}
                  required
                  disabled={loading || isSubmitting}
                />
                {errors.pincode && <span className="error-message">{errors.pincode}</span>}
              </div>
            </div>
          </>
        ) : (
          <div className="payment-methods">
            <h3>Select Payment Method</h3>
            <div className="payment-option">
              <input
                type="radio"
                id="cod"
                name="paymentMethod"
                value="cod"
                checked={formData.paymentMethod === 'cod'}
                onChange={handleChange}
                disabled={loading || isSubmitting}
              />
              <label htmlFor="cod">Cash on Delivery</label>
            </div>
            <div className="payment-option">
              <input
                type="radio"
                id="upi"
                name="paymentMethod"
                value="upi"
                checked={formData.paymentMethod === 'upi'}
                onChange={handleChange}
                disabled={loading || isSubmitting}
              />
              <label htmlFor="upi">UPI Payment</label>
            </div>
            {formData.paymentMethod === 'upi' && (
              <div className="upi-details">
                <div className="form-group">
                  <label>UPI ID</label>
                  <input
                    type="text"
                    name="upiId"
                    value={formData.upiId}
                    onChange={handleChange}
                    placeholder="yourname@upi"
                    required
                    disabled={loading || isSubmitting}
                  />
                  {errors.upiId && <span className="error-message">{errors.upiId}</span>}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="order-items">
            {cart.map(item => (
              <div key={`${item.id}-${item.weight}`} className="order-item">
                <span>{item.name} ({item.quantity}x {item.weight})</span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="order-total">
            <span>Total:</span>
            <span>₹{cartTotal.toFixed(2)}</span>
          </div>
        </div>

        {errors.payment && (
          <div className="error-message">{errors.payment}</div>
        )}

        <button type="submit" className="place-order-btn" disabled={isSubmitting || loading}>
          {isSubmitting ? (
            <>
              <FiLoader className="animate-spin" />
              {step === 1 ? 'Processing...' : 'Placing Order...'}
            </>
          ) : (
            step === 1 ? 'Continue to Payment' : 'Place Order'
          )}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
