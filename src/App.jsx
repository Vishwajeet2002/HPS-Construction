// App.jsx (src/)
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Topbar from "./Components/Topbar";
import Home from "./Pages/home";
import ProductsPage from "./Pages/products";
import Contact from "./Pages/contact"; // ✅ ADD CONTACT IMPORT
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Topbar />

        <Routes>
          {/* HOME ROUTE */}
          <Route
            path="/"
            element={
              <>
                <main className="main-content">
                  <Home />
                </main>
              </>
            }
          />
          
          {/* PRODUCTS ROUTE */}
          <Route path="/products" element={<ProductsPage />} />
          
          {/* ✅ CONTACT ROUTE - ADD THIS */}
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
