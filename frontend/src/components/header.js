import Link from "next/link";
import AlterSessionHeader from "./alterSessionHeader";

const LINKS = [
  { name: "Create Team", ref: "/create-team" },
  { name: "Find Team", ref: "/teams" },
  { name: "Players", ref: "/players" },
  { name: "Chat", ref: "/chat" },
];

export default function Header() {
  return (
    <header className="border-b border-neutral-700 shadow fixed top-0 w-full z-50 bg-neutral-900">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-20 py-4">
        <div className="flex items-center gap-6">
          <Link className="text-2xl font-medium" href={"/"}>
            XDTeam
          </Link>
          <nav>
            <ul className="flex items-center gap-6">
              {LINKS.map((link) => (
                <li key={link.name}>
                  <Link className="hover:text-neutral-300" href={link.ref}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <AlterSessionHeader />
      </div>
    </header>
  );
}
