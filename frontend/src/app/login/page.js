"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Container, Paper, Typography, TextField, Button, Box, Alert,
  Link as MuiLink, useTheme, useMediaQuery
} from '@mui/material';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
      setError(result.message || 'Invalid username or password');
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
          Sign In
        </Typography>
        <Typography 
          variant="body2" 
          align="center" 
          color="text.secondary" 
          paragraph
          sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
        >
          Welcome back! Please sign in to continue
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
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            sx={{ mb: 2 }}
            size={isMobile ? "small" : "medium"}
          />
          
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
              Don't have an account?{' '}
              <Link href="/register" passHref legacyBehavior>
                <MuiLink sx={{ cursor: 'pointer' }}>Sign Up</MuiLink>
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}