"use client";

import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../app/layout';
import { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, IconButton,
  Menu, MenuItem, Drawer, List, ListItem, ListItemIcon,
  ListItemText, Divider, useMediaQuery, useTheme, Tooltip
} from '@mui/material';
import {
  Menu as MenuIcon, AccountCircle, Home, QuestionAnswer,
  Dashboard, Add, Logout, Login, PersonAdd, Close,
  Brightness4, Brightness7
} from '@mui/icons-material';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { mode, toggleTheme } = useThemeMode();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    setMobileOpen(false);
    logout();
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navigateTo = (path) => {
    router.push(path);
    setMobileOpen(false);
  };

  // Mobile drawer content
  const drawer = (
    <Box sx={{ width: 280 }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight={700} color="primary">
          📚 Interview Bank
        </Typography>
        <IconButton onClick={handleDrawerToggle}>
          <Close />
        </IconButton>
      </Box>

      <Divider />

      <List>
        <ListItem button onClick={() => navigateTo('/')}>
          <ListItemIcon><Home /></ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>

        <ListItem button onClick={() => navigateTo('/questions')}>
          <ListItemIcon><QuestionAnswer /></ListItemIcon>
          <ListItemText primary="Questions" />
        </ListItem>

        {isAuthenticated && (
          <>
            <ListItem button onClick={() => navigateTo('/dashboard')}>
              <ListItemIcon><Dashboard /></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>

            <ListItem button onClick={() => navigateTo('/add-question')}>
              <ListItemIcon><Add /></ListItemIcon>
              <ListItemText primary="Add Question" />
            </ListItem>
          </>
        )}

        <Divider sx={{ my: 1 }} />

        <ListItem button onClick={toggleTheme}>
          <ListItemIcon>
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </ListItemIcon>
          <ListItemText primary={mode === 'dark' ? 'Light Mode' : 'Dark Mode'} />
        </ListItem>
      </List>

      <Divider />

      {isAuthenticated ? (
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Logged in as:
          </Typography>
          <Typography variant="body1" fontWeight={600} gutterBottom>
            {user?.username}
          </Typography>
          <Button
            fullWidth
            variant="outlined"
            color="error"
            startIcon={<Logout />}
            onClick={handleLogout}
            sx={{ mt: 1 }}
          >
            Logout
          </Button>
        </Box>
      ) : (
        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Login />}
            onClick={() => navigateTo('/login')}
            sx={{ mb: 1 }}
          >
            Login
          </Button>
          <Button
            fullWidth
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={() => navigateTo('/register')}
          >
            Register
          </Button>
        </Box>
      )}
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" elevation={2}>
        <Toolbar>
          {/* Mobile Menu Icon */}
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo */}
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: isMobile ? 1 : 0,
              mr: isMobile ? 0 : 4,
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}
            onClick={() => router.push('/')}
          >
            📚 Interview Bank
          </Typography>

          {/* Desktop Menu */}
          {!isMobile && (
            <>
              <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
                <Button color="inherit" onClick={() => router.push('/')}>
                  Home
                </Button>
                <Button color="inherit" onClick={() => router.push('/questions')}>
                  Questions
                </Button>
                {isAuthenticated && (
                  <Button color="inherit" onClick={() => router.push('/dashboard')}>
                    Dashboard
                  </Button>
                )}
              </Box>

              {/* Dark Mode Toggle */}
              <Tooltip title={mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
                <IconButton
                  onClick={toggleTheme}
                  color="inherit"
                  sx={{ mr: 2 }}
                >
                  {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                </IconButton>
              </Tooltip>

              {isAuthenticated ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ mr: 1 }}>
                    {user?.username}
                  </Typography>
                  <IconButton
                    size="large"
                    onClick={handleMenu}
                    color="inherit"
                  >
                    <AccountCircle />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={() => { handleClose(); router.push('/add-question'); }}>
                      Add Question
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button color="inherit" onClick={() => router.push('/login')}>
                    Login
                  </Button>
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => router.push('/register')}
                  >
                    Register
                  </Button>
                </Box>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}