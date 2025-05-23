import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mergedPlayers } from "../data/players";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Rating,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface ScoutingReport {
  id: string;
  date: string;
  scout: string;
  rating: number;
  strengths: string;
  weaknesses: string;
  notes: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function PlayerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [scoutingReports, setScoutingReports] = useState<ScoutingReport[]>([]);
  const [newReport, setNewReport] = useState<Omit<ScoutingReport, "id" | "date">>({
    scout: "",
    rating: 0,
    strengths: "",
    weaknesses: "",
    notes: "",
  });

  const player = mergedPlayers.find((p) => p.playerId === Number(id));

  if (!player) {
    return (
      <Container>
        <Typography>Player not found</Typography>
      </Container>
    );
  }

  const handleAddReport = () => {
    const report: ScoutingReport = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      ...newReport,
    };
    setScoutingReports([...scoutingReports, report]);
    setDialogOpen(false);
    setNewReport({
      scout: "",
      rating: 0,
      strengths: "",
      weaknesses: "",
      notes: "",
    });
  };

  const avgRank = Object.values(player.scoutRankings)
    .filter((r): r is number => r !== null)
    .reduce((a, b) => a + b, 0) / Object.values(player.scoutRankings).filter((r) => r !== null).length;

  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Box display="flex" alignItems="center" mb={4}>
          <IconButton onClick={() => navigate("/")} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            {player.name}
          </Typography>
        </Box>

        <Box mb={4}>
          <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
            <Tab label="Overview" />
            <Tab label="Scouting Reports" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Card>
            <CardContent>
              <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={4}>
                {player.photoUrl && (
                  <Box sx={{ width: { xs: "100%", md: 300 } }}>
                    <img
                      src={player.photoUrl}
                      alt={player.name}
                      style={{ width: "100%", height: "auto", borderRadius: 8 }}
                    />
                  </Box>
                )}
                <Box flex={1}>
                  <Typography variant="h6" gutterBottom>
                    Personal Information
                  </Typography>
                  <Box display="grid" gridTemplateColumns="auto 1fr" gap={2} mb={3}>
                    <Typography color="text.secondary">Team:</Typography>
                    <Typography>{player.currentTeam}</Typography>
                    <Typography color="text.secondary">Height:</Typography>
                    <Typography>{player.height / 12} ft {player.height % 12} in</Typography>
                    <Typography color="text.secondary">Weight:</Typography>
                    <Typography>{player.weight} lbs</Typography>
                    <Typography color="text.secondary">Birth Date:</Typography>
                    <Typography>{new Date(player.birthDate).toLocaleDateString()}</Typography>
                    <Typography color="text.secondary">Hometown:</Typography>
                    <Typography>
                      {player.homeTown}
                      {player.homeState ? `, ${player.homeState}` : ""}, {player.homeCountry}
                    </Typography>
                  </Box>

                  <Typography variant="h6" gutterBottom>
                    Scout Rankings
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                    {Object.entries(player.scoutRankings)
                      .filter(([, rank]) => rank !== null)
                      .map(([scout, rank]) => (
                        <Chip
                          key={scout}
                          label={`${scout}: ${rank}`}
                          color={
                            rank && rank < avgRank - 5
                              ? "success"
                              : rank && rank > avgRank + 5
                              ? "error"
                              : "default"
                          }
                        />
                      ))}
                  </Box>
                  <Typography>
                    Average Ranking: {avgRank.toFixed(1)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box mb={3}>
            <Button
              variant="contained"
              onClick={() => setDialogOpen(true)}
            >
              Add Scouting Report
            </Button>
          </Box>

          {scoutingReports.length === 0 ? (
            <Typography color="text.secondary">
              No scouting reports yet. Add one to get started.
            </Typography>
          ) : (
            <Box display="flex" flexDirection="column" gap={2}>
              {scoutingReports.map((report) => (
                <Card key={report.id}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                      <Typography variant="h6">
                        Report by {report.scout}
                      </Typography>
                      <Typography color="text.secondary">
                        {report.date}
                      </Typography>
                    </Box>
                    <Box mb={2}>
                      <Typography component="legend">Rating</Typography>
                      <Rating value={report.rating} readOnly />
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      Strengths
                    </Typography>
                    <Typography paragraph>
                      {report.strengths}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      Weaknesses
                    </Typography>
                    <Typography paragraph>
                      {report.weaknesses}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      Additional Notes
                    </Typography>
                    <Typography>
                      {report.notes}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </TabPanel>

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>New Scouting Report</DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={3} py={2}>
              <TextField
                label="Scout Name"
                value={newReport.scout}
                onChange={(e) => setNewReport({ ...newReport, scout: e.target.value })}
                fullWidth
              />
              <Box>
                <Typography component="legend">Rating</Typography>
                <Rating
                  value={newReport.rating}
                  onChange={(_, value) => setNewReport({ ...newReport, rating: value || 0 })}
                />
              </Box>
              <TextField
                label="Strengths"
                value={newReport.strengths}
                onChange={(e) => setNewReport({ ...newReport, strengths: e.target.value })}
                multiline
                rows={4}
                fullWidth
              />
              <TextField
                label="Weaknesses"
                value={newReport.weaknesses}
                onChange={(e) => setNewReport({ ...newReport, weaknesses: e.target.value })}
                multiline
                rows={4}
                fullWidth
              />
              <TextField
                label="Additional Notes"
                value={newReport.notes}
                onChange={(e) => setNewReport({ ...newReport, notes: e.target.value })}
                multiline
                rows={4}
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleAddReport}
              variant="contained"
              disabled={!newReport.scout || !newReport.rating}
            >
              Add Report
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}
