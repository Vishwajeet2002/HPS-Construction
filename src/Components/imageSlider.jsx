import React, { useState, useEffect, useRef } from 'react';
import '../ComponentCss/imageslider.css';
// Import images and create aliases
import luffyImage from '/images/luffy.jpg';
import popServiceImage from '/images/413842.jpg';
import interiorDesignImage from '/images/12345.avif';
import consultationImage from '/images/123.jpg';


const ImageSlider = ({ 
  images = [], 
  autoSlide = true,
  slideInterval = 5000,
  showDots = false,
  showArrows = false,
  showProgressBar = false,
  height = "500px",
  className = "",
  onSlideChange = () => {}
}) => {
  const [imageLoadStates, setImageLoadStates] = useState({});
  const sliderRef = useRef(null);

  // HPS Construction business images
  const defaultImages = [
    {
      url: luffyImage,
      alt: 'HPS Construction - Sustainable Bamboo Solutions'
    },
    {
      url: popServiceImage,
      alt: 'HPS Construction - Professional POP Services'
    },
    {
      url: interiorDesignImage,
      alt: 'HPS Construction - Modern Interior Design'
    },
    {
      url: consultationImage,
      alt: 'HPS Construction - Expert Consultation'
    }
  ];

  const slideImages = images.length > 0 ? images : defaultImages;
  
  // Create seamless infinite slides (triple repetition for smooth loop)
  const infiniteSlides = [...slideImages, ...slideImages, ...slideImages];

  // Image loading handlers
  const handleImageLoad = (index) => {
    setImageLoadStates(prev => ({ ...prev, [index]: 'loaded' }));
  };

  const handleImageError = (index) => {
    setImageLoadStates(prev => ({ ...prev, [index]: 'error' }));
  };

  if (slideImages.length === 0) {
    return (
      <div className={`image-slider ${className}`} style={{ height }}>
        <div className="slider-container">
          <div className="no-images">
            <div className="no-images-content">
              <div className="no-images-icon">🏗️</div>
              <h3>HPS Construction Gallery</h3>
              <p>Showcasing our premium construction services</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`image-slider hps-construction-slider seamless-infinite ${className}`}
      style={{ height }}
      role="region"
      aria-label="HPS Construction Services Showcase"
      ref={sliderRef}
    >
      <div className="slider-container">
        {/* Seamless infinite slides wrapper */}
        <div className="slides-wrapper seamless-animation">
          {infiniteSlides.map((slide, index) => {
            const imageUrl = typeof slide === 'string' ? slide : slide.url;
            const imageAlt = typeof slide === 'object' ? slide.alt : `HPS Construction Service ${(index % slideImages.length) + 1}`;
            
            return (
              <div
                key={`seamless-slide-${index}`}
                className="slide"
              >
                <div className="image-container">
                  <img
                    src={imageUrl}
                    alt={imageAlt}
                    className={`slide-image ${imageLoadStates[index] || 'loading'}`}
                    loading="lazy"
                    onLoad={() => handleImageLoad(index)}
                    onError={() => handleImageError(index)}
                  />
                  
                  {/* Loading state */}
                  {imageLoadStates[index] === 'loading' && (
                    <div className="loading-spinner">
                      <div className="hps-spinner"></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Screen reader announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        HPS Construction Services - Image Gallery
      </div>
    </div>
  );
};

export default ImageSlider;
