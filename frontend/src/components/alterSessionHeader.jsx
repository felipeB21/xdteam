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
          <strong className="text-sm">{user}</strong>
          <div className="mt-1.5">
            <UserOptionHeader />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Link
            href={"/login"}
            className="py-[8px] px-3 rounded border flex items-center hover:bg-neutral-200 hover:text-black duration-150"
          >
            <p className="font-medium text-sm">Sign in</p>
          </Link>
          <Link
            href={"/register"}
            className="py-[7px] px-3 rounded border border-sky-600 bg-sky-600 flex items-center hover:bg-sky-700 duration-150"
          >
            <p className="font-medium text-sm">Sign up</p>
          </Link>
        </div>
      )}
    </div>
  );
}
