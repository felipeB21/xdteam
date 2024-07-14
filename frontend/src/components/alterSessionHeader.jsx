"use client";
import { AuthContext } from "@/app/context/AuthContext";
import React, { useContext } from "react";
import Link from "next/link";
import UserOptionHeader from "./userOptionHeader";
import LoadingIcon from "./icons/loading";

export default function AlterSessionHeader() {
  const { user, loading } = useContext(AuthContext);
  if (loading) {
    return (
      <div className="py-[11px]">
        <LoadingIcon />
      </div>
    );
  }
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
            className="py-[8px] px-3 rounded border flex items-center hover:bg-white hover:text-black duration-150"
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
