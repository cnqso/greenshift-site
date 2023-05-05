/** @format */

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
	subject: yup.string().required("Subject is required."),
	topic: yup.string().required("Topic is required."),
	gradeLevel: yup.number().positive().integer().required("Grade is required."),
	stateStandards: yup.string().nullable().notRequired(),
	focusPoints: yup.string().nullable().notRequired(),
	priorKnowledge: yup.string().nullable().notRequired(),
	scaffoldingGoals: yup.string().nullable().notRequired(),
	targetSkills: yup.string().nullable().notRequired(),
});

type FormData = yup.InferType<typeof schema>;

const StepOne = ({ nextStep }: { nextStep: any }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		resolver: yupResolver(schema),
	});

	const onSubmit = (data: FormData) => {
		console.log(data);
		nextStep();
	};

	return (
		<div className='container'>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className='form-group'>
					<label htmlFor='subject' className='label'>
						Subject* :
					</label>
					<input
						id='subject'
						{...register("subject")}
						className={`input ${errors.subject ? "error" : ""}`}
					/>
					<p className='error-message'>{errors.subject?.message}</p>

					<label htmlFor='topic' className='label'>
						Topic* :
					</label>
					<input
						id='topic'
						{...register("topic")}
						className={`input ${errors.topic ? "error" : ""}`}
					/>
					<p className='error-message'>{errors.topic?.message}</p>

					<label htmlFor='grade' className='label'>
						Grade Level* :
					</label>
					<input
						id='grade'
						{...register("gradeLevel")}
						className={`input ${errors.gradeLevel ? "error" : ""}`}
					/>
					<p className='error-message'>{errors.gradeLevel?.message}</p>

					<label htmlFor='stateStandards' className='label'>
						State Standards:
					</label>
					<input
						id='stateStandards'
						{...register("stateStandards")}
						className={`input ${errors.stateStandards ? "error" : ""}`}
					/>
					<p className='error-message'>{errors.stateStandards?.message}</p>

					<label htmlFor='focusPoints' className='label'>
						Focus Points:
					</label>
					<input
						id='focusPoints'
						{...register("focusPoints")}
						className={`input ${errors.focusPoints ? "error" : ""}`}
					/>
					<p className='error-message'>{errors.focusPoints?.message}</p>

					<label htmlFor='priorKnowledge' className='label'>
						Prior Knowledge:
					</label>
					<input
						id='priorKnowledge'
						{...register("priorKnowledge")}
						className={`input ${errors.priorKnowledge ? "error" : ""}`}
					/>
					<p className='error-message'>{errors.priorKnowledge?.message}</p>

					<label htmlFor='scaffoldingGoals' className='label'>
						Scaffolding Goals:
					</label>
					<input
						id='scaffoldingGoals'
						{...register("scaffoldingGoals")}
						className={`input ${errors.scaffoldingGoals ? "error" : ""}`}
					/>
					<p className='error-message'>{errors.scaffoldingGoals?.message}</p>

					<label htmlFor='targetSkills' className='label'>
						Target Skills:
					</label>
					<input
						id='targetSkills'
						{...register("targetSkills")}
						className={`input ${errors.targetSkills ? "error" : ""}`}
					/>
					<p className='error-message'>{errors.targetSkills?.message}</p>
				</div>
				{/* Other form elements */}
				<button type='submit'>Submit</button>
			</form>
		</div>
	);
};

const StepTwo = ({ nextStep, prevStep }: { nextStep: any; prevStep: any }) => {
	return (
		<div className='step-one'>
			<h2>Step 2: Review Objectives</h2>
			<div>Retrieve the generated lesson objectives, make any desired edits</div>
		</div>
	);
};

const StepThree = ({ nextStep, prevStep }: { nextStep: any; prevStep: any }) => {
	return (
		<div className='step-one'>
			<h2>Step 3: Review Assessments</h2>
			<div>Retrieve the generated assessments for the lesson objectives, make any desired edits</div>
		</div>
	);
};
const StepFour = ({ nextStep, prevStep }: { nextStep: any; prevStep: any }) => {
	return (
		<div className='step-one'>
			<h2>Step 4: Review Activities</h2>
			<div>
				Review the generated activities, make any desired edits, then either download as PDF/docx or
				continue to step 5: generate materials
			</div>
		</div>
	);
};
const StepFive = ({ nextStep, prevStep }: { nextStep: any; prevStep: any }) => {
	return (
		<div className='step-one'>
			<h2>Step 5: Review Materials</h2>
			<div>
				Review the generated materials, make any desired edits, then either download as PDF/docx or
				continue to step 5: generate materials
			</div>
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
