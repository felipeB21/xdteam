"use client";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function UbiPage({ params }) {
  const [userRank, setUserRank] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/v1/user/ubi/${params.id}`
        );
        const data = res.data;
        setUserData(data.data.platformInfo);
        setUserRank(data.data.segments[0].stats.rankStr);
        setError(null); // Clear any previous errors
      } catch (error) {
        setError(error.response?.data?.msg || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  return (
    <div>
      {loading ? (
        <p className="flex items-center justify-center h-[85dvh]">loading</p>
      ) : error ? (
        <div className="flex items-center justify-center h-[85dvh]">
          <h5>{error}</h5>
        </div>
      ) : (
        <div>
          <div className="main-layout mt-60">
            <div>
              <Image
                priority={true}
                className="absolute object-cover w-full max-h-[30dvh] mt-14"
                src={"/XDefiant_src.png"}
                alt="banner"
                fill
              />
              <div className="relative mt-52">
                <div className="flex items-center gap-5">
                  <Image
                    className="w-auto h-auto rounded-full border-2"
                    src={userData.avatarUrl}
                    alt={userData.platformUserIdentifier}
                    width={100}
                    height={100}
                  />
                  <h4 className="font-medium text-xl">
                    {userData.platformUserIdentifier}
                  </h4>
                </div>
                <div className="flex gap-2 mt-5">
                  <Image
                    priority={true}
                    className="w-auto h-auto"
                    src={userRank.metadata.imageUrl}
                    alt={userRank.value}
                    width={34}
                    height={34}
                  />
                  <div>
                    <p className="text-sm text-neutral-300">Rating</p>
                    <p className="font-medium">{userRank.displayValue}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
