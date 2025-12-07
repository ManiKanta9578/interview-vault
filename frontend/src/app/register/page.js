"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Container, Paper, Typography, TextField, Button, Box, Alert,
  Link as MuiLink, useTheme, useMediaQuery
} from '@mui/material';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
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
    <Container 
      maxWidth="sm" 
      sx={{ 
        py: { xs: 4, sm: 6, md: 8 }, 
        px: { xs: 2, sm: 3 },
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Paper elevation={3} sx={{ p: { xs: 3, sm: 4 }, width: '100%' }}>
        <Typography 
          variant="h4" 
          align="center" 
          gutterBottom 
          fontWeight={600}
          sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}
        >
          Create Account
        </Typography>
        <Typography 
          variant="body2" 
          align="center" 
          color="text.secondary" 
          paragraph
          sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
        >
          Join us and start preparing for your interviews
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
            size={isMobile ? "small" : "medium"}
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
            size={isMobile ? "small" : "medium"}
          />

          <TextField
            fullWidth
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            sx={{ mb: 2 }}
            size={isMobile ? "small" : "medium"}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            helperText="Minimum 6 characters"
            sx={{ mb: 2 }}
            size={isMobile ? "small" : "medium"}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            sx={{ mb: 3 }}
            size={isMobile ? "small" : "medium"}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mb: 2, py: { xs: 1.5, sm: 2 } }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
              Already have an account?{' '}
              <Link href="/login" passHref legacyBehavior>
                <MuiLink sx={{ cursor: 'pointer' }}>Sign In</MuiLink>
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}