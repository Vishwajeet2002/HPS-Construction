import React from "react";
import { useNavigate } from "react-router-dom";
import emailjs from '@emailjs/browser';
import "../ComponentCss/productCard.css";
import bambooFlooringImage from "/images/luffy.jpg";
import contactForm from "../Components/queryForm.jsx";

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

  // Initialize EmailJS (you can also do this in your main app)
  React.useEffect(() => {
    emailjs.init('aalvm8cdhpgqGnbdN'); // Your EmailJS public key
  }, []);

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

  // Function to send automatic email
  const sendAutomaticEmail = async () => {
    try {
      await emailjs.send('service_xz17hoo', 'template_ergrx3a', {
        from_name: 'Website Visitor',
        phone_number: 'Not provided',
        service_needed: title,
        user_query: `User showed interest in ${title} (₹${price}/${unit}). ${description}`,
        submission_time: new Date().toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          dateStyle: 'full',
          timeStyle: 'short'
        }),
        product_details: `Product: ${title}, Price: ₹${price}/${unit}, Rating: ${rating}`,
        interaction_type: 'Product Interest - Learn More Button'
      });
      console.log('Automatic email sent successfully');
    } catch (error) {
      console.error('Failed to send automatic email:', error);
    }
  };

  const handleLearnMore = async (e) => {
    e.stopPropagation();
    
    // First, send automatic email in background
    await sendAutomaticEmail();
    
    // Create modal for contact options
    const modal = document.createElement('div');
    modal.className = 'contact-modal-overlay';
    modal.innerHTML = `
      <div class="contact-modal">
        <div class="contact-modal-header">
          <h3>Interest Recorded for ${title}</h3>
          <button class="modal-close" aria-label="Close modal">&times;</button>
        </div>
        <div class="contact-modal-body">
          <div class="auto-email-notification">
            <span class="notification-icon">📧</span>
            <p>We've automatically recorded your interest and notified our team!</p>
          </div>
          <p><strong>How would you like us to contact you?</strong></p>
          <div class="contact-options">
            <button class="contact-option whatsapp-option">
              <span class="option-icon">💬</span>
              <div class="option-content">
                <span class="option-text">WhatsApp</span>
                <span class="option-description">Chat with us instantly</span>
              </div>
            </button>
            <button class="contact-option call-option">
              <span class="option-icon">📞</span>
              <div class="option-content">
                <span class="option-text">Call Now</span>
                <span class="option-description">Speak directly with us</span>
              </div>
            </button>
          </div>
          <div class="modal-footer-note">
            <small>💡 Our team has been notified about your interest in ${title}</small>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Add entrance animation
    requestAnimationFrame(() => {
      modal.classList.add('show');
    });

    // Handle WhatsApp
    modal.querySelector('.whatsapp-option').onclick = () => {
      const message = encodeURIComponent(
        `🏗️ *Interest in ${title}*\n\nHi HPS Constructions!\n\nI'm interested in ${title} (₹${price}/${unit}).\n\n${description}\n\nPlease provide more details about:\n• Availability\n• Installation process\n• Bulk pricing\n• Quality specifications\n\nThank you!`
      );
      window.open(`https://wa.me/919565550142?text=${message}`, "_blank");
      closeModal();
    };

    // Handle Call
    modal.querySelector('.call-option').onclick = () => {
      window.location.href = "tel:9565550142";
      closeModal();
    };

    // Handle close
    const closeModal = () => {
      if (document.body.contains(modal)) {
        modal.classList.add('hide');
        setTimeout(() => {
          if (document.body.contains(modal)) {
            document.body.removeChild(modal);
          }
        }, 300);
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
          <button className="btn-learn" onClick={handleLearnMore} title="Show Interest">
            <span className="btn-text">Learn More</span>
            <span className="btn-icon learn-icon">💬</span>
          </button>
        </div>
      </div>
    </div>
  );
}
