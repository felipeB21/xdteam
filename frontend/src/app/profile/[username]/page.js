"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export default function UserPage({ params }) {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await axios.get(
          `http://localhost:4000/api/v1/user/profile/${params.username}`
        );

        if (user) {
          setUserData(user.data);
        }

        const token = window.localStorage.getItem("accessToken");
        if (token) {
          const decodedToken = jwtDecode(token);
          if (decodedToken.username === params.username) {
            setIsCurrentUser(true);
          }
        }
      } catch (error) {
        setUserData(null);
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [params.username]);

  return (
    <div className="main-layout">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-2 h-[75dvh]">
          <h3 className="text-2xl font-bold">Loading...</h3>
        </div>
      ) : userData ? (
        <div>
          <p className="text-xl font-bold">{userData.data.username}</p>
          {isCurrentUser ? <p>Es tu cuenta</p> : <p>No es tu cuenta</p>}
          {userData.data.team && (
            <div>
              <p>Team: {userData.data.team.name}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 h-[75dvh]">
          <h3 className="text-2xl font-bold">404</h3>
          <h2 className="text-xl font-bold">User not found</h2>
        </div>
      )}
    </div>
  );
}
