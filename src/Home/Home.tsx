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
`>4 essay question prompts on the themes in "Breakfast of Champions" by Kurt Vonnegut<

1. Explain the concept of free will and how it is addressed in "Breakfast of Champions."

2. Describe the character of Kilgore Trout and the role he plays in introducing pessimistic themes throughout the novel.

3. In "Breakfast of Champions," Vonnegut often uses humor as a tool to convey deeper messages of social criticism. Discuss the relationship between irony and satire in the novel.

4. Analyze the portrayal of consumerism in "Breakfast of Champions." How is Vonnegut's use of irony specifically targeted towards American society?`,

`>3 multiple choice questions on John Locke<
	1. John Locke was an influential figure in which period of history?
        A. The Renaissance
        B. The Age of Absolutism
        C. The Enlightenment
        D. The Victorian Era
    2. According to Locke, where does government derive its power from?
        A. The divine right of kings
        B. The consent of the governed
        C. The social contract
        D. The will of the ruling class
    3. How did Locke view human nature?
        A. As inherently good
        B. As a blank slate (tabula rasa)
        C. As inherently evil
        D. As predetermined by fate`,
`>Procedure for a lesson on the Cuban Missile Crisis<
1. Warm-Up (5 minutes): Start the lesson with a quick brainstorming session to activate prior knowledge. Ask students to share what they already know about the Cuban Missile Crisis and the factors that led to it. Write their responses on the board, creating a web of ideas.

2. Introduction to Key Concepts (15 minutes): Introduce the main topics of the lesson: the role of President John F. Kennedy during the Cuban Missile Crisis, the concept of Mutually Assured Destruction (M.A.D.), key events and diplomatic efforts toward resolution, and the impact of the crisis on U.S.-Soviet relations and global attitudes toward nuclear weapons.

3. Group Work - Document Analysis (15 minutes): Break the class into small groups and provide each group with primary source documents from the period of the Cuban Missile Crisis. Groups should note their observations and be prepared to share their findings with the class.

4. Share out (10 minutes): Each group presents a summary of their document and any relevant observations to the class. Guide this discussion by asking probing questions that encourage students to delve deeper into their analyses.

5. Review and Closure (5 minutes): As a class, review the key points of the lesson. Add new knowledge acquired during the lesson to the web of ideas on the board.

6. Think-Pair-Share Assessment (5 minutes): Have students pair up and discuss the four questions provided about the Cuban Missile Crisis. Once each pair has discussed their answers, ask each pair to share their responses with the class to provide a comprehensive understanding and variety of perspectives on the topic.`,
`>Informal assessment for a cell structure lab practical<
Lab Practical (30 minutes): Students will rotate through three stations, spending 10 minutes at each station, where they will complete one of the following tasks:

1. Mitochondria Structure and Function: Students will examine diagrams of mitochondria and answer questions about their structure and function, including how they provide energy to the cell and the processes that occur within them.

2. Plant and Animal Cell Comparison: Students will examine micrographs of plant and animal cells and identify and label the structures unique to each cell type. They will then write a paragraph comparing and contrasting the structures and functions of the two cell types.

3. Plant Cell Structures: Students will examine micrographs of plant cells and label the structures unique to plant cells, such as the cell wall, chloroplasts, and central vacuole. They will then write a paragraph explaining the functions of each structure.`,


`>1 short answer and 1 short essay question on The Lewis and Clark Expedition<
1. Who sponsored the Lewis and Clark Expedition?
Sample answer: The Lewis and Clark Expedition was sponsored by the United States government under President Thomas Jefferson.

2. What was the purpose of the Lewis and Clark Expedition?
Sample answer: The purpose of the Lewis and Clark Expedition was to explore the newly acquired territory of Louisiana and to find a practical route across the western region of North America. Additionally, President Thomas Jefferson wanted the expedition to establish trade with Native American tribes and to discover new plant and animal species. The expedition was also tasked with collecting geographical and scientific data along the way.`,
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
				}, 1);
			} else {
				setClear(false);
				setIndex((index + 1) % strings.length);
			}
		} else {
			if (typedString.length < strings[index].length) {
				timeout = setTimeout(() => {
					setTypedString(strings[index].slice(0, typedString.length + 1));
				}, 8);
			}
		}
		return () => clearTimeout(timeout);
	}, [typedString, index, clear, strings]);

	const handleClick = () => {
		setClear(true);
	};

	return (
		<div className='editorBox' onClick={handleClick} >
			<div className='ql-editor' style={{height: "500px", cursor: "pointer"}}>
				<div style={{cursor: "pointer"}}>
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
