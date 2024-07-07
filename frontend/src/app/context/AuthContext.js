import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const response = await axios.get(
            "http://localhost:4000/api/v1/user/verify",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setUser(response.data.username);
        } catch (error) {
          setUser(null);
        }
      }
    };

    checkLoggedIn();
  }, []);

  useEffect(() => {
    const userData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/user/data",
          {
            withCredentials: true,
          }
        );
        setData(response.data);
      } catch (error) {
        setData(null);
      }
    };

    userData();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, data, setData }}>
      {children}
    </AuthContext.Provider>
  );
};
