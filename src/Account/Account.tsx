// src/components/Account.tsx
import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import UserDataComponent from '../UserData';

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
  [key: string]: {[S:string]: string}
}

interface InputData {
	user_claims: UserClaims;
	databaseInfo: DatabaseInfo;
}

const Account = ({propDrill}:{propDrill: any}) => {
  console.log(JSON.stringify(propDrill, null, 2))
  const [editMode, setEditMode] = useState(false);
  const [formValues, setFormValues] = useState<UserData | null>(null);
  const userData = propDrill[0];
  const userClaims = propDrill[1];
  const userGenerations = propDrill[2];
 
  
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

  return (
    <div>
      <h1 style={{marginTop: 0}}>My Account</h1>
			{userData && userClaims ? (
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
            {Object.entries(userGenerations)[0] ? <>
            {Object.entries(userGenerations).map(
							([date, generationString]: [string, any]) => {
                const generation = JSON.parse(generationString.S)
                const day = new Date(parseInt(date.slice(1,14))).toLocaleDateString("en-US")
								return (
									<div key={date} style={{display: "flex", justifyContent: "space-around"}}>
                    <span>Date: {day}</span>
										<span>Input: {generation.input}</span>
										<span>Output: {generation.output}</span>
									</div>
								);
							}
						)}</> : <p>No generations</p>}

					</div>
				</div>
			) : (
				<p>Loading user data...</p>
			)}
		</div>
  );
};

export default Account;