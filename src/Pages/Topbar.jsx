import React, { useState } from "react";
import { FaHeart, FaRegHeart, FaPhone, FaWhatsapp } from "react-icons/fa";
import '../style/Topbar.css'; // ✓ Correct path

const Topbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isWishlistActive, setIsWishlistActive] = useState(false);

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
    window.location.href = "tel:9555633827";
    console.log("Phone call initiated");
  };

  const handleWhatsAppClick = () => {
  // Pre-filled message for HPS Constructions
  const message = encodeURIComponent(
    "Hello! We are HPS Constructions. We are here to assist you in making your business grow with the help of Bamboo and POP (Plaster of Paris). How can we help you today?"
  );
  
  window.open(`https://wa.me/919555633827?text=${message}`, "_blank");
  console.log("WhatsApp chat opened");
};

  return (
    <nav className="topbar">
      <div className="topbar-container">
        {/* Logo/Brand */}
        <div className="topbar-logo">
          <h2>MyApp</h2>
        </div>

        {/* Navigation Links - Perfectly Centered */}
        <ul className={`topbar-menu ${isMenuOpen ? "active" : ""}`}>
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <a href="#services">Services</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>

        {/* Right Side Container */}
        <div className="topbar-right">
          {/* Search Bar and Wishlist */}
          <div className="topbar-actions">
            {/* Search Bar */}
            <div className="topbar-search">
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
            </div>

            {/* Wishlist Heart */}
            <div className="topbar-wishlist" onClick={toggleWishlist}>
              {isWishlistActive ? (
                <FaHeart className="wishlist-icon active" />
              ) : (
                <FaRegHeart className="wishlist-icon" />
              )}
            </div>
          </div>

          {/* Contact Icons with Phone Number */}
          <div className="topbar-contact">
            {/* Phone Icon */}
            <div
              className="contact-icon"
              onClick={handlePhoneCall}
              title="Call Us"
            >
              <FaPhone className="phone-icon" />
            </div>

            {/* WhatsApp Icon with Phone Number */}
            <div
              className="whatsapp-container"
              onClick={handleWhatsAppClick}
              title="WhatsApp"
            >
              <div className="contact-icon">
                <FaWhatsapp className="whatsapp-icon" />
              </div>
              <span className="phone-number">9555633827</span>
            </div>
          </div>

          {/* Mobile Menu Button */}
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
