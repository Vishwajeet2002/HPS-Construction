import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import hpsLogo from '/images/logo.png'; // Ensure correct logo path
import '../Style/footer.css';
import { FaEnvelope, FaPhoneAlt, FaWhatsapp, FaInstagram, FaCode } from 'react-icons/fa';

const Footer = () => {
  const [phone, setPhone] = useState('');

  // On submit, send WhatsApp message with phone number
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phone) return;
    const message = encodeURIComponent(`Hello! I am interested. My phone number is: ${phone}`);
    window.open(`https://wa.me/919565550142?text=${message}`, '_blank');
    setPhone('');
  };

  // Scrolls to the top of the page
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scrolls to the bottom of the page (for "About Us" section)
  const handleScrollToBottom = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Column 1: Company Info */}
          <div className="footer-column company-info">
            <img src={hpsLogo} alt="HPS Construction Logo" className="footer-logo" onClick={handleScrollToTop} />
            <p className="company-description">
              Your trusted B2B partner for premium bamboo, POP, ropes, and a full range of construction materials. We build futures, sustainably.
            </p>
            <div className="social-links">
              <a href="mailto:haripalsingh2580@gmail.com" title="Email Us" className="social-icon"><FaEnvelope /></a>
              <a href="tel:+919565550142" title="Call Us" className="social-icon"><FaPhoneAlt /></a>
              <a href="https://wa.me/919565550142" title="WhatsApp" target="_blank" rel="noopener noreferrer" className="social-icon"><FaWhatsapp /></a>
              <a href="https://instagram.com/hpsconstructions" title="Instagram" target="_blank" rel="noopener noreferrer" className="social-icon"><FaInstagram /></a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-column quick-links">
            <h3 className="column-title">Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><a href="#about" onClick={handleScrollToBottom}>About Us</a></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="footer-column support">
            <h3 className="column-title">Support</h3>
            <ul className="footer-links">
              <li><Link to="/contact">Request a Quote</Link></li>
              <li><a href="#faq">FAQs</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Column 4: B2B WhatsApp Phone Input */}
          <div className="footer-column newsletter-section">
            <h3 className="column-title">Join Our B2B Network</h3>
            <p>Get exclusive access to industry insights, new product launches, and special offers.</p>
            <form onSubmit={handleSubmit} className="newsletter-form">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Your phone number"
                required
                pattern="[+]?[\d\s\-()]{7,15}"
              />
              <button type="submit" aria-label="Subscribe">→</button>
            </form>
          </div>
        </div>

        {/* Footer Bottom with Agency Credit */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="copyright-section">
              <p>© {new Date().getFullYear()} HPS Construction. All Rights Reserved.</p>
            </div>
            
            <div className="agency-credit-section">
              <div className="agency-credit">
                <FaCode className="code-icon" />
                <span>Website designed & developed by </span>
                <a 
                  href="https://youragencywebsite.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="agency-link"
                >
                  Your Agency Name ✨
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
