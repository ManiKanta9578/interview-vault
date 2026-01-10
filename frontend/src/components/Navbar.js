"use client";

import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../app/layout';
import { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, IconButton,
  Menu, MenuItem, Drawer, List, ListItem, ListItemIcon,
  ListItemText, Divider, useMediaQuery, useTheme
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

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    setMobileOpen(false);
    logout();
  };

  const navigateTo = (path) => {
    router.push(path);
    setMobileOpen(false);
  };

  // Drawer for mobile
  const drawer = (
    <Box sx={{ width: 250, height: '100%' }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight={600}>
          Interview Bank
        </Typography>
        <IconButton onClick={() => setMobileOpen(false)} size="small">
          <Close />
        </IconButton>
      </Box>

      <Divider />

      <List sx={{ p: 1 }}>
        <ListItem button onClick={() => navigateTo('/')} sx={{ borderRadius: 1 }}>
          <ListItemIcon sx={{ minWidth: 36 }}><Home /></ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>

        <ListItem button onClick={() => navigateTo('/questions')} sx={{ borderRadius: 1 }}>
          <ListItemIcon sx={{ minWidth: 36 }}><QuestionAnswer /></ListItemIcon>
          <ListItemText primary="Questions" />
        </ListItem>

        {isAuthenticated && (
          <>
            <ListItem button onClick={() => navigateTo('/dashboard')} sx={{ borderRadius: 1 }}>
              <ListItemIcon sx={{ minWidth: 36 }}><Dashboard /></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>

            <ListItem button onClick={() => navigateTo('/add-question')} sx={{ borderRadius: 1 }}>
              <ListItemIcon sx={{ minWidth: 36 }}><Add /></ListItemIcon>
              <ListItemText primary="Add Question" />
            </ListItem>
          </>
        )}
      </List>

      <Divider sx={{ my: 1 }} />

      <List sx={{ p: 1 }}>
        <ListItem button onClick={toggleTheme} sx={{ borderRadius: 1 }}>
          <ListItemIcon sx={{ minWidth: 36 }}>
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </ListItemIcon>
          <ListItemText primary={mode === 'dark' ? 'Light Mode' : 'Dark Mode'} />
        </ListItem>
      </List>

      <Box sx={{ mt: 'auto', p: 2 }}>
        {isAuthenticated ? (
          <>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {user?.username}
            </Typography>
            <Button
              fullWidth
              variant="outlined"
              size="small"
              startIcon={<Logout />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button
              fullWidth
              variant="outlined"
              size="small"
              startIcon={<Login />}
              onClick={() => navigateTo('/login')}
              sx={{ mb: 1 }}
            >
              Login
            </Button>
            <Button
              fullWidth
              variant="contained"
              size="small"
              startIcon={<PersonAdd />}
              onClick={() => navigateTo('/register')}
            >
              Register
            </Button>
          </>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar position="static"
        elevation={0}
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          backdropFilter: 'blur(8px)',
          backgroundColor: mode === 'dark'
            ? 'rgba(18, 18, 18, 0.8)'
            : 'rgba(255, 255, 255, 0.8)',
        }}
      >
        <Toolbar sx={{ minHeight: 56 }}>
          {isMobile && (
            <IconButton edge="start" onClick={() => setMobileOpen(true)} sx={{ mr: 1 }}>
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            sx={{
              flexGrow: isMobile ? 1 : 0,
              mr: 4,
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: mode === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(18, 18, 18, 0.8)',
            }}
            onClick={() => router.push('/')}
          >
            📚 Interview Bank
          </Typography>

          {!isMobile && (
            <>
              <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
                <Button onClick={() => router.push('/')} sx={{ px: 2 }}>
                  Home
                </Button>
                <Button onClick={() => router.push('/questions')} sx={{ px: 2 }}>
                  Questions
                </Button>
                {isAuthenticated && (
                  <Button onClick={() => router.push('/dashboard')} sx={{ px: 2 }}>
                    Dashboard
                  </Button>
                )}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton onClick={toggleTheme} size="small">
                  {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                </IconButton>

                {isAuthenticated ? (
                  <>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      {user?.username}
                    </Typography>
                    <IconButton onClick={handleMenu} size="small">
                      <AccountCircle />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                      sx={{ mt: 1 }}
                    >
                      <MenuItem onClick={() => { handleClose(); router.push('/add-question'); }}>
                        Add Question
                      </MenuItem>
                      <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                  </>
                ) : (
                  <>
                    <Button onClick={() => router.push('/login')} sx={{ px: 2 }}>
                      Login
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => router.push('/register')}
                      sx={{ px: 2 }}
                    >
                      Register
                    </Button>
                  </>
                )}
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar >

      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{ '& .MuiDrawer-paper': { width: 250 } }}
      >
        {drawer}
      </Drawer>
    </>
  );
}