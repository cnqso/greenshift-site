/** @format */

import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {MaterialUISwitch} from "../assets/utilities";


import type { LessonPlan } from "../@types/lessonPlan.types";
import TextBox from "./LessonPlanEditor";
const schema = yup.object().shape({
	subject: yup.string().required("Subject is required."),
	topic: yup.string().required("Topic is required."),
	gradeLevel: yup
		.number()
		.positive("Must be positive.")
		.integer("Must be a whole number.")
		.required("Grade is required.")
		.typeError("Must be a number."),
	stateStandards: yup.string().nullable().notRequired(),
	focusPoints: yup.string().nullable().notRequired(),
	priorKnowledge: yup.string().nullable().notRequired(),
	scaffoldingGoals: yup.string().nullable().notRequired(),
	targetSkills: yup.string().nullable().notRequired(),
});

type FormData = yup.InferType<typeof schema>;



const StepOne = ({ handleNext, premiumModel, setPremiumModel, setError }: { handleNext: any, premiumModel: boolean, setPremiumModel: any; setError: any }) => {
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

	function handleSwitch(event: React.ChangeEvent<HTMLInputElement>) {
		setPremiumModel(setError, event.target.checked);
	}

	return (
		<form className='stepOne' onSubmit={handleSubmit(onSubmit)}>
			<h3 className='stepTitle'>
				Lesson Information{" "}
				
			</h3>
			<div className='stepOneForm'>
				<label htmlFor='subject' className='label'>
					Subject* :
				</label>
				<input
					id='subject'
					{...register("subject")}
					placeholder="United States History"
					className={`input ${errors.subject ? "error" : ""}`}
				/>
				<p className='formError'>{errors.subject?.message}</p>

				<label htmlFor='topic' className='label'>
					Topic* :
				</label>
				<input id='topic' {...register("topic")} placeholder="The Cuban Missile Crisis" className={`input ${errors.topic ? "error" : ""}`} />
				<p className='formError'>{errors.topic?.message}</p>

				<label htmlFor='grade' className='label'>
					Grade Level* :
				</label>
				<input
					id='grade'
					{...register("gradeLevel")}
					placeholder="10"
					className={`input ${errors.gradeLevel ? "error" : ""}`}
				/>
				<p className='formError'>{errors.gradeLevel?.message}</p>

				<label htmlFor='focusPoints' className='label'>
					Focus Points:
				</label>
				<input
					id='focusPoints'
					{...register("focusPoints")}
					placeholder="JFK, M.A.D., Cuban Revolution"
					className={`input ${errors.focusPoints ? "error" : ""}`}
				/>
				<p className='formError'>{errors.focusPoints?.message}</p>
			</div>
			<span>{premiumModel ? "Premium Model" : "Basic Model"}</span>
			<MaterialUISwitch checked={premiumModel} onChange={handleSwitch} sx={{ m: 1 }} />
			<span className="invisibleText">{premiumModel ? "Premium Model" : "Basic Model"}</span>
			{/*This is hacky, but also I'm a genius */}
				
			<Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
				
				<div style={{ flex: "1 1 auto" }} />

				<button type='submit'>{"Next"}</button>
			</Box>
		</form>
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
	outputText: LessonPlan;
	setOutputText: any;
}) => {
	const onSubmit = () => {
		console.log(JSON.stringify({ outputText }, null, 2));
		handleNext({ outputText });
	};

	return (
		<div className='stepTwo'>
			<div>
				<br />
				<TextBox outputText={outputText} setOutputText={setOutputText} step={2} />
			</div>
			<Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
				
				<div style={{ flex: "1 1 auto" }} />

				<button onClick={onSubmit}>{"Next"}</button>
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
	outputText: LessonPlan;
	setOutputText: any;
}) => {
	const onSubmit = () => {
		console.log(JSON.stringify({ outputText }, null, 2));
		handleNext({ outputText });
	};

	return (
		<div>
			<div className='step-one'>
				<TextBox outputText={outputText} setOutputText={setOutputText} step={3} />
			</div>
			<Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>

				<Box sx={{ flex: "1 1 auto" }} />

				<button onClick={onSubmit}>{"Next"}</button>
			</Box>
		</div>
	);
};
const StepFour = ({
	handleNext,

	handleBack,
	outputText,
	setOutputText,
}: {
	handleNext: any;

	handleBack: any;
	outputText: LessonPlan;
	setOutputText: any;
}) => {
	const onSubmit = () => {
		console.log(JSON.stringify({ outputText }, null, 2));
		handleNext({ outputText });
	};

	function newPlainOutputText(newText: string) {
		setOutputText({ ...outputText, activities: newText });
	}

	return (
		<div>
			<div className='step-one'>
				<TextBox outputText={outputText} setOutputText={setOutputText} step={4} />
			</div>
			<Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>

				<Box sx={{ flex: "1 1 auto" }} />
				<button onClick={onSubmit}>{"Next"}</button>
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
	outputText: LessonPlan;
	setOutputText: any;
}) => {
	const onSubmit = () => {
		console.log(JSON.stringify({ outputText }, null, 2));
		handleNext({ outputText }, 5);
	};

	return (
		<div>
			<div className='step-one'>
				<TextBox outputText={outputText} setOutputText={setOutputText} step={5} />
			</div>
			<Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>

				<Box sx={{ flex: "1 1 auto" }} />

				<button onClick={onSubmit}>{"Finish"}</button>
			</Box>
		</div>
	);
};

export { StepOne, StepTwo, StepThree, StepFour, StepFive };
