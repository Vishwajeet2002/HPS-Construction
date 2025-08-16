import React from "react";
import { useNavigate } from "react-router-dom";
import "../ComponentCss/productCard.css";

export default function ProductCard({
  title = "Premium Bamboo Flooring",
  description = "High-quality bamboo flooring that combines durability with eco-friendly design for modern homes and commercial spaces.",
  price = 599,
  unit = "sq ft",
  rating = 4.8,
  imageUrl = "/images/luffy.jpg",
  onShare = () => console.log("Share clicked"),
  onLearnMore = () => console.log("Learn more clicked"),
}) {
  const navigate = useNavigate();

  const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <div className="rating-container">
        <div className="stars">
          {[...Array(5)].map((_, index) => (
            <span
              key={index}
              className={`star ${
                index < fullStars
                  ? "filled"
                  : index === fullStars && hasHalfStar
                  ? "half"
                  : "empty"
              }`}
            >
              ★
            </span>
          ))}
        </div>
        <div className="rating-info">
          <span className="rating-number">{rating}</span>
          <span className="rating-label">rating</span>
        </div>
      </div>
    );
  };

  const handleShare = (e) => {
    e.stopPropagation(); // Prevent card click
    const message = `Check out ${title} from HPS Constructions - Only ₹${price}/${unit}!`;
    if (navigator.share) {
      navigator.share({
        title: title,
        text: message,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(message);
      alert("Link copied to clipboard!");
    }
    onShare();
  };

  const handleLearnMore = (e) => {
    e.stopPropagation(); // Prevent card click
    const message = encodeURIComponent(
      `Hi HPS Constructions! I'm interested in ${title} (₹${price}/${unit}). Please provide more details.`
    );
    window.open(`https://wa.me/919565550142?text=${message}`, "_blank");
    onLearnMore();
  };

  // Handle card click - navigate to products page
  const handleCardClick = () => {
    navigate("/products");
  };

  return (
    <div className="hps-card" onClick={handleCardClick}>
      {/* IMAGE - HALF HEIGHT */}
      <div className="card-image">
        <img
          src={imageUrl}
          alt={title}
          onError={(e) => {
            e.target.src = "/assets/placeholder.jpg";
          }}
        />
        <div className="image-overlay"></div>
      </div>

      {/* CONTENT - OTHER HALF */}
      <div className="card-content">
        {/* TITLE AND DESCRIPTION GROUP */}
        <div className="title-description-group">
          <h3 className="card-title">{title}</h3>
          <p className="card-description">{description}</p>
        </div>

        {/* RATING AND PRICE GROUP - SMALLER SIZE */}
        <div className="rating-price-row">
          <div className="rating-section">
            <StarRating rating={rating} />
          </div>

          <div className="price-section">
            <div className="price-main">
              <span className="currency">₹</span>
              <span className="amount">{price.toLocaleString()}</span>
            </div>
            <div className="price-unit">per {unit}</div>
          </div>
        </div>

        {/* LARGER BUTTONS */}
        <div className="card-actions">
          <button className="btn-share" onClick={handleShare}>
            Share
          </button>
          <button className="btn-learn" onClick={handleLearnMore}>
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}
