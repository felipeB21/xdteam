"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";
import Error from "@/components/error";
import Link from "next/link";
import GlobeIcon from "@/components/icons/globe";

export default function UserPage({ params }) {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [ubiId, setUbiId] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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
        setError(error.response?.data?.msg || "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [params.username]);

  const handleUbiIdChange = (e) => {
    setUbiId(e.target.value);
  };

  const handleUbiIdSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(
        `http://localhost:4000/api/v1/user/ubi/id/set/${params.username}`,
        { ubiId },
        {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem(
              "accessToken"
            )}`,
          },
        }
      );
      setSuccess(response.data.msg);
      setUserData((prevData) => ({
        ...prevData,
        data: { ...prevData.data, ubiId },
      }));
    } catch (error) {
      setError(error.response?.data?.msg || "An error occurred");
    }
  };

  return (
    <div className="main-layout">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-2 h-[75dvh]">
          <h3 className="text-2xl font-bold">Loading...</h3>
        </div>
      ) : userData ? (
        <div>
          <p className="text-2xl font-bold mb-3">{userData.data.username}</p>
          <div>
            {userData.data.ubiId ? (
              <Link
                className="bg-green-500 py-2 px-4 flex items-center gap-2 w-max rounded-xl"
                href={`/profile/ubi/${userData.data.ubiId}`}
              >
                <Image
                  className="w-auto h-auto"
                  src={"/Ubisoft_logo.svg.png"}
                  alt="ubi"
                  width={30}
                  height={30}
                />
                <p className="text-xl font-bold">{userData.data.ubiId}</p>
              </Link>
            ) : (
              <p>No Ubisoft ID set</p>
            )}
          </div>
          {isCurrentUser &&
            (userData.data.ubiId ? (
              <div>
                <button
                  onClick={() => setUbiId(userData.data.ubiId)}
                  className="ubi-edit-button"
                >
                  Edit Ubisoft ID
                </button>
                <form onSubmit={handleUbiIdSubmit}>
                  <input
                    type="text"
                    id="ubiId"
                    value={ubiId}
                    onChange={handleUbiIdChange}
                    placeholder="Edit your Ubisoft ID"
                    className="ubi-input"
                  />
                  <button type="submit" className="ubi-submit-button">
                    Save
                  </button>
                </form>
              </div>
            ) : (
              <form onSubmit={handleUbiIdSubmit}>
                <input
                  type="text"
                  id="ubiId"
                  value={ubiId}
                  onChange={handleUbiIdChange}
                  placeholder="Set your Ubisoft ID"
                  className="ubi-input"
                />
                <button type="submit" className="ubi-submit-button">
                  Set Ubisoft ID
                </button>
              </form>
            ))}
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
          {userData.data.team && (
            <div className="mt-10">
              <h4 className="text-xl font-bold">Team</h4>
              <Link
                href={`/team/${userData.data.team.id}/${userData.data.team.name}`}
                className="flex items-center gap-2 mt-2 border border-neutral-700 py-1 px-2 w-max rounded-xl hover:bg-neutral-900 duration-200"
              >
                <Image
                  priority
                  className="w-50 h-50 object-cover rounded-full"
                  src={userData.data.team.img}
                  alt={`Image of team ${userData.data.team.name}`}
                  width={50}
                  height={50}
                />
                <div>
                  <p className="font-medium">{userData.data.team.name}</p>
                  <p className="text-neutral-300 text-xs flex items-center gap-1">
                    <GlobeIcon />
                    {userData.data.team.region}
                  </p>
                </div>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <Error />
      )}
    </div>
  );
}
