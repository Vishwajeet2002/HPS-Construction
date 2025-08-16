import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import '../ComponentCss/queryForm.css';

const services = [
  'Bamboo Flooring',
  'Bamboo Wall Panels',
  'Bamboo Furniture',
  'POP Ceiling Design',
  'POP Wall Installation',
  'POP Decorative Items',
  'Bulk Supply',
  'Custom Solutions'
];

const QueryForm = () => {
  const [isFloatingVisible, setIsFloatingVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    query: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init('aalvm8cdhpgqGnbdN');
  }, []);

  // Auto-open modal after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasAutoOpened) {
        setIsModalOpen(true);
        setHasAutoOpened(true);
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [hasAutoOpened]);

  // Show floating button when modal is closed
  useEffect(() => {
    if (!isModalOpen && hasAutoOpened) {
      const timer = setTimeout(() => setIsFloatingVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [isModalOpen, hasAutoOpened]);

  // Re-open modal on focus return
  useEffect(() => {
    const handleFocusReturn = () => {
      if (hasAutoOpened) {
        setTimeout(() => setIsModalOpen(true), 1500);
      }
    };

    document.addEventListener('visibilitychange', handleFocusReturn);
    window.addEventListener('focus', handleFocusReturn);
    return () => {
      document.removeEventListener('visibilitychange', handleFocusReturn);
      window.removeEventListener('focus', handleFocusReturn);
    };
  }, [hasAutoOpened]);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.phone.trim() || !/^[+]?[\d\s\-\(\)]{7,15}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.service) {
      newErrors.service = 'Please select the service you need';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length) {
      showToast('Please fix the form errors before submitting', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      await emailjs.send('service_xz17hoo', 'template_ergrx3a', {
        from_name: formData.name,
        phone_number: formData.phone,
        service_needed: formData.service,
        user_query: formData.query || '—',
        submission_time: new Date().toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          dateStyle: 'full',
          timeStyle: 'short'
        })
      });

      const whatsappMessage = encodeURIComponent(
`🏗️ *New Query – HPS Constructions*

👤 *Name:* ${formData.name}
📞 *Phone:* ${formData.phone}
🔧 *Service:* ${formData.service}
📝 *Query:* ${formData.query || '—'}

📅 *Submitted:* ${new Date().toLocaleString('en-IN', {
  timeZone: 'Asia/Kolkata',
  dateStyle: 'medium',
  timeStyle: 'short'
})}

Please contact me regarding my construction needs.`
      );
      
      window.open(`https://wa.me/919565550142?text=${whatsappMessage}`, '_blank');
      showToast('🎉 Message sent via Email & WhatsApp!', 'success');
      setFormData({ name: '', phone: '', service: '', query: '' });

      setTimeout(() => {
        setIsModalOpen(false);
        setTimeout(() => setIsFloatingVisible(true), 8000);
      }, 3000);
    } catch (err) {
      console.error(err);
      showToast('❌ Failed to send email. WhatsApp message sent.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Contact Button */}
      {isFloatingVisible && !isModalOpen && hasAutoOpened && (
        <div className={`floating-contact-widget ${isFloatingVisible ? 'visible' : ''}`}>
          <div className="floating-button" onClick={() => { 
            setIsModalOpen(true); 
            setIsFloatingVisible(false); 
          }}>
            <div className="floating-icon">💬</div>
            <div className="floating-text">Need Help?</div>
            <div className="floating-pulse"></div>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="contact-overlay modal-open auto-open">
          <div className="contact-container modal scrollable">
            <div className="contact-header">
              <h2 className="contact-title">
                {hasAutoOpened ? '👋 Welcome to HPS Constructions!' : 'Contact HPS Constructions'}
              </h2>
              <button className="close-button" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <div className="contact-content">
              <p className="contact-subtitle">
                {hasAutoOpened
                  ? "We're here to help with all your bamboo and POP construction needs!"
                  : 'Get in touch with us for your construction needs'}
              </p>

              <div className="dual-send-info">
                📧 Your message will be sent instantly
              </div>

              {hasAutoOpened && (
                <div className="welcome-message">
                  🏗️ Tell us about your project and get expert advice on bamboo flooring,
                  POP ceiling designs, and sustainable construction solutions.
                </div>
              )}

              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    disabled={isSubmitting}
                    className={errors.name ? 'error' : ''}
                    required
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
                    className={errors.service ? 'error' : ''}
                    required
                  >
                    <option value="">Select a service</option>
                    {services.map(service => (
                      <option key={service} value={service}>{service}</option>
                    ))}
                  </select>
                  {errors.service && <span className="error-message">{errors.service}</span>}
                </div>

                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    disabled={isSubmitting}
                    className={errors.phone ? 'error' : ''}
                    required
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
                    placeholder="Tell us about your project…"
                    disabled={isSubmitting}
                  />
                </div>

                <button className="submit-button" disabled={isSubmitting}>
                  {isSubmitting ? '📤 Sending…' : '🚀 Send Message'}
                </button>

                {hasAutoOpened && (
                  <button type="button" className="skip-button" onClick={() => setIsModalOpen(false)}>
                    Maybe Later
                  </button>
                )}
              </form>
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