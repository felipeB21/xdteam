"use client";
import Link from "next/link";
import UserImg from "../../public/user.png";
import Image from "next/image";
import { UserContext } from "@/app/context/userContext";
import { useContext, useEffect } from "react";

const LINKS = [
  { name: "Tournaments", href: "/tournaments" },
  { name: "Teams", href: "/teams" },
  { name: "Find", href: "/find" },
  { name: "About", href: "/about" },
] as const;

export default function Navbar() {
  const { user, loading } = useContext(UserContext);

  useEffect(() => {
    if (!user) {
      return;
    }
  }, [user]);

  return (
    <header className="fixed top-0 w-full bg-zinc-900 py-3">
      <div className="mx-auto max-w-5xl px-1 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link
            className="hover:bg-neutral-400/40 py-1 px-3 rounded text-xl font-medium"
            href="/"
          >
            XDTeam
          </Link>
          <nav>
            <ul className="flex items-center gap-5">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    className="text-neutral-400 hover:text-white"
                    href={link.href}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="pr-4">
          {loading ? (
            <p>Loading...</p>
          ) : user ? (
            <Link
              className="flex items-center gap-2 py-1 px-3 border border-neutral-600 rounded bg-neutral-700/80 hover:bg-neutral-800/80 duration-100"
              href={"/user/" + user.user}
            >
              <Image src={UserImg} alt="user" width={20} height={20} />
              <p>{user.user}</p>
            </Link>
          ) : (
            <Link
              className="bg-sky-600 text-white font-medium px-3 py-1 rounded hover:bg-sky-700"
              href="/login"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
