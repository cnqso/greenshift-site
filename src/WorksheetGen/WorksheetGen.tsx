/** @format */

import { useState, useRef, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { XButton } from "../assets/SVGs";
import Select from "react-select";
import type { ListItems } from "../@types/readability.types";
import NeuralNetworkGen from "../assets/NeuralNetworkGen";
import "./WorksheetGen.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import WorksheetInfoBar from "./WorksheetInfoBar";
import { ErrorContext } from "../assets/errors";

const modules = {
	toolbar: [],
	clipboard: {
		// toggle to add extra line breaks when pasting HTML:
		matchVisual: false,
	},
};
const formats = ["size", "bold", "italic", "underline", "list", "bullet", "background"];

const questionOptions = [
	{ value: "short answer questions", label: "Short Answer Questions" },
	{ value: "essay questions", label: "Essay Questions" },
	{ value: "multiple choice questions", label: "Multiple Choice Questions" },
	{ value: "true or false questions", label: "True/False Questions" },
];

function removeItem<T>(arr: T[], item: T) {
	const index = arr.indexOf(item);
	if (index > -1) arr.splice(index, 1);
}

const RemoveGenerationButton = ({ onClick }: { onClick: React.MouseEventHandler<HTMLDivElement> }) => {
	return (
		<div className='RemoveGenerationButton' onClick={onClick}>
			<XButton />
		</div>
	);
};

const UpDownSelector = ({ items, setItems, id }: { items: any; setItems: Function; id: number }) => {
	const thisItem = items[id];

	const onUp = () => {
		if (thisItem.quant < 10) {
			const newItems = { ...items };
			newItems[id].quant += 1;
			setItems(newItems);
		}
	};

	const onDown = () => {
		if (thisItem.quant > 0) {
			const newItems = { ...items };
			newItems[id].quant -= 1;
			setItems(newItems);
		}
	};

	return (
		<span style={{ fontSize: "1.3em", display: "flex" }}>
			<div style={{ marginTop: "2px" }}>{thisItem.quant}</div>
			<div className='up-down-selector' tabIndex={0}>
				<button className='triangle-button' onClick={onUp}>
					<svg width='20' height='25' viewBox='0 0 15 10'>
						<path d='M0,10 L7.5,0 L15,10 Z' fill='currentColor' />
					</svg>
				</button>
				<button className='triangle-button' onClick={onDown}>
					<svg width='20' height='25' viewBox='0 0 15 15'>
						<path d='M0,0 L7.5,10 L15,0 Z' fill='currentColor' />
					</svg>
				</button>
			</div>
		</span>
	);
};

function optionsToTextRequest(options: any) {
	let textRequests: string[] = [];
	const keys = Object.keys(options);
	for (const key of keys) {
		const thisOption = options[key];
		let newRequest =
			"Please generate " +
			thisOption.quant +
			" " +
			thisOption.selection.value +
			" to test for understanding of " +
			thisOption.text;
		textRequests.push(newRequest);
	}

	return textRequests;
}

const SelectOption = ({
	id,
	items,
	setItems,
	removeGen,
}: {
	id: number;
	items: any;
	setItems: any;
	removeGen: any;
}) => {
	const thisSelectOptionRef = useRef(null);
	// const thisItem = items[id];
	const [HTMLText, setHTMLText] = useState(items[id].text);

	const handleChange = (e: any) => {
		const newItems = JSON.parse(JSON.stringify(items));
		console.log(JSON.stringify(newItems[id].selection, null, 2));
		newItems[id].selection.value = e.value;
		newItems[id].selection.label = e.label;
		setItems(newItems);
	};

	function handleTextChange(content: string, delta: any, source: any, editor: any) {
		setHTMLText(content);
		setItems({ ...items, [id]: { ...items[id], text: editor.getText() } });
	}

	return (
		<span className='worksheetGenListItem'>
			<span style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
			<UpDownSelector items={items} setItems={setItems} id={id} />
			<span style={{padding: 5}}/>
			<Select
				key={id}
				options={questionOptions}
				defaultValue={items[id].selection}
				onChange={handleChange}
				theme={(theme) => ({
					...theme,
					borderRadius: 0,
					colors: {
						...theme.colors,
						primary50: "2e2e2e",
						primary25: "#dddddd",
						neutral10: "black",
						primary: "black",
					},
				})}
			/></span>

			<span className='toTestFor'>to test for understanding of</span>
			<span className='worksheetInfoTextBox'>
				<ReactQuill
					ref={thisSelectOptionRef}
					theme='snow'
					value={HTMLText}
					onChange={handleTextChange}
					modules={modules}
					formats={formats}
				/>
			</span>
			<RemoveGenerationButton onClick={removeGen} />
		</span>
	);
};

function SelectOptions({
	submitGenerate,
	items,
	setItems,
	loading,
	setGenerationVisible,
}: {
	submitGenerate: React.MouseEventHandler<HTMLButtonElement>;
	items: any;
	setItems: Function;
	loading: boolean;
	setGenerationVisible: Function;
}) {
	const [count, setCount] = useState(0);

	return (
		<div className='worksheetGenList'>
			<div className='controls'>
				<label className='enable'></label>
			</div>
			<ul>
				<AnimatePresence mode={"popLayout"}>
					{Object.entries(items).map(([key, value]) => (
						<motion.li
							layout
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.8, opacity: 0 }}
							transition={{ type: "spring" }}
							key={key}
							style={{ marginBottom: "-15px" }}>
							<SelectOption
								id={parseInt(key, 10)}
								items={items}
								setItems={setItems}
								removeGen={() => {
									if (Object.keys(items).length > 1) {
										const newItems = { ...items };
										delete newItems[parseInt(key, 10)];
										setItems(newItems);
									}
								}}
							/>
						</motion.li>
					))}
				</AnimatePresence>
			</ul>

			<motion.div layout className='readabilityButtons' style={{ marginTop: "-13px" }}>
				{loading ? (
					<NeuralNetworkGen />
				) : (
					<>
						<button
							style={{ marginRight: "10px" }}
							onClick={() => {
								const i: number = count;

								if (Object.keys(items).length > 4) return;
								setItems({
									...items,
									[i + 1]: {
										selection: {
											value: "short answer questions",
											label: "Short Answer Questions",
										},
										quant: 3,
										text: "",
									},
								});
								setCount(i + 1);
							}}>
							Add item
						</button>
						<button style={{ marginRight: "10px" }} onClick={submitGenerate}>
							Generate
						</button>
					</>
				)}
			</motion.div>
		</div>
	);
}

export default function WorksheetGen({
	sendToCluod,
	premiumModel,
	setPremiumModel,
}: {
	sendToCluod: Function;
	premiumModel: boolean;
	setPremiumModel: Function;
}) {
	const [generationItems, setGenerationItems] = useState({
		0: {
			selection: { value: "short answer questions", label: "Short Answer Questions" },
			quant: 3,
			text: "",
		},
	});
	const [loading, setLoading] = useState(false);
	const [generationVisible, setGenerationVisible] = useState(true);
	const [generationText, setGenerationText] = useState("");
	const [gradeLevel, setGradeLevel] = useState(5);
	function replaceMarkdownWithHTML(input: string): string {
		let output = input.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
		return output;
	}
	const { setError } = useContext(ErrorContext);

	async function submitGenerate(e: any) {
		e.preventDefault();
		setLoading(true);
		const body = {
			generation_requests: generationItems,
		};
		const data = await sendToCluod("worksheetgenerate", body, setError);

		if (data) {
			let newHTMLText = "";
			console.log(data.generation_data);
			const genKeys = Object.keys(generationItems);
			for (let i = 0; i < genKeys.length; i++) {
				newHTMLText += `<div><h4>${"capitalizedType"}</h4>${replaceMarkdownWithHTML(
					data.generation_data[i]
				)}</div>`;
			}
			setGenerationText(newHTMLText);
		} else {
			console.error("An error occurred while fetching the generated text.");
		}
		setLoading(false);
	}

	return (
		<div>
			<WorksheetInfoBar
				gradeLevel={gradeLevel}
				setGradeLevel={setGradeLevel}
				premiumModel={premiumModel}
				setPremiumModel={setPremiumModel}
			/>
			<br />
			<SelectOptions
				submitGenerate={submitGenerate}
				items={generationItems}
				setItems={setGenerationItems}
				loading={loading}
				setGenerationVisible={setGenerationVisible}
			/>
			<div style={{ marginTop: "-15px" }} dangerouslySetInnerHTML={{ __html: generationText }} />
		</div>
	);
}
