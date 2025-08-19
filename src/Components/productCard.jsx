import React, { useCallback, useState } from "react";
import emailjs from "@emailjs/browser";
import { useUser } from "../context/UserContext";
import { createPortal } from 'react-dom';
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
  onLearnMore = () => {},
}) {
  const { userData } = useUser();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showWhatsAppPopup, setShowWhatsAppPopup] = useState(false);
  const [pendingUserData, setPendingUserData] = useState(null);

  React.useEffect(() => {
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
    console.log('🔑 EmailJS initialized with:', import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
  }, []);

  const getValidUserData = () => {
    let validData = userData;
    
    if (!validData || !validData.name || !validData.phone) {
      try {
        const saved = localStorage.getItem('userData');
        if (saved && saved !== 'null') {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.name && parsed.phone) {
            validData = parsed;
            console.log('📋 Using localStorage data as fallback:', parsed);
          }
        }
      } catch (error) {
        console.error('Error reading localStorage:', error);
      }
    }
    
    return validData;
  };

  const isUserDataComplete = () => {
    const data = getValidUserData();
    const isComplete = data && 
                      data.name && 
                      typeof data.name === 'string' &&
                      data.name.trim().length >= 2 && 
                      data.phone && 
                      typeof data.phone === 'string' &&
                      data.phone.trim().length >= 7;
    
    console.log('🎯 ProductCard validation:', {
      data,
      hasName: data?.name,
      nameLength: data?.name?.trim()?.length,
      hasPhone: data?.phone,
      phoneLength: data?.phone?.trim()?.length,
      isComplete
    });
    
    return isComplete;
  };

  const sendEmailWithUserData = useCallback(async (finalUserData) => {
    try {
      console.log('📧 Sending product interest email with data:', finalUserData);
      
      const templateParams = {
        from_name: finalUserData.name,
        phone_number: finalUserData.phone,
        service_needed: finalUserData.service,
        user_query: `${finalUserData.query} | Product Interest: ${title} (Rs.${price}/${unit}). ${description}`,
        submission_time: new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          dateStyle: "full",
          timeStyle: "short",
        }),
        product_details: `Product: ${title}, Price: Rs.${price}/${unit}, Rating: ${rating}`,
        interaction_type: "Product Interest with User Details",
      };
      
      const result = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams
      );
      
      console.log("✅ Product interest email sent successfully:", result);
      return true;
    } catch (error) {
      console.error("❌ Product interest email failed:", error);
      return false;
    }
  }, [title, price, unit, description, rating]);

  const sendWhatsAppMessage = useCallback((finalUserData) => {
    const whatsappMessage = encodeURIComponent(
`🏗️ *Product Interest from HPS Constructions Website*

👤 *Name:* ${finalUserData.name}
📞 *Phone:* ${finalUserData.phone}
🛍️ *Product:* ${title}
💰 *Price:* Rs.${price}/${unit}
⭐ *Rating:* ${rating}
🔧 *Service:* ${finalUserData.service}
💬 *Query:* ${finalUserData.query}

📋 *Product Details:*
${description}

📅 *Submitted:* ${new Date().toLocaleString("en-IN", {
  timeZone: "Asia/Kolkata",
  dateStyle: "medium",
  timeStyle: "short",
})}

Please provide more details about this product. Thank you!`
    );
    
    window.open(`https://wa.me/919565550142?text=${whatsappMessage}`, '_blank');
    setShowWhatsAppPopup(false);
    console.log("✅ WhatsApp message sent successfully");
  }, [title, price, unit, description, rating]);

  const handleCall = useCallback(async (e) => {
    e.stopPropagation();

    const validData = getValidUserData();
    const callUserData = {
      name: validData?.name || "Anonymous User",
      phone: validData?.phone || "Call button clicked",
      service: validData?.service || title,
      query: validData?.query || "Direct call request",
    };

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: callUserData.name,
          phone_number: callUserData.phone,
          service_needed: callUserData.service,
          user_query: `${callUserData.query} | Call Button Clicked: ${title} (Rs.${price}/${unit}). ${description}`,
          submission_time: new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            dateStyle: "full",
            timeStyle: "short",
          }),
          product_details: `Product: ${title}, Price: Rs.${price}/${unit}, Rating: ${rating}`,
          interaction_type: "Call Button - Auto Email",
        }
      );
      console.log("✅ Auto-email sent on call button click");
    } catch (error) {
      console.error("❌ Call button email failed:", error);
    }

    window.location.href = "tel:9565550142";
    onCall();
  }, [title, price, unit, description, rating, onCall]);

  const handleLearnMore = useCallback(async (e) => {
    e.stopPropagation();
    
    console.log('🚀 Learn More clicked for:', title);
    
    const validData = getValidUserData();
    console.log('📊 Valid user data found:', validData);
    
    const finalUserData = {
      name: validData?.name || "",
      phone: validData?.phone || "",
      service: validData?.service || title,
      query: validData?.query || "Product interest",
    };
    
    console.log('📝 Final data for validation:', finalUserData);
    
    const isComplete = isUserDataComplete();
    console.log('✅ Is data complete?', isComplete);

    if (!isComplete) {
      console.log('❌ Data incomplete - showing error popup');
      setShowErrorPopup(true);
      return;
    }

    console.log('📧 Data is complete - sending email');
    
    try {
      const emailSuccess = await sendEmailWithUserData(finalUserData);
      console.log('📧 Email result:', emailSuccess);
      
      if (emailSuccess) {
        // Store user data for WhatsApp and show success popup
        setPendingUserData(finalUserData);
        setShowSuccessPopup(true);
      } else {
        // Email failed, still offer WhatsApp
        setPendingUserData(finalUserData);
        setShowWhatsAppPopup(true);
      }
      
    } catch (error) {
      console.error('❌ Learn More error:', error);
      setShowErrorPopup(true);
    }
  }, [title, price, unit, description, sendEmailWithUserData]);

  const handleWhatsAppConfirm = () => {
    if (pendingUserData) {
      sendWhatsAppMessage(pendingUserData);
    }
  };

  const closeAllPopups = () => {
    setShowSuccessPopup(false);
    setShowErrorPopup(false);
    setShowWhatsAppPopup(false);
    setPendingUserData(null);
  };

  // Success Popup
  const renderSuccessPopup = () => {
    if (!showSuccessPopup) return null;

    return createPortal(
      <div className="popup-overlay">
        <div className="popup-content success-popup">
          <div className="popup-header">
            <div className="popup-icon success-icon">✅</div>
            <h3>Email Sent Successfully!</h3>
            <button onClick={closeAllPopups} className="popup-close">×</button>
          </div>
          <div className="popup-body">
            <p>Thank you for your interest in <strong>{title}</strong>!</p>
            <p>We've received your inquiry and will contact you soon.</p>
            <div className="popup-actions">
              <button 
                onClick={() => {
                  setShowSuccessPopup(false);
                  setShowWhatsAppPopup(true);
                }}
                className="popup-btn whatsapp-btn"
              >
                📱 Also Send via WhatsApp
              </button>
              <button onClick={closeAllPopups} className="popup-btn secondary-btn">
                👍 Got it
              </button>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  // Error Popup
  const renderErrorPopup = () => {
    if (!showErrorPopup) return null;

    return createPortal(
      <div className="popup-overlay">
        <div className="popup-content error-popup">
          <div className="popup-header">
            <div className="popup-icon error-icon">❌</div>
            <h3>Information Needed</h3>
            <button onClick={closeAllPopups} className="popup-close">×</button>
          </div>
          <div className="popup-body">
            <p>Please fill out the contact form first via the floating <strong>"Need Help?"</strong> button.</p>
            <p>We need your name and phone number to assist you better.</p>
            <div className="popup-actions">
              <button onClick={closeAllPopups} className="popup-btn primary-btn">
                📝 Fill Contact Form
              </button>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  // WhatsApp Confirmation Popup
  const renderWhatsAppPopup = () => {
    if (!showWhatsAppPopup) return null;

    return createPortal(
      <div className="popup-overlay">
        <div className="popup-content whatsapp-popup">
          <div className="popup-header">
            <div className="popup-icon whatsapp-icon">💬</div>
            <h3>Send via WhatsApp?</h3>
            <button onClick={closeAllPopups} className="popup-close">×</button>
          </div>
          <div className="popup-body">
            <p>Would you like to send your inquiry about <strong>{title}</strong> via WhatsApp?</p>
            <p>This will open WhatsApp with a pre-filled message containing your product interest and details.</p>
            <div className="popup-actions">
              <button onClick={handleWhatsAppConfirm} className="popup-btn whatsapp-btn">
                💬 Yes, Open WhatsApp
              </button>
              <button onClick={closeAllPopups} className="popup-btn secondary-btn">
                ❌ No, Thanks
              </button>
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  const StarRating = React.memo(({ rating }) => {
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
  });

  const showCheckmark = isUserDataComplete();

  return (
    <>
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
            <p className="card-description desktop-only">{description}</p>
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
            <button
              className="btn-learn"
              onClick={handleLearnMore}
              title="Show Interest"
            >
              <span className="btn-text">Learn More</span>
              <span className="btn-icon learn-icon">💬</span>
              {showCheckmark && <span className="user-indicator">✓</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Render all popups */}
      {renderSuccessPopup()}
      {renderErrorPopup()}
      {renderWhatsAppPopup()}
    </>
  );
}
