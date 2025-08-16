// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Topbar from './Components/Topbar';
import Home from './Pages/home';
import ProductsPage from './Pages/products';
import Contact from './Pages/contact';
import ScrollToTop from './Components/ScrollToTop';
import './App.css';

function App() {
  return (
    <Router>
      <Topbar />
      <ScrollToTop>
        <Routes>
          {/* Home is now '/', which is About/old Home */}
          <Route path="/" element={<Home />} />
          {/* Products is the new main route */}
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </ScrollToTop>
    </Router>
  );
}

export default App;
