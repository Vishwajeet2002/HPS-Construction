import React from "react";
import { useNavigate } from "react-router-dom";
import "../ComponentCss/productCard.css";
import bambooFlooringImage from "/images/luffy.jpg";

export default function ProductCard({
  title = "Premium Bamboo Flooring",
  description = "High-quality bamboo flooring that combines durability with eco-friendly design for modern homes and commercial spaces.",
  price = 599,
  unit = "sq ft",
  rating = 4.8,
  imageUrl = bambooFlooringImage,
  onCall = () => console.log("Call clicked"),
  onLearnMore = () => console.log("Learn more clicked"),
}) {
  const navigate = useNavigate();

  // Star rating component
  const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <div className="rating-container">
        <div className="stars">
          {[...Array(5)].map((_, index) => (
            <span
              key={index}
              className={`star ${
                index < fullStars
                  ? "filled"
                  : index === fullStars && hasHalfStar
                  ? "half"
                  : "empty"
              }`}
            >
              ★
            </span>
          ))}
        </div>
        <div className="rating-info">
          <span className="rating-number">{rating}</span>
          <span className="rating-label">rating</span>
        </div>
      </div>
    );
  };

  const handleCall = (e) => {
    e.stopPropagation();
    window.location.href = "tel:9565550142";
    onCall();
  };

  const handleLearnMore = (e) => {
    e.stopPropagation();
    
    // Create modal for contact options
    const modal = document.createElement('div');
    modal.className = 'contact-modal-overlay';
    modal.innerHTML = `
      <div class="contact-modal">
        <div class="contact-modal-header">
          <h3>Contact Us About ${title}</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="contact-modal-body">
          <p>How would you like to get more information?</p>
          <div class="contact-options">
            <button class="contact-option whatsapp-option">
              <span class="option-icon">💬</span>
              <span class="option-text">WhatsApp</span>
            </button>
            <button class="contact-option email-option">
              <span class="option-icon">📧</span>
              <span class="option-text">Email</span>
            </button>
            <button class="contact-option call-option">
              <span class="option-icon">📞</span>
              <span class="option-text">Call Now</span>
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Handle WhatsApp
    modal.querySelector('.whatsapp-option').onclick = () => {
      const message = encodeURIComponent(
        `Hi HPS Constructions! I'm interested in ${title} (₹${price}/${unit}). Please provide more details.`
      );
      window.open(`https://wa.me/919565550142?text=${message}`, "_blank");
      document.body.removeChild(modal);
    };

    // Handle Email
    modal.querySelector('.email-option').onclick = () => {
      const subject = encodeURIComponent(`Inquiry about ${title}`);
      const body = encodeURIComponent(
        `Hello HPS Constructions,\n\nI'm interested in ${title} (₹${price}/${unit}).\n\n${description}\n\nPlease provide more details about this product/service.\n\nThank you!`
      );
      window.location.href = `mailto:info@hpsconstructions.com?subject=${subject}&body=${body}`;
      document.body.removeChild(modal);
    };

    // Handle Call
    modal.querySelector('.call-option').onclick = () => {
      window.location.href = "tel:9565550142";
      document.body.removeChild(modal);
    };

    // Handle close
    const closeModal = () => {
      if (document.body.contains(modal)) {
        document.body.removeChild(modal);
      }
    };

    modal.querySelector('.modal-close').onclick = closeModal;
    modal.onclick = (e) => {
      if (e.target === modal) closeModal();
    };

    // Close on Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);

    onLearnMore();
  };

  const handleCardClick = () => {
    navigate("/products");
  };

  return (
    <div className="hps-card" onClick={handleCardClick}>
      <div className="card-image">
        <img
          src={imageUrl}
          alt={title}
          onError={(e) => {
            e.target.src = "/assets/placeholder.jpg";
          }}
        />
        <div className="image-overlay"></div>
        {/* Mobile Description Overlay */}
        <div className="mobile-description-overlay">
          <div className="mobile-description-content">
            <p className="mobile-description-text">{description}</p>
            <div className="description-gradient"></div>
          </div>
        </div>
      </div>

      <div className="card-content">
        <div className="title-description-group">
          <h3 className="card-title">{title}</h3>
          {/* Desktop description */}
          <p className="card-description desktop-only">{description}</p>
          {/* Mobile description trigger */}
          <div className="mobile-description-trigger">
            <span className="description-hint">Tap to see details</span>
          </div>
        </div>

        <div className="rating-price-row">
          <div className="rating-section">
            <StarRating rating={rating} />
          </div>

          <div className="price-section">
            <div className="price-main">
              <span className="currency">₹</span>
              <span className="amount">{price.toLocaleString()}</span>
            </div>
            <div className="price-unit">per {unit}</div>
          </div>
        </div>

        <div className="card-actions">
          <button className="btn-call" onClick={handleCall} title="Call Us">
            <span className="btn-text">Call</span>
            <span className="btn-icon call-icon">📞</span>
          </button>
          <button className="btn-learn" onClick={handleLearnMore} title="Contact Options">
            <span className="btn-text">Learn More</span>
            <span className="btn-icon learn-icon">💬</span>
          </button>
        </div>
      </div>
    </div>
  );
}
