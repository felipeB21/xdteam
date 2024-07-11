import GlobeIcon from "@/components/icons/globe";
import LockClose from "@/components/icons/lockClose";
import LockOpen from "@/components/icons/lockOpen";
import UserIcon from "@/components/icons/user";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "XDTeam - Teams",
};

export default async function FindTeamPage() {
  const getTeams = await axios.get("http://localhost:4000/api/v1/team/all");
  const teams = getTeams.data.data || [];

  return (
    <div className="main-layout">
      <h2 className="text-3xl font-bold mb-5">XDTeam's</h2>
      <ul className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-5">
        {teams.map((team) => (
          <Link
            className="border border-neutral-700 py-2 px-4 rounded-xl hover:bg-neutral-900 duration-200"
            key={team.id}
            href={`/team/${team.id}/${team.name}`}
          >
            <div className="flex items-center gap-2">
              <Image
                priority
                className="rounded-full w-[80px] h-[80px] object-cover"
                src={team.img}
                alt={`Img of team ${team.name}`}
                width={82}
                height={62}
              />
              <div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-bold max-w-[100px]">
                    {team.name}
                  </h3>
                  <h4 className="text-xs text-neutral-400 flex items-center gap-1">
                    <GlobeIcon /> {team.region}
                  </h4>
                  <h5 className="text-xs text-neutral-400 flex items-center gap-1">
                    <UserIcon /> Players: {team.players.length}
                  </h5>
                  <div className="text-xs text-neutral-400">
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
              </div>
            </div>
          </Link>
        ))}
      </ul>
    </div>
  );
}
