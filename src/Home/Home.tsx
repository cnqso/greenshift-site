/** @format */

import React, { useState, useEffect } from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import type { UserPreferences } from "../@types/internal.types";
import lessonplansvg from "../assets/svgs/lessonplan.svg";
import readabilitysvg from "../assets/svgs/readability.svg";
import listsvg from "../assets/svgs/list.svg";
import pathingsvg from "../assets/svgs/pathing.svg";
import { QuestionIcon, WebsiteIcon, GithubIcon } from "../assets/icons";

const AnimatedComponent = () => {
	const strings = [
		">A multiple choice question on the role of women in the French revolution<\n1.dfsf",
		"This is a typing effect.",
		"Enjoy!",
	];
	const [index, setIndex] = useState(0);
	const [typedString, setTypedString] = useState("");
	const [clear, setClear] = useState(false);

	useEffect(() => {
		let timeout: any;
		if (clear) {
			if (typedString.length) {
				timeout = setTimeout(() => {
					setTypedString(typedString.slice(0, -1));
				}, 10);
			} else {
				setClear(false);
				setIndex((index + 1) % strings.length);
			}
		} else {
			if (typedString.length < strings[index].length) {
				timeout = setTimeout(() => {
					setTypedString(strings[index].slice(0, typedString.length + 1));
				}, 50);
			}
		}
		return () => clearTimeout(timeout);
	}, [typedString, index, clear, strings]);

	const handleClick = () => {
		setClear(true);
	};

	return (
		<div className='editorBox' onClick={handleClick}>
			<div className='ql-editor'>
				<div>
					{typedString}
					<span className='blinking-cursor'>|</span>
				</div>
			</div>
		</div>
	);
};
const FeatureCard = ({ title, description, img }: { title: string; description: string; img: any }) => {
	return (
		<div className='FeatureCard'>
			<img src={img} alt='placeholder' />
			<div className='titleAndDescription'>
				<h3 className='title'>{title}</h3>
				<p className='description'>{description}</p>
			</div>
		</div>
	);
};

const HomePage = ({
	userPreferences,
	toggleAccountModal,
}: {
	userPreferences: UserPreferences | null;
	toggleAccountModal: () => void;
}) => {
	return (
		<div className='Home'>
			{/* Top Section */}
			<section style={{ marginTop: 20 }}>
				<h1 style={{ marginBlock: 0 }}>Piaget Bot</h1>
				<p>An AI Teaching Assistant</p>
				<AnimatedComponent />
			</section>

			<section className='mission textBox'>
				Piaget Bot is a suite of by-teachers for-teachers tools for planning lessons more efficiently.
				Our goal is to free up teachers' time and energy for the most important part of the job:
				teaching.
				<br />
				{userPreferences ? (
					<Link
						to='/dashboard'
						className='linkButton'
						style={{ margin: "0 auto", fontSize: "1.2em", padding: "10px", marginTop: "15px" }}>
						Get Started
					</Link>
				) : (
					<button
						style={{ fontSize: "1.2em", padding: "10px", marginTop: "15px" }}
						onClick={toggleAccountModal}>
						Get Started
					</button>
				)}
			</section>

			{/* Feature Section */}
			<section>
				<div className='textBox'>
					<h2>Features</h2>
				</div>
				<div className='features'>
					<FeatureCard
						title='Readability'
						description='Automatically tune any text to the perfect reading level for your students.'
						img={readabilitysvg}
					/>
					<FeatureCard
						title='Lesson Planning'
						description='Work alongside our AI to create a detailed lesson plan in minutes.'
						img={pathingsvg}
					/>
					<FeatureCard
						title='Assessments & Worksheets'
						description='Generate questions to assess student learning on the fly.'
						img={listsvg}
					/>
				</div>
			</section>

			{/* Premium Section */}
			<section className='textBox'>
				<h2>Piaget Bot Premium</h2>
				<p>
					Get unlimited usage and access to our most powerful AI models. You'll wonder how you ever
					taught without it.
				</p>
				<Link
					to='/premium'
					className='linkButton'
					style={{ margin: "0 auto", fontSize: "1.2em", padding: "10px", marginTop: "15px" }}>
					Learn More
				</Link>
			</section>

			{/* Contact Section */}
			<section className='textBox'>
				<h2>Contact</h2>
				<p>Have any questions? We would love to hear from you.</p>
				<Link
					to='/contact'
					className='linkButton'
					style={{ margin: "0 auto", fontSize: "1.2em", padding: "10px", marginTop: "15px" }}>
					Message Us
				</Link>
			</section>

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

export default HomePage;
