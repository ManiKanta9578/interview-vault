"use client";

import { Container, Typography, Box, Button, Grid, Card, CardContent, Chip } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const features = [
    { icon: '📚', title: 'Comprehensive Library', desc: 'Access hundreds of interview questions' },
    { icon: '💻', title: 'Code Examples', desc: 'Learn with practical code snippets' },
    { icon: '🎯', title: 'Difficulty Levels', desc: 'Questions categorized by difficulty' },
    { icon: '🔍', title: 'Smart Search', desc: 'Find questions quickly' },
  ];

  const categories = [
    { title: 'Core Java', color: '#f44336', icon: '☕' },
    { title: 'Spring Boot', color: '#4caf50', icon: '🍃' },
    { title: 'Microservices', color: '#2196f3', icon: '🔧' },
    { title: 'Algorithms', color: '#9c27b0', icon: '💡' },
  ];

  return (
    <Box sx={{ bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 12,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h1" gutterBottom sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
              Interview Questions Bank
            </Typography>
            <Typography variant="h5" paragraph sx={{ mb: 4, opacity: 0.9 }}>
              Your comprehensive platform to prepare for Java Full Stack interviews
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              {isAuthenticated ? (
                <>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => router.push('/dashboard')}
                    sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => router.push('/questions')}
                    sx={{ borderColor: 'white', color: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
                  >
                    Browse Questions
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => router.push('/register')}
                    sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
                  >
                    Get Started Free
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => router.push('/questions')}
                    sx={{ borderColor: 'white', color: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
                  >
                    Browse Questions
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item size={{ xs: 12, md:3 ,sm: 6 }} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent>
                  <Typography variant="h2" sx={{ mb: 2 }}>{feature.icon}</Typography>
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
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" textAlign="center" gutterBottom fontWeight={600}>
          Question Categories
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {categories.map((cat, index) => (
            <Grid item size={{ xs: 12, md:3 ,sm: 6 }} key={index}>
              <Card
                sx={{
                  background: `linear-gradient(135deg, ${cat.color} 0%, ${cat.color}dd 100%)`,
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'translateY(-8px)' },
                }}
              >
                <CardContent>
                  <Typography variant="h2" sx={{ mb: 2 }}>{cat.icon}</Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {cat.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Stats */}
      <Box sx={{ bgcolor: 'white', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} textAlign="center">
            <Grid item size={{ xs: 12, md:4 }}>
              <Typography variant="h2" color="primary" fontWeight={700}>500+</Typography>
              <Typography variant="h6" color="text.secondary">Interview Questions</Typography>
            </Grid>
            <Grid item size={{ xs: 12, md:4  }}>
              <Typography variant="h2" color="primary" fontWeight={700}>10+</Typography>
              <Typography variant="h6" color="text.secondary">Categories</Typography>
            </Grid>
            <Grid item size={{ xs: 12, md:4}}>
              <Typography variant="h2" color="primary" fontWeight={700}>100%</Typography>
              <Typography variant="h6" color="text.secondary">Free Access</Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA */}
      {!isAuthenticated && (
        <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8 }}>
          <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
            <Typography variant="h3" gutterBottom fontWeight={600}>
              Ready to Ace Your Interview?
            </Typography>
            <Typography variant="h6" paragraph sx={{ mb: 4 }}>
              Join thousands of developers preparing for their dream job
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push('/register')}
              sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
            >
              Sign Up Now - It's Free!
            </Button>
          </Container>
        </Box>
      )}
    </Box>
  );
}