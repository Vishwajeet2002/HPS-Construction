import React, { useState } from "react";
import { FaHeart, FaRegHeart, FaPhone, FaWhatsapp } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import "../ComponentCss/Topbar.css";

const Topbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWishlistActive, setIsWishlistActive] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleWishlist = () => {
    setIsWishlistActive(!isWishlistActive);
  };

  const handlePhoneCall = () => {
    window.location.href = "tel:9565550142";
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      "Hello! Sir. I want assistance with Bamboo and POP (Plaster of Paris). How can you help me today?"
    );
    window.open(`https://wa.me/919565550142?text=${message}`, "_blank");
  };

  // Check if current path matches navigation item
  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path === "/about" && location.pathname === "/") return true; // About is on home page
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleNavigation = (e, path) => {
    e.preventDefault();
    
    if (path === "/") {
      if (location.pathname === "/") {
        // Scroll to top if already on home page
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate("/");
      }
    } else if (path === "/about") {
      // Scroll to bottom for About section
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth"
      });
    } else {
      navigate(path);
    }
    
    setIsMenuOpen(false);
  };

  return (
    <nav className="topbar">
      <div className="topbar-container">
        {/* Logo */}
        <div className="topbar-logo" onClick={(e) => handleNavigation(e, "/")}>
          <img src="/images/nlogo.png" alt="HPS Constructions Logo" />
        </div>

        {/* Navigation Links */}
        <ul className={`topbar-menu ${isMenuOpen ? "active" : ""}`}>
          <li>
            <a 
              href="/" 
              onClick={(e) => handleNavigation(e, "/")}
              className={isActive("/") ? "active" : ""}
            >
              Home
              {isActive("/") && <span className="active-indicator"></span>}
            </a>
          </li>
          <li>
            <a 
              href="/about" 
              onClick={(e) => handleNavigation(e, "/about")}
              className={isActive("/about") ? "active" : ""}
            >
              About
              {isActive("/about") && <span className="active-indicator"></span>}
            </a>
          </li>
          <li>
            <a 
              href="/products" 
              onClick={(e) => handleNavigation(e, "/products")}
              className={isActive("/products") ? "active" : ""}
            >
              Products
              {isActive("/products") && <span className="active-indicator"></span>}
            </a>
          </li>
          <li>
            <a 
              href="/contact" 
              onClick={(e) => handleNavigation(e, "/contact")}
              className={isActive("/contact") ? "active" : ""}
            >
              Contact
              {isActive("/contact") && <span className="active-indicator"></span>}
            </a>
          </li>
        </ul>

        {/* Right Side */}
        <div className="topbar-right">
          <div className="topbar-actions">
            {/* Wishlist */}
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
