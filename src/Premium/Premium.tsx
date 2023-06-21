import {useState, useContext, useEffect} from 'react';
import type { UserPreferences } from '../@types/internal.types';
import { ErrorContext } from '../assets/errors';
import cheetasvg from '../assets/svgs/cheeta.svg'
import readeyesvg from '../assets/svgs/readeye.svg'
import reloaddocumentsvg from '../assets/svgs/reloaddocument.svg'
import { Link } from 'react-router-dom';
import './Premium.css';

const FeatureCard = ({ title, description, img }: { title: string; description: string, img: any }) => {
	return (
		<div className='FeatureCard'>
			<img src={img} alt='placeholder' />
			<div className='titleAndDescription'>
			<h3 className='title'>{title}</h3>
			<p className='description'>{description}</p></div>
		</div>
	);
};


export default function Premium({userPreferences, sendToCluod}: { userPreferences: UserPreferences | null; sendToCluod: Function}) {

//Different behavior if logged in or not


    return (
        <div className="Premium">
      
          <section className="hero">
          <h2>Piaget Bot Premium</h2>
					<p>Work smarter — not harder</p>
					<Link to='/payments'>
						<button className='cta'>Get Premium</button>
					</Link>
            
          </section>
          <section>
				<div className='features'>
        <FeatureCard
						title='Smarter'
						description='Get access to our most powerful, shockingly-smart AI model'
                        img = {readeyesvg}
					/>
          <FeatureCard
						title='Faster'
						description='Get everything quicker with boosted server power and turbo models'
                        img = {cheetasvg}
					/>

					<FeatureCard
						title='Unlimited'
						description="No monthly credits, no hassle"
                        img = {reloaddocumentsvg}
					/>
				</div>
			</section>
         

           <section className="pricing">
           <br/><br/>
            <div className="textBox">
              
              <h2>Schools</h2>
              <p>Get Piaget Bot Premium for your school or district to supercharge teacher productivity. Contact our sales team to learn more!</p>
              <Link
                        to='/contact'
                        className='linkButton'
                        style={{ margin: "0 auto", fontSize: "1.2em", padding: "10px", marginTop: "15px" }}>
                        Get in touch
                      </Link>
                      
            </div>
            <br/><br/>
          </section>

      </div>
    )





}