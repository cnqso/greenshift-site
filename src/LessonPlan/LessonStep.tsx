/** @format */

import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ReactQuill, { Quill } from "react-quill";
import { XButton } from "../assets/SVGs";

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



const modules = {
	toolbar: [],
	clipboard: {
		// toggle to add extra line breaks when pasting HTML:
		matchVisual: false,
	},
};
const formats = ["size", "bold", "italic", "underline", "list", "bullet", "background"];

type FormData = yup.InferType<typeof schema>;

function hasInvalidElements(html: string): boolean {
	const regex = /<(?!\/?(p|ul|ol)\b)[^>]+>/g;
	return !regex.test(html);
}

const ClearFormattingButton = ({ onClick }: { onClick: React.MouseEventHandler<HTMLDivElement> }) => {
	return (
		<div className='ClearFormattingButton' onClick={onClick}>
			<XButton />
		</div>
	);
};

function clearFormatting(html: string): string {
	// Create a DOM parser to convert the HTML string to a DOM tree
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, "text/html");
	// Recursive function to remove inline styles from all elements
	function removeStylesFromElement(element: Element) {
		// Remove the style attribute if it exists
		if (element.hasAttribute("style")) {
			element.removeAttribute("style");
		}

		// Iterate over the element's children and call this function recursively
		for (const child of Array.from(element.children)) {
			removeStylesFromElement(child);
		}
	}
	// Recursive function to remove specified elements
	function removeElements(element: Element, tagsToRemove: string[]) {
		for (const child of Array.from(element.children)) {
			// Call this function recursively for the child element
			removeElements(child, tagsToRemove);

			// Check if the child element's tag name is in the list of tags to remove
			if (tagsToRemove.includes(child.tagName.toLowerCase())) {
				// Replace the child element with its inner content
				const childContent = document.createRange().createContextualFragment(child.innerHTML);
				element.replaceChild(childContent, child);
			}
		}
	}
	// Remove styles and specified elements from the body element and all its children
	removeStylesFromElement(doc.body);
	removeElements(doc.body, ["em", "strong", "u"]);

	// Convert the cleaned DOM tree back to an HTML string and return only the inner HTML of the <body> element
	return doc.body.innerHTML;
}


const TextBox = ({HTMLText, setHTMLText, setPlainText}:{HTMLText: string, setHTMLText: any, setPlainText: any}) => {

	const quillRef = useRef(null);
	const [cleanText, setCleanText] = useState(true);

	function clearFormattingHandler() {
		setHTMLText(clearFormatting(HTMLText));
		setCleanText(true);
	}

	function handleChange(content: string, delta: any, source: any, editor: any) {
		setHTMLText(content);
		setPlainText(editor.getText());
		setCleanText(hasInvalidElements(content));
	}



	return (
		<div className='editorBox'>
		{cleanText ? null : <ClearFormattingButton onClick={clearFormattingHandler} />}
		<ReactQuill
			ref={quillRef}
			theme='snow'
			value={HTMLText}
			onChange={handleChange}
			modules={modules}
			formats={formats}
		/>
	</div>
	)
}


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

	const [HTMLText, setHTMLText] = useState(outputText.slice(1, -1));
	console.log(outputText)
	console.log(HTMLText)
	//TextBox = ({HTMLText, setHTMLText, setPlainText

	return (
		<div>
			<div className='step-one'>
				<h2>Step 2: Review Objectives</h2>
				{/* <div dangerouslySetInnerHTML={{__html: outputText}} /> */}
				<div>Retrieve the generated lesson objectives, make any desired edits</div>
				<TextBox HTMLText = {HTMLText} setHTMLText = {setHTMLText} setPlainText = {setOutputText} />
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
