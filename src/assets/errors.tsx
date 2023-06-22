/** @format */

import { createContext, useContext, useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/system";
import { XButton } from "./SVGs";
import { set } from "react-hook-form";
import { Link } from "react-router-dom";

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
	const [errorText, setErrorText] = useState(() => <p></p>);

	useEffect(() => {
		if (error) {
			if (error === "Not logged in") {
				setErrorText(() => <p>You must be logged in to use this feature. </p>);
			}
			else if (error === "Not enough credits") {
				setErrorText(() => (
					<div>
						<p>
							You've run out of free credits for this month. Upgrade to premium for unlimited
							access to all our features.
						</p>
						<p style={{ textAlign: "center" }}>
							<Link
								style={{ fontSize: "1.2em", padding: "5px", marginLeft: 0 }}
								to='/premium'
								onClick={() => exitError()}
								className='premiumTag'>
								Go premium!
							</Link>
						</p>
					</div>
				));
			} else if (error === "Not premium") {
				setErrorText(() => (
					<div>
						<p>
							You must be a premium member to access this feature. Upgrade to premium for
							unlimited access.
						</p>
						<p style={{ textAlign: "center" }}>
							<Link
								style={{ fontSize: "1.2em", padding: "5px" }}
								to='/premium'
								onClick={() => exitError()}
								className='premiumTag'>
								Go premium!
							</Link>
						</p>
					</div>
				));
			} else if (error === "Already premium") {
				setErrorText(() => (
					<div>
						<p>
							Our records show that you are already a premium member. If you believe this is an
							error, please manage your subscription from the account screen or contact support.
						</p>
					</div>
				));
			} else if (error === "Invalid input") {
				setErrorText(() => <p>Please enter a valid input.</p>);
			} else if (error === "No user claims found") {
				setErrorText(() => (
					<p>Account information could not be found. Please try again or contact support.</p>
				));
			} else if (error === "TypeError: Failed to fetch") {
				if (new Date() < new Date("January 1, 2024")) {
					setErrorText(() => (
						<p>Failed to connect to the server. Check your connection or contact support.</p>
					));
				} else {
					setErrorText(() => (
						<p>
							Failed to connect to the server. This may be because of your internet connection.
							This may be because I stopped paying for server time. If you're technically
							inclined, I can send you the code and you can run it yourself. Otherwise, contact
							support.
						</p>
					));
				}
			} else {
				console.log(error)
				setErrorText(() => (
					<>
						<p>A server error has occurred. Please try again or contact support.</p>
						<p style={{ fontSize: "0.8em" }}>{error}</p>
					</>
				));
			}
			setOpen(true);
		}
	}, [error]);

	function exitError() {
		if (error) {
			setError(null);

			setOpen(false);
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
				<div style={{fontSize: "1.15em"}}>
					<div className='ClearFormattingButton' onClick={exitError}>
						<XButton />
					</div>
					{errorText}
				</div>
			</Box>
		</Modal>
	);
}

export { ErrorContext, ErrorProvider, ErrorModal };
