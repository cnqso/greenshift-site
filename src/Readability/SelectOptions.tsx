/** @format */

import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { XButton } from "../assets/SVGs";
import Select from "react-select";
import type { ListItems } from "../types/readability.types";
import NeuralNetworkGen from "../assets/NeuralNetworkGen";

const questionOptions = [
	{ value: "reading comprehension", label: "Comprehension" },
	{ value: "analysis", label: "Analysis" },
	{ value: "vocabulary", label: "Vocabulary" },
	{ value: "essay", label: "Essay" },
	{ value: "short essay", label: "Short Answer" },
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

export default function SelectOptions({
	submitGenerate,
	items,
	setItems,
	loading,
	setGenerationVisible,
}: {
	submitGenerate: React.MouseEventHandler<HTMLButtonElement>;
	items: ListItems;
	setItems: Function;
	loading: boolean;
	setGenerationVisible: Function;
}) {
	const SelectOption = ({ id }: { id: number }) => {
		const thisItem = items[id];

		const handleChange = (e: any) => {
			const newItems = items;
			console.log(JSON.stringify(newItems[id].selection, null, 2));
			newItems[id].selection.value = e.value;
			newItems[id].selection.label = e.label;
			setItems(newItems);
		};

		return (
			<Select
				key={id}
				options={questionOptions}
				defaultValue={thisItem.selection}
				onChange={handleChange}
				styles={{
					control: (baseStyles, state) => ({
						...baseStyles,
						width: "213px",
					}),
					input: (baseStyles) => ({
						...baseStyles,
						color: "transparent",
					}),
				}}
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
			/>
		);
	};
	const [count, setCount] = useState(0);

	return (
		<div className='SelectOptions'>
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
							<span style={{ display: "flex", justifyContent: "space-around" }}>
								<UpDownSelector items={items} setItems={setItems} id={parseInt(key, 10)} />
								<SelectOption id={parseInt(key, 10)} />

								<RemoveGenerationButton
									onClick={() => {
										if (Object.keys(items).length <= 1) {
											setGenerationVisible(false);
										} else {
											const newItems = { ...items };
											delete newItems[parseInt(key, 10)];
											setItems(newItems);
										}
									}}
								/>
							</span>
						</motion.li>
					))}
				</AnimatePresence>
			</ul>

			<motion.div layout className='buttons' style={{ marginTop: "-13px" }}>
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
										selection: { value: "reading comprehension", label: "Comprehension" },
										quant: 3,
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
