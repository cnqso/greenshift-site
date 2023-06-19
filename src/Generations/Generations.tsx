/** @format */

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Collapse } from "react-collapse";
import { fetchUserGenerations } from "../requests";

import "./Generations.css";

const generators: any = [
	["text simplification", "textSimplification"],
	["reading question generation", "readingQuestionGeneration"],
	["lesson plan", "lessonPlan"],
	["worksheet generation", "worksheetGeneration"],
	["misformatted", "misformatted"],
];
const Tab = ({
	title,
	onTabClick,
	isActive,
}: {
	title: string;
	onTabClick: () => void;
	isActive: boolean;
}) => {
	let label = title;
	if (title === "misformatted") {
		label = "Misformatted";
	}
	if (title === "text simplification") {
		label = "Text Simplification";
	}
	if (title === "reading question generation") {
		label = "Reading Questions";
	}
	if (title === "lesson plan") {
		label = "Lesson Plans";
	}
	if (title === "worksheet generation") {
		label = "Worksheets";
	}

	return (
		<div
			onClick={onTabClick}
			className='generationsTab'
			style={{ backgroundColor: isActive ? "black" : "white", color: isActive ? "white" : "black" }}>
			{label}
		</div>
	);
};

const TextItem = ({ type, item, uniqueID }: { type: any; item: any; uniqueID: any }) => {
	// I use a lot of optional chaining here because the data formats are subject to change
	// and I don't want the app to crash if the data is misformatted
	// Crashing an app for a missing string is melodramatic, wouldn't you say?
	// This is the sort of thing that typescript is supposed to prevent, but speed is of the essence
	// And I don't want to have to update the typescript types every time I change my python types
	// Wouldn't be a problem if I had used NodeJS!
	const [isOpen, setIsOpen] = useState(false);

	const toggleCollapse = () => setIsOpen(!isOpen);
	const getTitle = (input: string) => {
		if (type === "worksheetGeneration") {
			//The formatting for worksheetGeneration is different from the other generations
			//This is a mistake that, for complicated reasons, would cost more to fix than to accomodate
			const ninput = item.completions[0]?.input?.text;
			return ninput.length > 30 ? ninput.substring(0, 30) + "..." : ninput;
		}

		if (type === "lessonPlan") {
			// Lesson plans are formatted differently but for good reasons
			return item.completions[0]?.lesson_plan?.specification?.topic;
		}

		return input.length > 30 ? input.substring(0, 30) + "..." : input;
	};

	const renderBody = () => {
		switch (type) {
			case "misformatted":
				return <div>{JSON.stringify(item, null, 2)}</div>;
			case "textSimplification":
				return renderTextSimplification();
			case "readingQuestionGeneration":
				return renderReadingQuestionGeneration();
			case "worksheetGeneration":
				return renderWorksheetGeneration();
			case "lessonPlan":
				return renderLessonPlan();
			default:
				return (
					<div
						style={{
							display: "grid",
							gridTemplateColumns: "1fr 1fr",
							gap: "15px",
							backgroundColor: "red",
						}}>
						error
					</div>
				);
		}
	};

	// truncated at the beginning to avoid code duplication
	const completions = item?.completions ?? "N/A";
	const firstCompletion = completions[0];
	const firstInput = firstCompletion?.input ?? "N/A";
	if (!firstCompletion || !firstInput) {
		return <div>recall error: {JSON.stringify(completions)}</div>;
	}

	const timestamp = firstCompletion?.created ?? 1575909015;
	const dateObject = new Date(timestamp * 1000);
	const created = dateObject.toLocaleString();
	const model = firstCompletion?.model ?? "N/A";
	const title = firstCompletion?.title ?? getTitle(firstInput);

	const renderTextSimplification = () => {
		const completion = completions[0];
		const usage = completion?.usage ?? { completion_tokens: 0, prompt_tokens: 0 };
		return (
			<div>
				<p>{`Input: ${completion?.input ?? "N/A"}[Reading level: ${
					completion?.reading_level ?? "N/A"
				}]`}</p>
				<p>{`Output: ${completion?.output ?? "N/A"}`}</p>
				<p>{`${model}, ${usage.completion_tokens + usage.prompt_tokens} tokens`}</p>
			</div>
		);
	};

	const renderReadingQuestionGeneration = () => {
		return (
			<div>
				<p>{`Text: ${firstCompletion?.input ?? "N/A"}`}</p>
				{completions.map((item: any, index: any) => (
					<div key={index}>
						<p>{`Generation ${index + 1}: ${item?.request?.quantity ?? "N/A"} ${
							item?.request?.type ?? "N/A"
						} questions.`}</p>
						<p>{`${item?.output ?? "N/A"}`}</p>
						<p>{`(${
							(item?.usage?.completion_tokens ?? 0) + (item?.usage?.prompt_tokens ?? 0)
						} tokens)`}</p>
					</div>
				))}
				<p>{`${model}`}</p>
			</div>
		);
	};

	const renderWorksheetGeneration = () => {
		const replaceMarkdownWithHTML = (input: string) => {
			let output = input.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
			return output;
		};
		let creditsUsed = 0;
		for (let i = 0; i < item.completions.length; i++) {
			creditsUsed += (item?.completions[i].usage?.completion_tokens ?? 0) + (item?.completions[i].usage?.prompt_tokens ?? 0)
		}

		return (
			<div>
				{completions.map((item: any, index: any) => (
					<div style={{ backgroundColor: "#f9f9f9" }} key={index}>
						<h4>{`${item?.input?.quant ?? "0"} ${
							item?.input?.selection?.value ?? "questions"
						} on ${item?.input?.text ?? "N/A"} `}</h4>
						<p
							dangerouslySetInnerHTML={{
								__html: replaceMarkdownWithHTML(item?.output ?? "N/A"),
							}}
						/>
					</div>
				))}
				<p>{`(${creditsUsed} tokens)`}</p>
			</div>
		);
	};

	const renderLessonPlan = () => {
		const completion = completions[0];
		const lessonPlan = completion.lesson_plan;
		const spec = lessonPlan.specification;
		return (
			<div>
				<p>Subject: {spec.subject}</p>
				<p>Grade: {spec.gradeLevel}</p>
				<p>Focus points: {spec?.focusPoints ?? "None"}</p>
				<p>{`${model}, ${
					(completion?.usage?.completion_tokens ?? 0) + (completion?.usage?.prompt_tokens ?? 0)
				} tokens`}</p>
				<div className='lessonPlanReviewer'>
					<div className='subject'>{title}</div>
					<div className='objectives lessonPlanTextBox'>
						<h4 className='textBoxLabel'>Objectives</h4>
						{/* {cleanText ? null : <ClearFormattingButton onClick={clearFormattingHandler} />} */}
						<div className='ql-editor'>{lessonPlan?.swbat}</div>
					</div>

					<div className='materials lessonPlanTextBox'>
						<h4 className='textBoxLabel'>Materials</h4>
						<div className='ql-editor'>{lessonPlan?.materials}</div>
					</div>

					<div className='activities lessonPlanTextBox'>
						<h4 className='textBoxLabel'>Procedure</h4>
						<div className='ql-editor'>{lessonPlan?.activities}</div>
					</div>

					<div className='assessments lessonPlanTextBox'>
						<h4 className='textBoxLabel'>Assessments</h4>
						<div className='ql-editor'>{lessonPlan?.assessments}</div>
					</div>
				</div>
			</div>
		);
	};

	return (
		<div>
			<div className='generationOption' onClick={toggleCollapse}>
				<span style={{ textAlign: "right" }}>{title}</span>
				<span style={{ textAlign: "left", fontSize: "0.8em", alignContent: "center" }}>
					{created}
				</span>
			</div>
			<Collapse isOpened={isOpen}>{renderBody()}</Collapse>
		</div>
	);
};

const Generations = () => {
	const [activeTab, setActiveTab] = useState<string>(generators[0][1]);

	const [userGenerations, setUserGenerations] = useState<any>({
		textSimplification: {},
		readingQuestionGeneration: {},
		lessonPlan: {},
		worksheetGeneration: {},
		misformatted: {},
	});
	const [loading, setLoading] = useState<boolean>(true);

	async function seeGenerations() {
		const userGenerations = await fetchUserGenerations();

		const newGenerations: any = {
			textSimplification: {},
			readingQuestionGeneration: {},
			lessonPlan: {},
			worksheetGeneration: {},
			misformatted: {},
		};

		//This exessively verbose section is a necessary part of the python-to-javascript conversion.
		const generationKeys = Object.keys(userGenerations);
		for (let i = 0; i < generationKeys.length; i++) {
			const generation = JSON.parse(userGenerations[generationKeys[i]]["S"]);
			if (!generation.type || !generation.completions) {
				newGenerations.misformatted[generationKeys[i]] = generation;
				continue;
			}
			if (generation.type === "text-simplification") {
				newGenerations.textSimplification[generationKeys[i]] = generation;
			}
			if (generation.type === "reading-question-generation") {
				newGenerations.readingQuestionGeneration[generationKeys[i]] = generation;
			}
			if (generation.type === "lesson-plan") {
				newGenerations.lessonPlan[generationKeys[i]] = generation;
			}
			if (generation.type === "worksheet-generation") {
				newGenerations.worksheetGeneration[generationKeys[i]] = generation;
			}
		}
		setUserGenerations(newGenerations);
		setLoading(false);
	}

	useEffect(() => {
		seeGenerations();
	}, []);

	return (
		<div className='Generations'>
			<div className='generationsTabBar'>
				{generators.map((generator: any) => (
					<Tab
						key={generator[1]}
						title={generator[0]}
						onTabClick={() => setActiveTab(generator[1])}
						isActive={activeTab === generator[1]}
					/>
				))}
			</div>
			{loading && <div style={{ textAlign: "center" }}>Loading...</div>}
			<div className='generationsReader'>
				{Object.keys(userGenerations[activeTab]).map((item: any, index: any) => (
					<TextItem
						key={index}
						type={activeTab}
						uniqueID={item}
						item={userGenerations[activeTab][item]}
					/>
				))}
			</div>
		</div>
	);
};

export default Generations;
