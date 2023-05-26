/** @format */

import React, { useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { LessonPlan } from "../@types/lessonPlan.types";
import { XButton } from "../assets/SVGs";

const modules = {
	toolbar: [],
	clipboard: {
		// toggle to add extra line breaks when pasting HTML:
		matchVisual: false,
	},
};
const formats = ["size", "bold", "italic", "underline", "list", "bullet", "background"];

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

function outputTextToHTML(inputString: string): string {
	let html_output = "";
	if (inputString) {
		let swbat = inputString.split("\n");
		html_output += swbat.map((paragraph) => `<p>${paragraph}</p>`).join("");
	}

	return html_output;
}

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

export default function TextBox({
	outputText,
	setOutputText,
}: {
	outputText: LessonPlan;
	setOutputText: any;
}) {
	const objectivesRef = useRef(null);
	const assessmentsRef = useRef(null);
    const activitiesRef = useRef(null);
    const materialsRef = useRef(null);
	// const [cleanText, setCleanText] = useState(true);
	const [swbatHTMLText, setSwbatHTMLText] = useState(outputTextToHTML(outputText.swbat));
	const [assessmentsHTMLText, setAssessmentsHTMLText] = useState(outputTextToHTML(outputText.assessments));
    const [activitiesHTMLText, setActivitiesHTMLText] = useState(outputTextToHTML(outputText.activities));
    const [materialsHTMLText, setMaterialsHTMLText] = useState(outputTextToHTML(outputText.materials));

	// function clearFormattingHandler() {
	// 	setSwbatHTMLText(clearFormatting(swbatHTMLText));
	// 	setCleanText(true);
	// }

	function swbatHandleChange(content: string, delta: any, source: any, editor: any) {
		setSwbatHTMLText(content);
		setOutputText({ ...outputText, swbat: editor.getText() });
		// setCleanText(hasInvalidElements(content));
	}
	function assessmentsHandleChange(content: string, delta: any, source: any, editor: any) {
		setAssessmentsHTMLText(content);
		setOutputText({ ...outputText, assessments: editor.getText() });
	}
    function activitiesHandleChange(content: string, delta: any, source: any, editor: any) {
		setActivitiesHTMLText(content);
		setOutputText({ ...outputText, activities: editor.getText() });
	}
    function materialsHandleChange(content: string, delta: any, source: any, editor: any) {
		setMaterialsHTMLText(content);
		setOutputText({ ...outputText, materials: editor.getText() });
	}

	return (
		<div className='lessonPlanEditor'>
			<div className="subject">
				{outputText.specification.topic}
			</div>
			<div className='objectives lessonPlanTextBox'>
				<h4 className="textBoxLabel">Objectives</h4>
				{/* {cleanText ? null : <ClearFormattingButton onClick={clearFormattingHandler} />} */}
				<ReactQuill
					ref={objectivesRef}
					theme='snow'
					value={swbatHTMLText}
					onChange={swbatHandleChange}
					modules={modules}
					formats={formats}
				/>
			</div>
			<div className='assessments lessonPlanTextBox'>
			<h4 className="textBoxLabel">Assessments</h4>
				<ReactQuill
					ref={assessmentsRef}
					theme='snow'
					value={assessmentsHTMLText}
					onChange={assessmentsHandleChange}
					modules={modules}
					formats={formats}
				/>
			</div>
			<div className='activities lessonPlanTextBox'>
            <h4 className="textBoxLabel">Activities</h4>
				<ReactQuill
					ref={activitiesRef}
					theme='snow'
					value={activitiesHTMLText}
					onChange={activitiesHandleChange}
					modules={modules}
					formats={formats}
				/>
			</div>
			<div className='materials lessonPlanTextBox'>
            <h4 className="textBoxLabel">Materials</h4>
				<ReactQuill
					ref={materialsRef}
					theme='snow'
					value={materialsHTMLText}
					onChange={materialsHandleChange}
					modules={modules}
					formats={formats}
				/>
			</div>
		</div>
	);
}
