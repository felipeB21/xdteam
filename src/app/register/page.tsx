"use client";
import RegisterForm from "@/components/form/register";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import { UserContext } from "../context/userContext";

export default function Register() {
  const router = useRouter();
  const { user } = useContext(UserContext);

  if (user) {
    router.push("/");
  }
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-neutral-900 p-20 rounded-xl">
        <h4 className="text-xl text-white font-medium mb-10">Register</h4>
        <RegisterForm />
      </div>
    </div>
  );
}
