import type { ReactNode } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  useTheme,
  useMediaQuery,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import { useState } from "react";

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { label: "Home", path: "/" },
];

export default function Layout({ children }: LayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <List>
      {navItems.map((item) => (
        <ListItemButton
          key={item.path}
          component={Link}
          to={item.path}
          onClick={handleDrawerToggle}
          selected={location.pathname === item.path}
          sx={{
            color: "inherit",
            margin: "4px 8px",
            borderRadius: "12px",
            "&.Mui-selected": {
              background: "linear-gradient(45deg, #1D428A, #2A5CBC)",
              color: "white",
              "&:hover": {
                background: "linear-gradient(45deg, #152E60, #1D428A)",
              },
            },
            "&:hover": {
              background: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <ListItemText 
            primary={item.label}
            primaryTypographyProps={{
              sx: {
                fontWeight: 600,
                letterSpacing: "0.05em",
              }
            }}
          />
        </ListItemButton>
      ))}
    </List>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar 
        position="sticky" 
        color="default" 
        elevation={1}
        sx={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(8px)",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ px: { xs: 0 }, justifyContent: "space-between" }}>
            {isMobile && navItems.length > 0 && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ 
                  mr: 2,
                  "&:hover": {
                    background: "rgba(29, 66, 138, 0.1)",
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SportsBasketballIcon
                sx={{
                  fontSize: 40,
                  color: 'primary.main',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                }}
              />
              <Typography
                variant="h6"
                component={Link}
                to="/"
                sx={{
                  textDecoration: "none",
                  color: "primary.main",
                  fontWeight: "bold",
                  fontSize: { xs: "1.2rem", sm: "1.5rem" },
                  letterSpacing: "-0.5px",
                  textTransform: "uppercase",
                  position: "relative",
                  '&:hover': {
                    color: 'secondary.main',
                    transition: 'color 0.3s ease',
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -2,
                    left: 0,
                    width: '100%',
                    height: '2px',
                    background: 'linear-gradient(90deg, #C8102E, #1D428A)',
                    transform: 'scaleX(0)',
                    transition: 'transform 0.3s ease',
                    transformOrigin: 'right',
                  },
                  '&:hover::after': {
                    transform: 'scaleX(1)',
                    transformOrigin: 'left',
                  },
                }}
              >
                NBA Draft Hub
              </Typography>
            </Box>
            {!isMobile && navItems.length > 0 && (
              <Box>
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    component={Link}
                    to={item.path}
                    color={location.pathname === item.path ? "primary" : "inherit"}
                    variant={location.pathname === item.path ? "contained" : "text"}
                    sx={{
                      position: 'relative',
                      overflow: 'hidden',
                      background: location.pathname === item.path ? 
                        'linear-gradient(45deg, #1D428A, #2A5CBC)' : 'transparent',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(45deg, #C8102E, #1D428A)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                      },
                      '&:hover::before': {
                        opacity: 0.1,
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { 
            boxSizing: "border-box", 
            width: 280,
            background: 'linear-gradient(135deg, #1D428A 0%, #152E60 100%)',
            color: 'white',
            borderRight: '4px solid #C8102E',
          },
        }}
      >
        <Box sx={{ 
          p: 3, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(0,0,0,0.1)',
        }}>
          <SportsBasketballIcon
            sx={{
              fontSize: 40,
              color: 'white',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
            }}
          />
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'white',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              fontWeight: 'bold',
            }}
          >
            NBA Draft Hub
          </Typography>
        </Box>
        {drawer}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>

      <Box
        component="footer"
        sx={{
          py: 3,
          background: 'linear-gradient(45deg, #1D428A, #152E60)',
          color: "white",
          borderTop: '4px solid #C8102E',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: 2,
          }}>
            <Box
              sx={{
                position: 'relative',
                display: 'inline-flex',
                "&::after": {
                  content: '""',
                  position: 'absolute',
                  top: -2,
                  left: -2,
                  right: -2,
                  bottom: -2,
                  background: 'linear-gradient(45deg, #C8102E, #FDB927)',
                  borderRadius: '50%',
                  zIndex: -1,
                  opacity: 0.5,
                }
              }}
            >
              <SportsBasketballIcon
                sx={{
                  fontSize: 40,
                  color: 'white',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                }}
              />
            </Box>
            <Typography 
              variant="h6"
              sx={{
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: 'bold',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            >
              NBA Draft Hub
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
} 