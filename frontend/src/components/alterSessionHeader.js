"use client";
import { AuthContext } from "@/app/context/AuthContext";
import React, { useContext } from "react";
import Link from "next/link";
import UserOptionHeader from "./userOptionHeader";

export default function AlterSessionHeader() {
  const { user } = useContext(AuthContext);
  return (
    <div>
      {user ? (
        <div className="flex items-center gap-3 py-1">
          <strong>{user}</strong>
          <div className="mt-1">
            <UserOptionHeader />
          </div>
        </div>
      ) : (
        <Link
          href={"/login"}
          className="py-[7px] px-3 rounded bg-neutral-700 border border-neutral-600 flex items-center gap-2 hover:bg-neutral-600 duration-150"
        >
          <p className="font-medium text-sm">Sign in / Sign up</p>
        </Link>
      )}
    </div>
  );
}
