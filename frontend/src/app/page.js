"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Container, Typography, Box, Button, Grid, Card, CardContent,
  Stack, useTheme, useMediaQuery, Chip, alpha
} from '@mui/material';
import {
  Code as CodeIcon,
  Search as SearchIcon,
  TrendingUp as TrendingIcon,
  School as SchoolIcon,
  ArrowForward as ArrowIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { useState, useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    { 
      icon: <CodeIcon />, 
      title: 'Code Examples', 
      desc: 'Practical snippets with explanations',
      color: theme.palette.primary.main
    },
    { 
      icon: <SearchIcon />, 
      title: 'Smart Search', 
      desc: 'Advanced filtering capabilities',
      color: theme.palette.info.main
    },
    { 
      icon: <TrendingIcon />, 
      title: 'Progress Tracking', 
      desc: 'Monitor learning journey',
      color: theme.palette.success.main
    },
    { 
      icon: <SchoolIcon />, 
      title: 'Expert Curated', 
      desc: 'Vetted by professionals',
      color: theme.palette.warning.main
    },
  ];

  const categories = [
    { title: 'Core Java', desc: '100+ questions', color: '#FF6B6B', icon: '☕' },
    { title: 'Spring Boot', desc: '80+ questions', color: '#4ECDC4', icon: '🍃' },
    { title: 'Microservices', desc: '60+ questions', color: '#45B7D1', icon: '🔧' },
    { title: 'Algorithms', desc: '120+ questions', color: '#96CEB4', icon: '💡' },
    { title: 'Database', desc: '70+ questions', color: '#FFEAA7', icon: '🗄️' },
    { title: 'System Design', desc: '50+ questions', color: '#DDA0DD', icon: '🏗️' },
  ];

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: { xs: '80vh', md: '85vh' },
          background: `linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%)`,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 }, position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Box>
                <Chip 
                  label="🔥 Most Trusted" 
                  sx={{ 
                    mb: 2,
                    bgcolor: alpha('#fff', 0.2),
                    color: 'white'
                  }}
                />
                
                <Typography
                  variant="h1"
                  gutterBottom
                  sx={{
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                    fontWeight: 700,
                    lineHeight: 1.2,
                    mb: 3
                  }}
                >
                  Master{' '}
                  <Box component="span" sx={{ 
                    background: 'linear-gradient(45deg, #FFD700, #FF8C00)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    Java Full Stack
                  </Box>
                  {' '}Interviews
                </Typography>
                
                <Typography
                  variant="h6"
                  paragraph
                  sx={{
                    mb: 4,
                    opacity: 0.9,
                    fontSize: { xs: '1rem', md: '1.1rem' }
                  }}
                >
                  Curated questions, real-world examples, and practice tools to ace technical interviews.
                </Typography>

                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  sx={{ mb: 4 }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => router.push(isAuthenticated ? '/questions' : '/register')}
                    endIcon={<ArrowIcon />}
                    sx={{
                      bgcolor: 'white',
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                      borderRadius: 2,
                      '&:hover': {
                        bgcolor: 'grey.50',
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    {isAuthenticated ? 'Start Practice' : 'Get Started Free'}
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => router.push('/questions')}
                    sx={{
                      borderColor: alpha('#fff', 0.5),
                      color: 'white',
                      fontWeight: 600,
                      borderRadius: 2,
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: alpha('#fff', 0.1),
                      }
                    }}
                  >
                    Browse Questions
                  </Button>
                </Stack>

                <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap', gap: 2 }}>
                  {['No credit card', '100% Free', 'Community Driven'].map((item, idx) => (
                    <Stack key={idx} direction="row" spacing={1} alignItems="center">
                      <CheckIcon sx={{ color: '#4CAF50', fontSize: '1rem' }} />
                      <Typography variant="body2">
                        {item}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            gutterBottom
            sx={{ 
              fontSize: { xs: '1.75rem', md: '2.5rem' },
              fontWeight: 700,
              mb: 2
            }}
          >
            Why Choose{' '}
            <Box component="span" sx={{ 
              color: theme.palette.primary.main,
            }}>
              Our Platform
            </Box>
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ maxWidth: '600px', mx: 'auto' }}
          >
            Everything you need to succeed in technical interviews.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {features.map((feature, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: feature.color,
                    transform: 'translateY(-4px)',
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: alpha(feature.color, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2
                    }}
                  >
                    {React.cloneElement(feature.icon, { 
                      sx: { fontSize: '1.5rem', color: feature.color } 
                    })}
                  </Box>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Categories */}
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h2"
              gutterBottom
              sx={{ 
                fontSize: { xs: '1.75rem', md: '2.5rem' },
                fontWeight: 700,
                mb: 2
              }}
            >
              Explore{' '}
              <Box component="span" sx={{ color: theme.palette.primary.main }}>
                Categories
              </Box>
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
              Comprehensive coverage of Java Full Stack topics
            </Typography>
          </Box>

          <Grid container spacing={2}>
            {categories.map((cat, idx) => (
              <Grid item xs={6} sm={4} md={2} key={idx}>
                <Card
                  sx={{
                    height: '100%',
                    bgcolor: alpha(cat.color, 0.1),
                    border: `1px solid ${alpha(cat.color, 0.2)}`,
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: alpha(cat.color, 0.15),
                      transform: 'translateY(-2px)',
                    }
                  }}
                  onClick={() => router.push(`/questions?category=${cat.title}`)}
                >
                  <CardContent sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ mb: 1 }}>
                      {cat.icon}
                    </Typography>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      {cat.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {cat.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA */}
      <Box sx={{ 
        py: { xs: 6, md: 8 },
        background: `linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%)`,
        color: 'white'
      }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography
            variant="h2"
            gutterBottom
            sx={{ 
              fontSize: { xs: '1.75rem', md: '2.5rem' },
              fontWeight: 700,
              mb: 3
            }}
          >
            Ready to Transform Your Interview Journey?
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of developers who landed dream jobs using our platform.
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={() => router.push(isAuthenticated ? '/practice' : '/register')}
            sx={{
              bgcolor: 'white',
              color: theme.palette.primary.main,
              fontWeight: 600,
              borderRadius: 2,
              px: 4,
              '&:hover': {
                bgcolor: 'grey.50',
                transform: 'translateY(-2px)',
              }
            }}
          >
            {isAuthenticated ? 'Start Practicing' : 'Get Started Free'}
          </Button>
        </Container>
      </Box>
    </Box>
  );
}