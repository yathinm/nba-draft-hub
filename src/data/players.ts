import data from "./intern_project_data.json";

type ScoutRankings = { [scoutName: string]: number | null };

interface Player {
  name: string;
  playerId: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  height: number;
  weight: number;
  highSchool: string | null;
  highSchoolState: string | null;
  homeTown: string;
  homeState: string | null;
  homeCountry: string;
  nationality: string;
  photoUrl: string | null;
  currentTeam: string;
  league: string;
  leagueType: string;
  scoutRankings: ScoutRankings;
}

export const mergedPlayers: Player[] = data.bio.map((player) => {
  const rankingsEntry = data.scoutRankings.find(
    (r) => r.playerId === player.playerId
  ) || {};

const scoutRankings = Object.fromEntries(
  Object.entries(rankingsEntry).filter(([key]) => key !== "playerId")
) as ScoutRankings;


  return {
    ...player,
    scoutRankings,
  };
});
