"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Container, Typography, Box, Button, Grid, Card, CardContent,
  Stack, useTheme, Chip, alpha, Paper, Divider
} from '@mui/material';
import {
  Code, Terminal, TrendingUp, School, ArrowForward, 
  CheckCircle, KeyboardArrowRight, Bolt
} from '@mui/icons-material';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Developer-focused categories
  const categories = [
    { title: 'Core Java', count: '100+', color: '#EF4444', font: 'java' },
    { title: 'Spring Boot', count: '80+', color: '#10B981', font: 'spring' },
    { title: 'Microservices', count: '60+', color: '#3B82F6', font: 'docker' },
    { title: 'DSA', count: '120+', color: '#F59E0B', font: 'algo' },
    { title: 'SQL', count: '70+', color: '#8B5CF6', font: 'sql' },
    { title: 'Sys Design', count: '50+', color: '#EC4899', font: 'arch' },
  ];

  return (
    <Box sx={{ bgcolor: '#0A0A0A', color: 'white', minHeight: '100vh', overflowX: 'hidden' }}>
      
      {/* 1. Background Grid Pattern & Glow - The "Dev" Look */}
      <Box sx={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 0,
        opacity: 0.4,
        pointerEvents: 'none',
        backgroundImage: `linear-gradient(${alpha('#fff', 0.05)} 1px, transparent 1px), linear-gradient(90deg, ${alpha('#fff', 0.05)} 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        maskImage: 'linear-gradient(to bottom, black 40%, transparent 100%)'
      }} />
      
      {/* Top Glow */}
      <Box sx={{
        position: 'absolute',
        top: '-20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '60%',
        height: '500px',
        background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 70%)`,
        filter: 'blur(60px)',
        zIndex: 0,
        pointerEvents: 'none',
      }} />

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pt: { xs: 8, md: 12 }, pb: 8 }}>
        <Grid container spacing={6} alignItems="center">
          
          {/* Left Content */}
          <Grid item xs={12} md={6}>
            <Chip 
              icon={<Bolt sx={{ color: '#FFD700 !important' }} />}
              label="v2.0 Now Live: Interactive Coding" 
              sx={{ 
                mb: 3, 
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.light,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                fontWeight: 600
              }}
            />
            
            <Typography variant="h1" sx={{ 
              fontSize: { xs: '2.5rem', md: '3.75rem' }, 
              fontWeight: 800, 
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              mb: 2,
              background: 'linear-gradient(180deg, #fff 0%, #A1A1AA 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Crack the <br />
              <Box component="span" sx={{ color: theme.palette.primary.main, fontFamily: 'monospace' }}>
                System.out.print
              </Box>
            </Typography>

            <Typography variant="h6" sx={{ color: '#A1A1AA', mb: 4, lineHeight: 1.6, maxWidth: 480 }}>
              Stop memorizing. Start understanding. The developer-first platform for mastering Full Stack interviews with <Box component="span" sx={{ color: 'white', fontWeight: 600 }}>real logic</Box>, not just theory.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                onClick={() => router.push(isAuthenticated ? '/questions' : '/register')}
                sx={{
                  bgcolor: 'white', color: 'black',
                  fontWeight: 700, px: 4, py: 1.5,
                  '&:hover': { bgcolor: '#E4E4E7' }
                }}
              >
                Start Compiling
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<Terminal />}
                onClick={() => router.push('/questions')}
                sx={{
                  borderColor: '#3F3F46', color: 'white',
                  px: 4,
                  '&:hover': { borderColor: 'white', bgcolor: alpha('#fff', 0.05) }
                }}
              >
                View Pattern
              </Button>
            </Stack>

            <Stack direction="row" spacing={3} sx={{ mt: 4 }}>
              {['100% Free', 'Community Driven', 'No Fluff'].map((text) => (
                <Stack key={text} direction="row" alignItems="center" spacing={1}>
                  <CheckCircle sx={{ fontSize: 16, color: theme.palette.success.main }} />
                  <Typography variant="caption" sx={{ color: '#71717A', textTransform: 'uppercase', letterSpacing: 1 }}>{text}</Typography>
                </Stack>
              ))}
            </Stack>
          </Grid>

          {/* Right Visual - The "Terminal" Look */}
          <Grid item xs={12} md={6}>
            <Paper elevation={24} sx={{
              bgcolor: '#09090b',
              border: '1px solid #27272a',
              borderRadius: 2,
              overflow: 'hidden',
              fontFamily: 'monospace',
              position: 'relative'
            }}>
              {/* Terminal Header */}
              <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #27272a', display: 'flex', gap: 1 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#EF4444' }} />
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#F59E0B' }} />
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#10B981' }} />
                <Typography variant="caption" sx={{ ml: 'auto', color: '#52525B' }}>bash — 80x24</Typography>
              </Box>
              
              {/* Terminal Body */}
              <Box sx={{ p: 3, color: '#A1A1AA', fontSize: '0.875rem' }}>
                <Box sx={{ mb: 2 }}>
                  <Typography component="span" sx={{ color: '#10B981', mr: 1 }}>➜</Typography>
                  <Typography component="span" sx={{ color: '#3B82F6', mr: 1 }}>~</Typography>
                  <Typography component="span">interview-prep start --mode=hard</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography sx={{ color: '#E4E4E7' }}>[INFO] Initializing Spring Boot modules...</Typography>
                  <Typography sx={{ color: '#E4E4E7' }}>[INFO] Loading 50 System Design patterns...</Typography>
                  <Typography sx={{ color: '#E4E4E7' }}>[INFO] Optimizing Algorithms...</Typography>
                  <br/>
                  <Box sx={{ p: 2, bgcolor: alpha(theme.palette.success.main, 0.1), borderLeft: `2px solid ${theme.palette.success.main}` }}>
                    <Typography sx={{ color: theme.palette.success.light }}>
                      ✔ READY: You are prepared to ace the interview.
                    </Typography>
                  </Box>
                  <br/>
                  <Box>
                    <Typography component="span" sx={{ color: '#10B981', mr: 1 }}>➜</Typography>
                    <Typography component="span" sx={{ color: '#3B82F6', mr: 1 }}>~</Typography>
                    <Box component="span" sx={{ animation: 'blink 1s infinite' }}>_</Box>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Divider sx={{ borderColor: '#27272a' }} />

      {/* Tech Stack / Categories Grid */}
      <Container maxWidth="lg" sx={{ py: 10, position: 'relative', zIndex: 1 }}>
        <Typography variant="h4" sx={{ 
          textAlign: 'center', fontWeight: 700, mb: 6,
          background: 'linear-gradient(180deg, #fff 0%, #71717A 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Choose your <span style={{ fontFamily: 'monospace' }}>module</span>
        </Typography>

        <Grid container spacing={2}>
          {categories.map((cat, idx) => (
            <Grid item xs={6} md={4} key={idx}>
              <Paper sx={{
                p: 3,
                bgcolor: 'rgba(24, 24, 27, 0.5)', // Glass effect
                backdropFilter: 'blur(10px)',
                border: '1px solid #27272a',
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: cat.color,
                  transform: 'translateY(-4px)',
                  boxShadow: `0 0 20px ${alpha(cat.color, 0.15)}`
                }
              }}
              onClick={() => router.push(`/questions?category=${cat.title}`)}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="start" sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#E4E4E7' }}>
                    {cat.title}
                  </Typography>
                  <KeyboardArrowRight sx={{ color: '#52525B' }} />
                </Stack>
                
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box sx={{ 
                    width: 8, height: 8, borderRadius: '50%', 
                    bgcolor: cat.color,
                    boxShadow: `0 0 8px ${cat.color}` 
                  }} />
                  <Typography variant="caption" sx={{ color: '#A1A1AA', fontFamily: 'monospace' }}>
                    {cat.count} Questions
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Simple Footer CTA */}
      <Box sx={{ borderTop: '1px solid #27272a', py: 8, textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <Container maxWidth="sm">
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
            Ready to commit?
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            Join the branch where developers get hired.
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => router.push('/register')}
            sx={{ 
              bgcolor: 'white', color: 'black', fontWeight: 700, px: 5,
              '&:hover': { bgcolor: '#E4E4E7' }
            }}
          >
            git push origin success
          </Button>
        </Container>
      </Box>

      {/* CSS for cursor blink */}
      <style jsx global>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </Box>
  );
}