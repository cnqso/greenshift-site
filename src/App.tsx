/** @format */

import { useState, useEffect } from "react";
import RichText from "./Readability/Readability";
import "./App.css";
import type { UserPreferences, UserInfo } from "./@types/internal.types";
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from "react-router-dom";
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
import Contact from "./Contact/Contact";
import Dashboard from "./Dashboard/Dashboard";
import { Amplify } from "aws-amplify";
import { QuestionIcon, WebsiteIcon, GithubIcon } from "./assets/icons";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import "@aws-amplify/ui-react/styles.css";
import { ErrorProvider, ErrorModal } from "./assets/errors";
import awsExports from "./aws-exports";
import { fetchUserData, fetchUserPreferences } from "./requests";
import { Tooltip } from "@mui/material";

Amplify.configure(awsExports);

const cre = createTheme;

  const theme = createTheme({
	palette: {
	  primary: {
		main: "#000",
		
	  },
	  secondary: {
		main: "#fff",
	  },
	},
	typography: {
		fontFamily: "Spectra",
	},
  });

const useScrollToTop = () => {
	const { pathname } = useLocation();
  
	useEffect(() => {
	  window.scrollTo(0, 0);
	}, [pathname]);
	return null;
  };

function App() {
	const [showAccountModal, setShowAccountModal] = useState(false);
	const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
	const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
	const [premiumModel, setPremiumModel] = useState(false);
	useScrollToTop();

	function gatekeepPremiumModel(onError: Function, trueFalse: boolean) {
			// if the user is not logged in, doesn't have premium, etc, throw a modal and do not change the state
			// otherwise, it's just a proxy for setPremiumModel
			// replace all passed versions of setPremiumModel with this function
			if (!trueFalse) {
				setPremiumModel(false);
				return
			}
			if (userPreferences?.subscription !== "premium") {
				onError("Not premium");
				return;
			}
			setPremiumModel(trueFalse);

	}

	// const url = "https://gcfz4xy1q7.execute-api.us-east-2.amazonaws.com/Prod/";
	const url = "http://localhost:8000/";
	async function sendToCluod(api: string, body: any, onError: Function) {
		if (!userInfo || !userPreferences) {
			toggleAccountModal();
			return false;
		}
		const currentSession = await Auth.currentSession();
		const idToken = currentSession.getIdToken().getJwtToken();
		
		body.premiumModel = premiumModel;
		console.log("sending request")
		

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
		<ThemeProvider theme={theme}>
			<div className='App'>
				<header className='header'>
					<div className='header-content'>
						<h1 className='logo'>
							<Link className='navlink mainlink' to='/'>
								Piaget Bot
							</Link>
						</h1>
						<nav className='navigation'>
							<Link className='navlink' to='/dashboard'>
								Dashboard
							</Link>


							{userInfo ? (
								<button className='navbutton' onClick={toggleAccountModal} style={{boxShadow: "none"}}>
									<Tooltip
										PopperProps={{
											modifiers: [{ name: "offset", options: { offset: [0, 10] } }],
										}}
										disableHoverListener={userPreferences?.subscription === "premium"}
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
				<div className='appBody'>
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
										setPremiumModel={gatekeepPremiumModel}
									/>
								}
							/>
							<Route
								path='/'
								element={
									<Home
										userPreferences={userPreferences}
										toggleAccountModal={toggleAccountModal}
									/>
								}
							/>
							<Route
								path='/lessonplanner'
								element={
									<LessonPlan
										sendToCluod={sendToCluod}
										premiumModel={premiumModel}
										setPremiumModel={gatekeepPremiumModel}
									/>
								}
							/>
							<Route
								path='worksheetgenerator'
								element={
									<WorksheetGen
										sendToCluod={sendToCluod}
										premiumModel={premiumModel}
										setPremiumModel={gatekeepPremiumModel}
									/>
								}
							/>
							<Route path='generations' element={<Generations />} />
							<Route
								path='payments'
								element={
									<Payments sendToCluod={sendToCluod} userPreferences={userPreferences} />
								}
							/>
							<Route
								path='premium'
								element={
									<Premium sendToCluod={sendToCluod} userPreferences={userPreferences} />
								}
							/>
							<Route path='about' element={<About />} />
							<Route path='contact'  element={<Contact />} />
							<Route path='dashboard'  element={<Dashboard userPreferences={userPreferences} />} />
						</Routes>
						<ErrorModal />
					</ErrorProvider>
				</div>
			</div>
			<footer className='footer'>
				<div className='footerContent'>
				<span style={{paddingInline: 10}}>© 2023 PiagetBot</span>
					<Link to='about'>
						<QuestionIcon />
					</Link><span style={{paddingInline: 5}}/>
					<GithubIcon /> <span style={{paddingInline: 3.5}}/>
					
					<WebsiteIcon />
				</div>
			</footer>
			</ThemeProvider>
	);
}

export default App;
