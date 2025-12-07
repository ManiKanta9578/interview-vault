"use client";

import { useState, useEffect } from 'react';
import {
  Container, Typography, Box, TextField, InputAdornment,
  Chip, Stack, Card, CardContent, CardActions, Button,
  Collapse, CircularProgress, Alert, Fab, Paper,
  IconButton, Drawer, MenuItem, Select, FormControl, InputLabel,
  Tooltip, alpha, Badge, AvatarGroup, Avatar,
  Grid
} from '@mui/material';
import {
  Search, ExpandMore, Add, Person, FilterList, Close,
  Lightbulb, Code, TrendingUp, Bookmark, BookmarkBorder,
  Share, Edit, Delete, Sort, ViewList, ViewModule,
  LocalOffer, Category, TrendingFlat
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { questionsAPI } from '@/lib/api';
import { useTheme, useMediaQuery } from '@mui/material';
import RichContentViewer from '@/components/editor/RichContentViewer';
import ReactQuillViewer from '@/components/editor/ReactQuillViewer';

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
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
  { label: 'Difficulty: Easy to Hard', value: 'easy-first' },
  { label: 'Difficulty: Hard to Easy', value: 'hard-first' },
  { label: 'Most Viewed', value: 'popular' }
];

export default function QuestionsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [sortBy, setSortBy] = useState('newest');
  const [bookmarked, setBookmarked] = useState([]);
  const [stats, setStats] = useState({ total: 0, studied: 0, pending: 0 });

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchQuestions();
    // Simulate fetching user stats
    setStats({
      total: 300,
      studied: 85,
      pending: 215
    });
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
  }).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.lastReviewed) - new Date(a.lastReviewed);
      case 'oldest':
        return new Date(a.lastReviewed) - new Date(b.lastReviewed);
      case 'easy-first':
        const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      case 'hard-first':
        const difficultyOrderRev = { 'Easy': 3, 'Medium': 2, 'Hard': 1 };
        return difficultyOrderRev[a.difficulty] - difficultyOrderRev[b.difficulty];
      case 'popular':
        return b.views - a.views;
      default:
        return 0;
    }
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return '#4CAF50';
      case 'Medium': return '#FF9800';
      case 'Hard': return '#F44336';
      default: return theme.palette.text.secondary;
    }
  };

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
      case 'delete':
        if (confirm('Are you sure you want to delete this question?')) {
          // Handle delete
        }
        break;
      case 'share':
        navigator.clipboard.writeText(`${window.location.origin}/question/${question.id}`);
        break;
    }
  };

  if (loading) {
    return (
      <Container sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        flexDirection: 'column',
        gap: 3
      }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary">
          Loading your questions...
        </Typography>
      </Container>
    );
  }

  return (
    <ProtectedRoute>
      <Box sx={{
        minHeight: '100vh',
        bgcolor: theme.palette.background.default
      }}>
        <Container maxWidth="xl" sx={{
          py: { xs: 2, sm: 3, md: 4 },
          px: { xs: 1, sm: 2, md: 3 }
        }}>
          {/* Header Section */}
          <Box sx={{ mb: { xs: 3, sm: 4, md: 5 } }}>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              mb: 3
            }}>
              <Box>
                <Typography variant="h1" sx={{
                  fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' },
                  fontWeight: 800,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1
                }}>
                  Question Library
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                  Explore and manage {questions.length}+ curated interview questions
                </Typography>
              </Box>

              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => router.push('/add-question')}
                sx={{
                  px: { xs: 2, sm: 3 },
                  py: { xs: 1, sm: 1.5 },
                  borderRadius: 3,
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Add Question
              </Button>
            </Box>

            {/* Stats Overview */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4}>
                <Paper sx={{
                  p: 2,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Lightbulb sx={{ color: theme.palette.primary.main }} />
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight={800}>
                        {stats.total}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Questions
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Paper sx={{
                  p: 2,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.success.main, 0.2),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <TrendingUp sx={{ color: theme.palette.success.main }} />
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight={800}>
                        {stats.studied}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Questions Studied
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Paper sx={{
                  p: 2,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.main, 0.05)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.warning.main, 0.2),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Code sx={{ color: theme.palette.warning.main }} />
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight={800}>
                        {stats.pending}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        To Review
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          {/* Search and Filters Bar */}
          <Paper elevation={0} sx={{
            p: { xs: 2, sm: 3 },
            mb: 4,
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            background: theme.palette.background.paper
          }}>
            <Stack spacing={3}>
              <Box sx={{
                display: 'flex',
                gap: 2,
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'stretch', sm: 'center' }
              }}>
                <TextField
                  fullWidth
                  placeholder="Search questions, answers, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: theme.palette.text.secondary }} />
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: 3,
                      bgcolor: theme.palette.background.default
                    }
                  }}
                  sx={{ flex: 1 }}
                />

                <Box sx={{
                  display: 'flex',
                  gap: 1,
                  alignItems: 'center',
                  flexWrap: 'wrap'
                }}>
                  <Button
                    variant="outlined"
                    startIcon={<FilterList />}
                    onClick={() => setFilterDrawerOpen(true)}
                    sx={{
                      borderRadius: 3,
                      px: 3
                    }}
                  >
                    Filters
                  </Button>

                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <Select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      sx={{ borderRadius: 3 }}
                    >
                      {SORT_OPTIONS.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Sort fontSize="small" />
                            {option.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Box sx={{ display: 'flex', border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
                    <Tooltip title="List View">
                      <IconButton
                        onClick={() => setViewMode('list')}
                        sx={{
                          borderRadius: '8px 0 0 8px',
                          bgcolor: viewMode === 'list' ? alpha(theme.palette.primary.main, 0.1) : 'transparent'
                        }}
                      >
                        <ViewList />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Grid View">
                      <IconButton
                        onClick={() => setViewMode('grid')}
                        sx={{
                          borderRadius: '0 8px 8px 0',
                          bgcolor: viewMode === 'grid' ? alpha(theme.palette.primary.main, 0.1) : 'transparent'
                        }}
                      >
                        <ViewModule />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Box>

              {/* Active Filters */}
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                {(selectedCategory !== 'All' || selectedDifficulty !== 'All' || searchTerm) && (
                  <>
                    <Typography variant="caption" color="text.secondary">
                      Active filters:
                    </Typography>

                    {selectedCategory !== 'All' && (
                      <Chip
                        label={`Category: ${selectedCategory}`}
                        onDelete={() => setSelectedCategory('All')}
                        size="small"
                        deleteIcon={<Close />}
                        sx={{ borderRadius: 2 }}
                      />
                    )}

                    {selectedDifficulty !== 'All' && (
                      <Chip
                        label={`Difficulty: ${selectedDifficulty}`}
                        onDelete={() => setSelectedDifficulty('All')}
                        size="small"
                        deleteIcon={<Close />}
                        sx={{ borderRadius: 2 }}
                      />
                    )}

                    {searchTerm && (
                      <Chip
                        label={`Search: "${searchTerm}"`}
                        onDelete={() => setSearchTerm('')}
                        size="small"
                        deleteIcon={<Close />}
                        sx={{ borderRadius: 2 }}
                      />
                    )}

                    <Button
                      size="small"
                      onClick={() => {
                        setSelectedCategory('All');
                        setSelectedDifficulty('All');
                        setSearchTerm('');
                      }}
                      sx={{ ml: 1 }}
                    >
                      Clear All
                    </Button>
                  </>
                )}
              </Box>
            </Stack>
          </Paper>

          {/* Categories Quick Filter */}
          <Paper elevation={0} sx={{
            p: 2,
            mb: 4,
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            overflow: 'auto'
          }}>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'nowrap', pb: 1 }}>
              {CATEGORIES.map((cat) => (
                <Button
                  key={cat.label}
                  variant={selectedCategory === cat.label ? "contained" : "outlined"}
                  onClick={() => setSelectedCategory(cat.label)}
                  startIcon={cat.icon}
                  sx={{
                    borderRadius: 3,
                    whiteSpace: 'nowrap',
                    borderColor: selectedCategory === cat.label ? cat.color : undefined,
                    bgcolor: selectedCategory === cat.label ? cat.color : undefined,
                    '&:hover': {
                      bgcolor: selectedCategory === cat.label ? cat.color : alpha(cat.color, 0.1),
                      borderColor: cat.color
                    }
                  }}
                >
                  {cat.label}
                  {cat.count > 0 && (
                    <Box component="span" sx={{
                      ml: 1,
                      fontSize: '0.75rem',
                      opacity: 0.8
                    }}>
                      {cat.count}
                    </Box>
                  )}
                </Button>
              ))}
            </Stack>
          </Paper>

          {/* Results Summary */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3
          }}>
            <Typography variant="h6" fontWeight={600}>
              {filteredQuestions.length} Questions Found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Showing {Math.min(filteredQuestions.length, 10)} of {filteredQuestions.length}
            </Typography>
          </Box>

          {/* Questions Grid/List */}
          {filteredQuestions.length === 0 ? (
            <Paper sx={{
              p: 8,
              textAlign: 'center',
              borderRadius: 3,
              border: `1px dashed ${alpha(theme.palette.divider, 0.3)}`
            }}>
              <Typography variant="h2" sx={{ fontSize: '4rem', mb: 2, opacity: 0.3 }}>
                🔍
              </Typography>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No questions found
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Try adjusting your filters or adding new questions
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => router.push('/add-question')}
                sx={{ mt: 2, borderRadius: 3 }}
              >
                Add New Question
              </Button>
            </Paper>
          ) : viewMode === 'grid' ? (
            <Grid container spacing={3}>
              {filteredQuestions.slice(0, 12).map((question) => (
                <Grid item xs={12} sm={6} md={4} key={question.id}>
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
            <Stack spacing={2}>
              {filteredQuestions.slice(0, 10).map((question) => (
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

          {/* Load More Button */}
          {filteredQuestions.length > 10 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button
                variant="outlined"
                size="large"
                sx={{ borderRadius: 3, px: 4 }}
              >
                Load More Questions
              </Button>
            </Box>
          )}
        </Container>

        {/* Filter Drawer for Mobile */}
        <Drawer
          anchor="right"
          open={filterDrawerOpen}
          onClose={() => setFilterDrawerOpen(false)}
          PaperProps={{
            sx: {
              width: { xs: '100%', sm: 400 },
              p: 3
            }
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Filters</Typography>
            <IconButton onClick={() => setFilterDrawerOpen(false)}>
              <Close />
            </IconButton>
          </Box>

          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                Difficulty Level
              </Typography>
              <Stack spacing={1}>
                {DIFFICULTIES.map((diff) => (
                  <Button
                    key={diff.label}
                    fullWidth
                    variant={selectedDifficulty === diff.label ? "contained" : "outlined"}
                    onClick={() => setSelectedDifficulty(diff.label)}
                    sx={{
                      justifyContent: 'space-between',
                      borderRadius: 2,
                      borderColor: diff.color,
                      bgcolor: selectedDifficulty === diff.label ? diff.color : undefined
                    }}
                  >
                    {diff.label}
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      <Box sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: diff.color
                      }} />
                      {diff.count > 0 && (
                        <Typography variant="caption">
                          {diff.count}
                        </Typography>
                      )}
                    </Box>
                  </Button>
                ))}
              </Stack>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                Sort By
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  {SORT_OPTIONS.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                View Mode
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  fullWidth
                  variant={viewMode === 'list' ? "contained" : "outlined"}
                  onClick={() => setViewMode('list')}
                  startIcon={<ViewList />}
                  sx={{ borderRadius: 2 }}
                >
                  List
                </Button>
                <Button
                  fullWidth
                  variant={viewMode === 'grid' ? "contained" : "outlined"}
                  onClick={() => setViewMode('grid')}
                  startIcon={<ViewModule />}
                  sx={{ borderRadius: 2 }}
                >
                  Grid
                </Button>
              </Stack>
            </Box>

            <Button
              variant="contained"
              fullWidth
              onClick={() => setFilterDrawerOpen(false)}
              sx={{ mt: 2, borderRadius: 2 }}
            >
              Apply Filters
            </Button>
          </Stack>
        </Drawer>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed',
            bottom: { xs: 16, sm: 24, md: 32 },
            right: { xs: 16, sm: 24, md: 32 },
            zIndex: 1000,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            '&:hover': {
              transform: 'scale(1.1)',
              boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.4)}`
            },
            transition: 'all 0.3s ease'
          }}
          onClick={() => router.push('/add-question')}
        >
          <Add />
        </Fab>
      </Box>
    </ProtectedRoute>
  );
}

// Question Card Component
function QuestionCard({ question, expandedId, setExpandedId, isBookmarked, toggleBookmark, onAction, isMobile }) {
  const theme = useTheme();

  return (
    <Card elevation={0} sx={{
      borderRadius: 3,
      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      transition: 'all 0.3s ease',
      '&:hover': {
        borderColor: alpha(theme.palette.primary.main, 0.3),
        boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
        transform: 'translateY(-2px)'
      },
      overflow: 'hidden'
    }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 2,
          gap: 1
        }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="caption" sx={{
                fontWeight: 600,
                px: 1,
                py: 0.5,
                borderRadius: 2,
                bgcolor: alpha(getDifficultyColor(question.difficulty), 0.1),
                color: getDifficultyColor(question.difficulty)
              }}>
                {question.difficulty}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {question.views} views
              </Typography>
            </Box>

            <Typography variant="h6" sx={{
              mb: 1,
              fontSize: { xs: '0.95rem', sm: '1.1rem' },
              fontWeight: 600,
              lineHeight: 1.4
            }}>
              {question.question}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                icon={<Category fontSize="small" />}
                label={question.category}
                size="small"
                sx={{ borderRadius: 2 }}
              />
              {question.tags?.split(',').map((tag, index) => (
                <Chip
                  key={index}
                  icon={<LocalOffer fontSize="small" />}
                  label={tag.trim()}
                  size="small"
                  variant="outlined"
                  sx={{ borderRadius: 2 }}
                />
              ))}
            </Box>
          </Box>

          <IconButton
            size="small"
            onClick={() => toggleBookmark(question.id)}
            sx={{
              color: isBookmarked ? theme.palette.warning.main : theme.palette.text.secondary,
              '&:hover': {
                color: theme.palette.warning.main
              }
            }}
          >
            {isBookmarked ? <Bookmark /> : <BookmarkBorder />}
          </IconButton>
        </Box>

        <Collapse in={expandedId === question.id} timeout="auto" unmountOnExit>
          <Box sx={{
            mt: 3,
            pt: 3,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          }}>
            <ReactQuillViewer
              value={question.answer}
              elevation={0}
              showBorder={false}
              sx={{
                bgcolor: alpha(theme.palette.info.main, 0.02)
              }}
            />
          </Box>
        </Collapse>
      </CardContent>

      <CardActions sx={{
        px: { xs: 2, sm: 3 },
        pb: { xs: 2, sm: 3 },
        borderTop: expandedId === question.id ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : 'none'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Button
            size="small"
            onClick={() => setExpandedId(expandedId === question.id ? null : question.id)}
            endIcon={
              <ExpandMore
                sx={{
                  transform: expandedId === question.id ? 'rotate(180deg)' : 'none',
                  transition: '0.3s'
                }}
              />
            }
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            {expandedId === question.id ? 'Hide Answer' : 'Show Answer'}
          </Button>

          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Edit">
              <IconButton size="small" onClick={() => onAction('edit', question)}>
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share">
              <IconButton size="small" onClick={() => onAction('share', question)}>
                <Share fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CardActions>
    </Card>
  );
}

// Helper function
function getDifficultyColor(difficulty) {
  switch (difficulty) {
    case 'Easy': return '#4CAF50';
    case 'Medium': return '#FF9800';
    case 'Hard': return '#F44336';
    default: return '#666';
  }
}