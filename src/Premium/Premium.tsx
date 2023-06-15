import {useState, useContext, useEffect} from 'react';
import type { UserPreferences } from '../@types/internal.types';
import { ErrorContext } from '../assets/errors';
import { Link } from 'react-router-dom';
import './Premium.css';



export default function Premium({userPreferences, sendToCluod}: { userPreferences: UserPreferences | null; sendToCluod: Function}) {

//Different behavior if logged in or not


    return (
        <div className="homepage">

        <main className="content">
      
          <section className="hero">
          <h2>Piaget Bot Premium</h2>
					<p>a virtual teaching assistant</p>
					<Link to='/payments'>
						<button className='cta'>Get Premium</button>
					</Link>
            
          </section>
          <section id="features" className="features">
            <h2>Features</h2>
            <div className="feature-items">
              <div className="feature-item">
                <h3>Faster</h3>
                <p>Explanation of feature 1.</p>
              </div>
              <div className="feature-item">
                <h3>Smarter</h3>
                <p>Explanation of feature 2.</p>
              </div>
              <div className="feature-item">
                <h3>Unlimited</h3>
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
            <h2>Schools</h2>
            <p>Get Piaget Bot Premium for your school or district to supercharge teacher productivity.</p>
            <p>Get in touch with our sales team for any queries: <a href="mailto:sales@piagetbot.com">sales@piagetbot.com</a></p>
          </section>
        </main>
        <footer className="footer">
          <p>© 2023 PiagetBot. All rights reserved.</p>
        </footer>
      </div>
    )





}