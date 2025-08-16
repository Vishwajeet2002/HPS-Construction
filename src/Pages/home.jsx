import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CButton } from "@coreui/react";
import ContactForm from "../Components/queryForm";
import ProductCard from "../Components/productCard";
import Poster from "../Components/poster";
import CustomerReview from "../Components/CustomerReview";
import Footer from "./footer";
import ImageSlider from "../Components/imageSlider";
import "../Style/Home.css";

const Home = () => {
  const navigate = useNavigate();

  const products = [
    { id: 1, title: "Bamboo Solutions", description: "Sustainable bamboo construction materials for eco-friendly and durable buildings that stand the test of time.", price: 599, unit: "piece", rating: 4.8, imageUrl: "/images/luffy.jpg" },
    { id: 2, title: "POP Services", description: "Professional Plaster of Paris solutions for modern interiors with artistic designs and precision finishing.", price: 399, unit: "sq ft", rating: 4.6, imageUrl: "/images/413842.jpg" },
    { id: 3, title: "Expert Consultation", description: "Get professional advice and customized solutions for your construction projects from our experienced team.", price: 2999, unit: "session", rating: 5.0, imageUrl: "/images/12345.avif" },
    { id: 4, title: "Interior Design", description: "Complete interior design solutions with modern aesthetics and functional layouts for residential and commercial spaces.", price: 1599, unit: "room", rating: 4.7, imageUrl: "/images/123.jpg" }
  ];

  useEffect(() => {
    // ...your existing interaction logic...
  }, []);

  return (
    <main className="home-container">
      {/* Hero Section with ImageSlider and text overlay */}
      <section className="hero-section hero-section--with-slider">
        <div
          className="hero-slider-wrapper"
          style={{ cursor: "pointer" }}
          tabIndex={0}
          onClick={() => navigate("/products")}
        >
          <ImageSlider />
          <div className="hero-overlay">
            <div className="hero-text-container">
              <h1 className="hero-title">HPS Construction</h1>
              <p className="hero-description">
                Professional bamboo and POP solutions for modern construction needs.<br/>
                Quality craftsmanship with sustainable materials for residential and commercial projects.
              </p>
              <div className="hero-actions">
                <button
                  className="hero-cta-button"
                  onClick={() => navigate("/products")}
                >
                  Get Started Today
                </button>
              </div>
            </div>
          </div>
        </div>
        <hr />
      </section>

      {/* Products Section */}
      <div className="content-wrapper">
        <section className="features-section">
          <div className="container">
            <header className="section-header">
              <h2>Our Premium Products</h2>
              <p className="section-description">
                Discover our range of sustainable construction solutions crafted with expertise and innovation
              </p>
            </header>
            <div className="button-container">
              <CButton
                color="primary"
                size="lg"
                className="explore-button"
                onClick={() => navigate("/products")}
              >
                Explore Our Products
              </CButton>
            </div>
            {/* INFINITE HORIZONTAL CAROUSEL */}
            <div className="infinite-carousel">
              <div className="carousel-track">
                {[...products, ...products, ...products].map(
                  (product, index) => (
                    <div key={`${product.id}-${index}`} className="carousel-item">
                      <ProductCard
                        title={product.title}
                        description={product.description}
                        price={product.price}
                        unit={product.unit}
                        rating={product.rating}
                        imageUrl={product.imageUrl}
                        onShare={() => console.log(`Shared: ${product.title}`)}
                        onLearnMore={() => navigate("/products")}
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Contact Form */}
      <ContactForm />
      <hr />

      {/* Badge (About Services) */}
      <Poster />
      <hr />

      {/* Customer Reviews */}
      <CustomerReview />
      <hr />

      {/* Footer */}
      <Footer />
    </main>
  );
};

export default Home;
