import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mergedPlayers } from "../data/players";
import combineData from "../data/intern_project_data.json";
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
  Paper,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import AddIcon from "@mui/icons-material/Add";

interface ScoutingReport {
  id: string;
  scoutName: string;
  report: string;
  date: string;
  rating: number;
}

interface GameStats {
  playerId: number;
  gameId: number;
  season: number;
  league: string;
  date: string;
  team: string;
  opponent: string;
  gp: number;
  gs: number;
  timePlayed: string;
  fgm: number;
  fga: number;
  "fg%": number | null;
  tpm: number;
  tpa: number;
  "tp%": number | null;
  ftm: number;
  fta: number;
  "ft%": number | null;
  oreb: number;
  dreb: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  tov: number;
  pf: number;
  pts: number;
  plusMinus: number;
}

interface PlayerStats {
  gamesPlayed: number;
  gamesStarted: number;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fgPercentage: number;
  threePtPercentage: number;
  ftPercentage: number;
}

interface ProjectData {
  bio: Array<{ playerId: number; [key: string]: unknown }>;
  measurements: CombineStats[];
  game_logs: GameStats[];
}

interface CombineStats {
  playerId: number;
  heightNoShoes: number;
  heightShoes: number;
  wingspan: number;
  reach: number;
  maxVertical: number | null;
  noStepVertical: number | null;
  weight: number | null;
  bodyFat: number | null;
  handLength: number | null;
  handWidth: number | null;
  agility: number | null;
  sprint: number | null;
  shuttleBest: number | null;
}

export default function PlayerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [statsView, setStatsView] = useState<"perGame" | "total">("perGame");
  const [scoutingReports, setScoutingReports] = useState<ScoutingReport[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newReport, setNewReport] = useState({ scoutName: "", report: "", rating: 5 });

  const player = mergedPlayers.find((p) => p.playerId === Number(id));
  const combineStats = (combineData as unknown as ProjectData).measurements.find((stats) => stats.playerId === Number(id));
  const playerGames = (combineData as unknown as ProjectData).game_logs?.filter((game) => game.playerId === Number(id)) || [];

  if (!player) {
    return (
      <Container>
        <Typography variant="h5" sx={{ mt: 4 }}>Player not found</Typography>
      </Container>
    );
  }

  const handleStatsViewChange = (
    _event: React.MouseEvent<HTMLElement>,
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

  const calculateAverages = (games: GameStats[]): PlayerStats | null => {
    if (!games.length) return null;
    
    const totals = games.reduce((acc, game) => ({
      gamesPlayed: acc.gamesPlayed + 1,
      gamesStarted: acc.gamesStarted + (game.gs ? 1 : 0),
      points: acc.points + game.pts,
      rebounds: acc.rebounds + game.reb,
      assists: acc.assists + game.ast,
      steals: acc.steals + game.stl,
      blocks: acc.blocks + game.blk,
      turnovers: acc.turnovers + game.tov,
      fgm: acc.fgm + game.fgm,
      fga: acc.fga + game.fga,
      tpm: acc.tpm + game.tpm,
      tpa: acc.tpa + game.tpa,
      ftm: acc.ftm + game.ftm,
      fta: acc.fta + game.fta,
    }), {
      gamesPlayed: 0,
      gamesStarted: 0,
      points: 0,
      rebounds: 0,
      assists: 0,
      steals: 0,
      blocks: 0,
      turnovers: 0,
      fgm: 0,
      fga: 0,
      tpm: 0,
      tpa: 0,
      ftm: 0,
      fta: 0,
    });

    const baseStats = {
      gamesPlayed: totals.gamesPlayed,
      gamesStarted: totals.gamesStarted,
      points: statsView === 'perGame' ? totals.points / totals.gamesPlayed : totals.points,
      rebounds: statsView === 'perGame' ? totals.rebounds / totals.gamesPlayed : totals.rebounds,
      assists: statsView === 'perGame' ? totals.assists / totals.gamesPlayed : totals.assists,
      steals: statsView === 'perGame' ? totals.steals / totals.gamesPlayed : totals.steals,
      blocks: statsView === 'perGame' ? totals.blocks / totals.gamesPlayed : totals.blocks,
      turnovers: statsView === 'perGame' ? totals.turnovers / totals.gamesPlayed : totals.turnovers,
      fgPercentage: (totals.fgm / totals.fga) * 100 || 0,
      threePtPercentage: (totals.tpm / totals.tpa) * 100 || 0,
      ftPercentage: (totals.ftm / totals.fta) * 100 || 0,
    };

    return baseStats;
  };

  const stats = calculateAverages(playerGames);

  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Box display="flex" alignItems="center" mb={4}>
          <IconButton onClick={() => navigate("/big-board")} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                  <Typography>{Math.floor(player.height / 12)} ft {player.height % 12} in</Typography>
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
            <Typography variant="h6" gutterBottom>
              Combine Measurements & Testing
            </Typography>
            {combineStats ? (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                {/* Measurements */}
                <Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 600 }}>
                      Measurements
                    </Typography>
                    <Box display="grid" gridTemplateColumns="auto 1fr" gap={2}>
                      <Typography color="text.secondary">Height (No Shoes):</Typography>
                      <Typography>{Math.floor(combineStats.heightNoShoes / 12)} ft {Math.round(combineStats.heightNoShoes % 12)} in</Typography>
                      
                      <Typography color="text.secondary">Height (In Shoes):</Typography>
                      <Typography>{Math.floor(combineStats.heightShoes / 12)} ft {Math.round(combineStats.heightShoes % 12)} in</Typography>
                      
                      <Typography color="text.secondary">Wingspan:</Typography>
                      <Typography>{combineStats.wingspan ? `${Math.floor(combineStats.wingspan / 12)} ft ${Math.round(combineStats.wingspan % 12)} in` : 'N/A'}</Typography>
                      
                      <Typography color="text.secondary">Standing Reach:</Typography>
                      <Typography>{combineStats.reach ? `${Math.floor(combineStats.reach / 12)} ft ${Math.round(combineStats.reach % 12)} in` : 'N/A'}</Typography>
                      
                      <Typography color="text.secondary">Hand Length:</Typography>
                      <Typography>{combineStats.handLength ? `${combineStats.handLength} in` : 'N/A'}</Typography>
                      
                      <Typography color="text.secondary">Hand Width:</Typography>
                      <Typography>{combineStats.handWidth ? `${combineStats.handWidth} in` : 'N/A'}</Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Athletic Testing */}
                <Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 600 }}>
                      Athletic Testing
                    </Typography>
                    <Box display="grid" gridTemplateColumns="auto 1fr" gap={2}>
                      <Typography color="text.secondary">Max Vertical:</Typography>
                      <Typography>{combineStats.maxVertical ? `${combineStats.maxVertical} in` : 'N/A'}</Typography>
                      
                      <Typography color="text.secondary">No Step Vertical:</Typography>
                      <Typography>{combineStats.noStepVertical ? `${combineStats.noStepVertical} in` : 'N/A'}</Typography>
                      
                      <Typography color="text.secondary">Lane Agility:</Typography>
                      <Typography>{combineStats.agility ? `${combineStats.agility} sec` : 'N/A'}</Typography>
                      
                      <Typography color="text.secondary">Sprint:</Typography>
                      <Typography>{combineStats.sprint ? `${combineStats.sprint} sec` : 'N/A'}</Typography>
                      
                      <Typography color="text.secondary">Shuttle:</Typography>
                      <Typography>{combineStats.shuttleBest ? `${combineStats.shuttleBest} sec` : 'N/A'}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ) : (
              <Typography color="text.secondary">
                No combine data available
              </Typography>
            )}
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
                  <Paper elevation={3} sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.main', color: 'white', borderRadius: 2 }}>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                      {statsView === 'perGame' ? stats.points.toFixed(1) : Math.round(stats.points)}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, opacity: 0.9 }}>
                      {statsView === "perGame" ? "PPG" : "Total Points"}
                    </Typography>
                  </Paper>
                  <Paper elevation={3} sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.main', color: 'white', borderRadius: 2 }}>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                      {statsView === 'perGame' ? stats.rebounds.toFixed(1) : Math.round(stats.rebounds)}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, opacity: 0.9 }}>
                      {statsView === "perGame" ? "RPG" : "Total Rebounds"}
                    </Typography>
                  </Paper>
                  <Paper elevation={3} sx={{ textAlign: 'center', p: 2, bgcolor: 'primary.main', color: 'white', borderRadius: 2 }}>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                      {statsView === 'perGame' ? stats.assists.toFixed(1) : Math.round(stats.assists)}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, opacity: 0.9 }}>
                      {statsView === "perGame" ? "APG" : "Total Assists"}
                    </Typography>
                  </Paper>
                </Box>

                {/* Additional Stats */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, gap: 2 }}>
                  {statsView === "perGame" ? (
                    <>
                      <Paper elevation={2} sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                          {stats.fgPercentage.toFixed(1)}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          FG%
                        </Typography>
                      </Paper>
                      <Paper elevation={2} sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                          {stats.threePtPercentage.toFixed(1)}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          3P%
                        </Typography>
                      </Paper>
                      <Paper elevation={2} sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                          {stats.ftPercentage.toFixed(1)}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          FT%
                        </Typography>
                      </Paper>
                    </>
                  ) : (
                    <>
                      <Paper elevation={2} sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                          {stats.gamesPlayed}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Games Played
                        </Typography>
                      </Paper>
                      <Paper elevation={2} sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                          {stats.gamesStarted}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Games Started
                        </Typography>
                      </Paper>
                    </>
                  )}
                  <Paper elevation={2} sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      {statsView === 'perGame' ? stats.steals.toFixed(1) : Math.round(stats.steals)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {statsView === "perGame" ? "SPG" : "Total Steals"}
                    </Typography>
                  </Paper>
                  <Paper elevation={2} sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      {statsView === 'perGame' ? stats.blocks.toFixed(1) : Math.round(stats.blocks)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {statsView === "perGame" ? "BPG" : "Total Blocks"}
                    </Typography>
                  </Paper>
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
