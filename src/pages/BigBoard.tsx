import { useState } from "react";
import { mergedPlayers } from "../data/players";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";

const getAverageRank = (rankings: { [scout: string]: number | null }) => {
  const values = Object.values(rankings).filter((r): r is number => r !== null);
  return values.length ? values.reduce((a, b) => a + b, 0) / values.length : Infinity;
};

const getScoutConsensus = (rankings: { [scout: string]: number | null }) => {
  const values = Object.values(rankings).filter((r): r is number => r !== null);
  if (values.length < 2) return null;

  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / values.length;
  return variance;
};

export default function BigBoard() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"consensus" | "highest" | "lowest">("consensus");

  const sortPlayers = (players: typeof mergedPlayers) => {
    return [...players].sort((a, b) => {
      if (sortBy === "consensus") {
        return getAverageRank(a.scoutRankings) - getAverageRank(b.scoutRankings);
      }

      const aRankings = Object.values(a.scoutRankings).filter((r): r is number => r !== null);
      const bRankings = Object.values(b.scoutRankings).filter((r): r is number => r !== null);

      if (sortBy === "highest") {
        const aHighest = Math.min(...aRankings);
        const bHighest = Math.min(...bRankings);
        return aHighest - bHighest;
      }

      const aLowest = Math.max(...aRankings);
      const bLowest = Math.max(...bRankings);
      return aLowest - bLowest;
    });
  };

  const filteredPlayers = sortPlayers(mergedPlayers)
    .filter((player) =>
      player.name.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <>
      <NavBar search={search} setSearch={setSearch} />

      <Container maxWidth="lg">
        <Box py={4}>
          <Box mb={4}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              >
                <MenuItem value="consensus">Consensus Ranking</MenuItem>
                <MenuItem value="highest">Highest Scout Ranking</MenuItem>
                <MenuItem value="lowest">Lowest Scout Ranking</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {filteredPlayers.map((player, index) => {
            const consensus = getScoutConsensus(player.scoutRankings);
            const avgRank = getAverageRank(player.scoutRankings);
            const scoutRankings = Object.entries(player.scoutRankings)
              .filter(([, rank]) => rank !== null)
              .sort(([, a], [, b]) => (a || 0) - (b || 0));

            return (
              <Card
                key={player.playerId}
                sx={{ 
                  mb: 3,
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                  }
                }}
                component={Link}
                to={`/player/${player.playerId}`}
              >
                <CardContent>
                  <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2 }}>
                    <Box sx={{ flex: "0 0 auto", minWidth: { md: "300px" } }}>
                      <Typography variant="h6" color="primary">
                        {index + 1}. {player.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {player.currentTeam} | {player.height / 12} ft {player.height % 12} in
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
                        {scoutRankings.map(([scout, rank]) => (
                          <Chip
                            key={scout}
                            label={`${scout}: ${rank}`}
                            color={
                              rank && avgRank && rank < avgRank - 5
                                ? "success"
                                : rank && avgRank && rank > avgRank + 5
                                ? "error"
                                : "default"
                            }
                            size="small"
                          />
                        ))}
                      </Box>
                      {consensus !== null && consensus > 25 && (
                        <Typography variant="body2" color="error">
                          High variance in scout rankings
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </Container>
    </>
  );
}
