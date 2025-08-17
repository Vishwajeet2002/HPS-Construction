import React, { useState, useEffect, useRef } from "react";
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

// Global variable to track if modal was shown (survives component remounts)
let globalModalShown = false;

const QueryForm = () => {
  const { updateUserData } = useUser();
  const [isFloatingVisible, setIsFloatingVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "",
    query: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  
  const timerRef = useRef(null);

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init("aalvm8cdhpgqGnbdN");
  }, []);

  // Check both sessionStorage AND global variable on mount
  useEffect(() => {
    const sessionModalShown = sessionStorage.getItem("modalShown");
    
    // If either global variable OR sessionStorage says modal was shown
    if (globalModalShown || sessionModalShown === "true") {
      setIsFloatingVisible(true);
      return;
    }
    
    // First time ever - show modal after 4 seconds
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

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setUserHasInteracted(true);
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateMandatoryFields = () => {
    const newErrors = {};
    if (!formData.name.trim() || formData.name.trim().length < 2)
      newErrors.name = "Name is required (minimum 2 characters)";
    if (!formData.phone.trim() || !/^[+]?[\d\s\-()]{7,15}$/.test(formData.phone))
      newErrors.phone = "Valid phone number is required";
    if (!formData.service)
      newErrors.service = "Please select a service";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim() || formData.name.trim().length < 2)
      newErrors.name = "Name must be at least 2 characters";
    if (!formData.phone.trim() || !/^[+]?[\d\s\-()]{7,15}$/.test(formData.phone))
      newErrors.phone = "Please enter a valid phone number";
    if (!formData.service)
      newErrors.service = "Please select the service you need";
    setErrors(newErrors);
    if (Object.keys(newErrors).length) {
      showToast("Please fix the form errors before submitting", "error");
      return false;
    }
    return true;
  };

  const sendEmailAndWhatsApp = async (actionType = "submit") => {
    try {
      await emailjs.send("service_xz17hoo", "template_ergrx3a", {
        from_name: formData.name,
        phone_number: formData.phone,
        service_needed: formData.service,
        user_query: formData.query || "No specific query provided",
        submission_time: new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          dateStyle: "full",
          timeStyle: "short",
        }),
        interaction_type: `Query Form - ${actionType === "cancel" ? "Cancelled" : "Submitted"}`,
      });

      const whatsappMessage = encodeURIComponent(
        `🏗️ *${actionType === "cancel" ? "Cancelled" : "New"} Query – HPS Constructions*\n\n👤 *Name:* ${formData.name}\n📞 *Phone:* ${formData.phone}\n🔧 *Service:* ${formData.service}\n📝 *Query:* ${formData.query || "No specific query provided"}\n\n📅 *${actionType === "cancel" ? "Cancelled" : "Submitted"}:* ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" })}\n\n${actionType === "cancel" ? "User filled the form but cancelled. Please follow up!" : "Please contact me regarding my construction needs."}`
      );

      window.open(`https://wa.me/919565550142?text=${whatsappMessage}`, "_blank");
      return true;
    } catch (error) {
      console.error("Failed to send email/WhatsApp:", error);
      throw error;
    }
  };

  const closeModal = () => {
    // Store user data in context before closing modal
    updateUserData({
      name: formData.name,
      phone: formData.phone,
      service: formData.service,
      query: formData.query,
      submittedAt: new Date().toISOString()
    });

    // Set both global variable AND sessionStorage
    globalModalShown = true;
    sessionStorage.setItem("modalShown", "true");
    setIsModalOpen(false);
    setIsFloatingVisible(true);
    setFormData({ name: "", phone: "", service: "", query: "" });
    setErrors({});
    setUserHasInteracted(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      await sendEmailAndWhatsApp("submit");
      showToast("🎉 Message sent via Email & WhatsApp!", "success");
      setTimeout(closeModal, 2000);
    } catch (err) {
      console.error("Email/WhatsApp error:", err);
      showToast("❌ Failed to send email. Please try again or contact us directly.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (!validateMandatoryFields()) {
      showToast("Please fill in Name, Phone, and Service before cancelling", "error");
      return;
    }
    setIsSubmitting(true);

    try {
      await sendEmailAndWhatsApp("cancel");
      showToast("📝 Your details have been sent! We'll follow up with you.", "success");
      setTimeout(closeModal, 2000);
    } catch (error) {
      console.error("Cancel error:", error);
      showToast("❌ Failed to send details. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFloatingButtonClick = () => {
    setIsModalOpen(true);
    setIsFloatingVisible(false);
  };

  return (
    <>
      {/* Floating Contact Button */}
      {isFloatingVisible && !isModalOpen && (
        <div className={`floating-contact-widget ${isFloatingVisible ? "visible" : ""}`}>
          <div className="floating-button" onClick={handleFloatingButtonClick}>
            <div className="floating-icon">💬</div>
            <div className="floating-text">Need Help?</div>
            <div className="floating-pulse"></div>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="query-modal-overlay" onClick={(e) => {
          if (e.target === e.currentTarget && !userHasInteracted) {
            closeModal();
          }
        }}>
          <div className="query-modal-container">
            <div className="query-modal-header">
              <h2 className="query-modal-title">👋 Welcome to HPS Constructions!</h2>
              <button
                className="modal-close-btn"
                onClick={closeModal}
                type="button"
                style={{
                  background: "none",
                  border: "none", 
                  fontSize: "24px",
                  cursor: "pointer",
                  color: "#666",
                  padding: "0",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ✕
              </button>
            </div>

            <div className="query-modal-content">
              <p className="query-modal-subtitle">
                We're here to help with all your bamboo and POP construction needs!
              </p>

              <div className="dual-send-info">
                📧 Your message will be sent instantly via Email & WhatsApp
              </div>

              <div className="welcome-message">
                🏗️ Tell us about your project and get expert advice on bamboo flooring, POP ceiling designs, and sustainable construction solutions.
              </div>

              <form className="query-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
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
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label>Service Needed *</label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className={errors.service ? "error" : ""}
                    required
                  >
                    <option value="">Select a service</option>
                    {services.map((service) => (
                      <option key={service} value={service}>{service}</option>
                    ))}
                  </select>
                  {errors.service && <span className="error-message">{errors.service}</span>}
                </div>

                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    disabled={isSubmitting}
                    className={errors.phone ? "error" : ""}
                    required
                    autoComplete="tel"
                    pattern="[+]?[\d\s\-()]{7,15}"
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>

                <div className="form-group">
                  <label>Your Quantity & Unit or Query</label>
                  <textarea
                    name="query"
                    rows="4"
                    value={formData.query}
                    onChange={handleInputChange}
                    placeholder="Tell us about your project, quantity needed, specifications..."
                    disabled={isSubmitting}
                  />
                </div>

                <button type="submit" className="submit-button" disabled={isSubmitting}>
                  {isSubmitting ? "📤 Sending…" : "🚀 Send Message"}
                </button>

                <button type="button" className="cancel-button" onClick={handleCancel} disabled={isSubmitting}>
                  {isSubmitting ? "📝 Saving Details…" : "Cancel (We'll save your details)"}
                </button>
              </form>

              <div className="mandatory-notice">
                <small>
                  <strong>Note:</strong> Please fill in your Name, Phone, and Service before cancelling. We'll send your details to our team for follow-up.
                </small>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <span className="toast-message">{toast.message}</span>
          <button className="toast-close" onClick={() => setToast(null)}>✕</button>
        </div>
      )}
    </>
  );
};

export default QueryForm;
