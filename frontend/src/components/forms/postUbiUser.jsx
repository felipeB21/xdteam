"use client";
import React, { useState, useCallback } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import { debounce } from "@/utils/debounce";

export default function PostUbiUser() {
  const router = useRouter();
  const [ubiId, setUbiId] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState("");

  const fetchSuggestions = async (value) => {
    if (value) {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/v1/user/ubi/q/search?query=${value}`
        );
        setSuggestions(res.data.data || []); // Ensure suggestions is always an array
        setError(""); // Clear error if results are found
      } catch (err) {
        setSuggestions([]);
        setError("No user found");
      }
    } else {
      setSuggestions([]);
      setError(""); // Clear error if input is empty
    }
  };

  const debouncedFetchSuggestions = useCallback(
    debounce(fetchSuggestions, 500),
    []
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setUbiId(value);
    debouncedFetchSuggestions(value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    router.push(`/profile/ubi/${ubiId}`);
  };

  const handleSuggestionClick = (suggestion) => {
    router.push(`/profile/ubi/${suggestion.platformUserIdentifier}`);
  };

  return (
    <div className="mt-40 flex flex-col items-center justify-center gap-10">
      <div>
        <h2 className="font-bold text-3xl">XDTeam</h2>
        <p className="text-sm text-neutral-100">
          Check Detailed XDefiant Stats and Leaderboards
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <Image
          className="w-auto h-auto absolute z-20 mt-4 ml-3"
          src={"/Ubisoft_logo.svg.png"}
          alt="ubi"
          width={20}
          height={20}
        />
        <input
          type="text"
          placeholder="Enter your Ubisoft ID"
          className="ubi-input"
          value={ubiId}
          onChange={handleInputChange}
        />
        {Array.isArray(suggestions) && suggestions.length > 0 && (
          <ul className="absolute bg-green-200 border rounded shadow-lg mt-16 w-[420px] max-h-[335px] overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="cursor-pointer p-2 hover:bg-green-400"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className="flex items-center gap-3">
                  <Image
                    priority={true}
                    className="rounded-full border border-black"
                    src={suggestion.avatarUrl}
                    alt={suggestion.platformUserIdentifier}
                    width={50}
                    height={50}
                  />
                  <p className="text-black">
                    {suggestion.platformUserIdentifier}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </form>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
