// src/components/Account.tsx
import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import UserDataComponent from '../UserData';

interface UserData {
  email: string;
  username: string;
  // Add other data attributes as needed
}

const Account: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formValues, setFormValues] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userInfo = await Auth.currentAuthenticatedUser();
        const { attributes } = userInfo;
        setUserData({
          email: attributes.email,
          username: userInfo.username,
        });
        setFormValues({
          email: attributes.email,
          username: userInfo.username,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleEditButtonClick = () => {
    setEditMode(true);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (formValues) {
      setFormValues({ ...formValues, [event.target.name]: event.target.value });
    }
  };

  const handleSaveButtonClick = async () => {
    // Save the updated data to your Django backend and DynamoDB
    // You can make API calls to your Django backend to update user preferences
    // or other data stored in your DynamoDB table

    // Update user attributes like email using Amplify's Auth.updateUserAttributes()
    try {
      const user = await Auth.currentAuthenticatedUser();
      await Auth.updateUserAttributes(user, {
        email: formValues?.email || '',
      });
      setUserData(formValues);
      console.log('User attributes updated successfully!')
    } catch (error) {
      console.error('Error updating user attributes:', error);
    }

    setEditMode(false);
  };

  const handleCancelButtonClick = () => {
    setFormValues(userData);
    setEditMode(false);
  };

  return (
    <div>
      <h1>My Account</h1>
      <UserDataComponent/>
      {userData ? (
        editMode ? (
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formValues?.username || ''}
              onChange={handleInputChange}
              
            />
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formValues?.email || ''}
              onChange={handleInputChange}
              disabled
            />
            <button onClick={handleSaveButtonClick}>Save</button>
            <button onClick={handleCancelButtonClick}>Cancel</button>
          </div>
        ) : (
          <div>
            <p>Username: {userData.username}</p>
            <p>Email: {userData.email}</p>
            <button onClick={handleEditButtonClick}>Edit</button>
          </div>
        )
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default Account;