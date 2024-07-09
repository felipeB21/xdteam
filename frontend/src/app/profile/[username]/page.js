"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";
import Error from "@/components/error";

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
          <p className="text-2xl font-bold">{userData.data.username}</p>
          {isCurrentUser ? <p>Es tu cuenta</p> : <p>No es tu cuenta</p>}
          {userData.data.team && (
            <div className="mt-10">
              <h4 className="text-2xl font-bold">Team</h4>
              <div className="border-2 border-neutral-700 w-max py-4 px-12 mt-2 rounded-xl">
                <p className="text-xl font-medium">{userData.data.team.name}</p>
                <Image
                  priority
                  className="w-auto h-auto"
                  src={userData.data.team.img}
                  alt={`Image of team ${userData.data.team.name}`}
                  width={200}
                  height={200}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <Error />
      )}
    </div>
  );
}
