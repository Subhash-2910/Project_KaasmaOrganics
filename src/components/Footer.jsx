import { FiFacebook, FiInstagram, FiTwitter } from "react-icons/fi";
import logo from "../assets1/images/kasmalogo.jpeg"

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        {/* Brand */}
        <div className="footer-brand">
          <div className="brand">
            <span className="brand-icon"><img src={logo} alt="" /></span>
            <span className="brand-text">Kasma Organics</span>
          </div>
          <p>
            Your trusted source for premium organic fruit and vegetable
            products. Pure, natural, and healthy.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li>About Us</li>
            <li>Our Story</li>
            <li>Certifications</li>
            <li>Blog</li>
          </ul>
        </div>

        {/* Customer Care */}
        <div className="footer-links">
          <h4>Customer Care</h4>
          <ul>
            <li>Contact Us</li>
            <li>Shipping Policy</li>
            <li>Returns & Refunds</li>
            <li>FAQ</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="footer-newsletter">
          <h4>Stay Connected</h4>
          <p>Get updates on new products and exclusive offers.</p>

          <div className="newsletter-input">
            <input type="email" placeholder="Your email" />
            <button>Join</button>
          </div>

          <div className="social-icons">
            <span>
              <FiFacebook />
            </span>
            <span>
              <FiInstagram />
            </span>
            <span>
              <FiTwitter />
            </span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © 2025 Kaasma Organics. All rights reserved. | Certified Organic
        Products
      </div>
    </footer>
  );
}
