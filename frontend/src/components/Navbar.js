"use client";

import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../app/layout';
import { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, IconButton,
  Menu, MenuItem, Drawer, List, ListItem, ListItemIcon,
  ListItemText, Divider, useMediaQuery, useTheme, alpha
} from '@mui/material';
import {
  Menu as MenuIcon, AccountCircle, Home, QuestionAnswer,
  Dashboard, Add, Logout, Login, PersonAdd, Close,
  Brightness4, Brightness7, Terminal, Code // Added Terminal and Code icons
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
    <Box sx={{ width: 280, height: '100%', bgcolor: 'background.default' }}>
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontFamily: 'monospace', fontWeight: 700 }}>
          ~/Menu
        </Typography>
        <IconButton onClick={() => setMobileOpen(false)} size="small">
          <Close />
        </IconButton>
      </Box>

      <Divider sx={{ borderColor: 'divider' }} />

      <List sx={{ p: 2 }}>
        {[
          { text: 'Home', icon: <Home />, path: '/' },
          { text: 'Questions', icon: <QuestionAnswer />, path: '/questions' },
          ...(isAuthenticated ? [
            { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
            { text: 'New Question', icon: <Add />, path: '/add-question' }
          ] : [])
        ].map((item) => (
          <ListItem 
            button 
            key={item.text} 
            onClick={() => navigateTo(item.path)} 
            sx={{ 
              borderRadius: 2, 
              mb: 1,
              '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'text.primary' }}>{item.icon}</ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{ fontWeight: 500 }} 
            />
          </ListItem>
        ))}
      </List>
      
      {/* Bottom Actions for Mobile */}
      <Box sx={{ mt: 'auto', p: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
           <Typography variant="caption" color="text.secondary">Theme</Typography>
           <IconButton onClick={toggleTheme} size="small">
            {mode === 'dark' ? <Brightness7 fontSize="small" /> : <Brightness4 fontSize="small" />}
          </IconButton>
        </Box>

        {isAuthenticated ? (
          <Button
            fullWidth
            variant="outlined"
            color="error"
            startIcon={<Logout />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        ) : (
          <Button
            fullWidth
            variant="contained"
            startIcon={<Login />}
            onClick={() => navigateTo('/login')}
          >
            Login / Register
          </Button>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="static"
        elevation={0}
        sx={{
          borderBottom: '1px solid',
          borderColor: alpha(theme.palette.divider, 0.1),
          backdropFilter: 'blur(12px)', // Stronger blur for "glass" feel
          zIndex: (theme) => theme.zIndex.drawer + 1, // CRITICAL: Forces Navbar above the background animation
          backgroundColor: mode === 'dark'
            ? 'rgba(10, 10, 10, 0.7)' // Dark glass
            : 'rgba(255, 255, 255, 0.8)', // Light glass
          transition: 'all 0.2s ease-in-out'
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 64, md: 70 } }}>
          
          {/* 1. Mobile Menu Icon */}
          {isMobile && (
            <IconButton edge="start" onClick={() => setMobileOpen(true)} sx={{ mr: 1, color: 'text.primary' }}>
              <MenuIcon />
            </IconButton>
          )}

          {/* 2. Developer Logo */}
          <Box 
            onClick={() => router.push('/')}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer', 
              flexGrow: isMobile ? 1 : 0,
              mr: 4,
              '&:hover .terminal-icon': { color: theme.palette.primary.main }
            }}
          >
            <Terminal 
              className="terminal-icon"
              sx={{ 
                mr: 1.5, 
                fontSize: '1.75rem', 
                transition: 'color 0.2s',
                color: theme.palette.text.primary 
              }} 
            />
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'monospace', // The "Dev" font
                fontWeight: 700,
                letterSpacing: '-0.5px',
                color: theme.palette.text.primary,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              ~/InterviewBank
              <Box component="span" sx={{ 
                width: 8, 
                height: 16, 
                bgcolor: theme.palette.primary.main, 
                ml: 0.5,
                animation: 'cursor 1s infinite' // Blinking cursor effect
              }} />
            </Typography>
          </Box>

          {/* 3. Desktop Navigation */}
          {!isMobile && (
            <>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {[
                  { label: 'Home', path: '/' },
                  { label: 'Questions', path: '/questions' },
                  ...(isAuthenticated ? [{ label: 'Dashboard', path: '/dashboard' }] : [])
                ].map((link) => (
                  <Button
                    key={link.label}
                    onClick={() => router.push(link.path)}
                    sx={{
                      color: 'text.secondary',
                      fontWeight: 500,
                      textTransform: 'none', // No ALL CAPS
                      fontSize: '0.95rem',
                      px: 2,
                      '&:hover': {
                        color: 'text.primary',
                        bgcolor: alpha(theme.palette.text.primary, 0.05)
                      }
                    }}
                  >
                    {link.label}
                  </Button>
                ))}
              </Box>

              <Box sx={{ flexGrow: 1 }} />

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <IconButton onClick={toggleTheme} size="small" sx={{ color: 'text.secondary' }}>
                  {mode === 'dark' ? <Brightness7 fontSize="small" /> : <Brightness4 fontSize="small" />}
                </IconButton>

                <Divider orientation="vertical" flexItem sx={{ height: 24, alignSelf: 'center', borderColor: alpha(theme.palette.divider, 0.2) }} />

                {isAuthenticated ? (
                  <>
                    <Button
                      onClick={handleMenu}
                      startIcon={<AccountCircle />}
                      endIcon={<Code fontSize="small" sx={{ opacity: 0.5 }} />}
                      sx={{
                        textTransform: 'none',
                        color: 'text.primary',
                        borderColor: alpha(theme.palette.divider, 0.2),
                        '&:hover': { borderColor: theme.palette.primary.main }
                      }}
                      variant="outlined"
                    >
                      {user?.username}
                    </Button>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                      PaperProps={{
                        sx: {
                          mt: 1.5,
                          minWidth: 180,
                          borderRadius: 2,
                          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                          boxShadow: theme.shadows[10]
                        }
                      }}
                    >
                      <MenuItem onClick={() => { handleClose(); router.push('/add-question'); }} sx={{ gap: 1.5 }}>
                        <Add fontSize="small" /> New Question
                      </MenuItem>
                      <Divider sx={{ my: 0.5 }} />
                      <MenuItem onClick={handleLogout} sx={{ gap: 1.5, color: 'error.main' }}>
                        <Logout fontSize="small" /> Logout
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <>
                    <Button 
                      onClick={() => router.push('/login')}
                      sx={{ 
                        color: 'text.primary', 
                        textTransform: 'none',
                        fontWeight: 600
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => router.push('/register')}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        boxShadow: 'none',
                        bgcolor: 'text.primary',
                        color: 'background.default',
                        '&:hover': { bgcolor: 'text.secondary' }
                      }}
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Blinking Cursor Animation Style */}
      <style jsx global>{`
        @keyframes cursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      {/* Drawer */}
      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 2 }} // Ensure drawer is above everything
      >
        {drawer}
      </Drawer>
    </>
  );
}