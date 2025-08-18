import React from "react";
import { useNavigate } from "react-router-dom";
import "../ComponentCss/poster.css";

// Business images
import luffyImg from "/images/luffy.jpg";
import img413842 from "/images/413842.jpg";
import logoImg from "/images/logo.png";

const Poster = () => {
  const navigate = useNavigate();

  const products = [
    { src: luffyImg, name: "Bamboo Dining Table", type: "bamboo" },
    { src: img413842, name: "Pop Art Chair", type: "pop" },
  ];

  // Product type icons
  const getBambooIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v20" />
      <path d="M8 5v14" />
      <path d="M16 5v14" />
      <circle cx="12" cy="5" r="1" fill="currentColor" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <circle cx="12" cy="19" r="1" fill="currentColor" />
    </svg>
  );

  const getPopIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2L2 7v10c0 5.55 3.84 10 9 9s9-4.45 9-9V7l-8-5z" />
      <path d="M8 11v6" />
      <path d="M12 11v6" />
      <path d="M16 11v6" />
    </svg>
  );

  return (
    <section className="badge-section">
      <div className="badge-container">
        <div className="badge-content-wrapper">
          <div className="badge-left-content">
            <div className="badge-logo-container">
              <img
                src={logoImg}
                alt="Company Logo"
                className="badge-logo"
                onError={(e) => {
                  console.error('Logo failed to load:', e.target.src);
                  e.target.style.display = 'none';
                }}
              />
            </div>

            <div className="badge-description">
              <h2>Premium Quality Services with Excellence</h2>
              <p>
                We deliver outstanding construction solutions with commitment to
                quality, innovation, and customer satisfaction. Our team of
                experts ensures every project meets the highest standards.
              </p>
            </div>

            <div className="badge-icons-container">
              <div className="badge-icon-item">
                <div className="badge-icon badge-icon-quality">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M9 12l2 2 4-4" />
                    <circle cx="12" cy="12" r="9" />
                  </svg>
                </div>
                <span>Quality</span>
              </div>

              <div className="badge-icon-item">
                <div className="badge-icon badge-icon-support">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
                <span>Support</span>
              </div>

              <div className="badge-icon-item">
                <div className="badge-icon badge-icon-delivery">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>
                <span>Fast Service</span>
              </div>

              <div className="badge-icon-item">
                <div className="badge-icon badge-icon-guarantee">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <span>Guarantee</span>
              </div>
            </div>
          </div>

          <div className="badge-right-content">
            <div className="badge-carousel-container">
              <div className="badge-cards-container">
                <div className="badge-cards-track">
                  {products.map((item, idx) => (
                    <div
                      key={`card-${idx}`}
                      className="badge-card"
                      onClick={() => navigate("/")} // ← Fixed: Navigate to Home.jsx
                      style={{cursor: 'pointer'}} // ← Added cursor pointer
                    >
                      <div className="badge-card-image-full">
                        <img
                          src={item.src}
                          alt={item.name}
                          draggable={false}
                          onError={(e) => {
                            console.error('Image failed to load:', e.target.src);
                            e.target.style.backgroundColor = '#374151';
                            e.target.style.display = 'flex';
                            e.target.style.alignItems = 'center';
                            e.target.style.justifyContent = 'center';
                            e.target.alt = 'Image not found';
                          }}
                        />
                        <div className="badge-card-overlay">
                          <div className="product-info">
                            <div className="product-icon">
                              {item.type === "bamboo" ? getBambooIcon() : getPopIcon()}
                            </div>
                            <div className="product-name">
                              {item.name}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Poster;
 