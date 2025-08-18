import React from "react";
import { useNavigate } from "react-router-dom";
import emailjs from '@emailjs/browser';
import { useUser } from "../context/UserContext";
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
  const { userData } = useUser();

  // Initialize EmailJS
  React.useEffect(() => {
    emailjs.init('aalvm8cdhpgqGnbdN');
  }, []);

  // Get user data from localStorage (persistent storage)
  const getSavedUserData = () => {
    try {
      const savedData = localStorage.getItem('userData');
      return savedData ? JSON.parse(savedData) : {};
    } catch (error) {
      console.error("Error parsing saved user data:", error);
      return {};
    }
  };

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

  // Function to send email with user data from localStorage
  const sendEmailWithUserData = async () => {
    const savedUserData = getSavedUserData();
    const currentUserData = userData || {};
    
    // Combine saved data with current context data
    const finalUserData = {
      name: savedUserData.name || currentUserData.name || 'Website Visitor',
      phone: savedUserData.phone || currentUserData.phone || 'Not provided',
      service: savedUserData.service || currentUserData.service || title,
      query: savedUserData.query || currentUserData.query || 'No specific query'
    };
    
    try {
      await emailjs.send('service_xz17hoo', 'template_ergrx3a', {
        from_name: finalUserData.name,
        phone_number: finalUserData.phone,
        service_needed: finalUserData.service,
        user_query: `${finalUserData.query} | Product Interest: ${title} (₹${price}/${unit}). ${description}`,
        submission_time: new Date().toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          dateStyle: 'full',
          timeStyle: 'short'
        }),
        product_details: `Product: ${title}, Price: ₹${price}/${unit}, Rating: ${rating}`,
        interaction_type: 'Product Interest with User Details'
      });
      
      console.log('Email sent with user data successfully');
      return { success: true, userData: finalUserData };
    } catch (error) {
      console.error('Failed to send email with user data:', error);
      return { success: false, userData: finalUserData };
    }
  };

  const handleLearnMore = async (e) => {
    e.stopPropagation();
    
    const savedUserData = getSavedUserData();
    const currentUserData = userData || {};
    
    // Check if user data exists in either localStorage or context
    const hasUserData = (savedUserData.name && savedUserData.phone) || (currentUserData.name && currentUserData.phone);
    
    if (!hasUserData) {
      // Show message that user needs to fill query form first
      const modal = document.createElement('div');
      modal.className = 'contact-modal-overlay';
      modal.innerHTML = `
        <div class="contact-modal">
          <div class="contact-modal-header">
            <h3>📋 Contact Details Required</h3>
            <button class="modal-close" aria-label="Close modal">&times;</button>
          </div>
          <div class="contact-modal-body">
            <div class="requirement-notice">
              <span class="notification-icon">⚠️</span>
              <p>Please fill the contact form first to show interest in products!</p>
            </div>
            <p>To proceed with <strong>${title}</strong>, we need your contact information:</p>
            <ul>
              <li>✓ Your Name</li>
              <li>✓ Phone Number</li>
              <li>✓ Service Requirements</li>
            </ul>
            <div class="modal-footer-note">
              <small>💡 Look for the floating "Need Help?" button or wait for the contact form to appear.</small>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      requestAnimationFrame(() => modal.classList.add('show'));

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

      return;
    }
    
    // Send email with user data
    const emailResult = await sendEmailWithUserData();
    
    if (emailResult.success) {
      // Create modal for contact options with user data
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
              <p>We've sent your interest with your contact details to our team!</p>
              <div class="user-details-preview">
                <small>👤 ${emailResult.userData.name} | 📞 ${emailResult.userData.phone}</small>
              </div>
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
              <small>💡 Our team has your details: ${emailResult.userData.name} (${emailResult.userData.phone})</small>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      // Add entrance animation
      requestAnimationFrame(() => {
        modal.classList.add('show');
      });

      // Handle WhatsApp (use actual user data)
      modal.querySelector('.whatsapp-option').onclick = () => {
        const message = encodeURIComponent(
          `🏗️ *Interest in ${title}*\n\nHi HPS Constructions!\n\nName: ${emailResult.userData.name}\nPhone: ${emailResult.userData.phone}\n\nI'm interested in ${title} (₹${price}/${unit}).\n\n${description}\n\nOriginal Query: ${emailResult.userData.query || 'General interest'}\n\nPlease provide more details about:\n• Availability\n• Installation process\n• Bulk pricing\n• Quality specifications\n\nThank you!`
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
    }
    
    onLearnMore();
  };

  // Check if user data exists (from localStorage or context)
  const savedUserData = getSavedUserData();
  const hasUserData = (savedUserData.name && savedUserData.phone) || (userData?.name && userData?.phone);

  return (
    <div className="hps-card">
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
            {hasUserData && (
              <span className="user-indicator">✓</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
