import React, { useState } from "react";
import { FaHeart, FaRegHeart, FaPhone, FaWhatsapp } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Use Link for SPA navigation
import "../ComponentCss/Topbar.css";

const Topbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWishlistActive, setIsWishlistActive] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleWishlist = () => setIsWishlistActive(!isWishlistActive);

  const handlePhoneCall = () => {
    window.location.href = "tel:9565550142";
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      "Hello! Sir. I want assistance with Bamboo and POP (Plaster of Paris). How can you help me today?"
    );
    window.open(`https://wa.me/919565550142?text=${message}`, "_blank");
  };

  // Updated path matching for new routing structure
  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path === "/about" && location.pathname === "/about") return true;
    if (path === "/contact" && location.pathname.startsWith("/contact")) return true;
    return false;
  };

  return (
    <nav className="topbar">
      <div className="topbar-container">
        {/* Logo - routes to homepage (/) */}
        <div className="topbar-logo" onClick={() => navigate("/")}>
          <img src="/images/nlogo.png" alt="HPS Constructions Logo" />
        </div>

        {/* Navigation Links */}
        <ul className={`topbar-menu ${isMenuOpen ? "active" : ""}`}>
          <li>
            <Link to="/" className={isActive("/") ? "active" : ""} onClick={() => setIsMenuOpen(false)}>
              Home
              {isActive("/") && <span className="active-indicator"></span>}
            </Link>
          </li>
          <li>
            <Link to="/about" className={isActive("/about") ? "active" : ""} onClick={() => setIsMenuOpen(false)}>
              About
              {isActive("/about") && <span className="active-indicator"></span>}
            </Link>
          </li>
          <li>
            <Link to="/contact" className={isActive("/contact") ? "active" : ""} onClick={() => setIsMenuOpen(false)}>
              Contact
              {isActive("/contact") && <span className="active-indicator"></span>}
            </Link>
          </li>
        </ul>

        {/* Right Side Actions */}
        <div className="topbar-right">
          <div className="topbar-actions">
            <div className="topbar-wishlist" onClick={toggleWishlist}>
              {isWishlistActive ? (
                <FaHeart className="wishlist-icon active" />
              ) : (
                <FaRegHeart className="wishlist-icon" />
              )}
            </div>
          </div>
          {/* Contact Icons */}
          <div className="topbar-contact">
            <div className="contact-icon" onClick={handlePhoneCall} title="Call Us">
              <FaPhone className="phone-icon" />
            </div>
            <div className="whatsapp-container" onClick={handleWhatsAppClick} title="WhatsApp">
              <div className="contact-icon">
                <FaWhatsapp className="whatsapp-icon" />
              </div>
              <span className="phone-number">9565550142</span>
            </div>
          </div>
          {/* Mobile Menu Toggle */}
          <div className={`topbar-toggle ${isMenuOpen ? "active" : ""}`} onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Topbar;
