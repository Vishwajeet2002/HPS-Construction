import React, { useState } from "react";
import HPSProductCard from "../Components/productCard";
import "../Style/products.css";
import Footer from "./footer";
import Poster from "../Components/poster";

const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const allProducts = [
    {
      id: 1,
      title: "Bamboo Solutions",
      description: "Sustainable bamboo construction materials for eco-friendly and durable buildings that stand the test of time.",
      price: 599,
      unit: "piece",
      rating: 4.8,
      category: "bamboo",
      imageUrl: "/images/luffy.jpg",
    },
    {
      id: 2,
      title: "POP Services",
      description: "Professional Plaster of Paris solutions for modern interiors with artistic designs and precision finishing.",
      price: 399,
      unit: "sq ft",
      rating: 4.6,
      category: "pop",
      imageUrl: "/images/413842.jpg",
    },
    {
      id: 3,
      title: "Expert Consultation",
      description: "Get professional advice and customized solutions for your construction projects from our experienced team.",
      price: 2999,
      unit: "session",
      rating: 5.0,
      category: "consultation",
      imageUrl: "/images/12345.avif",
    },
    {
      id: 4,
      title: "Interior Design",
      description: "Complete interior design solutions with modern aesthetics and functional layouts for residential and commercial spaces.",
      price: 1599,
      unit: "room",
      rating: 4.7,
      category: "design",
      imageUrl: "/images/123.jpg",
    },
    {
      id: 5,
      title: "Bamboo Flooring",
      description: "Premium quality bamboo flooring solutions with various textures and finishes for elegant interiors.",
      price: 899,
      unit: "sq ft",
      rating: 4.5,
      category: "bamboo",
      imageUrl: "/images/luffy.jpg",
    },
    {
      id: 6,
      title: "POP Ceiling Design",
      description: "Creative POP ceiling designs with modern lighting solutions and architectural details for stunning interiors.",
      price: 1299,
      unit: "room",
      rating: 4.8,
      category: "pop",
      imageUrl: "/images/413842.jpg",
    },
    {
      id: 7,
      title: "Bamboo Wall Panels",
      description: "Natural bamboo wall panels for eco-friendly interior decoration with artistic finishes.",
      price: 299,
      unit: "sq ft",
      rating: 4.4,
      category: "bamboo",
      imageUrl: "/images/12345.avif",
    },
    {
      id: 8,
      title: "POP Installation",
      description: "Expert POP installation services for walls, ceilings with precision and quality assurance.",
      price: 699,
      unit: "sq ft",
      rating: 4.6,
      category: "pop",
      imageUrl: "/images/123.jpg",
    },
    {
      id: 9,
      title: "Bamboo Furniture",
      description: "Sustainable bamboo furniture including chairs, tables and storage solutions for modern homes.",
      price: 799,
      unit: "unit",
      rating: 4.9,
      category: "bamboo",
      imageUrl: "/images/luffy.jpg",
    },
    {
      id: 10,
      title: "POP Decorative Items",
      description: "Custom POP decorative items and artistic elements for unique interior designs.",
      price: 4999,
      unit: "project",
      rating: 4.8,
      category: "pop",
      imageUrl: "/images/413842.jpg",
    },
    {
      id: 11,
      title: "Bamboo Kitchen Solutions",
      description: "Modern bamboo kitchen solutions with optimal space utilization and eco-friendly materials.",
      price: 2499,
      unit: "kitchen",
      rating: 4.7,
      category: "bamboo",
      imageUrl: "/images/12345.avif",
    },
    {
      id: 12,
      title: "POP Renovation",
      description: "Complete POP renovation services with modern designs and professional finishing.",
      price: 1899,
      unit: "room",
      rating: 4.5,
      category: "pop",
      imageUrl: "/images/123.jpg",
    },
  ];

  // Filter products based on category and search
  const filteredProducts = allProducts.filter((product) => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = 
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { id: "all", name: "All Products", icon: "🏗️" },
    { id: "bamboo", name: "Bamboo", icon: "🎋" },
    { id: "pop", name: "POP", icon: "🏛️" },
  ];

  return (
    <div className="products-page">
      {/* Header with Filters */}
      <div className="main-heading-container">
        <div className="filter-section">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="category-filters">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`category-btn ${selectedCategory === category.id ? "active" : ""}`}
              >
                <span className="category-icon">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="results-info">
          <span className="results-count">
            {filteredProducts.length} Products Found
          </span>
        </div>
      </div>

      {/* Products Grid */}
      <main className="products-main">
        <div className="products-container">
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product-item">
                <HPSProductCard
                  title={product.title}
                  description={product.description}
                  price={product.price}
                  unit={product.unit}
                  rating={product.rating}
                  imageUrl={product.imageUrl}
                  onCall={() => console.log(`Called for: ${product.title}`)}
                  onLearnMore={() => console.log(`Learn more: ${product.title}`)}
                />
              </div>
            ))}
          </div>

          {/* No Products Found */}
          {filteredProducts.length === 0 && (
            <div className="no-products">
              <div className="no-products-icon">📦</div>
              <h3>No Products Found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </main>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>Need Custom Solutions?</h2>
          <p>Our experts are ready to help you with personalized construction solutions</p>
          <button
            className="cta-button"
            onClick={() => (window.location.href = "/contact")}
          >
            Get Free Consultation
          </button>
        </div>
      </section>

      <Poster />
      <Footer />
    </div>
  );
};

export default ProductsPage;
