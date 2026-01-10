"use client";

import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Grid, Card, CardContent, Button, 
  Avatar, Paper, Chip, alpha, useTheme, useMediaQuery, LinearProgress, IconButton, Divider
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  Search, Add, MenuBook, TrendingUp, Bolt, ArrowForward, 
  BarChart, Timeline, LibraryBooks, Terminal, Code, 
  Commit, History, BugReport, PlayArrow, Storage
} from '@mui/icons-material';

// Mock API (Keep your existing mock)
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

  // 1. Stats Redesigned as "System Metrics"
  const statCards = [
    {
      title: 'BUFFER_SIZE', // Total Questions
      subtitle: 'Total Questions',
      value: stats.total,
      icon: <Storage />,
      color: theme.palette.primary.main,
      path: '/questions'
    },
    {
      title: 'PROCESSED', // Studied
      subtitle: 'Questions Solved',
      value: stats.studied,
      icon: <Code />,
      color: theme.palette.success.main,
      progress: (stats.studied / stats.total) * 100,
      path: '/progress'
    },
    {
      title: 'SUCCESS_RATE', // Accuracy
      subtitle: 'Accuracy',
      value: `${stats.accuracy}%`,
      icon: <BugReport />, // Using Bug icon for accuracy/debugging metaphor
      color: theme.palette.error.main, // Red/Pink for bugs/accuracy
      path: '/analytics'
    },
    {
      title: 'QUEUE', // Pending
      subtitle: 'Pending Review',
      value: stats.pending,
      icon: <History />,
      color: theme.palette.warning.main,
      path: '/pending'
    },
  ];

  // 2. Actions Redesigned as "Terminal Commands"
  const quickActions = [
    {
      cmd: 'npm run start:quiz',
      desc: 'Start a quick practice session',
      icon: <PlayArrow />,
      path: '/practice',
      color: theme.palette.success.main
    },
    {
      cmd: 'git checkout -b new-question',
      desc: 'Contribute a new question',
      icon: <Add />,
      path: '/add-question',
      color: theme.palette.info.main
    },
    {
      cmd: 'grep "search"',
      desc: 'Browse the question bank',
      icon: <Search />,
      path: '/questions',
      color: theme.palette.primary.main
    },
  ];

  // 3. Activity Redesigned as "Git Log"
  const recentActivity = [
    { hash: 'a1b2c3d', action: 'feat(hooks): completed React Hooks module', time: '2h ago', status: 'merged' },
    { hash: 'e5f6g7h', action: 'docs(sys-design): reviewed caching patterns', time: '1d ago', status: 'review' },
    { hash: 'i8j9k0l', action: 'chore: added new interview question', time: '2d ago', status: 'commit' },
  ];

  return (
    <ProtectedRoute>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', position: 'relative', overflow: 'hidden' }}>
        
        {/* Background Grid (Consistent with Home) */}
        <Box sx={{
          position: 'fixed', inset: 0, zIndex: 0, opacity: 0.3, pointerEvents: 'none',
          backgroundImage: `linear-gradient(${alpha(theme.palette.text.primary, 0.05)} 1px, transparent 1px), linear-gradient(90deg, ${alpha(theme.palette.text.primary, 0.05)} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />

        <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, md: 3 }, position: 'relative', zIndex: 1 }}>
          
          {/* Header - "Terminal Session" Look */}
          <Box sx={{ mb: 5, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ width: 56, height: 56, bgcolor: alpha(theme.palette.primary.main, 0.2), color: theme.palette.primary.main, border: `1px solid ${theme.palette.primary.main}` }}>
              {user?.username?.charAt(0) || 'U'}
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontFamily: 'monospace', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                <Box component="span" sx={{ color: theme.palette.primary.main, mr: 1 }}>root@</Box>
                {user?.username || 'developer'}:~
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                Last login: {new Date().toLocaleDateString()} on ttys001
              </Typography>
            </Box>
          </Box>

          {/* Stats Grid - "System Monitor" */}
          <Grid container spacing={3} sx={{ mb: 5 }}>
            {statCards.map((card, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  sx={{
                    p: 2.5,
                    height: '100%',
                    bgcolor: alpha(theme.palette.background.paper, 0.6),
                    backdropFilter: 'blur(10px)',
                    border: '1px solid',
                    borderColor: alpha(card.color, 0.3),
                    borderRadius: 2,
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 0 20px ${alpha(card.color, 0.2)}`
                    }
                  }}
                  onClick={() => router.push(card.path)}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="caption" sx={{ fontFamily: 'monospace', color: alpha(theme.palette.text.primary, 0.6), display: 'block' }}>
                        {card.title}
                      </Typography>
                      <Typography variant="h4" sx={{ fontFamily: 'monospace', fontWeight: 700, my: 0.5 }}>
                        {card.value}
                      </Typography>
                    </Box>
                    <Box sx={{ p: 1, borderRadius: 1, bgcolor: alpha(card.color, 0.1), color: card.color }}>
                      {card.icon}
                    </Box>
                  </Box>
                  
                  {/* Progress Bar / Decorator */}
                  {card.progress !== undefined ? (
                    <Box sx={{ mt: 2 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={card.progress} 
                        sx={{ 
                          height: 6, 
                          borderRadius: 3, 
                          bgcolor: alpha(card.color, 0.1),
                          '& .MuiLinearProgress-bar': { bgcolor: card.color }
                        }} 
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', fontFamily: 'monospace' }}>
                        {Math.round(card.progress)}% COMPLETED
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="caption" sx={{ color: card.color, fontFamily: 'monospace' }}>
                      ● ONLINE
                    </Typography>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={4}>
            {/* Main Column */}
            <Grid item xs={12} lg={8}>
              
              {/* Quick Actions - "Command Palette" */}
              <Typography variant="h6" sx={{ mb: 2, fontFamily: 'monospace', display: 'flex', alignItems: 'center' }}>
                <Terminal sx={{ mr: 1, fontSize: 20 }} /> Available Commands
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 5 }}>
                {quickActions.map((action, index) => (
                  <Grid item xs={12} key={index}>
                    <Paper
                      onClick={() => router.push(action.path)}
                      sx={{
                        p: 2,
                        bgcolor: alpha(theme.palette.background.paper, 0.4),
                        border: '1px solid',
                        borderColor: alpha(theme.palette.divider, 0.1),
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: alpha(action.color, 0.1),
                          borderColor: action.color,
                          '& .cmd-text': { color: action.color }
                        }
                      }}
                    >
                      <Box sx={{ mr: 2, color: 'text.secondary' }}>
                        <Typography variant="h6" sx={{ fontFamily: 'monospace', color: 'text.disabled' }}>$</Typography>
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography className="cmd-text" variant="body1" sx={{ fontFamily: 'monospace', fontWeight: 600, mb: 0.5 }}>
                          {action.cmd}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                          // {action.desc}
                        </Typography>
                      </Box>
                      <Box sx={{ color: 'text.disabled' }}>
                        <ArrowForward fontSize="small" />
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              {/* Activity Log - "Git Log" */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontFamily: 'monospace', display: 'flex', alignItems: 'center' }}>
                    <History sx={{ mr: 1, fontSize: 20 }} /> git log --oneline
                  </Typography>
                </Box>
                <Paper sx={{ 
                  bgcolor: '#0d1117', // Github dark bg style
                  border: '1px solid',
                  borderColor: alpha(theme.palette.divider, 0.2),
                  borderRadius: 2,
                  overflow: 'hidden',
                  fontFamily: 'monospace'
                }}>
                  {recentActivity.map((item, index) => (
                    <Box key={index} sx={{ 
                      p: 2, 
                      borderBottom: index !== recentActivity.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      gap: 2,
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' }
                    }}>
                      <Typography variant="caption" sx={{ color: theme.palette.warning.main, minWidth: 80 }}>
                        <Commit sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                        {item.hash}
                      </Typography>
                      
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ color: '#e6edf3', fontFamily: 'monospace' }}>
                          {item.action}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Chip 
                          label={item.status} 
                          size="small" 
                          sx={{ 
                            height: 20, 
                            fontSize: '0.7rem', 
                            fontFamily: 'monospace',
                            bgcolor: item.status === 'merged' ? alpha(theme.palette.success.main, 0.2) : alpha(theme.palette.info.main, 0.2),
                            color: item.status === 'merged' ? theme.palette.success.main : theme.palette.info.main,
                            border: '1px solid transparent'
                          }} 
                        />
                        <Typography variant="caption" sx={{ color: 'text.secondary', minWidth: 60, textAlign: 'right' }}>
                          {item.time}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Paper>
              </Box>
            </Grid>

            {/* Sidebar - "Documentation / Readme" */}
            <Grid item xs={12} lg={4}>
              <Paper sx={{ 
                p: 3, 
                borderRadius: 2, 
                bgcolor: alpha(theme.palette.background.paper, 0.6),
                backdropFilter: 'blur(10px)',
                border: '1px solid',
                borderColor: alpha(theme.palette.divider, 0.1)
              }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 3, fontFamily: 'monospace', display: 'flex', alignItems: 'center' }}>
                  <MenuBook sx={{ mr: 1 }} /> README.md
                </Typography>

                {/* Daily Streak */}
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                      CURRENT_STREAK
                    </Typography>
                    <Typography variant="caption" color="success.main" sx={{ fontFamily: 'monospace' }}>
                      7 DAYS
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {[...Array(7)].map((_, i) => (
                      <Box key={i} sx={{ 
                        flex: 1, 
                        height: 8, 
                        bgcolor: theme.palette.success.main, 
                        opacity: 0.4 + (i * 0.1), // Gradient effect
                        borderRadius: 1 
                      }} />
                    ))}
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Topics */}
                <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block', fontFamily: 'monospace' }}>
                  RECOMMENDED_MODULES
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {['React Hooks', 'System Design', 'Algorithms', 'Docker'].map((topic) => (
                    <Chip
                      key={topic}
                      label={topic}
                      size="small"
                      onClick={() => router.push(`/questions?topic=${topic}`)}
                      sx={{ 
                        fontFamily: 'monospace',
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        border: '1px solid transparent',
                        '&:hover': {
                          border: `1px solid ${theme.palette.primary.main}`
                        }
                      }}
                    />
                  ))}
                </Box>

                {/* Quote of the day style tip */}
                <Box sx={{ mt: 4, p: 2, bgcolor: alpha(theme.palette.info.main, 0.1), borderRadius: 2, borderLeft: `3px solid ${theme.palette.info.main}` }}>
                  <Typography variant="caption" sx={{ fontFamily: 'monospace', color: theme.palette.info.main }}>
                    // TODO:
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, fontSize: '0.85rem' }}>
                    "Consistency is key. Committing code daily builds a GitHub streak; solving problems daily builds a career."
                  </Typography>
                </Box>
              </Paper>
            </Grid>

          </Grid>
        </Container>
      </Box>
    </ProtectedRoute>
  );
}