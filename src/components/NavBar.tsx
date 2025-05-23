import {
  Box,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface NavBarProps {
  search: string;
  setSearch: (val: string) => void;
}

export default function NavBar({ search, setSearch }: NavBarProps) {
  return (
    <Box sx={{ mb: 4 }}>
      <TextField
        size="small"
        placeholder="Search prospects..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{
          width: { xs: "100%", sm: "auto", md: 300 },
          "& .MuiOutlinedInput-root": {
            backgroundColor: "background.paper",
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}
