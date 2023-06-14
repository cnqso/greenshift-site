/** @format */

import { Auth } from "aws-amplify";

// const url = "https://gcfz4xy1q7.execute-api.us-east-2.amazonaws.com/Prod/";
const url = "http://localhost:8000/";


async function fetchUserData(setUserClaims: Function, setUserPreferences: Function) {
	console.log("Grabbing user data")
	try {
		const userInfo = await Auth.currentAuthenticatedUser();
		const userClaims = {username: userInfo.username, email: userInfo.attributes.email, sub: userInfo.attributes.sub}
		setUserClaims(userClaims);
		fetchUserPreferences(setUserPreferences);
	} catch (error) {
		console.error("Error fetching user data:", error);
	}
}

async function fetchUserGenerations() {
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

		return data.generations["M"];
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
		console.log(JSON.stringify(JSON.parse(data.preferences), null, 2));

		setUserPreferences(JSON.parse(data.preferences));
	} catch (error) {
		console.error("Error fetching user data:", error);
	}
}



export { fetchUserData, fetchUserGenerations, fetchUserPreferences};
