/** @format */

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

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

const StepOne = ({ handleNext }: { handleNext: any }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		resolver: yupResolver(schema),
	});

	const onSubmit = (data: FormData) => {
		console.log(JSON.stringify(data, null, 2));
		handleNext(data);
	};

	return (
		<div>
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
					<Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
						<Button color='inherit' disabled={true} sx={{ mr: 1 }}>
							Back
						</Button>
						<Box sx={{ flex: "1 1 auto" }} />

						<Button type='submit'>{"Next"}</Button>
					</Box>
				</form>
			</div>
		</div>
	);
};

const StepTwo = ({
	handleNext,
	handleBack,
	outputText,
	setOutputText,
}: {
	handleNext: any;
	handleBack: any;
	outputText: string;
	setOutputText: any;
}) => {
	const onSubmit = () => {
		console.log(JSON.stringify({ outputText }, null, 2));
		handleNext({ outputText });
	};

	return (
		<div>
			<div className='step-one'>
				<h2>Step 2: Review Objectives</h2>
				{outputText}
				<div>Retrieve the generated lesson objectives, make any desired edits</div>
			</div>
			<Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
				<Button color='inherit' onClick={handleBack} sx={{ mr: 1 }}>
					Back
				</Button>
				<Box sx={{ flex: "1 1 auto" }} />

				<Button onClick={onSubmit}>{"Next"}</Button>
			</Box>
		</div>
	);
};

const StepThree = ({
	handleNext,
	handleBack,
	outputText,
	setOutputText,
}: {
	handleNext: any;
	handleBack: any;
	outputText: string;
	setOutputText: any;
}) => {
	const onSubmit = () => {
		console.log(JSON.stringify({ outputText }, null, 2));
		handleNext({ outputText });
	};
	return (
		<div>
			<div className='step-one'>
				<h2>Step 3: Review Assessments</h2>
				{outputText}
				<div>
					Retrieve the generated assessments for the lesson objectives, make any desired edits
				</div>
			</div>
			<Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
				<Button color='inherit' onClick={handleBack} sx={{ mr: 1 }}>
					Back
				</Button>
				<Box sx={{ flex: "1 1 auto" }} />

				<Button onClick={onSubmit}>{"Next"}</Button>
			</Box>
		</div>
	);
};
const StepFour = ({
	handleNext,
	handleSkip,
	handleBack,
	outputText,
	setOutputText,
}: {
	handleNext: any;
	handleSkip: any;
	handleBack: any;
	outputText: string;
	setOutputText: any;
}) => {
	const onSubmit = () => {
		console.log(JSON.stringify({ outputText }, null, 2));
		handleNext({ outputText });
	};
	return (
		<div>
			<div className='step-one'>
				<h2>Step 4: Review Activities</h2>
				{outputText}
				<div>
					Review the generated activities, make any desired edits, then either download as PDF/docx
					or continue to step 5: generate materials
				</div>
			</div>
			<Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
				<Button color='inherit' onClick={handleBack} sx={{ mr: 1 }}>
					Back
				</Button>
				<Box sx={{ flex: "1 1 auto" }} />
				<Button color='inherit' onClick={handleSkip} sx={{ mr: 1 }}>
					Skip
				</Button>
				<Button onClick={onSubmit}>{"Next"}</Button>
			</Box>
		</div>
	);
};
const StepFive = ({
	handleNext,
	handleBack,
	outputText,
	setOutputText,
}: {
	handleNext: any;
	handleBack: any;
	outputText: string;
	setOutputText: any;
}) => {
	const onSubmit = () => {
		console.log(JSON.stringify({ outputText }, null, 2));
		handleNext({ outputText });
	};
	return (
		<div>
			<div className='step-one'>
				<h2>Step 5: Review Materials</h2>
				{outputText}
				<div>
					Review the generated materials, make any desired edits, then either download as PDF/docx
					or continue to step 5: generate materials
				</div>
			</div>
			<Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
				<Button color='inherit' onClick={handleBack} sx={{ mr: 1 }}>
					Back
				</Button>
				<Box sx={{ flex: "1 1 auto" }} />

				<Button onClick={onSubmit}>{"Finish"}</Button>
			</Box>
		</div>
	);
};

export { StepOne, StepTwo, StepThree, StepFour, StepFive };
