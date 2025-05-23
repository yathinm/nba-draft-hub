import data from "./intern_project_data.json";

type ScoutRankings = { [scoutName: string]: number | null };

interface GameStats {
  playerId: number;
  Season?: string;
  League?: string;
  Team?: string;
  GP?: number;
  GS?: number;
  MP?: number;
  FGM?: number;
  FGA?: number;
  "FG%"?: number;
  "3PM"?: number;
  "3PA"?: number;
  "3P%"?: number;
  FT?: number;
  FTA?: number;
  "FT%"?: number;
  ORB?: number;
  DRB?: number;
  TRB?: number;
  AST?: number;
  STL?: number;
  BLK?: number;
  TOV?: number;
  PF?: number;
  PTS?: number;
}

interface Stats {
  perGame: {
    points: number;
    rebounds: number;
    assists: number;
    steals: number;
    blocks: number;
    turnovers: number;
    fgPercentage: number;
    threePtPercentage: number;
    ftPercentage: number;
    minutes: number;
  };
  total: {
    points: number;
    rebounds: number;
    assists: number;
    steals: number;
    blocks: number;
    turnovers: number;
    gamesPlayed: number;
    gamesStarted: number;
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

type RawPlayer = Omit<Player, "scoutRankings" | "stats">;

interface RawData {
  bio: RawPlayer[];
  scoutRankings: Array<{ playerId: number } & ScoutRankings>;
  stats: GameStats[];
}

const rawData = data as unknown as RawData;

// Group all stat logs by playerId
const playerStatsMap: { [playerId: number]: GameStats[] } = {};

if (Array.isArray(rawData.stats)) {
  for (const stat of rawData.stats) {
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
    assists: 0,
    steals: 0,
    blocks: 0,
    turnovers: 0,
    gamesPlayed: 0,
    gamesStarted: 0,
    fgMade: 0,
    fgAttempts: 0,
    threePtMade: 0,
    threePtAttempts: 0,
    ftMade: 0,
    ftAttempts: 0,
    minutes: 0,
  };

  for (const game of statLogs) {
    total.points += game.PTS ?? 0;
    total.rebounds += game.TRB ?? 0;
    total.assists += game.AST ?? 0;
    total.steals += game.STL ?? 0;
    total.blocks += game.BLK ?? 0;
    total.turnovers += game.TOV ?? 0;
    total.gamesPlayed += game.GP ?? 0;
    total.gamesStarted += game.GS ?? 0;
    total.fgMade += game.FGM ?? 0;
    total.fgAttempts += game.FGA ?? 0;
    total.threePtMade += game["3PM"] ?? 0;
    total.threePtAttempts += game["3PA"] ?? 0;
    total.ftMade += game.FT ?? 0;
    total.ftAttempts += game.FTA ?? 0;
    total.minutes += game.MP ?? 0;
  }

  const numGames = total.gamesPlayed || statLogs.length;

  return {
    total: {
      points: total.points,
      rebounds: total.rebounds,
      assists: total.assists,
      steals: total.steals,
      blocks: total.blocks,
      turnovers: total.turnovers,
      gamesPlayed: total.gamesPlayed,
      gamesStarted: total.gamesStarted,
    },
    perGame: {
      points: +(total.points / numGames).toFixed(1),
      rebounds: +(total.rebounds / numGames).toFixed(1),
      assists: +(total.assists / numGames).toFixed(1),
      steals: +(total.steals / numGames).toFixed(1),
      blocks: +(total.blocks / numGames).toFixed(1),
      turnovers: +(total.turnovers / numGames).toFixed(1),
      fgPercentage: +(total.fgMade / total.fgAttempts * 100).toFixed(1) || 0,
      threePtPercentage: +(total.threePtMade / total.threePtAttempts * 100).toFixed(1) || 0,
      ftPercentage: +(total.ftMade / total.ftAttempts * 100).toFixed(1) || 0,
      minutes: +(total.minutes / numGames).toFixed(1),
    }
  };
}

export const mergedPlayers: Player[] = rawData.bio.map((player) => {
  const rankingsEntry = rawData.scoutRankings.find(
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
