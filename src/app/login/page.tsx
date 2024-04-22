"use client";
import LoginForm from "@/components/form/login";
import Link from "next/link";
import React, { useContext } from "react";
import { UserContext } from "../context/userContext";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const { user, loading } = useContext(UserContext);

  if (user) {
    router.push("/");
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-neutral-900 p-20 rounded-xl">
          <h4 className="text-xl text-white font-medium mb-10">Sign in</h4>
          <LoginForm />
          <div className="border-t border-neutral-700 mt-5">
            <Link href="/register">
              <p className="text-sky-500 mt-5 hover:underline">
                Don&apos;t have an account?
              </p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
