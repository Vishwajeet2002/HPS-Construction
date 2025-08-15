import React, { useState, useRef, useEffect } from "react";
import "../ComponentCss/CustomerReview.css";

// Import all customer images
// import customer1 from "../assets/customer1.jpg";
// import customer2 from "../assets/customer2.jpg";
// import customer3 from "../assets/customer3.jpg";
// import customer4 from "../assets/customer4.jpg";
// import customer5 from "../assets/customer5.jpg";

// If you don't have these images yet, you can also import any existing images
import luffyImg from "../assets/luffy.jpg";
import img413842 from "../assets/413842.jpg";
import img12345 from "../assets/12345.avif";
import img123 from "../assets/123.jpg";

const CustomerReview = () => {
  // Array of customer reviews with imported images
  const reviews = [
    {
      id: 1,
      name: "Michael Tan",
      company: "EcoStruct Builders",
      location: "Singapore",
      avatar: luffyImg, // Using imported image
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
      avatar: img413842, // Using imported image
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
      avatar: img12345, // Using imported image
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
      avatar: img123, // Using imported image
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
      avatar: img413842, // Using imported image
      email: "@urbandev.kr",
      review:
        "Exceptional service and premium quality materials. Their bamboo products have transformed our construction projects. Highly recommend for anyone looking for sustainable building solutions.",
      score: 4.9,
      verified: true,
    },
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

  // Handle swipe functionality
  const handleStart = (clientX) => {
    startX.current = clientX;
    currentX.current = clientX;
    isDragging.current = true;
    startTime.current = Date.now();

    if (carouselRef.current) {
      carouselRef.current.style.transition = "none";
    }
  };

  const handleMove = (clientX) => {
    if (!isDragging.current) return;

    currentX.current = clientX;
    const diffX = currentX.current - startX.current;
    const maxDiff = window.innerWidth * 0.5;
    const constrainedDiff = Math.max(-maxDiff, Math.min(maxDiff, diffX));

    if (carouselRef.current) {
      const cardWidth = 480;
      const translateX = -currentIndex * cardWidth + constrainedDiff;
      carouselRef.current.style.transform = `translateX(${translateX}px)`;
    }
  };

  const handleEnd = (clientX) => {
    if (!isDragging.current) return;

    const endTime = Date.now();
    const timeDiff = endTime - startTime.current;
    const diffX = clientX - startX.current;
    const velocity = Math.abs(diffX) / timeDiff;

    const shouldSlide = Math.abs(diffX) > 80 || velocity > 0.5;

    if (shouldSlide && !isTransitioning) {
      setIsTransitioning(true);
      if (diffX > 0) {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
      } else {
        setCurrentIndex((prev) => Math.min(reviews.length - 1, prev + 1));
      }
      setTimeout(() => setIsTransitioning(false), 400);
    }

    if (carouselRef.current) {
      carouselRef.current.style.transition =
        "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
      const cardWidth = 480;
      carouselRef.current.style.transform = `translateX(${
        -currentIndex * cardWidth
      }px)`;
    }

    isDragging.current = false;
  };

  // Event handlers
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
  }, [currentIndex, reviews.length]);

  return (
    <section className="customer-review-section">
      <div className="customer-review-container">
        <div className="customer-review-header">
          <h2>Honest Reviews</h2>
        </div>

        <div className="customer-review-carousel">
          <div className="customer-review-cards-container">
            <div
              className="customer-review-cards-track"
              ref={carouselRef}
              style={{
                transform: `translateX(${-currentIndex * 480}px)`,
                transition: isDragging.current
                  ? "none"
                  : "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              }}
            >
              {reviews.map((review) => (
                <div key={review.id} className="customer-review-card">
                  <div className="review-header">
                    <div className="customer-avatar-container">
                      <div className="customer-avatar">
                        <img
                          src={review.avatar}
                          alt={review.name}
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              review.name
                            )}&background=3b82f6&color=fff&size=80&rounded=true`;
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
