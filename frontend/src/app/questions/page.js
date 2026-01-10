"use client";

import { useState, useEffect } from 'react';
import {
  Container, Typography, Box, TextField, InputAdornment, Chip, Stack, Card, CardContent, Button,
  Collapse, Fab, Paper, IconButton, Drawer, MenuItem, Select, FormControl, InputLabel,
  useTheme, alpha, CircularProgress, Tooltip, Divider
} from '@mui/material';
import {
  Search, ExpandMore, Add, FilterList, Close, Bookmark, BookmarkBorder, ViewList, ViewModule, Sort, RestartAlt
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { categoryAPI, questionsAPI } from '@/lib/api';
import ReactQuillViewer from '@/components/editor/ReactQuillViewer';
import { Slide, AppBar, Toolbar } from '@mui/material';
import useScrollTrigger from '@mui/material/useScrollTrigger';

export default function QuestionsPage() {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useAuth();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [sortBy, setSortBy] = useState('newest');
  const [bookmarked, setBookmarked] = useState([]);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [search, setSearch] = useState('');

  const [isClient, setIsClient] = useState(false);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = selectedSubCategory
        ? await questionsAPI.getBySubCategory(selectedSubCategory)
        : selectedCategory
          ? await questionsAPI.getByCategory(selectedCategory)
          : await questionsAPI.getAll();

      setQuestions(res.data);
    } catch (error) {
      console.error('Failed to load questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await categoryAPI.getAll();
      setCategories(res.data);
      if (res.data && res.data.length > 0) {
        setSelectedCategory(res.data[0].label);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  useEffect(() => {
    setIsClient(true);
    loadCategories();
  }, []);

  useEffect(() => {
    if (isClient) {
      fetchQuestions();
    }
  }, [selectedCategory, selectedSubCategory, isClient]);

  const toggleBookmark = (id) => {
    setBookmarked(prev =>
      prev.includes(id) ? prev.filter(bid => bid !== id) : [...prev, id]
    );
  };

  const clearFilters = () => {
    if (categories.length > 0) setSelectedCategory(categories[0].label);
    setSelectedSubCategory("");
    setSearch("");
  };

  // Improved filter check
  const hasFilters = search !== "" || selectedSubCategory !== "";

  if (!isClient) return null;

  return (
    <ProtectedRoute>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 10 }}>

        <StickyFilterBar
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedSubCategory={selectedSubCategory}
          setSelectedSubCategory={setSelectedSubCategory}
        />

        <Container maxWidth="xl">

          {/* Header Section */}
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h3" fontWeight={800} sx={{
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1
            }}>
              Question Bank
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Review and master your technical interview questions
            </Typography>
          </Box>

          {/* Top Control Bar */}
          <Paper
            elevation={0}
            sx={{
              p: 1.5,
              mb: 4,
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              bgcolor: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: 'blur(8px)',
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 2,
              alignItems: 'center'
            }}
          >
            <TextField
              fullWidth
              placeholder="Search by keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2, bgcolor: 'background.paper' }
              }}
              sx={{ flex: 2 }}
            />

            <Stack direction="row" spacing={1} sx={{ width: { xs: '100%', md: 'auto' }, flex: 3 }}>
              <FormControl fullWidth size="small">
                <Select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedSubCategory("");
                  }}
                  sx={{ borderRadius: 2, bgcolor: 'background.paper' }}
                >
                  {categories.map(cat => (
                    <MenuItem key={cat.id} value={cat.label}>{cat.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small" disabled={!selectedCategory}>
                <Select
                  displayEmpty
                  value={selectedSubCategory}
                  onChange={(e) => setSelectedSubCategory(e.target.value)}
                  sx={{ borderRadius: 2, bgcolor: 'background.paper' }}
                >
                  <MenuItem value="">All Topics</MenuItem>
                  {categories.find(c => c.label === selectedCategory)?.subCategories?.map((sub, i) => (
                    <MenuItem key={i} value={sub}>{sub}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />

            <Stack direction="row" spacing={1}>
              <Tooltip title="View Mode">
                <IconButton onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}>
                  {viewMode === 'list' ? <ViewModule /> : <ViewList />}
                </IconButton>
              </Tooltip>
              <IconButton onClick={() => setFilterOpen(true)}>
                <FilterList />
              </IconButton>
              {hasFilters && (
                <IconButton onClick={clearFilters} color="primary">
                  <RestartAlt />
                </IconButton>
              )}
            </Stack>
          </Paper>

          {/* Content Area */}
          <Box sx={{ position: 'relative' }}>
            {loading && questions.length === 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10 }}>
                <CircularProgress size={40} thickness={4} />
                <Typography sx={{ mt: 2 }} color="text.secondary">Fetching questions...</Typography>
              </Box>
            ) : questions.length === 0 ? (
              <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 4, border: `2px dashed ${theme.palette.divider}`, bgcolor: 'transparent' }}>
                <Typography variant="h6" color="text.secondary">No matching questions</Typography>
                <Button startIcon={<Add />} onClick={() => router.push('/add-question')} sx={{ mt: 2 }}>
                  Create New Question
                </Button>
              </Paper>
            ) : (
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: viewMode === 'grid' ? { xs: '1fr', sm: '1fr 1fr' } : '1fr',
                gap: 2
              }}>
                {questions.map((question) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    expandedId={expandedId}
                    setExpandedId={setExpandedId}
                    isBookmarked={bookmarked.includes(question.id)}
                    toggleBookmark={toggleBookmark}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Container>

        {/* Action Elements */}
        <Drawer anchor="right" open={filterOpen} onClose={() => setFilterOpen(false)} PaperProps={{ sx: { width: { xs: '100%', sm: 350 }, p: 3 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" fontWeight={700}>Preferences</Typography>
            <IconButton onClick={() => setFilterOpen(false)}><Close /></IconButton>
          </Box>

          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>Sort By</Typography>
              <FormControl fullWidth size="small">
                <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} sx={{ borderRadius: 1 }}>
                  <MenuItem value="newest">Newest First</MenuItem>
                  <MenuItem value="oldest">Oldest First</MenuItem>
                  <MenuItem value="easy-first">Easy First</MenuItem>
                  <MenuItem value="hard-first">Hard First</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>Difficulty</Typography>
              <Stack spacing={1}>
                {['All', 'Easy', 'Medium', 'Hard'].map((difficulty) => (
                  <Button key={difficulty} fullWidth variant="outlined" sx={{ justifyContent: 'flex-start', borderRadius: 1, textTransform: 'none' }}>
                    {difficulty}
                  </Button>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Drawer>

        <Fab color="primary" onClick={() => router.push('/add-question')} sx={{ position: 'fixed', bottom: 32, right: 32 }}>
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

function StickyFilterBar({
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedSubCategory,
  setSelectedSubCategory
}) {
  const theme = useTheme();

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 200,
  });

  const activeSubCategories = categories.find(c => c.label === selectedCategory)?.subCategories || [];

  return (
    <Slide appear={false} direction="down" in={trigger}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: 1099,
          bgcolor: alpha(theme.palette.background.paper, 0.9),
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar variant="dense" sx={{ minHeight: 56, gap: 2 }}>

          {/* Category Dropdown */}
          <FormControl variant="standard" size="small" sx={{ minWidth: 100, maxWidth: 200 }}>
            <Select
              disableUnderline
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubCategory(""); // Reset sub when cat changes
                window.scrollTo({ top: 0, behavior: 'smooth' }); // Optional: scroll up on change
              }}
              displayEmpty
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" fontWeight={600} color="primary">
                    {selected || "All Categories"}
                  </Typography>
                </Box>
              )}
              MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
            >
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.label}>{cat.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography color="text.secondary">/</Typography>

          {/* Sub-Category Dropdown */}
          <FormControl variant="standard" size="small" sx={{ minWidth: 120, maxWidth: 200 }} disabled={!selectedCategory}>
            <Select
              disableUnderline
              value={selectedSubCategory}
              onChange={(e) => {
                setSelectedSubCategory(e.target.value);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              displayEmpty
              renderValue={(selected) => (
                <Typography variant="body2" fontWeight={600}>
                  {selected || "All Topics"}
                </Typography>
              )}
              MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
            >
              <MenuItem value="">All Topics</MenuItem>
              {activeSubCategories.map((sub, index) => (
                <MenuItem key={index} value={sub}>{sub}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* "Back to Top" shortcut on the far right */}
          <Box sx={{ flexGrow: 1 }} />
          <Button
            size="small"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            sx={{ minWidth: 'auto', color: 'text.secondary' }}
          >
            Top
          </Button>

        </Toolbar>
      </AppBar>
    </Slide>
  );
}

function getDifficultyColor(difficulty) {
  const colors = {
    'Easy': '#10B981',
    'Medium': '#F59E0B',
    'Hard': '#EF4444'
  };
  return colors[difficulty] || '#6B7280';
}