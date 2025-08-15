import React, { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import "../ComponentCss/queryForm.css";

const QueryForm = () => {
  const [isFloatingVisible, setIsFloatingVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    query: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init("aalvm8cdhpgqGnbdN");
  }, []);

  // ✨ AUTO-OPEN MODAL after 4 seconds on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasAutoOpened) {
        setIsModalOpen(true);
        setHasAutoOpened(true);
        console.log("Modal auto-opened on page load");
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [hasAutoOpened]);

  // ✨ AUTO-OPEN when user returns to page/tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && hasAutoOpened) {
        setTimeout(() => {
          setIsModalOpen(true);
          console.log("Modal auto-opened on tab focus");
        }, 1500);
      }
    };

    const handleFocus = () => {
      if (hasAutoOpened) {
        setTimeout(() => {
          setIsModalOpen(true);
          console.log("Modal auto-opened on window focus");
        }, 1500);
      }
    };

    const handlePopState = () => {
      setTimeout(() => {
        setIsModalOpen(true);
        console.log("Modal auto-opened on navigation");
      }, 2000);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [hasAutoOpened]);

  // ✨ Show floating button when modal is closed (fallback option)
  useEffect(() => {
    if (!isModalOpen && hasAutoOpened) {
      const timer = setTimeout(() => {
        setIsFloatingVisible(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isModalOpen, hasAutoOpened]);

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

    if (
      !formData.phone.trim() ||
      !/^[+]?[\d\s\-\(\)]{7,15}$/.test(formData.phone)
    ) {
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
      // Send Email via EmailJS
      await emailjs.send("service_xz17hoo", "template_ergrx3a", {
        from_name: formData.name,
        phone_number: formData.phone,
        user_query: formData.query,
        submission_time: new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          dateStyle: "full",
          timeStyle: "short",
        }),
      });

      // Send to WhatsApp
      const whatsappMessage = encodeURIComponent(
        `🏗️ *New Query from HPS Constructions Website*

👤 *Name:* ${formData.name}
📞 *Phone:* ${formData.phone}
📝 *Query:* ${formData.query}

📅 *Submitted:* ${new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          dateStyle: "medium",
          timeStyle: "short",
        })}

Please contact me regarding my construction needs. Thank you!`
      );

      window.open(`https://wa.me/919565550142?text=${whatsappMessage}`, "_blank");

      showToast("🎉 Message sent via Email & WhatsApp!", "success");
      setFormData({ name: "", phone: "", query: "" });
      
      // Close modal after successful submission
      setTimeout(() => {
        setIsModalOpen(false);
        // Show floating button again after 8 seconds
        setTimeout(() => {
          setIsFloatingVisible(true);
        }, 8000);
      }, 3000);

    } catch (error) {
      console.error("EmailJS Error:", error);
      showToast("❌ Failed to send email. WhatsApp message sent.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✨ Open modal manually (from floating button)
  const openModal = () => {
    setIsModalOpen(true);
    setIsFloatingVisible(false);
  };

  // ✨ Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    // Show floating button again after closing
    setTimeout(() => {
      setIsFloatingVisible(true);
    }, 2000);
  };

  return (
    <>
      {/* ✨ FLOATING BUTTON - Only show when modal is closed */}
      {isFloatingVisible && !isModalOpen && hasAutoOpened && (
        <div className={`floating-contact-widget ${isFloatingVisible ? 'visible' : ''}`}>
          <div className="floating-button" onClick={openModal}>
            <div className="floating-icon">💬</div>
            <div className="floating-text">Need Help?</div>
            <div className="floating-pulse"></div>
          </div>
        </div>
      )}

      {/* ✨ SCROLLABLE MODAL */}
      {isModalOpen && (
        <div className="contact-overlay modal-open auto-open">
          <div className="contact-container modal scrollable">
            <div className="contact-header">
              <h2 className="contact-title">
                {hasAutoOpened ? "👋 Welcome to HPS Constructions!" : "Contact HPS Constructions"}
              </h2>
              <button
                className="close-button"
                onClick={closeModal}
                aria-label="Close contact form"
              >
                ✕
              </button>
            </div>

            <div className="contact-content">
              <p className="contact-subtitle">
                {hasAutoOpened 
                  ? "We're here to help with all your bamboo and POP construction needs!" 
                  : "Get in touch with us for your construction needs"
                }
              </p>

              <div className="dual-send-info">
                📧 Your message will be sent via Email & WhatsApp instantly
              </div>

              {/* ✨ Welcome message for auto-opened modal */}
              {hasAutoOpened && (
                <div className="welcome-message">
                  🏗️ Tell us about your project and get expert advice on bamboo flooring, POP ceiling designs, and sustainable construction solutions.
                </div>
              )}

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
                  <label htmlFor="query">Your Quantity & Unit or Query *</label>
                  <textarea
                    id="query"
                    name="query"
                    value={formData.query}
                    onChange={handleInputChange}
                    placeholder="Tell us about your project: bamboo flooring, POP ceiling, interior design, or any construction needs..."
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
                  {isSubmitting ? "📤 Sending..." : "🚀 Send Message"}
                </button>

                {/* ✨ Skip option for auto-opened modal */}
                {hasAutoOpened && (
                  <button
                    type="button"
                    className="skip-button"
                    onClick={closeModal}
                  >
                    Maybe Later
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      )}

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

export default QueryForm;
