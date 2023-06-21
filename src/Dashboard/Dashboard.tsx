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
                <br/><br/><br/><br/>

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

export default Dashboard;
