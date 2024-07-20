import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/user/refresh",
        null,
        {
          withCredentials: true,
        }
      );
      const { accessToken } = response.data;
      localStorage.setItem("accessToken", accessToken);
      return accessToken;
    } catch (error) {
      setUser(null);
      return null;
    }
  };

  const checkLoggedIn = async () => {
    let token = localStorage.getItem("accessToken");
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
        if (error.response && error.response.data.code === "TOKEN_EXPIRED") {
          token = await refreshAccessToken();
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
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    }
    setLoading(false);
  };

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

  useEffect(() => {
    checkLoggedIn();
  }, []);

  useEffect(() => {
    if (user) {
      userData();
    }
  }, [user]);

  useEffect(() => {
    if (!loading) {
      userData();
    }
  }, [loading]);

  return (
    <AuthContext.Provider value={{ user, setUser, data, setData, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
