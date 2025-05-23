import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mergedPlayers } from "../data/players";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SportBasketballIcon from "@mui/icons-material/SportsBasketball";
import AddIcon from "@mui/icons-material/Add";
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

interface ScoutingReport {
  id: string;
  scoutName: string;
  report: string;
  date: string;
  rating: number;
}

interface PerGameStats {
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
}

interface TotalStats {
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  gamesPlayed: number;
  gamesStarted: number;
}

export default function PlayerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [statsView, setStatsView] = useState<"perGame" | "total">("perGame");
  const [scoutingReports, setScoutingReports] = useState<ScoutingReport[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newReport, setNewReport] = useState({ scoutName: "", report: "", rating: 5 });

  const player = mergedPlayers.find((p) => p.playerId === Number(id));

  if (!player) {
    return (
      <Container>
        <Typography variant="h5" sx={{ mt: 4 }}>Player not found</Typography>
      </Container>
    );
  }

  const handleStatsViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: "perGame" | "total",
  ) => {
    if (newView !== null) {
      setStatsView(newView);
    }
  };

  const handleAddReport = () => {
    if (newReport.scoutName && newReport.report) {
      const report: ScoutingReport = {
        id: Date.now().toString(),
        scoutName: newReport.scoutName,
        report: newReport.report,
        rating: newReport.rating,
        date: new Date().toLocaleDateString(),
      };
      setScoutingReports([...scoutingReports, report]);
      setNewReport({ scoutName: "", report: "", rating: 5 });
      setIsDialogOpen(false);
    }
  };

  const stats = player.stats?.[statsView];

  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Box display="flex" alignItems="center" mb={4}>
          <IconButton onClick={() => navigate("/")} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SportBasketballIcon sx={{ fontSize: 35 }} />
            {player.name}
          </Typography>
        </Box>

        <Card sx={{ mb: 4 }}>
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
                  Player Information
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
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Statistics
              </Typography>
              <ToggleButtonGroup
                value={statsView}
                exclusive
                onChange={handleStatsViewChange}
                size="small"
              >
                <ToggleButton value="perGame">
                  Per Game
                </ToggleButton>
                <ToggleButton value="total">
                  Season
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {stats ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Main Stats */}
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
                  gap: 3,
                }}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.main', color: 'white', borderRadius: 2 }}>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                      {stats.points}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, opacity: 0.9 }}>
                      {statsView === "perGame" ? "PPG" : "Total Points"}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.main', color: 'white', borderRadius: 2 }}>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                      {stats.rebounds}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, opacity: 0.9 }}>
                      {statsView === "perGame" ? "RPG" : "Total Rebounds"}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.main', color: 'white', borderRadius: 2 }}>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                      {stats.assists}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, opacity: 0.9 }}>
                      {statsView === "perGame" ? "APG" : "Total Assists"}
                    </Typography>
                  </Box>
                </Box>

                {/* Additional Stats */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, gap: 2 }}>
                  {statsView === "perGame" && (
                    <>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                          {(stats as PerGameStats).minutes}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Minutes
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                          {(stats as PerGameStats).fgPercentage}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          FG%
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                          {(stats as PerGameStats).threePtPercentage}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          3P%
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                          {(stats as PerGameStats).ftPercentage}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          FT%
                        </Typography>
                      </Box>
                    </>
                  )}
                  {statsView === "total" && (
                    <>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                          {(stats as TotalStats).gamesPlayed}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Games Played
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                          {(stats as TotalStats).gamesStarted}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Games Started
                        </Typography>
                      </Box>
                    </>
                  )}
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      {stats.steals}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {statsView === "perGame" ? "SPG" : "Total Steals"}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      {stats.blocks}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {statsView === "perGame" ? "BPG" : "Total Blocks"}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ) : (
              <Typography color="text.secondary">
                No statistics available
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Scouting Reports Section */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Scouting Reports
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setIsDialogOpen(true)}
              >
                Add Report
              </Button>
            </Box>

            {scoutingReports.length > 0 ? (
              <List>
                {scoutingReports.map((report, index) => (
                  <React.Fragment key={report.id}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {report.scoutName}
                              </Typography>
                              <Box 
                                sx={{ 
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.5,
                                  bgcolor: 'background.paper',
                                  border: '1px solid',
                                  borderColor: 'primary.main',
                                  borderRadius: 2,
                                  px: 1.5,
                                  py: 0.5,
                                }}
                              >
                                <StarIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                                <Typography
                                  variant="subtitle2"
                                  sx={{
                                    color: 'primary.main',
                                    fontWeight: 600,
                                    lineHeight: 1,
                                  }}
                                >
                                  {report.rating}
                                </Typography>
                              </Box>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {report.date}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              mt: 1,
                              color: 'text.primary',
                              whiteSpace: 'pre-wrap'
                            }}
                          >
                            {report.report}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < scoutingReports.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography color="text.secondary">
                No scouting reports available. Add one to get started.
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Add Scouting Report Dialog */}
        <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Add Scouting Report</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
              <TextField
                label="Scout Name"
                value={newReport.scoutName}
                onChange={(e) => setNewReport({ ...newReport, scoutName: e.target.value })}
                fullWidth
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Rating
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {[...Array(10)].map((_, index) => (
                      <IconButton
                        key={index}
                        onClick={() => setNewReport({ ...newReport, rating: index + 1 })}
                        sx={{ p: 0.5 }}
                      >
                        {index < newReport.rating ? (
                          <StarIcon sx={{ color: 'primary.main' }} />
                        ) : (
                          <StarBorderIcon sx={{ color: 'primary.main' }} />
                        )}
                      </IconButton>
                    ))}
                  </Box>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      minWidth: 40,
                      color: 'primary.main',
                      fontWeight: 600 
                    }}
                  >
                    {newReport.rating}/10
                  </Typography>
                </Box>
              </Box>
              <TextField
                label="Scouting Report"
                value={newReport.report}
                onChange={(e) => setNewReport({ ...newReport, report: e.target.value })}
                multiline
                rows={4}
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleAddReport}
              variant="contained"
              disabled={!newReport.scoutName || !newReport.report}
            >
              Add Report
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}
