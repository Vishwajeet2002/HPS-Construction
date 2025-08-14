// App.js (in src/)
import Topbar from "./pages/Topbar";
import Home from "./Pages/home";
import "./App.css";
import Footer from "./pages/footer"; // Importing Footer component
import ContactForm from "./Pages/contactform";

function App() {
  return (
    <>
      <div className="App">
        <Topbar />
        <ContactForm />

        {/* Main content starts here */}
        <main className="main-content">
          {/* Image Slider Section - Should be at the top */}

          {/* Welcome Section with line breaks */}
          {/* <section className="welcome-section">
          <div className="container">
            <h1>Welcome to HPS Constructions</h1>
            <br />
            <p>Your trusted partner for bamboo and POP construction solutions.</p>
            <br />
            <p>Building sustainable futures with innovative designs and eco-friendly materials.</p>
          </div>
        </section> */}
          <Home />
        </main>
      </div>
      <hr></hr>
      <div>
        <Footer />
      </div>
    </>
  );
}

export default App;
