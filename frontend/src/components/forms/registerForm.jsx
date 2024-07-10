"use client";
import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      router.push("/"); // Redirigir a la página de inicio u otra página si el usuario ya está autenticado
    }
  }, [user, router]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/user/register",
        {
          username,
          password,
          confirmPassword,
        },
        { withCredentials: true }
      ); // Importante para enviar y recibir cookies
      if (response.status === 200) {
        setMessage("");
      } else {
        setMessage(response.data.msg);
      }
      localStorage.setItem("accessToken", response.data.data); // Guardar el access token en localStorage
      setUser(username);
      router.push("/");
    } catch (error) {
      setMessage(error.response.data.msg || "Registration failed");
    }
  };

  return (
    <div className="form-auth">
      <h2 className="form-info">Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button className="btn-form" type="submit">
          Register
        </button>
      </form>
      <div className="mt-3">
        <span className="text-sm text-neutral-400">
          Already have an account?{" "}
          <Link
            className="text-sm text-blue-400 hover:underline"
            href={"/login"}
          >
            Sign in
          </Link>
        </span>
      </div>
      {message && <p className="error-msg">{message}</p>}
    </div>
  );
}
