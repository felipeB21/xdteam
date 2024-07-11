"use client";
import { useContext, useState, useEffect, useRef } from "react";
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
  const menuRef = useRef(null);

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

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuVisible(false);
    }
  };

  useEffect(() => {
    if (menuVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuVisible]);

  return (
    <div className="relative">
      <button onClick={toggleMenu}>
        {menuVisible ? <DotsOpenIcon /> : <DotsIcon />}
      </button>
      {menuVisible && (
        <div ref={menuRef} className="absolute mt-2 right-0">
          <ul className="border border-neutral-700 p-5 rounded bg-neutral-900 flex flex-col gap-4">
            <li className="hover:text-neutral-300">
              <Link
                className="flex items-center gap-1 text-sm"
                href={`/profile/${user}`}
                onClick={() => setMenuVisible(false)}
              >
                <UserIcon /> Profile
              </Link>
            </li>
            <li className="hover:text-neutral-300">
              <button
                className="flex items-center gap-1 text-sm"
                onClick={() => {
                  handleLogout();
                  setMenuVisible(false);
                }}
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
