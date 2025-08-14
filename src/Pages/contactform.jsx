import React, { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import "../Style/contactform.css";

const ContactForm = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", query: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init("aalvm8cdhpgqGnbdN");
  }, []);

  // Show form after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  // Toast function
  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim() || !/^[+]?[\d\s\-\(\)]{7,15}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.query.trim() || formData.query.trim().length < 10) {
      newErrors.query = "Query must be at least 10 characters";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      showToast("Please fix the form errors before submitting", "error");
      return false;
    }

    return true;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // EmailJS parameters that match the template exactly
      await emailjs.send("service_xz17hoo", "template_ergrx3a", {
        from_name: formData.name,           // Matches {{from_name}}
        from_email: formData.email,         // Matches {{from_email}}
        phone_number: formData.phone,       // Matches {{phone_number}}
        user_query: formData.query,         // Matches {{user_query}}
        submission_time: new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          dateStyle: 'full',
          timeStyle: 'short'
        })
      });

      showToast("🎉 Message sent successfully!", "success");
      setFormData({ name: "", email: "", phone: "", query: "" });
      setTimeout(() => setIsVisible(false), 3000);

    } catch (error) {
      console.error("EmailJS Error:", error);
      showToast("❌ Failed to send message. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="contact-overlay">
        <div className="contact-container">
          <div className="contact-header">
            <h2 className="contact-title">Contact HPS Constructions</h2>
            <button
              className="close-button"
              onClick={() => setIsVisible(false)}
              aria-label="Close contact form"
            >
              ✕
            </button>
          </div>

          <div className="contact-content">
            <p className="contact-subtitle">
              Get in touch with us for your construction needs
            </p>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  disabled={isSubmitting}
                  className={errors.name ? "error" : ""}
                  required
                />
                {errors.name && (
                  <span className="error-message">{errors.name}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  disabled={isSubmitting}
                  className={errors.email ? "error" : ""}
                  required
                />
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  disabled={isSubmitting}
                  className={errors.phone ? "error" : ""}
                  required
                />
                {errors.phone && (
                  <span className="error-message">{errors.phone}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="query">Your Query *</label>
                <textarea
                  id="query"
                  name="query"
                  value={formData.query}
                  onChange={handleInputChange}
                  placeholder="Write Your Query"
                  disabled={isSubmitting}
                  className={errors.query ? "error" : ""}
                  rows="4"
                  required
                />
                {errors.query && (
                  <span className="error-message">{errors.query}</span>
                )}
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          <span className="toast-message">{toast.message}</span>
          <button className="toast-close" onClick={() => setToast(null)}>
            ✕
          </button>
        </div>
      )}
    </>
  );
};

export default ContactForm;
