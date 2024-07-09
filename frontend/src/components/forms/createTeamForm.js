"use client";
import { useState } from "react";
import axios from "axios";
import Dropdown from "./dropdown";
import GlobeIcon from "../icons/globe";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CreateTeamForm() {
  const router = useRouter();
  const [teamName, setTeamName] = useState("");
  const [region, setRegion] = useState("");
  const [teamImage, setTeamImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(""); // Estado para la URL de la imagen previa
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleForm = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");

    const formData = new FormData();
    formData.append("name", teamName);
    formData.append("region", region);
    formData.append("img", teamImage);

    try {
      console.log("Starting the request");
      const res = await axios.post(
        "http://localhost:4000/api/v1/team/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(res.data.msg);
      router.push(`/team/${res.data.data.team.id}/${res.data.data.team.name}`);
    } catch (error) {
      setMessage(error.response?.data?.msg || "Error creating team");
    }
  };

  // Función para manejar el cambio de imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setError("No file selected");
      return;
    }

    try {
      const imageUrl = URL.createObjectURL(file);
      setImageUrl(imageUrl);
      setTeamImage(file); // Actualiza el estado de la imagen del equipo
      setError(""); // Limpia cualquier error previo
    } catch (error) {
      console.error("Error creating object URL:", error);
      setError("Error creating object URL");
    }
  };

  return (
    <div className="mt-5 flex justify-between">
      <div className="flex flex-col w-[20dvw]">
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
          <Dropdown dropdownId="region-select" setRegion={setRegion} />
          <h4>Team Image:</h4>
          <div className="w-full flex items-center">
            <label
              htmlFor="img"
              className="rounded-lg cursor-pointer w-full p-10 border-2 border-neutral-700 border-dashed bg-neutral-950 hover:bg-neutral-900"
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
                {teamImage ? (
                  <div className="flex flex-col items-center">
                    <p>{teamImage.name}</p>
                    <p>Size: {teamImage.size}</p>
                  </div>
                ) : (
                  <div>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      SVG, PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                  </div>
                )}
              </div>
              <input
                id="img"
                accept="image/jpeg, image/png, image/gif"
                type="file"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
          <button type="submit" className="btn-form my-2">
            Create Team
          </button>
        </form>
        {message && <p className="error-msg mb-2">{message}</p>}
        {error && <p className="error-msg mb-2">{error}</p>}
      </div>
      <div>
        <div className="max-w-[30dvw] break-words">
          <h5 className="text-neutral-300 font-medium mb-2">
            You will see your team information here:
          </h5>
          <h3 className="text-2xl font-bold">{teamName}</h3>
          {region && (
            <p className="text-neutral-300 flex items-center gap-1">
              <GlobeIcon />
              {region}
            </p>
          )}
          {imageUrl && (
            <div className="mt-2">
              <Image
                src={imageUrl}
                alt="Team Image"
                width={100}
                height={100}
                className="rounded-lg w-auto h-auto"
                priority
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
