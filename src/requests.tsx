/** @format */

import { Auth } from "aws-amplify";

// const url = "https://gcfz4xy1q7.execute-api.us-east-2.amazonaws.com/Prod/";
const url = "http://localhost:8000/";
async function sendToCluod(api: string, body: any) {
	const currentSession = await Auth.currentSession();
	const idToken = currentSession.getIdToken().getJwtToken();

	const response = await fetch(url + `api/${api}/`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: " " + idToken,
		},
		body: JSON.stringify(body),
	});

	if (response.ok) {
		const data = await response.json();
		return data;
	} else {
		console.error("An error occurred while fetching the analyzed text.");
		return false;
	}
}

async function fetchUserData(setUserClaims: Function) {
	console.log("Grabbing user data")
	try {
		const userInfo = await Auth.currentAuthenticatedUser();
		const userClaims = {username: userInfo.username, email: userInfo.attributes.email, sub: userInfo.attributes.sub}
		setUserClaims(userClaims);
	} catch (error) {
		console.error("Error fetching user data:", error);
	}
}

async function fetchUserGenerations(setUserGenerations: Function,) {
	console.log("Fetching user generations from server")
	try {
		// const storedUserData = JSON.parse(localStorage.getItem("userData") ?? "{}");
		// Load states with local storage data if it exists
		// if (storedUserData.databaseInfo && storedUserData.user_claims) {
		// 	if (!storedUserData.databaseInfo.Allinfo) {
		// 		setUserGenerations(storedUserData.databaseInfo.generations["M"]);
		// 		// If the data is from today, don't fetch new data.
		// 		if (
		// 			storedUserData.date &&
		// 			new Date(storedUserData.date).toDateString() === new Date().toDateString()
		// 		) {
		// 			return;
		// 		}
		// 	} else {
		// 		console.log("Stored user data is the result of a failed transaction.");
		// 	}
		// }

		const userInfo = await Auth.currentAuthenticatedUser();
		
		const response = await fetch(url + "api/usergenerations", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `${userInfo.signInUserSession.idToken.jwtToken}`,
			},
		});

		const data = await response.json();
		console.log(JSON.stringify(data.generations["M"], null, 2));

		setUserGenerations(data.generations["M"]);
	} catch (error) {
		console.error("Error fetching user data:", error);
	}
}

async function fetchUserPreferences(setUserPreferences: Function,) {
	console.log("Fetching user generations from server")
	try {

		const userInfo = await Auth.currentAuthenticatedUser();
		const response = await fetch(url + "api/userpreferences", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `${userInfo.signInUserSession.idToken.jwtToken}`,
			},
		});

		const data = await response.json();
		console.log(JSON.stringify(JSON.parse(data.preferences.S), null, 2));

		setUserPreferences(JSON.parse(data.preferences.S));
	} catch (error) {
		console.error("Error fetching user data:", error);
	}
}


export { sendToCluod, fetchUserData, fetchUserGenerations, fetchUserPreferences };
