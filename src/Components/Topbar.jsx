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

  // Updated path matching for new routing structure
  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path === "/about" && location.pathname === "/about") return true;
    if (path === "/contact" && location.pathname.startsWith("/contact")) return true;
    return false;
  };

  const handleNavigation = (e, path) => {
    e.preventDefault();
    if (path === "/") {
      if (location.pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate("/");
      }
    } else if (path === "/about") {
      navigate("/about");
    } else if (path === "/contact") {
      navigate("/contact");
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="topbar">
      <div className="topbar-container">
        {/* Logo - now routes to homepage (/) */}
        <div className="topbar-logo" onClick={(e) => handleNavigation(e, "/")}>
          <img src="/images/nlogo.png" alt="HPS Constructions Logo" />
        </div>

        {/* Navigation Links */}
        <ul className={`topbar-menu ${isMenuOpen ? "active" : ""}`}>
          {/* Home - routes to / (ProductsPage content) */}
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
          {/* About - routes to /about (old Home content) */}
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
          {/* Contact */}
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
