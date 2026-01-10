"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Container, Paper, Typography, TextField, Button, Box, Alert, 
  useTheme, useMediaQuery, alpha, InputAdornment, IconButton
} from '@mui/material';
import { 
  Terminal, ArrowForward, Person, Lock, Visibility, VisibilityOff 
} from '@mui/icons-material';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);
    
    if (!result.success) {
      setError(result.message || 'Invalid credentials');
    }
    
    setLoading(false);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      bgcolor: 'background.default',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* 1. Background Effects (Matches Home Page) */}
      <Box sx={{
        position: 'absolute', inset: 0, zIndex: 0, opacity: 0.3, pointerEvents: 'none',
        backgroundImage: `linear-gradient(${alpha(theme.palette.text.primary, 0.05)} 1px, transparent 1px), linear-gradient(90deg, ${alpha(theme.palette.text.primary, 0.05)} 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }} />
      
      {/* Glow Effect */}
      <Box sx={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px', height: '600px',
        background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 70%)`,
        filter: 'blur(60px)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 3, sm: 4 }, 
            width: '100%',
            bgcolor: alpha(theme.palette.background.paper, 0.6), // Glass effect
            backdropFilter: 'blur(12px)',
            border: '1px solid',
            borderColor: alpha(theme.palette.divider, 0.1),
            borderRadius: 3,
            boxShadow: `0 8px 32px ${alpha('#000', 0.1)}`
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ 
              width: 48, height: 48, mx: 'auto', mb: 2, 
              borderRadius: 2, 
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: theme.palette.primary.main
            }}>
              <Terminal fontSize="medium" />
            </Box>
            <Typography variant="h5" fontWeight={700} sx={{ fontFamily: 'monospace', letterSpacing: '-0.5px' }}>
              Authenticate
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter your credentials to access the terminal
            </Typography>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3, 
                borderRadius: 2,
                bgcolor: alpha(theme.palette.error.main, 0.1),
                color: theme.palette.error.main,
                border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`
              }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              sx={{ mb: 2.5 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: 'text.secondary', fontSize: 20 }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 }
              }}
            />
            
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: 'text.secondary', fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 }
              }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              endIcon={!loading && <ArrowForward />}
              sx={{ 
                mb: 3, 
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem',
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.4)}`
                }
              }}
            >
              {loading ? 'Authenticating...' : 'Connect'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No access token?{' '}
                <Link href="/register" style={{ textDecoration: 'none' }}>
                  <Box component="span" sx={{ 
                    color: theme.palette.primary.main, 
                    fontWeight: 600,
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' }
                  }}>
                    Initialize User
                  </Box>
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}