export default function UpDownSelector ({
	value,
	setValue,
}: {
	value: number;
	setValue: Function;
}) {
	const onUp = () => {
		if (value < 17) {
			setValue(value + 1);
		}
	};
	const onDown = () => {
		if (value > 0) {
			setValue(value - 1);
		}
	};
	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === "ArrowUp") {
			event.preventDefault();
			onUp();
		} else if (event.key === "ArrowDown") {
			event.preventDefault();
			onDown();
		}
	};
	return (
		<div className='up-down-selector' onKeyDown={handleKeyDown} tabIndex={0}>
			<button className='triangle-button' onClick={onUp}>
				<svg width='20' height='13.333333' viewBox='0 0 15 10'>
					<path d='M0,10 L7.5,0 L15,10 Z' fill='currentColor' />
				</svg>
			</button>
			<button className='triangle-button' onClick={onDown}>
				<svg width='20' height='13.333333' viewBox='0 0 15 10'>
					<path d='M0,0 L7.5,10 L15,0 Z' fill='currentColor' />
				</svg>
			</button>
		</div>
	);
};
