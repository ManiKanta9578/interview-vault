"use client";

import { Container, Typography, Box, Grid, Card, CardContent, Button, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await questionsAPI.getAll();
      setStats({ total: response.data.length });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { 
      title: '📖 Browse Questions', 
      desc: `View your ${stats.total} questions`, 
      path: '/questions',
      stat: stats.total
    },
    { 
      title: '➕ Add Question', 
      desc: 'Contribute new questions', 
      path: '/add-question' 
    },
    { 
      title: '👤 Profile', 
      desc: `Logged in as ${user?.username}`, 
      path: '#' 
    },
  ];

  return (
    <ProtectedRoute>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" gutterBottom fontWeight={600}>
          Welcome back, {user?.fullName || user?.username}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Your personal interview preparation dashboard
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {cards.map((card, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    cursor: card.path !== '#' ? 'pointer' : 'default',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': card.path !== '#' ? { 
                      transform: 'translateY(-8px)',
                      boxShadow: 6
                    } : {},
                  }}
                  onClick={() => card.path !== '#' && router.push(card.path)}
                >
                  <CardContent>
                    <Typography variant="h2" gutterBottom>
                      {card.title.split(' ')[0]}
                    </Typography>
                    <Typography variant="h5" gutterBottom fontWeight={600}>
                      {card.title.substring(card.title.indexOf(' ') + 1)}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {card.desc}
                    </Typography>
                    {card.stat !== undefined && (
                      <Typography variant="h3" color="primary" sx={{ mt: 2 }}>
                        {card.stat}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </ProtectedRoute>
  );
}