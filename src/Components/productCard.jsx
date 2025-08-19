import React, { useCallback } from "react";
import emailjs from "@emailjs/browser";
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
  onLearnMore = (success, userData, productTitle) => {
    if (success) {
      alert(`✅ Thank you for your interest in ${productTitle}! We'll contact you soon.`);
    } else {
      alert("📋 Please fill out the contact form with your name and phone number first.");
    }
  },
}) {
  const { userData } = useUser();

  React.useEffect(() => {
    // FIXED: Use import.meta.env instead of process.env
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
      
      console.log('🔑 Using Service ID:', import.meta.env.VITE_EMAILJS_SERVICE_ID);
      console.log('🔑 Using Template ID:', import.meta.env.VITE_EMAILJS_TEMPLATE_ID);
      
      // FIXED: Use import.meta.env instead of process.env
      const result = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams
      );
      
      console.log("✅ Product interest email sent successfully:", result);
      return true;
    } catch (error) {
      console.error("❌ Product interest email failed:", error);
      console.error("❌ Error details:", error.text || error.message);
      return false;
    }
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
      console.log('❌ Data incomplete - showing form prompt');
      onLearnMore(false, finalUserData, title);
      return;
    }

    console.log('📧 Data is complete - sending email');
    const success = await sendEmailWithUserData(finalUserData);
    console.log('📧 Email send result:', success);
    
    onLearnMore(success, finalUserData, title);
  }, [title, price, unit, description, sendEmailWithUserData, onLearnMore]);

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
  );
}
