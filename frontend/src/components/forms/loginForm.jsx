"use client";
import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      router.push("/"); // Redirigir a la página de inicio u otra página si el usuario ya está autenticado
    }
  }, [user, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/user/login",
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      ); // Importante para enviar y recibir cookies

      if (response.status === 200) {
        setMessage("");
      } else {
        setMessage(response.data.msg);
      }
      localStorage.setItem("accessToken", response.data.data); // Guardar el access token en localStorage
      setUser(username); // Actualizar el contexto con el nombre de usuario
    } catch (error) {
      setMessage(error.response?.data?.msg || "Login failed, try again.");
    }
  };

  return (
    <div className="form-auth">
      <h2 className="form-info">Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn-form" type="submit">
          Login
        </button>
      </form>
      <div className="mt-3">
        <span className="text-sm text-neutral-400">
          You don't have an account?{" "}
          <Link
            className="text-sm text-blue-400 hover:underline"
            href={"/register"}
          >
            Sign up
          </Link>
        </span>
      </div>
      {message && <p className="error-msg">{message}</p>}
    </div>
  );
};

export default Login;
