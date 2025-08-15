import React, { useState, useEffect } from 'react';
import emailjs from "@emailjs/browser";
import '../Style/contact.css';

import { 
  FaPhone, 
  FaWhatsapp, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaClock, 
  FaLeaf, 
  FaHammer, 
  FaTruck,
  FaCheckCircle,
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaPaperPlane
} from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
    location: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // ✨ Initialize EmailJS
  useEffect(() => {
    emailjs.init("aalvm8cdhpgqGnbdN"); // Replace with your EmailJS public key
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // ✨ Send Email via EmailJS
      await emailjs.send("service_xz17hoo", "template_ergrx3a", {
        from_name: formData.name,
        from_email: formData.email,
        phone_number: formData.phone,
        service_type: formData.service,
        project_location: formData.location,
        user_message: formData.message,
        submission_time: new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          dateStyle: "full",
          timeStyle: "short",
        }),
      });

      // ✨ Send to WhatsApp
      const whatsappMessage = encodeURIComponent(
        `🏗️ *New Inquiry from HPS Constructions Website*

👤 *Name:* ${formData.name}
📧 *Email:* ${formData.email}
📞 *Phone:* ${formData.phone}
🔧 *Service:* ${formData.service}
📍 *Location:* ${formData.location}
💬 *Message:* ${formData.message}

📅 *Submitted:* ${new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          dateStyle: "medium",
          timeStyle: "short",
        })}

Please contact me regarding bamboo and POP services. Thank you!`
      );
      
      window.open(`https://wa.me/919565550142?text=${whatsappMessage}`, '_blank');

      setIsSubmitting(false);
      setSubmitStatus('success');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: '',
        location: ''
      });

      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);

    } catch (error) {
      console.error("EmailJS Error:", error);
      setIsSubmitting(false);
      setSubmitStatus('error');
      
      // Still send WhatsApp message as fallback
      const fallbackMessage = encodeURIComponent(
        `🏗️ *HPS Constructions Inquiry*

👤 ${formData.name}
📧 ${formData.email}
📞 ${formData.phone}
🔧 ${formData.service}
📍 ${formData.location}
💬 ${formData.message}

Please contact me for bamboo and POP services.`
      );
      
      window.open(`https://wa.me/919555633827?text=${fallbackMessage}`, '_blank');
      
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    }
  };

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

  const contactMethods = [
    {
      icon: <FaPhone />,
      title: 'Call Us',
      info: '+91 9565550142',
      action: () => window.location.href = 'tel:+919565550142',
      color: '#3b82f6'
    },
    {
      icon: <FaWhatsapp />,
      title: 'WhatsApp',
      info: 'Chat with us instantly',
      action: () => window.open('https://wa.me/+919565550142?text=Hello! I need bamboo and POP supplies.', '_blank'),
      color: '#25D366'
    },
    {
      icon: <FaEnvelope />,
      title: 'Email',
      info: 'haripalsingh2580@gmailcom',
      action: () => window.location.href = 'mailto:haripalsingh2580@gmailcom',
      color: '#dc2626'
    },
    {
      icon: <FaMapMarkerAlt />,
      title: 'Visit Us',
      info: 'New Delhi, India',
      action: () => window.open('https://maps.google.com/?q=New+Delhi+India', '_blank'),
      color: '#059669'
    }
  ];

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="hero-background">
          <div className="floating-elements">
            <div className="floating-bamboo">🎋</div>
            <div className="floating-hammer">🔨</div>
            <div className="floating-leaf">🌿</div>
          </div>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="gradient-text">Contact</span> HPS Constructions
          </h1>
          <p className="hero-subtitle">
            Your trusted partner for premium <strong>Bamboo</strong> and <strong>POP</strong> supplies
          </p>
          <div className="hero-badges">
            <span className="badge eco-badge">
              <FaLeaf /> Eco-Friendly
            </span>
            <span className="badge quality-badge">
              <FaCheckCircle /> Premium Quality
            </span>
            <span className="badge delivery-badge">
              <FaTruck /> Fast Delivery
            </span>
          </div>
        </div>
      </section>

      {/* Quick Contact Grid */}
      <section className="quick-contact">
        <div className="container">
          <h2 className="section-title">Get In Touch</h2>
          <div className="contact-grid">
            {contactMethods.map((method, index) => (
              <div 
                key={index}
                className="contact-card"
                onClick={method.action}
                style={{'--card-color': method.color}}
              >
                <div className="card-icon" style={{color: method.color}}>
                  {method.icon}
                </div>
                <h3>{method.title}</h3>
                <p>{method.info}</p>
                <div className="card-hover-effect"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Contact Form Section */}
      <section className="contact-form-section">
        <div className="container">
          <div className="form-wrapper">
            <div className="form-info">
              <h2>Let's Build Something Amazing Together!</h2>
              <p>Whether you need bamboo for sustainable construction or POP for elegant interiors, we've got you covered.</p>
              
              <div className="info-highlights">
                <div className="highlight">
                  <FaLeaf className="highlight-icon bamboo" />
                  <div>
                    <h4>Bamboo Supplies</h4>
                    <p>Sustainable, durable, and eco-friendly bamboo products</p>
                  </div>
                </div>
                <div className="highlight">
                  <FaHammer className="highlight-icon pop" />
                  <div>
                    <h4>POP Solutions</h4>
                    <p>High-quality Plaster of Paris for modern interiors</p>
                  </div>
                </div>
              </div>

              <div className="business-hours">
                <h4><FaClock /> Business Hours</h4>
                <div className="hours-grid">
                  <span>Monday - Friday:</span> <span>9:00 AM - 7:00 PM</span>
                  <span>Saturday:</span> <span>9:00 AM - 5:00 PM</span>
                  <span>Sunday:</span> <span>10:00 AM - 4:00 PM</span>
                </div>
              </div>
            </div>

            <div className="contact-form">
              <form onSubmit={handleSubmit}>
                <div className="form-header">
                  <h3>Send Us A Message</h3>
                  <p>Fill out the form and we'll get back to you within 24 hours</p>
                  {/* ✨ Added dual sending info */}
                  <div className="dual-send-info">
                    📧 Your message will be sent from here
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>

                {/* ✨ FIXED: Email field centered and full width */}
                <div className="form-group email-centered">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Service Needed</label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                    >
                      <option value="">Select a service</option>
                      {services.map((service, index) => (
                        <option key={index} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Project Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Where is your project located?"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us about your project requirements..."
                    rows="4"
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      Click here
                    </>
                  )}
                </button>

                {submitStatus === 'success' && (
                  <div className="success-message">
                    <FaCheckCircle />
                    Message sent successfully via Email & WhatsApp! We'll contact you soon.
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="error-message">
                    <FaWhatsapp />
                    Email failed but WhatsApp message sent! We'll contact you soon.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-us">
        <div className="container">
          <h2 className="section-title">Why Choose HPS Constructions?</h2>
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">🌱</div>
              <h3>Sustainable Materials</h3>
              <p>We provide eco-friendly bamboo products that are both durable and environmentally responsible.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🏗️</div>
              <h3>Expert Installation</h3>
              <p>Our skilled team ensures professional installation of all bamboo and POP solutions.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🚚</div>
              <h3>Fast Delivery</h3>
              <p>Quick and reliable delivery across Delhi NCR with proper packaging and handling.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">💰</div>
              <h3>Competitive Prices</h3>
              <p>Best market prices without compromising on quality. Bulk orders get special discounts.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🎨</div>
              <h3>Custom Designs</h3>
              <p>Tailored solutions for your specific needs, from residential to commercial projects.</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🛡️</div>
              <h3>Quality Guarantee</h3>
              <p>All our products come with quality assurance and after-sales support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media & CTA */}
      <section className="social-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Project?</h2>
            <p>Connect with us on social media or give us a call!</p>
            
            <div className="social-links">
              <a href="#" className="social-link facebook">
                <FaFacebook />
              </a>
              <a href="#" className="social-link instagram">
                <FaInstagram />
              </a>
              <a href="#" className="social-link linkedin">
                <FaLinkedin />
              </a>
              <a 
                href="https://wa.me/+919565550142?text=Hello! I'm interested in your bamboo and POP services."
                className="social-link whatsapp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp />
              </a>
            </div>

            <div className="emergency-contact">
              <p>Need immediate assistance?</p>
              <a href="tel:+919565550142" className="emergency-btn">
                <FaPhone />
                Call Now: +91 9565550142
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
