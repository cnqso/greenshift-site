/** @format */

import React, { useState, useEffect, useRef } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";

const modules = {
	toolbar: [
		["clean"],
	],
	clipboard: {
		// toggle to add extra line breaks when pasting HTML:
		matchVisual: false,
	},
};
const formats = ["header", "font", "size", "bold", "italic", "underline", "list", "bullet", "background"];


function htmlToPlainText(html: string): string {
	// Create a DOMParser to parse the input HTML
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, "text/html");
	// Replace the desired tags with their respective markdown equivalents
	function replaceTags(element: Element): void {
	  Array.from(element.children).forEach((child) => {
		if (child.tagName.toLowerCase() === "p") {
		  child.textContent = `${child.textContent}\n`;
		}
		replaceTags(child);
	  });
	}
	replaceTags(doc.body);
	// Recursively traverse the DOM tree and create a plain text string
	function getText(node: Node): string {
	  if (node.nodeType === Node.TEXT_NODE) {
		return node.textContent || "";
	  }
	  let text = "";
	  Array.from(node.childNodes).forEach((child) => {
		text += getText(child);
	  });
	  return text;
	}
	return getText(doc.body);
  }

export default function App() {
	const [HTMLText, setHTMLText] = useState("Write something");
	const [plainText, setPlainText] = useState("Write something");
	const [responseText, setResponseText] = useState("");
	const quillRef = useRef(null);

	function handleChange(content, delta, source, editor) {
		setHTMLText(content);
		const newText = htmlToPlainText(content);
		setPlainText(newText);
		setPlainText(editor.getText());
	}

	const sendToCluodAnalyze = async (inputText: string) => {
		const response = await fetch("http://localhost:8000/api/reverse/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ text: inputText }),
		});

		if (response.ok) {
			const data = await response.json();
			setHTMLText(data.analyzed_text)
			console.log(JSON.stringify(data, null, 2));
		} else {
			console.error("An error occurred while fetching the reversed text.");
		}
	};

	const sendToCluodGPT = async (inputText: string) => {
		const response = await fetch("http://localhost:8000/api/readability/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ user_token: "WilliamKelly", desired_reading_level: 5, texts: [inputText] }),
		});

		if (response.ok) {
			const data = await response.json();
			console.log(JSON.stringify(data.readability_data[0].output, null, 2));
			setResponseText(`<div>${data.readability_data[0].output}</div>`);
			
		} else {
			console.error("An error occurred while fetching the reversed text.");
		}
	};

	function submitAnalyze(e: any) {
		e.preventDefault();
		console.log(plainText);
		sendToCluodAnalyze(plainText);
	}

	function submitGPT(e: any) {
		e.preventDefault();
		console.log(plainText);
		sendToCluodGPT(plainText);
	}

	// For later integration with the backend

	// function highlightLongSentences(quill) {
	// 	const text = quill.getText();
	// 	const sentences = text.split(".");

	// 	let index = 0;
	// 	for (const sentence of sentences) {
	// 		if (sentence.length > 30) {
	// 			quill.formatText(index, sentence.length+1, "bold", true);
	// 		}
	//         else {
	//             quill.formatText(index, sentence.length+1, "bold", false);
	//         }
	// 		index += sentence.length+1;
	// 	}
	// }

	// useEffect(() => {
	// 	if (quillRef.current) {
	// 		const quill = quillRef.current.getEditor();
	// 		highlightLongSentences(quill);
	// 	}
	// }, [plainText]);

	return (
		<>
			<ReactQuill
				ref={quillRef}
				theme='snow'
				value={HTMLText}
				onChange={handleChange}
				modules={modules}
				formats={formats}
				bounds={".RichText"}
			/>
			<br />
			<button style={{marginRight: "10px"}} onClick={submitAnalyze}>Analyze</button>
			<button style={{marginLeft: "10px"}}onClick={submitGPT}>Simplify</button>
			<br />
			<br />
			<div className='responseBox'>
				<div dangerouslySetInnerHTML={{ __html: responseText }} />
			</div>
			<div className='responseBox'>
				<div>{HTMLText}</div>
			</div>
		</>
	);
}
