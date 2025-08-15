import React, { useState, useRef, useEffect } from "react";
import "../ComponentCss/poster.css";

const Poster   = () => {
  // Array of all images for horizontal carousel with scores
  const images = [
    { src: "/src/assets/luffy.jpg", score: 4.8 },
    { src: "/src/assets/413842.jpg", score: 4.5 },
    { src: "/src/assets/12345.avif", score: 4.9 },
    { src: "/src/assets/123.jpg", score: 4.2 },
    { src: "/src/assets/luffy.jpg", score: 4.7 },
    { src: "/src/assets/413842.jpg", score: 4.6 },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const carouselRef = useRef(null);
  const startX = useRef(0);
  const currentX = useRef(0);
  const isDragging = useRef(false);
  const startTime = useRef(0);

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
              <linearGradient id={`half-${i}`}>
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill={`url(#half-${i})`}
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
      <div className="score-container">
        <div className="dons">{dons}</div>
        <span className="score-text">{score.toFixed(1)}</span>
      </div>
    );
  };

  // Handle swipe/drag start
  const handleStart = (clientX) => {
    startX.current = clientX;
    currentX.current = clientX;
    isDragging.current = true;
    startTime.current = Date.now();

    if (carouselRef.current) {
      carouselRef.current.style.transition = "none";
    }
  };

  // Handle swipe/drag move
  const handleMove = (clientX) => {
    if (!isDragging.current) return;

    currentX.current = clientX;
    const diffX = currentX.current - startX.current;
    const maxDiff = window.innerWidth * 0.5;
    const constrainedDiff = Math.max(-maxDiff, Math.min(maxDiff, diffX));

    if (carouselRef.current) {
      const cardWidth = 300; // Updated width for larger cards
      const translateX = -currentIndex * cardWidth + constrainedDiff;
      carouselRef.current.style.transform = `translateX(${translateX}px)`;
    }
  };

  // Handle swipe/drag end
  const handleEnd = (clientX) => {
    if (!isDragging.current) return;

    const endTime = Date.now();
    const timeDiff = endTime - startTime.current;
    const diffX = clientX - startX.current;
    const velocity = Math.abs(diffX) / timeDiff;

    // Determine if swipe should trigger slide change
    const shouldSlide = Math.abs(diffX) > 80 || velocity > 0.5;

    if (shouldSlide && !isTransitioning) {
      setIsTransitioning(true);
      if (diffX > 0) {
        // Swipe right - go to previous
        setCurrentIndex((prev) => Math.max(0, prev - 1));
      } else {
        // Swipe left - go to next
        setCurrentIndex((prev) => Math.min(images.length - 2, prev + 1));
      }
      setTimeout(() => setIsTransitioning(false), 400);
    }

    // Reset carousel position
    if (carouselRef.current) {
      carouselRef.current.style.transition =
        "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
      const cardWidth = 300;
      carouselRef.current.style.transform = `translateX(${
        -currentIndex * cardWidth
      }px)`;
    }

    isDragging.current = false;
  };

  // Touch and mouse event handlers
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const touchStart = (e) => {
      e.preventDefault();
      handleStart(e.touches[0].clientX);
    };

    const touchMove = (e) => {
      e.preventDefault();
      handleMove(e.touches[0].clientX);
    };

    const touchEnd = (e) => {
      e.preventDefault();
      handleEnd(e.changedTouches[0].clientX);
    };

    const mouseDown = (e) => {
      e.preventDefault();
      handleStart(e.clientX);
    };

    const mouseMove = (e) => {
      e.preventDefault();
      if (isDragging.current) {
        handleMove(e.clientX);
      }
    };

    const mouseUp = (e) => {
      e.preventDefault();
      handleEnd(e.clientX);
    };

    const mouseLeave = () => {
      if (isDragging.current) {
        handleEnd(currentX.current);
      }
    };

    // Add event listeners
    carousel.addEventListener("touchstart", touchStart, { passive: false });
    carousel.addEventListener("touchmove", touchMove, { passive: false });
    carousel.addEventListener("touchend", touchEnd, { passive: false });
    carousel.addEventListener("mousedown", mouseDown);
    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup", mouseUp);
    carousel.addEventListener("mouseleave", mouseLeave);
    carousel.addEventListener("contextmenu", (e) => e.preventDefault());

    return () => {
      carousel.removeEventListener("touchstart", touchStart);
      carousel.removeEventListener("touchmove", touchMove);
      carousel.removeEventListener("touchend", touchEnd);
      carousel.removeEventListener("mousedown", mouseDown);
      document.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("mouseup", mouseUp);
      carousel.removeEventListener("mouseleave", mouseLeave);
      carousel.removeEventListener("contextmenu", (e) => e.preventDefault());
    };
  }, [currentIndex, images.length]);

  return (
    <section className="badge-section">
      <div className="badge-container">
        <div className="badge-content-wrapper">
          {/* Left Side */}
          <div className="badge-left-content">
            <div className="badge-logo-container">
              <img
                src="/src/assets/logo.png"
                alt="Company Logo"
                className="badge-logo"
              />
            </div>

            <div className="badge-description">
              <h2>Premium Quality Services with Excellence</h2>
              <p>
                We deliver outstanding construction solutions with commitment to
                quality, innovation, and customer satisfaction. Our team of
                experts ensures every project meets the highest standards.
              </p>
            </div>

            <div className="badge-icons-container">
              <div className="badge-icon-item">
                <div className="badge-icon badge-icon-quality">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M9 12l2 2 4-4" />
                    <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3" />
                    <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3" />
                    <path d="M12 3c0 1-1 3-3 3s-3-2-3-3 1-3 3-3 3 2 3 3" />
                    <path d="M12 21c0-1-1-3-3-3s-3 2-3 3 1 3 3 3 3-2 3-3" />
                  </svg>
                </div>
                <span>Quality</span>
              </div>

              <div className="badge-icon-item">
                <div className="badge-icon badge-icon-support">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <span>Support</span>
              </div>

              <div className="badge-icon-item">
                <div className="badge-icon badge-icon-delivery">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M16 3h5v5" />
                    <path d="M8 3H3v5" />
                    <path d="M12 22V8" />
                    <path d="M3 7l4.5-4.5" />
                    <path d="m21.5 2.5L16 8" />
                  </svg>
                </div>
                <span>Fast Service</span>
              </div>

              <div className="badge-icon-item">
                <div className="badge-icon badge-icon-guarantee">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <circle cx="12" cy="12" r="4" />
                  </svg>
                </div>
                <span>Guarantee</span>
              </div>
            </div>
          </div>

          {/* Right Side - Card-based Horizontal Carousel */}
          <div className="badge-right-content">
            <div className="badge-carousel-container">
              <div className="badge-carousel-header">
                <h3>Our Projects</h3>
              </div>

              <div className="badge-cards-container">
                <div
                  className="badge-cards-track"
                  ref={carouselRef}
                  style={{
                    transform: `translateX(${-currentIndex * 300}px)`,
                    transition: isDragging.current
                      ? "none"
                      : "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  }}
                >
                  {images.map((item, idx) => (
                    <div key={idx} className="badge-card">
                      <div className="badge-card-image">
                        <img
                          src={item.src}
                          alt={`Project ${idx + 1}`}
                          draggable={false}
                        />
                      </div>
                      <div className="badge-card-content">
                        <h4>Project {idx + 1}</h4>
                        <p>
                          Professional construction work with modern techniques
                          and quality materials
                        </p>
                        <DonScore score={item.score} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Poster;
