/** @format */

// src/HomePage.js

import React, {useState, useEffect} from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import type {UserPreferences} from "../@types/internal.types";


const AnimatedComponent = () => {
    const strings=['Hello, world!', 'This is a typing effect.', 'Enjoy!']
    const [index, setIndex] = useState(0);
    const [typedString, setTypedString] = useState('');
    const [clear, setClear] = useState(false);

    useEffect(() => {
        let timeout: any;
        if (clear) {
            if (typedString.length) {
                timeout = setTimeout(() => {
                    setTypedString(typedString.slice(0, -1));
                }, 20);
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
			<p className='ql-editor'><div>
            {typedString}
      <span className="blinking-cursor">|</span>
    </div></p>
		</div>
	);
}
const FeatureCard = ({title, description}:{title: string, description: string}) => {
	return (
		<div className='FeatureCard'>
            <img src='https://via.placeholder.com/150' alt='placeholder' />
            <h3 className='title'>{title}</h3>
            <p className='description'>{description}</p>
		</div>
	);
}


const HomePage = ({userPreferences}:{userPreferences: UserPreferences|null}) => {
    return (
        <div>
            {/* Top Section */}
            <section>
                <h1 style={{marginBottom: 0}}>Piaget Bot</h1>
                <p>An AI Teaching Assistant</p>
                <AnimatedComponent />
                <button>Get Started</button>
            </section>

            <section className='mission textBox' >Piaget Bot is a suite of by-teachers for-teachers tools for planning lessons more efficiently. Our goal is to free up teachers' time and energy for the most important part of the job: teaching.</section>

            {/* Feature Section */}
            <section>
                <div style={{display: 'flex', justifyContent: 'space-around'}}>
                    <FeatureCard 
                        title='Readability' 
                        description='Automatically tune any text to the perfect reading level for your students.' 
                    />
                    <FeatureCard 
                        title='Lesson Planning' 
                        description='Work alongside our AI to create a detailed lesson plan in minutes.' 
                    />
                    <FeatureCard 
                        title='Assessments and Worksheets' 
                        description='Generate questions to assess student learning on the fly.' 
                    />
                </div>
            </section>

            {/* Premium Section */}
            <section>
                <h2>Piaget Bot Premium</h2>
                <p className='textBox'>Get unlimited usage and access to our most powerful AI models. You'll wonder how you ever taught without it.</p>
                <button>Learn More</button>
            </section>

            {/* Contact Section */}
            <section>
                <h2>Contact Us</h2>
                <p>Have any questions? We would love to hear from you.</p>
                <form>
                    <label>
                        Name:
                        <input type="text" name="name" />
                    </label>
                    <label>
                        Email:
                        <input type="email" name="email" />
                    </label>
                    <label>
                        Message:
                        <textarea name="message" />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
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
