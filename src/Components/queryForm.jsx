import React, { useState, useEffect, useRef, useCallback } from "react";
import emailjs from "@emailjs/browser";
import { useUser } from "../context/UserContext";
import "../ComponentCss/queryForm.css";

const services = [
  "Bamboo Flooring",
  "Bamboo Wall Panels",
  "Bamboo Furniture",
  "POP Ceiling Design",
  "POP Wall Installation",
  "POP Decorative Items",
  "Bulk Supply",
  "Custom Solutions",
];

let globalModalShown = false;

const QueryForm = () => {
  const { userData, updateUserData } = useUser();
  const [isFloatingVisible, setIsFloatingVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);
  const timerRef = useRef(null);
  const updateTimeoutRef = useRef(null);

  // Initialize form data from saved data only once
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem("userData");
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          name: parsed.name || "",
          phone: parsed.phone || "",
          service: parsed.service || "",
          query: parsed.query || "",
        };
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
    return { name: "", phone: "", service: "", query: "" };
  });

  // Initialize EmailJS once
  useEffect(() => {
    // FIXED: Use import.meta.env instead of process.env
    emailjs.init(import.meta.env.VITE_EMAILJS_QUERY_PUBLIC_KEY);
    console.log('🔑 QueryForm EmailJS initialized with:', import.meta.env.VITE_EMAILJS_QUERY_PUBLIC_KEY);
    setIsInitialized(true);
  }, []);

  // Debounced save function to prevent rapid updates
  const debouncedSave = useCallback((data) => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    
    updateTimeoutRef.current = setTimeout(() => {
      if (data.name || data.phone || data.service || data.query) {
        console.log('💾 Auto-saving form data:', data);
        updateUserData({
          ...data,
          lastUpdated: new Date().toISOString()
        });
      }
    }, 500);
  }, [updateUserData]);

  // Auto-save form data with debouncing
  useEffect(() => {
    if (isInitialized && userHasInteracted) {
      debouncedSave(formData);
    }
    
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [formData, debouncedSave, isInitialized, userHasInteracted]);

  // Handle modal display logic
  useEffect(() => {
    const sessionModalShown = sessionStorage.getItem("modalShown");
    if (globalModalShown || sessionModalShown === "true") {
      setIsFloatingVisible(true);
      return;
    }
    
    timerRef.current = setTimeout(() => {
      setIsModalOpen(true);
      globalModalShown = true;
      sessionStorage.setItem("modalShown", "true");
    }, 4000);
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({ ...prev, [name]: value }));
    setUserHasInteracted(true);
    
    // Clear specific field error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }, [errors]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    
    if (!formData.phone.trim() || !/^[+]?[\d\s\-()]{7,15}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    
    if (!formData.service) {
      newErrors.service = "Please select the service you need";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendEmailAndWhatsApp = async () => {
    try {
      console.log('📧 Sending QueryForm email with data:', formData);
      console.log('🔑 Using Query Service ID:', import.meta.env.VITE_EMAILJS_QUERY_SERVICE_ID);
      console.log('🔑 Using Query Template ID:', import.meta.env.VITE_EMAILJS_QUERY_TEMPLATE_ID);
      
      // FIXED: Use import.meta.env instead of process.env
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_QUERY_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_QUERY_TEMPLATE_ID,
        {
          from_name: formData.name,
          phone_number: formData.phone,
          service_needed: formData.service,
          user_query: formData.query || "No specific query provided",
          submission_time: new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            dateStyle: "full",
            timeStyle: "short",
          }),
          interaction_type: "Query Form - Submitted",
        }
      );
      
      console.log('✅ QueryForm email sent successfully');
      return true;
    } catch (error) {
      console.error("❌ Failed to send QueryForm email:", error);
      console.error("❌ Error details:", error.text || error.message);
      return false;
    }
  };

  const closeModal = () => {
    // Save final data
    const finalData = {
      ...formData,
      submittedAt: new Date().toISOString(),
      isSubmitted: true
    };
    
    // Clear any pending timeouts
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    
    updateUserData(finalData);
    console.log('✅ Final QueryForm data saved:', finalData);

    // Update UI state
    globalModalShown = true;
    sessionStorage.setItem("modalShown", "true");
    setIsModalOpen(false);
    setIsFloatingVisible(true);
    setErrors({});
    setUserHasInteracted(false);

    // Clear form visually
    setFormData({ name: "", phone: "", service: "", query: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const emailSuccess = await sendEmailAndWhatsApp();
      if (emailSuccess) {
        alert("✅ Your message has been sent successfully! We'll contact you soon.");
        closeModal();
      } else {
        alert("❌ Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Save current state
    const cancelData = {
      ...formData,
      cancelledAt: new Date().toISOString(),
      isCancelled: true
    };
    
    // Clear any pending timeouts
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    
    updateUserData(cancelData);
    console.log('✅ QueryForm cancelled, data saved:', cancelData);

    // Update UI
    globalModalShown = true;
    sessionStorage.setItem("modalShown", "true");
    setIsModalOpen(false);
    setIsFloatingVisible(true);
    setErrors({});
    setUserHasInteracted(false);

    // Clear form
    setFormData({ name: "", phone: "", service: "", query: "" });
  };

  const handleFloatingButtonClick = () => {
    // Load saved data when reopening
    if (userData) {
      setFormData({
        name: userData.name || "",
        phone: userData.phone || "",
        service: userData.service || "",
        query: userData.query || "",
      });
      console.log('📋 Restored form data from userData:', userData);
    }
    setIsModalOpen(true);
    setIsFloatingVisible(false);
  };

  if (!isInitialized) {
    return null;
  }

  return (
    <>
      {isFloatingVisible && !isModalOpen && (
        <div className={`floating-contact-widget ${isFloatingVisible ? "visible" : ""}`}>
          <div className="floating-button" onClick={handleFloatingButtonClick}>
            <div className="floating-icon">💬</div>
            <div className="floating-text">Need Help?</div>
            <div className="floating-pulse"></div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div
          className="query-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget && !userHasInteracted && !isSubmitting) {
              handleCancel();
            }
          }}
        >
          <div className="query-modal-container">
            <div className="query-modal-header">
              <h2 className="query-modal-title">
                👋 Welcome to HPS Constructions!
              </h2>
            </div>
            <div className="query-modal-content">
              <form className="query-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    disabled={isSubmitting}
                    className={errors.name ? "error" : ""}
                    required
                    autoComplete="name"
                  />
                  {errors.name && (
                    <span className="error-message">{errors.name}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    disabled={isSubmitting}
                    className={errors.phone ? "error" : ""}
                    required
                    autoComplete="tel"
                  />
                  {errors.phone && (
                    <span className="error-message">{errors.phone}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="service">Service Needed</label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className={errors.service ? "error" : ""}
                  >
                    <option value="">Select a service</option>
                    {services.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                  {errors.service && (
                    <span className="error-message">{errors.service}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="query">Your Quantity & Unit or Query</label>
                  <textarea
                    id="query"
                    name="query"
                    rows="3"
                    value={formData.query}
                    onChange={handleInputChange}
                    placeholder="Tell us about your project requirements..."
                    disabled={isSubmitting}
                  />
                </div>

                <button
                  type="submit"
                  className="submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "📤 Sending…" : "🚀 Send Message"}
                </button>

                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "📝 Saving Details…" : "Cancel (We'll save your details)"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QueryForm;
