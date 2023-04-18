/** @format */

import React, { useState } from "react";

const StepOne = ({ nextStep }: { nextStep: any }) => {
	const [subject, setSubject] = useState("");
	const [topic, setTopic] = useState("");
	const [grade, setGrade] = useState("");

	const [stateStandards, setStateStandards] = useState("");
	const [focusPoints, setFocusPoints] = useState("");
	const [priorKnowledge, setPriorKnowledge] = useState("");
	const [scaffoldingGoals, setScaffoldingGoals] = useState("");
	const [targetSkills, setTargetSkills] = useState("");

	const handleSubmit = (e:any) => {
		e.preventDefault();
		// Save entered data and proceed to the next step
		nextStep();
	};

	return (
		<div className='step-one'>
			<h2>Step 1: Basic Information</h2>
			<form onSubmit={handleSubmit}>
				<label htmlFor='subject'>Subject</label>
				<input
					type='text'
					id='subject'
					value={subject}
					onChange={(e) => setSubject(e.target.value)}
					required
				/>

				<label htmlFor='topic'>Topic</label>
				<input
					type='text'
					id='topic'
					value={topic}
					onChange={(e) => setTopic(e.target.value)}
					required
				/>

				<label htmlFor='grade'>Grade</label>
				<input
					type='text'
					id='grade'
					value={grade}
					onChange={(e) => setGrade(e.target.value)}
					required
				/>

				<label htmlFor='stateStandards'>State Standards (Optional)</label>
				<input
					type='text'
					id='stateStandards'
					value={stateStandards}
					onChange={(e) => setStateStandards(e.target.value)}
				/>

				<label htmlFor='focusPoints'>Focus Points (Optional)</label>
				<input
					type='text'
					id='focusPoints'
					value={focusPoints}
					onChange={(e) => setFocusPoints(e.target.value)}
				/>

				<label htmlFor='priorKnowledge'>Prior Knowledge (Optional)</label>
				<input
					type='text'
					id='priorKnowledge'
					value={priorKnowledge}
					onChange={(e) => setPriorKnowledge(e.target.value)}
				/>

				<label htmlFor='scaffoldingGoals'>Scaffolding Goals (Optional)</label>
				<input
					type='text'
					id='scaffoldingGoals'
					value={scaffoldingGoals}
					onChange={(e) => setScaffoldingGoals(e.target.value)}
				/>

				<label htmlFor='targetSkills'>Target Skills (Optional)</label>
				<input
					type='text'
					id='targetSkills'
					value={targetSkills}
					onChange={(e) => setTargetSkills(e.target.value)}
				/>

				<button type='submit'>Next</button>
			</form>
		</div>
	);
};

const StepTwo = ({ nextStep, prevStep }: { nextStep: any, prevStep: any }) => {
	return (
		<div className='step-one'>
			<h2>Step 1: Basic Information</h2>
		</div>
	);
};
const StepThree = ({ nextStep, prevStep }: { nextStep: any, prevStep: any }) => {
	return (
		<div className='step-one'>
			<h2>Step 1: Basic Information</h2>
		</div>
	);
};
const StepFour = ({ nextStep, prevStep }: { nextStep: any, prevStep: any }) => {
	return (
		<div className='step-one'>
			<h2>Step 1: Basic Information</h2>
		</div>
	);
};
const StepFive = ({ nextStep, prevStep }: { nextStep: any, prevStep: any }) => {
	return (
		<div className='step-one'>
			<h2>Step 1: Basic Information</h2>
		</div>
	);
};

export default function LessonStep({
	step,
	nextStep,
	prevStep,
}: {
	step: number;
	nextStep: any;
	prevStep: any;
}) {
	switch (step) {
		case 1:
			return <StepOne nextStep={nextStep} />;
		case 2:
			return <StepTwo nextStep={nextStep} prevStep={prevStep} />;
		case 3:
			return <StepThree nextStep={nextStep} prevStep={prevStep} />;
		case 4:
			return <StepFour nextStep={nextStep} prevStep={prevStep} />;
		case 5:
			return <StepFive nextStep={nextStep} prevStep={prevStep} />;
		default:
			return <StepOne nextStep={nextStep} />;
	}
}
