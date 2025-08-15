import React, { useState } from "react";
import { FaHeart, FaRegHeart, FaPhone, FaWhatsapp } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import "../ComponentCss/Topbar.css";

const Topbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isWishlistActive, setIsWishlistActive] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  const toggleWishlist = () => {
    setIsWishlistActive(!isWishlistActive);
    console.log("Wishlist toggled:", !isWishlistActive);
  };

  const handlePhoneCall = () => {
    window.location.href = "tel:9565550142";
    console.log("Phone call initiated");
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      "Hello! We are HPS Constructions. We are here to assist you in making your business grow with the help of Bamboo and POP (Plaster of Paris). How can we help you today?"
    );
    window.open(`https://wa.me/919565550142?text=${message}`, "_blank");
    console.log("WhatsApp chat opened");
  };

  // ✨ UPDATED: Navigation handler function with smart Home and About logic
  const handleNavigation = (e, path) => {
    e.preventDefault(); // Prevent default link behavior
    
    // ✨ SPECIAL CASE: Home button - scroll to top if on home page, navigate if on other page
    if (path === "/") {
      if (location.pathname === "/") {
        // Already on home page - scroll to top
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
        console.log("Scrolled to top of home page");
      } else {
        // On different page - navigate to home
        navigate("/");
        console.log("Navigated to home page");
      }
    }
    // ✨ SPECIAL CASE: About button scrolls to bottom
    else if (path === "/about") {
      // Smooth scroll to bottom of the page
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth"
      });
      console.log("Scrolled to About section");
    } 
    // ✅ CONTACT: Navigate to contact page
    else if (path === "/contact") {
      navigate("/contact");
      console.log("Navigated to Contact page");
    }
    // ✅ PRODUCTS: Navigate to products page  
    else if (path === "/products") {
      navigate("/products");
      console.log("Navigated to Products page");
    }
    else {
      // For all other navigation, use React Router
      navigate(path);
      console.log(`Navigated to ${path}`);
    }
    
    setIsMenuOpen(false); // Close mobile menu after navigation
  };

  return (
    <nav className="topbar">
      <div className="topbar-container">
        {/* Logo/Brand */}
        <div className="topbar-logo" onClick={(e) => handleNavigation(e, "/")}>
          <h2>HPS Constructions</h2>
        </div>

        {/* Navigation Links */}
        <ul className={`topbar-menu ${isMenuOpen ? "active" : ""}`}>
          <li>
            {/* ✨ Home button now scrolls to top if on home page */}
            <a href="/" onClick={(e) => handleNavigation(e, "/")}>
              Home
            </a>
          </li>
          <li>
            {/* ✨ About button scrolls to bottom */}
            <a href="/about" onClick={(e) => handleNavigation(e, "/about")}>
              About
            </a>
          </li>
          <li>
            {/* ✅ Products button navigates to products page */}
            <a href="/products" onClick={(e) => handleNavigation(e, "/products")}>
              Products
            </a>
          </li>
          <li>
            {/* ✅ Contact button navigates to contact page */}
            <a href="/contact" onClick={(e) => handleNavigation(e, "/contact")}>
              Contact
            </a>
          </li>
        </ul>

        {/* Right Side Container */}
        <div className="topbar-right">
          <div className="topbar-actions">
            {/* Search Bar - Commented out */}
            {/* <div className="topbar-search">
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="search-button">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </form>
            </div> */}

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
            <div
              className="contact-icon"
              onClick={handlePhoneCall}
              title="Call Us"
            >
              <FaPhone className="phone-icon" />
            </div>

            <div
              className="whatsapp-container"
              onClick={handleWhatsAppClick}
              title="WhatsApp"
            >
              <div className="contact-icon">
                <FaWhatsapp className="whatsapp-icon" />
              </div>
              <span className="phone-number">9565550142</span>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="topbar-toggle" onClick={toggleMenu}>
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
