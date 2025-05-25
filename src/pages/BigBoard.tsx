import { useState } from "react";
import { mergedPlayers } from "../data/players";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import SportBasketballIcon from "@mui/icons-material/SportsBasketball";
import StarIcon from "@mui/icons-material/Star";
import SearchIcon from "@mui/icons-material/Search";

const getAverageRank = (rankings: { [scout: string]: number | null }) => {
  const values = Object.values(rankings).filter((r): r is number => r !== null);
  return values.length ? values.reduce((a, b) => a + b, 0) / values.length : Infinity;
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
      <NavBar />
      <Container maxWidth="lg">
        <Box py={4}>
          <Box 
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'stretch', md: 'center' },
              justifyContent: 'space-between',
              mb: 4,
              gap: 2,
            }}
          >
            <Box>
              <Typography 
                variant="h4" 
                component="h1" 
                sx={{ 
                  fontWeight: 800,
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 1,
                }}
              >
                <SportBasketballIcon sx={{ fontSize: 35 }} />
                NBA Draft Board
              </Typography>
            </Box>
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              alignItems: 'center',
              flexWrap: { xs: 'wrap', md: 'nowrap' },
            }}>
              <TextField
                size="small"
                placeholder="Search prospects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ 
                  minWidth: 200,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl 
                size="small"
                sx={{ 
                  minWidth: 200,
                  background: 'white',
                  borderRadius: 1,
                }}
              >
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                >
                  <MenuItem value="consensus">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <StarIcon sx={{ fontSize: 18 }} />
                      Consensus Ranking
                    </Box>
                  </MenuItem>
                  <MenuItem value="highest">Highest Rank</MenuItem>
                  <MenuItem value="lowest">Lowest Rank</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filteredPlayers.map((player, index) => (
              <Card
                key={player.playerId}
                sx={{ 
                  borderRadius: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  },
                }}
                component={Link}
                to={`/player/${player.playerId}`}
              >
                <CardContent>
                  <Box sx={{ 
                    display: "flex", 
                    flexDirection: { xs: "column", sm: "row" }, 
                    gap: 2,
                    alignItems: { xs: "flex-start", sm: "center" },
                  }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', minWidth: '250px' }}>
                      <Paper
                        sx={{
                          width: 40,
                          height: 40,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '50%',
                          background: (theme) => theme.palette.grey[100],
                          fontWeight: 'bold',
                        }}
                      >
                        {index + 1}
                      </Paper>
                      <Box>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 600,
                            fontSize: '1.1rem',
                          }}
                        >
                          {player.name}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          {player.currentTeam}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </Container>
    </>
  );
}
