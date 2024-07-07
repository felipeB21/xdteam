"use client";
import { useEffect } from "react";
import axios from "axios";

export default function RefreshToken() {
  useEffect(() => {
    const refreshAccessToken = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/user/refresh"
        );
        localStorage.setItem("accessToken", data.accessToken);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${data.accessToken}`;
      } catch (error) {
        console.error("Error refreshing access token:", error);
      }
    };

    const intervalId = setInterval(refreshAccessToken, 14 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);
}
