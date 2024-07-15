"use client";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function UbiPage({ params }) {
  const [userRank, setUserRank] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
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
        setUserInfo(data.data.userInfo);
        setUserRank(data.data.segments[0].stats.rankStr);
        setError(null);
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
        <div className="main-layout">
          <Image
            className="object-cover absolute max-h-[30dvh] top-0"
            src={"/xdteam_profile.avif"}
            alt="profile"
            fill
          />
          <div className="relative top-24">
            <div className="flex items-center gap-5 ">
              <Image
                className="w-auto h-auto rounded-full border-2"
                src={userData.avatarUrl}
                alt={userData.platformUserIdentifier}
                width={100}
                height={100}
              />

              <div className="flex items-center gap-2">
                <h4 className="font-medium text-2xl">
                  {userData.platformUserIdentifier}
                </h4>
                {userInfo.countryCode && (
                  <div>
                    <Image
                      className="w-auto h-auto"
                      src={`https://flagsapi.com/${userInfo.countryCode}/flat/64.png`}
                      alt={userInfo.countryCode}
                      width={20}
                      height={20}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <section className="mt-32">
            <h5 className="text-2xl font-bold">Overview</h5>
            <div className="mt-5">
              <div className="flex flex-col gap-2 border border-neutral-600 rounded-xl p-3 w-max">
                <h5 className="text-xl text-neutral-300 font-bold">
                  Current Rank
                </h5>
                <div className="flex gap-2">
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
          </section>
        </div>
      )}
    </div>
  );
}
