
import { mergedPlayers } from "../data/players";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Container
} from "@mui/material";
import { Link } from "react-router-dom";

const getAverageRank = (rankings: { [scout: string]: number | null }) => {
  const values = Object.values(rankings).filter((r): r is number => typeof r === "number");
  return values.length ? values.reduce((a, b) => a + b, 0) / values.length : Infinity;
};

const getHighLowIndicator = (rankings: { [scout: string]: number | null }, rank: number) => {
  const values = Object.values(rankings).filter((r): r is number => typeof r === "number");
  if (rank <= Math.min(...values)) return "⬆️ High";
  if (rank >= Math.max(...values)) return "⬇️ Low";
  return "";
};

export default function BigBoard() {
  const sortedPlayers = [...mergedPlayers].sort(
    (a, b) => getAverageRank(a.scoutRankings) - getAverageRank(b.scoutRankings)
  );

  return (
    <Container maxWidth="md">
      <Box py={4}>
        <Typography variant="h4" gutterBottom>
          NBA Draft Big Board
        </Typography>

        {sortedPlayers.map((player, index) => (
          <Card
            key={player.playerId}
            sx={{ mb: 3, cursor: "pointer" }}
            component={Link}
            to={`/player/${player.playerId}`}
          >
            <CardContent>
              <Typography variant="h6">
                {index + 1}. {player.name} — {player.currentTeam}
              </Typography>
              <Typography variant="body2">
                Avg Rank: {getAverageRank(player.scoutRankings).toFixed(2)}
              </Typography>
              <ul>
                {Object.entries(player.scoutRankings).map(([scout, rank]) =>
                  rank != null ? (
                    <li key={scout}>
                      {scout}: {rank} {getHighLowIndicator(player.scoutRankings, rank)}
                    </li>
                  ) : null
                )}
              </ul>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
}
