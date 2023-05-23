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

async function fetchUserData(setUserData: Function, setUserGenerations: Function, setUserClaims: Function) {
	try {
		const userInfo = await Auth.currentAuthenticatedUser();
		console.log(userInfo);
		const storedUserData = JSON.parse(localStorage.getItem("userData") ?? "{}");
		console.log(storedUserData);
		// Load states with local storage data if it exists
		if (storedUserData.databaseInfo && storedUserData.user_claims) {
			if (!storedUserData.databaseInfo.Allinfo) {
				setUserData(JSON.parse(storedUserData.databaseInfo.preferences.S));
				setUserGenerations(storedUserData.databaseInfo.generations["M"]);
				setUserClaims(storedUserData.user_claims);
				// If the data is from today, don't fetch new data.
				if (
					storedUserData.date &&
					new Date(storedUserData.date).toDateString() === new Date().toDateString()
				) {
					return;
				}
			} else {
				console.log("Stored user data is the result of a failed transaction.");
			}
		}

		console.log("Fetching user data from API.");
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
}

export { sendToCluod, fetchUserData };
