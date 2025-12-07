"use client";

import React from 'react';
import { 
  Container, Typography, Box, Grid, Card, CardContent, Button, 
  CircularProgress, Avatar, Paper, Chip, IconButton, alpha 
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useState, useEffect } from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  MenuBook as MenuBookIcon,
  Person as PersonIcon,
  TrendingUp as TrendingUpIcon,
  Bolt as BoltIcon,
  ArrowForward as ArrowForwardIcon,
  BarChart as BarChartIcon,
  Timeline as TimelineIcon,
  LibraryBooks as LibraryBooksIcon
} from '@mui/icons-material';

// Mock API - replace with your actual API
const questionsAPI = {
  getAll: async () => ({
    data: Array.from({ length: 245 }, (_, i) => ({ id: i + 1 }))
  })
};

export default function DashboardPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState({ 
    total: 0,
    studied: 45,
    pending: 200,
    accuracy: 78
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([
    { action: 'Completed', topic: 'React Hooks', time: '2 hours ago' },
    { action: 'Reviewed', topic: 'System Design', time: '1 day ago' },
    { action: 'Added', topic: 'New Question', time: '2 days ago' },
  ]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await questionsAPI.getAll();
      setStats(prev => ({ 
        ...prev, 
        total: response.data.length,
        pending: response.data.length - prev.studied
      }));
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Questions',
      value: stats.total,
      icon: <LibraryBooksIcon />,
      color: theme.palette.primary.main,
      change: '+12%',
      path: '/questions'
    },
    {
      title: 'Questions Studied',
      value: stats.studied,
      icon: <MenuBookIcon />,
      color: theme.palette.success.main,
      progress: (stats.studied / stats.total) * 100,
      path: '/progress'
    },
    {
      title: 'Accuracy Rate',
      value: `${stats.accuracy}%`,
      icon: <TrendingUpIcon />,
      color: theme.palette.info.main,
      change: '+5%',
      path: '/analytics'
    },
    {
      title: 'Pending Review',
      value: stats.pending,
      icon: <BoltIcon />,
      color: theme.palette.warning.main,
      path: '/pending'
    },
  ];

  const quickActions = [
    {
      title: 'Browse Questions',
      description: 'Explore question bank',
      icon: <SearchIcon />,
      path: '/questions',
      color: theme.palette.primary.main
    },
    {
      title: 'Add Question',
      description: 'Contribute new content',
      icon: <AddIcon />,
      path: '/add-question',
      color: theme.palette.success.main
    },
    {
      title: 'Practice Now',
      description: 'Quick quiz session',
      icon: <BoltIcon />,
      path: '/practice',
      color: theme.palette.warning.main
    },
    {
      title: 'View Progress',
      description: 'Track your learning',
      icon: <TimelineIcon />,
      path: '/progress',
      color: theme.palette.info.main
    },
  ];

  return (
    <ProtectedRoute>
      <Box sx={{ 
        minHeight: '100vh',
        background: isMobile 
          ? theme.palette.background.default 
          : `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.05)} 0%, ${alpha(theme.palette.background.default, 1)} 100%)`,
      }}>
        <Container maxWidth="xl" sx={{ py: { xs: 3, sm: 4, md: 5 }, px: { xs: 2, sm: 3, md: 4 } }}>
          {/* Header Section */}
          <Box sx={{ mb: { xs: 4, sm: 5, md: 6 } }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' }, 
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 2,
              mb: 3
            }}>
              <Box>
                <Typography variant="h1" sx={{ 
                  fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
                  fontWeight: 800,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1
                }}>
                  Welcome back, {user?.fullName?.split(' ')[0] || user?.username}! 👋
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{ 
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  maxWidth: '600px'
                }}>
                  Your personalized learning dashboard • Track progress and continue your interview prep journey
                </Typography>
              </Box>
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                flexShrink: 0
              }}>
                <Avatar
                  sx={{
                    width: { xs: 48, sm: 56 },
                    height: { xs: 48, sm: 56 },
                    bgcolor: theme.palette.primary.main,
                    fontSize: { xs: '1.25rem', sm: '1.5rem' }
                  }}
                >
                  {user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                </Avatar>
                {!isMobile && (
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {user?.fullName || user?.username}
                    </Typography>
                    <Chip 
                      label="Premium Member" 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                  </Box>
                )}
              </Box>
            </Box>

            {/* Stats Summary */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {statCards.slice(0, isMobile ? 2 : isTablet ? 3 : 4).map((card, index) => (
                <Grid item xs={6} sm={6} md={3} key={index}>
                  <Paper
                    sx={{
                      p: { xs: 2, sm: 3 },
                      borderRadius: 3,
                      background: `linear-gradient(135deg, ${alpha(card.color, 0.1)} 0%, ${alpha(card.color, 0.05)} 100%)`,
                      border: `1px solid ${alpha(card.color, 0.2)}`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: `0 12px 24px ${alpha(card.color, 0.15)}`,
                      },
                      height: '100%',
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onClick={() => router.push(card.path)}
                  >
                    <Box sx={{ 
                      position: 'absolute',
                      top: -10,
                      right: -10,
                      opacity: 0.1,
                      fontSize: '4rem'
                    }}>
                      {card.icon}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: alpha(card.color, 0.2),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2
                      }}>
                        {React.cloneElement(card.icon, { sx: { color: card.color, fontSize: '1.25rem' } })}
                      </Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        {card.title}
                      </Typography>
                    </Box>
                    <Typography variant="h3" sx={{ 
                      fontSize: { xs: '1.75rem', sm: '2rem' },
                      fontWeight: 800,
                      mb: 1
                    }}>
                      {card.value}
                    </Typography>
                    {card.change && (
                      <Chip
                        label={card.change}
                        size="small"
                        sx={{
                          bgcolor: alpha(theme.palette.success.main, 0.1),
                          color: theme.palette.success.main,
                          fontWeight: 600,
                          fontSize: '0.75rem'
                        }}
                      />
                    )}
                    {card.progress && (
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            Progress
                          </Typography>
                          <Typography variant="caption" fontWeight={600}>
                            {Math.round(card.progress)}%
                          </Typography>
                        </Box>
                        <Box sx={{
                          width: '100%',
                          height: 6,
                          bgcolor: alpha(card.color, 0.1),
                          borderRadius: 3,
                          overflow: 'hidden'
                        }}>
                          <Box sx={{
                            width: `${card.progress}%`,
                            height: '100%',
                            bgcolor: card.color,
                            borderRadius: 3
                          }} />
                        </Box>
                      </Box>
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Main Content */}
          <Grid container spacing={3}>
            {/* Quick Actions */}
            <Grid item xs={12} lg={8}>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 3, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                {quickActions.map((action, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Card
                      sx={{
                        height: '100%',
                        borderRadius: 3,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        background: `linear-gradient(135deg, ${alpha(action.color, 0.05)} 0%, ${alpha(action.color, 0.02)} 100%)`,
                        border: `1px solid ${alpha(action.color, 0.1)}`,
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: `0 12px 24px ${alpha(action.color, 0.15)}`,
                          borderColor: alpha(action.color, 0.3),
                        },
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      onClick={() => router.push(action.path)}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Box sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            bgcolor: alpha(action.color, 0.2),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 2
                          }}>
                            {React.cloneElement(action.icon, { 
                              sx: { 
                                color: action.color, 
                                fontSize: '1.5rem' 
                              } 
                            })}
                          </Box>
                          <Box>
                            <Typography variant="h6" fontWeight={700}>
                              {action.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {action.description}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mt: 2 
                        }}>
                          <Button
                            endIcon={<ArrowForwardIcon />}
                            sx={{
                              textTransform: 'none',
                              fontWeight: 600,
                              color: action.color
                            }}
                          >
                            Go to {action.title.split(' ')[0]}
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Recent Activity */}
              <Box sx={{ mt: 5 }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3 
                }}>
                  <Typography variant="h5" fontWeight={700} sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                    Recent Activity
                  </Typography>
                  <Button variant="text" sx={{ textTransform: 'none', fontWeight: 600 }}>
                    View All
                  </Button>
                </Box>
                <Paper sx={{ 
                  borderRadius: 3,
                  overflow: 'hidden',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                }}>
                  {recentActivity.map((activity, index) => (
                    <Box
                      key={index}
                      sx={{
                        p: 3,
                        borderBottom: index < recentActivity.length - 1 
                          ? `1px solid ${alpha(theme.palette.divider, 0.1)}` 
                          : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.02)
                        }
                      }}
                    >
                      <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 3
                      }}>
                        <PersonIcon sx={{ color: theme.palette.primary.main }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {activity.action} - {activity.topic}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {activity.time}
                        </Typography>
                      </Box>
                      <Chip 
                        label={activity.action} 
                        size="small"
                        color={activity.action === 'Completed' ? 'success' : 'primary'}
                        variant="outlined"
                      />
                    </Box>
                  ))}
                </Paper>
              </Box>
            </Grid>

            {/* Sidebar - Study Tips */}
            <Grid item xs={12} lg={4}>
              <Box sx={{ position: 'sticky', top: 24 }}>
                <Paper sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.05)} 0%, ${alpha(theme.palette.background.paper, 1)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`
                }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BarChartIcon color="info" /> Study Tips
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Daily Goal Progress
                    </Typography>
                    <Box sx={{ 
                      width: '100%', 
                      height: 8, 
                      bgcolor: alpha(theme.palette.info.main, 0.1),
                      borderRadius: 4,
                      overflow: 'hidden',
                      mb: 1
                    }}>
                      <Box sx={{ 
                        width: '65%', 
                        height: '100%', 
                        bgcolor: theme.palette.info.main,
                        borderRadius: 4
                      }} />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      13/20 questions completed today
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                      Recommended Topics
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {['React Hooks', 'System Design', 'Algorithms', 'Database', 'Node.js'].map((topic) => (
                        <Chip
                          key={topic}
                          label={topic}
                          size="small"
                          variant="outlined"
                          onClick={() => router.push(`/questions?topic=${topic}`)}
                          sx={{ cursor: 'pointer' }}
                        />
                      ))}
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                      Quick Stats
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Box sx={{ 
                          p: 2, 
                          borderRadius: 2, 
                          bgcolor: alpha(theme.palette.success.main, 0.05),
                          border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`
                        }}>
                          <Typography variant="caption" color="text.secondary">
                            Streak
                          </Typography>
                          <Typography variant="h6" fontWeight={700}>
                            7 days 🔥
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ 
                          p: 2, 
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.warning.main, 0.05),
                          border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`
                        }}>
                          <Typography variant="caption" color="text.secondary">
                            Avg. Time
                          </Typography>
                          <Typography variant="h6" fontWeight={700}>
                            24 min
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>

                {/* Start Practice Button */}
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<BoltIcon />}
                  sx={{
                    mt: 3,
                    py: 1.5,
                    borderRadius: 3,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    fontWeight: 700,
                    fontSize: '1rem',
                    boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.4)}`,
                    },
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => router.push('/practice')}
                >
                  Start Practice Session
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ProtectedRoute>
  );
}