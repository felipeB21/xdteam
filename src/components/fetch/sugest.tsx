"use client";
import React, { useEffect, useState } from "react";
import Loading from "../icons/Loading";

type User = {
  id: string;
  username: string;
  teamId?: string;
};

export default function SugestUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("http://localhost:3000/api/user/all/sugest")
      .then((response) => response.json())
      .then((data) => setUsers(data.users));
    setLoading(false);
  }, []);
  return (
    <div className="bg-neutral-900/90 p-5 max-w-[250px] rounded-xl border border-neutral-600">
      <h4 className="text-xl font-medium pb-2">Who to follow</h4>
      {loading ? (
        <div className="flex items-center justify-center">
          <Loading width={20} height={20} />
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {users.map((user) => (
            <li key={user.id}>
              <p>{user.username}</p>
              <p>{user.teamId}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
