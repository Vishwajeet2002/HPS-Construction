import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Topbar from './Components/Topbar';
import About from './Pages/about';
import Home from './Pages/home'; // Home page
import Contact from './Pages/contact';
import ScrollToTop from './Components/ScrollToTop';
import './App.css';

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="app">
          <Topbar />
          <ScrollToTop />
          <main className="main-content">
            <Routes>
              {/* Homepage ("/") */}
              <Route path="/" element={<Home />} />
              {/* About page ("/about") */}
              <Route path="/about" element={<About />} />
              {/* Contact page */}
              <Route path="/contact" element={<Contact />} />
              {/* Fallback route for unmatched pages */}
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
