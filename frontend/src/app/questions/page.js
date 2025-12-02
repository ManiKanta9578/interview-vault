"use client";

import { useState, useEffect } from 'react';
import {
  Container, Typography, Box, TextField, InputAdornment,
  Chip, Stack, Card, CardContent, CardActions, Button,
  Collapse, CircularProgress, Alert, Fab, Paper
} from '@mui/material';
import { Search, ExpandMore, Add, Person } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import RichContentViewer from '@/components/editor/RichContentViewer';
import ProtectedRoute from '@/components/ProtectedRoute';
import { questionsAPI } from '@/lib/api';
import UnifiedViewer from '@/components/editor/UnifiedViewer';

const CATEGORIES = [
  'All', 'Core Java', 'Collections', 'Multithreading',
  'Spring Boot', 'Microservices', 'Database & JPA', 'Algorithms'
];

const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];

export default function QuestionsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await questionsAPI.getAll();
      setQuestions(response.data);
    } catch (err) {
      setError('Failed to load questions. Please try again.');
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesCategory = selectedCategory === 'All' || q.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
    const matchesSearch = searchTerm === '' ||
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.tags && q.tags.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'success';
      case 'Medium': return 'warning';
      case 'Hard': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  return (
    <ProtectedRoute>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* User Info Banner */}
        <Paper elevation={2} sx={{ p: 3, mb: 4, bgcolor: 'primary.main', color: 'white' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Person sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h5" fontWeight={600}>
                My Questions
              </Typography>
              <Typography variant="body2">
                Logged in as: {user?.username} | Total Questions: {questions.length}
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" gutterBottom fontWeight={700}>
            Your Interview Questions
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and review your personal collection of {questions.length} interview questions
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Filters */}
        <Box component={Card} elevation={2} sx={{ p: 3, mb: 4 }}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              placeholder="Search your questions, answers, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />

            <Box>
              <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                Category
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {CATEGORIES.map((cat) => (
                  <Chip
                    key={cat}
                    label={cat}
                    onClick={() => setSelectedCategory(cat)}
                    color={selectedCategory === cat ? 'primary' : 'default'}
                    variant={selectedCategory === cat ? 'filled' : 'outlined'}
                    sx={{ mb: 1 }}
                  />
                ))}
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                Difficulty
              </Typography>
              <Stack direction="row" spacing={1}>
                {DIFFICULTIES.map((diff) => (
                  <Chip
                    key={diff}
                    label={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    color={selectedDifficulty === diff ? 'secondary' : 'default'}
                    variant={selectedDifficulty === diff ? 'filled' : 'outlined'}
                  />
                ))}
              </Stack>
            </Box>
          </Stack>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Showing {filteredQuestions.length} of {questions.length} questions
        </Typography>

        {/* Empty State */}
        {questions.length === 0 ? (
          <Card elevation={1} sx={{ p: 8, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>📝</Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No questions yet
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Start building your personal interview question collection!
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push('/add-question')}
              sx={{ mt: 2 }}
            >
              Add Your First Question
            </Button>
          </Card>
        ) : filteredQuestions.length === 0 ? (
          <Card elevation={1} sx={{ p: 8, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No questions match your filters
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your filters or search terms
            </Typography>
          </Card>
        ) : (
          <Stack spacing={3}>
            {filteredQuestions.map((question) => (
              <Card key={question.id} elevation={2}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Typography variant="h6" sx={{ flex: 1, pr: 2 }}>
                      {question.question}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Chip label={question.category} size="small" color="primary" variant="outlined" />
                      <Chip
                        label={question.difficulty}
                        size="small"
                        color={getDifficultyColor(question.difficulty)}
                      />
                    </Stack>
                  </Box>

                  {question.tags && (
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap" useFlexGap>
                      {question.tags.split(',').map((tag, index) => (
                        <Chip key={index} label={`#${tag.trim()}`} size="small" variant="outlined" />
                      ))}
                    </Stack>
                  )}

                  <Collapse in={expandedId === question.id} timeout="auto" unmountOnExit>
                    <Box sx={{ mt: 3, pt: 3, borderTop: 1, borderColor: 'divider' }}>
                      <UnifiedViewer content={question.answer} />
                    </Box>
                  </Collapse>
                </CardContent>

                <CardActions>
                  <Button
                    onClick={() => setExpandedId(expandedId === question.id ? null : question.id)}
                    endIcon={
                      <ExpandMore
                        sx={{
                          transform: expandedId === question.id ? 'rotate(180deg)' : 'none',
                          transition: '0.3s'
                        }}
                      />
                    }
                  >
                    {expandedId === question.id ? 'Hide Answer' : 'Show Answer'}
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Stack>
        )}

        {/* Floating Add Button */}
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: 'fixed', bottom: 32, right: 32 }}
          onClick={() => router.push('/add-question')}
        >
          <Add />
        </Fab>
      </Container>
    </ProtectedRoute>
  );
}