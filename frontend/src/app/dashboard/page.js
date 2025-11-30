"use client";

import { Container, Typography, Box, Grid, Card, CardContent, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();

  const cards = [
    { title: '📖 Browse Questions', desc: 'Explore interview questions', path: '/questions' },
    { title: '➕ Add Question', desc: 'Contribute new questions', path: '/add-question' },
    { title: '👤 Profile', desc: `Logged in as ${user?.username}`, path: '#' },
  ];

  return (
    <ProtectedRoute>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" gutterBottom fontWeight={600}>
          Welcome, {user?.fullName || user?.username}!
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          What would you like to do today?
        </Typography>

        <Grid container spacing={4} sx={{ mt: 2 }}>
          {cards.map((card, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%', 
                  cursor: card.path !== '#' ? 'pointer' : 'default',
                  transition: 'transform 0.3s',
                  '&:hover': card.path !== '#' ? { transform: 'translateY(-8px)' } : {},
                }}
                onClick={() => card.path !== '#' && router.push(card.path)}
              >
                <CardContent>
                  <Typography variant="h4" gutterBottom>
                    {card.title.split(' ')[0]}
                  </Typography>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    {card.title.substring(card.title.indexOf(' ') + 1)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </ProtectedRoute>
  );
}