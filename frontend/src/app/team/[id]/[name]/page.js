"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import LockClose from "@/components/icons/lockClose";
import LockOpen from "@/components/icons/lockOpen";
import Star from "@/components/icons/star";
import GlobeIcon from "@/components/icons/globe";
import Error from "@/components/error";
import { jwtDecode } from "jwt-decode";

export default function TeamPage({ params }) {
  const [teamData, setTeamData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInTeam, setIsInTeam] = useState(false);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const team = await axios.get(
          `http://localhost:4000/api/v1/team/search/${params.name}`
        );

        if (team) {
          setTeamData(team.data);
        }

        const token = window.localStorage.getItem("accessToken");
        if (token) {
          const decodedToken = jwtDecode(token);
          const players = team.data.data.players.map(
            (player) => player.username
          );
          if (players.includes(decodedToken.username)) {
            setIsInTeam(true);
          }
        }
      } catch (error) {
        setTeamData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamData();
  }, [params.name]);

  return (
    <div className="main-layout">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center gap-2 h-[75dvh]">
          <h3 className="text-2xl font-bold">Loading...</h3>
        </div>
      ) : teamData ? (
        <div>
          <div className="flex gap-10">
            <Image
              className="w-[200px] h-[200px] object-cover rounded-lg"
              src={teamData.data.img}
              alt={teamData.data.name}
              width={200}
              height={200}
              placeholder="blur"
              blurDataURL={teamData.data.img}
              priority={true}
            />
            <div>
              <h2 className="text-3xl font-bold">{teamData.data.name}</h2>
              <p className="flex items-center gap-1 text-neutral-300">
                <GlobeIcon /> {teamData.data.region}
              </p>
              <div className="text-neutral-300">
                {teamData.data.isPublic === true ? (
                  <div className="flex items-center gap-1">
                    <LockOpen />
                    <p>Public</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <LockClose />
                    <p>Private</p>
                  </div>
                )}
              </div>
              <div className="mt-2">
                <h4 className="text-xl font-bold">Players</h4>
                <ul className="flex flex-col">
                  {teamData.data.players.map((player) => (
                    <li key={player.id}>
                      <Link href={`/profile/${player.username}`}>
                        <p
                          className="flex items-center gap-1 text-sm hover:underline"
                          style={{
                            color:
                              player.username === teamData.data.leaderUsername
                                ? "orange"
                                : "",
                          }}
                        >
                          {player.username}
                          {player.username === teamData.data.leaderUsername && (
                            <Star />
                          )}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          {isInTeam ? (
            <div className="mt-10">
              <div className="flex flex-col gap-2 w-full">
                <h2 className="text-2xl font-bold">Messages</h2>
                <div className="bg-neutral-900 h-[50dvh] p-4 rounded-xl">
                  <p>a</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col text-xl text-neutral-300 items-center justify-center h-[50dvh]">
              <LockClose />
              <p>To see or send messages tou have to be in this team.</p>
            </div>
          )}
        </div>
      ) : (
        <Error />
      )}
    </div>
  );
}
