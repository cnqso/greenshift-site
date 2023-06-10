/** @format */

import { createContext, useContext, useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/system";
import { XButton } from "./SVGs";

type ErrorContextType = {
	error: string | null;
	setError: (error: string | null) => void;
};
const ErrorContext = createContext<ErrorContextType>({ error: null, setError: () => {} });

function ErrorProvider({ children }: { children: any }) {
	const [error, setError] = useState<string | null>(null);

	return <ErrorContext.Provider value={{ error, setError }}>{children}</ErrorContext.Provider>;
}

function ErrorModal() {
	const { error, setError } = useContext(ErrorContext);
	const [open, setOpen] = useState(false);
	const [errorText, setErrorText] = useState("");

	useEffect(() => {
		setOpen(error !== null);
	}, [error]);

	function exitError() {
		if (error) {
			setError(null);
			setOpen(false);
			if (error === "Not enough credits") {
				setErrorText(
					"You've run out of free credits for this month. Upgrade your account for unlimited access to all of our features."
				);
			} else if (error === "Invalid input") {
				setErrorText("Please enter a valid input.");
			} else if (error === "No user claims found") {
				setErrorText("Account information could not be found. Please try again or contact support.");
			} else if (error === "TypeError: Failed to fetch") {
				if (new Date() < new Date("January 1, 2024")) {
					setErrorText(
						"Failed to connect to the server. Check your connection or contact support."
					);
				} else {
					setErrorText(
						"Failed to connect to the server. This may be because of your internet connection. This may be because I stopped paying for server time. If you're technically inclined, I can send you the code and you can run it yourself. Otherwise, contact support."
					);
				}
			} else {
				setErrorText("A server error has occurred. Please try again or contact support.");
			}
		}
	}

	return (
		<Modal open={open} onClose={exitError}>
			<Box
				sx={{
					color: "#000000",
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					maxWidth: 750,
					minWidth: 375,
					bgcolor: "#fff",
					borderRadius: 2,
					boxShadow: 24,
					p: 4,
				}}>
				<div>
					<div className='ClearFormattingButton' onClick={exitError}>
						<XButton />
					</div>
					<p>{errorText}</p>
					<p>Error: {JSON.stringify(error)}</p>
				</div>
			</Box>
		</Modal>
	);
}

export { ErrorContext, ErrorProvider, ErrorModal };
