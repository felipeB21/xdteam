"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import CountUp from "react-countup";

export default function HeroInfo() {
  const [userCount, setUserCount] = useState(0);

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

    getUserCount();
  }, []);

  return (
    <div className="md:mt-24">
      <h4 className="lg:text-3xl md:text-2xl text-xl font-bold mb-3">
        Join our community
      </h4>
      <div className="bg-neutral-950 py-3 px-6 border border-neutral-700 rounded-2xl w-max">
        <p className="font-medium">
          Users: <CountUp end={userCount} duration={2.5} />
        </p>
      </div>
    </div>
  );
}
