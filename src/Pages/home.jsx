import React, { useState, useEffect } from "react";
import ImageSlider from "./imageslider";
import { CButton } from "@coreui/react";
import ContactForm from "./contactform";
import HPSProductCard from './productCard';
import "../style/home.css";

const Home = () => {
  const heroImages = [
    {
      url: "/src/assets/luffy.jpg",
      alt: "HPS Constructions - Bamboo Solutions",
      title: "Sustainable Bamboo Construction",
    },
    {
      url: "/src/assets/413842.jpg",
      alt: "HPS Constructions - POP Services", 
      title: "Professional POP Solutions",
    },
    {
      url: "/src/assets/12345.avif",
      alt: "HPS Constructions - Modern Interiors",
      title: "Modern Interior Design",
    },
    {
      url: "/src/assets/123.jpg",
      alt: "HPS Constructions - Expert Services",
      title: "Expert Construction Services",
    },
  ];

  const products = [
    {
      id: 1,
      title: "Bamboo Solutions",
      description: "Sustainable bamboo construction materials for eco-friendly and durable buildings that stand the test of time.",
      price: 599,
      unit: "piece",
      rating: 4.8,
      imageUrl: "./src/assets/luffy.jpg"
    },
    {
      id: 2,
      title: "POP Services", 
      description: "Professional Plaster of Paris solutions for modern interiors with artistic designs and precision finishing.",
      price: 399,
      unit: "sq ft",
      rating: 4.6,
      imageUrl: "./src/assets/413842.jpg"
    },
    {
      id: 3,
      title: "Expert Consultation",
      description: "Get professional advice and customized solutions for your construction projects from our experienced team.",
      price: 2999,
      unit: "session", 
      rating: 5.0,
      imageUrl: "./src/assets/12345.avif"
    },
    {
      id: 4,
      title: "Interior Design",
      description: "Complete interior design solutions with modern aesthetics and functional layouts for residential and commercial spaces.",
      price: 1599,
      unit: "room",
      rating: 4.7,
      imageUrl: "./src/assets/123.jpg"
    }
  ];

  // HUMAN INTERACTIONS EFFECT
  useEffect(() => {
    const cards = document.querySelectorAll('.hps-card');
    const carousel = document.querySelector('.infinite-carousel');

    // Mouse movement tracking for interactive effects
    const handleMouseMove = (e, card) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Update CSS custom properties for mouse-following effects
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
      card.style.setProperty('--cursor-x', `${(x / rect.width) * 100}%`);
      
      // Image parallax effect
      const img = card.querySelector('.card-image img');
      if (img) {
        const moveX = (x - centerX) / 20;
        const moveY = (y - centerY) / 20;
        img.style.setProperty('--img-x', `${moveX}px`);
        img.style.setProperty('--img-y', `${moveY}px`);
      }
    };

    // Touch interaction for mobile
    const handleTouch = (e, card) => {
      const touch = e.touches[0];
      const rect = card.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    };

    // Apply interactions to each card
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => handleMouseMove(e, card));
      card.addEventListener('touchmove', (e) => handleTouch(e, card));
      
      card.addEventListener('mouseleave', () => {
        card.style.removeProperty('--mouse-x');
        card.style.removeProperty('--mouse-y');
        card.style.removeProperty('--cursor-x');
        card.style.removeProperty('--img-x');
        card.style.removeProperty('--img-y');
      });
    });

    // Carousel drag functionality
    let isDown = false;
    let startX;
    let scrollLeft;

    if (carousel) {
      carousel.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
      });

      carousel.addEventListener('mouseleave', () => {
        isDown = false;
      });

      carousel.addEventListener('mouseup', () => {
        isDown = false;
      });

      carousel.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2;
        carousel.scrollLeft = scrollLeft - walk;
      });
    }

    // Cleanup function
    return () => {
      cards.forEach(card => {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('touchmove', handleTouch);
      });
    };
  }, []);

  return (
    <main className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <ImageSlider
            images={heroImages}
            autoSlide={true}
            slideInterval={8000}
            showDots={true}
            showArrows={false}
            showProgressBar={false}
            height="500px"
            className="hero-slider"
            onSlideChange={(index) => console.log("Slide changed to:", index)}
          />
        </div>
        <hr className="section-divider" />
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
                onClick={() => console.log("Explore products")}
              >
                Explore Our Products
              </CButton>
            </div>

            {/* INFINITE HORIZONTAL CAROUSEL */}
            <div className="infinite-carousel">
              <div className="carousel-track">
                {/* Triple the products for infinite effect */}
                {[...products, ...products, ...products].map((product, index) => (
                  <div key={`${product.id}-${index}`} className="carousel-item">
                    <HPSProductCard
                      title={product.title}
                      description={product.description}
                      price={product.price}
                      unit={product.unit}
                      rating={product.rating}
                      imageUrl={product.imageUrl}
                      onShare={() => console.log(`Shared: ${product.title}`)}
                      onLearnMore={() => console.log(`Learn more: ${product.title}`)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <ContactForm />
    </main>
  );
};

export default Home;
