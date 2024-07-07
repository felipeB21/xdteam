"use client";
import { AuthProvider } from "@/app/context/AuthContext";

export default function AuthContextProvider({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
