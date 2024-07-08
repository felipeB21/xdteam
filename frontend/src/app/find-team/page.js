import axios from "axios";
import Image from "next/image";
import Link from "next/link";

export default async function FindTeamPage() {
  const getTeams = await axios.get("http://localhost:4000/api/v1/team/all");
  const teams = getTeams.data.data;

  return (
    <div className="main-layout">
      <ul>
        {teams.map((team) => (
          <li
            className="border-2 border-neutral-700 py-3 px-6 w-max rounded-xl"
            key={team.id}
          >
            <div>
              <h3 className="text-xl font-bold">{team.name}</h3>
              <h4 className="text-sm text-neutral-300">{team.region} Region</h4>
            </div>
            <Image
              src={team.img}
              alt={`Img of team ${team.name}`}
              width={200}
              height={200}
            />
            <div>
              <ul>
                <h5 className="font-medium">Players:</h5>
                {team.players.map((player) => (
                  <li key={player.id}>
                    <Link
                      href={`/profile/${player.username}`}
                      className="text-sm text-neutral-300 hover:underline"
                    >
                      {player.username}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
