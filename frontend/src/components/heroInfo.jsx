"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import CountUp from "react-countup";

export default function HeroInfo() {
  const [userCount, setUserCount] = useState(0);
  const [teamCount, setTeamCount] = useState(0);

  useEffect(() => {
    const getUserCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/user/length"
        );
        setUserCount(response.data.count);
      } catch (error) {
        setUserCount(0);
      }
    };
    const getTeamCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/team/length"
        );
        setTeamCount(response.data.count);
      } catch (error) {
        setTeamCount(0);
      }
    };

    getUserCount();
    getTeamCount();
  }, []);

  return (
    <div>
      <h4 className="lg:text-4xl md:text-3xl text-2xl font-bold mb-3">
        Join our community
      </h4>
      <div className="grid grid-cols-2">
        <div className="bg-neutral-950 py-4 px-8 border border-neutral-700 rounded-2xl w-max">
          <p className="font-bold text-xl">
            Users: <CountUp end={userCount} duration={2} />
          </p>
        </div>
        <div className="bg-neutral-950 py-4 px-8 border border-neutral-700 rounded-2xl w-max">
          <p className="font-bold text-xl">
            Teams: <CountUp end={teamCount} duration={2} />
          </p>
        </div>
      </div>
    </div>
  );
}
