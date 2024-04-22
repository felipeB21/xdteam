"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ShowPassword from "../../../public/show.png";
import HidePassword from "../../../public/hide.png";
import Image from "next/image";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  email: z.string().email("Invalid email").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    const res = await fetch("/api/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: values.email,
        password: values.password,
      }),
    });

    if (res.ok) {
      router.push("/");
    } else {
      const data = await res.json();
      setErrorMessage(data.error || "An error occurred");
    }
    setIsLoading(false);
  };

  return (
    <>
      {errorMessage && (
        <div className="error mb-2">
          <span className="font-bold">An error occurred!</span>
          <p>{errorMessage}</p>
        </div>
      )}
      <form
        className="flex flex-col gap-5 items-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <input
            {...register("email")}
            className="input-form"
            type="email"
            placeholder="Email"
          />
          <p className="error">{errors.email?.message}</p>
        </div>
        <div>
          <input
            {...register("password")}
            className="input-form"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
          />
          <p className="error">{errors.password?.message}</p>
        </div>

        <button
          className="absolute mt-[56px] ml-[170px] bg-neutral-700 pl-2"
          type="button"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? (
            <Image
              src={HidePassword}
              alt="Hide Password"
              width={24}
              height={24}
            />
          ) : (
            <Image
              src={ShowPassword}
              alt="Show Password"
              width={24}
              height={24}
            />
          )}
        </button>
        <button className="form-button" type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Sign in"}
        </button>
      </form>
    </>
  );
}
