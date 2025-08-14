import React, { useState } from 'react';
import '../style/Footer.css'; // Add custom CSS file

const Footer = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Newsletter subscription:', email);
        setEmail('');
    };

    return (
        <section className="footer-section">
            <div className="footer-container">
                <div className="footer-grid">
                    {/* Company Info */}
                    <div className="company-info">
                        <div className="logo-container">
                            <h2 className="company-logo">HBS Constructions</h2>
                        </div>

                        <p className="company-description">
                            Building sustainable futures with innovative bamboo and POP solutions. 
                            Your trusted partner for eco-friendly construction projects.
                        </p>

                        {/* Social Media Links */}
                        <ul className="social-links">
                            <li>
                                <a 
                                    href="https://twitter.com/hbsconstructions" 
                                    title="Twitter" 
                                    className="social-icon twitter"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19.633 7.997c.013.175.013.349.013.523 0 5.325-4.053 11.461-11.46 11.461-2.282 0-4.402-.661-6.186-1.809.324.037.636.05.973.05a8.07 8.07 0 0 0 5.001-1.721 4.036 4.036 0 0 1-3.767-2.793c.249.037.499.062.761.062.361 0 .724-.05 1.061-.137a4.027 4.027 0 0 1-3.23-3.953v-.05c.537.299 1.16.486 1.82.511a4.022 4.022 0 0 1-1.796-3.354c0-.748.199-1.434.548-2.032a11.457 11.457 0 0 0 8.306 4.215c-.062-.3-.1-.611-.1-.923a4.026 4.026 0 0 1 4.028-4.028c1.16 0 2.207.486 2.943 1.272a7.957 7.957 0 0 0 2.556-.973 4.02 4.02 0 0 1-1.771 2.22 8.073 8.073 0 0 0 2.319-.624 8.645 8.645 0 0 1-2.019 2.083z" />
                                    </svg>
                                </a>
                            </li>

                            <li>
                                <a 
                                    href="https://facebook.com/hbsconstructions" 
                                    title="Facebook" 
                                    className="social-icon facebook"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z" />
                                    </svg>
                                </a>
                            </li>

                            <li>
                                <a 
                                    href="https://instagram.com/hbsconstructions" 
                                    title="Instagram" 
                                    className="social-icon instagram"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M11.999 7.377a4.623 4.623 0 1 0 0 9.248 4.623 4.623 0 0 0 0-9.248zm0 7.627a3.004 3.004 0 1 1 0-6.008 3.004 3.004 0 0 1 0 6.008z" />
                                        <circle cx="16.806" cy="7.207" r="1.078" />
                                        <path d="M20.533 6.111A4.605 4.605 0 0 0 17.9 3.479a6.606 6.606 0 0 0-2.186-.42c-.963-.042-1.268-.054-3.71-.054s-2.755 0-3.71.054a6.554 6.554 0 0 0-2.184.42 4.6 4.6 0 0 0-2.633 2.632 6.585 6.585 0 0 0-.419 2.186c-.043.962-.056 1.267-.056 3.71 0 2.442 0 2.753.056 3.71.015.748.156 1.486.419 2.187a4.61 4.61 0 0 0 2.634 2.632 6.584 6.584 0 0 0 2.185.45c.963.042 1.268.055 3.71.055s2.755 0 3.71-.055a6.615 6.615 0 0 0 2.186-.419 4.613 4.613 0 0 0 2.633-2.633c.263-.7.404-1.438.419-2.186.043-.962.056-1.267.056-3.71s0-2.753-.056-3.71a6.581 6.581 0 0 0-.421-2.217zm-1.218 9.532a5.043 5.043 0 0 1-.311 1.688 2.987 2.987 0 0 1-1.712 1.711 4.985 4.985 0 0 1-1.67.311c-.95.044-1.218.055-3.654.055-2.438 0-2.687 0-3.655-.055a4.96 4.96 0 0 1-1.669-.311 2.985 2.985 0 0 1-1.719-1.711 5.08 5.08 0 0 1-.311-1.669c-.043-.95-.053-1.218-.053-3.654 0-2.437 0-2.686.053-3.655a5.038 5.038 0 0 1 .311-1.687c.305-.789.93-1.41 1.719-1.712a5.01 5.01 0 0 1 1.669-.311c.951-.043 1.218-.055 3.655-.055s2.687 0 3.654.055a4.96 4.96 0 0 1 1.67.311 2.991 2.991 0 0 1 1.712 1.712 5.08 5.08 0 0 1 .311 1.669c.043.951.054 1.218.054 3.655 0 2.436 0 2.698-.043 3.654h-.011z" />
                                    </svg>
                                </a>
                            </li>

                            <li>
                                <a 
                                    href="https://wa.me/919555633827" 
                                    title="WhatsApp" 
                                    className="social-icon whatsapp"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.488" />
                                    </svg>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div className="footer-column">
                        <h3 className="column-title">Company</h3>
                        <ul className="footer-links">
                            <li><a href="#about">About Us</a></li>
                            <li><a href="#services">Our Services</a></li>
                            <li><a href="#projects">Projects</a></li>
                            <li><a href="#careers">Careers</a></li>
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div className="footer-column">
                        <h3 className="column-title">Support</h3>
                        <ul className="footer-links">
                            <li><a href="#contact">Contact Us</a></li>
                            <li><a href="#consultation">Free Consultation</a></li>
                            <li><a href="#terms">Terms & Conditions</a></li>
                            <li><a href="#privacy">Privacy Policy</a></li>
                        </ul>
                    </div>

                    {/* Newsletter Section */}
                    <div className="newsletter-section">
                        <h3 className="column-title">Subscribe to Newsletter</h3>
                        <form onSubmit={handleSubmit} className="newsletter-form">
                            <div className="input-group">
                                <label htmlFor="email" className="sr-only">Email</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    id="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email" 
                                    className="email-input" 
                                    required
                                />
                            </div>
                            <button type="submit" className="subscribe-btn">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <hr className="footer-divider" />

                <p className="copyright">
                    © Copyright 2025, All Rights Reserved by HBS Constructions
                </p>
            </div>
        </section>
    );
};

export default Footer;
