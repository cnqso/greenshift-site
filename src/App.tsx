/** @format */

import { useState, useEffect } from "react";
import RichText from "./Readability/RichText";
import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Auth } from "aws-amplify";
import Readability from "./Readability/Readability";
import Home from "./Home/Home";
import Account from "./Account/Account";
import LessonPlan from "./LessonPlan/LessonPlan";
import WorksheetGen from "./WorksheetGen/WorksheetGen";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";

import awsExports from "./aws-exports";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/system";
import { fetchUserData, fetchUserPreferences } from "./requests"




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
		placeholder: 'Enter Your Email or Username',
		isRequired: true,
		label: 'Email:'
	  },
	},
  }

function AuthModal({ show, onClose, propDrill }: { show: boolean; onClose: () => void; propDrill: any }) {
	if (!show) return null;

	return (
		<Modal
			open={show}
			onClose={onClose}>
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

	function toggleAuthModal() {
		setShowAuthModal(!showAuthModal);
	}

	const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
	const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
	// useEffect(() => {
		
	// 	if (userPreferences || userInfo || userGenerations) {
    //         console.log(userPreferences);
    //         return;
    //     }
	// 	fetchUserData(setUserPreferences, setUserInfo, setUserGenerations);
	// }, []);

	function updateUserInfo() {
		fetchUserData(setUserInfo);
	}
	function updateUserPreferences() {
		fetchUserPreferences(setUserPreferences);
	}

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
					<Link style={{ color: "#fff" }} to='/'>
							dashboard
						</Link>
						<Link style={{ color: "#fff" }} to='/'>
							about
						</Link>
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
					propDrill={{userPreferences:userPreferences, userInfo:userInfo, updateUserInfo:updateUserInfo, updateUserPreferences:updateUserPreferences}}
				/>
				<Routes>
					<Route path='/readability' element={<Readability />} />
					<Route path='/' element={<Home />} />
					<Route path='/lessonplanner' element={<LessonPlan />} />
					<Route path='worksheetgenerator' element={<WorksheetGen />} />
				</Routes>
			</div>
			<footer className='footer'>
				<p>© 2023</p>
			</footer>
		</Router>
	);
}

export default App;
