/** @format */

// src/HomePage.js

import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";
const HomePage = () => {
	return (
		<div className='homepage'>

			<div className='feature-items'>
				<div className='feature-item'>
					<Link to='/readability'>
						<h3>Readability</h3>
					</Link>
					<p>Turn anything into the perfect reading material.</p>
				</div>
				<div className='feature-item'>
					<Link to='/worksheetgenerator'>
						<h3>Worksheet Generator</h3>
					</Link>
					<p>Turn state standards into lesson calendars</p>
				</div>
				<div className='feature-item'>
					<Link to='/lessonplanner'>
						<h3>Lesson Planner</h3>
					</Link>

					<p>Create a detailed lesson plan, materials included, in seconds. </p>
				</div>
				<div className='feature-item'>
					<Link to='/generations'>
						<h3>View Generations</h3>
					</Link>
				</div>
				<div className='feature-item'>
					<Link to='/payments'>
						<h3>Zubscribe</h3>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
