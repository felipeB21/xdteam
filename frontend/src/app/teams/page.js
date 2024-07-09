import LockClose from "@/components/icons/lockClose";
import LockOpen from "@/components/icons/lockOpen";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

export default async function FindTeamPage() {
  const getTeams = await axios.get("http://localhost:4000/api/v1/team/all");
  const teams = getTeams.data.data || [];

  return (
    <div className="main-layout">
      <h2 className="text-3xl font-bold mb-5">XDTeam's</h2>
      <ul className="grid">
        {teams.map((team) => (
          <Link
            className="border-2 border-neutral-700 py-2 px-4 w-max rounded-xl bg-neutral-900 hover:bg-neutral-950 duration-100"
            key={team.id}
            href={`/team/${team.id}/${team.name}`}
          >
            <div>
              <h3 className="text-xl font-bold">{team.name}</h3>
              <h4 className="text-xs text-neutral-400">{team.region} Region</h4>
            </div>
            <Image
              priority
              className="my-2 rounded-lg w-auto h-auto object-cover"
              src={team.img}
              alt={`Img of team ${team.name}`}
              width={200}
              height={200}
            />
            <div>
              <h5 className="font-medium text-sm text-neutral-400">
                {team.players.length}{" "}
                {team.players.length === 1 ? "Player" : "Players"} {""}
                in the team
              </h5>
              <div className="text-sm text-neutral-400">
                {team.isPublic === true ? (
                  <div className="flex items-center gap-1">
                    <LockOpen />
                    <p>Public</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <LockClose />
                    <p>Private</p>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </ul>
    </div>
  );
}
