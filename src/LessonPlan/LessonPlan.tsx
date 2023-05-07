/** @format */

import React, { useState, ReactNode } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { StepOne, StepTwo, StepThree, StepFour, StepFive } from "./LessonStep";
import { sendToCluod } from "../requests";
import NeuralNetworkGen from "../assets/NeuralNetworkGen";

const steps = ["Objectives", "Assessments", "Activities", "Materials", "Review"];

function StepContent({
	step,
	handleNext,
	handleSkip,
	handleBack,
	outputText,
	setOutputText,
}: {
	step: number;
	handleNext: any;
	handleSkip: any;
	handleBack: any;
	outputText: string;
	setOutputText: any;
}) {
	switch (step) {
		case 0:
			return <StepOne handleNext={handleNext} />;
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
					handleSkip={handleSkip}
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

interface LessonPlanRequest {
	subject: string;
	topic: string;
	gradeLevel: number;
	stateStandards: string | null;
	focusPoints: string | null;
	priorKnowledge: string | null;
	scaffoldingGoals: string | null;
	targetSkills: string | null;
}

// Form in StepContent in submitted to backend
// Show loading screen while waiting for backend
// Receive response from backend and display on the next step

//submitToBackend() function which returns either the display information or false
// submitToBackend() is placed in handleNext
// handleNext takes in the form information

// handleNext() then passes the form information to a state variable

export default function HorizontalLinearStepper() {
	const [activeStep, setActiveStep] = useState(0);
	const [skipped, setSkipped] = useState(new Set<number>());
	const [outputText, setOutputText] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	const submitStep = async (input: any) => {
		setLoading(true);

		const body = { step: activeStep, input: input };
		const data = await sendToCluod("lessonplan", body);
		if (data) {
			console.log(data);
		} else {
			console.error("An error occurred while fetching the simplified text.");
			return false;
		}
		setLoading(false);
		return data;
	};

	const isStepOptional = (step: number) => {
		return step === 3;
	};

	const isStepSkipped = (step: number) => {
		return skipped.has(step);
	};

	const handleNext = async (data: any) => {
		let newSkipped = skipped;
		if (isStepSkipped(activeStep)) {
			newSkipped = new Set(newSkipped.values());
			newSkipped.delete(activeStep);
		}

		const serverOutput = await submitStep(data);
		if (serverOutput) {
			setOutputText(serverOutput.lessonPlan);
			setActiveStep((prevActiveStep) => prevActiveStep + 1);
		} else {
			console.error("An error occurred while fetching the simplified text.");
		}

		setSkipped(newSkipped);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const handleSkip = () => {
		if (!isStepOptional(activeStep)) {
			// You probably want to guard against something like this,
			// it should never occur unless someone's actively trying to break something.
			throw new Error("You can't skip a step that isn't optional.");
		}

		setActiveStep((prevActiveStep) => prevActiveStep + 1);
		setSkipped((prevSkipped) => {
			const newSkipped = new Set(prevSkipped.values());
			newSkipped.add(activeStep);
			return newSkipped;
		});
	};

	const handleReset = () => {
		setActiveStep(0);
	};

	return (
		<Box sx={{ width: "100%" }}>
			<Stepper activeStep={activeStep}>
				{steps.map((label, index) => {
					const stepProps: { completed?: boolean } = {};
					const labelProps: {
						optional?: ReactNode;
					} = {};
					if (isStepOptional(index)) {
						labelProps.optional = <Typography variant='caption'>Optional</Typography>;
					}
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

			{activeStep === steps.length ? (
				<div>
					<Typography sx={{ mt: 2, mb: 1 }}>All steps completed - you&apos;re finished</Typography>
					<Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
						<Box sx={{ flex: "1 1 auto" }} />
						<Button onClick={handleReset}>Reset</Button>
					</Box>
				</div>
			) : loading ? (
				<NeuralNetworkGen />
			) : (
				<>
					<StepContent
						step={activeStep}
						handleNext={handleNext}
						handleSkip={handleSkip}
						handleBack={handleBack}
						outputText={outputText}
						setOutputText={setOutputText}
					/>
				</>
			)}
		</Box>
	);
}
