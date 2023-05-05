/** @format */

import { useState, useEffect } from "react";
import RichText from "./Readability/RichText";
import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Auth } from "aws-amplify";
// console.log((await Auth.currentSession()).getIdToken().getJwtToken())
import Readability from "./Readability/Readability";
import Home from "./Home/Home";
import Account from "./Account/Account";
import LessonPlan from "./LessonPlan/LessonPlan";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import awsExports from "./aws-exports";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/system";

Amplify.configure(awsExports);

interface UserClaims {
	sub: string;
	email_verified: boolean;
	iss: string;
	"cognito:username": string;
	origin_jti: string;
	aud: string;
	event_id: string;
	token_use: string;
	auth_time: number;
	exp: number;
	iat: number;
	jti: string;
	email: string;
}

interface UserData {
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
	user_claims: UserClaims;
	databaseInfo: DatabaseInfo;
}

function AuthModal({ show, onClose, propDrill }: { show: boolean; onClose: () => void; propDrill: any }) {
	if (!show) return null;

	return (
		<Modal
			open={show}
			onClose={onClose}
			aria-labelledby='auth-modal-title'
			aria-describedby='auth-modal-description'>
			<Box
				sx={{
					color: "#000000",
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					width: "80%",
					maxWidth: 400,
					bgcolor: "#fff",
					borderRadius: 2,
					boxShadow: 24,
					p: 4,
				}}>
				<Authenticator>
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

	function toggleAuthModal() {
		setShowAuthModal(!showAuthModal);
	}

	const [userData, setUserData] = useState<UserData | null>(null);
	const [userClaims, setUserClaims] = useState<UserClaims | null>(null);
	const [userGenerations, setUserGenerations] = useState<Generations | null>(null);
	// const url = "https://gcfz4xy1q7.execute-api.us-east-2.amazonaws.com/Prod/";
	const url = "http://localhost:8000/";
	useEffect(() => {
		const fetchUserData = async () => {
			if (userData || userClaims || userGenerations) return;
			try {
				const userInfo = await Auth.currentAuthenticatedUser();
				const storedUserData = JSON.parse(localStorage.getItem("userData") ?? "{}");
				console.log(storedUserData);
				// Load states with local storage data if it exists
				if (storedUserData.databaseInfo && storedUserData.user_claims) {
					setUserData(JSON.parse(storedUserData.databaseInfo.preferences.S));
					setUserGenerations(storedUserData.databaseInfo.generations["M"]);
					setUserClaims(storedUserData.user_claims);
				}

				// Check if userData exists and is up-to-date.
				if (
					storedUserData.date &&
					new Date(storedUserData.date).toDateString() === new Date().toDateString()
				) {
					return;
				}

				const response = await fetch(url + "api/userdata", {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `${userInfo.signInUserSession.idToken.jwtToken}`,
					},
				});

				const data = await response.json();
				console.log(JSON.stringify(data, null, 2));

				// Save the user data to local storage with a timestamp.
				localStorage.setItem("userData", JSON.stringify({ ...data, date: new Date() }));

				setUserData(JSON.parse(data.databaseInfo.preferences.S));
				setUserGenerations(data.databaseInfo.generations["M"]);
				setUserClaims(data.user_claims);
			} catch (error) {
				console.error("Error fetching user data:", error);
			}
		};

		fetchUserData();
	}, []);

	return (
		<Router>
			<div className='App'>
				<header className='header'>
					<h1 className='logo'>
						<Link style={{ color: "#fff" }} to='/'>
							Piaget Bot
						</Link>
					</h1>
					<nav className='navigation'>
						<a href='#dashboard'>dashboard</a>
						<a href='#pricing'>pricing</a>
						<button
							style={{
								color: "#fff",
								background: "none",
								border: "none",
								cursor: "pointer",
							}}
							onClick={toggleAuthModal}>
							account
						</button>
					</nav>
				</header>
				<AuthModal
					show={showAuthModal}
					onClose={toggleAuthModal}
					propDrill={[userData, userClaims, userGenerations]}
				/>
				<Routes>
					<Route path='/readability' element={<Readability />} />
					<Route path='/' element={<Home />} />
					<Route path='/lessonplanner' element={<LessonPlan />} />
				</Routes>
			</div>
		</Router>
	);
}

export default App;
