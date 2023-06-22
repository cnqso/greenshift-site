/** @format */

import { useState, ReactNode, useContext } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import { StepOne, StepTwo, StepThree, StepFour, StepFive } from "./LessonStep";
import type { LessonPlan } from "../@types/lessonPlan.types";
import NeuralNetworkGen from "../assets/NeuralNetworkGen";
import "./LessonPlan.css";
import LessonPDF from "./LessonPDF";
import {ErrorContext} from "../assets/errors";

const steps = ["Information", "Objectives", "Assessments", "Procedure", "Materials"];

function StepContent({
	step,
	handleNext,
	handleBack,
	outputText,
	setOutputText,
	premiumModel,
	setPremiumModel,
	setError,
}: {
	step: number;
	handleNext: any;
	handleBack: any;
	outputText: LessonPlan;
	setOutputText: any;
	premiumModel: boolean;
	setPremiumModel: any;
	setError: any;
}) {
	switch (step) {
		case 0:
			return <StepOne handleNext={handleNext} premiumModel={premiumModel} setPremiumModel={setPremiumModel}  setError={setError}/>;
		case 1:
			return (
				<StepTwo
					handleNext={handleNext}
					handleBack={handleBack}
					outputText={outputText}
					setOutputText={setOutputText}
				/>
			);
		case 2:
			return (
				<StepThree
					handleNext={handleNext}
					handleBack={handleBack}
					outputText={outputText}
					setOutputText={setOutputText}
				/>
			);
		case 3:
			return (
				<StepFour
					handleNext={handleNext}

					handleBack={handleBack}
					outputText={outputText}
					setOutputText={setOutputText}
				/>
			);
		case 4:
			return (
				<StepFive
					handleNext={handleNext}
					handleBack={handleBack}
					outputText={outputText}
					setOutputText={setOutputText}
				/>
			);
		default:
			return <div />;
	}
}


export default function LessonPlan({sendToCluod, premiumModel, setPremiumModel}: {sendToCluod: Function, premiumModel: boolean, setPremiumModel: Function}) {
	const [activeStep, setActiveStep] = useState(0);
	const [skipped, setSkipped] = useState(new Set<number>());
	const [outputText, setOutputText] = useState<LessonPlan>({
		specification: {
			subject: "History",
			topic: "The Civil War",
			gradeLevel: 12,
			stateStandards: null,
			focusPoints: null,
			priorKnowledge: null,
			scaffoldingGoals: null,
			targetSkills: null,
		},
		swbat: "",
		assessments: "",
		activities: "",
		materials: "",
	});
	const [loading, setLoading] = useState<boolean>(false);
	const {setError} = useContext(ErrorContext);

	const submitStep = async (input: any) => {
		setLoading(true);
		let body = {step: activeStep, lessonPlan: outputText};
		if (activeStep === 0) {
			body.lessonPlan.specification = input;
			setOutputText({...outputText, specification: input});
		}
		console.log(JSON.stringify(body, null, 2))

		const data = await sendToCluod("lessonplan", body, setError);
		const parsedData = JSON.parse(data.lessonPlan);
		if (parsedData) {
			console.log(parsedData);
		} else {
			console.error("An error occurred while fetching the simplified text.");
			return false;
		}
		setLoading(false);
		return {parsedData};
	};

	const isStepOptional = (step: number) => {
		return step === null;
	};

	const isStepSkipped = (step: number) => {
		return skipped.has(step);
	};

	const handleNext = async (data: any, step: number = 1) => {
		if (step !== 1) {
			setActiveStep(5);
			return;
		}
		let newSkipped = skipped;
		if (isStepSkipped(activeStep)) {
			newSkipped = new Set(newSkipped.values());
			newSkipped.delete(activeStep);
		}

		const serverOutput = await submitStep(data);
		console.log(serverOutput);
		if (serverOutput) {
			setOutputText(serverOutput.parsedData);
			setActiveStep((prevActiveStep) => prevActiveStep + 1);
		} else {
			console.error("An error occurred while fetching the simplified text.");
		}

		setSkipped(newSkipped);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	

	const handleReset = () => {
		setActiveStep(0);
	};

	return (
		<div className="lessonPlan">
			<Stepper activeStep={activeStep}>
				{steps.map((label, index) => {
					const stepProps: { completed?: boolean } = {};
					const labelProps: {
						optional?: ReactNode;
					} = {};
					if (isStepSkipped(index)) {
						stepProps.completed = false;
					}
					return (
						<Step key={label} {...stepProps}>
							<StepLabel {...labelProps}>{label}</StepLabel>
						</Step>
					);
				})}
			</Stepper>

			{activeStep === 5 ? (
				<div>
					<h2 style={{marginBottom: 0, marginTop: 12}}>All Set!</h2>
					<LessonPDF outputText={outputText}/>
					<Box sx={{ display: "flex", justifyContent: "center" }}>

						<button onClick={handleReset}>Reset</button>
					</Box>
				</div>
			) : loading ? (
				<NeuralNetworkGen />
			) : (
				<>
					<StepContent
						step={activeStep}
						handleNext={handleNext}
						handleBack={handleBack}
						outputText={outputText}
						setOutputText={setOutputText}
						premiumModel={premiumModel}
						setPremiumModel={setPremiumModel}
						setError={setError}
					/>
				</>
			)}
		</div>
	);
}
