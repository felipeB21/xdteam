"use client";
import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({} as any);

export function UserProvider({ children }: any) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    try {
      if (!user) {
        axios
          .get("/api/user/me")
          .then((res) => setUser(res.data))
          .catch((error) => {
            console.error("Error fetching user data:", error);
          });

        setLoading(false);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  }, [user]);
  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}
