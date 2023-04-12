/** @format */

import { useState } from "react";
import RichText from "./RichText";

import "./App.css";

// import { Amplify } from "aws-amplify";
// import awsExports from "./aws-exports";

// import { Authenticator } from "@aws-amplify/ui-react";
// import "@aws-amplify/ui-react/styles.css";
// import { Auth } from "aws-amplify";
// console.log((await Auth.currentSession()).getIdToken().getJwtToken())

// Amplify.configure({
// 	Auth: {
// 		region: awsExports.REGION,
// 		userPoolId: awsExports.USER_POOL_ID,
// 		userPoolWebClientId: awsExports.USER_POOL_APP_CLIENT_ID,
// 		// identityPoolId: 'your-identity-pool-id',
// 	},
// });

import { Amplify } from 'aws-amplify';

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsExports from './aws-exports';
Amplify.configure(awsExports);

function App() {
	return (
		<div className='App'>
			    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <h1>Hello {user.username}</h1>
          <button onClick={signOut}>Sign out</button>
        </main>
      )}
    </Authenticator>
			<h1>GreenShift</h1>
			<div className='RichTextBox'>
				<RichText />
			</div>
		</div>
	);
}

export default App;
