/** @format */

// src/components/Account.tsx
import React, { useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import { fetchUserGenerations, fetchUserPreferences } from "../requests";
// import UserDataComponent from '../UserData';

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

const Account = ({ propDrill }: { propDrill: any }) => {
	const { userInfo, userPreferences, updateUserInfo, updateUserPreferences }: any = { ...propDrill };

	const [userGenerations, setUserGenerations] = useState({});
	useEffect(() => {
		if (userInfo) {
			return;
		}
		updateUserInfo();
	}, []);

	function seeGenerations() {
		console.log("see generations");
		fetchUserGenerations(setUserGenerations);
	}

	function seePreferences() {
		console.log("see generations");
		updateUserPreferences();
	}

	return (
		<div style={{ maxWidth: "100%", maxHeight: "600px", whiteSpace: "break-spaces" }}>
			<h1 style={{ marginTop: 0 }}>My Account</h1>
			{userInfo ? (
				<div>
					<div>
						<span>User: {userInfo["username"]}</span>
					</div>
					<div>
						<span>Email: {userInfo["email"]}</span>
					</div>
					<br />
					<div>
						<span>Generations: {Object.keys(userGenerations).length}</span>
					</div>

					<br />

					{userPreferences ? (
						<div>
							<div>
								<span>Credits: {userPreferences.credits}</span>
							</div>
							<div>
								<span>Subscription: {userPreferences.subscription}</span>
							</div>
						</div>
					) : (
						<p>Loading user preferences...</p>
					)}
				</div>
			) : (
				<p>Loading user info...</p>
			)}

			<button onClick={seeGenerations}>See generations</button>
			<button onClick={seePreferences}>See preferences</button>
		</div>
	);
};

export default Account;
