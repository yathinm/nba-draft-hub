import { Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";
import BigBoard from "./pages/BigBoard";
import PlayerProfile from "./pages/PlayerProfile";
import Home from "./pages/Home";
import Layout from "./components/Layout";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1D428A", // NBA Blue
      light: "#2A5CBC",
      dark: "#152E60",
    },
    secondary: {
      main: "#C8102E", // NBA Red
      light: "#E81D3E",
      dark: "#8C0B20",
    },
    background: {
      default: "#FAFAFA",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1A1A1A",
      secondary: "#666666",
    },
    error: {
      main: "#C8102E", // NBA Red
    },
    warning: {
      main: "#FDB927", // Lakers Gold
    },
    info: {
      main: "#1D428A", // NBA Blue
    },
    success: {
      main: "#007A33", // Celtics Green
    },
  },
  typography: {
    fontFamily: "'Helvetica Neue', 'Arial', sans-serif",
    h1: {
      fontSize: "3.5rem",
      fontWeight: 800,
      letterSpacing: "-0.02em",
      textTransform: "uppercase",
    },
    h2: {
      fontSize: "2.75rem",
      fontWeight: 700,
      letterSpacing: "-0.01em",
      textTransform: "uppercase",
    },
    h3: {
      fontSize: "2.2rem",
      fontWeight: 600,
      letterSpacing: "-0.01em",
    },
    h4: {
      fontSize: "1.75rem",
      fontWeight: 600,
    },
    h5: {
      fontSize: "1.5rem",
      fontWeight: 500,
    },
    h6: {
      fontSize: "1.25rem",
      fontWeight: 500,
    },
    button: {
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      fontSize: "1rem",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          padding: "10px 24px",
          fontSize: "1rem",
          transition: "all 0.3s ease",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0))",
            opacity: 0,
            transition: "opacity 0.3s ease",
          },
          "&:hover::before": {
            opacity: 1,
          },
        },
        contained: {
          boxShadow: "0 4px 6px rgba(29, 66, 138, 0.1)",
          "&:hover": {
            boxShadow: "0 6px 12px rgba(29, 66, 138, 0.2)",
            transform: "translateY(-2px)",
          },
        },
        outlined: {
          borderWidth: "2px",
          "&:hover": {
            borderWidth: "2px",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
          transition: "all 0.3s ease",
          border: "1px solid rgba(0, 0, 0, 0.05)",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0px 12px 28px rgba(0, 0, 0, 0.12)",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          borderBottom: "2px solid rgba(29, 66, 138, 0.1)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          padding: "0 12px",
        },
        filled: {
          background: "linear-gradient(45deg, #1D428A, #2A5CBC)",
          color: "white",
          "&:hover": {
            background: "linear-gradient(45deg, #152E60, #1D428A)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
        elevation1: {
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
        },
        elevation2: {
          boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.12)",
        },
      },
    },
  },
  shape: {
    borderRadius: 12,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/big-board" element={<BigBoard />} />
          <Route path="/player/:id" element={<PlayerProfile />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
