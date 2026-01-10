"use client";

import React from 'react';
import { 
  Container, Typography, Box, Grid, Card, CardContent, Button, 
  Avatar, Paper, Chip, alpha 
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
  TrendingUp as TrendingUpIcon,
  Bolt as BoltIcon,
  ArrowForward as ArrowForwardIcon,
  BarChart as BarChartIcon,
  Timeline as TimelineIcon,
  LibraryBooks as LibraryBooksIcon
} from '@mui/icons-material';

// Mock API
const questionsAPI = {
  getAll: async () => ({
    data: Array.from({ length: 245 }, (_, i) => ({ id: i + 1 }))
  })
};

export default function DashboardPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState({ 
    total: 0,
    studied: 45,
    pending: 200,
    accuracy: 78
  });
  const [loading, setLoading] = useState(true);

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
      path: '/questions'
    },
    {
      title: 'Studied',
      value: stats.studied,
      icon: <MenuBookIcon />,
      color: theme.palette.success.main,
      progress: (stats.studied / stats.total) * 100,
      path: '/progress'
    },
    {
      title: 'Accuracy',
      value: `${stats.accuracy}%`,
      icon: <TrendingUpIcon />,
      color: theme.palette.info.main,
      path: '/analytics'
    },
    {
      title: 'Pending',
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

  const recentActivity = [
    { action: 'Completed', topic: 'React Hooks', time: '2h ago' },
    { action: 'Reviewed', topic: 'System Design', time: '1d ago' },
    { action: 'Added', topic: 'New Question', time: '2d ago' },
  ];

  return (
    <ProtectedRoute>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Container maxWidth="xl" sx={{ py: { xs: 3, md: 4 }, px: { xs: 2, md: 3 } }}>
          
          {/* Header */}
          <Box sx={{ mb: 4 }}>
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
                  fontSize: { xs: '1.5rem', sm: '2rem' },
                  fontWeight: 700,
                  mb: 1
                }}>
                  Welcome back, {user?.fullName?.split(' ')[0] || user?.username}! 👋
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Continue your interview prep journey
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: theme.palette.primary.main
                  }}
                >
                  {user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                </Avatar>
                {!isMobile && (
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      {user?.fullName || user?.username}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {statCards.map((card, index) => (
                <Grid item xs={6} sm={3} key={index}>
                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: alpha(card.color, 0.3),
                      }
                    }}
                    onClick={() => router.push(card.path)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <Box sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 1.5,
                        bgcolor: alpha(card.color, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 1.5
                      }}>
                        {React.cloneElement(card.icon, { sx: { color: card.color, fontSize: '1.2rem' } })}
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {card.title}
                      </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontSize: '1.5rem', fontWeight: 700, mb: 1 }}>
                      {card.value}
                    </Typography>
                    {card.progress && (
                      <Box sx={{ mt: 1 }}>
                        <Box sx={{
                          width: '100%',
                          height: 4,
                          bgcolor: alpha(card.color, 0.1),
                          borderRadius: 2,
                          overflow: 'hidden'
                        }}>
                          <Box sx={{
                            width: `${card.progress}%`,
                            height: '100%',
                            bgcolor: card.color,
                            borderRadius: 2
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
            {/* Left Column */}
            <Grid item xs={12} lg={8}>
              {/* Quick Actions */}
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Quick Actions
              </Typography>
              <Grid container spacing={2} sx={{ mb: 4 }}>
                {quickActions.map((action, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Card
                      sx={{
                        height: '100%',
                        borderRadius: 2,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        '&:hover': {
                          borderColor: alpha(action.color, 0.3),
                          transform: 'translateY(-2px)',
                        }
                      }}
                      onClick={() => router.push(action.path)}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Box sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 1.5,
                            bgcolor: alpha(action.color, 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 1.5
                          }}>
                            {React.cloneElement(action.icon, { 
                              sx: { color: action.color, fontSize: '1.2rem' } 
                            })}
                          </Box>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {action.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {action.description}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Recent Activity */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Recent Activity
                  </Typography>
                  <Button size="small" sx={{ textTransform: 'none' }}>
                    View All
                  </Button>
                </Box>
                <Paper sx={{ borderRadius: 2 }}>
                  {recentActivity.map((activity, index) => (
                    <Box
                      key={index}
                      sx={{
                        p: 2,
                        borderBottom: index < recentActivity.length - 1 
                          ? `1px solid ${alpha(theme.palette.divider, 0.1)}` 
                          : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.02)
                        }
                      }}
                    >
                      <Box sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2
                      }}>
                        {activity.action === 'Completed' ? (
                          <TrendingUpIcon sx={{ fontSize: '1rem', color: theme.palette.success.main }} />
                        ) : (
                          <MenuBookIcon sx={{ fontSize: '1rem', color: theme.palette.primary.main }} />
                        )}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" fontWeight={500}>
                          {activity.action} - {activity.topic}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {activity.time}
                        </Typography>
                      </Box>
                      <Chip 
                        label={activity.action} 
                        size="small"
                        color={activity.action === 'Completed' ? 'success' : 'primary'}
                        variant="outlined"
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                    </Box>
                  ))}
                </Paper>
              </Box>
            </Grid>

            {/* Sidebar */}
            <Grid item xs={12} lg={4}>
              <Box sx={{ position: 'sticky', top: 24 }}>
                {/* Study Tips */}
                <Paper sx={{ p: 2, borderRadius: 2, mb: 3 }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <BarChartIcon sx={{ fontSize: '1.2rem' }} /> Study Tips
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
                      Daily Goal
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ flex: 1, height: 6, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 3 }}>
                        <Box sx={{ width: '65%', height: '100%', bgcolor: theme.palette.primary.main, borderRadius: 3 }} />
                      </Box>
                      <Typography variant="caption" fontWeight={500}>13/20</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" fontWeight={500} sx={{ mb: 1, display: 'block' }}>
                      Recommended Topics
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {['React Hooks', 'System Design', 'Algorithms'].map((topic) => (
                        <Chip
                          key={topic}
                          label={topic}
                          size="small"
                          variant="outlined"
                          onClick={() => router.push(`/questions?topic=${topic}`)}
                          sx={{ fontSize: '0.7rem' }}
                        />
                      ))}
                    </Box>
                  </Box>

                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Box sx={{ p: 1.5, borderRadius: 1.5, bgcolor: alpha(theme.palette.success.main, 0.05) }}>
                        <Typography variant="caption" color="text.secondary">
                          Streak
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          7 days
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ p: 1.5, borderRadius: 1.5, bgcolor: alpha(theme.palette.warning.main, 0.05) }}>
                        <Typography variant="caption" color="text.secondary">
                          Avg. Time
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          24 min
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Start Practice */}
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<BoltIcon />}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 600,
                  }}
                  onClick={() => router.push('/practice')}
                >
                  Start Practice
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ProtectedRoute>
  );
}