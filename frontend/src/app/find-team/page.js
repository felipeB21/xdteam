import axios from "axios";

export default async function FindTeamPage() {
  const getTeams = await axios.get("http://localhost:4000/api/v1/team/all");
  const teams = getTeams.data.data;

  return (
    <div className="main-layout">
      <ul>
        {teams.map((team) => (
          <li key={team.id}>{team.name}</li>
        ))}
      </ul>
    </div>
  );
}
