/** @format */

// src/HomePage.js

import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";
const HomePage = () => {
	return (
		<div className='homepage'>
			<main className='content'>
				<section className='hero'>
					<h2>Piaget Bot</h2>
					<p>A virtual teaching assistant</p>
					<Link to='/readability'>
						<button className='cta'>Get Started</button>
					</Link>
				</section>
				<section id='features' className='features'>
					<h2>Features</h2>
					<div className='feature-items'>
						<div className='feature-item'>
            <Link to='/readability'>
						<h3>Readability</h3>
					</Link>
							<p>Turn anything into the perfect reading material.</p>
						</div>
						<div className='feature-item'>
            <Link to='/lessonplanner'>
						<h3>Unit Planner</h3>
					</Link>
							<p>Turn state standards into lesson calendars</p>
						</div>
						<div className='feature-item'>
            <Link to='/lessonplanner'>
						<h3>Lesson Planner</h3>
					</Link>
							
							<p>Create a detailed lesson plan, materials included, in seconds. </p>
						</div>
					</div>
				</section>
			</main>
			<footer className='footer'>
				<p>© 2023 PiagetBot. All rights reserved.</p>
			</footer>
		</div>
	);
};

export default HomePage;
