import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import { mergedPlayers } from "../data/players";

export default function Home() {
  const totalProspects = mergedPlayers.length;
  const averageAge = mergedPlayers.reduce((sum, player) => {
    const age = new Date().getFullYear() - new Date(player.birthDate).getFullYear();
    return sum + age;
  }, 0) / totalProspects;

  return (
    <Container maxWidth="lg">
      <Box py={8} textAlign="center">
        <Typography variant="h2" component="h1" gutterBottom>
          NBA Draft Hub
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Your comprehensive scouting platform for the upcoming NBA Draft
        </Typography>
        <Button
          component={Link}
          to="/big-board"
          variant="contained"
          size="large"
          sx={{ mt: 4 }}
        >
          View Draft Board
        </Button>
      </Box>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={4}
        mb={8}
        justifyContent="center"
      >
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h3" color="primary" gutterBottom>
              {totalProspects}
            </Typography>
            <Typography variant="h6">
              Draft Prospects
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h3" color="primary" gutterBottom>
              {averageAge.toFixed(1)}
            </Typography>
            <Typography variant="h6">
              Average Age
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h3" color="primary" gutterBottom>
              {Object.keys(mergedPlayers[0].scoutRankings).length}
            </Typography>
            <Typography variant="h6">
              Scout Rankings
            </Typography>
          </CardContent>
        </Card>
      </Stack>

      <Box textAlign="center" mb={8}>
        <Typography variant="h4" gutterBottom>
          About the Draft Hub
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          The NBA Draft Hub is your comprehensive platform for evaluating and tracking prospects
          for the upcoming NBA Draft. Access detailed scouting reports, rankings, and player profiles
          to make informed decisions for your team's future.
        </Typography>
      </Box>
    </Container>
  );
} 