"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Container, Typography, Box, Button, Grid, Card, CardContent,
  Stack, useTheme, useMediaQuery, Paper, Chip, IconButton, alpha,
  Fade, Zoom, Grow
} from '@mui/material';
import {
  RocketLaunch as RocketIcon,
  Code as CodeIcon,
  Search as SearchIcon,
  School as SchoolIcon,
  TrendingUp as TrendingIcon,
  CheckCircle as CheckIcon,
  ArrowForward as ArrowIcon,
  GitHub as GitHubIcon,
  People as PeopleIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';
import { useState, useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    { 
      icon: <CodeIcon />, 
      title: 'Real Code Examples', 
      desc: 'Practical code snippets with explanations',
      color: theme.palette.primary.main
    },
    { 
      icon: <SearchIcon />, 
      title: 'Smart Search', 
      desc: 'Advanced filtering and search capabilities',
      color: theme.palette.info.main
    },
    { 
      icon: <TrendingIcon />, 
      title: 'Progress Tracking', 
      desc: 'Monitor your learning journey',
      color: theme.palette.success.main
    },
    { 
      icon: <SchoolIcon />, 
      title: 'Expert Curated', 
      desc: 'Questions vetted by industry professionals',
      color: theme.palette.warning.main
    },
  ];

  const categories = [
    { 
      title: 'Core Java', 
      icon: '☕',
      desc: '100+ questions',
      color: '#FF6B6B',
      topics: ['OOP', 'Collections', 'Multithreading', 'Streams']
    },
    { 
      title: 'Spring Boot', 
      icon: '🍃',
      desc: '80+ questions',
      color: '#4ECDC4',
      topics: ['Spring MVC', 'Security', 'Data JPA', 'Boot']
    },
    { 
      title: 'Microservices', 
      icon: '🔧',
      desc: '60+ questions',
      color: '#45B7D1',
      topics: ['Architecture', 'Communication', 'Docker', 'Kubernetes']
    },
    { 
      title: 'Algorithms', 
      icon: '💡',
      desc: '120+ questions',
      color: '#96CEB4',
      topics: ['Data Structures', 'Complexity', 'Patterns', 'Optimization']
    },
    { 
      title: 'Database', 
      icon: '🗄️',
      desc: '70+ questions',
      color: '#FFEAA7',
      topics: ['SQL', 'NoSQL', 'Indexing', 'Transactions']
    },
    { 
      title: 'System Design', 
      icon: '🏗️',
      desc: '50+ questions',
      color: '#DDA0DD',
      topics: ['Scaling', 'Caching', 'Load Balancing', 'Design Patterns']
    },
  ];

  const stats = [
    { value: '500+', label: 'Interview Questions', icon: '📚' },
    { value: '15+', label: 'Categories', icon: '🏷️' },
    { value: '10K+', label: 'Active Learners', icon: '👥' },
    { value: '100%', label: 'Free Access', icon: '🎯' },
  ];

  const testimonials = [
    { name: 'Alex Chen', role: 'Senior Developer @Google', text: 'This platform helped me ace my FAANG interview!' },
    { name: 'Sarah Johnson', role: 'Tech Lead @Amazon', text: 'The questions are incredibly relevant and well-explained.' },
    { name: 'Mike Rodriguez', role: 'Software Engineer @Microsoft', text: 'Best resource for Java Full Stack preparation.' },
  ];

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: { xs: '85vh', md: '90vh' },
          background: `
            linear-gradient(135deg, 
              ${alpha(theme.palette.primary.dark, 0.9)} 0%, 
              ${alpha(theme.palette.secondary.main, 0.9)} 100%
            ),
            url('/pattern.svg')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          overflow: 'hidden',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.2) 0%, transparent 50%)',
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: { xs: 6, md: 8 } }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Fade in={mounted} timeout={800}>
                <Box>
                  <Chip 
                    label="🔥 Most Trusted Platform" 
                    sx={{ 
                      mb: 3,
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      backdropFilter: 'blur(10px)',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' }
                    }}
                  />
                  
                  <Typography
                    variant="h1"
                    gutterBottom
                    sx={{
                      fontSize: { xs: '2.25rem', sm: '3rem', md: '3.75rem' },
                      fontWeight: 800,
                      lineHeight: 1.2,
                      mb: 3,
                      textShadow: '0 2px 20px rgba(0,0,0,0.1)'
                    }}
                  >
                    Master{' '}
                    <Box component="span" sx={{ 
                      background: 'linear-gradient(45deg, #FFD700, #FF8C00)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      display: 'inline'
                    }}>
                      Java Full Stack
                    </Box>
                    {' '}Interviews
                  </Typography>
                  
                  <Typography
                    variant="h5"
                    paragraph
                    sx={{
                      mb: 4,
                      opacity: 0.95,
                      fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                      maxWidth: '90%',
                      fontWeight: 400
                    }}
                  >
                    Your comprehensive platform with curated questions, real-world examples, and intelligent practice tools to ace your next technical interview.
                  </Typography>

                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    sx={{ mb: 4 }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => router.push(isAuthenticated ? '/dashboard' : '/register')}
                      endIcon={<ArrowIcon />}
                      sx={{
                        bgcolor: 'white',
                        color: theme.palette.primary.main,
                        px: { xs: 3, sm: 4 },
                        py: 1.5,
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        fontWeight: 600,
                        borderRadius: 3,
                        '&:hover': {
                          bgcolor: 'grey.50',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 12px 24px rgba(0,0,0,0.2)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {isAuthenticated ? 'Go to Dashboard' : 'Start Free Trial'}
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => router.push('/questions')}
                      sx={{
                        borderColor: 'rgba(255,255,255,0.5)',
                        color: 'white',
                        px: { xs: 3, sm: 4 },
                        py: 1.5,
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        fontWeight: 600,
                        borderRadius: 3,
                        backdropFilter: 'blur(10px)',
                        '&:hover': {
                          borderColor: 'white',
                          bgcolor: 'rgba(255,255,255,0.1)',
                          transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Explore Questions
                    </Button>
                  </Stack>

                  <Stack 
                    direction="row" 
                    spacing={3} 
                    alignItems="center"
                    sx={{ flexWrap: 'wrap', gap: 2 }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CheckIcon sx={{ color: '#4CAF50', fontSize: '1.2rem' }} />
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        No credit card required
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CheckIcon sx={{ color: '#4CAF50', fontSize: '1.2rem' }} />
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        100% Free Access
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CheckIcon sx={{ color: '#4CAF50', fontSize: '1.2rem' }} />
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Community Driven
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
              </Fade>
            </Grid>
            
            <Grid item xs={12} md={5}>
              <Zoom in={mounted} timeout={1000}>
                <Paper
                  sx={{
                    p: { xs: 3, sm: 4 },
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <Box sx={{ 
                    position: 'absolute',
                    top: -100,
                    right: -100,
                    width: 300,
                    height: 300,
                    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)'
                  }} />
                  
                  <Typography variant="h6" gutterBottom fontWeight={600} sx={{ color: 'white', mb: 3 }}>
                    🚀 Quick Stats
                  </Typography>
                  
                  <Stack spacing={2}>
                    {stats.map((stat, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          p: 2,
                          borderRadius: 2,
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: 'rgba(255, 255, 255, 0.1)',
                            transform: 'translateX(8px)'
                          }
                        }}
                      >
                        <Typography variant="h4" sx={{ mr: 2, fontWeight: 700 }}>
                          {stat.icon}
                        </Typography>
                        <Box>
                          <Typography variant="h5" fontWeight={700}>
                            {stat.value}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.8 }}>
                            {stat.label}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              </Zoom>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}>
          <Typography
            variant="h2"
            gutterBottom
            fontWeight={800}
            sx={{ 
              fontSize: { xs: '2rem', md: '3rem' },
              mb: 2
            }}
          >
            Why Choose{' '}
            <Box component="span" sx={{ 
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Our Platform
            </Box>
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ 
              maxWidth: '600px', 
              mx: 'auto',
              fontSize: { xs: '1rem', md: '1.25rem' }
            }}
          >
            Designed by developers, for developers. Everything you need to succeed in technical interviews.
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 3, md: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Grow in={mounted} timeout={500 + index * 200}>
                <Card
                  sx={{
                    height: '100%',
                    border: 'none',
                    borderRadius: 4,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-12px)',
                      boxShadow: `0 24px 48px ${alpha(feature.color, 0.15)}`,
                      borderLeft: `6px solid ${feature.color}`
                    },
                    cursor: 'pointer'
                  }}
                  onClick={() => router.push('/features')}
                >
                  <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: 3,
                        background: `linear-gradient(135deg, ${alpha(feature.color, 0.2)} 0%, ${alpha(feature.color, 0.05)} 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3
                      }}
                    >
                      {React.cloneElement(feature.icon, { 
                        sx: { 
                          fontSize: '1.75rem', 
                          color: feature.color 
                        } 
                      })}
                    </Box>
                    <Typography 
                      variant="h6" 
                      gutterBottom 
                      fontWeight={700}
                      sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Categories Section */}
      <Box sx={{ 
        py: { xs: 8, md: 12 },
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.default, 1)} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}>
            <Typography
              variant="h2"
              gutterBottom
              fontWeight={800}
              sx={{ 
                fontSize: { xs: '2rem', md: '3rem' },
                mb: 2
              }}
            >
              Explore{' '}
              <Box component="span" sx={{ 
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.info.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Categories
              </Box>
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ 
                maxWidth: '600px', 
                mx: 'auto',
                fontSize: { xs: '1rem', md: '1.25rem' }
              }}
            >
              Comprehensive coverage of all essential topics for Java Full Stack development
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {categories.map((cat, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Grow in={mounted} timeout={500 + index * 100}>
                  <Card
                    sx={{
                      height: '100%',
                      background: `linear-gradient(135deg, ${alpha(cat.color, 0.1)} 0%, ${alpha(cat.color, 0.05)} 100%)`,
                      border: `1px solid ${alpha(cat.color, 0.2)}`,
                      borderRadius: 3,
                      transition: 'all 0.4s ease',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      position: 'relative',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: `0 20px 40px ${alpha(cat.color, 0.15)}`,
                        '& .hover-content': {
                          transform: 'translateY(0)'
                        }
                      }
                    }}
                    onClick={() => router.push(`/questions?category=${cat.title}`)}
                  >
                    <Box sx={{ 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: `linear-gradient(90deg, ${cat.color}, ${alpha(cat.color, 0.5)})`
                    }} />
                    
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h2" sx={{ mr: 2, fontSize: '2.5rem' }}>
                          {cat.icon}
                        </Typography>
                        <Box>
                          <Typography variant="h5" fontWeight={700} sx={{ color: cat.color }}>
                            {cat.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {cat.desc}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                          Topics covered:
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                          {cat.topics.map((topic, i) => (
                            <Chip
                              key={i}
                              label={topic}
                              size="small"
                              sx={{ 
                                bgcolor: alpha(cat.color, 0.1),
                                color: cat.color,
                                fontWeight: 500,
                                '&:hover': {
                                  bgcolor: alpha(cat.color, 0.2)
                                }
                              }}
                            />
                          ))}
                        </Stack>
                      </Box>
                      
                      <Box 
                        className="hover-content"
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: alpha(cat.color, 0.9),
                          color: 'white',
                          transform: 'translateY(100%)',
                          transition: 'transform 0.3s ease',
                          p: 2,
                          textAlign: 'center'
                        }}
                      >
                        <Typography variant="body2" fontWeight={600}>
                          Explore Questions →
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials */}
      {!isMobile && (
        <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}>
            <Typography
              variant="h2"
              gutterBottom
              fontWeight={800}
              sx={{ 
                fontSize: { xs: '2rem', md: '3rem' },
                mb: 2
              }}
            >
              Loved by{' '}
              <Box component="span" sx={{ 
                background: `linear-gradient(45deg, ${theme.palette.success.main}, ${theme.palette.warning.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Developers
              </Box>
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
                    height: '100%',
                    position: 'relative',
                    '&::before': {
                      content: '"❝"',
                      position: 'absolute',
                      top: -20,
                      left: 20,
                      fontSize: '4rem',
                      color: alpha(theme.palette.primary.main, 0.1)
                    }
                  }}
                >
                  <Typography variant="body1" paragraph sx={{ fontStyle: 'italic', mb: 3 }}>
                    "{testimonial.text}"
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        mr: 2
                      }}
                    />
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      )}

      {/* Final CTA */}
      <Box sx={{ 
        py: { xs: 8, md: 12 },
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.9)} 0%, ${alpha(theme.palette.secondary.main, 0.9)} 100%)`,
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ 
            textAlign: 'center',
            maxWidth: '800px',
            mx: 'auto'
          }}>
            <Typography
              variant="h2"
              gutterBottom
              fontWeight={800}
              sx={{ 
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
                mb: 3
              }}
            >
              Ready to Transform Your{' '}
              <Box component="span" sx={{ 
                background: 'linear-gradient(45deg, #FFD700, #FF8C00)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline'
              }}>
                Interview Journey?
              </Box>
            </Typography>
            
            <Typography
              variant="h6"
              paragraph
              sx={{
                mb: 4,
                opacity: 0.95,
                fontSize: { xs: '1rem', sm: '1.25rem' },
                px: { xs: 2, sm: 0 }
              }}
            >
              Join 10,000+ developers who have successfully landed their dream jobs using our platform.
            </Typography>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
              sx={{ mb: 6 }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => router.push(isAuthenticated ? '/practice' : '/register')}
                endIcon={<RocketIcon />}
                sx={{
                  bgcolor: 'white',
                  color: theme.palette.primary.main,
                  px: { xs: 4, sm: 6 },
                  py: 1.5,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  fontWeight: 700,
                  borderRadius: 3,
                  '&:hover': {
                    bgcolor: 'grey.50',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 16px 32px rgba(0,0,0,0.2)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {isAuthenticated ? 'Start Practice Now' : 'Get Started For Free'}
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                onClick={() => router.push('/questions')}
                sx={{
                  borderColor: 'rgba(255,255,255,0.5)',
                  color: 'white',
                  px: { xs: 4, sm: 6 },
                  py: 1.5,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  fontWeight: 600,
                  borderRadius: 3,
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.15)',
                    transform: 'translateY(-3px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Browse All Questions
              </Button>
            </Stack>

            {/* Stats Footer */}
            <Grid container spacing={2} justifyContent="center">
              {stats.map((stat, index) => (
                <Grid item key={index}>
                  <Box sx={{ textAlign: 'center', px: 3 }}>
                    <Typography variant="h4" fontWeight={800}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {stat.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
        
        {/* Background Elements */}
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 50%)',
        }} />
      </Box>
    </Box>
  );
}