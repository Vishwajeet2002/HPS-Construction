// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Topbar from './Components/Topbar';
import Home from './Pages/home';
import ProductsPage from './Pages/products';
import Contact from './Pages/contact';
import ScrollToTop from './Components/ScrollToTop';   // ⭐ new line
import './App.css';

function App() {
  return (
    <Router>
      <Topbar />

      {/* every route is now a child of ScrollToTop */}
      <ScrollToTop>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </ScrollToTop>
    </Router>
  );
}

export default App;
