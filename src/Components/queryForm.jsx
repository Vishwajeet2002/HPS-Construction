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
  const [userHasInteracted, setUserHasInteracted] = useState(false); // Track if user filled form
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

  // Auto-fill phone number detection
  useEffect(() => {
    const tryAutoFill = () => {
      // Try to get phone from browser autofill
      const phoneInput = document.querySelector('input[name="phone"]');
      if (phoneInput) {
        // Trigger autofill
        phoneInput.focus();
        phoneInput.click();
        
        // Check for autofill after a delay
        setTimeout(() => {
          if (phoneInput.value && phoneInput.value.trim()) {
            setFormData(prev => ({ ...prev, phone: phoneInput.value.trim() }));
            setUserHasInteracted(true);
          }
        }, 500);

        // Try alternative methods
        const testInput = document.createElement('input');
        testInput.type = 'tel';
        testInput.name = 'phone';
        testInput.autocomplete = 'tel';
        testInput.style.position = 'absolute';
        testInput.style.left = '-9999px';
        testInput.style.opacity = '0';
        document.body.appendChild(testInput);
        
        testInput.focus();
        
        setTimeout(() => {
          if (testInput.value && testInput.value.trim()) {
            setFormData(prev => ({ ...prev, phone: testInput.value.trim() }));
            setUserHasInteracted(true);
          }
          if (document.body.contains(testInput)) {
            document.body.removeChild(testInput);
          }
        }, 1000);
      }
    };

    if (isModalOpen) {
      setTimeout(tryAutoFill, 200);
    }
  }, [isModalOpen]);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setUserHasInteracted(true); // Mark user as having interacted
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateMandatoryFields = () => {
    const newErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Name is required (minimum 2 characters)';
    }

    if (!formData.phone.trim() || !/^[+]?[\d\s\-\(\)]{7,15}$/.test(formData.phone)) {
      newErrors.phone = 'Valid phone number is required';
    }

    if (!formData.service) {
      newErrors.service = 'Please select a service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const sendEmailAndWhatsApp = async (actionType = 'submit') => {
    try {
      // Send email
      await emailjs.send('service_xz17hoo', 'template_ergrx3a', {
        from_name: formData.name,
        phone_number: formData.phone,
        service_needed: formData.service,
        user_query: formData.query || '—',
        submission_time: new Date().toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          dateStyle: 'full',
          timeStyle: 'short'
        }),
        interaction_type: `Query Form - ${actionType === 'cancel' ? 'Cancelled' : 'Submitted'}`
      });

      // Send WhatsApp message
      const whatsappMessage = encodeURIComponent(
`🏗️ *${actionType === 'cancel' ? 'Cancelled' : 'New'} Query – HPS Constructions*

👤 *Name:* ${formData.name}
📞 *Phone:* ${formData.phone}
🔧 *Service:* ${formData.service}
📝 *Query:* ${formData.query || '—'}

📅 *${actionType === 'cancel' ? 'Cancelled' : 'Submitted'}:* ${new Date().toLocaleString('en-IN', {
  timeZone: 'Asia/Kolkata',
  dateStyle: 'medium',
  timeStyle: 'short'
})}

${actionType === 'cancel' 
  ? 'User filled the form but cancelled. Please follow up!' 
  : 'Please contact me regarding my construction needs.'}`
      );
      
      window.open(`https://wa.me/919565550142?text=${whatsappMessage}`, '_blank');
      
      return true;
    } catch (error) {
      console.error('Failed to send email/WhatsApp:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      await sendEmailAndWhatsApp('submit');
      showToast('🎉 Message sent via Email & WhatsApp!', 'success');
      setFormData({ name: '', phone: '', service: '', query: '' });

      setTimeout(() => {
        setIsModalOpen(false);
        setUserHasInteracted(false);
        // Don't show floating button until user clicks it manually
      }, 3000);
    } catch (err) {
      console.error(err);
      showToast('❌ Failed to send email. WhatsApp message sent.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async () => {
    // Check if user has filled mandatory fields
    if (!validateMandatoryFields()) {
      showToast('Please fill in Name, Phone, and Service before cancelling', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      await sendEmailAndWhatsApp('cancel');
      showToast('📝 Your details have been sent! We\'ll follow up with you.', 'success');
      
      setTimeout(() => {
        setIsModalOpen(false);
        setUserHasInteracted(false);
        setFormData({ name: '', phone: '', service: '', query: '' });
        // Don't show floating button until user clicks it manually
      }, 2000);
    } catch (error) {
      showToast('❌ Failed to send details. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Contact Button - Only show if user manually dismissed */}
      {isFloatingVisible && !isModalOpen && (
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
        <div className="query-modal-overlay">
          <div className="query-modal-container">
            <div className="query-modal-header">
              <h2 className="query-modal-title">
                {hasAutoOpened ? '👋 Welcome to HPS Constructions!' : 'Contact HPS Constructions'}
              </h2>
              {/* Removed close button - modal is now mandatory */}
            </div>

            <div className="query-modal-content">
              <p className="query-modal-subtitle">
                {hasAutoOpened
                  ? "We're here to help with all your bamboo and POP construction needs!"
                  : 'Get in touch with us for your construction needs'}
              </p>

              <div className="dual-send-info">
                📧 Your message will be sent instantly via Email & WhatsApp
              </div>

              {hasAutoOpened && (
                <div className="welcome-message">
                  🏗️ Tell us about your project and get expert advice on bamboo flooring,
                  POP ceiling designs, and sustainable construction solutions.
                </div>
              )}

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
                    className={errors.name ? 'error' : ''}
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
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    disabled={isSubmitting}
                    className={errors.phone ? 'error' : ''}
                    required
                    autoComplete="tel"
                    pattern="[+]?[\d\s\-\(\)]{7,15}"
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

                <button 
                  type="submit" 
                  className="submit-button" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '📤 Sending…' : '🚀 Send Message'}
                </button>

                <button 
                  type="button" 
                  className="cancel-button" 
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '📝 Saving Details…' : 'Cancel (We\'ll save your details)'}
                </button>
              </form>

              <div className="mandatory-notice">
                <small>
                  <strong>Note:</strong> Please fill in your Name, Phone, and Service before cancelling. 
                  We'll send your details to our team for follow-up.
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
