import data from "./intern_project_data.json";

type ScoutRankings = { [scoutName: string]: number | null };

interface GameStats {
  playerId: number;
  pts?: number;
  reb?: number;
  ast?: number;
}

interface Stats {
  perGame: {
    points: number;
    rebounds: number;
    assists: number;
  };
  total: {
    points: number;
    rebounds: number;
    assists: number;
  };
}

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
  stats: Stats | null;
}

// Group all stat logs by playerId
const playerStatsMap: { [playerId: number]: GameStats[] } = {};
// Only process stats if they exist
if (Array.isArray(data.stats)) {
  for (const stat of data.stats as GameStats[]) {
    if (!playerStatsMap[stat.playerId]) {
      playerStatsMap[stat.playerId] = [];
    }
    playerStatsMap[stat.playerId].push(stat);
  }
}

function computeStats(statLogs: GameStats[]): Stats | null {
  if (!statLogs || statLogs.length === 0) return null;

  const total = {
    points: 0,
    rebounds: 0,
    assists: 0
  };

  for (const game of statLogs) {
    total.points += game.pts ?? 0;
    total.rebounds += game.reb ?? 0;
    total.assists += game.ast ?? 0;
  }

  const numGames = statLogs.length;

  return {
    total,
    perGame: {
      points: +(total.points / numGames).toFixed(1),
      rebounds: +(total.rebounds / numGames).toFixed(1),
      assists: +(total.assists / numGames).toFixed(1)
    }
  };
}

export const mergedPlayers: Player[] = data.bio.map((player) => {
  const rankingsEntry = data.scoutRankings.find(
    (r) => r.playerId === player.playerId
  ) || {};

  const scoutRankings = Object.fromEntries(
    Object.entries(rankingsEntry).filter(([key]) => key !== "playerId")
  ) as ScoutRankings;

  const statLogs = playerStatsMap[player.playerId] || [];
  const stats = computeStats(statLogs);

  return {
    ...player,
    scoutRankings,
    stats
  };
});
