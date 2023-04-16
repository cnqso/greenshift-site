// src/HomePage.js

import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
const HomePage = () => {
  return (
    <div className="homepage">
     
      <main className="content">
        <section className="hero">
          <h2>Welcome to Piaget Bot</h2>
          <p>A virtual teaching assistant</p>
          <Link  to="/readability"><button className="cta">Get Started</button></Link>
        </section>
        <section id="features" className="features">
          <h2>features</h2>
          <div className="feature-items">
            <div className="feature-item">
              <h3>Feature 1</h3>
              <p>Explanation of feature 1.</p>
            </div>
            <div className="feature-item">
              <h3>Feature 2</h3>
              <p>Explanation of feature 2.</p>
            </div>
            <div className="feature-item">
              <h3>Feature 3</h3>
              <p>Explanation of feature 3.</p>
            </div>
          </div>
        </section>
        <section id="pricing" className="pricing">
          <h2>Pricing</h2>
          <p>Choose the plan that suits your needs.</p>
          {/* Add pricing components or cards here */}
        </section>
        <section id="account" className="account">
          <h2>Contact Us</h2>
          <p>Get in touch with our team for any queries.</p>
          {/* Add account form or details here */}
        </section>
      </main>
      <footer className="footer">
        <p>© 2023 PiagetBot. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;