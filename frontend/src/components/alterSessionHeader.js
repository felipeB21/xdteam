"use client";
import { AuthContext } from "@/app/context/AuthContext";
import React, { useContext } from "react";
import Link from "next/link";
import UserOptionHeader from "./userOptionHeader";
import LoginIcon from "./icons/login";

export default function AlterSessionHeader() {
  const { user } = useContext(AuthContext);
  return (
    <div>
      {user ? (
        <div className="flex items-center gap-3 py-0.5">
          <strong>{user}</strong>
          <div className="mt-1">
            <UserOptionHeader />
          </div>
        </div>
      ) : (
        <Link
          href={"/login"}
          className="py-1 px-2 rounded bg-sky-600 flex items-center gap-2 hover:bg-sky-700 duration-150"
        >
          <LoginIcon />
          <p className="font-medium">Sign in</p>
        </Link>
      )}
    </div>
  );
}
