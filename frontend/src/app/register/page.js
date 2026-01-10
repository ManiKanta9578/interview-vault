"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Container, Paper, Typography, TextField, Button, Box, Alert,
  useTheme, useMediaQuery, alpha, InputAdornment, IconButton
} from '@mui/material';
import { 
  Terminal, Person, Email, Key, Badge, ArrowForward, 
  Visibility, VisibilityOff, Lock 
} from '@mui/icons-material';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const result = await register(
      formData.username,
      formData.email,
      formData.password,
      formData.fullName
    );

    if (!result.success) {
      setError(result.message || 'Registration failed');
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
      overflow: 'hidden',
      py: 4
    }}>
      
      {/* 1. Background Effects */}
      <Box sx={{
        position: 'absolute', inset: 0, zIndex: 0, opacity: 0.3, pointerEvents: 'none',
        backgroundImage: `linear-gradient(${alpha(theme.palette.text.primary, 0.05)} 1px, transparent 1px), linear-gradient(90deg, ${alpha(theme.palette.text.primary, 0.05)} 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }} />
      
      <Box sx={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '800px', height: '800px',
        background: `radial-gradient(circle, ${alpha(theme.palette.success.main, 0.08)} 0%, transparent 70%)`,
        filter: 'blur(80px)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 3, sm: 5 }, 
            width: '100%',
            bgcolor: alpha(theme.palette.background.paper, 0.6),
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
              bgcolor: alpha(theme.palette.success.main, 0.1),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: theme.palette.success.main
            }}>
              <Terminal fontSize="medium" />
            </Box>
            <Typography variant="h5" fontWeight={700} sx={{ fontFamily: 'monospace', letterSpacing: '-0.5px' }}>
              Initialize Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create a new user profile in the system
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
            
            {/* Username */}
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              sx={{ mb: 2.5 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Badge sx={{ color: 'text.secondary', fontSize: 20 }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 }
              }}
            />

            {/* Email */}
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              sx={{ mb: 2.5 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: 'text.secondary', fontSize: 20 }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 }
              }}
            />

            {/* Full Name */}
            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
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

            {/* Password */}
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              required
              helperText="Minimum 6 characters"
              sx={{ mb: 2.5 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Key sx={{ color: 'text.secondary', fontSize: 20 }} />
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

            {/* Confirm Password */}
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              sx={{ mb: 4 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: 'text.secondary', fontSize: 20 }} />
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
                bgcolor: 'text.primary',
                color: 'background.default',
                '&:hover': {
                  bgcolor: 'text.secondary',
                  boxShadow: `0 0 20px ${alpha(theme.palette.text.primary, 0.3)}`
                }
              }}
            >
              {loading ? 'Creating Profile...' : 'Execute Registration'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have credentials?{' '}
                <Link href="/login" style={{ textDecoration: 'none' }}>
                  <Box component="span" sx={{ 
                    color: theme.palette.primary.main, 
                    fontWeight: 600,
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' }
                  }}>
                    Sign In
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