/** @format */

import React, { useState, useEffect, useRef } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";



const modules = {
	toolbar: [
		[{ header: "1" }, { header: "2" }],
		["bold", "italic", "underline"],
		[{ list: "ordered" }, { list: "bullet" }],
	],
	clipboard: {
		// toggle to add extra line breaks when pasting HTML:
		matchVisual: false,
	},
};
const formats = ["header", "font", "size", "bold", "italic", "underline", "list", "bullet"];

export default function App() {
	const [HTMLText, setHTMLText] = useState("Write something");
	const [plainText, setPlainText] = useState("Write something");
	const [responseText, setResponseText] = useState("No Response Yet");
	const quillRef = useRef(null);

	function handleChange(content, delta, source, editor) {
		setHTMLText(content);
		setPlainText(editor.getText());
	}

	const sendToCluod = async (inputText: string) => {
		const response = await fetch('http://localhost:8000/api/reverse/', {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({ text: inputText }),
		});
	
		if (response.ok) {
		  const data = await response.json();
		  setResponseText(data.reversed_text);
		  console.log(JSON.stringify(data, null, 2))
		} else {
		  console.error('An error occurred while fetching the reversed text.');
		}
	  };


	function submit(e: any) {
		e.preventDefault();
		console.log(plainText);
		sendToCluod(plainText);
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
        <br/>
        <button onClick={submit}>Submit</button>
		<br/>
		<div className="responseBox">
		<div dangerouslySetInnerHTML={{ __html: responseText}}/>
		</div>
        </>

	);
}
