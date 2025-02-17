"use client";
import React, { useState, useEffect } from "react";
import fetchUserProfile from "./user-profile-server";

const UserProfile: React.FC = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await fetchUserProfile();
        setUserData(data);
      } catch (error) {
        setError((error as any).message);
      }
    };

    getUserData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <div>{userData}</div>;
};

export default UserProfile;
