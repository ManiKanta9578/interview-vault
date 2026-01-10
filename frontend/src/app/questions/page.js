"use client";

import { useState, useEffect } from 'react';
import {
  Container, Typography, Box, TextField, InputAdornment, Chip, Stack, Card, CardContent, Button,
  Collapse, Fab, Paper, IconButton, Drawer, MenuItem, Select, FormControl,
  useTheme, alpha, CircularProgress, Tooltip, Divider, LinearProgress
} from '@mui/material';
import {
  Search, ExpandMore, Add, FilterList, Close, Bookmark, BookmarkBorder,
  ViewList, ViewModule, Sort, RestartAlt, Terminal, Code, BugReport,
  Storage, PlayArrow, KeyboardArrowRight
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

  const hasFilters = search !== "" || selectedSubCategory !== "";

  if (!isClient) return null;

  return (
    <ProtectedRoute>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 10, position: 'relative' }}>

        {/* Background Grid (Matches other pages) */}
        <Box sx={{
          position: 'fixed', inset: 0, zIndex: 0, opacity: 0.3, pointerEvents: 'none',
          backgroundImage: `linear-gradient(${alpha(theme.palette.text.primary, 0.05)} 1px, transparent 1px), linear-gradient(90deg, ${alpha(theme.palette.text.primary, 0.05)} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />

        <StickyFilterBar
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedSubCategory={selectedSubCategory}
          setSelectedSubCategory={setSelectedSubCategory}
        />

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>

          {/* Header Section */}
          <Box sx={{ mb: 4, mt: 4, textAlign: 'center' }}>
            <Typography variant="h3" sx={{
              fontFamily: 'monospace',
              fontWeight: 700,
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2
            }}>
              <Terminal sx={{ fontSize: 40, color: theme.palette.primary.main }} />
              <Box component="span" sx={{ color: theme.palette.text.primary }}>Question_Bank</Box>
              <Box component="span" sx={{
                width: 12, height: 24,
                bgcolor: theme.palette.primary.main,
                animation: 'cursor 1s infinite'
              }} />
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
              // Select a module below to begin debugging your knowledge
            </Typography>
          </Box>

          {/* Top Control Bar - "IDE Toolbar" Style */}
          <Paper
            elevation={0}
            sx={{
              p: 1.5,
              mb: 4,
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              bgcolor: alpha(theme.palette.background.paper, 0.6),
              backdropFilter: 'blur(12px)',
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 2,
              alignItems: 'center'
            }}
          >
            <TextField
              fullWidth
              placeholder="grep 'search_query'..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography sx={{ color: 'primary.main', fontWeight: 700, mr: 1 }}>$</Typography>
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 1,
                  fontFamily: 'monospace',
                  bgcolor: alpha(theme.palette.background.default, 0.5)
                }
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
                  sx={{ borderRadius: 1, bgcolor: alpha(theme.palette.background.default, 0.5), fontFamily: 'monospace' }}
                  displayEmpty
                >
                  <MenuItem value="" disabled><em>Select Module</em></MenuItem>
                  {categories.map(cat => (
                    <MenuItem key={cat.id} value={cat.label} sx={{ fontFamily: 'monospace' }}>{cat.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small" disabled={!selectedCategory}>
                <Select
                  displayEmpty
                  value={selectedSubCategory}
                  onChange={(e) => setSelectedSubCategory(e.target.value)}
                  sx={{ borderRadius: 1, bgcolor: alpha(theme.palette.background.default, 0.5), fontFamily: 'monospace' }}
                >
                  <MenuItem value="" sx={{ fontFamily: 'monospace' }}>* (All)</MenuItem>
                  {categories.find(c => c.label === selectedCategory)?.subCategories?.map((sub, i) => (
                    <MenuItem key={i} value={sub} sx={{ fontFamily: 'monospace' }}>{sub}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' }, bgcolor: alpha(theme.palette.divider, 0.2) }} />

            <Stack direction="row" spacing={1}>
              <Tooltip title="View Mode">
                <IconButton
                  onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                  sx={{ border: `1px solid ${alpha(theme.palette.divider, 0.2)}`, borderRadius: 1 }}
                >
                  {viewMode === 'list' ? <ViewModule /> : <ViewList />}
                </IconButton>
              </Tooltip>
              <IconButton
                onClick={() => setFilterOpen(true)}
                sx={{ border: `1px solid ${alpha(theme.palette.divider, 0.2)}`, borderRadius: 1 }}
              >
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
                <CircularProgress size={40} thickness={4} sx={{ color: theme.palette.primary.main }} />
                <Typography sx={{ mt: 2, fontFamily: 'monospace' }} color="text.secondary">Loading resources...</Typography>
              </Box>
            ) : questions.length === 0 ? (
              <Paper sx={{
                p: 8, textAlign: 'center', borderRadius: 2,
                border: `1px dashed ${theme.palette.divider}`,
                bgcolor: alpha(theme.palette.background.paper, 0.3)
              }}>
                <Typography variant="h6" color="text.secondary" sx={{ fontFamily: 'monospace', mb: 2 }}>
                  404: No Questions Found
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => router.push('/add-question')}
                  sx={{ fontFamily: 'monospace', textTransform: 'none' }}
                >
                  git commit -m "new question"
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

        {/* Filter Drawer */}
        <Drawer anchor="right" open={filterOpen} onClose={() => setFilterOpen(false)} PaperProps={{ sx: { width: { xs: '100%', sm: 350 }, p: 3, bgcolor: 'background.paper' } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontFamily: 'monospace', fontWeight: 700 }}>.config</Typography>
            <IconButton onClick={() => setFilterOpen(false)}><Close /></IconButton>
          </Box>

          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontFamily: 'monospace', mb: 1, color: 'text.secondary' }}>SORT_BY</Typography>
              <FormControl fullWidth size="small">
                <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} sx={{ borderRadius: 1, fontFamily: 'monospace' }}>
                  <MenuItem value="newest">created_at (desc)</MenuItem>
                  <MenuItem value="oldest">created_at (asc)</MenuItem>
                  <MenuItem value="easy-first">difficulty (easy)</MenuItem>
                  <MenuItem value="hard-first">difficulty (hard)</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontFamily: 'monospace', mb: 1, color: 'text.secondary' }}>DIFFICULTY_LEVEL</Typography>
              <Stack spacing={1}>
                {['All', 'Easy', 'Medium', 'Hard'].map((difficulty) => (
                  <Button
                    key={difficulty}
                    fullWidth
                    variant="outlined"
                    sx={{
                      justifyContent: 'flex-start',
                      borderRadius: 1,
                      textTransform: 'none',
                      fontFamily: 'monospace',
                      borderColor: alpha(theme.palette.divider, 0.2)
                    }}
                  >
                    {difficulty === 'All' ? '*' : difficulty}
                  </Button>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Drawer>

        <Fab
          color="primary"
          onClick={() => router.push('/add-question')}
          sx={{ position: 'fixed', bottom: 32, right: 32, borderRadius: 2 }}
        >
          <Add />
        </Fab>
      </Box>

      <style jsx global>{`
        @keyframes cursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </ProtectedRoute>
  );
}

// ----------------------------------------------------------------------
// QuestionCard: Code Snippet Style
// ----------------------------------------------------------------------
function QuestionCard({ question, expandedId, setExpandedId, isBookmarked, toggleBookmark, onAction, isMobile }) {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        bgcolor: alpha(theme.palette.background.paper, 0.6),
        backdropFilter: 'blur(12px)',
        transition: 'all 0.2s',
        '&:hover': {
          borderColor: alpha(theme.palette.primary.main, 0.5),
          transform: 'translateY(-2px)',
          boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.2)}`
        }
      }}
    >
      <CardContent sx={{ p: 2 }}>
        {/* Header: Badge & Category */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}
          onClick={() => setExpandedId(expandedId === question.id ? null : question.id)}
        >
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              label={question.difficulty.toUpperCase()}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.65rem',
                borderRadius: 0.5,
                fontFamily: 'monospace',
                fontWeight: 700,
                bgcolor: alpha(getDifficultyColor(question.difficulty), 0.1),
                color: getDifficultyColor(question.difficulty),
                border: `1px solid ${alpha(getDifficultyColor(question.difficulty), 0.2)}`
              }}
            />
            <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
              {question.category}
            </Typography>
          </Box>
          <Box>
            <Tooltip title={isBookmarked ? "Remove Bookmark" : "Save Question"}>
              <IconButton size="small" onClick={() => toggleBookmark(question.id)} sx={{ p: 0 }}>
                {isBookmarked ? <Bookmark fontSize="small" color="primary" /> : <BookmarkBorder fontSize="small" sx={{ color: 'text.disabled' }} />}
              </IconButton>
            </Tooltip>

            {/* Footer Actions */}
            <Button
              size="small"
              onClick={() => setExpandedId(expandedId === question.id ? null : question.id)}
              endIcon={
                <ExpandMore sx={{
                  transform: expandedId === question.id ? 'rotate(180deg)' : 'none',
                  transition: '0.2s',
                }} />
              }
            >
              {/* {expandedId === question.id ? 'Hide Solution' : 'View Solution'} */}
            </Button>
          </Box>
        </Box>

        {/* Question Text */}
        <Typography
          variant="body1"
          sx={{
            fontWeight: 500,
            lineHeight: 1,
            fontSize: '0.95rem',
            fontFamily: 'monospace', // Code-like font for question
            color: 'text.primary'
          }}
        >
          <Box component="span" sx={{ color: 'primary.main', mr: 1 }}>{">"}</Box>
          {question.question}
        </Typography>
      </CardContent>

      {/* Answer Area - Markdown Block Style */}
      <Collapse in={expandedId === question.id} timeout="auto" unmountOnExit>
        <Box sx={{
          p: 2,
          bgcolor: alpha(theme.palette.background.default, 0.5),
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          fontFamily: 'monospace' // Ensure answer renders nicely
        }}>
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
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 200 });
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
        <Toolbar variant="dense" sx={{ minHeight: 48, gap: 2 }}>
          {/* Use standard text for sticky bar to save space, but monospace font */}
          <FormControl variant="standard" size="small" sx={{ minWidth: 100, maxWidth: 200 }}>
            <Select
              disableUnderline
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubCategory("");
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              displayEmpty
              renderValue={(selected) => (
                <Typography variant="body2" fontWeight={600} color="primary" sx={{ fontFamily: 'monospace' }}>
                  {selected || "All Categories"}
                </Typography>
              )}
              MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
            >
              <MenuItem value=""><em>All Categories</em></MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.label} sx={{ fontFamily: 'monospace' }}>{cat.label}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography color="text.secondary" sx={{ fontFamily: 'monospace' }}>/</Typography>

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
                <Typography variant="body2" fontWeight={600} sx={{ fontFamily: 'monospace' }}>
                  {selected || "All Topics"}
                </Typography>
              )}
              MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
            >
              <MenuItem value="">All Topics</MenuItem>
              {activeSubCategories.map((sub, index) => (
                <MenuItem key={index} value={sub} sx={{ fontFamily: 'monospace' }}>{sub}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ flexGrow: 1 }} />
          <Button
            size="small"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            sx={{ minWidth: 'auto', color: 'text.secondary', fontFamily: 'monospace' }}
          >
            top()
          </Button>
        </Toolbar>
      </AppBar>
    </Slide>
  );
}

function getDifficultyColor(difficulty) {
  const colors = {
    'Easy': '#10B981',   // Success Green
    'Medium': '#F59E0B', // Warning Yellow
    'Hard': '#EF4444'    // Error Red
  };
  return colors[difficulty] || '#6B7280';
}