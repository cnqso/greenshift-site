/** @format */

import React, { useState, useEffect, useRef } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import NeuralNetworkGen from "../assets/NeuralNetworkGen";
import InfoBar from "./InfoBar";
import SelectOptions from "./SelectOptions";
import { Auth } from "aws-amplify";
import { XButton } from "../assets/SVGs";
import type { ListItems, GenerationRequest } from "../@types/readability.types";
import { motion } from "framer-motion";
import { Collapse } from "react-collapse";
import {sendToCluod} from "../requests"

const modules = {
	toolbar: [],
	clipboard: {
		// toggle to add extra line breaks when pasting HTML:
		matchVisual: false,
	},
};
const formats = ["size", "bold", "italic", "underline", "list", "bullet", "background"];

function orderText(n: number): string {
	const suffix = ["th", "st", "nd", "rd", "th"][Math.min(n % 10, 4)];
	if (11 <= n % 100 && n % 100 <= 13) {
		return n.toString() + "th";
	}
	return n.toString() + suffix;
}

function plainLanguageDifficulty(ARI: number): string[] {
	const plainLanguageARI: string[] = ["Kindergarten", "Elementary School"];
	const plainDifficulty: string = orderText(Math.floor(ARI));
	const fourYearNames: string[] = ["Freshman", "Sophomore", "Junior", "Senior"];

	if (ARI < 1) {
		plainLanguageARI[0] = "Kindergarten";
	} else if (ARI < 6) {
		plainLanguageARI[0] = `${plainDifficulty} Grade`;
		plainLanguageARI[1] = "Elementary School";
	} else if (ARI < 9) {
		plainLanguageARI[0] = `${plainDifficulty} Grade`;
		plainLanguageARI[1] = "Middle School";
	} else if (ARI < 13) {
		plainLanguageARI[0] = `${plainDifficulty} Grade`;
		plainLanguageARI[1] = "High School";
	} else if (ARI < 17) {
		plainLanguageARI[0] = `College ${fourYearNames[Math.floor(ARI) - 13]}`;
		plainLanguageARI[1] = "University";
	} else if (ARI < 25) {
		plainLanguageARI[0] = `${orderText(Math.floor(ARI - 16))} year grad student`;
		plainLanguageARI[1] = "Graduate School";
	} else {
		plainLanguageARI[0] = `${orderText(Math.floor(ARI - 16))} year grad student`;
		plainLanguageARI[1] = "Impenetrable";
	}

	return plainLanguageARI;
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

// Function to check if the HTML contains any elements other than <p>, <ul>, and <ol>
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

function generationObjectToRequest(items: ListItems): GenerationRequest[] {
	const tally: { [key: string]: number } = {};
	// {quantity: "3", type: "reading comprehension"}

	for (const key in items) {
		const itemType = items[key].selection.value;
		const itemQuantity = items[key].quant;

		if (tally[itemType]) {
			tally[itemType] += itemQuantity;
		} else {
			tally[itemType] = itemQuantity;
		}
	}

	const tallyList: GenerationRequest[] = Object.entries(tally).map(([type, quantity]) => {
		return {
			type: type,
			quantity: quantity.toString(),
		};
	});

	return tallyList;
}

export default function RichText() {
	const [HTMLText, setHTMLText] = useState("Write something");
	const [plainText, setPlainText] = useState("Write something");
	const [generationText, setGenerationText] = useState("");
	const [cleanText, setCleanText] = useState(true);
	const [loading, setLoading] = useState(false);
	const [currentReadability, setCurrentReadability] = useState("N/A");
	const [targetReadability, setTargetReadability] = useState(5);
	const [generationVisible, setGenerationVisible] = useState(false);
	const quillRef = useRef(null);
	const [generationItems, setGenerationItems] = useState({
		0: { selection: { value: "reading comprehension", label: "Comprehension" }, quant: 3 },
	});


	async function submitAnalyze(e: any) {
		e.preventDefault();
		setLoading(true);
		const body = { text: plainText, target_readability: targetReadability };
		const data = await sendToCluod("analyze", body);
		if (data) {
			setHTMLText(data.analyzed_text);
			setCurrentReadability(data.readability.text_ari[1] + ", " + data.readability.text_ari[0]);
		} else {
			// Error handling

		}
		setLoading(false);
	}

	async function submitGPT(e: any) {
		e.preventDefault();
		setLoading(true);
		const body = { desired_reading_level: targetReadability, texts: [plainText] };
		const data = await sendToCluod("simplify", body);
		if (data) {
			setHTMLText(`<div>${data.readability_data.output}</div>`);
		} else {
			console.error("An error occurred while fetching the simplified text.");
		}
		setLoading(false);
	}

	async function submitGenerate(e: any) {
		e.preventDefault();
		setLoading(true);
		const requestArray: GenerationRequest[] = generationObjectToRequest(generationItems);
		const body = {
			desired_reading_level: targetReadability,
			texts: [plainText],
			generation_requests: requestArray,
		};
		const data = await sendToCluod("readabilitygenerate", body);

		if (data) {
			let newHTMLText = "";
			for (let i = 0; i < data.generation_data.length; i++) {
				const capitalizedType =
					requestArray[i].type.charAt(0).toUpperCase() +
					requestArray[i].type.slice(1) +
					" questions";
				newHTMLText += `<div><h4>${capitalizedType}</h4>${data.generation_data[i]}</div>`;
			}
			setGenerationText(newHTMLText);
		} else {
			console.error("An error occurred while fetching the generated text.");
		}
		setLoading(false);
	}

	function handleChange(content: string, delta: any, source: any, editor: any) {
		setHTMLText(content);
		setPlainText(editor.getText());
		setCleanText(hasInvalidElements(content));
	}

	function clearFormattingHandler() {
		setHTMLText(clearFormatting(HTMLText));
		setCleanText(true);
	}

	const plainLangTarget = plainLanguageDifficulty(targetReadability);
	const plainLangTargetString = plainLangTarget[1] + ", " + plainLangTarget[0];

	return (
		<>
			<InfoBar
				currentReadability={currentReadability}
				targetReadability={targetReadability}
				setTargetReadability={setTargetReadability}
			/>
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

			{loading ? (
				<NeuralNetworkGen />
			) : (
				<div className='buttons'>
					<button style={{ marginRight: "10px" }} onClick={submitAnalyze}>
						Analyze
					</button>
					<button style={{ marginRight: "10px" }} onClick={submitGPT}>
						Simplify
					</button>
				</div>
			)}

			<Collapse isOpened={!generationVisible}>
				<div
					className='collapseBar'
					onClick={() => {
						setGenerationVisible(!generationVisible);
					}}>
					Add reading questions
				</div>
			</Collapse>
			<Collapse isOpened={generationVisible}>
				<SelectOptions
					submitGenerate={submitGenerate}
					items={generationItems}
					setItems={setGenerationItems}
					loading={loading}
					setGenerationVisible={setGenerationVisible}
				/>
				{generationText ? (
					<motion.div layout className='responseBox'>
						<div
							style={{ marginTop: "-15px" }}
							dangerouslySetInnerHTML={{ __html: generationText }}
						/>
					</motion.div>
				) : null}
			</Collapse>
		</>
	);
}
