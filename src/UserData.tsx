// src/components/UserData.tsx
import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';

interface UserData {
  user_id: string;
  preferences: {
    // Add your preference fields here
    examplePreference: string;
  };
}

const UserDataComponent: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userInfo = await Auth.currentAuthenticatedUser();
        const response = await fetch('/api/userdata', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.signInUserSession.idToken.jwtToken}`,
          },
        });
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div>
      <h1>User Data</h1>
      {userData ? (
        <div>
          <p>User ID: {userData.user_id}</p>
          <p>Example Preference: {userData.preferences.examplePreference}</p>
          <div>{JSON.stringify(userData)}</div>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default UserDataComponent;