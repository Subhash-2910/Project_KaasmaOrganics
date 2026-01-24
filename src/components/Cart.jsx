import { FiX, FiPlus, FiMinus, FiTrash2, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext.jsx';
import { Link } from 'react-router-dom';
import '../styles/cart.css';

const Cart = ({ isOpen, onClose }) => {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    cartTotal, 
    cartCount
  } = useCart();

  if (!isOpen) return null;

  return (
    <div className="cart-overlay active" onClick={onClose}>
      <div className="cart-container" onClick={e => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Your Cart ({cartCount})</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <FiShoppingCart size={48} className="empty-cart-icon" />
            <p>Your cart is empty</p>
            <button 
              className="continue-shopping"
              onClick={onClose}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div key={`${item.id}-${item.weight}`} className="cart-item">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="cart-item-image" 
                  />
                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    <p className="weight">{item.weight}</p>
                    <p className="price">₹{(item.price * item.quantity).toFixed(2)}</p>
                    <div className="quantity-selector">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQuantity(item.id, item.weight, item.quantity - 1);
                        }}
                        disabled={item.quantity <= 1}
                      >
                        <FiMinus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          updateQuantity(item.id, item.weight, item.quantity + 1);
                        }}
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>
                  </div>
                  <button 
                    className="remove-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromCart(item.id, item.weight);
                    }}
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <div className="subtotal">
                <span>Subtotal</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <Link 
                to="/checkout" 
                className="checkout-btn"
                onClick={onClose}
              >
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
