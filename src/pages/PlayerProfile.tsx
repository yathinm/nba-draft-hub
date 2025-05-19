import { useParams, Link } from "react-router-dom";
import { mergedPlayers } from "../data/players";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Container
} from "@mui/material";
import { useState } from "react";

export default function PlayerProfile() {
  const { id } = useParams();
  const player = mergedPlayers.find((p) => p.playerId.toString() === id);

  const [reports, setReports] = useState<string[]>([]);
  const [input, setInput] = useState("");

  if (!player) return <Typography>Player not found</Typography>;

  const handleAddReport = () => {
    if (input.trim()) {
      setReports([...reports, input.trim()]);
      setInput("");
    }
  };

  return (
    <Container maxWidth="md">
      <Box py={4}>
        <Button component={Link} to="/" variant="outlined">← Back to Big Board</Button>
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h5">{player.name}</Typography>
            <Typography variant="body2" mb={2}>
              Team: {player.currentTeam}
            </Typography>

            <Typography variant="subtitle1">Scout Rankings:</Typography>
            <ul>
              {Object.entries(player.scoutRankings).map(([scout, rank]) =>
                rank != null ? <li key={scout}>{scout}: {rank}</li> : null
              )}
            </ul>

            <Typography variant="subtitle1" mt={3}>Scouting Reports</Typography>
            <ul>
              {reports.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Add a new report"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              sx={{ mt: 2 }}
            />
            <Button onClick={handleAddReport} variant="contained" sx={{ mt: 1 }}>
              Submit
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
