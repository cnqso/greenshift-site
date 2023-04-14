/** @format */

import { useState } from "react";
import RichText from "./Readability/RichText";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import { Auth } from "aws-amplify";
// console.log((await Auth.currentSession()).getIdToken().getJwtToken())
import Readability from "./Readability/Readability";
import Home from "./Home/Home";
import Account from "./Account/Account";
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';

Amplify.configure(awsExports);

function App() {
	return (
		<Router>
      <div className="App">
        <Authenticator>
          {({ signOut, user }) => (
            <main>
              <h1>Hello {user.username}</h1>
              <button onClick={signOut}>Sign out</button>
            </main>
          )}
        </Authenticator>
        <Routes>
		  <Route path="/readability" element={<Readability/>} />
          <Route path="/" element={<Home/>} />
          <Route path="/account" element={<Account/>} />
        </Routes>
      </div>
    </Router>
	);
}

export default App;
