"use client";
import { useState } from "react";

export default function CreateTeamForm() {
  const [teamName, setTeamName] = useState("");
  const [message, setMessage] = useState("");

  const handleForm = async (e) => {
    e.preventDefault();
    try {
    } catch (error) {}
  };
  return (
    <div className="mt-5 grid grid-cols-2">
      <form onSubmit={handleForm}>
        <input
          autoComplete="off"
          className="input-team"
          type="text"
          name="name"
          placeholder="Team name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />
        <h4>Team Image:</h4>
        <div className="w-full flex items-center">
          <label
            htmlFor="img"
            className="rounded-lg cursor-pointer w-full p-10 border-2 border-neutral-700 border-dashed bg-neutral-950  hover:bg-neutral-900"
          >
            <div className="pt-5 pb-6 flex flex-col items-center justify-center">
              <svg
                className="w-8 h-8 mb-4 text-gray-500"
                aria-hidden="true"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                SVG, PNG, JPG or GIF (MAX. 800x400px)
              </p>
            </div>
            <input id="img" type="file" className="hidden" />
          </label>
        </div>
      </form>
    </div>
  );
}
