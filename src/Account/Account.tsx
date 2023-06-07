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

	useEffect(() => {
		if (userInfo) {
			return;
		}
		updateUserInfo();
	}, []);


	function seePreferences() {
		console.log("see generations");
		updateUserPreferences();
	}

	return (
		<div style={{ maxWidth: "100%", maxHeight: "600px", whiteSpace: "break-spaces" }}>
			{userInfo ? (
				<div>
					<div style={{ fontSize: "1.3em" }}>
						<span>Hello, {userInfo["username"]}</span>
					</div>
					<div>
						<span>Email: {userInfo["email"]}</span>
					</div>
					<div>
						<span>Credits: {userPreferences?.credits ?? "..."}</span>
					</div>
					<div>
						<span>Subscription: {userPreferences?.subscription ?? "..."}</span>
					</div>
					<div>
						{userPreferences?.subscription !== "none" ? (
							<span>Subscription renews: {userPreferences?.subscription?.expiration}</span>
						) : null}
					</div>
				</div>
			) : (
				<p>Loading user info...</p>
			)}
		</div>
	);
};

export default Account;
