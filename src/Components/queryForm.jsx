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
  const [errors, setErrors] = useState({});
  const timerRef = useRef(null);

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init("aalvm8cdhpgqGnbdN");
  }, []);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('userData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
        updateUserData(parsedData);
      } catch (error) {
        console.error("Error parsing saved user data:", error);
      }
    }
  }, [updateUserData]);

  // Save data to localStorage whenever formData changes
  useEffect(() => {
    localStorage.setItem('userData', JSON.stringify(formData));
    updateUserData(formData);
  }, [formData, updateUserData]);

  // Minimal: Just show floating widget after 4s
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setUserHasInteracted(true);
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Only Name and Phone required for Cancel
  const validateCancelFields = () => {
    const newErrors = {};
    if (!formData.name.trim() || formData.name.trim().length < 2)
      newErrors.name = "Name is required (minimum 2 characters)";
    if (!formData.phone.trim() || !/^[+]?[\d\s\-()]{7,15}$/.test(formData.phone))
      newErrors.phone = "Valid phone number is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // All fields required for Submit
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim() || formData.name.trim().length < 2)
      newErrors.name = "Name must be at least 2 characters";
    if (!formData.phone.trim() || !/^[+]?[\d\s\-()]{7,15}$/.test(formData.phone))
      newErrors.phone = "Please enter a valid phone number";
    if (!formData.service)
      newErrors.service = "Please select the service you need";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
        `🏗️ *${actionType === "cancel" ? "Cancelled" : "New"} Query – HPS Constructions*\n\n👤 *Name:* ${formData.name}\n📞 *Phone:* ${formData.phone}\n🔧 *Service:* ${formData.service || "-"}\n📝 *Query:* ${formData.query || "No specific query provided"}\n\n📅 *${actionType === "cancel" ? "Cancelled" : "Submitted"}:* ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" })}\n\n${actionType === "cancel" ? "User filled the form but cancelled. Please follow up!" : "Please contact me regarding my construction needs."}`
      );

      window.open(`https://wa.me/919565550142?text=${whatsappMessage}`, "_blank");
      return true;
    } catch (error) {
      console.error("Failed to send email/WhatsApp:", error);
      // No popup needed
      return false;
    }
  };

  const closeModal = () => {
    updateUserData({
      name: formData.name,
      phone: formData.phone,
      service: formData.service,
      query: formData.query,
      submittedAt: new Date().toISOString()
    });
    globalModalShown = true;
    sessionStorage.setItem("modalShown", "true");
    setIsModalOpen(false);
    setIsFloatingVisible(true);
    setErrors({});
    setUserHasInteracted(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await sendEmailAndWhatsApp("submit");
      closeModal();
    } catch {
      // No toast needed
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (!validateCancelFields()) return;
    setIsSubmitting(true);
    try {
      await sendEmailAndWhatsApp("cancel");
      closeModal();
    } catch {
      // No toast needed
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
        <div className="query-modal-overlay" onClick={(e) => {
          if (e.target === e.currentTarget && !userHasInteracted) closeModal();
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
                  <label>Service Needed</label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className={errors.service ? "error" : ""}
                  >
                    <option value="">Select a service</option>
                    {services.map((service) => (
                      <option key={service} value={service}>{service}</option>
                    ))}
                  </select>
                  {errors.service && <span className="error-message">{errors.service}</span>}
                </div>
                <div className="form-group">
                  <label>Your Quantity & Unit or Query</label>
                  <textarea
                    name="query"
                    rows="3"
                    value={formData.query}
                    onChange={handleInputChange}
                    placeholder="Tell us about your project requirements..."
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
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QueryForm;
