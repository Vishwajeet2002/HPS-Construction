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
          {/* Homepage ("/") now shows ProductsPage content */}
          <Route path="/" element={<ProductsPage />} />
          {/* About page ("/about") shows the old Home content */}
          <Route path="/about" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </ScrollToTop>
    </Router>
  );
}

export default App;
