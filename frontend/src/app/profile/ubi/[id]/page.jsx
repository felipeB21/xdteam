"use client";
import EyeIcon from "@/components/icons/eye";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function UbiPage({ params }) {
  const [userRank, setUserRank] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [userGameInfo, setUserGameInfo] = useState(null);
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
        setUserGameInfo(data.data.segments[0].stats);
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
        <div className="flex flex-col items-center justify-center h-[85dvh]">
          <p>Oops!</p>
          <h5 className="text-xl font-medium">{error}.</h5>
        </div>
      ) : (
        <div className="main-layout">
          <Image
            className="object-cover absolute max-h-[30dvh] top-0"
            src={"/xdteam_profile.avif"}
            alt="profile"
            fill
          />
          <div className="relative top-[120px]">
            <div className="flex items-center gap-5">
              <div>
                <Image
                  className="w-auto h-auto rounded-full border-2"
                  src={userData.avatarUrl}
                  alt={userData.platformUserIdentifier}
                  width={100}
                  height={100}
                />
                {userInfo.countryCode && (
                  <Image
                    className="w-auto h-auto absolute bottom-1 left-24"
                    src={`https://flagsapi.com/${userInfo.countryCode}/flat/64.png`}
                    alt={userInfo.countryCode}
                    width={20}
                    height={20}
                  />
                )}
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-2xl">
                    {userData.platformUserIdentifier}
                  </h4>
                  <div className="w-[22px] h-[22px] p-4 flex items-center justify-center rounded-full border">
                    {userGameInfo.playerLevel.value}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-neutral-300">
                  <EyeIcon />
                  <p>{userInfo.pageviews}</p>
                </div>
              </div>
            </div>
          </div>
          <section className="mt-32">
            <h5 className="text-2xl font-bold">Overview</h5>
            <div className="mt-5 flex flex-grow gap-5">
              <div className="flex flex-col gap-2 border border-neutral-600 rounded-xl w-[15dvw] p-3 bg-neutral-900">
                <h5 className="text-xl text-neutral-300 font-bold">
                  {userRank.displayName}
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
              <div className="border border-neutral-600 rounded-xl p-3 w-full bg-neutral-900 grid grid-cols-5">
                <div>
                  <h5 className="text-xl text-neutral-300 font-bold">
                    {userGameInfo.kills.displayName}
                  </h5>
                  <p>{userGameInfo.kills.displayValue}</p>
                </div>

                <div>
                  <h5 className="text-xl text-neutral-300 font-bold">
                    {userGameInfo.killsPerMatch.displayName}
                  </h5>
                  <p>{userGameInfo.killsPerMatch.displayValue}</p>
                </div>

                <div>
                  <h5 className="text-xl text-neutral-300 font-bold">
                    {userGameInfo.assists.displayName}
                  </h5>
                  <p>{userGameInfo.assists.displayValue}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
