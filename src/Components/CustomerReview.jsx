import React, { useState, useRef, useEffect, useCallback } from "react";
import "../ComponentCss/CustomerReview.css";

// Import all customer images
import luffyImg from "../assets/luffy.jpg";
import img413842 from "../assets/413842.jpg";
import img12345 from "../assets/12345.avif";
import img123 from "../assets/123.jpg";

const CustomerReview = () => {
  const reviews = [
    {
      id: 1,
      name: "Michael Tan",
      company: "EcoStruct Builders",
      location: "Singapore",
      avatar: luffyImg,
      email: "@ecostruct.sg",
      review:
        "I sourcing bamboo from this team for years and every shipment has been flawless. Service is top-notch, and the customer service is responsive and professional. Highly recommended for any large-scale eco-construction projects.",
      score: 4.2,
      verified: true,
    },
    {
      id: 2,
      name: "Anita Sharma",
      company: "Green Interiors",
      location: "India",
      avatar: img413842,
      email: "anita.sharma@greeninteriors.in",
      review:
        "Their bamboo panels added such a natural charm to our eco-resort. What impressed us the most was their dedication to sustainability and detail. Truly a reliable partner for green design needs.",
      score: 4.8,
      verified: true,
    },
    {
      id: 3,
      name: "Carlos Rodriguez",
      company: "Modern Constructions",
      location: "Brazil",
      avatar: img12345,
      email: "@carlosdesign",
      review:
        "Consistent quality and excellent service delivery. We've been working with them for over 2 years now and their reliability and customer support is unmatched. Professional and efficient team for large-scale construction projects.",
      score: 4.6,
      verified: true,
    },
    {
      id: 4,
      name: "Sarah Johnson",
      company: "Sustainable Homes",
      location: "USA",
      avatar: img123,
      email: "@sustainablehomes",
      review:
        "Outstanding bamboo quality and timely delivery. The team goes above and beyond to ensure customer satisfaction. Their eco-friendly approach aligns perfectly with our sustainability goals.",
      score: 4.7,
      verified: true,
    },
    {
      id: 5,
      name: "David Kim",
      company: "Urban Developers",
      location: "South Korea",
      avatar: img413842,
      email: "@urbandev.kr",
      review:
        "Exceptional service and premium quality materials. Their bamboo products have transformed our construction projects. Highly recommend for anyone looking for sustainable building solutions.",
      score: 4.9,
      verified: true,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(reviews.length); // Start from first real card
  const [cardWidth, setCardWidth] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const carouselRef = useRef(null);
  const containerRef = useRef(null);
  const startX = useRef(0);
  const isDragging = useRef(false);
  const hasMoved = useRef(false);

  // Create infinite loop array (original + clones on both sides)
  const infiniteReviews = [
    ...reviews, // Clone at start (for seamless previous)
    ...reviews, // Original array
    ...reviews  // Clone at end (for seamless next)
  ];

  // Calculate responsive values
  const calculateDimensions = useCallback(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const firstCard = container.querySelector('.customer-review-card');
    
    if (firstCard) {
      const cardStyle = window.getComputedStyle(firstCard);
      const gap = parseFloat(cardStyle.marginRight || 0);
      const newCardWidth = firstCard.offsetWidth + gap;
      setCardWidth(newCardWidth);
      
      // Calculate cards to show based on screen size
      const screenWidth = window.innerWidth;
      let newCardsToShow = 1;
      
      if (screenWidth >= 1400) newCardsToShow = 3;
      else if (screenWidth >= 1024) newCardsToShow = 2;
      else if (screenWidth >= 768) newCardsToShow = 2;
      else newCardsToShow = 1;
      
      setCardsToShow(Math.min(newCardsToShow, reviews.length));
    }
  }, [reviews.length]);

  // Don Score Component
  const DonScore = ({ score }) => {
    const dons = [];
    const fullDons = Math.floor(score);
    const hasHalfDon = score % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullDons) {
        dons.push(
          <svg
            key={i}
            className="don filled"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        );
      } else if (i === fullDons && hasHalfDon) {
        dons.push(
          <svg key={i} className="don half-filled" viewBox="0 0 24 24">
            <defs>
              <linearGradient id={`review-half-${i}`}>
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill={`url(#review-half-${i})`}
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
        );
      } else {
        dons.push(
          <svg
            key={i}
            className="don empty"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        );
      }
    }

    return (
      <div className="review-score-container">
        <div className="review-dons">{dons}</div>
      </div>
    );
  };

  // Handle infinite loop transitions
  const handleInfiniteLoop = useCallback(() => {
    if (!cardWidth || isTransitioning) return;

    const totalCards = infiniteReviews.length;
    const originalLength = reviews.length;
    
    // If we're at the cloned cards at the end, jump to the beginning
    if (currentIndex >= originalLength * 2) {
      setIsTransitioning(true);
      setTimeout(() => {
        if (carouselRef.current) {
          carouselRef.current.style.transition = "none";
          setCurrentIndex(originalLength);
          setTimeout(() => {
            if (carouselRef.current) {
              carouselRef.current.style.transition = "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
            }
            setIsTransitioning(false);
          }, 50);
        }
      }, 400);
    }
    
    // If we're at the cloned cards at the beginning, jump to the end
    if (currentIndex < originalLength) {
      setIsTransitioning(true);
      setTimeout(() => {
        if (carouselRef.current) {
          carouselRef.current.style.transition = "none";
          setCurrentIndex(originalLength + currentIndex);
          setTimeout(() => {
            if (carouselRef.current) {
              carouselRef.current.style.transition = "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
            }
            setIsTransitioning(false);
          }, 50);
        }
      }, 400);
    }
  }, [currentIndex, cardWidth, isTransitioning, reviews.length, infiniteReviews.length]);

  // Slide to specific index
  const slideToIndex = useCallback((index) => {
    if (isTransitioning) return;
    setCurrentIndex(index);
  }, [isTransitioning]);

  // Auto-slide functionality (optional)
  useEffect(() => {
    const autoSlide = setInterval(() => {
      if (!isDragging.current && !isTransitioning) {
        setCurrentIndex(prev => prev + 1);
      }
    }, 4000); // Auto-slide every 4 seconds

    return () => clearInterval(autoSlide);
  }, [isTransitioning]);

  // Handle infinite loop when currentIndex changes
  useEffect(() => {
    if (!isTransitioning) {
      const timer = setTimeout(() => {
        handleInfiniteLoop();
      }, 450); // Wait for transition to complete

      return () => clearTimeout(timer);
    }
  }, [currentIndex, handleInfiniteLoop, isTransitioning]);

  // Handle swipe/drag
  const handleStart = (clientX, e) => {
    e.preventDefault();
    startX.current = clientX;
    isDragging.current = true;
    hasMoved.current = false;

    if (carouselRef.current) {
      carouselRef.current.style.transition = "none";
      carouselRef.current.style.cursor = "grabbing";
    }
  };

  const handleMove = (clientX, e) => {
    if (!isDragging.current || !cardWidth) return;
    
    e.preventDefault();
    const diffX = clientX - startX.current;
    const maxDiff = window.innerWidth * 0.25;
    const constrainedDiff = Math.max(-maxDiff, Math.min(maxDiff, diffX));

    if (Math.abs(diffX) > 5) {
      hasMoved.current = true;
    }

    if (carouselRef.current) {
      const translateX = -currentIndex * cardWidth + constrainedDiff;
      carouselRef.current.style.transform = `translateX(${translateX}px)`;
    }
  };

  const handleEnd = (clientX, e) => {
    if (!isDragging.current || !cardWidth) return;
    
    e.preventDefault();
    const diffX = clientX - startX.current;
    const threshold = 80;
    const shouldSlide = Math.abs(diffX) > threshold;

    if (shouldSlide && !isTransitioning) {
      if (diffX > 0) {
        slideToIndex(currentIndex - 1);
      } else {
        slideToIndex(currentIndex + 1);
      }
    }

    if (carouselRef.current) {
      carouselRef.current.style.transition = "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
      carouselRef.current.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
      carouselRef.current.style.cursor = "grab";
    }

    isDragging.current = false;
  };

  const handleClick = (e) => {
    if (hasMoved.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Initialize and handle resize
  useEffect(() => {
    calculateDimensions();
    
    const handleResize = () => {
      calculateDimensions();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateDimensions]);

  // Update transform when cardWidth or currentIndex changes
  useEffect(() => {
    if (carouselRef.current && cardWidth && !isTransitioning) {
      const translateX = -currentIndex * cardWidth;
      carouselRef.current.style.transform = `translateX(${translateX}px)`;
    }
  }, [currentIndex, cardWidth, isTransitioning]);

  // Event handlers
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const touchStart = (e) => handleStart(e.touches[0].clientX, e);
    const touchMove = (e) => handleMove(e.touches.clientX, e);
    const touchEnd = (e) => handleEnd(e.changedTouches.clientX, e);

    const mouseDown = (e) => handleStart(e.clientX, e);
    const mouseMove = (e) => {
      if (isDragging.current) {
        handleMove(e.clientX, e);
      }
    };
    const mouseUp = (e) => handleEnd(e.clientX, e);
    const mouseLeave = (e) => {
      if (isDragging.current) {
        handleEnd(e.clientX, e);
      }
    };

    carousel.addEventListener("touchstart", touchStart, { passive: false });
    carousel.addEventListener("touchmove", touchMove, { passive: false });
    carousel.addEventListener("touchend", touchEnd, { passive: false });
    carousel.addEventListener("mousedown", mouseDown);
    carousel.addEventListener("mousemove", mouseMove);
    carousel.addEventListener("mouseup", mouseUp);
    carousel.addEventListener("mouseleave", mouseLeave);
    carousel.addEventListener("click", handleClick, true);
    carousel.addEventListener("contextmenu", (e) => e.preventDefault());

    const globalMouseMove = (e) => {
      if (isDragging.current) {
        handleMove(e.clientX, e);
      }
    };
    const globalMouseUp = (e) => {
      if (isDragging.current) {
        handleEnd(e.clientX, e);
      }
    };

    document.addEventListener("mousemove", globalMouseMove);
    document.addEventListener("mouseup", globalMouseUp);

    return () => {
      carousel.removeEventListener("touchstart", touchStart);
      carousel.removeEventListener("touchmove", touchMove);
      carousel.removeEventListener("touchend", touchEnd);
      carousel.removeEventListener("mousedown", mouseDown);
      carousel.removeEventListener("mousemove", mouseMove);
      carousel.removeEventListener("mouseup", mouseUp);
      carousel.removeEventListener("mouseleave", mouseLeave);
      carousel.removeEventListener("click", handleClick, true);
      carousel.removeEventListener("contextmenu", (e) => e.preventDefault());
      document.removeEventListener("mousemove", globalMouseMove);
      document.removeEventListener("mouseup", globalMouseUp);
    };
  }, [cardWidth]);

  return (
    <section className="customer-review-section">
      <div className="customer-review-container" ref={containerRef}>
        <div className="customer-review-header">
          <h2>Honest Reviews</h2>
        </div>

        <div className="customer-review-carousel">
          <div className="customer-review-cards-container">
            <div
              className="customer-review-cards-track"
              ref={carouselRef}
              style={{
                transform: `translateX(${-currentIndex * cardWidth}px)`,
                transition: isDragging.current || isTransitioning
                  ? "none"
                  : "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                cursor: isDragging.current ? "grabbing" : "grab",
              }}
            >
              {infiniteReviews.map((review, index) => (
                <div 
                  key={`${review.id}-${Math.floor(index / reviews.length)}`} 
                  className="customer-review-card"
                >
                  <div className="review-header">
                    <div className="customer-avatar-container">
                      <div className="customer-avatar">
                        <img
                          src={review.avatar}
                          alt={review.name}
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              review.name
                            )}&background=233528&color=fff&size=80&rounded=true`;
                          }}
                        />
                      </div>
                    </div>

                    <div className="customer-info">
                      <div className="customer-name-section">
                        <h4 className="customer-name">{review.name}</h4>
                        {review.verified && (
                          <span className="verified-badge">
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="customer-company">
                        {review.company}, {review.location}
                      </p>
                      <div className="customer-contact">
                        <span className="customer-email">{review.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="review-content">
                    <p className="review-text">{review.review}</p>
                    <div className="review-bottom">
                      <DonScore score={review.score} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerReview;
