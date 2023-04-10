/** @format */

import React, { useState, useEffect, useRef } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import NeuralNetworkGen from './NeuralNetworkGen'

const modules = {
	toolbar: [],
	clipboard: {
		// toggle to add extra line breaks when pasting HTML:
		matchVisual: false,
	},
};
const formats = ["size", "bold", "italic", "underline", "list", "bullet", "background"];

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

const SvgButton = ({ onClick }: { onClick: React.MouseEventHandler<HTMLDivElement> }) => {
	return (
		<div className='svg-button-container' onClick={onClick}>
			<svg
				width='24'
				height='24'
				viewBox='0 0 24 24'
				stroke='currentColor'
				strokeWidth='2'
				strokeLinecap='round'
				strokeLinejoin='round'>
				<line x1='18' y1='6' x2='6' y2='18'></line>
				<line x1='6' y1='6' x2='18' y2='18'></line>
			</svg>
		</div>
	);
};

export default function App() {
	const [HTMLText, setHTMLText] = useState("Write something");
	const [plainText, setPlainText] = useState("Write something");
	const [responseText, setResponseText] = useState("");
	const [cleanText, setCleanText] = useState(true);
	const [loading, setLoading] = useState(false);
	const quillRef = useRef(null);

	function handleChange(content: string, delta: any, source: any, editor: any) {
		setHTMLText(content);
		setPlainText(editor.getText());
		setCleanText(hasInvalidElements(content));
	}

	const sendToCluodAnalyze = async (inputText: string) => {
		// Way too fast to see the loading screen. Might change in production.
		// setLoading(true);
		const response = await fetch("http://localhost:8000/api/reverse/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ text: inputText }),
		});

		if (response.ok) {
			const data = await response.json();
			setHTMLText(data.analyzed_text);
			console.log(JSON.stringify(data, null, 2));
			// setLoading(false);
		} else {
			console.error("An error occurred while fetching the reversed text.");
			// setLoading(false);
		}
	
	};

	const sendToCluodGPT = async (inputText: string) => {
		setLoading(true);

		const response = await fetch("http://localhost:8000/api/readability/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				user_token: "WilliamKelly",
				desired_reading_level: 12,
				texts: [inputText],
			}),
		});

		if (response.ok) {
			const data = await response.json();
			console.log(JSON.stringify(data, null, 2));
			setResponseText(`<div>${data.readability_data.output}</div>`);
			setLoading(false);
		} else {
			console.error("An error occurred while fetching the reversed text.");
			setLoading(false);
		}
	};

	function clearFormattingHandler() {
		setHTMLText(clearFormatting(HTMLText));
		setCleanText(true);
	}

	function submitAnalyze(e: any) {
		e.preventDefault();
		// console.log(plainText);
		sendToCluodAnalyze(plainText);
	}

	function submitGPT(e: any) {
		e.preventDefault();
		// console.log(plainText);
		sendToCluodGPT(plainText);
	}

	return (
		<>
			<div style={{ position: "relative", marginBottom: "10px" }}>
				{/* <SvgSpinner /> */}
				{cleanText ? null : <SvgButton onClick={clearFormattingHandler} />}
				<ReactQuill
					ref={quillRef}
					theme='snow'
					value={HTMLText}
					onChange={handleChange}
					modules={modules}
					formats={formats}
					bounds={".RichText"}
				/>
			</div>
			{loading ? (
				<NeuralNetworkGen />
			) : (
				<div className="buttons">
					<button style={{ marginRight: "10px" }} onClick={submitAnalyze}>
						Analyze
					</button>
					<button style={{ marginRight: "10px" }} onClick={submitGPT}>
						Simplify
					</button>
				</div>
			)}
			<div className='responseBox'>
				<div dangerouslySetInnerHTML={{ __html: responseText }} />
			</div>
			<br/>
			<div className='responseBox'>
				<div>{HTMLText}</div>
			</div>
		</>
	);
}
