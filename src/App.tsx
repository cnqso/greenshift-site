/** @format */

import { useState, useEffect } from "react";
import RichText from "./Readability/Readability";
import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Auth } from "aws-amplify";
import Readability from "./Readability/Readability";
import Home from "./Home/Home";
import Account from "./Account/Account";
import LessonPlan from "./LessonPlan/LessonPlan";
import WorksheetGen from "./WorksheetGen/WorksheetGen";
import Generations from "./Generations/Generations";
import Payments from "./Payments/Payments";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { ErrorProvider, ErrorModal } from "./assets/errors";

import awsExports from "./aws-exports";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/system";
import { fetchUserData, fetchUserPreferences } from "./requests";

Amplify.configure(awsExports);

interface UserInfo {
	username: string;
	email: string;
	sub: string;
}

interface UserPreferences {
	transactions: { [key: string]: Transaction };
	generations: { [key: string]: Generation };
	credits: number;
	subscription: string;
}

interface DatabaseInfo {
	preferences: {
		S: string;
	};
	UserId: {
		S: string;
	};
}

interface Transaction {
	amount: number;
	type: string;
	subscription: string;
}

interface Generation {
	input: string;
	output: string;
	reading_level: number;
}

interface Generations {
	[key: string]: { [S: string]: string };
}

interface InputData {
	user_claims: UserInfo;
	databaseInfo: DatabaseInfo;
}

const formFields = {
	signIn: {
		username: {
			placeholder: "Enter Your Email or Username",
			isRequired: true,
			label: "Email:",
		},
	},
};

function AuthModal({ show, onClose, propDrill }: { show: boolean; onClose: () => void; propDrill: any }) {
	if (!show) return null;

	return (
		<Modal open={show} onClose={onClose}>
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
				<Authenticator formFields={formFields}>
					{({ signOut, user }) => (
						<div>
							<Account propDrill={propDrill} />
							<button onClick={signOut}>Sign out</button>
						</div>
					)}
				</Authenticator>
			</Box>
		</Modal>
	);
}

function App() {
	const [showAuthModal, setShowAuthModal] = useState(false);
	const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
	const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
	const [premiumModel, setPremiumModel] = useState(false);

	function gatekeepPremiumModel() {
		// if the user is not logged in, doesn't have premium, etc, throw a modal and do not change the state
		// otherwise, it's just a proxy for setPremiumModel
		// replace all passed versions of setPremiumModel with this function
		return true
	}

	// const url = "https://gcfz4xy1q7.execute-api.us-east-2.amazonaws.com/Prod/";
	const url = "http://localhost:8000/";
	async function sendToCluod(api: string, body: any, onError: Function) {
		const currentSession = await Auth.currentSession();
		const idToken = currentSession.getIdToken().getJwtToken();
		body.premiumModel = premiumModel;

		// If the user is not logged in, don't send, show the auth modal
		// If they have insufficient credits, show the same error message they would get from the server
		// If they're trying to use a premium feature without a premium subscription show a unique modal
			// Alternatively, if they are premium and trying to upgrade to premium, don't let them
		
		try {
			const response = await fetch(url + `api/${api}/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: " " + idToken,
				},
				body: JSON.stringify(body),
			});
			const responseData = await response.json();

			if (responseData?.new_credits) {
				setUserPreferences({transactions: userPreferences?.transactions || {},
					generations: userPreferences?.generations || {},
					credits: responseData.new_credits,
					subscription: userPreferences?.subscription || "",});
			}
			if (response.ok) {
				return responseData;
			} else {
				console.error("An error occurred while fetching the analyzed text.");
				console.log(JSON.stringify(responseData, null, 2));
				onError(responseData.error);
				return false;
			}
		} catch (error: any) {
			console.error("An error occurred while fetching the analyzed text:", error);
			onError(error.toString());

			return false;
		}
	}

	function updateUserInfo() {
		fetchUserData(setUserInfo, setUserPreferences);
	}
	function updateUserPreferences() {
		fetchUserPreferences(setUserPreferences);
	}

	useEffect(() => {
		if (userPreferences && userInfo) {
			return;
		}
		if (userInfo) {
			updateUserPreferences();
			return;
		}
		updateUserInfo();
	}, []);



	function toggleAuthModal() {
		setShowAuthModal(!showAuthModal);
	}

	const getStartedOrPremium = () => {
		if (!userPreferences) {
			return (
				<Link className='navlink' to='/'>
					Get Started
				</Link>
			);
		}
		if (userPreferences?.subscription === "premium") {
			return null;
		}
		return (
			<Link className='navlink' to='/'>
				Premium
			</Link>
		);
	};

	return (
		<Router>
			<div className='App'>
				<header className='header'>
					<h1 className='logo'>
						<Link className='navlink mainlink' to='/'>
							Piaget Bot
						</Link>
					</h1>
					<nav className='navigation'>
						<Link className='navlink' to='/'>
							Dashboard
						</Link>
						<Link className='navlink' to='/'>
							About
						</Link>
						<button className='navbutton' onClick={toggleAuthModal}>
							{userInfo ? "Account" : "Login"}
						</button>
						{getStartedOrPremium()}
					</nav>
				</header>
				<AuthModal
					show={showAuthModal}
					onClose={toggleAuthModal}
					propDrill={{
						userPreferences: userPreferences,
						userInfo: userInfo,
						updateUserInfo: updateUserInfo,
						updateUserPreferences: updateUserPreferences,
					}}
				/>
				<ErrorProvider>
					<Routes>
						<Route path='/readability' element={<Readability sendToCluod={sendToCluod} premiumModel={premiumModel} setPremiumModel={setPremiumModel}/>} />
						<Route path='/' element={<Home />} />
						<Route path='/lessonplanner' element={<LessonPlan sendToCluod={sendToCluod} premiumModel={premiumModel} setPremiumModel={setPremiumModel}/>} />
						<Route path='worksheetgenerator' element={<WorksheetGen sendToCluod={sendToCluod} premiumModel={premiumModel} setPremiumModel={setPremiumModel}/>} />
						<Route path='generations' element={<Generations />} />
						<Route path='payments' element={<Payments sendToCluod={sendToCluod}/>} />
					</Routes>
					<ErrorModal />
				</ErrorProvider>
			</div>
			<footer className='footer'>
				<p>© 2023</p>
			</footer>
		</Router>
	);
}

export default App;
