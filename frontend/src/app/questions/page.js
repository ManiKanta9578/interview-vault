"use client";

import { useState, useEffect } from 'react';
import {
  Container, Typography, Box, TextField, InputAdornment,
  Chip, Stack, Card, CardContent, Button,
  Collapse, CircularProgress, Alert, Fab, Paper,
  IconButton, Drawer, MenuItem, Select, FormControl,
  Tooltip, alpha, Grid, useTheme, useMediaQuery
} from '@mui/material';
import {
  Search, ExpandMore, Add, FilterList, Close,
  Bookmark, BookmarkBorder, Share, Edit,
  ViewList, ViewModule
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { questionsAPI } from '@/lib/api';
import ReactQuillViewer from '@/components/editor/ReactQuillViewer';
import { Skeleton } from '@mui/material';

const CATEGORIES = [
  { label: 'All', icon: '📚', count: 0 },
  { label: 'Core Java', icon: '☕', count: 45, color: '#FF6B6B' },
  { label: 'Collections', icon: '📦', count: 32, color: '#4ECDC4' },
  { label: 'Multithreading', icon: '⚡', count: 28, color: '#45B7D1' },
  { label: 'Spring Boot', icon: '🍃', count: 38, color: '#96CEB4' },
  { label: 'Microservices', icon: '🔧', count: 42, color: '#FFEAA7' },
  { label: 'Database & JPA', icon: '🗄️', count: 35, color: '#DDA0DD' },
  { label: 'Algorithms', icon: '💡', count: 52, color: '#FFA726' }
];

const DIFFICULTIES = [
  { label: 'All', count: 0 },
  { label: 'Easy', count: 85, color: '#4CAF50' },
  { label: 'Medium', count: 145, color: '#FF9800' },
  { label: 'Hard', count: 70, color: '#F44336' }
];

const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Oldest', value: 'oldest' },
  { label: 'Easy First', value: 'easy-first' },
  { label: 'Hard First', value: 'hard-first' },
  { label: 'Popular', value: 'popular' }
];

export default function QuestionsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const router = useRouter();
  const { user } = useAuth();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [sortBy, setSortBy] = useState('newest');
  const [bookmarked, setBookmarked] = useState([]);

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
      setError('Failed to load questions');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesCategory = selectedCategory === 'All' || q.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
    const matchesSearch = searchTerm === '' ||
      q.question.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesDifficulty && matchesSearch;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.lastReviewed) - new Date(a.lastReviewed);
      case 'oldest':
        return new Date(a.lastReviewed) - new Date(b.lastReviewed);
      case 'easy-first': {
        const order = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
        return (order[a.difficulty] || 0) - (order[b.difficulty] || 0);
      }
      case 'hard-first': {
        const order = { 'Easy': 3, 'Medium': 2, 'Hard': 1 };
        return (order[a.difficulty] || 0) - (order[b.difficulty] || 0);
      }
      default:
        return 0;
    }
  });

  const toggleBookmark = (id) => {
    setBookmarked(prev =>
      prev.includes(id) ? prev.filter(bookmarkId => bookmarkId !== id) : [...prev, id]
    );
  };

  const handleQuestionAction = (action, question) => {
    switch (action) {
      case 'edit':
        router.push(`/edit-question/${question.id}`);
        break;
      case 'share':
        navigator.clipboard.writeText(`${window.location.origin}/question/${question.id}`);
        break;
    }
  };

  const clearFilters = () => {
    setSelectedCategory('All');
    setSelectedDifficulty('All');
    setSearchTerm('');
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
          <Container maxWidth="xl" sx={{ py: 3, px: { xs: 2, md: 3 } }}>

            {/* Simplified header */}
            <Skeleton variant="rounded" height={48} sx={{ mb: 3, borderRadius: 2 }} />

            <Grid container spacing={2}>
              {[...Array(3)].map((_, i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <Card sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', width: '90vw' }}>
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ mb: 2 }}>
                        <Skeleton variant="text" sx={{ fontSize: '1rem', mb: 0.5 }} />
                        <Skeleton variant="text" sx={{ fontSize: '1rem', mb: 0.5 }} />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Skeleton variant="rounded" width={60} height={24} sx={{ borderRadius: 1.5 }} />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Skeleton variant="circular" width={32} height={32} />
                        <Skeleton variant="rounded" width={80} height={32} sx={{ borderRadius: 2 }} />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Container maxWidth="xl" sx={{ py: 3, px: { xs: 2, md: 3 } }}>

          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" fontWeight={600}>Questions</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton onClick={() => setFilterDrawerOpen(true)} size="small">
                <FilterList />
              </IconButton>
              <IconButton
                onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                size="small"
              >
                {viewMode === 'list' ? <ViewModule /> : <ViewList />}
              </IconButton>
            </Box>
          </Box>

          {/* Search Bar */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2, fontSize: '0.875rem' }
              }}
            />
          </Box>

          {/* Active Filters */}
          {(selectedCategory !== 'All' || selectedDifficulty !== 'All' || searchTerm) && (
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              {selectedCategory !== 'All' && (
                <Chip
                  label={`Cat: ${selectedCategory}`}
                  onDelete={() => setSelectedCategory('All')}
                  size="small"
                  deleteIcon={<Close fontSize="small" />}
                />
              )}
              {selectedDifficulty !== 'All' && (
                <Chip
                  label={`Diff: ${selectedDifficulty}`}
                  onDelete={() => setSelectedDifficulty('All')}
                  size="small"
                  deleteIcon={<Close fontSize="small" />}
                />
              )}
              {searchTerm && (
                <Chip
                  label={`Search: "${searchTerm.substring(0, 12)}${searchTerm.length > 12 ? '...' : ''}"`}
                  onDelete={() => setSearchTerm('')}
                  size="small"
                  deleteIcon={<Close fontSize="small" />}
                />
              )}
              <Button size="small" onClick={clearFilters}>
                Clear All
              </Button>
            </Box>
          )}

          {/* Results Count */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {filteredQuestions.length} of {questions.length} questions
          </Typography>

          {/* Questions Grid */}
          {filteredQuestions.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No questions found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Try adjusting your search or filters
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => router.push('/add-question')}
                size="small"
              >
                Add Question
              </Button>
            </Paper>
          ) : viewMode === 'grid' ? (
            <Grid container spacing={2}>
              {filteredQuestions.map((question) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={question.id}>
                  <QuestionCard
                    question={question}
                    expandedId={expandedId}
                    setExpandedId={setExpandedId}
                    isBookmarked={bookmarked.includes(question.id)}
                    toggleBookmark={toggleBookmark}
                    onAction={handleQuestionAction}
                    isMobile={isMobile}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Stack spacing={1.5}>
              {filteredQuestions.map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  expandedId={expandedId}
                  setExpandedId={setExpandedId}
                  isBookmarked={bookmarked.includes(question.id)}
                  toggleBookmark={toggleBookmark}
                  onAction={handleQuestionAction}
                  isMobile={isMobile}
                />
              ))}
            </Stack>
          )}
        </Container>

        {/* Filter Drawer */}
        <Drawer
          anchor="right"
          open={filterDrawerOpen}
          onClose={() => setFilterDrawerOpen(false)}
          PaperProps={{
            sx: {
              width: { xs: '100%', sm: 320 },
              p: 2,
              borderTopLeftRadius: { xs: 0, sm: 8 },
              borderBottomLeftRadius: { xs: 0, sm: 8 }
            }
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Filters</Typography>
            <IconButton onClick={() => setFilterDrawerOpen(false)} size="small">
              <Close />
            </IconButton>
          </Box>

          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                Category
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {CATEGORIES.slice(0, 6).map((category) => (
                  <Chip
                    key={category.label}
                    label={category.label}
                    onClick={() => setSelectedCategory(category.label)}
                    size="small"
                    sx={{
                      mb: 0.5,
                      bgcolor: selectedCategory === category.label
                        ? alpha(category.color || theme.palette.primary.main, 0.1) : undefined,
                      border: `1px solid ${selectedCategory === category.label
                        ? category.color || theme.palette.primary.main
                        : theme.palette.divider}`,
                    }}
                  />
                ))}
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                Difficulty
              </Typography>
              <Stack spacing={0.5}>
                {DIFFICULTIES.map((diff) => (
                  <Button
                    key={diff.label}
                    fullWidth
                    variant={selectedDifficulty === diff.label ? "contained" : "outlined"}
                    onClick={() => setSelectedDifficulty(diff.label)}
                    size="small"
                    sx={{ justifyContent: 'space-between', borderRadius: 1 }}
                  >
                    {diff.label}
                    {diff.count > 0 && (
                      <Typography variant="caption">
                        {diff.count}
                      </Typography>
                    )}
                  </Button>
                ))}
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                Sort By
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  sx={{ borderRadius: 1 }}
                >
                  {SORT_OPTIONS.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Button
              variant="contained"
              fullWidth
              onClick={() => setFilterDrawerOpen(false)}
              sx={{ mt: 1 }}
            >
              Apply Filters
            </Button>
          </Stack>
        </Drawer>

        {/* Add Button */}
        <Fab
          color="primary"
          onClick={() => router.push('/add-question')}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1000,
          }}
          size="medium"
        >
          <Add />
        </Fab>
      </Box>
    </ProtectedRoute>
  );
}

function QuestionCard({ question, expandedId, setExpandedId, isBookmarked, toggleBookmark, onAction, isMobile }) {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        transition: 'all 0.2s',
        '&:hover': {
          borderColor: alpha(theme.palette.primary.main, 0.3),
        }
      }}
    >
      <CardContent sx={{ p: 1.5 }}>
        {/* Question */}
        <Typography
          variant="body1"
          sx={{
            fontWeight: 500,
            lineHeight: 1.4,
            mb: 1.5,
            fontSize: '0.9rem',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {question.question}
        </Typography>

        {/* Footer */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={question.difficulty}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.7rem',
                borderRadius: 1,
                bgcolor: alpha(getDifficultyColor(question.difficulty), 0.1),
                color: getDifficultyColor(question.difficulty),
              }}
            />
            {!isMobile && (
              <Typography variant="caption" color="text.secondary">
                {question.category}
              </Typography>
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Tooltip title={isBookmarked ? "Remove bookmark" : "Bookmark"}>
              <IconButton
                size="small"
                onClick={() => toggleBookmark(question.id)}
                sx={{ p: 0.25 }}
              >
                {isBookmarked ?
                  <Bookmark fontSize="small" /> :
                  <BookmarkBorder fontSize="small" />
                }
              </IconButton>
            </Tooltip>

            <Button
              size="small"
              variant="outlined"
              onClick={() => setExpandedId(expandedId === question.id ? null : question.id)}
              endIcon={
                <ExpandMore sx={{
                  transform: expandedId === question.id ? 'rotate(180deg)' : 'none',
                  transition: '0.2s',
                  fontSize: '0.9rem'
                }} />
              }
              sx={{
                borderRadius: 1,
                textTransform: 'none',
                px: 1.5,
                py: 0.25,
                minWidth: 'auto',
                fontSize: '0.75rem'
              }}
            >
              {expandedId === question.id ? 'Hide' : 'Show'}
            </Button>
          </Box>
        </Box>
      </CardContent>

      {/* Answer */}
      <Collapse in={expandedId === question.id} timeout="auto" unmountOnExit>
        <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}` }}>
          <ReactQuillViewer value={question.answer} elevation={0} showBorder={false} />
        </Box>
      </Collapse>
    </Card>
  );
}

function getDifficultyColor(difficulty) {
  switch (difficulty) {
    case 'Easy': return '#4CAF50';
    case 'Medium': return '#FF9800';
    case 'Hard': return '#F44336';
    default: return '#666';
  }
}