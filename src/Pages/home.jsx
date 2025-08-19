import React, { useState, useCallback } from "react";
import HPSProductCard from "../Components/productCard";
import QueryForm from "../Components/queryForm";
import { createPortal } from 'react-dom';
import "../Style/Home.css";
import Footer from "./footer";
import Poster from "../Components/poster";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalUserData, setModalUserData] = useState(null);

  // FIXED: Helper functions for safe formatting
  const safeFormatPrice = (price) => {
    if (price === null || price === undefined) return '0';
    if (typeof price !== 'number') return String(price);
    return price.toLocaleString();
  };

  const safeFormatDate = (dateValue) => {
    if (!dateValue) return 'Not available';
    try {
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return 'Invalid date';
      return date.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'medium',
        timeStyle: 'short'
      });
    } catch (error) {
      return 'Date error';
    }
  };

  const allProducts = [
    {
      id: 1,
      title: "Bamboo Solutions",
      description: "Sustainable bamboo construction materials for eco-friendly and durable buildings that stand the test of time.",
      price: 599,
      unit: "piece",
      rating: 4.8,
      category: "bamboo",
      imageUrl: "/images/luffy.jpg",
    },
    {
      id: 2,
      title: "POP Services", 
      description: "Professional Plaster of Paris solutions for modern interiors with artistic designs and precision finishing.",
      price: 399,
      unit: "sq ft",
      rating: 4.6,
      category: "pop",
      imageUrl: "/images/413842.jpg",
    },
    {
      id: 3,
      title: "Bamboo Solutions",
      description: "Sustainable bamboo construction materials for eco-friendly and durable buildings that stand the test of time.",
      price: 599,
      unit: "piece",
      rating: 4.8,
      category: "bamboo",
      imageUrl: "/images/luffy.jpg",
    },
    {
      id: 4,
      title: "POP Services",
      description: "Professional Plaster of Paris solutions for modern interiors with artistic designs and precision finishing.",
      price: 399,
      unit: "sq ft",
      rating: 4.6,
      category: "pop",
      imageUrl: "/images/413842.jpg",
    },
    {
      id: 5,
      title: "Expert Consultation",
      description: "Get professional advice and customized solutions for your construction projects from our experienced team.",
      price: 2999,
      unit: "session",
      rating: 5.0,
      category: "consultation",
      imageUrl: "/images/12345.avif",
    },
    {
      id: 6,
      title: "Interior Design",
      description: "Complete interior design solutions with modern aesthetics and functional layouts for residential and commercial spaces.",
      price: 1599,
      unit: "room",
      rating: 4.7,
      category: "design",
      imageUrl: "/images/123.jpg",
    },
    {
      id: 7,
      title: "Bamboo Flooring",
      description: "Premium quality bamboo flooring solutions with various textures and finishes for elegant interiors.",
      price: 899,
      unit: "sq ft",
      rating: 4.5,
      category: "bamboo",
      imageUrl: "/images/luffy.jpg",
    },
    {
      id: 8,
      title: "POP Ceiling Design",
      description: "Creative POP ceiling designs with modern lighting solutions and architectural details for stunning interiors.",
      price: 1299,
      unit: "room",
      rating: 4.8,
      category: "pop",
      imageUrl: "/images/413842.jpg",
    },
    {
      id: 9,
      title: "Bamboo Wall Panels",
      description: "Natural bamboo wall panels for eco-friendly interior decoration with artistic finishes.",
      price: 299,
      unit: "sq ft",
      rating: 4.4,
      category: "bamboo",
      imageUrl: "/images/12345.avif",
    },
    {
      id: 10,
      title: "POP Installation",
      description: "Expert POP installation services for walls, ceilings with precision and quality assurance.",
      price: 699,
      unit: "sq ft",
      rating: 4.6,
      category: "pop",
      imageUrl: "/images/123.jpg",
    },
    {
      id: 11,
      title: "Bamboo Furniture",
      description: "Sustainable bamboo furniture including chairs, tables and storage solutions for modern homes.",
      price: 799,
      unit: "unit",
      rating: 4.9,
      category: "bamboo",
      imageUrl: "/images/luffy.jpg",
    },
    {
      id: 12,
      title: "POP Decorative Items",
      description: "Custom POP decorative items and artistic elements for unique interior designs.",
      price: 4999,
      unit: "project",
      rating: 4.8,
      category: "pop",
      imageUrl: "/images/413842.jpg",
    },
    {
      id: 13,
      title: "Bamboo Kitchen Solutions",
      description: "Modern bamboo kitchen solutions with optimal space utilization and eco-friendly materials.",
      price: 2499,
      unit: "kitchen",
      rating: 4.7,
      category: "bamboo",
      imageUrl: "/images/12345.avif",
    },
    {
      id: 14,
      title: "POP Renovation",
      description: "Complete POP renovation services with modern designs and professional finishing.",
      price: 1899,
      unit: "room",
      rating: 4.5,
      category: "pop",
      imageUrl: "/images/123.jpg",
    },
  ];

  const filteredProducts = allProducts.filter((product) => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = 
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { id: "all", name: "All Products", icon: "🏗️" },
    { id: "bamboo", name: "Bamboo", icon: "🎋" },
    { id: "pop", name: "POP", icon: "🏛️" },
  ];

  // REMOVED: Alert has been removed, ProductCard now handles its own popups
  const handleProductLearnMore = useCallback(() => {
    // ProductCard now handles its own success/error states with popups
    // No need for additional handling here
  }, []);

  const closeModal = () => {
    console.log("❌ User closed modal");
    setModalOpen(false);
  };

  const openWhatsApp = () => {
    if (!modalUserData) return;
    const { userData, productInfo } = modalUserData;
    const message = encodeURIComponent(
      `🏗️ *Interest in ${productInfo.title}*\n\nHi HPS Constructions!\n\nName: ${userData.name}\nPhone: ${userData.phone}\n\nI'm interested in ${productInfo.title} (₹${safeFormatPrice(productInfo.price)}/${productInfo.unit}).\n\n${productInfo.description}\n\nOriginal Query: ${userData.query || 'No specific query'}\n\nPlease provide more details about:\n• Availability\n• Installation process\n• Bulk pricing\n• Quality specifications\n\nThank you!`
    );
    window.open(`https://wa.me/919565550142?text=${message}`, "_blank");
    setModalOpen(false);
  };

  const makeCall = () => {
    window.location.href = "tel:9565550142";
    setModalOpen(false);
  };

  // FIXED: Bulletproof Modal with safe formatting
  const renderModal = () => {
    if (!modalOpen || !modalUserData) return null;

    const { userData, productInfo } = modalUserData;

    return createPortal(
      <div className="modal-overlay-portal">
        <div 
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          <div 
            className="modal-content-portal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-success">
              <div className="success-icon">✅</div>
              <h3 className="success-title">
                Interest Registered Successfully!
              </h3>
              <button 
                onClick={closeModal}
                className="modal-close-btn"
              >×</button>
            </div>
            
            <div className="modal-body">
              <div className="user-details-section">
                <p className="section-title">
                  <strong>Your Details:</strong>
                </p>
                <div className="details-grid">
                  <span className="detail-item">👤 {userData?.name || 'Not provided'}</span>
                  <span className="detail-item">📞 {userData?.phone || 'Not provided'}</span>
                </div>
              </div>
              
              <div className="product-details-section">
                <p className="product-title">
                  <strong>Product:</strong> {productInfo?.title || 'Unknown Product'} 
                  (₹{safeFormatPrice(productInfo?.price)}/{productInfo?.unit || 'unit'})
                </p>
              </div>
              
              <p className="contact-prompt">
                How would you like us to contact you?
              </p>
              
              <div className="contact-buttons">
                <button 
                  onClick={openWhatsApp}
                  className="whatsapp-btn"
                >
                  <span className="btn-icon">💬</span>
                  <div className="btn-content">
                    <div className="btn-title">WhatsApp</div>
                    <div className="btn-subtitle">Chat instantly</div>
                  </div>
                </button>
                
                <button 
                  onClick={makeCall}
                  className="call-btn"
                >
                  <span className="btn-icon">📞</span>
                  <div className="btn-content">
                    <div className="btn-title">Call Now</div>
                    <div className="btn-subtitle">Direct call</div>
                  </div>
                </button>
              </div>
              
              <p className="footer-note">
                💡 We have your details and will contact you soon!
              </p>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <>
      <div className="home-page">
        <div className="main-heading-container">
          <div className="filter-section">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>

            <div className="category-filters">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`category-btn ${selectedCategory === category.id ? "active" : ""}`}
                >
                  <span className="category-icon">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="results-info">
            <span className="results-count">
              {filteredProducts.length} Products Found
            </span>
          </div>
        </div>

        <main className="products-main">
          <div className="products-container">
            <div className="products-grid">
              {filteredProducts.map((product, index) => (
                <div key={`${product.id}-${index}`} className="product-item">
                  <HPSProductCard
                    title={product.title}
                    description={product.description}
                    price={product.price}
                    unit={product.unit}
                    rating={product.rating}
                    imageUrl={product.imageUrl}
                    onCall={() => console.log(`Called for: ${product.title}`)}
                    onLearnMore={handleProductLearnMore}
                  />
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="no-products">
                <div className="no-products-icon">📦</div>
                <h3>No Products Found</h3>
                <p>Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </main>

        <section className="cta-section">
          <div className="cta-container">
            <h2>Need Custom Solutions?</h2>
            <p>Our experts are ready to help you with personalized construction solutions</p>
            <button
              className="cta-button"
              onClick={() => (window.location.href = "/contact")}
            >
              Get Free Consultation
            </button>
          </div>
      </section>

        <Poster />
        <Footer />
        <QueryForm />
      </div>

      {renderModal()}
    </>
  );
};

export default Home;
