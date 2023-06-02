/** @format */

// src/components/Account.tsx
import React, { useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import { fetchUserData } from "../requests";
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
	const { userData, userGenerations, userClaims, updateUserInfo }:any = { ...propDrill };

	
	// const [editMode, setEditMode] = useState(false);
	// const [formValues, setFormValues] = useState<UserData | null>(null);
	// useEffect(() => {
	//   const fetchUserData = async () => {
	//     try {
	//       const userInfo = await Auth.currentAuthenticatedUser();
	//       const { attributes } = userInfo;
	//       setUserData({
	//         email: attributes.email,
	//         username: userInfo.username,
	//       });
	//       setFormValues({
	//         email: attributes.email,
	//         username: userInfo.username,
	//       });
	//     } catch (error) {
	//       console.error('Error fetching user data:', error);
	//     }
	//   };

	//   fetchUserData();
	// }, []);

	// const handleEditButtonClick = () => {
	//   setEditMode(true);
	// };

	// const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
	//   if (formValues) {
	//     setFormValues({ ...formValues, [event.target.name]: event.target.value });
	//   }
	// };

	// const handleSaveButtonClick = async () => {
	//   // Save the updated data to your Django backend and DynamoDB
	//   // You can make API calls to your Django backend to update user preferences
	//   // or other data stored in your DynamoDB table

	//   // Update user attributes like email using Amplify's Auth.updateUserAttributes()
	//   try {
	//     const user = await Auth.currentAuthenticatedUser();
	//     await Auth.updateUserAttributes(user, {
	//       email: formValues?.email || '',
	//     });
	//     setUserData(formValues);
	//     console.log('User attributes updated successfully!')
	//   } catch (error) {
	//     console.error('Error updating user attributes:', error);
	//   }

	//   setEditMode(false);
	// };

	// const handleCancelButtonClick = () => {
	//   setFormValues(userData);
	//   setEditMode(false);
	// };


	useEffect(() => {
		if (userData && userClaims) {
            return;
        }
		updateUserInfo();
	}, []);

	return (
		<div
			style={{ maxWidth: "100%", maxHeight: "600px", whiteSpace: "break-spaces", }}>
			<h1 style={{ marginTop: 0 }}>My Account</h1>
			{userData && userClaims ? (
				<div>
					<div >
						<span>User: {userClaims["cognito:username"]}</span>
					</div>
					<div >
						<span>Email: {userClaims["email"]}</span>
					</div>
					<div >
						<span>Generations: {Object.keys(userGenerations).length}</span>
					</div>
					<div >
						<span>Credits: {userData.credits}</span>
					</div>
					<div >
						<span>Subscription: {userData.subscription}</span>
					</div>
					<br/>

				</div>
			) : (
				<p>Loading user data...</p>
			)}
		</div>
	);
};

export default Account;
