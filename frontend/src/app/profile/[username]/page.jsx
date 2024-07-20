"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";
import Error from "@/components/error";
import Link from "next/link";
import GlobeIcon from "@/components/icons/globe";
import ArrowDown from "@/components/icons/arrowDown";

export default function UserPage({ params }) {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [ubiId, setUbiId] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditingUbiId, setIsEditingUbiId] = useState(false); // Nuevo estado

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
      setIsEditingUbiId(false);
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
          <div className="flex gap-5">
            {userData.data.team ? (
              <Image
                priority
                className="w-[120px] h-[120px] rounded-full border-2 object-cover"
                src={userData.data.team.img}
                alt={`Image of team ${userData.data.team.name}`}
                width={100}
                height={100}
              />
            ) : (
              <Image
                className="w-[120px] h-[120px] rounded-full border-2"
                src={"/default256.webp"}
                alt="default-img"
                width={100}
                height={100}
              />
            )}
            <div className="flex flex-col gap-1">
              <p className="text-3xl font-bold">{userData.data.username}</p>

              {userData.data.team ? (
                <Link
                  className="text-sm hover:underline"
                  href={`/team/${userData.data.team.id}/${userData.data.team.name}`}
                >
                  {userData.data.team.name}
                </Link>
              ) : (
                <p className="text-sm text-neutral-300">No team</p>
              )}

              <div>
                {userData.data.ubiId ? (
                  <div className="flex items-center gap-2">
                    <Link
                      className="bg-green-100 py-1 px-2 text-black flex items-center gap-2 w-max rounded-xl"
                      href={`/profile/ubi/${userData.data.ubiId}`}
                    >
                      <Image
                        className="w-auto h-auto"
                        src={"/Ubisoft_logo.svg.png"}
                        alt="ubi"
                        width={15}
                        height={15}
                      />
                      <p className="font-bold">{userData.data.ubiId}</p>
                    </Link>
                    {isCurrentUser && (
                      <button
                        onClick={() => setIsEditingUbiId(!isEditingUbiId)}
                      >
                        <ArrowDown />
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-neutral-300">No Ubisoft ID set</p>
                )}
              </div>
            </div>
          </div>

          {isCurrentUser && (
            <>
              {isEditingUbiId && (
                <form onSubmit={handleUbiIdSubmit}>
                  <input
                    type="text"
                    id="ubiId"
                    value={ubiId}
                    onChange={handleUbiIdChange}
                    placeholder="Edit your Ubisoft ID"
                    className="ubi-input"
                  />
                </form>
              )}
              {!userData.data.ubiId && (
                <form onSubmit={handleUbiIdSubmit}>
                  <input
                    type="text"
                    id="ubiId"
                    value={ubiId}
                    onChange={handleUbiIdChange}
                    placeholder="Set your Ubisoft ID"
                    className="ubi-input"
                  />
                </form>
              )}
            </>
          )}
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
        </div>
      ) : (
        <Error />
      )}
    </div>
  );
}
