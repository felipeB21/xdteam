"use client";
import { useContext, useState } from "react";
import DotsIcon from "./icons/dots";
import DotsOpenIcon from "./icons/dotsOpen";
import Link from "next/link";
import axios from "axios";
import LogoutIcon from "./icons/logout";
import UserIcon from "./icons/user";
import { AuthContext } from "@/app/context/AuthContext";

export default function UserOptionHeader() {
  const [menuVisible, setMenuVisible] = useState(false);
  const { user } = useContext(AuthContext);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:4000/api/v1/user/logout", {
        withCredentials: true,
      });
      localStorage.removeItem("accessToken");
      window.location.reload();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="relative">
      <button onClick={toggleMenu}>
        {menuVisible ? <DotsOpenIcon /> : <DotsIcon />}
      </button>
      {menuVisible && (
        <div className="absolute mt-2 right-0">
          <ul className="border border-neutral-700 p-5 rounded bg-neutral-900 flex flex-col gap-3">
            <li className="hover:text-neutral-300">
              <Link
                className="flex items-center gap-1"
                href={`/profile/${user}`}
              >
                <UserIcon /> Profile
              </Link>
            </li>
            <li className="hover:text-neutral-300">
              <button
                className="flex items-center gap-1"
                onClick={handleLogout}
              >
                <LogoutIcon /> Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
