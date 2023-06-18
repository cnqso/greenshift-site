/** @format */

import { useState, useEffect } from "react";
import RichText from "./Readability/Readability";
import "./App.css";
import type { UserPreferences, UserInfo } from "./@types/internal.types";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Auth } from "aws-amplify";
import Readability from "./Readability/Readability";
import Home from "./Home/Home";
import About from "./About/About";
import AccountModal from "./Account/Account";
import LessonPlan from "./LessonPlan/LessonPlan";
import WorksheetGen from "./WorksheetGen/WorksheetGen";
import Generations from "./Generations/Generations";
import Payments from "./Payments/Payments";
import Premium from "./Premium/Premium";
import { Amplify } from "aws-amplify";

import "@aws-amplify/ui-react/styles.css";
import { ErrorProvider, ErrorModal } from "./assets/errors";

import awsExports from "./aws-exports";

import { fetchUserData, fetchUserPreferences } from "./requests";
import { Tooltip, Badge, SvgIcon } from "@mui/material";

Amplify.configure(awsExports);

function App() {
	const [showAccountModal, setShowAccountModal] = useState(false);
	const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
	const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
	const [premiumModel, setPremiumModel] = useState(false);

	function gatekeepPremiumModel() {
		// if the user is not logged in, doesn't have premium, etc, throw a modal and do not change the state
		// otherwise, it's just a proxy for setPremiumModel
		// replace all passed versions of setPremiumModel with this function
		return true;
	}

	// const url = "https://gcfz4xy1q7.execute-api.us-east-2.amazonaws.com/Prod/";
	const url = "http://localhost:8000/";
	async function sendToCluod(api: string, body: any, onError: Function) {
		const currentSession = await Auth.currentSession();
		const idToken = currentSession.getIdToken().getJwtToken();
		body.premiumModel = premiumModel;
		// onError("Not enough credits");
		// return false;
		// If the user is not logged in, don't send, show the auth modal
		// If they have insufficient credits, show the same error message they would get from the server
		// If they're trying to use a premium feature without a premium subscription show a unique modal
		// Alternatively, if they are premium and trying to upgrade to premium, don't let them
		if (!userInfo || !idToken || !userPreferences) {
			onError("Not logged in")
			return false;
		}

		if (userPreferences?.credits < 5) {
			onError("Not enough credits");
			return false;
		}
		if (premiumModel === true && userPreferences?.subscription !== "premium") {
			onError("Not premium");
			return false;
		}
		if (api === "create-checkout-session" && userPreferences?.subscription === "premium") {
			onError("Already premium");
			return false;
		}

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
				setUserPreferences({
					credits: responseData.new_credits,
					subscription: userPreferences?.subscription || "",
					subscription_expiration: userPreferences?.subscription_expiration || "",
					stripeId: userPreferences?.stripeId || "",
				});
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

	function toggleAccountModal() {
		setShowAccountModal(!showAccountModal);
	}

	const getStartedOrPremium = () => {
		if (!userPreferences) {
			return (
				<button className='navbutton specialnavbutton' onClick={toggleAccountModal}>
					Get Started
				</button>
			);
		}
		if (userPreferences?.subscription === "premium") {
			return null;
		}
		return (
			<Link className='navlink specialnavbutton' to='/premium'>
				Premium
			</Link>
		);
	};

	return (
		<Router>
			<header className='header'>
					<div className='header-content'>
					<h1 className='logo'>
						<Link className='navlink mainlink' to='/'>
							Piaget Bot
						</Link>
					</h1>
					<nav className='navigation'>
						<Link className='navlink' to='/'>
							Dashboard
						</Link>
						<Link className='navlink' to='/about'>
							About
						</Link>

						{userInfo ? (
							<button className='navbutton' onClick={toggleAccountModal}>
								<Tooltip
									PopperProps={{
										modifiers: [{ name: "offset", options: { offset: [0, 10] } }],
									}}
									title={`Credits: ${userPreferences?.credits}`}>
									<div>
										<>{"Account"}</>
									</div>
								</Tooltip>
							</button>
						) : (
							<button className='navbutton' onClick={toggleAccountModal}>
								Sign In
							</button>
						)}

						{getStartedOrPremium()}
					</nav>
					</div>
				</header>
			<div className='App'>
				
				<AccountModal
					show={showAccountModal}
					onClose={toggleAccountModal}
					userPreferences={userPreferences}
					userInfo={userInfo}
					updateUserInfo={updateUserInfo}
					updateUserPreferences={updateUserPreferences}
					toggleAccountModal={toggleAccountModal}
					sendToCluod={sendToCluod}
				/>
				<ErrorProvider>
					<Routes>
						<Route
							path='/readability'
							element={
								<Readability
									sendToCluod={sendToCluod}
									premiumModel={premiumModel}
									setPremiumModel={setPremiumModel}
								/>
							}
						/>
						<Route path='/' element={<Home userPreferences={userPreferences} />} />
						<Route
							path='/lessonplanner'
							element={
								<LessonPlan
									sendToCluod={sendToCluod}
									premiumModel={premiumModel}
									setPremiumModel={setPremiumModel}
								/>
							}
						/>
						<Route
							path='worksheetgenerator'
							element={
								<WorksheetGen
									sendToCluod={sendToCluod}
									premiumModel={premiumModel}
									setPremiumModel={setPremiumModel}
								/>
							}
						/>
						<Route path='generations' element={<Generations />} />
						<Route
							path='payments'
							element={<Payments sendToCluod={sendToCluod} userPreferences={userPreferences} />}
						/>
						<Route
							path='premium'
							element={<Premium sendToCluod={sendToCluod} userPreferences={userPreferences} />}
						/>
						<Route path='about' element={<About />} />
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
