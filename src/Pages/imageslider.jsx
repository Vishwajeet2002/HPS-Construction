import React, { useState, useEffect, useCallback, useRef } from 'react';
import '../Style/imageslider.css';

const ImageSlider = ({ 
  images = [], 
  autoSlide = true, 
  slideInterval = 8000, // Made slower (8 seconds instead of 5)
  showDots = true,
  showArrows = false, // Disabled arrows
  showProgressBar = true,
  height = "500px",
  className = "",
  onSlideChange = () => {}
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(autoSlide);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageLoadStates, setImageLoadStates] = useState({});
  
  const progressRef = useRef(null);
  const intervalRef = useRef(null);
  const sliderRef = useRef(null);

  // Premium sample images
  const defaultImages = [
    {
      url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&h=800&fit=crop&crop=faces',
      alt: 'Modern office workspace',
      title: 'Professional Environment'
    },
    {
      url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1920&h=800&fit=crop&crop=faces',
      alt: 'Team collaboration',
      title: 'Innovation & Teamwork'
    },
    {
      url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1920&h=800&fit=crop&crop=faces',
      alt: 'Business meeting',
      title: 'Strategic Planning'
    },
    {
      url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=800&fit=crop&crop=faces',
      alt: 'Modern workspace',
      title: 'Growth & Success'
    }
  ];

  const slideImages = images.length > 0 ? images : defaultImages;

  // Navigation functions
  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    const newIndex = currentIndex === slideImages.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    onSlideChange(newIndex);
    
    setTimeout(() => setIsTransitioning(false), 500); // Slightly longer transition
  }, [currentIndex, slideImages.length, isTransitioning, onSlideChange]);

  const goToSlide = useCallback((index) => {
    if (index === currentIndex || isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex(index);
    onSlideChange(index);
    
    setTimeout(() => setIsTransitioning(false), 500);
  }, [currentIndex, isTransitioning, onSlideChange]);

  // Auto-slide functionality (always enabled, no play/pause)
  useEffect(() => {
    if (slideImages.length > 1) {
      intervalRef.current = setInterval(nextSlide, slideInterval);
      return () => clearInterval(intervalRef.current);
    }
  }, [slideInterval, nextSlide, slideImages.length]);

  // Progress bar animation
  useEffect(() => {
    if (progressRef.current && slideImages.length > 1) {
      progressRef.current.style.animation = 'none';
      progressRef.current.offsetHeight; // Trigger reflow
      progressRef.current.style.animation = `progressFlow ${slideInterval}ms linear`;
    }
  }, [currentIndex, slideInterval, slideImages.length]);

  // Image loading handler
  const handleImageLoad = (index) => {
    setImageLoadStates(prev => ({ ...prev, [index]: 'loaded' }));
  };

  const handleImageError = (index) => {
    setImageLoadStates(prev => ({ ...prev, [index]: 'error' }));
  };

  // Touch/swipe support
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) nextSlide();
    // Removed right swipe for previous slide since no arrows
  };

  if (slideImages.length === 0) {
    return (
      <div className={`image-slider ${className}`} style={{ height }}>
        <div className="slider-container">
          <div className="no-images">
            <div className="no-images-content">
              <div className="no-images-icon">🖼️</div>
              <h3>No Images Available</h3>
              <p>Please provide images to display in the slider</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`image-slider ${className}`}
      style={{ height }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      role="region"
      aria-label="Image carousel"
      ref={sliderRef}
    >
      <div className="slider-container">
        {/* Main slides */}
        <div className="slides-wrapper">
          {slideImages.map((slide, index) => {
            const imageUrl = typeof slide === 'string' ? slide : slide.url;
            const imageAlt = typeof slide === 'object' ? slide.alt : `Slide ${index + 1}`;
            const imageTitle = typeof slide === 'object' ? slide.title : '';
            
            return (
              <div
                key={`slide-${index}`}
                className={`slide ${index === currentIndex ? 'active' : ''} ${
                  Math.abs(index - currentIndex) === 1 ? 'adjacent' : 'distant'
                }`}
                style={{ 
                  transform: `translateX(${(index - currentIndex) * 100}%)`,
                  zIndex: index === currentIndex ? 2 : 1
                }}
                aria-hidden={index !== currentIndex}
              >
                <div className="image-container">
                  <img
                    src={imageUrl}
                    alt={imageAlt}
                    className={`slide-image ${imageLoadStates[index] || 'loading'}`}
                    loading={index === 0 ? "eager" : "lazy"}
                    onLoad={() => handleImageLoad(index)}
                    onError={() => handleImageError(index)}
                  />
                  
                  {/* Image overlay with gradient */}
                  <div className="image-overlay" />
                  
                  {/* Image title overlay */}
                  {imageTitle && index === currentIndex && (
                    <div className="slide-content">
                      <h3 className="slide-title">{imageTitle}</h3>
                    </div>
                  )}
                  
                  {/* Loading spinner */}
                  {imageLoadStates[index] === 'loading' && (
                    <div className="loading-spinner">
                      <div className="spinner"></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Dots navigation */}
        {showDots && slideImages.length > 1 && (
          <div className="dots-container">
            <div className="dots-wrapper">
              {slideImages.map((_, index) => (
                <button
                  key={`dot-${index}`}
                  onClick={() => goToSlide(index)}
                  className={`dot ${index === currentIndex ? 'active' : ''}`}
                  disabled={isTransitioning}
                  aria-label={`Go to slide ${index + 1} of ${slideImages.length}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Progress bar */}
      {showProgressBar && autoSlide && slideImages.length > 1 && (
        <div className="progress-container">
          <div 
            ref={progressRef}
            className="progress-bar"
            role="progressbar"
            aria-valuenow={currentIndex + 1}
            aria-valuemin={1}
            aria-valuemax={slideImages.length}
          />
        </div>
      )}

      {/* Screen reader announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Showing slide {currentIndex + 1} of {slideImages.length}
      </div>
    </div>
  );
};

export default ImageSlider;
