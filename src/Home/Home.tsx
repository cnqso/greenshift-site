// src/HomePage.js

import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
const HomePage = () => {
  return (
    <div className="homepage">
      <header className="header">
        <h1 className="logo"><Link style={{color:"#fff"}}  to="/readability">Piaget Bot</Link></h1>
        <nav className="navigation">
            
            <a href="#about">about</a>
          <a href="#features">features</a>
          <a href="#pricing">pricing</a>
          <a href="#account">account</a>
        </nav>
      </header>
      <main className="content">
      <svg width="100%" height="50" xmlns="http://www.w3.org/2000/svg">
  <g className="dot-matrix-text">
    <rect className="dot" x="5" y="5" width="3" height="3" />
    <rect className="dot" x="5" y="10" width="3" height="3" />
    <rect className="dot" x="5" y="15" width="3" height="3" />
    <rect className="dot" x="5" y="20" width="3" height="3" />
    <rect className="dot" x="5" y="25" width="3" height="3" />
    <rect className="dot" x="10" y="5" width="3" height="3" />
    <rect className="dot" x="10" y="25" width="3" height="3" />
    <rect className="dot" x="15" y="5" width="3" height="3" />
    <rect className="dot" x="15" y="10" width="3" height="3" />
    <rect className="dot" x="15" y="15" width="3" height="3" />
    <rect className="dot" x="15" y="20" width="3" height="3" />
    <rect className="dot" x="15" y="25" width="3" height="3" />

    <rect className="dot" x="25" y="5" width="3" height="3" />
    <rect className="dot" x="25" y="25" width="3" height="3" />
    <rect className="dot" x="30" y="5" width="3" height="3" />
    <rect className="dot" x="30" y="25" width="3" height="3" />
    <rect className="dot" x="35" y="5" width="3" height="3" />
    <rect className="dot" x="35" y="25" width="3" height="3" />

    <rect className="dot" x="45" y="5" width="3" height="3" />
    <rect className="dot" x="50" y="5" width="3" height="3" />
    <rect className="dot" x="55" y="5" width="3" height="3" />
    <rect className="dot" x="50" y="10" width="3" height="3" />
    <rect className="dot" x="50" y="15" width="3" height="3" />
    <rect className="dot" x="50" y="20" width="3" height="3" />
    <rect className="dot" x="50" y="25" width="3" height="3" />
    </g>
    </svg>
        <section className="hero">
          <h2>Welcome to Your Piaget Bot</h2>
          <p>A virtual teaching assistant (or 2 or 3)</p>
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