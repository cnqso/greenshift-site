/** @format */

// src/components/UserData.tsx
import React, { useState, useEffect } from "react";
import { Auth } from "aws-amplify";

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
	Preferences: {
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
	time: number;
	input: string;
	output: string;
	difficulty: number;
}

interface InputData {
	user_claims: UserClaims;
	databaseInfo: DatabaseInfo;
}

const UserDataComponent: React.FC = () => {
	const [userData, setUserData] = useState<UserData | null>(null);
	const [userClaims, setUserClaims] = useState<UserClaims | null>(null);
	const url = "https://gcfz4xy1q7.execute-api.us-east-2.amazonaws.com/Prod/";
	// const url = "http://localhost:8000/";
	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const userInfo = await Auth.currentAuthenticatedUser();
				const response = await fetch(url + "api/userdata", {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `${userInfo.signInUserSession.idToken.jwtToken}`,
					},
				});
				const data = await response.json();
				setUserData(JSON.parse(data.databaseInfo.Preferences.S));
				setUserClaims(data.user_claims);
			} catch (error) {
				console.error("Error fetching user data:", error);
			}
		};

		fetchUserData();
	}, []);
	// const userPreferences = userData.databaseInfo.Preferences.S;
	// const preferences = userData.
	return (
		<div>
			<h1>User Data</h1>
			{userData ? (
				<div>
					<div>User ID: {userClaims.sub}</div>
					<div>Username: {userClaims["cognito:username"]}</div>
					<div>Email: {userClaims.email}</div>
					<div>Subscription: {userData.subscription}</div>
					<div>Credits: {userData.credits}</div>
					<div>
						Transactions:{" "}
						{Object.entries(userData.transactions).map(
							([date, transaction]: [string, Transaction]) => {
								return (
									<div key={date} style={{display: "flex", justifyContent: "space-around"}}>
                    <span>Date: {date}</span>
										<span>Amount: {transaction.amount}</span>
										<span>Type: {transaction.type}</span>
									</div>
								);
							}
						)}
					</div>
          <div>
						Generations:{" "}
						{Object.entries(userData.generations).map(
							([date, generation]: [string, Generation]) => {
								return (
									<div key={date} style={{display: "flex", justifyContent: "space-between"}}>
										<span>Time: {generation.time}</span>
										<span>Input: {generation.input}</span>
										<span>Output: {generation.output}</span>
                    <span>Difficulty: {generation.difficulty}</span>
									</div>
								);
							}
						)}
					</div>
				</div>
			) : (
				<p>Loading user data...</p>
			)}
		</div>
	);
};

export default UserDataComponent;
