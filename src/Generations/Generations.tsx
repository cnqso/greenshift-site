/** @format */

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Collapse } from "react-collapse";
import { fetchUserGenerations } from "../requests";

import "./Generations.css";

// Define types

const generators: string[] = ["Generator 1", "Generator 2", "Generator 3"];
const generatorz: any = [
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
}) => (
	<button
		onClick={onTabClick}
		style={{ backgroundColor: isActive ? "black" : "white", color: isActive ? "white" : "black" }}>
		{title}
	</button>
);

// const TextItem = ({ item }: { item: any }) => {
// 	const [isOpen, setIsOpen] = useState(false);

//  return (
//     <div onClick={() => setIsOpen(!isOpen)}>

//         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px',  }}>
//           <span style={{textAlign: 'right'}}>{item?.title || item?.text.substring(0, 10)}</span>
// 		  <small style={{textAlign: 'left'}}>{item?.date.toLocaleDateString()}</small>
//         </div>
//         <Collapse isOpened={!isOpen}>
//           <p>{item?.text}</p>
//         </Collapse>
//     </div>
//   );
// };

const TextItem = ({ type, item, uniqueID }: { type: any; item: any; uniqueID: any }) => {
	const [isOpen, setIsOpen] = useState(false);

	if (type === "misformatted") {
		return (
			<div onClick={() => setIsOpen(!isOpen)}>
				<div className='generationOption'>
					<span style={{ textAlign: "right" }}>{uniqueID}</span>
					<small style={{ textAlign: "left" }}>{"created"}</small>
				</div>
				<Collapse isOpened={isOpen}>{JSON.stringify(item)}</Collapse>
			</div>
		);
	}

	const completions = item?.completions ?? "N/A";
	const firstCompletion = completions[0];
	const firstInput = firstCompletion?.input ?? "N/A";
	if (!firstCompletion || !firstInput) {
		return <div>recall error: {JSON.stringify(completions)}</div>;
	}
	const created = firstCompletion?.created ?? "N/A";
	const model = firstCompletion?.model ?? "N/A";

	if (type === "textSimplification") {
		const completion = completions[0];
		const input = completion?.input ?? "N/A";
		const output = completion?.output ?? "N/A";
		const usage = completion?.usage ?? { completion_tokens: 0, prompt_tokens: 0 };
		const readingLevel = completion?.reading_level ?? "N/A";
		const title =
			firstCompletion?.title ?? firstInput.length > 30
				? firstInput.substring(0, 30) + "..."
				: firstInput;

		return (
			<div onClick={() => setIsOpen(!isOpen)}>
				<div className='generationOption'>
					<span style={{ textAlign: "right" }}>{title}</span>
					<small style={{ textAlign: "left" }}>{created}</small>
				</div>
				<Collapse isOpened={isOpen}>
					<p>{`Input: ${input} \n Reading level: ${readingLevel}`}</p>
					<p>{`Output: ${output}`}</p>
					<p>{`${model}, ${usage.completion_tokens + usage.prompt_tokens} tokens`}</p>
					{JSON.stringify(item)}
				</Collapse>
			</div>
		);
	}
	if (type === "readingQuestionGeneration") {
		const title =
			firstCompletion?.title ?? firstInput.length > 30
				? firstInput.substring(0, 30) + "..."
				: firstInput;
		console.log(title);
		return (
			<div>
				<div onClick={() => setIsOpen(!isOpen)}>
					<div className='generationOption'>
						<span style={{ textAlign: "right" }}>{title}</span>
						<small style={{ textAlign: "left" }}>{created}</small>
					</div>
					<Collapse isOpened={isOpen}>
						<p>{`Text: ${firstCompletion?.input ?? "N/A"}`}</p>
						{completions.map((item: any, index: any) => (
							<div>
								{" "}
								<p>{`Request: Missing`}</p>
								<p>{`Output ${index + 1}: ${item?.output ?? "N/A"} \n (${
									item?.usage?.completion_tokens ?? 0 + item?.usage?.prompt_tokens ?? 0
								} tokens)`}</p>
							</div>
						))}
						<p>{`${model}`}</p>
						{JSON.stringify(item)}
					</Collapse>
				</div>
			</div>
		);
	}

	if (type === "worksheetGeneration") {
		return (
			<div onClick={() => setIsOpen(!isOpen)}>
				<div className='generationOption'>
					<span style={{ textAlign: "right" }}>{"title"}</span>
					<small style={{ textAlign: "left" }}>{"created"}</small>
				</div>
				<Collapse isOpened={isOpen}>
					{completions.map((item: any, index: any) => (
						<div>
							<p>{item?.input ?? "n/a"}</p>
							<p>{item?.output ?? "n/a"}</p>
							<p></p>
							<div>{JSON.stringify(item)}</div>
						</div>
					))}
				</Collapse>
			</div>
		);
	}

	if (type === "lessonPlan") {
		const completion = completions[0];
		const lessonPlan = completion.lesson_plan;
		const spec = lessonPlan.specification;
		const title = lessonPlan.specification.topic;
		return (
			<div onClick={() => setIsOpen(!isOpen)}>
				<div className='generationOption'>
					<span style={{ textAlign: "right" }}>{title}</span>
					<small style={{ textAlign: "left" }}>{created}</small>
				</div>
				<Collapse isOpened={isOpen}>
					<p>Subject: {spec.subject}</p>
					<p>Grade: {spec.gradeLevel}</p>
					<p>Focus points: {spec?.focusPoints ?? "None"}</p>
					<p>{`${model}, ${
						completion?.usage?.completion_tokens ?? 0 + completion?.usage?.prompt_tokens ?? 0
					} tokens`}</p>
					<div className='lessonPlanEditor'>
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
				</Collapse>
			</div>
		);
	}

	return (
		<div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", backgroundColor: "red" }}>
			error
		</div>
	);
};

const Generations = () => {
	const [activeTab, setActiveTab] = useState<string>(generatorz[0][1]);

	const [userGenerations, setUserGenerations] = useState<any>({
		textSimplification: {},
		readingQuestionGeneration: {},
		lessonPlan: {},
		worksheetGeneration: {},
		misformatted: {},
	});

	async function seeGenerations() {
		const userGenerations = await fetchUserGenerations();

		const newGenerations: any = {
			textSimplification: {},
			readingQuestionGeneration: {},
			lessonPlan: {},
			worksheetGeneration: {},
			misformatted: {},
		};
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
		console.log(newGenerations);
		setUserGenerations(newGenerations);
	}

	return (
		<div>
			<button onClick={seeGenerations}>Load</button>
			<div>
				{generatorz.map((generator: any) => (
					<Tab
						key={generator[1]}
						title={generator[0]}
						onTabClick={() => setActiveTab(generator[1])}
						isActive={activeTab === generator[1]}
					/>
				))}
			</div>
			<div>
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
