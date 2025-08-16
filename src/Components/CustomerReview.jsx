import React, { useRef } from "react";
import "../ComponentCss/CustomerReview.css";

// Customer avatars
import luffyImg from "/images/luffy.jpg";
import img413842 from "/images/413842.jpg";
import img12345 from "/images/12345.avif";
import img123 from "/images/123.jpg";

const CustomerReview = () => {
  const reviews = [
    {
      id: 1,
      name: "Michael Tan",
      company: "EcoStruct Builders",
      location: "Singapore",
      avatar: luffyImg,
      email: "@ecostruct.sg",
      review: "I've been sourcing bamboo from this team for years and every shipment has been flawless. Service is top-notch, and the customer service is responsive and professional. Highly recommended for any large-scale eco-construction projects.",
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
      review: "Their bamboo panels added such a natural charm to our eco-resort. What impressed us the most was their dedication to sustainability and detail. Truly a reliable partner for green design needs.",
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
      review: "Consistent quality and excellent service delivery. We've been working with them for over 2 years now and their reliability and customer support is unmatched. Professional and efficient team for large-scale construction projects.",
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
      review: "Outstanding bamboo quality and timely delivery. The team goes above and beyond to ensure customer satisfaction. Their eco-friendly approach aligns perfectly with our sustainability goals.",
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
      review: "Exceptional service and premium quality materials. Their bamboo products have transformed our construction projects. Highly recommend for anyone looking for sustainable building solutions.",
      score: 4.9,
      verified: true,
    },
  ];

  // Duplicate reviews for infinite scroll effect
  const infiniteReviews = [...reviews, ...reviews, ...reviews, ...reviews];

  const containerRef = useRef(null);

  // Star rating component
  const DonScore = ({ score }) => {
    const dons = [];
    const fullDons = Math.floor(score);
    const hasHalfDon = score % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullDons) {
        dons.push(<span key={i} className="don filled">★</span>);
      } else if (i === fullDons && hasHalfDon) {
        dons.push(<span key={i} className="don half-filled">★</span>);
      } else {
        dons.push(<span key={i} className="don empty">★</span>);
      }
    }

    return (
      <div className="review-score-container">
        <div className="review-dons">{dons}</div>
      </div>
    );
  };

  return (
    <section className="customer-review-section">
      <div className="customer-review-container" ref={containerRef}>
        <div className="customer-review-header">
          <h2>Honest Reviews</h2>
        </div>

        <div className="customer-review-carousel">
          <div className="customer-review-cards-container">
            <div className="customer-review-cards-track">
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
                          <span className="verified-badge">✔ Verified</span>
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
