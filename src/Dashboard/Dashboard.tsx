/** @format */

import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { Link } from "react-router-dom";
import type { UserPreferences } from "../@types/internal.types";
import lessonplansvg from "../assets/svgs/lessonplan.svg";
import readabilitysvg from "../assets/svgs/readability.svg";
import listsvg from "../assets/svgs/list.svg";
import pathingsvg from "../assets/svgs/pathing.svg";

const FeatureCard = ({ title, img, link }: { title: string; img: any, link: string }) => {
	return (
        <Link to={link} className='FeatureCard'>

			<img src={img} alt='placeholder' />
			<div className="dashboardTitle" >
				<h3 className='title'>{title}</h3>

		</div>
        </Link>
	);
};

const Dashboard = ({
	userPreferences,

}: {
	userPreferences: UserPreferences | null;

}) => {
	return (
		<div className='Dashboard'>
			

<br/><br/>
				<div className='features'>
					<FeatureCard
						title='Readability'
						link='/readability'
						img={readabilitysvg}
					/>
					<FeatureCard
						title='Lesson Planning'
						link='/lessonplanner'
						img={pathingsvg}
					/>
					<FeatureCard
						title='Assessments & Worksheets'
						link='/worksheetgenerator'
						img={listsvg}
					/>
				</div>
                <Link
											to='/generations'
											
											className='linkButton'
											style={{ fontSize: "1.3em", paddingInline: "35px", margin: "30px auto" }}>
											View History
										</Link>



		</div>
	);
};

// const HomePage = ({userPreferences}:{userPreferences: UserPreferences|null}) => {
// 	return (
// 		<div className='homepage'>

// 			<div className='feature-items'>
// 				<div className='feature-item'>
// 					<Link to='/readability'>
// 						<h3>Readability</h3>
// 					</Link>
// 					<p>Turn anything into the perfect reading material.</p>
// 				</div>
// 				<div className='feature-item'>
// 					<Link to='/worksheetgenerator'>
// 						<h3>Worksheet Generator</h3>
// 					</Link>
// 					<p>Turn state standards into lesson calendars</p>
// 				</div>
// 				<div className='feature-item'>
// 					<Link to='/lessonplanner'>
// 						<h3>Lesson Planner</h3>
// 					</Link>

// 					<p>Create a detailed lesson plan, materials included, in seconds. </p>
// 				</div>

// 			</div>
// 		</div>
// 	);
// };

export default Dashboard;
